---
layout: post
title: "聊一聊SLAP:单一抽象层级原则"
date: 2019-03-17 20:52
comments: true
categories: CleanCode Abstraction
---

作为程序员，我们总是和方法打交道，不知不觉都会接触Long method(方法体较长的方法)，不论是自己写的还是他人写的，而Long method(长方法)往往是问题的体现，代表着代码有一种坏的味道，也意味着需要对这段代码进行重构处理。

<!--more-->

长方法的问题通常表现在

  * 可读性很差
  * 复用性差
  * 难以调试
  * 难以维护
  * 冗余代码多


既然长方法不好，那么我们就应该写short method(短方法)，但是什么样的方法才算短方法呢，有什么衡量呢？


## 行数限定
首先我们想到的可能是限制方法的行数，是的，有人说是20行为宜，有人说是10行最佳，众说纷纭，无一定论。

但是行数限定也有问题
  
  * 没有具体的行数限定
  * 行数限定如果执行，可能会比较死板


显然除了行数之外，我们需要一个更加明确无争议的避免长方法产生的方法，比如今天我们提到的 SLAP（单一抽象层原则）。


## 定义 
SLAP 是 Single Level of Abstraction 的缩写。

关于SLAP的一些具体解释
> 指定代码块的代码应该在单一的抽象层上。

其实关于定义最难理解的应该是抽象层，其原因可能在于

  * 我们接受着各种非黑即白，非善既恶的教育和熏陶
  * 对事物做抽象化，不是一下子达到另一个极端的抽象描述。
  * 抽象可以是循序渐进，分层的。


举一个最简单的例子，在中学时期我们学习英语，大概听过一个这样类似的短句"美小圆旧黄法国木书房",这是为了辅助在英语中快速排列定语顺序的记忆技巧总结。

在英语（或其他语言）中
  
  * 对名词主体增加定语(名词，形容词)修饰，使得主体更加具体
  * 反之对主体删除定语（名词，形容词），会使得主体更加抽象

比如我们对“美小圆旧黄法国木书房” 逐步删除定语，大致会产生这样的抽象层

  1. 美小圆法国木书房
  2. 旧黄法国木书房
  3. 法国木书房
  4. 法国书房
  5. 书房
  6. 房

我们回归编码，来看一个例子
```java
    private boolean validateUser(User user) {

        //检测邮箱是否合法
        String ePattern = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$";
        java.util.regex.Pattern p = java.util.regex.Pattern.compile(ePattern);
        java.util.regex.Matcher m = p.matcher(user.email);
        if (!m.matches()) {
            return false;
        }

        //检测密码是否合法
        if (user.password.length() < 8) {
            return false;
        } else {
            for (char c : user.password.toCharArray()) {
                if (!Character.isLetterOrDigit(c)) {
                    return false;
                }
            }
        }

        //return true if it goes here.
        return true;
    }
```

上面的代码

  * validateUser 方法用来校验用户的合法性
  * 方法体的前6行代码做的事情是校验用户的email地址是否合法
  * 方法体的后几行的代码，用来校验用户的密码是否合法


上面代码存在的问题是

  * validateUser 方法中暴露了校验email和密码的具体实现
  * validateUser 应该只关心校验email和密码的抽象（第一层抽象），而不是具体实现（第二层抽象）
  * 很明显validateUser 违背了SLAP原则

解决方法

  * 将违背SLAP原则的代码做提取，形成独立的方法



所以按照SLAP原则修改之后的代码应该类似于
```java
public class UserValidator {
    public static final String EMAIL_REGULAR_EXPRESSION = "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$";

    public static boolean validateEmail(String email) {
        Pattern p = Pattern.compile(EMAIL_REGULAR_EXPRESSION);
        return p.matcher(email).matches();
    }

    public static boolean validatePassword(String password) {
        if (password.length() < 8) {
            return false;
        } else {
            for (char c : password.toCharArray()) {
                if (!Character.isLetterOrDigit(c)) {
                    return false;
                }
            }
        }
        return true;
    }
}

private boolean validateUserSLAP(User user) {
    return UserValidator.validateEmail(user.email) && UserValidator.validatePassword(user.password);
}
```

## 常见的违背SLAP的代码场景和情况
### 注释或空行分割的方法体

```
//注释1
代码片段1

//注释2
代码片段2

//注释3
//代码片段3

```

上面的代码
  
  * 注释或空行分割的代码片段处理相对独立逻辑，可以抽象成独立的方法
  * 上面的代码如果不处理，往往随着时间的推移，会使得所在的方法膨胀，进而形成上面的长方法


### for循环体内部代码
```java
public List<ResultDto> buildResult(Set<ResultEntity> resultSet) {
    List<ResultDto> result = new ArrayList<>();
    for (ResultEntity entity : resultSet) {
        ResultDto dto = new ResultDto();
        dto.setShoeSize(entity.getShoeSize());        
        dto.setNumberOfEarthWorms(entity.getNumberOfEarthWorms());
        dto.setAge(computeAge(entity.getBirthday()));
        result.add(dto);
    }
    return result;
}
```

上面for循环体内部的代码，处理了将ResultEntity转化成ResultDto，可以完全单独抽离成单独的方法，如下代码所示

```java
public List<ResultDto> buildResult(Set<ResultEntity> resultSet) {
    List<ResultDto> result = new ArrayList<>();
    for (ResultEntity entity : resultSet) {
        result.add(toDto(entity));
    }
    return result;
}
 
private ResultDto toDto(ResultEntity entity) {
    ResultDto dto = new ResultDto();
    dto.setShoeSize(entity.getShoeSize());        
    dto.setNumberOfEarthWorms(entity.getNumberOfEarthWorms());
    dto.setAge(computeAge(entity.getBirthday()));
    return dto;
}
```

### 回调
除此之外，回调方法也是容易形成长方法的重灾区，这一点无需再多举例。


## 答疑

### 应用SLAP 会导致更多的短方法，维护成本更高了吧

首先，必须承认，SLAP应用后，会产生一些短方法，但是关于维护成本提升，这一点还是需要考究的。

因为

  * 短方法的提取产生，会使得方法更加具有原子性，职责更加单一，更加的符合Unix的哲学 Do one thing, and do it well。
  * 短方法的复用性更强，使得编码更加便捷
  * 短方法可读性更强，更加便于理解
  * 实践表明，SLAP应用后，维护成本应该是降低的。

所以，不要畏惧，短方法的产生，应该是喜欢上短方法。

### SLAP 的缩写
SLAP是Single Level of Abstraction的缩写，不是Same Level of Abstraction，😀

## References 
  * https://dzone.com/articles/slap-your-methods-and-dont-make-me-think
  * http://principles-wiki.net/principles:single_level_of_abstraction 