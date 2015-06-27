---
layout: post
title: "这就是观察者模式"
date: 2015-06-27 10:40
comments: true
categories: 设计模式
---
观察者模式是软件设计模式中的一种，使用也比较普遍，尤其是在GUI编程中。关于设计模式的文章，网络上写的都比较多，而且很多文章写的也不错，虽然说有一种重复早轮子的嫌疑，但此轮子非彼轮子，侧重点不同，思路也不同，讲述方式也不近相同。
<!--more-->
##定义
关于定义，最准确的莫过于[Head First设计模式](http://www.amazon.cn/gp/product/B0011FBU34/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0011FBU34&linkCode=as2&tag=droidyue-23)中写到的。
>观察者模式定义了一个一对多的依赖关系，让一个或多个观察者对象监听一个主题对象。这样一来，当被观察者状态发生改变时，需要通知相应的观察者，使这些观察者对象能够自动更新。

##关键要素
###主题
主题是观察者观察的对象，一个主题必须具备下面三个特征。

  * 持有监听的观察者的引用
  * 支持增加和删除观察者
  * 主题状态改变，通知观察者

###观察者
当主题发生变化，收到通知进行具体的处理是观察者必须具备的特征。

##为什么要用这种模式
这里举一个例子来说明，牛奶送奶站就是主题，订奶客户为监听者，客户从送奶站订阅牛奶后，会每天收到牛奶。如果客户不想订阅了，可以取消，以后就不会收到牛奶。
###松耦合
  * 观察者增加或删除无需修改主题的代码，只需调用主题对应的增加或者删除的方法即可。
  * 主题只负责通知观察者，但无需了解观察者如何处理通知。举个例子，送奶站只负责送递牛奶，不关心客户是喝掉还是洗脸。
  * 观察者只需等待主题通知，无需观察主题相关的细节。还是那个例子，客户只需关心送奶站送到牛奶，不关心牛奶由哪个快递人员，使用何种交通工具送达。

###通知不错过
由于被动接受，正常情况下不会错过主题的改变通知。而主动获取的话，由于时机选取问题，可能导致错过某些状态。


##Java实现
Java中有观察者模式使用的API

  * java.util.Observable 这是一个类，而非接口，主题需要继承这个类。
  * java.util.Observer   这是一个接口，监听者需要实现这个接口。

###示例代码
```java
import java.util.Observable;
import java.util.Observer;
public class MainRoot {
	public static void main(String[] args) {
		Observer consumer = new Consumer();
		MilkProvider provider = new MilkProvider();
		provider.addObserver(consumer);
		provider.milkProduced();
	}
	
	static class MilkProvider extends Observable {
		public void milkProduced() {
			setChanged();//状态改变，必须调用
			notifyObservers();
		}
	}
	
	static class Consumer implements Observer {
		@Override
		public void update(Observable arg0, Object arg1) {
			System.out.println("Consumer update..." + arg0 + ";arg1=" + arg1);
		}
	}
}
```
上述代码完成了
  
  * 将consumer加入主题provider的观察者行列
  * provider设置状态变化，通知持有的观察者
  * 观察者consumer收到通知，打印日志处理

###setChanged为何物
其实上述代码中存在这样一处代码`setChanged();`，如果在通知之前没有调用这个方法，观察者是收不到通知的，这是为什么呢

这里我们看一下setChanged的源码
```java
protected synchronized void setChanged() {
    changed = true;
}
```
很简单，然后找一下谁使用changed这个值
```java
public synchronized boolean hasChanged() {
    return changed;
}
```
notifyObservers的代码
```java
public void notifyObservers(Object data) {
    int size = 0;
    Observer[] arrays = null;
    synchronized (this) {
    	if (hasChanged()) {
    		clearChanged();
        	size = observers.size();
        	arrays = new Observer[size];
        	observers.toArray(arrays);
    	}
    }
    if (arrays != null) {
    	for (Observer observer : arrays) {
        	observer.update(this, data);
        }
    }
}
```
但是为什么要加入这样一个开关呢？可能原因大致有三点

  1.筛选有效通知，只有有效通知可以调用setChanged。比如，我的微信朋友圈一条状态，好友A点赞，后续该状态的点赞和评论并不是每条都通知A，只有A的好友触发的操作才会通知A。    

  2.便于撤销通知操作，在主题中，我们可以设置很多次setChanged，但是在最后由于某种原因需要取消通知，我们可以使用clearChanged轻松解决问题。  
  
  3.主动权控制，由于setChanged为protected,而notifyObservers方法为public，这就导致存在外部随意调用notifyObservers的可能，但是外部无法调用setChanged，因此真正的控制权应该在主题这里。  

###主动获取
观察者模式即所谓的推送方式，然而推送并非完美无缺。比如主题变化会推送大量的数据，而其中的一些观察者只需要某项数据，此时观察者就需要在具体实现中花费时间筛选数据。

这确实是个问题，想要解决也不难，需要主题为某些数据提供getter方法，观察者只需调用getter取数据处理即可。
```java
  static class MilkProvider extends Observable {
    public void milkProduced() {
      setChanged();//状态改变，必须调用
      notifyObservers();
    }
    
    public float getPrice() {
      return 2.5f;
    }
  }
  
  static class Consumer implements Observer {
    @Override
    public void update(Observable arg0, Object arg1) {
        MilkProvider provider = (MilkProvider)arg0;
        System.out.println("milk price =" + provider.getPrice());
    }
  }
```

##不足与隐患
主要的问题表现在内存管理上，主要由以下两点
  
  * 主题持有观察者的引用，如果未正常处理从主题中删除观察者，会导致观察者无法被回收。
  * 如果观察者具体实现代码有问题，会导致主题和观察者对象形成循环引用，在某些采用引用计数的垃圾回收器可能导致无法回收。


##书山有路
  * [设计模式之禅](http://www.amazon.cn/gp/product/B00INI842W/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00INI842W&linkCode=as2&tag=droidyue-23)
  * [Head First设计模式](http://www.amazon.cn/gp/product/B0011FBU34/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0011FBU34&linkCode=as2&tag=droidyue-23)
  * [设计模式 可复用面向对象软件的基础 ](http://www.amazon.cn/gp/product/B001130JN8/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B001130JN8&linkCode=as2&tag=droidyue-23)









