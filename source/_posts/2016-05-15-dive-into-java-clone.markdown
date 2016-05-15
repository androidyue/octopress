---
layout: post
title: "探究Java中的克隆"
date: 2016-05-15 21:10
comments: true
categories: Java
---
克隆，想必大家都有耳闻，世界上第一只克隆羊多莉就是利用细胞核移植技术将哺乳动物的成年体细胞培育出新个体，甚为神奇。其实在Java中也存在克隆的概念，即实现对象的复制。

本文将尝试介绍一些关于Java中的克隆和一些深入的问题，希望可以帮助大家更好地了解克隆。
<!--more-->
##Java中的赋值
在Java中，赋值是很常用的，一个简单的赋值如下
```java
//原始类型
int a = 1;
int b = a;

//引用类型
String[] weekdays = new String[5];
String[] gongzuori = weekdays;//仅拷贝引用
```
在上述代码中。

  * 如果是原始数据类型，赋值传递的为真实的值
  * 如果是引用数据类型，赋值传递的为对象的引用，而不是对象。

了解了数据类型和引用类型的这个区别，便于我们了解clone。
##Clone
在Java中，clone是将已有对象在内存中复制出另一个与之相同的对象的过程。java中的克隆为逐域复制。

在Java中想要支持clone方法，**需要首先实现Cloneable接口**

Cloneable其实是有点奇怪的，它不同与我们常用到的接口，它内部不包含任何方法，它仅仅是一个标记接口。

其源码如下
```java
public interface Cloneable {
}
```
关于cloneable，需要注意的

  * 如果想要支持clone，就需要实现Cloneable 接口
  * 如果没有实现Cloneable接口的调用clone方法，会抛出CloneNotSupportedException异常。

**然后是重写clone方法，并修改成public访问级别**
```
static class CloneableImp implements Cloneable {
	public int count;
	public Child child;
		
		
	@Override
	public Object clone() throws CloneNotSupportedException {
		return super.clone();
	}
}
```
调用clone方法复制对象
```java
CloneableImp imp1 = new CloneableImp();
imp1.child = new Child("Andy");
try {
	Object obj = imp1.clone();
	CloneableImp imp2 = (CloneableImp)obj;
	System.out.println("main imp2.child.name=" + imp2.child.name);
} catch (CloneNotSupportedException e) {
	e.printStackTrace();
}
```
  
##浅拷贝
上面的代码实现的clone实际上是属于浅拷贝（Shallow Copy）。

关于浅拷贝，你该了解的

  * 使用默认的clone方法
  * 对于原始数据域进行值拷贝
  * 对于引用类型仅拷贝引用
  * 执行快，效率高
  * 不能做到数据的100%分离。
  * 如果一个对象只包含原始数据域或者不可变对象域，推荐使用浅拷贝。

关于无法做到数据分离，我们可以使用这段代码验证
```java
CloneableImp imp1 = new CloneableImp();
imp1.child = new Child("Andy");
try {
	Object obj = imp1.clone();
	CloneableImp imp2 = (CloneableImp)obj;
	imp2.child.name = "Bob";
			
	System.out.println("main imp1.child.name=" + imp1.child.name);
} catch (CloneNotSupportedException e) {
	e.printStackTrace();
}
```
上述代码我们使用了imp1的clone方法克隆出imp2,然后修改 imp2.child.name 为 Bob,然后打印imp1.child.name 得到的结果是
```
main imp1.child.name=Bob
```

原因是浅拷贝并没有做到数据的100%分离，imp1和imp2共享同一个Child对象，所以一个修改会影响到另一个。

##深拷贝
深拷贝可以解决数据100%分离的问题。只需要对上面代码进行一些修改即可。

1. Child实现Cloneable接口。
```java
public class Child implements  Cloneable{

	public String name;

	public Child(String name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return "Child [name=" + name + "]";
	}

	@Override
	protected Object clone() throws CloneNotSupportedException {
		return super.clone();
	}
}
```
2.重写clone方法，调用数据域的clone方法。
```java
static class CloneableImp implements Cloneable {
	public int count;
	public Child child;
		
		
	@Override
	public Object clone() throws CloneNotSupportedException {
		CloneableImp obj = (CloneableImp)super.clone();
		obj.child = (Child) child.clone();
		return obj;
	}
}
```
当我们再次修改imp2.child.name就不会影响到imp1.child.name的值了，因为imp1和imp2各自拥有自己的child对象，因为做到了数据的100%隔离。

关于深拷贝的一些特点

  * 需要重写clone方法，不仅仅只调用父类的方法，还需调用属性的clone方法
  * 做到了原对象与克隆对象之间100%数据分离
  * 如果是对象存在引用类型的属性，建议使用深拷贝
  * 深拷贝比浅拷贝要更加耗时，效率更低


##为什么使用克隆
很重要并且常见的常见就是：某个API需要提供一个List集合，但是又不希望调用者的修改影响到自身的变化，因此需要克隆一份对象，以此达到数据隔离的目的。

##应尽量避免clone
1.通常情况下，实现接口是为了表明类可以为它的客户做些什么，而Cloneable仅仅是一个标记接口，而且还改变了超类中的手保护的方法的行为，是接口的一种极端非典型的用法，不值得效仿。

2.Clone方法约定及其脆弱
clone方法的Javadoc描述有点暧昧模糊，如下为 Java SE8的约定

>clone方法创建并返回该对象的一个拷贝。而拷贝的精确含义取决于该对象的类。一般的含义是，对于任何对象x，表达式

> x.clone() != x 为 true
> x.clone().getClass() == x.getClass() 也返回true，但非必须
> x.clone().equals(x)  也返回true，但也不是必须的

上面的第二个和第三个表达式很容易就返回false。因而唯一能保证永久为true的就是表达式一，即两个对象为独立的对象。



3.可变对象final域
在克隆方法中，如果我们需要对可变对象的final域也进行拷贝，由于final的限制，所以实际上是无法编译通过的。因此为了实现克隆，我们需要考虑舍去该可变对象域的final关键字。

4.线程安全
如果你决定用线程安全的类实现Cloneable接口，需要保证它的clone方法做好同步工作。默认的Object.clone方法是没有做同步的。

总的来说，java中的clone方法实际上并不是完善的，建议尽量避免使用。如下是一些替代方案。

##Copy constructors
使用复制构造器也可以实现对象的拷贝。

  * 复制构造器也是构造器的一种
  * 只接受一个参数，参数类型为当前的类
  * 目的是生成一个与参数相同的新对象

复制构造器相比clone方法的优势是简单，易于实现。  
一段使用了复制构造器的代码示例
```java
public class Car {
	Wheel wheel;
	String manufacturer;
	
	public Car(Wheel wheel, String manufacturer) {
		this.wheel = wheel;
		this.manufacturer = manufacturer;
	}
	
	//copy constructor
	public Car(Car car) {
		this(car.wheel, car.manufacturer);
	}
	
	public static class Wheel {
		String brand;
	}
}
```
注意，上面的代码实现为浅拷贝，如果想要实现深拷贝，参考如下代码
```java
//copy constructor
public Car(Car car) {
	Wheel wheel = new Wheel();
	wheel.brand = car.wheel.brand;
		
	this.wheel = wheel;
	this.manufacturer = car.manufacturer;
}
```

为了更加便捷，我们还可以为上述类增加一个静态的方法
```java
public static Car newInstance(Car car) {
	return new Car(car);
}
```

##使用Serializable实现深拷贝
其实，使用序列化也可以实现对象的深拷贝。简略代码如下
```java
public class DeepCopyExample implements Serializable{
	private static final long serialVersionUID = 6098694917984051357L;
	public Child child;
	
	public DeepCopyExample copy() {
		DeepCopyExample copy = null;
		try {
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			ObjectOutputStream oos = new ObjectOutputStream(baos);
			oos.writeObject(this);
	
			ByteArrayInputStream bais = new ByteArrayInputStream(baos.toByteArray());
			ObjectInputStream ois = new ObjectInputStream(bais);
			copy = (DeepCopyExample) ois.readObject();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
		return copy;
	}
}
```
其中，Child必须实现Serializable接口
```java
public class Child implements Serializable{
	private static final long serialVersionUID = 6832122780722711261L;
	public String name = "";

	public Child(String name) {
		this.name = name;
	}

	@Override
	public String toString() {
		return "Child [name=" + name + "]";
	}
}
```
使用示例兼测试代码
```java
DeepCopyExample example = new DeepCopyExample();
example.child = new Child("Example");
		
DeepCopyExample copy = example.copy();
if (copy != null) {
	copy.child.name = "Copied";
	System.out.println("example.child=" + example.child + ";copy.child=" + copy.child);
}
//输出结果：example.child=Child [name=Example];copy.child=Child [name=Copied]
```
由输出结果来看，copy对象的child值修改不影响example对象的child值，即使用序列化可以实现对象的深拷贝。


##参考资料
  * [How do I perform a deep clone using Serializable?](http://www.avajava.com/tutorials/lessons/how-do-i-perform-a-deep-clone-using-serializable.html)
  * [Copy constructors](http://www.javapractices.com/topic/TopicAction.do?Id=12)
  
##推荐一本书
[《Effective Java》](http://union.click.jd.com/jdc?e=&p=AyIHZR5aEQISA1AYUyUCEwZRElMUASJDCkMFSjJLQhBaUAscSkIBR0ROVw1VC0dFFQMTA1wTWhYdS0IJRmtqe1NiNnklRmBhXwB4ORJBcVcREz5lDh43Vx1TFgQSBFQaaxcAEgdcH1sUByI3NGlrR2zKsePD%2FqQexq3aztOCMhcHVB1SEwcaAGUbXhIBEg9THVgXABYGZRw%3D&t=W1dCFBBFC1pXUwkEAEAdQFkJBVsUAxYOXRpYCltXWwg%3D)第11条即介绍谨慎使用clone。除此之外，本书还详细介绍了很多关于Java细节的知识，是Java程序员很值得阅读的一本书。本书也是经典的Jolt获奖作品，作者是Joshua Bloch大神。是一本深入研究Java的参考书籍。
