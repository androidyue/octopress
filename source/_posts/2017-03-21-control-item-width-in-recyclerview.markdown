---
layout: post
title: "控制RecyclerView item的宽度"
date: 2017-03-21 21:54
comments: true
categories: Android RecyclerView
---

自从Android中引入RecyclerView之后，它就逐步的替换掉了ListView和GridView。本文很简单，行文目的是记录和备忘。如果能帮到你，那再好不过了。

<!--more-->

关于控制RecyclerView item的宽度，说起来还不是那么清晰，上一张图，就明白了。

![recyclerview_item_width.png](https://asset.droidyue.com/broken_images/recycler_view_width.png)

  * 上面的实际上是一个Grid布局
  * 前三行每个item均分RecyclerView的宽度
  * 最后一行的Others占大概三分之一，而Flipboard则占据了三分之二。

上面的图和描述就是我们今天想要实现的效果。

方法很简单，主要使用了GridLayoutManager的setSpanSizeLookup方法
```java
mLayoutManager = new GridLayoutManager(this, 3);
mLayoutManager.setSpanSizeLookup(new GridLayoutManager.SpanSizeLookup() {
    @Override
    public int getSpanSize(int position) {
        if (position == mAdapter.getItemCount() - 1) {
            return 2;
        } else {
            return 1;
        }
    }
});
```

  * GridLayoutManager构造方法中传入了一个spanCount,这里值为3
  * getSpanSize方法中，最后一个item占据2个span，其他占据一个span

## 完整示例源码
  * [recyclerview_span_size](https://github.com/androidyue/recyclerview_span_size)