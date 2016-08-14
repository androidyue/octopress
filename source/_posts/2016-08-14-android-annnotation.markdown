---
layout: post
title: "探究Android中的注解"
date: 2016-08-14 20:42
comments: true
categories: Android
---

本文系GDG Android Meetup分享内容总结文章

注解是我们经常接触的技术,Java有注解,Android也有注解,本文将试图介绍Android中的注解,以及ButterKnife和Otto这些基于注解的库的一些工作原理.

归纳而言,Android中的注解大概有以下好处

  * 提高我们的开发效率
  * 更早的发现程序的问题或者错误
  * 更好的增加代码的描述能力
  * 更加利于我们的一些规范约束
  * 提供解决问题的更优解

<!--more-->
## 准备工作
默认情况下,Android中的注解包并没有包括在framework中,它独立成一个单独的包,通常我们需要引入这个包.
```
dependencies {
    compile 'com.android.support:support-annotations:22.2.0'
}
```

但是如果我们已经引入了`appcompat`则没有必要再次引用`support-annotations`,因为`appcompat`默认包含了对其引用.

## 替代枚举
在最早的时候,当我们想要做一些值得限定实现枚举的效果,通常是

  * 定义几个常量用于限定
  * 从上面的常量选取值进行使用
  
一个比较描述上面问题的示例代码如下
```java
public static final int COLOR_RED = 0;
public static final int COLOR_GREEN = 1;
public static final int COLOR_YELLOW = 2;

public void setColor(int color) {
    //some code here
}
//调用
setColor(COLOR_RED)
```

然而上面的还是有不尽完美的地方

  * `setColor(COLOR_RED)`与`setColor(0)`效果一样,而后者可读性很差,但却可以正常运行
  * setColor方法可以接受枚举之外的值,比如`setColor(3)`,这种情况下程序可能出问题
  
一个相对较优的解决方法就是使用Java中的Enum.使用枚举实现的效果如下
```java
// ColorEnum.java
public enum ColorEmun {
    RED,
    GREEN,
    YELLOW
}

public void setColorEnum(ColorEmun colorEnum) {
    //some code here
}

setColorEnum(ColorEmun.GREEN);
```
然而Enum也并非最佳,Enum因为其相比方案一的常量来说,占用内存相对大很多而受到曾经被Google列为不建议使用,为此Google特意引入了一些相关的注解来替代枚举.

Android中新引入的替代枚举的注解有`IntDef`和`StringDef`,这里以`IntDef`做例子说明一下.
```
public class Colors {
    @IntDef({RED, GREEN, YELLOW})
    @Retention(RetentionPolicy.SOURCE)
    public @interface LightColors{}

    public static final int RED = 0;
    public static final int GREEN = 1;
    public static final int YELLOW = 2;
}
```

  * 声明必要的int常量
  * 声明一个注解为LightColors
  * 使用@IntDef修饰LightColors,参数设置为待枚举的集合
  * 使用@Retention(RetentionPolicy.SOURCE)指定注解仅存在与源码中,不加入到class文件中


## Null相关的注解
和Null相关的注解有两个

    @Nullable 注解的元素可以是Null
    @NonNull 注解的元素不能是Null
    
上面的两个可以修饰如下的元素

  * 成员属性
  * 方法参数
  * 方法的返回值

```java
@Nullable
private String obtainReferrerFromIntent(@NonNull Intent intent) {
    return intent.getStringExtra("apps_referrer");
}
```

NonNull检测生效的条件

  * 显式传入null
  * 在调用方法之前已经判断了参数为null时

```java
setReferrer(null);//提示警告

//不提示警告
String referrer = getIntent().getStringExtra("apps_referrer");
setReferrer(referrer);

//提示警告
String referrer = getIntent().getStringExtra("apps_referrer");
if (referrer == null) {
    setReferrer(referrer);
}

private void setReferrer(@NonNull String referrer) {
    //some code here
}
```


## 区间范围注解
Android中的IntRange和FloatRange是两个用来限定区间范围的注解,

```java
float currentProgress;

public void setCurrentProgress(@FloatRange(from=0.0f, to=1.0f) float progress) {
    currentProgress = progress;
}
```
如果我们传入非法的值,如下所示
```java
setCurrentProgress(11);
```
就会得到这样的错误
```java
Value must be >=0.0 and <= 1.0(was 11)
```

## 长度以及数组大小限制

限制字符串的长度
```java
private void setKey(@Size(6) String key) {
}
```
限定数组集合的大小
```java
private void setData(@Size(max = 1) String[] data) {
}
setData(new String[]{"b", "a"});//error occurs
```
限定特殊的数组长度,比如3的倍数
```java
private void setItemData(@Size(multiple = 3) String[] data) {
}
```

## 权限相关
在Android中,有很多场景都需要使用权限,无论是Marshmallow之前还是之后的动态权限管理.都需要在manifest中进行声明,如果忘记了,则会导致程序崩溃.
好在有一个注解能辅助我们避免这个问题.使用RequiresPermission注解即可.
```java
@RequiresPermission(Manifest.permission.SET_WALLPAPER)
    public void changeWallpaper(Bitmap bitmap) throws IOException {
}
```


## 资源注解
在Android中几乎所有的资源都可以有对应的资源id.比如获取定义的字符串,我们可以通过下面的方法
```java
public String getStringById(int stringResId) {
    return getResources().getString(stringResId);
}
```

使用这个方法,我们可以很容易的获取到定义的字符串,但是这样的写法也存在着风险.
```
 getStringById(R.mipmap.ic_launcher)
```
如果我们在不知情或者疏忽情况下,传入这样的值,就会出现问题.
但是如果我们使用资源相关的注解修饰了参数,就能很大程度上避免错误的情况.
```java
public String getStringById(@StringRes  int stringResId) {
    return getResources().getString(stringResId);
}
```
在Android中资源注解如下所示

  * AnimRes
  * AnimatorRes
  * AnyRes
  * ArrayRes
  * AttrRes
  * BoolRes
  * ColorRes
  * DimenRes
  * DrawableRes
  * FractionRes
  * IdRes
  * IntegerRes
  * InterpolatorRes
  * LayoutRes
  * MenuRes
  * PluralsRes
  * RawRes
  * StringRes
  * StyleRes
  * StyleableRes
  * TransitionRes
  * XmlRes

## Color值限定
上面部分提到了`ColorRes`,用来限定颜色资源id,这里我们将使用`ColorInt`,一个用来限定Color值的注解.
在较早的TextView的setTextColor是这样实现的.
```java
public void setTextColor(int color) {
    mTextColor = ColorStateList.valueOf(color);
    updateTextColors();
}
```
然而上面的方法在调用时常常会出现这种情况
```java
myTextView.setTextColor(R.color.colorAccent);
```
如上,如果传递过去的参数为color的资源id就会出现颜色取错误的问题,这个问题在过去还是比较严重的.好在`ColorInt`出现了,改变了这一问题.
```java
public void setTextColor(@ColorInt int color) {
    mTextColor = ColorStateList.valueOf(color);
    updateTextColors();
}
```
当我们再次传入Color资源值时,就会得到错误的提示.

## CheckResult
这是一个关于返回结果的注解，用来注解方法，如果一个方法得到了结果，却没有使用这个结果，就会有错误出现，一旦出现这种错误，就说明你没有正确使用该方法。
```java
@CheckResult
public String trim(String s) {
    return s.trim();
}
```

## 线程相关
Android中提供了四个与线程相关的注解

  * @UiThread,通常可以等同于主线程,标注方法需要在UIThread执行,比如View类就使用这个注解
  * @MainThread 主线程,经常启动后创建的第一个线程
  * @WorkerThread 工作者线程,一般为一些后台的线程,比如AsyncTask里面的doInBackground就是这样的.
  * @BinderThread 注解方法必须要在BinderThread线程中执行,一般使用较少.

一些示例
```java
    new AsyncTask<Void, Void, Void>() {
            //doInBackground is already annotated with @WorkerThread
            @Override
            protected Void doInBackground(Void... params) {
                return null;
                updateViews();//error
            }
        };
        
    @UiThread
    public void updateViews() {
        Log.i(LOGTAG, "updateViews ThreadInfo=" + Thread.currentThread());
    }
```

注意,这种情况下不会出现错误提示
```
new Thread(){
    @Override
    public void run() {
        super.run();
        updateViews();
    }
}.start();
```
虽然updateViews会在一个新的工作者线程中执行,但是在compile时没有错误提示.

因为它的判断依据是,如果updateView的线程注解(这里为@UiThread)和run(没有线程注解)不一致才会错误提示.如果run方法没有线程注解,则不提示.

## CallSuper
重写的方法必须要调用super方法

使用这个注解,我们可以强制方法在重写时必须调用父类的方法
比如Application的`onCreate`,`onConfigurationChanged`等.

## Keep
在Android编译生成APK的环节,我们通常需要设置minifyEnabled为true实现下面的两个效果

  * 混淆代码
  * 删除没有用的代码

但是出于某一些目的,我们需要不混淆某部分代码或者不删除某处代码,除了配置复杂的Proguard文件之外,我们还可以使用@Keep注解
.
```java
@Keep
public static int getBitmapWidth(Bitmap bitmap) {
    return bitmap.getWidth();
}
```

  
## ButterKnife
ButterKnife是一个用来绑定View,资源和回调的提高效率的工具.作者为Jake Wharton.
ButterKnife的好处

  * 使用BindView替代繁琐的findViewById和类型转换
  * 使用OnClick注解方法来替换显式声明的匿名内部类
  * 使用BindString,BindBool,BindDrawable等注解实现资源获取

一个摘自Github的示例
```java
class ExampleActivity extends Activity {
  @BindView(R.id.user) EditText username;
  @BindView(R.id.pass) EditText password;

  @BindString(R.string.login_error) String loginErrorMessage;

  @OnClick(R.id.submit) void submit() {
    // TODO call server...
  }

  @Override public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.simple_activity);
    ButterKnife.bind(this);
    // TODO Use fields...
  }
}
```

### ButterKnife工作原理
以BindView注解使用为例,示例代码为
```java
public class MainActivity extends AppCompatActivity {
    @BindView(R.id.myTextView)
    TextView myTextView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        ButterKnife.bind(this);
    }
}
```

  1.程序在compile时,会根据注解自动生成两个类,这里为**MainActivity_ViewBinder.class**和**MainActivity_ViewBinding.class**    
  2.当我们调用`ButterKnife.bind(this);`时,会查找当前类对应的ViewBinder类,并调用bind方法,这里会调用到`MainActiivty_ViewBinder.bind`方法.  
  3.MainActiivty_ViewBinder.bind方法实际上是调用了findViewById然后在进行类型转换,赋值给MainActivity的myTextView属性

ButterKnife的bind方法  
```java
public static Unbinder bind(@NonNull Activity target) {
    return getViewBinder(target).bind(Finder.ACTIVITY, target, target);
}
```
ButterKnife的`getViewBinder`和`findViewBinderForClass`
```java
@NonNull @CheckResult @UiThread
  static ViewBinder<Object> getViewBinder(@NonNull Object target) {
    Class<?> targetClass = target.getClass();
    if (debug) Log.d(TAG, "Looking up view binder for " + targetClass.getName());
    return findViewBinderForClass(targetClass);
  }

  @NonNull @CheckResult @UiThread
  private static ViewBinder<Object> findViewBinderForClass(Class<?> cls) {
   //如果内存集合BINDERS中包含,则不再查找
    ViewBinder<Object> viewBinder = BINDERS.get(cls);
    if (viewBinder != null) {
      if (debug) Log.d(TAG, "HIT: Cached in view binder map.");
      return viewBinder;
    }
    String clsName = cls.getName();
    if (clsName.startsWith("android.") || clsName.startsWith("java.")) {
      if (debug) Log.d(TAG, "MISS: Reached framework class. Abandoning search.");
      return NOP_VIEW_BINDER;
    }
    //noinspection TryWithIdenticalCatches Resolves to API 19+ only type.
    try {
      //使用反射创建实例
      Class<?> viewBindingClass = Class.forName(clsName + "_ViewBinder");
      //noinspection unchecked
      viewBinder = (ViewBinder<Object>) viewBindingClass.newInstance();
      if (debug) Log.d(TAG, "HIT: Loaded view binder class.");
    } catch (ClassNotFoundException e) {
        //如果没有找到,对父类进行查找
      if (debug) Log.d(TAG, "Not found. Trying superclass " + cls.getSuperclass().getName());
      viewBinder = findViewBinderForClass(cls.getSuperclass());
    } catch (InstantiationException e) {
      throw new RuntimeException("Unable to create view binder for " + clsName, e);
    } catch (IllegalAccessException e) {
      throw new RuntimeException("Unable to create view binder for " + clsName, e);
    }
    //加入内存集合,便于后续的查找
    BINDERS.put(cls, viewBinder);
    return viewBinder;
  }
```

MainActivity_ViewBinder的反编译源码
```java
➜  androidannotationsample javap -c MainActivity_ViewBinder
Warning: Binary file MainActivity_ViewBinder contains com.example.admin.androidannotationsample.MainActivity_ViewBinder
Compiled from "MainActivity_ViewBinder.java"
public final class com.example.admin.androidannotationsample.MainActivity_ViewBinder implements butterknife.internal.ViewBinder<com.example.admin.androidannotationsample.MainActivity> {
  public com.example.admin.androidannotationsample.MainActivity_ViewBinder();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public butterknife.Unbinder bind(butterknife.internal.Finder, com.example.admin.androidannotationsample.MainActivity, java.lang.Object);
    Code:
       0: new           #2                  // class com/example/admin/androidannotationsample/MainActivity_ViewBinding
       3: dup
       4: aload_2
       5: aload_1
       6: aload_3                           // 创建ViewBinding实例
       7: invokespecial #3                  // Method com/example/admin/androidannotationsample/MainActivity_ViewBinding."<init>":(Lcom/example/admin/androidannotationsample/MainActivity;Lbutterknife/internal/Finder;Ljava/lang/Object;)V
      10: areturn

  public butterknife.Unbinder bind(butterknife.internal.Finder, java.lang.Object, java.lang.Object);
    Code:
       0: aload_0
       1: aload_1
       2: aload_2
       3: checkcast     #4                  // class com/example/admin/androidannotationsample/MainActivity
       6: aload_3                           //调用上面的重载方法
       7: invokevirtual #5                  // Method bind:(Lbutterknife/internal/Finder;Lcom/example/admin/androidannotationsample/MainActivity;Ljava/lang/Object;)Lbutterknife/Unbinder;
      10: areturn
}
```

MainActivity_ViewBinding的反编译源码
```java
➜  androidannotationsample javap -c MainActivity_ViewBinding
Warning: Binary file MainActivity_ViewBinding contains com.example.admin.androidannotationsample.MainActivity_ViewBinding
Compiled from "MainActivity_ViewBinding.java"
public class com.example.admin.androidannotationsample.MainActivity_ViewBinding<T extends com.example.admin.androidannotationsample.MainActivity> implements butterknife.Unbinder {
  protected T target;

  public com.example.admin.androidannotationsample.MainActivity_ViewBinding(T, butterknife.internal.Finder, java.lang.Object);
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: aload_0
       5: aload_1
       6: putfield      #2                  // Field target:Lcom/example/admin/androidannotationsample/MainActivity;
       9: aload_1
      10: aload_2
      11: aload_3                           //调用Finder.findRequireViewAsType找到View,并进行类型转换,并复制给MainActivity中对一个的变量
      12: ldc           #4                  // int 2131427412
      14: ldc           #5                  // String field 'myTextView'
      16: ldc           #6                  // class android/widget/TextView
                                            // 内部实际调用了findViewById
      18: invokevirtual #7                  // Method butterknife/internal/Finder.findRequiredViewAsType:(Ljava/lang/Object;ILjava/lang/String;Ljava/lang/Class;)Ljava/lang/Object;
      21: checkcast     #6                  // class android/widget/TextView
      24: putfield      #8                  // Field com/example/admin/androidannotationsample/MainActivity.myTextView:Landroid/widget/TextView;
      27: return

  public void unbind();
    Code:
       0: aload_0
       1: getfield      #2                  // Field target:Lcom/example/admin/androidannotationsample/MainActivity;
       4: astore_1
       5: aload_1
       6: ifnonnull     19
       9: new           #9                  // class java/lang/IllegalStateException
      12: dup
      13: ldc           #10                 // String Bindings already cleared.
      15: invokespecial #11                 // Method java/lang/IllegalStateException."<init>":(Ljava/lang/String;)V
      18: athrow
      19: aload_1
      20: aconst_null                       // 解除绑定,设置对应的变量为null
      21: putfield      #8                  // Field com/example/admin/androidannotationsample/MainActivity.myTextView:Landroid/widget/TextView;
      24: aload_0
      25: aconst_null
      26: putfield      #2                  // Field target:Lcom/example/admin/androidannotationsample/MainActivity;
      29: return
}
```

Finder的源码
```java
package butterknife.internal;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.support.annotation.IdRes;
import android.view.View;

@SuppressWarnings("UnusedDeclaration") // Used by generated code.
public enum Finder {
  VIEW {
    @Override public View findOptionalView(Object source, @IdRes int id) {
      return ((View) source).findViewById(id);
    }

    @Override public Context getContext(Object source) {
      return ((View) source).getContext();
    }

    @Override protected String getResourceEntryName(Object source, @IdRes int id) {
      final View view = (View) source;
      // In edit mode, getResourceEntryName() is unsupported due to use of BridgeResources
      if (view.isInEditMode()) {
        return "<unavailable while editing>";
      }
      return super.getResourceEntryName(source, id);
    }
  },
  ACTIVITY {
    @Override public View findOptionalView(Object source, @IdRes int id) {
      return ((Activity) source).findViewById(id);
    }

    @Override public Context getContext(Object source) {
      return (Activity) source;
    }
  },
  DIALOG {
    @Override public View findOptionalView(Object source, @IdRes int id) {
      return ((Dialog) source).findViewById(id);
    }

    @Override public Context getContext(Object source) {
      return ((Dialog) source).getContext();
    }
  };

  //查找对应的Finder,如上面的ACTIVITY, DIALOG, VIEW
  public abstract View findOptionalView(Object source, @IdRes int id);

  
  public final <T> T findOptionalViewAsType(Object source, @IdRes int id, String who,
      Class<T> cls) {
    View view = findOptionalView(source, id);
    return castView(view, id, who, cls);
  }

  public final View findRequiredView(Object source, @IdRes int id, String who) {
    View view = findOptionalView(source, id);
    if (view != null) {
      return view;
    }
    String name = getResourceEntryName(source, id);
    throw new IllegalStateException("Required view '"
        + name
        + "' with ID "
        + id
        + " for "
        + who
        + " was not found. If this view is optional add '@Nullable' (fields) or '@Optional'"
        + " (methods) annotation.");
  }

  //来自ViewBinding的调用
  public final <T> T findRequiredViewAsType(Object source, @IdRes int id, String who,
      Class<T> cls) {
    View view = findRequiredView(source, id, who);
    return castView(view, id, who, cls);
  }

  public final <T> T castView(View view, @IdRes int id, String who, Class<T> cls) {
    try {
      return cls.cast(view);
    } catch (ClassCastException e) {
      String name = getResourceEntryName(view, id);
      throw new IllegalStateException("View '"
          + name
          + "' with ID "
          + id
          + " for "
          + who
          + " was of the wrong type. See cause for more info.", e);
    }
  }

  @SuppressWarnings("unchecked") // That's the point.
  public final <T> T castParam(Object value, String from, int fromPos, String to, int toPos) {
    try {
      return (T) value;
    } catch (ClassCastException e) {
      throw new IllegalStateException("Parameter #"
          + (fromPos + 1)
          + " of method '"
          + from
          + "' was of the wrong type for parameter #"
          + (toPos + 1)
          + " of method '"
          + to
          + "'. See cause for more info.", e);
    }
  }

  protected String getResourceEntryName(Object source, @IdRes int id) {
    return getContext(source).getResources().getResourceEntryName(id);
  }

  public abstract Context getContext(Object source);
}
```


## Otto
Otto Bus 是一个专为Android改装的Event Bus,在很多项目中都有应用.由Square开源共享.
```java
public class EventBusTest {
    private static final String LOGTAG = "EventBusTest";
    Bus mBus  = new Bus();

    public void test() {
        mBus.register(this);
    }

    class NetworkChangedEvent {

    }

    @Produce
    public NetworkChangedEvent sendNetworkChangedEvent() {
        return new NetworkChangedEvent();
    }


    @Subscribe
    public void onNetworkChanged(NetworkChangedEvent event) {
        Log.i(LOGTAG, "onNetworkChanged event=" + event);
    }
}
```

## Otto 的工作原理
  * 使用@Produce和@Subscribe标记方法
  * 当调用bus.register方法,去检索注册对象的标记方法,并cache映射关系
  * 当post事件时,将事件与handler方法对应加入事件队列
  * 抽取事件队列,然后调用handler处理

如下为对Otto如何利用注解的分析

register的源码

```java
public void register(Object object) {
    if (object == null) {
      throw new NullPointerException("Object to register must not be null.");
    }
    enforcer.enforce(this);
    //查找object中的Subscriber
    Map<Class<?>, Set<EventHandler>> foundHandlersMap = handlerFinder.findAllSubscribers(object);
    for (Class<?> type : foundHandlersMap.keySet()) {
      Set<EventHandler> handlers = handlersByType.get(type);
      if (handlers == null) {
        //concurrent put if absent
        Set<EventHandler> handlersCreation = new CopyOnWriteArraySet<EventHandler>();
        handlers = handlersByType.putIfAbsent(type, handlersCreation);
        if (handlers == null) {
            handlers = handlersCreation;
        }
      }
      final Set<EventHandler> foundHandlers = foundHandlersMap.get(type);
      if (!handlers.addAll(foundHandlers)) {
        throw new IllegalArgumentException("Object already registered.");
      }
    }

    for (Map.Entry<Class<?>, Set<EventHandler>> entry : foundHandlersMap.entrySet()) {
      Class<?> type = entry.getKey();
      EventProducer producer = producersByType.get(type);
      if (producer != null && producer.isValid()) {
        Set<EventHandler> foundHandlers = entry.getValue();
        for (EventHandler foundHandler : foundHandlers) {
          if (!producer.isValid()) {
            break;
          }
          if (foundHandler.isValid()) {
            dispatchProducerResultToHandler(foundHandler, producer);
          }
        }
      }
    }
  }
```

HandlerFinder源码
```java
interface HandlerFinder {

  Map<Class<?>, EventProducer> findAllProducers(Object listener);

  Map<Class<?>, Set<EventHandler>> findAllSubscribers(Object listener);

  //Otto注解查找器
  HandlerFinder ANNOTATED = new HandlerFinder() {
    @Override
    public Map<Class<?>, EventProducer> findAllProducers(Object listener) {
      return AnnotatedHandlerFinder.findAllProducers(listener);
    }

    @Override
    public Map<Class<?>, Set<EventHandler>> findAllSubscribers(Object listener) {
      return AnnotatedHandlerFinder.findAllSubscribers(listener);
    }
  };
```

具体查找实现
```java
/** This implementation finds all methods marked with a {@link Subscribe} annotation. */
  static Map<Class<?>, Set<EventHandler>> findAllSubscribers(Object listener) {
    Class<?> listenerClass = listener.getClass();
    Map<Class<?>, Set<EventHandler>> handlersInMethod = new HashMap<Class<?>, Set<EventHandler>>();

    Map<Class<?>, Set<Method>> methods = SUBSCRIBERS_CACHE.get(listenerClass);
    if (null == methods) {
      methods = new HashMap<Class<?>, Set<Method>>();
      loadAnnotatedSubscriberMethods(listenerClass, methods);
    }
    if (!methods.isEmpty()) {
      for (Map.Entry<Class<?>, Set<Method>> e : methods.entrySet()) {
        Set<EventHandler> handlers = new HashSet<EventHandler>();
        for (Method m : e.getValue()) {
          handlers.add(new EventHandler(listener, m));
        }
        handlersInMethod.put(e.getKey(), handlers);
      }
    }

    return handlersInMethod;
  }
```



以上就是关于Android中注解的一些总结,文章部分内容参考自 [Support Annotations](http://tools.android.com/tech-docs/support-annotations) ,希望能帮助大家对注解有基础的认识,并运用到实际的日常开发之中.


参考文章:

  * [http://tools.android.com/tech-docs/support-annotations](http://tools.android.com/tech-docs/support-annotations)

