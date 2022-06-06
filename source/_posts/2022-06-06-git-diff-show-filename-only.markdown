---
layout: post
title: "终端下 git diff 只展示文件名"
date: 2022-06-06 08:33
comments: true
categories: Bash Git Linux Mac Zsh Terminal 
---

通常我们使用git diff 可以查看具体的内容修改，默认会以patch的形式展示，但是有时候，我们仅仅是希望有一个修改的文件列表，不关心具体的修改内容。

这里完全可以借助 git diff 的一些指令来实现。

<!--more-->
## –name-only

使用 –name-only可以很轻松查看修改的内容信息
```
git diff --name-only
source/_posts/2022-05-08-flutter-run-stuck-with-log-waiting-for-observatory-port-to-be-available.markdown
source/_posts/2022-05-15-how-to-find-duplicated-file-via-one-script.markdown
source/_posts/2022-05-23-disable-debugprint-and-print-in-flutter-dart-release-mode.markdown
source/_posts/2022-05-30-generate-qrcode-in-terminal-on-mac-or-linux.markdown
source/_posts/2022-05-31-2022-618-lizhi-dot-io-apps-with-discounts-android-windows-mac-ios.markdown

```

如果是分支对比，可以这样
```
git diff a143e219b58ac55df84a1b36da98751e7eeaca80..master --name-only
```


## –stat
如果想要获取一些简要的信息，比如修改了多少文件，增加或者删除了多少行数，也可以使用`--stat` 来实现
```
git diff --stat
source/_posts/2022-05-08-flutter-run-stuck-with-log-waiting-for-observatory-port-to-be-available.markdown |  49 ++++++++++++++++++++++++
 source/_posts/2022-05-15-how-to-find-duplicated-file-via-one-script.markdown                              | 171 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 source/_posts/2022-05-23-disable-debugprint-and-print-in-flutter-dart-release-mode.markdown               |  67 ++++++++++++++++++++++++++++++++
 source/_posts/2022-05-30-generate-qrcode-in-terminal-on-mac-or-linux.markdown                             |  40 +++++++++++++++++++
 source/_posts/2022-05-31-2022-618-lizhi-dot-io-apps-with-discounts-android-windows-mac-ios.markdown       |  80 ++++++++++++++++++++++++++++++++++++++
 5 files changed, 407 insertions(+)

```

## --numstat
有时候除了便于人阅读的化，还需要输出一些便于机器阅读的格式，方便后续的编程化处理，进行数据分析。

使用  –numstat 可以到处下面有规律的格式，方便进行分析

```
git diff  --numstat
49      0       source/_posts/2022-05-08-flutter-run-stuck-with-log-waiting-for-observatory-port-to-be-available.markdown
171     0       source/_posts/2022-05-15-how-to-find-duplicated-file-via-one-script.markdown
67      0       source/_posts/2022-05-23-disable-debugprint-and-print-in-flutter-dart-release-mode.markdown
40      0       source/_posts/2022-05-30-generate-qrcode-in-terminal-on-mac-or-linux.markdown
80      0       source/_posts/2022-05-31-2022-618-lizhi-dot-io-apps-with-discounts-android-windows-mac-ios.markdown

```
