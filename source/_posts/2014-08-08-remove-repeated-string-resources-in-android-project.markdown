---
layout: post
title: "赶走那些Android工程中得冗余字符串"
date: 2014-08-08 19:32
comments: true
categories: Android Python
---

Android提供了一套很方便的进行资源（语言）国际化机制，为了更好地支持多语言，很多工程的翻译往往会放到类似crowdin这样的平台上。资源是全了，但是还是会有一些问题。

<!--more-->
##哪些问题
以下使用一些语言进行举例。其中values为工程默认的资源。
  
  * 某语言的资源和某语言限定区域的资源之间。如**values-fr-rCA**存在于**values-fr**相同的字符串，这种表现最为严重。
  * 某语言的资源和默认的资源之间。**values-fr**存在与**values**相同的字符串，可能原因是由于**values-fr**存在未翻译字符串导致

##为什么要去重
  * 洁癖，容不下半点冗余。

##解决思路
  * 如果**values-fr-rCA**存在于**values-fr**相同的字符串，去除**values-fr-rCA**中的重复字符串，保留**values-fr**。这样可以保证在values-fr-rCA下也可以正确读取到资源。
  
  * 如果**values-fr**存在与**values**相同的字符串。如去除**values-fr**中得重复字符串，保留values的条目。

##Py脚本
```python filenos:false removeRepeatedStrings.py https://raw.githubusercontent.com/androidyue/DroidResCleaner/master/removeRepeatedStrings.py
#!/usr/bin/env python
# coding=utf-8
from os import listdir,path, system
from sys import argv
try:
    import xml.etree.cElementTree as ET
except ImportError:
    import xml.etree.ElementTree as ET


def genRegionLangPair(filePath):
    basicLanguage = None
    if ('values' in filePath) :
        hasRegionLimit = ('r' == filePath[-3:-2])
        if (hasRegionLimit):
            basicLanguage = filePath[0:-4]
            if (not path.exists(basicLanguage)) :
                return None 
            belongsToEnglish =  ("values-en" in basicLanguage)
            if (belongsToEnglish):
                #Compare with the res/values/strings.xml
                return (path.dirname(basicLanguage) + '/values/strings.xml', filePath + "/strings.xml")
            else:
                return (basicLanguage + '/strings.xml', filePath + "/strings.xml")
    return None

def genLangPair(filePath):
    def shouldGenLanPair(filePath):
        if (not 'values' in filePath ):
            return False
        if('dpi' in filePath):
            return False
        if ('dimes' in filePath):
            return False
        if ('large' in filePath):
            return False 
        return True

    if(shouldGenLanPair(filePath)):
        basicLanguage = path.dirname(filePath) + '/values/strings.xml'
        targetLanguage = filePath + '/strings.xml'
        if (not path.exists(targetLanguage)):
           return None 

        if (not path.samefile(basicLanguage,targetLanguage)) :
            return (basicLanguage, targetLanguage)
    return None

def genCompareList(filePath):
    compareLists = []
    for file in listdir(filePath):
        regionPair = genRegionLangPair(filePath + '/' + file)
        if (None != regionPair):
            compareLists.append(regionPair)
        
        languagePair = genLangPair(filePath + '/' + file) 
        if (None != languagePair) :
            compareLists.append(languagePair)

    return compareLists

def getXmlEntries(filePath):
    root = ET.ElementTree(file=filePath).getroot()
    entries = {}
    for child in root:
        attrib = child.attrib
        if (None != attrib) :
            entries[attrib.get('name')] = child.text
    print 'xmlEntriesCount',len(entries)
    return entries

def rewriteRegionFile(sourceEntries, filePath):
    if (not path.exists(filePath)):
        return 
    ET.register_namespace('xliff',"urn:oasis:names:tc:xliff:document:1.2")
    tree = ET.ElementTree(file=filePath)
    root = tree.getroot()
    print root
    totalCount = 0
    removeCount = 0
    unRemoveCount = 0
    print len(root)
    toRemoveList = []
    for child in root:
        totalCount = totalCount + 1
        attrib = child.attrib
        if (None == attrib):
            continue

        childName = attrib.get('name')

        if (sourceEntries.get(childName) == child.text):
            removeCount = removeCount + 1
            toRemoveList.append(child)
        else:
            unRemoveCount = unRemoveCount + 1
            print childName, sourceEntries.get(childName), child.text
    print filePath,totalCount, removeCount,unRemoveCount

    for aItem in toRemoveList:
        root.remove(aItem)

    if (len(root) != 0 ):
        tree.write(filePath, encoding="UTF-8")
    else:
        command = 'rm -rf %s'%(path.dirname(filePath))
        print command
        system(command)
    


def main(projectDir):
    lists = genCompareList(projectDir + "/res/")

    for item in lists:
        print item
        src = item[0]
        dest = item[1]
        rewriteRegionFile(getXmlEntries(src),dest)

if __name__ == "__main__":
    if (len(argv) == 2) :
        main(argv[1])
```

##如何使用
```bash filenos:false
python removeRepeatedStrings.py your_android_project_root_dir
```

##工程参与
<a href="https://github.com/androidyue/DroidResCleaner/blob/master/removeRepeatedStrings.py" target="_blank">RemoveRepeatedStrings.py</a>

###其他
  * <a href="http://www.amazon.cn/gp/product/B00DZEX5JQ/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B00DZEX5JQ&linkCode=as2&tag=droidyue-23">控制你行为的秘密</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B00DZEX5JQ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B0090HBORW/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B0090HBORW&linkCode=as2&tag=droidyue-23">好工作是设计出来的</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B0090HBORW" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
  * <a href="http://www.amazon.cn/gp/product/B001F7AEFI/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=B001F7AEFI&linkCode=as2&tag=droidyue-23">原来这才是瑞士多功能军刀</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=B001F7AEFI" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
