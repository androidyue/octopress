---
layout: post
title: "Dump Table Structure in SQLite3"
date: 2013-11-17 17:24
comments: true
categories: SQLite3 Table Structure
---
Best answer to the question  
Use *PRAGMA table_info*

>This pragma returns one row for each column in the named table. Columns in the result set include the column name, data type, whether or not the column can be NULL, and the default value for the column. The "pk" column in the result set is zero for columns that are not part of the primary key, and is the index of the column in the primary key for columns that are part of the primary key.

Reference:[http://www.sqlite.org/pragma.html#pragma_table_info](http://www.sqlite.org/pragma.html#pragma_table_info)  
```
sqlite> .header on
sqlite> PRAGMA table_info(password);
cid|name|type|notnull|dflt_value|pk
0|_id|INTEGER|0||1
1|host|TEXT|0||0
2|username|TEXT|0||0
3|password|TEXT|0||0
#password is the name of a table.
```

Another answer may also work  
*.schema [tablename]* will show the CREATE statement(s) for a table or tables
```
sqlite> .schema password
CREATE TABLE password (_id INTEGER PRIMARY KEY, host TEXT, username TEXT, password TEXT, UNIQUE (host, username) ON CONFLICT REPLACE);
```




###Others
  * <a href="http://www.amazon.com/gp/product/1783282959/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1783282959&linkCode=as2&tag=droidyueblog-20&linkId=TPOZ7GFB2PYVAKUQ">Android SQLite Essentials</a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=droidyueblog-20&l=as2&o=1&a=1783282959" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

