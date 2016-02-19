---
layout: post
title: "说说依赖注入"
date: 2015-06-13 22:59
comments: true
categories: 设计模式 
---
在面向对象编程中，我们经常处理处理的问题就是解耦，程序的耦合性越低表明这个程序的可读性以及可维护性越高。控制反转(Inversion of Control或IoC)就是常用的面向对象编程的设计原则，使用这个原则我们可以降低耦合性。其中依赖注入是控制反转最常用的实现。
<!--more-->
##什么是依赖
依赖是程序中常见的现象，比如类Car中用到了GasEnergy类的实例energy，通常的做法就是在Car类中显式地创建GasEnergy类的实例，并赋值给energy。如下面的代码
```java
interface Energy {
		
}
	
class GasEnergy implements Energy {
		
}
	
class Car {
	Energy energy = new GasEnergy();
}
```
##存在问题
  * 类Car承担了多余的责任，负责energy对象的创建，这必然存在了严重的耦合性。举一个现实中的例子，一辆汽车使用哪种能源不是由汽车来决定，而是由汽车制造商（CarMaker）来决定，这是汽车制造商的责任。
  * 可扩展性，假设我们想修改能源为电动力，那么我们必然要修改Car这个类，明显不符合开放闭合原则。
  * 不利于单元测试。

##依赖注入
依赖注入是这样的一种行为，在类Car中不主动创建GasEnergy的对象，而是通过外部传入GasEnergy对象形式来设置依赖。
常用的依赖注入有如下三种方式
###构造器注入
将需要的依赖作为构造方法的参数传递完成依赖注入。
```java
class Car {
	Energy mEnergy;
	public Car(Energy energy) {
		mEnergy = energy;
	}
}
```
###Setter方法注入
增加setter方法，参数为需要注入的依赖亦可完成依赖注入。
```java
class Car {
	Energy mEnergy;
		
	public void setEnergy(Energy energy) {
		mEnergy  = energy;
	}
}
```
###接口注入
接口注入，闻其名不言而喻，就是为依赖注入创建一套接口，依赖作为参数传入，通过调用统一的接口完成对具体实现的依赖注入。
```java
interface EnergyConsumerInterface {
	public void setEnergy(Energy energy);
}
	
class Car implements EnergyConsumerInterface {
	Energy mEnergy;
		
	public void setEnergy(Energy energy) {
		mEnergy  = energy;
	}
}
```
接口注入和setter方法注入类似，不同的是接口注入使用了统一的方法来完成注入，而setter方法注入的方法名称相对比较随意。


##框架取舍
依赖注入有很多框架，最有名的就是Guice，当然Spring也支持依赖注入。Guice采用的是运行时读取注解，通过反射的形式生成依赖并进行注入。这种形式不太适合Android移动设备，毕竟这些操作都在运行时处理，对性能要求较高。

Dagger则是Android开发适合的依赖注入库，其同样采用类注解的形式，不同的是它是在编译时生成辅助类，等到在运行时使用生成的辅助类完成依赖注入。

###用还是不用
其实注入框架用还是不用，是一个问题，如若使用框架，则要求团队每一个人都要遵守说明来编写代码解决依赖注入。而这些框架其实也并非很容易就能上手，学习系数相对复杂，难以掌握，这也是需要考虑的问题。

个人观点为不推荐也不反对使用这些框架，但是觉得有些时候我们寄希望于一个框架，不如平时注意这些问题，人为避免何尝不是对自己的一种基本要求呢？


##依赖查找
依赖查找和依赖注入一样属于控制反转原则的具体实现，不同于依赖注入的被动接受，依赖查找这是主动请求，在需要的时候通过调用框架提供的方法来获取对象，获取时需要提供相关的配置文件路径、key等信息来确定获取对象的状态。


##书籍推荐
  * [研磨设计模式](http://www.amazon.cn/gp/product/B004G8P90S/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B004G8P90S&linkCode=as2&tag=droidyue-23)
  * [设计模式之禅](http://www.amazon.cn/gp/product/B00INI842W/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00INI842W&linkCode=as2&tag=droidyue-23)
  * [Head First设计模式](http://www.amazon.cn/gp/product/B0011FBU34/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0011FBU34&linkCode=as2&tag=droidyue-23)
