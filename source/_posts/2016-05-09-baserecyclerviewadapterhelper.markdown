---
layout: post
title: "一个很赞的RecyclerView Adapter辅助类"
date: 2016-05-09 22:18
comments: true
categories: Github RecyclerView Android
---
##是什么
BaseRecyclerViewAdapterHelper是一个强大并且灵活的RecyclerViewAdapter

##能做什么
  * 可以大量减少你Adapter写的代码（和正常的Adapter相比至少三分之二的）
  * 可以添加点击事件
  * 可以很轻松的添加RecyclerView加载动画
  * 添加头部、添加尾部
  * 支持下拉刷新、上拉加载更多
  * 支持分组
  * 支持自定义item类型
  * 支持setEmptyView
  * 支持子布局多个控件的点击事件

<!--more-->

##效果图
![BaseRecyclerAdapterHelperDemo](http://7xqzcv.com1.z0.glb.clouddn.com/base_recycler_adapter_help_demo.gif)

##配置使用
在 build.gradle 的 repositories 添加:
```
allprojects {
    repositories {
        maven { url "https://jitpack.io" }
    }
}
```
然后增加dependencies
```
dependencies {
    compile 'com.github.CymChad:BaseRecyclerViewAdapterHelper:v1.5.8'
}
```

##创建Adapter
```java
public class QuickAdapter extends BaseQuickAdapter<Status> {
    public QuickAdapter(Context context) {
        super(context, R.layout.tweet, DataServer.getSampleData());
    }

    @Override
    protected void convert(BaseViewHolder helper, Status item) {
        helper.setText(R.id.tweetName, item.getUserName())
                .setText(R.id.tweetText, item.getText())
                .setText(R.id.tweetDate, item.getCreatedAt())
                .setImageUrl(R.id.tweetAvatar, item.getUserAvatar())
                .setVisible(R.id.tweetRT, item.isRetweet())
                .linkify(R.id.tweetText);
    }
}
```

##添加item点击事件
```java
mQuickAdapter.setOnRecyclerViewItemClickListener(new BaseQuickAdapter.OnRecyclerViewItemClickListener() {
            @Override
            public void onItemClick(View view, int position) {

            }
});
```

##添加动画
```java
// 一行代码搞定（默认为渐显效果）
quickAdapter.openLoadAnimation();
```

另外也可以制定其他的动画效果
```java
// 默认提供5种方法（渐显、缩放、从下到上，从左到右、从右到左）
// ALPHAIN, SCALEIN, SLIDEIN_BOTTOM, SLIDEIN_LEFT, SLIDEIN_RIGHT
quickAdapter.openLoadAnimation(BaseQuickAdapter.ALPHAIN);
```

另外，如果内置的动画效果不满意，也可易自定义
```java
// 自定义动画如此轻松
quickAdapter.openLoadAnimation(new BaseAnimation() {
    @Override
    public Animator[] getAnimators(View view) {
       return new Animator[]{
            ObjectAnimator.ofFloat(view, "scaleY", 1, 1.1f, 1),
            ObjectAnimator.ofFloat(view, "scaleX", 1, 1.1f, 1)
        };
    }
});
```

##添加多种类型item
```java
public class MultipleItemQuickAdapter extends BaseMultiItemQuickAdapter<MultipleItem> {

    public MultipleItemQuickAdapter(Context context, List data) {
        super(context, data);
        addItmeType(MultipleItem.TEXT, R.layout.text_view);
        addItmeType(MultipleItem.IMG, R.layout.image_view);
    }

    @Override
    protected void convert(BaseViewHolder helper, MultipleItem item) {
        switch (helper.getItemViewType()) {
            case MultipleItem.TEXT:
                helper.setImageUrl(R.id.tv, item.getContent());
                break;
            case MultipleItem.IMG:
                helper.setImageUrl(R.id.iv, item.getContent());
                break;
        }
    }

}
```

##添加头部及底部
```java
mQuickAdapter.addHeaderView(getView());
mQuickAdapter.addFooterView(getView());
```

##加载更多
```java
mQuickAdapter.setOnLoadMoreListener(PAGE_SIZE, new BaseQuickAdapter.RequestLoadMoreListener() {
            @Override
            public void onLoadMoreRequested() {
                if (mCurrentCounter >= TOTAL_COUNTER) {
                    mRecyclerView.post(new Runnable() {
                        @Override
                        public void run() {
                            mQuickAdapter.isNextLoad(false);
                        }
                    });
                } else {
                    // reqData
                    mCurrentCounter = mQuickAdapter.getItemCount();
                    mQuickAdapter.isNextLoad(true);
                }
            }
        });
```

##使用分组
```java
public class SectionAdapter extends BaseSectionQuickAdapter<MySection> {
     public SectionAdapter(Context context, int layoutResId, int sectionHeadResId, List data) {
        super(context, layoutResId, sectionHeadResId, data);
    }
    @Override
    protected void convert(BaseViewHolder helper, MySection item) {
        helper.setImageUrl(R.id.iv, (String) item.t);
    }
    @Override
    protected void convertHead(BaseViewHolder helper,final MySection item) {
        helper.setText(R.id.header, item.header);
        if(!item.isMroe)helper.setVisible(R.id.more,false);
        else
        helper.setOnClickListener(R.id.more, new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Toast.makeText(context,item.header+"more..",Toast.LENGTH_LONG).show();
            }
        });
    }
```


##使用setEmptyView
```java
mQuickAdapter.setEmptyView(getView());
```

##添加子布局多个控件的点击事件
Adapter
```java
protected void convert(BaseViewHolder helper, Status item) {
    helper.setOnClickListener(R.id.tweetAvatar, new OnItemChildClickListener())
      .setOnClickListener(R.id.tweetName, new OnItemChildClickListener());
}
```
Activity
```java
mQuickAdapter.setOnRecyclerViewItemChildClickListener(new BaseQuickAdapter.OnRecyclerViewItemChildClickListener() {
            @Override
            public void onItemChildClick(BaseQuickAdapter adapter, View view, int position) {
                String content = null;
                Status status = (Status) adapter.getItem(position);
                switch (view.getId()) {
                    case R.id.tweetAvatar:
                        content = "img:" + status.getUserAvatar();
                        break;
                    case R.id.tweetName:
                        content = "name:" + status.getUserName();
                        break;
                }
                Toast.makeText(AnimationUseActivity.this, content, Toast.LENGTH_LONG).show();
            }
        });
```

##Repo地址
  * [BaseRecyclerViewAdapterHelper](https://github.com/CymChad/BaseRecyclerViewAdapterHelper)

>博主按：本文原始稿件系网友投稿，经本人修改而成。技术小黑屋接受并欢迎网友投稿，对于每一份稿件，我都会请自审阅并作出修改。欢迎大家投稿。
