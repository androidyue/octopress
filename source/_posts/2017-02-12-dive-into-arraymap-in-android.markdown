---
layout: post
title: "深入剖析 Android中的 ArrayMap"
date: 2017-02-12 17:51
comments: true
categories: Android
---

数据集合在任何一门编程语言中都是很重要的一部分，在 Android 开发中，我们会实用到ArrayList, LinkedList, HashMap等。其中HashMap是用来处理键值对需求的常用集合。 而Android中引入了一个新的集合，叫做ArrayMap，为键值对存储需求增加了一种选择。

<!--more-->
## ArrayMap是什么
  * 一个通用的key-value映射数据结构
  * 相比HashMap会占用更少的内存空间
  * android.util和android.support.v4.util都包含对应的ArrayMap类

## ArrayMap的内部结构
![ArrayMap internal strucuture](http://7jpolu.com1.z0.glb.clouddn.com/arraymap_internal_structure.png)

如上图所示，在ArrayMap内部有两个比较重要的数组，一个是mHashes,另一个是mArray。

  * mHashes用来存放key的hashcode值
  * mArray用来存储key与value的值，它是一个Object数组。

其中这两个数组的索引对应关系是

```java
mHashes[index] = hash;
mArray[index<<1] = key;  //等同于 mArray[index * 2] = key;
mArray[(index<<1)+1] = value; //等同于 mArray[index * 2 + 1] = value;
```  

注：向左移一位的效率要比 乘以2倍 高一些。

## 查找数据
查找数据是容器常用的操作，在Map中，通常是根据key找到对应的value的值。

ArrayMap中的查找分为如下两步

  * 根据key的hashcode找到在mHashes数组中的索引值
  * 根据上一步的索引值去查找key所对应的value值

其中占据时间复杂度最多的属于第一步:确定key的hashCode在mHahses中的索引值。

而这一步对mHashes查找使用的是二分查找，即Binary Search。所以ArrayMap的查询时间复杂度为 ‎O(log n)

确定key的hashcode在mHashes中的索引的代码的逻辑

```java
	int indexOf(Object key, int hash) {
        final int N = mSize;
        //快速判断是ArrayMap是否为空,如果符合情况快速跳出
        if (N == 0) {
            return ~0;
        }
        //二分查找确定索引值
        int index = ContainerHelpers.binarySearch(mHashes, N, hash);

        // 如果未找到，返回一个index值，可能为后续可能的插入数据使用。
        if (index < 0) {
            return index;
        }

        // 如果确定不仅hashcode相同，也是同一个key，返回找到的索引值。
        if (key.equals(mArray[index<<1])) {
            return index;
        }
        
        // 如果key的hashcode相同，但不是同一对象，从索引之后再次找
        int end;
        for (end = index + 1; end < N && mHashes[end] == hash; end++) {
            if (key.equals(mArray[end << 1])) return end;
        }

        // 如果key的hashcode相同，但不是同一对象，从索引之前再次找
        for (int i = index - 1; i >= 0 && mHashes[i] == hash; i--) {
            if (key.equals(mArray[i << 1])) return i;
        }
        //返回负值，既可以用来表示无法找到匹配的key，也可以用来为后续的插入数据所用。
        // Key not found -- return negative value indicating where a
        // new entry for this key should go.  We use the end of the
        // hash chain to reduce the number of array entries that will
        // need to be copied when inserting.
        return ~end;
    }
```


既然对mHashes进行二分查找，则mHashes必须为有序数组。

## 插入数据
ArrayMap提供给我们进行插入数据的API有

  * append(key,value) 
  * put(key,value)
  * putAll(collection)

以put方法为例，需要注意的有

  * 新数据位置确定
  * key为null
  * 数组扩容问题

### 新数据位置确定
为了确保mHashes能够进行二分查找，我们需要保证mHashes始终未有序数组。

在确定新数据位置过程中

  * 根据key的hashcode在mHashes表中二分查找确定合适的位置。
  * 如果新添加的数据的索引不是最后位置，在需要对这个索引之后的全部数据向后移动

![ArrayMap put](http://7jpolu.com1.z0.glb.clouddn.com/arraymap_move_to_right.png)

### key为null时
当key为null时，其实和其他正常的key差不多，只是对应的hashcode会默认成0来处理。

```java
	public V put(K key, V value) {
        final int hash;
        int index;
        if (key == null) {
            hash = 0;//如果key为null，其hashcode算作0
            index = indexOfNull();
        } 
    	...
	}
```

### 数组扩容问题
  * 首先数组的容量会扩充到BASE_SIZE
  * 如果BASE_SIZE无法容纳，则扩大到2 * BASE_SIZE
  * 如果2 * BASE_SIZE仍然无法容纳，则每次扩容为当前容量的1.5倍。

具体的计算容量的代码为
```java
/**
 * The minimum amount by which the capacity of a ArrayMap will increase.
 * This is tuned to be relatively space-efficient.
*/
private static final int BASE_SIZE = 4;
final int n = mSize >= (BASE_SIZE*2) ? (mSize+(mSize>>1)) 
	: (mSize >= BASE_SIZE ? (BASE_SIZE*2) : BASE_SIZE);
```


## 删除数据
删除ArrayMap中的一项数据，可以分为如下的情况

  * 如果当前ArrayMap只有一项数据，则删除操作将mHashes，mArray置为空数组，mSize置为0.
  * 如果当前ArrayMap容量过大（大于BASE_SIZE*2）并且持有的数据量过小（不足1/3）则降低ArrayMap容量，减少内存占用
  * 如果不符合上面的情况，则从mHashes删除对应的值，将mArray中对应的索引置为null


## ArrayMap的缓存优化
ArrayMap的容量发生变化，正如前面介绍的，有这两种情况

  * put方法增加数据，扩大容量
  * remove方法删除数据，减小容量

在这个过程中，会频繁出现多个容量为BASE_SIZE和2 * BASE_SIZE的int数组和Object数组。ArrayMap设计者为了避免创建不必要的对象，减少GC的压力。采用了类似[对象池](http://droidyue.com/blog/2016/12/12/dive-into-object-pool/)的优化设计。


这其中设计到几个元素

  * BASE_SIZE  值为4，与ArrayMap容量有密切关系。
  * mBaseCache 用来缓存容量为BASE_SIZE的int数组和Object数组
  * mBaseCacheSize mBaseCache缓存的数量，避免无限缓存
  * mTwiceBaseCache 用来缓存容量为 BASE_SIZE * 2的int数组和Object数组
  * mTwiceBaseCacheSize mTwiceBaseCache缓存的数量，避免无限缓存
  * CACHE_SIZE 值为10，用来控制mBaseCache与mTwiceBaseCache缓存的大小

这其中

  *  mBaseCache的第一个元素保存下一个mBaseCache，第二个元素保存mHashes数组
  *  mTwiceBaseCache和mBaseCache一样，只是对应的数组容量不同 

具体的缓存数组逻辑的代码为
```java
	private static void freeArrays(final int[] hashes, final Object[] array, final int size) {
        if (hashes.length == (BASE_SIZE*2)) {
            synchronized (ArrayMap.class) {
                if (mTwiceBaseCacheSize < CACHE_SIZE) {
                    array[0] = mTwiceBaseCache;
                    array[1] = hashes;
                    for (int i=(size<<1)-1; i>=2; i--) {
                        array[i] = null;
                    }
                    mTwiceBaseCache = array;
                    mTwiceBaseCacheSize++;
                    if (DEBUG) Log.d(TAG, "Storing 2x cache " + array
                            + " now have " + mTwiceBaseCacheSize + " entries");
                }
            }
        } else if (hashes.length == BASE_SIZE) {
            synchronized (ArrayMap.class) {
                if (mBaseCacheSize < CACHE_SIZE) {
                    array[0] = mBaseCache;
                    array[1] = hashes;
                    for (int i=(size<<1)-1; i>=2; i--) {
                        array[i] = null;
                    }
                    mBaseCache = array;
                    mBaseCacheSize++;
                    if (DEBUG) Log.d(TAG, "Storing 1x cache " + array
                            + " now have " + mBaseCacheSize + " entries");
                }
            }
        }
    }
```

具体的利用缓存数组的代码为
```java
	private void allocArrays(final int size) {
        if (mHashes == EMPTY_IMMUTABLE_INTS) {
            throw new UnsupportedOperationException("ArrayMap is immutable");
        }
        if (size == (BASE_SIZE*2)) {
            synchronized (ArrayMap.class) {
                if (mTwiceBaseCache != null) {
                    final Object[] array = mTwiceBaseCache;
                    mArray = array;
                    mTwiceBaseCache = (Object[])array[0];
                    mHashes = (int[])array[1];
                    array[0] = array[1] = null;
                    mTwiceBaseCacheSize--;
                    if (DEBUG) Log.d(TAG, "Retrieving 2x cache " + mHashes
                            + " now have " + mTwiceBaseCacheSize + " entries");
                    return;
                }
            }
        } else if (size == BASE_SIZE) {
            synchronized (ArrayMap.class) {
                if (mBaseCache != null) {
                    final Object[] array = mBaseCache;
                    mArray = array;
                    mBaseCache = (Object[])array[0];
                    mHashes = (int[])array[1];
                    array[0] = array[1] = null;
                    mBaseCacheSize--;
                    if (DEBUG) Log.d(TAG, "Retrieving 1x cache " + mHashes
                            + " now have " + mBaseCacheSize + " entries");
                    return;
                }
            }
        }

        mHashes = new int[size];
        mArray = new Object[size<<1];
    }
```


## 在Android中的应用
在Android Performance Pattern中，官方给出的使用场景为

  1.item数量小于1000，尤其是插入数据和删除数据不频繁的情况。

  2.Map中包含子Map对象


通过本文的介绍，我们对于ArrayMap应该有了一个比较深入的了解。虽然ArrayMap是Android系统中HashMap的一种替代，但是我们在使用时也要注意选择适宜的场景，切莫一概而论。

嗨，我是小广告：欢迎参加我的知乎Live [《我学安卓的那些套路》](https://www.zhihu.com/lives/802899577341620224)
