---
layout: post
title: "Java Get Full Exception StackTrace"
date: 2013-11-09 10:53
comments: true
categories: Java Exception Error Throwable StackTrace Crash
---
As a coder, I am always handling exceptions or errors,or in a word throwables. To impove the release build, I need to collect every throwable information.  
And I need to get the information as string and post it to the Bug Collect Server. Now here is an easy trick to get stacktrace from a Throwable  
```java 
private String getStackTrace(Throwable t) {

    final Writer result = new StringWriter();
    final PrintWriter printWriter = new PrintWriter(result);
    t.printStackTrace(printWriter);
    return result.toString();
}
```


###Others
  * <a href="http://www.amazon.com/gp/product/B00BG9FGFI/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B00BG9FGFI&linkCode=as2&tag=droidyueblog-20&linkId=LFXW6DJFU7CCZJ2Z">Java Exception Handling</a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=droidyueblog-20&l=as2&o=1&a=B00BG9FGFI" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

