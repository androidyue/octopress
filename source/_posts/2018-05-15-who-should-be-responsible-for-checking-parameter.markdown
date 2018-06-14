---
layout: post
title: "谁来检查方法参数合法性"
date: 2018-05-15 21:31
comments: true
categories: 编程
---

我们在编程中的函数或者是方法，大多数都是有参数的。参数对于方法来说是很重要的输入数据，传入的参数值的合法性影响着方法的稳定性，严重时甚至可能导致崩溃问题的出现。

<!--more-->

比如这段代码
```java
public static void main(String[] args) {
   Book book = null;
   new Main().buy(book);
}


public void buy(Book book) {
   System.out.println(book.getPrice());
}

```

上面的代码在执行起来会导致空指针异常，其实解决起来也挺简单，就是做一些非空的检查，比如这样,在调用处进行校验
```java
public static void main(String[] args) {
   Book book = null;
   if (book != null) {
       new Main().buy(book);
   }
}
```

或者是这样在方法定义的时候处理
```java
public void buy(Book book) {
   if (book != null) {
       System.out.println(book.getPrice());
   }
}
```
就这个案例而言，两者都可以，但是有没有什么规范呢

其实还是有一些约定的
如果方法是public,protected等这样被外部可调用的时候，方法定义时需要进行值的合法性检验，因为无法确保外部始终传递合法的参数值。
对于内部的private等可见性等，则不是必需的，因为内部调用相对是可控更高的。


除此之外，我们在JavaDoc注释也需要同步跟进，比如
```java
/**
* bub a book
* @param book could be null
*/

public void buy(Book book) {
   if (book != null) {
       System.out.println(book.getPrice());
   }
}

```

我们通过增加`@param book could be null`就可以告诉调用者，不用做合法性检查，方法内部已经处理了。这种方式对开发者还是比较友善的。此外我们也可以使用@Nullable或者@NonNull来表明当前参数的检查职责归属。

至此我们也理清了检查方法参数合法性的责任归属，欢迎评论交流。
