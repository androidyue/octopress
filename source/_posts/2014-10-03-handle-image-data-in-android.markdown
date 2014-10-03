---
layout: post
title: "Android处理图像数据全记录"
date: 2014-10-03 17:42
comments: true
categories: Android Drawable Bitmap
---
Android中处理图像是一件很常见的事情，这里记录备忘一些亲身使用过的处理图片数据的方法。

##转为Bitmap
<!--more-->
###RGB值转Bitmap
```java
private Bitmap createColorBitmap(String rgb, int width, int height) {
		Bitmap bmp = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
		int color = Color.parseColor(rgb);
		bmp.eraseColor(color);
		return bmp;
}

//Usage
Bitmap bmp = createColorBitmap("#cce8cf", 200, 50);
```

###Color值转Bitmap
```java
private Bitmap createColorBitmap(int color, int width, int height) {
	Bitmap bmp = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
	bmp.eraseColor(color);
	return bmp;
}
//Usage
Bitmap bmp = createColorBitmap(Color.BLUE, 200, 50);
```
###字节数组转Bitmap
```java
private Bitmap getBitmapFromByteArray(byte[] array) {
	return BitmapFactory.decodeByteArray(array, 0, array.length);
}
```

###读取文件转Bitmap
```java
private Bitmap getBitmapFromFile(String pathName) {
		return BitmapFactory.decodeFile(pathName);
}
```


###读取资源转Bitmap
```java
private Bitmap getBitmapFromResource(Resources res, int resId) {
		return BitmapFactory.decodeResource(res, resId);
	}
```

###输入流转Bitmap
```java
private Bitmap getBitmapFromStream(InputStream inputStream) {
		return BitmapFactory.decodeStream(inputStream);
}
```

###Drawable转Bitmap
```java
Bitmap icon = BitmapFactory.decodeResource(context.getResources(),R.drawable.icon_resource);
```


##转为Drawable
###资源转Drawable
```java
Drawable drawable = getResources().getDrawable(R.drawable.ic_launcher);
```

###Bitmap转Drawable
```java
Drawable d = new BitmapDrawable(getResources(),bitmap);
```


##图片圆角展示
通过对图片数据bitmap进行处理即可，其中pixels为边角的半径。
```java
public static Bitmap getRoundedCornerBitmap(Bitmap bitmap, int pixels) {
        Bitmap output = Bitmap.createBitmap(bitmap.getWidth(), bitmap
                .getHeight(), Config.ARGB_8888);
        Canvas canvas = new Canvas(output);

        final int color = 0xff424242;
        final Paint paint = new Paint();
        final Rect rect = new Rect(0, 0, bitmap.getWidth(), bitmap.getHeight());
        final RectF rectF = new RectF(rect);
        final float roundPx = pixels;

        paint.setAntiAlias(true);
        canvas.drawARGB(0, 0, 0, 0);
        paint.setColor(color);
        canvas.drawRoundRect(rectF, roundPx, roundPx, paint);

        paint.setXfermode(new PorterDuffXfermode(Mode.SRC_IN));
        canvas.drawBitmap(bitmap, rect, rect, paint);

        return output;
    }
```

###其他
  * <a href="http://www.amazon.cn/gp/product/B00LVHTI9U/ref=as_li_qf_sp_asin_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00LVHTI9U&linkCode=as2&tag=droidyue-23">第一行代码:Android</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00LVHTI9U" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00J4DXWDG/ref=as_li_qf_sp_asin_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00J4DXWDG&linkCode=as2&tag=droidyue-23">Android编程权威指南</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00J4DXWDG" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B00GU73RHA/ref=as_li_qf_sp_asin_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00GU73RHA&linkCode=as2&tag=droidyue-23">Android应用UI设计模式</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00GU73RHA" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
