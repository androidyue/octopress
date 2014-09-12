---
layout: post
title: "Android根据资源名获取资源ID"
date: 2014-09-12 22:12
comments: true
categories: Android
---

接触过Android开发的同学们都知道在Android中访问程序资源基本都是通过资源ID来访问。这样开发起来很简单，并且可以不去考虑各种分辨率，语言等不同资源显式指定。
<!--more-->
##痛点
但是，有时候也会有一些问题，比如我们根据服务器端的值取图片，但是服务器端绝对不会返回给我们的是资源id，最多是一种和文件名相关联的值，操作资源少的时候，可以维护一个容器进行值与资源ID的映射，但是多的话，就需要另想办法了。

###便捷的方法
在这种情况下，使用文件名来得到资源ID显得事半功倍。
通过调用Resources的getIdentifier可以很轻松地得到资源ID。
几个简单的示例
```java lineos:false 
Resources res = getResources();
final String packageName = getPackageName();
int imageResId = res.getIdentifier("ic_launcher", "drawable", packageName);
int imageResIdByAnotherForm = res.getIdentifier(packageName + ":drawable/ic_launcher", null, null);
	
int musicResId = res.getIdentifier("test", "raw", packageName);
		
int notFoundResId = res.getIdentifier("activity_main", "drawable", packageName);

Log.i(LOGTAG, "testGetResourceIds imageResId = " + imageResId 
				+ ";imageResIdByAnotherForm = " + imageResIdByAnotherForm  
				+ ";musicResId=" + musicResId
				+ ";notFoundResId =" + notFoundResId);
```

运行结果
```bash lineos:false
I/MainActivity( 4537): testGetResourceIds imageResId = 2130837504;imageResIdByAnotherForm = 2130837504;musicResId=2130968576;notFoundResId =0
```

##看一看API
###直接API
  * 这个方法用来使用资源名来获取资源ID
  * 完整的资源名为`package:type/entry`，如果资源名这个参数有完整地指定，后面的defType和defPackage可以省略。
  * defType和defPackage省略时，需要将其设置成null
  * 注意这个方法不提倡，因为直接通过资源ID访问资源会更加效率高
  * 如果资源没有找到，返回0,在Android资源ID中0不是合法的资源ID。

```java  lineos:false android.content.res.Resources.class
/**
     * Return a resource identifier for the given resource name.  A fully
     * qualified resource name is of the form "package:type/entry".  The first
     * two components (package and type) are optional if defType and
     * defPackage, respectively, are specified here.
     * 
     * <p>Note: use of this function is discouraged.  It is much more
     * efficient to retrieve resources by identifier than by name.
     * 
     * @param name The name of the desired resource.
     * @param defType Optional default resource type to find, if "type/" is
     *                not included in the name.  Can be null to require an
     *                explicit type.
     * @param defPackage Optional default package to find, if "package:" is
     *                   not included in the name.  Can be null to require an
     *                   explicit package.
     * 
     * @return int The associated resource identifier.  Returns 0 if no such
     *         resource was found.  (0 is not a valid resource ID.)
     */
    public int getIdentifier(String name, String defType, String defPackage) {
        try {
            return Integer.parseInt(name);
        } catch (Exception e) {
            // Ignore
        }
        return mAssets.getResourceIdentifier(name, defType, defPackage);
    }
```
###间接API
实际上上述API调用的是AssetManager.class中的native方法。
```java lineos:false
/**
     * Retrieve the resource identifier for the given resource name.
     */
    /*package*/ native final int getResourceIdentifier(String type,
                                                       String name,
                                                       String defPackage);
```

###其他
  * <a href="http://www.amazon.cn/gp/product/B00J4DXWDG/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00J4DXWDG&linkCode=as2&tag=droidyue-23">Android编程权威指南</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00J4DXWDG" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B0011F7WU4/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0011F7WU4&linkCode=as2&tag=droidyue-23">收藏必备：Java编程思想</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B0011F7WU4" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B0011C2P7W/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0011C2P7W&linkCode=as2&tag=droidyue-23">经典著作：人月神话</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B0011C2P7W" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  
