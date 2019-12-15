---
layout: post
title: "终端依赖者福利：终端也能实现翻译功能了"
date: 2019-12-15 19:41
comments: true
categories: Linux Mac Terminal Shell Translate Bash Google Yandex Bing trans 
---

一直是终端重度依赖，现在发现了一个终端翻译的工具，更加爱不释手。本文介绍一下一个终端可以实现的工具，trans。


## 是什么
> Command-line translator using Google Translate, Bing Translator, Yandex.Translate, etc

> 一个终端翻译工具，利用Google翻译，Bing翻译，Yandex翻译等。


<!--more-->

## 效果
```bash
$ trans Android
Android

noun
    (in science fiction) a robot with a human appearance.
        - "The science fiction fascination with robots and androids is the culmination of this perception of machines as being almost like one of us."
    Synonyms: robot, automaton, cyborg, droid, bot

    an open-source operating system used for smartphones and tablet computers.
        - "I have an Android phone and I like it a lot"

Synonyms
    noun
        - robot, automaton, cyborg, droid, bot
        - humanoid
```

## 安装
### Debian/Ubuntu
```bash
 sudo apt-get install translate-shell
```

### Homebrew Mac
```bash
brew install translate-shell
```

更多安装方式，请查看[https://github.com/soimort/translate-shell/wiki/Distros](https://github.com/soimort/translate-shell/wiki/Distros)

## 查看支持的搜索引擎
```bash
 trans -list-engines
  aspell
* google
  bing
  spell
  hunspell
  apertium
  yandex
```

## 设置搜索引擎
```bash
trans -engine yandex  Android
Android

Android

[ English -> English ]
```

## 设置源语言和目标语言

前面的是源语言，后面的是目标语言，比如下面的`en:zh`就是将英文翻译成中文

```bash
 trans   en:zh Android
Android

Android的
(Android de)

Translations of Android
[ English -> 简体中文 ]

Android
    Android的, 安卓, 的Android, Android版, Android电子
```



## 查看语言代码
```bash
trans -R
┌───────────────────────┬───────────────────────┬───────────────────────┐
│ Afrikaans      -   af │ Hebrew         -   he │ Portuguese     -   pt │
│ Albanian       -   sq │ Hill Mari      -  mrj │ Punjabi        -   pa │
│ Amharic        -   am │ Hindi          -   hi │ Querétaro Otomi-  otq │
│ Arabic         -   ar │ Hmong          -  hmn │ Romanian       -   ro │
│ Armenian       -   hy │ Hmong Daw      -  mww │ Russian        -   ru │
│ Azerbaijani    -   az │ Hungarian      -   hu │ Samoan         -   sm │
│ Bashkir        -   ba │ Icelandic      -   is │ Scots Gaelic   -   gd │
│ Basque         -   eu │ Igbo           -   ig │ Serbian (Cyr...-sr-Cyrl
│ Belarusian     -   be │ Indonesian     -   id │ Serbian (Latin)-sr-Latn
│ Bengali        -   bn │ Irish          -   ga │ Sesotho        -   st │
│ Bosnian        -   bs │ Italian        -   it │ Shona          -   sn │
│ Bulgarian      -   bg │ Japanese       -   ja │ Sindhi         -   sd │
│ Cantonese      -  yue │ Javanese       -   jv │ Sinhala        -   si │
│ Catalan        -   ca │ Kannada        -   kn │ Slovak         -   sk │
│ Cebuano        -  ceb │ Kazakh         -   kk │ Slovenian      -   sl │
│ Chichewa       -   ny │ Khmer          -   km │ Somali         -   so │
│ Chinese Simp...- zh-CN│ Klingon        -  tlh │ Spanish        -   es │
│ Chinese Trad...- zh-TW│ Klingon (pIqaD)tlh-Qaak Sundanese      -   su │
│ Corsican       -   co │ Korean         -   ko │ Swahili        -   sw │
│ Croatian       -   hr │ Kurdish        -   ku │ Swedish        -   sv │
│ Czech          -   cs │ Kyrgyz         -   ky │ Tahitian       -   ty │
│ Danish         -   da │ Lao            -   lo │ Tajik          -   tg │
│ Dutch          -   nl │ Latin          -   la │ Tamil          -   ta │
│ Eastern Mari   -  mhr │ Latvian        -   lv │ Tatar          -   tt │
│ Emoji          -  emj │ Lithuanian     -   lt │ Telugu         -   te │
│ English        -   en │ Luxembourgish  -   lb │ Thai           -   th │
│ Esperanto      -   eo │ Macedonian     -   mk │ Tongan         -   to │
│ Estonian       -   et │ Malagasy       -   mg │ Turkish        -   tr │
│ Fijian         -   fj │ Malay          -   ms │ Udmurt         -  udm │
│ Filipino       -   tl │ Malayalam      -   ml │ Ukrainian      -   uk │
│ Finnish        -   fi │ Maltese        -   mt │ Urdu           -   ur │
│ French         -   fr │ Maori          -   mi │ Uzbek          -   uz │
│ Frisian        -   fy │ Marathi        -   mr │ Vietnamese     -   vi │
│ Galician       -   gl │ Mongolian      -   mn │ Welsh          -   cy │
│ Georgian       -   ka │ Myanmar        -   my │ Xhosa          -   xh │
│ German         -   de │ Nepali         -   ne │ Yiddish        -   yi │
│ Greek          -   el │ Norwegian      -   no │ Yoruba         -   yo │
│ Gujarati       -   gu │ Papiamento     -  pap │ Yucatec Maya   -  yua │
│ Haitian Creole -   ht │ Pashto         -   ps │ Zulu           -   zu │
│ Hausa          -   ha │ Persian        -   fa │                       │
│ Hawaiian       -  haw │ Polish         -   pl │                       │
└───────────────────────┴───────────────────────┴───────────────────────┘
```
## 翻译句子
```bash
trans :zh "What is your name?"
What is your name?

你叫什么名字？
(Nǐ jiào shénme míngzì?)

Definitions of What is your name?
[ English -> 简体中文 ]

interjection
    贵姓?
        What is your name?

What is your name?
    你叫什么名字？, 请问你贵姓大名？
```

## 翻译文件内容
```bash
/tmp(:|✔) % cat /tmp/greetings.txt
Hello, World
/tmp(:|✔) % trans en:zh file:///tmp/greetings.txt
你好，世界
```



## 查看更多详细
```bash
man trans
```

## 自己简单包裹一下
将下面的内容，保存成`fanyi.sh`并设置可执行，同时加入环境变量PATH.
```bash
#!/bin/bash
trans   :zh "$1
```

使用时就更加简单
```bash
fanyi.sh Google
Google

谷歌
(Gǔgē)

Translations of Google
[ English -> 简体中文 ]

Google
    谷歌
```

## 其他
  * github地址:[https://github.com/soimort/translate-shell](https://github.com/soimort/translate-shell)
