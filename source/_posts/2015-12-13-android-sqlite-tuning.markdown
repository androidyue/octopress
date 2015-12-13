---
layout: post
title: "Android 中 SQLite 性能优化"
date: 2015-12-13 17:38
comments: true
categories: Android
---
数据库是应用开发中常用的技术，在Android应用中也不例外。Android默认使用了SQLite数据库，在应用程序开发中，我们使用最多的无外乎增删改查。纵使操作简单，也有可能出现查找数据缓慢，插入数据耗时等情况，如果出现了这种问题，我们就需要考虑对数据库操作进行优化了。本文将介绍一些实用的数据库优化操作，希望可以帮助大家更好地在开发过程中使用数据库。
<!--more-->
##建立索引
很多时候，我们都听说，想要查找快速就建立索引。这句话没错，数据表的索引类似于字典中的拼音索引或者部首索引。

###索引的解释
重温一下我们小时候查字典的过程：

  * 对于已经知道拼音的字，比如`中`这个字，我们只需要在拼音索引里面找到`zhong`，就可以确定这个字在词典中的页码。
  * 对于不知道拼音的字，比如`欗`这个字，我们只需要在部首索引里面查找这个字，就能找到确定这个字在词典中的页码。

没错，索引做的事情就是这么简单，使得我们不需要查找整个数据表就可以实现快速访问。

###建立索引
创建索引的基本语法如下
```
CREATE INDEX index_name ON table_name;
```

创建单列索引
```
CREATE INDEX index_name ON table_name (column_name);
```

###索引真的好么
毋庸置疑，索引加速了我们检索数据表的速度。然而正如西方谚语 "There are two sides of a coin"，索引亦有缺点：

  * 对于增加，更新和删除来说，使用了索引会变慢，比如你想要删除字典中的一个字，那么你同时也需要删除这个字在拼音索引和部首索引中的信息。
  * 建立索引会增加数据库的大小，比如字典中的拼音索引和部首索引实际上是会增加字典的页数，让字典变厚的。
  * 为数据量比较小的表建立索引，往往会事倍功半。

所以使用索引需要考虑实际情况进行利弊权衡，对于查询操作量级较大，业务对要求查询要求较高的，还是推荐使用索引的。

##编译SQL语句
SQLite想要执行操作，需要将程序中的sql语句编译成对应的SQLiteStatement，比如`select * from record`这一句，被执行100次就需要编译100次。对于批量处理插入或者更新的操作，我们可以使用显式编译来做到重用SQLiteStatement。

想要做到重用SQLiteStatement也比较简单，基本如下：

  * 编译sql语句获得SQLiteStatement对象，参数使用`?`代替
  * 在循环中对SQLiteStatement对象进行具体数据绑定，bind方法中的index从1开始，不是0

请参考如下简单的使用代码
```java
private void insertWithPreCompiledStatement(SQLiteDatabase db) {
    String sql = "INSERT INTO " + TableDefine.TABLE_RECORD + "( " + TableDefine.COLUMN_INSERT_TIME + ") VALUES(?)";
    SQLiteStatement  statement = db.compileStatement(sql);
    int count = 0;
    while (count < 100) {
        count++;
        statement.clearBindings();
        statement.bindLong(1, System.currentTimeMillis());
        statement.executeInsert();
    }
}
```

##显式使用事务
在Android中，无论是使用SQLiteDatabase的insert,delete等方法还是execSQL都开启了事务，来确保每一次操作都具有原子性，使得结果要么是操作之后的正确结果，要么是操作之前的结果。

然而事务的实现是依赖于名为rollback journal文件，借助这个临时文件来完成原子操作和回滚功能。既然属于文件，就符合Unix的文件范型(Open-Read/Write-Close)，因而对于批量的修改操作会出现反复打开文件读写再关闭的操作。然而好在，我们可以显式使用事务，将批量的数据库更新带来的journal文件打开关闭降低到1次。

具体的实现代码如下：

```java
private void insertWithTransaction(SQLiteDatabase db) {
    int count = 0;
    ContentValues values = new ContentValues();
    try {
        db.beginTransaction();
        while (count++ < 100) {
            values.put(TableDefine.COLUMN_INSERT_TIME, System.currentTimeMillis());
            db.insert(TableDefine.TABLE_RECORD, null, values);
        }
       	db.setTransactionSuccessful();
    } catch (Exception e) {
        e.printStackTrace();
    } finally {
        db.endTransaction();
    }
}
```

上面的代码中，如果没有异常抛出，我们则认为事务成功，调用`db.setTransactionSuccessful();`确保操作真实生效。如果在此过程中出现异常，则批量数据一条也不会插入现有的表中。


##查询数据优化
对于查询的优化，除了建立索引以外，有以下几点微优化的建议

###按需获取数据列信息
通常情况下，我们处于自己省时省力的目的，对于查找使用类似这样的代码
```java
private void badQuery(SQLiteDatabase db) {
    db.query(TableDefine.TABLE_RECORD, null, null, null, null, null, null) ;
}
```
其中上面方法的第二个参数类型为String[]，意思是返回结果参考的colum信息，传递null表明需要获取全部的column数据。这里建议大家传递真实需要的字符串数据对象表明需要的列信息，这样做效率会有所提升。

###提前获取列索引
当我们需要遍历cursor时，我们通常的做法是这样
```java
private void badQueryWithLoop(SQLiteDatabase db) {
    Cursor cursor = db.query(TableDefine.TABLE_RECORD, new String[]{TableDefine.COLUMN_INSERT_TIME}, null, null, null, null, null) ;
    while (cursor.moveToNext()) {
        long insertTime = cursor.getLong(cursor.getColumnIndex(TableDefine.COLUMN_INSERT_TIME));
    }
}
```
但是如果我们将获取ColumnIndex的操作提到循环之外，效果会更好一些，修改后的代码如下：
```java
private void goodQueryWithLoop(SQLiteDatabase db) {
    Cursor cursor = db.query(TableDefine.TABLE_RECORD, new String[]{TableDefine.COLUMN_INSERT_TIME}, null, null, null, null, null) ;
    int insertTimeColumnIndex = cursor.getColumnIndex(TableDefine.COLUMN_INSERT_TIME);
    while (cursor.moveToNext()) {
        long insertTime = cursor.getLong(insertTimeColumnIndex);
    }
    cursor.close();
}
```
##ContentValues的容量调整
SQLiteDatabase提供了方便的ContentValues简化了我们处理列名与值的映射，ContentValues内部采用了HashMap来存储Key-Value数据，ContentValues的初始容量是8，如果当添加的数据超过8之前，则会进行双倍扩容操作，因此建议对ContentValues填入的内容进行估量，设置合理的初始化容量，减少不必要的内部扩容操作。

##及时关闭Cursor
使用数据库，比较常见的就是忘记关闭Cursor。关于如何发现未关闭的Cursor，我们可以使用StrictMode，详细请戳这里[Android性能调优利器StrictMode](http://droidyue.com/blog/2015/09/26/android-tuning-tool-strictmode/)


##耗时异步化
数据库的操作，属于本地IO，通常比较耗时，如果处理不好，很容易导致[ANR](http://droidyue.com/blog/2015/07/18/anr-in-android/),因此建议将这些耗时操作放入异步线程中处理，这里推荐一个单线程 + 任务队列形式处理的[HandlerThread](http://droidyue.com/blog/2015/11/08/make-use-of-handlerthread/)实现异步化。

##源码下载
示例源码，存放在Github，地址为[AndroidSQLiteTuningDemo](https://github.com/androidyue/AndroidSQLiteTuningDemo)
