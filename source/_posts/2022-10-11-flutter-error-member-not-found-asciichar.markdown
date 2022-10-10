---
layout: post
title: "Flutter 处理 Error Setter not found AsciiChar 问题"
date: 2022-10-11 07:35
comments: true
categories: Flutter dart 
---

当我们进行了 flutter 升级后，有时候运行程序会发现无法编译，出现下面这样的错误

```bash
[        ] [   +2 ms] ../../../../.pub-cache/hosted/pub.flutter-io.cn/cached_network_image-3.2.0/lib/src/image_provider/multi_image_stream_completer.dart:152:22: Warning: Operand of null-aware operation '?.' has
type 'SchedulerBinding' which excludes null.
[        ] [        ]  - 'SchedulerBinding' is from 'package:flutter/src/scheduler/binding.dart' ('../../../../code/flutter_3/packages/flutter/lib/src/scheduler/binding.dart').
[        ] [        ]     SchedulerBinding.instance?.scheduleFrameCallback(_handleAppFrame);
[        ] [        ]                      ^
[ +402 ms] [ +414 ms] ../../../../.pub-cache/hosted/pub.flutter-io.cn/win32-2.3.1/lib/src/structs.g.dart:554:31: Error: Member not found: 'UnicodeChar'.
[        ] [        ]   int get UnicodeChar => Char.UnicodeChar;
[        ] [        ]                               ^^^^^^^^^^^
[        ] [        ] ../../../../.pub-cache/hosted/pub.flutter-io.cn/win32-2.3.1/lib/src/structs.g.dart:555:38: Error: Setter not found: 'UnicodeChar'.
[        ] [        ]   set UnicodeChar(int value) => Char.UnicodeChar = value;
[        ] [        ]                                      ^^^^^^^^^^^
[        ] [        ] ../../../../.pub-cache/hosted/pub.flutter-io.cn/win32-2.3.1/lib/src/structs.g.dart:557:29: Error: Member not found: 'AsciiChar'.
[        ] [        ]   int get AsciiChar => Char.AsciiChar;
[        ] [        ]                             ^^^^^^^^^
[        ] [        ] ../../../../.pub-cache/hosted/pub.flutter-io.cn/win32-2.3.1/lib/src/structs.g.dart:558:36: Error: Setter not found: 'AsciiChar'.
[        ] [        ]   set AsciiChar(int value) => Char.AsciiChar = value;
[        ] [        ]                                    ^^^^^^^^^

```

<!--more-->

对于这种问题，解决起来也比较简单，执行
```bash
flutter pub upgrade
```

