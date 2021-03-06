---
layout: post
title: "为什么程序员应该要尝试写一写博客"
date: 2017-01-02 19:59
comments: true
categories: 博客
---
作为程序员，最平常不过的就是敲代码了。然也，这是我们自身以及外界对我们最朴实的认知。在编码过程中，我们可能会遇到并解决掉一些问题，积累经验和心得，有的人选择用自然语言记录下来，形成博客，而大多数人往往不会做这种记录。

本文将试图探讨，为什么程序员都应该尝试记录自己遇到的问题，经验和心得，以及为什么我们需要以公开的博客的形式来展现。

<!--more-->

首先，做个简单的自我介绍，我是一名 Android 开发，在大学时候受到当时的创新工场首席布道师 蔡学镛 的一篇微博教诲，开始尝试写技术博客。先前在csdn写一些简单的总结，最后自己开始维护一个独立的博客，名为[技术小黑屋](http://droidyue.com)。该博客维护将近4年多。专注于书写Java 和 Android 的技术文章，在开发者头条和稀土掘金有着大量的关注，并且在droidcon和GDG做过多次主题分享。

闲话休叙，进入正题，来看一看为什么我觉得程序员应该尝试写博客。

## 记录与备忘
在人类的发展历史上，语言往往早于文字的出现。一个简单的例子，在古代的日本，人们只有语言，即只能听和说，但是缺乏与语言进行映射的文字。而这一时期最大的问题也莫过于无法使用文字来记录很多信息。直到大化革新，从中国隋唐时期开始引入汉字，这一问题才得到解决。

为什么要引出上面的这段话，因为如果我们做一个类比，就会发现这和写文章总结有着相似之处。当我们解决了一个问题或者习得了一项经验，如果没有记录下来，那么其实就与只有语言没有文字的古人无异。当你的信息被记录下来，才是所谓的进步。

举个更贴切的现实情况：

> 比如有一天，我花了三个小时解决了一个问题，之后没有进行任何记录。

> 过了几个月之后，同样的问题出现，我这是可能会再次花半个小时或一个小时来解决。

> 如果我当时进行了合理的记录，可能我只需要花10分钟就能搞定这个问题。

用一段比较技术的比喻是:

**大脑中的记忆仿若缓存，不知何时就会被忘记（清理）。而记录下来的文章则如写入硬盘般持久**。

## 深入理解、掌握技术的体现
如果我们想要写文章并且分享给他人，势必要拿出我们的最高的水平，就要把讲解的内容研究得滚瓜烂熟，写出的文章也要句斟字酌。

举个简单的例子。Android中有一个用于存取数据的常用的实现为SharedPreferences。有很多人会这样觉得：

  * 它不就是存取很多类似配置时候使用么？
  * 使用起来很简单啊，这有什么好写的。

这种回答往往是仅仅站在使用的角度来看的，其实一个SharedPreference有着很大的学问：

  * SharedPreference实现了内存与外存的映射，即如何实现？
  * 它提供了同步的commit，和异步的apply用来保存数据，为什么提供两种，同步会阻塞线程？异步会不会有错序写入的问题？
  * 为什么registerOnSharedPreferenceChangeListener 的Javadoc说 不会持有listener的强引用？

当你主观上想要写好一篇文章时，你就会发散的想问题，去研究这个东西的源码，并结合自己遇到的问题或者经验，来努力写好这篇文章。

当你写一篇，两篇，三五篇，七篇八篇九十篇，你的知识体系也会逐渐的完善，当然这其中每篇都应该包含了你对其中技术的深入理解。


## 发现更优解和不足
> 两个苹果交换后每人只有一个，但两个想法交换后，每个人都有两个想法  

当我们把文章写出来，挂到博客上，被被人看见之后，很有可能从别人的反馈中得到更优解或不足。

举个例子，我在写[《树莓派入手指南》](http://droidyue.com/blog/2016/08/22/before-you-buy-raspberry-pi/)总，提到TF卡即SD卡，不久后得到了这样的纠正。这就纠正了我的错误认知。

![tfcard.png](https://asset.droidyue.com/broken_images/tfcard.jpeg)

在我的[《关于Android Log的一些思考》](http://droidyue.com/blog/2015/11/01/thinking-about-android-log/) 文章评论中，得到了很多更优的反馈，比如
![better_idea.jpeg](https://asset.droidyue.com/broken_images/log_comment.jpeg)

所以，写出博客，收益的不只是别人，还有自己。

## 技术应该是开放的
如果我写出来分享了，别人会了，那么岂不是我的竞争力下降了？

在编程中，几乎不存在这种狭隘的“教会徒弟，饿死师傅”情况，相反，越是分享，越是对技术开放的人，其收获也是越大，成就也是越大。

源码都可以开发，技术理应也是开放的。


## 其他的好处
  * 个人名气提升
  * 知识变现
  * 求职
  * 培养自己坚持的习惯

首先，写博客可以算作是提升个人名气的一种形式，通过分享知识经验，做到了帮助别人，你的名气与品牌会被创建并扩大。

再次，当你有了足够的名气时，你会收到类似网站广告，（付费）演讲邀请，录制视频，出书等邀请和机会。

除此之外，在求职的时候，如果在你的简历上附加了博客的内容，往往会得到更高的通过率，因为这样可能会给面试官留下善于总结，深入研究问题的好印象。

长期坚持写博客，会有助于你培养好的习惯，慢慢的做事情也会有耐心，自己就越来越能控制自己。


## 没有时间，我怎么写
程序员可能是加班相对严重的一种职业。什么996，大小周。光工作就占据了大部分的时间，剩下的时间，就是陪家人，陪女朋友。哪里有时间来写博客啊？

诚然，这些都是属实的。

但是，其实你还是可以挤出时间来的，毕竟“时间就像海绵里的水,只要愿意挤,总还是有的”。况且这段时间挤出来又不是用来浪费，而是用来提高自己，帮助自己和他人，是一件大有裨益的事情。

举个个人的例子，我能挤出来的时间有
  
  * 早晨早起上班前，大概有1个小时左右。
  * 晚上下班回家，大概有1.5个小时左右。
  * 周末的时候，大概有8个小时左右。

个人倾向于通过早起从早晨的时间中进行压榨，来逐渐积累。

##为什么应该采用博客的方式而不是云笔记
其实有很多人会进行记录，他们通常会记录在有道笔记或者印象笔记中。我认为的原因如下

  * 记录在笔记，更多的是为自己看，无法进行深入理解和研究
  * 无法分享给广大同行，不利于发现自己看待问题的不足和更有的见解
  * 无法获得类似知识变现，名气提升等益处
  * 只有公开的博客，才能解决上述问题


以上就是我认为程序员都应该尝试写一写博客的观点，除此之外，我在知乎Live将会实时回答[《程序员如何写好一篇技术文章》](https://www.zhihu.com/lives/796775894273363968)。

本次Live将会讲解：

  * 写好技术文章有什么好处？
  * 什么样的技术文章算是「好文章」？
  * 如何书写出好的技术文章？
  * 如何在写技术文章的时候，做到高质又高产？


并回答这些问题：
  
  * 如何在平时更好地积累素材和感悟。
  * 写博客费事费力，如何长时间坚持？
  * 如果做到文章吸引人？
  * 如何解决博客与工作时间的冲突问题
  * 博客写了很久了，但是没人看，怎么办


如果你感兴趣，或者有问题想要提问，欢迎参与。

参与地址： https://www.zhihu.com/lives/796775894273363968 

结尾，希望更多的程序员拿起笔来，写写博客，Let's make a difference.
