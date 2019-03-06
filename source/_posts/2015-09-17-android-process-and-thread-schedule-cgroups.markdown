---
layout: post
title: "Android进程线程调度之cgroups"
date: 2015-09-17 21:17
comments: true
categories: Android
---

做Android开发的同学们，了解cgroups的同学其实不多，cgroups是什么意思呢，在操作系统中有着什么样的作用，以及Android中的cgroups有哪些，各有什么用呢，本文将会进行逐一剖析。
<!--more-->
##先看定义
下面的引用为维基百科的[cgroups的定义](https://zh.wikipedia.org/wiki/Cgroups)
>cgroups，其名称源自控制组群（control groups）的简写，是Linux内核的一个功能，用来限制，控制与分离一个进程组群的资源（如CPU、内存、磁盘输入输出等）。

维基百科的解释言简意赅，无需赘述，下面以例子讲解如何使用cgroups。

##结合示例
以下会以Fedora这个Linux发行版为例，介绍如何使用cgroups限制进程的CPU使用率。

这里我们使用一个死循环的Python脚本用来消耗CPU，文件名为loop.py，。
```python
#!/usr/bin/env python
# coding=utf-8
i = 0
while True:
    i = i + 1
```

执行脚本`python loop.py`，使用top查看该进程的CPU使用情况,CPU使用率接近100%。

然后我们将会通过修改配置，利用cgroups将该进程的CPU使用率降低到10%

首先查看当前系统的cgroups
```bash
16:31:57-androidyue/tmp$ sudo mount -t cgroup 
[sudo] password for androidyue: 
cgroup on /sys/fs/cgroup/systemd type cgroup (rw,nosuid,nodev,noexec,relatime,release_agent=/usr/lib/systemd/systemd-cgroups-agent,name=systemd)
cgroup on /sys/fs/cgroup/cpuset type cgroup (rw,nosuid,nodev,noexec,relatime,cpuset)
cgroup on /sys/fs/cgroup/cpu,cpuacct type cgroup (rw,nosuid,nodev,noexec,relatime,cpuacct,cpu)
cgroup on /sys/fs/cgroup/memory type cgroup (rw,nosuid,nodev,noexec,relatime,memory)
cgroup on /sys/fs/cgroup/devices type cgroup (rw,nosuid,nodev,noexec,relatime,devices)
cgroup on /sys/fs/cgroup/freezer type cgroup (rw,nosuid,nodev,noexec,relatime,freezer)
cgroup on /sys/fs/cgroup/net_cls type cgroup (rw,nosuid,nodev,noexec,relatime,net_cls)
cgroup on /sys/fs/cgroup/blkio type cgroup (rw,nosuid,nodev,noexec,relatime,blkio)
cgroup on /sys/fs/cgroup/perf_event type cgroup (rw,nosuid,nodev,noexec,relatime,perf_event)
```

然后创建一个cgroup,控制CPU使用率。
```bash
cd /sys/fs/cgroup/cpu
sudo mkdir cpu_test
```

接下来查看刚刚创建的cpu_test
```bash
17:04:54-androidyue/sys/fs/cgroup/cpu$ ls cpu_test/
cgroup.clone_children  cgroup.procs  cpuacct.usage         cpu.cfs_period_us  cpu.rt_period_us   cpu.shares  notify_on_release
cgroup.event_control   cpuacct.stat  cpuacct.usage_percpu  cpu.cfs_quota_us   cpu.rt_runtime_us  cpu.stat    tasks
```

完成这一目标修改涉及到的文件有

cpu.cfs_period_us
设置该cgroup请求到CPU资源分配的周期，单位为微秒（这里使用us代替微秒单位µs）。

cpu.cfs_quota_us
设置cgroup组内的进程在一次CPU分配周期（即cpu.cfs_period_us指定的值）内可以执行的时间。

如果我们想要设置该cpu_test组内的cpu使用率为10%，我们需要这样修改
```
echo 1000000 > cpu.cfs_period_us
echo 100000 > cpu.cfs_quota_us 
```
注意上述修改需要使用root身份登陆，即`sudo -i`,下面的将进程加入cgroup同样需要root身份。



将上图中的进程ID 写入到cpu_test下的tasks文件中，并查看tasks验证是否加入成功
```bash
17:12:27-root/sys/fs/cgroup/cpu/cpu_test$ sudo echo 12093 > tasks 
17:12:41-root/sys/fs/cgroup/cpu/cpu_test$ cat tasks
12093
```

再次查看进程id为12093的CPU使用率，已成功降低到10%左右。

##cgroups在Android中的应用
在Android中也存在cgroups，涉及到CPU的目前只有两个，一个是apps，路径为`/dev/cpuctl/apps`。另一个是bg_non_interactive，路径为`/dev/cpuctl/apps/bg_non_interactive`

###cpu.share
cpu.share文件中保存了整数值，用来设置cgroup分组任务获得CPU时间的相对值。举例来说，cgroup A和cgroup B的cpu.share值都是1024，那么cgroup A 与cgroup B中的任务分配到的CPU时间相同，如果cgroup C的cpu.share为512，那么cgroup C中的任务获得的CPU时间是A或B的一半。

apps下的cpu.share 值为1024
```bash
root@htc_m8tl:/dev/cpuctl/apps # cat cpu.shares 
1024
```
bg_non_interactive下的cpu_share值为52
```bash
root@htc_m8tl:/dev/cpuctl/apps/bg_non_interactive # cat cpu.shares
52
```
也就是说apps分组与bg_non_interactive分组cpu.share值相比接近于20:1。由于Android中只有这两个cgroup，也就是说apps分组中的应用可以利用95%的CPU，而处于bg_non_interactive分组中的应用则只能获得5%的CPU利用率。


##cpu.rt_period_us与cpu.rt_runtime_us
cpu.rt_period_us用来设置cgroup获得CPU资源的周期，单位为微秒。
cpu.rt_runtime_us用来设置cgroup中的任务可以最长获得CPU资源的时间，单位为微秒。设定这个值可以访问某个cgroup独占CPU资源。最长的获取CPU资源时间取决于逻辑CPU的数量。比如cpu.rt_runtime_us设置为200000（0.2秒），cpu.rt_period_us设置为1000000（1秒）。在单个逻辑CPU上的获得时间为每秒为0.2秒。 2个逻辑CPU，获得的时间则是0.4秒。

apps分组下的两个配置的值
```bash
root@htc_m8tl:/dev/cpuctl/apps # cat cpu.rt_period_us
1000000
root@htc_m8tl:/dev/cpuctl/apps # cat cpu.rt_runtime_us
800000
```
即单个逻辑CPU下每一秒内可以获得0.8秒的执行时间。

bg_non_interactive分组下的两个配置的值
```bash
root@htc_m8tl:/dev/cpuctl/apps/bg_non_interactive # cat cpu.rt_period_us 
1000000
root@htc_m8tl:/dev/cpuctl/apps/bg_non_interactive # cat cpu.rt_runtime_us
700000
```
即单个逻辑CPU下每一秒可以获得0.7秒的执行时间。

###花落谁家
在Android中，一个应用（进程）既可以由apps切换到bg_non_interactive，也可以切换回来。

####Activity
当一个Activity处于可见的状态下，那么这个应用进程就属于apps分组。


####Service
当Service调用startForeground方法后，那么这个应用进程则是归类于apps分组
```java
Notification.Builder  builder = new Notification.Builder(this);
builder.setContentTitle("Title");
Notification notification = builder.build();
startForeground(notification.hashCode(), notification);
```

###如何确定进程的cgroups
其实确定过程也很简单，总共分三步。

第一步，进入已经root的Android设备终端
```
11:10 $ adb shell
root@htc_m8tl:/ # su
root@htc_m8tl:/ #
```

第二步，目标应用的进程id，这里以我们的demo程序（包名为com.droidyue.androidthreadschedule）为例。得到的进程id为22871
```
root@htc_m8tl:/ # ps | grep com.droidyue
u0_a1434  22871 23723 970040 54304 ffffffff 400a045c S com.droidyue.androidthreadschedule
```

第三步，利用进程id查看其所在的cgroups
```
2|root@htc_m8tl:/ # cat  /proc/22871/cgroup
3:cpu:/apps
2:memory:/
1:cpuacct:/uid/11434
```

通过以上三步，<del>我们就能把大象关冰箱里</del>,我们就能得到进程所在的cgroups分组。



##利用cgroups我们可以做什么
其实对于一般应用来说，能做的事情少之又少。对于有需要的应用可以使用Service.startForeground方法来获取更多的CPU资源，但并不建议盲目去这样做，还是要根据自身应用需要实现。

另外，个人认为最大的收获，就是我们可以参照cgroups的分组的思想来设计有类似场景的方案解决实际问题。

###同系列文章
  * [剖析Android中进程与线程调度之nice](/blog/2015/09/05/android-process-and-thread-schedule-nice/?droid_refer=series)

{%include post/book_copyright.html %}
