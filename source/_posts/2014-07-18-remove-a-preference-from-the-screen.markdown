---
layout: post
title: "你真的懂么:Android中删除Preference"
date: 2014-07-18 20:50
comments: true
categories: Android UI
---

Android的设置界面实现比较简单,有时甚至只需要使用一个简单的xml文件即可.声明简单,但是如何从PreferenceScreen或者PreferenceCategory中删除一个Preference会简单么.为什么有些人写的就无法删除成功呢?本文将从Android源码实现来分析一下.
<!--more-->
##声明文件
```xml
<?xml version="1.0" encoding="utf-8"?>
<PreferenceScreen xmlns:android="http://schemas.android.com/apk/res/android" 
    android:key="root">
    
	<PreferenceCategory 
	   	android:key="theme" 
	   	android:title="Theme"
	   	android:summary="Theme Settings"
	    >
		<CheckBoxPreference
		    android:key="holo_theme"
		    android:title="Holo Theme"
		    android:summary="Use Holo Theme"
		    />
		    
	</PreferenceCategory>
	
	<CheckBoxPreference
	    android:key="rmcache"
	    android:title="Auto Clear Cache"
	    android:summary="Enable Auto Clear Cache "
	    />
</PreferenceScreen>
```
##层级关系

![Preference Family Tree](https://asset.droidyue.com/broken_images_2014/preference_hierachy.png)

##删除Preference
  * 删除key为rmcache的Preference,这个Preference是PreferenceScreen root的子节点.
```java
PreferenceScreen screen = getPreferenceScreen();
CheckBoxPreference autoClearCheckboxPref = (CheckBoxPreference) screen.findPreference("rmcache");
screen.removePreference(autoClearCheckboxPref);
```

  * 删除key为holo_theme的Preference,其为PreferenceScreen root的孙子节点,非直接关系.
```java
PreferenceCategory themePrefCategory = (PreferenceCategory) screen.findPreference("theme");
CheckBoxPreference holoCheckboxPref = (CheckBoxPreference)themePrefCategory.findPreference("holo_theme");
themePrefCategory.removePreference(holoCheckboxPref);
```
##为什么删除失败
很多人出现了删除失败的问题,主要原因是使用了非父亲节点来删除,比如这样
```java
PreferenceScreen screen = getPreferenceScreen();
CheckBoxPreference holoCheckboxPref = (CheckBoxPreference)screen.findPreference("holo_theme");
screen.removePreference(holoCheckboxPref);
```
PreferenceGroup删除实现,其实PreferenceScreen和PreferenceCategory都是PreferenceGroup的子类.
```java
   /**
     * Removes a {@link Preference} from this group.
     * 
     * @param preference The preference to remove.
     * @return Whether the preference was found and removed.
     */
    public boolean removePreference(Preference preference) {
        final boolean returnValue = removePreferenceInt(preference);
        notifyHierarchyChanged();
        return returnValue;
    }

    private boolean removePreferenceInt(Preference preference) {
        synchronized(this) {
            preference.onPrepareForRemoval();
            return mPreferenceList.remove(preference);
        }
    }
```
而mPreferenceList中存放的都是当前PreferenceGroup的直接子Preference.

##findPreference实现
findPreference查找不仅仅限于直接子Preference,会遍历其所有的子Preference.

所以代码中同样有root PreferenceGroup和直接父PreferenceGroup引用时,通常后者效率会高.
```java
    /**
     * Finds a {@link Preference} based on its key. If two {@link Preference}
     * share the same key (not recommended), the first to appear will be
     * returned (to retrieve the other preference with the same key, call this
     * method on the first preference). If this preference has the key, it will
     * not be returned.
     * <p>
     * This will recursively search for the preference into children that are
     * also {@link PreferenceGroup PreferenceGroups}.
     * 
     * @param key The key of the preference to retrieve.
     * @return The {@link Preference} with the key, or null.
     */
    public Preference findPreference(CharSequence key) {
        if (TextUtils.equals(getKey(), key)) {
            return this;
        }
        final int preferenceCount = getPreferenceCount();
        for (int i = 0; i < preferenceCount; i++) {
            final Preference preference = getPreference(i);
            final String curKey = preference.getKey();

            if (curKey != null && curKey.equals(key)) {
                return preference;
            }
            
            if (preference instanceof PreferenceGroup) {
                final Preference returnedPreference = ((PreferenceGroup)preference)
                        .findPreference(key);
                if (returnedPreference != null) {
                    return returnedPreference;
                }
            }
        }

        return null;
    }
```

##findPreference和removePreference实现比较
为什么findPreference遍历所有的子节点,而removePreference不会,只会删除直接子Preference

###原因有以下几点:
  * findPreference支持遍历查找,减少了声明诸多的中间PreferenceGroup代码.而findPreference属于常用接口方法.
  * removePreference调用较少.
  * 当存在key相同的Preference时,如果removePreference不限定直接子Preference,那么无法准确删除哪一个.


----------
###其他
  * <a href="http://www.amazon.cn/gp/product/B00CJ368JS/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00CJ368JS&linkCode=as2&tag=droidyue-23">Android的设计与实现</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00CJ368JS" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B009OLU8EE/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B009OLU8EE&linkCode=as2&tag=droidyue-23">Android系统源代码情景分析</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B009OLU8EE" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
