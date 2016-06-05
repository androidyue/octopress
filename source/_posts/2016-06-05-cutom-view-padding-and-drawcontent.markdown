---
layout: post
title: "自定义View：Padding与绘制内容"
date: 2016-06-05 21:29
comments: true
categories: Android View
---
有些时候，扩展Android框架提供的view并不能很好地解决问题。很多情况下，我们需要进行view绘制来实现想要的效果。本文我们将介绍如何使用Canvas绘制折线图，同时也会介绍一些视图的尺寸和padding的一些工作原理。
<!--more-->

##简单绘制
如果你打算在自定义的view中控制绘制内容，最好是直接继承自View类。它是最基础的UI绘制单元。它相对来说功能齐全，虽然相比其他子类少一些功能，但对于本文还是够用的。

自定义绘制步骤

  1.创建一个继承自View的类  
  2.重写onDraw方法，在该方法内，使用Canvas进行内容绘制。
  
注意：这里我们不需要调用父类（View）的onDraw方法，因为View.onDraw方法为空实现。

```
@Override
protected void onDraw(Canvas canvas) {
    Paint paint = new Paint();
    paint.setStyle(Style.STROKE);
    paint.setColor(0xFF33B5E5);
    paint.setStrokeWidth(4);
    canvas.drawLine(0, 0, getWidth(), getHeight(), paint);
}
```

上面代码的意思是

  * 绘制一个蓝色(0xFF33B5E5)的线
  * 起点坐标为(0,0) 终点坐标为(getWidth(), getHeight())
  * 线的宽度为4像素

Paint是用来控制绘制的类，使用它我们可以实现超级多的效果。这里我们仅仅使用了它的简单功能。


注意，当我们绘制内容时，该View的左上角的坐标为(0,0)，不管这个view位于屏幕的哪个位置。View有两个方法，getLeft()和getTop()，但是它们返回的是这个相对与父View的位置信息，所以在绘制view内容时，不能使用这两个值。

##处理Padding

通常情况下，我们可以在xml布局文件中设置padding等信息，但是对于上面的onDraw方法来说，由于我们并没有处理padding，所以布局文件的padding值是不生效的。


在View中，视图的宽度和高度包含了padding的值，比如一个view的宽度为100像素，两侧的padding值为10像素，那么view的内容只有80像素的绘制宽度。同理高度也是一样。

在View中获取宽度，我们可以使用getWidth()，获取padding，可以使用getPaddingTop(), getPaddingBottom, getPaddingLeft() and getPaddingRight()这些方法。

想要支持padding，通常修改起点和终点即可。这里我们设置起点为(getPaddingLeft(), getPaddingTop()) 终点为(getWidth() - getPaddingRight(),  getHeight() - getPaddingBottom())。

支持padding的onDraw代码如下
```java
@Override
protected void onDraw(Canvas canvas) {
    paint.setStyle(Style.STROKE);
    paint.setColor(0xFF33B5E5);
    paint.setStrokeWidth(4);
 
    int left = getPaddingLeft();
    int top = getPaddingTop();
    int right = getWidth() - getPaddingRight();
    int bottom = getHeight() - getPaddingBottom();
    canvas.drawLine(left, top, right, bottom, paint);
}
```
之后后的效果图如下

![LineChartView](http://7jpolu.com1.z0.glb.clouddn.com/LineChartView1-180x300.png)


因情况而已，你可能不许要支持padding，但是我还是建议你加上对padding的处理，以备后用。

##绘制折线图
首先，为了便于理解，我们先看一看，最终的折线图的样子。

![LineChartView](http://7jpolu.com1.z0.glb.clouddn.com/LineChartView2.png)

想要绘制上图，实际上需要很多的点坐标，及x轴的值与y轴的值。为了简单，我们这里只需要提供y轴的值，而x轴的值就是y轴值数组的索引。

以下就是View提供的设置数据的方法。
```java
/**
* Sets the y data points of the line chart. The data points
* are assumed to be positive and equally spaced on the x-axis.
* The line chart will be scaled so that the entire height of
* the view is used.
*
* @param datapoints
*     y values of the line chart
*/
public void setChartData(float[] datapoints) {
    this.datapoints = datapoints.clone();
}
```

除了提供值外，我们还需要对这些值进行缩放来填充视图，以下是一个对Y轴坐标进行缩放转换的方法。

```java
private float getYPosition(float value, float maxValue) {
        float height = getHeight() - getPaddingTop() - getPaddingBottom();
        value = (value/maxValue) * height;
        float offset = height - value;//确保数值低的点位于底部
        offset = offset + getPaddingTop();
        return offset;
}
```


getYPosition这个方法

  * 它接受一个y轴坐标和一个最大的y轴坐标，进行缩放处理后，返回适用于该View的值
  * `value = (value/maxValue) * height` 这一步用来获取缩放的初始值
  * `float offset = height - value;`由于折线图需要y轴低的点位于底部，所以需要做转换
  * 除此之外，我们还要考虑到paddingTop的值，这就是为什么要使用`offset = offset + getPaddingTop();`的原因
 
我们现在就可以绘制折线图了，关于实现方案，我们根据数据点绘制很多线，但是我们这里采用Path来实现，相比之下，使用Path经过处理可以让绘制效果更好一些，如下为onDraw方法。

```java
@Override
    protected void onDraw(Canvas canvas) {
        mPaint.setShadowLayer(4, 20, 2, 0x80000000);
        mPaint.setAntiAlias(true);
        mPaint.setStyle(Paint.Style.STROKE);
        mPaint.setColor(Color.BLUE);
        mPaint.setStrokeWidth(4);
        Path path = new Path();
        float maxValue = getMax();
        path.moveTo(getXPosition(0), getYPosition(mData[0], maxValue));

        for (int i = 1; i < mData.length; i++) {
            path.lineTo(getXPosition(i), getYPosition(mData[i], maxValue));
        }
        canvas.drawPath(path, mPaint);
}
```

上述方法用到的getXPosition实现如下
```java
private float getXPosition(float value) {
    return value * (getWidth() / mData.length);
}
```

##细节处理
首先，我们需要的处理就是开启抗锯齿，开启后会减少线的锯齿感，让线看起来更加平滑。开启方法如下
```
paint.setAntiAlias(true);
```

其次，我们需要增加一些阴影来达到更好的展示效果。
```java
paint.setShadowLayer(4, 2, 2, 0x80000000);
```


应用上面的代码，我们使用paint绘制出来的每条线都会有阴影效果。该方法的参数解释如下

  * 第一个参数意思是阴影的半径，其值越大，阴影也越大。如果该值为0，则表示移除阴影效果。
  * 第二个和第三个参数表示阴影的偏移量。我们设置2，2表示阴影相对实线向右偏移2个像素和向下偏移2个像素。
  * 第三个参数为阴影的颜色
 
同时我还增加了水平线作为背景这样看起来更符合折线图的效果，实现代码很简单，如下
```java
private void drawBackground(Canvas canvas) {
        float maxValue = getMax(datapoints);
        int range = getLineDistance(maxValue);

        paint.setStyle(Style.STROKE);
        paint.setColor(Color.GRAY);
        for (int y = 0; y < maxValue; y += range) {
            final float yPos = getYPos(y);
            canvas.drawLine(0, yPos, getWidth(), yPos, paint);
        }
}
```

除此之外，我们还可以增加更多的效果，利用Canvas，我们可以绘制线，路径，矩形，椭圆，位图等内容。使用Paint，我们可以更改填充方式，颜色，画笔宽度等很多效果。建议了解以下这两个类的API，然后自己写点小例子熟悉一下。

##英文原文
  * http://www.jayway.com/2012/07/03/creating-custom-android-views-part-2-how-padding-works-and-how-to-draw-your-own-content/
