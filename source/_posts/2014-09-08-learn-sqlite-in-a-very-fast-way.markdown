---
layout: post
title: "十分钟掌握SQLite操作"
date: 2014-09-08 20:45
comments: true
categories: SQLite
---

最近用Ruby写了一个七牛的demo参赛作品，使用了sqlite3，用到很多操作，利用假期的时间，简单做一个快速掌握SQLite命令的小入门。

SQLite是一个开放源代码的数据库引擎，具有独立，无服务器依赖，零配置，支持事务等特点。SQLite一直以轻量级为特点，在移动和嵌入式设备上使用广泛，官方称其是世界上部署最广泛的数据库引擎。
<!--more-->

本文主要侧重部分常用操作命令的介绍。试图以最简单的示例来展示如何操作。
##强大的命令集
首先我们看一下sqlite3提供了哪些强大的命令。

```bash fileos:false
sqlite> .help
.backup ?DB? FILE      Backup DB (default "main") to FILE
.bail ON|OFF           Stop after hitting an error.  Default OFF
.databases             List names and files of attached databases
.dump ?TABLE? ...      Dump the database in an SQL text format
                         If TABLE specified, only dump tables matching
                         LIKE pattern TABLE.
.echo ON|OFF           Turn command echo on or off
.exit                  Exit this program
.explain ?ON|OFF?      Turn output mode suitable for EXPLAIN on or off.
                         With no args, it turns EXPLAIN on.
.header(s) ON|OFF      Turn display of headers on or off
.help                  Show this message
.import FILE TABLE     Import data from FILE into TABLE
.indices ?TABLE?       Show names of all indices
                         If TABLE specified, only show indices for tables
                         matching LIKE pattern TABLE.
.load FILE ?ENTRY?     Load an extension library
.log FILE|off          Turn logging on or off.  FILE can be stderr/stdout
.mode MODE ?TABLE?     Set output mode where MODE is one of:
                         csv      Comma-separated values
                         column   Left-aligned columns.  (See .width)
                         html     HTML <table> code
                         insert   SQL insert statements for TABLE
                         line     One value per line
                         list     Values delimited by .separator string
                         tabs     Tab-separated values
                         tcl      TCL list elements
.nullvalue STRING      Print STRING in place of NULL values
.output FILENAME       Send output to FILENAME
.output stdout         Send output to the screen
.prompt MAIN CONTINUE  Replace the standard prompts
.quit                  Exit this program
.read FILENAME         Execute SQL in FILENAME
.restore ?DB? FILE     Restore content of DB (default "main") from FILE
.schema ?TABLE?        Show the CREATE statements
                         If TABLE specified, only show tables matching
                         LIKE pattern TABLE.
.separator STRING      Change separator used by output mode and .import
.show                  Show the current values for various settings
.stats ON|OFF          Turn stats on or off
.tables ?TABLE?        List names of tables
                         If TABLE specified, only list tables matching
                         LIKE pattern TABLE.
.timeout MS            Try opening locked tables for MS milliseconds
.vfsname ?AUX?         Print the name of the VFS stack
.width NUM1 NUM2 ...   Set column widths for "column" mode
.timer ON|OFF          Turn the CPU timer measurement on or off
sqlite> 
```
##以"."开始的命令规则
看到了上面的全部命令，可以观察到，所有的命令都是以"."开始的。而常用的SQL语句是格式自由的，并且可以跨越多行，空白字符（whitespace）和注释可以出现在任何地方。而SQLite中以.开始的命令有更多的限制，具体如下

  * 所有命令以 **.** 开始，并且 **.** 的左侧不包含任何空白字符
  * 所有命令必须全部包含在一行输入行中
  * 所有命令不能出现在SQL语句之中
  * 命令不识别注释

##常用操作
###创建一个数据库文件

```bash fileos:false
#找一个不存在的文件
09:35:16-androidyue/tmp$ cat test.db
cat: test.db: No such file or directory

#使用sqlite3 想要创建的数据库文件
09:35:28-androidyue/tmp$ sqlite3 test.db

#进入sqlite，执行建表语句
sqlite> CREATE TABLE qn_uploaded(filePath VARCHAR(255), bucket VARCHAR(63),  lastModified FLOAT);
#退出SQLite
sqlite> .exit

#查看指定的文件，创建成功
09:42:26-androidyue/tmp$ cat test.db
09:44:45-androidyue/tmp$ dedqn_uploadedCREATE TABLE qn_uploaded(filePath VARCHAR(255), bucket VARCHAR(63),  lastModified FLOAT)
```

###打开已存在的数据库文件

```bash fileos:false
22:56:15-androidyue~ $ sqlite3 database_file.db 
```

###查看数据库

```bash fileos:false
sqlite> .databases
seq  name             file                                                      
---  ---------------  ----------------------------------------------------------
0    main             /home/androidyue/qiniu/.qiniu.db      
1    temp   
```

###查看数据表

```bash fileos:false
sqlite> .tables
qn_uploaded
```

###查看建表语句

```bash fileos:false
sqlite> .schema qn_uploaded
CREATE TABLE qn_uploaded(filePath VARCHAR(255), bucket VARCHAR(63),  lastModified FLOAT);
```

###显示字段名称

```bash fileos:false
#没有开启
sqlite> select * from qn_uploaded;
/home/androidyue/Documents/octopress/public//images/email.png|droidyue|1410096518.43964

#开启之后
sqlite> .header on
sqlite> select * from qn_uploaded;
filePath|bucket|lastModified
/home/androidyue/Documents/octopress/public//images/email.png|droidyue|1410096518.43964

```


###导出数据表结构和数据(文本形式)

```bash fileos:false
sqlite> .dump qn_uploaded
PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE qn_uploaded(filePath VARCHAR(255), bucket VARCHAR(63),  lastModified FLOAT);
INSERT INTO "qn_uploaded" VALUES('/home/androidyue/Documents/octopress/public/images/dotted-border.png','droidyue',1410096552.54864);
COMMIT;
```

##调整输出
sqlite3程序可以使用八种不同的格式显示结果。 这些格式是"csv", "column", "html", "insert", "line", "list", "tabs", and "tcl". 你可以使用**.mode**命令来进行切换输出格式

默认的输出模式list，使用了list模式，每条查询结果记录都会输出到一行，每一列使用一个分割符分割，默认的分割符是 "**|**"，list模式有一个常用的使用情况，就是当你想对查询结果记性额外处理（比如AWK处理）时，会事半功倍。 
###列表模式输出

```bash fileos:false
sqlite> select * from qn_uploaded;
/home/androidyue/Documents/octopress/public//images/email.png|droidyue|1410096518.43964
```

###修改列表模式分割符

```bash fileos:false
sqlite> .separator ", "
sqlite> select * from qn_uploaded;
/home/androidyue/Documents/octopress/public//images/email.png, droidyue, 1410096518.43964
```

###使用Line模式
每行的输出格式为 `字段名 =  字段值`

```bash fileos:false
sqlite> .mode line
sqlite> select * from qn_uploaded;
    filePath = /home/androidyue/Documents/octopress/public//images/email.png
      bucket = droidyue
lastModified = 1410096518.43964
```

###使用列模式

```bash fileos:false
sqlite> .mode column
sqlite> select * from qn_uploaded;
/home/androidyue/Documents/octopress/public//images/email.png  droidyue    1410096518.43964
/home/androidyue/Documents/octopress/public/images/rss.png     droidyue    1410096552.54764
```

##输出内容
###输出结果
默认情况下，所有的查询结果都是都是作为标准的输出展示。使用.output可以将输出结果定向到文件中。

```bash fileos:false
sqlite> .output /tmp/test.txt
sqlite> select * from qn_uploaded;
sqlite> .exit
17:48:54-androidyue~/Documents/octopress/qiniu (master)$ cat /tmp/test.txt 
file  bucket         last
----  -------------  ----
/home/androidyue/Documents/octopress/public//images/email.png  droidyue       1410096518.43964
/home/androidyue/Documents/octopress/public/images/rss.png  droidyue       1410096552.54764
```


##备份和恢复
###备份

```bash fileos:false
#语法 .backup ?DB? FILE      Backup DB (default "main") to FILE
sqlite> .backup main /tmp/main.txt
```

###恢复

```bash fileos:false
#语法.restore ?DB? FILE     Restore content of DB (default "main") from FILE
.restore main  /tmp/main.txt 
```

###其他
  *  <a href="http://www.amazon.cn/gp/product/B00COG3W58/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00COG3W58&linkCode=as2&tag=droidyue-23">SQL必知必会</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00COG3W58" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B006K2EHL0/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B006K2EHL0&linkCode=as2&tag=droidyue-23">SQLite权威指南</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B006K2EHL0" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00457W5DO/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00457W5DO&linkCode=as2&tag=droidyue-23">揭示facebook上市背后的秘密</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00457W5DO" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
