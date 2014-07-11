---
layout: post
title: "Use Vim in StackEdit"
date: 2014-03-29 19:21
comments: true
categories: vim StackEdit markdown google Drive
---
StackEdit is really great online editor. It could connect with Google Drive. And what's more, you can even use Vim in this editor.  
Now add the following snippet into Settings--Extensions--UserCustom extension javascript area.
```javascript
userCustom.onReady = function() {
        var ace = {}
        ace.require = require
        ace.define = define
    ace.require(["ace/lib/net"], function(acenet) {
        acenet.loadScript("http://google-drive-sdk-samples.googlecode.com/hg-history/db27d16a6e84d35bf068ce3864450cb557aa6a8d/php/lib/ace/keybinding-vim.js", function() {
                        e = document.querySelector(".ace_editor").env.editor
            ace.require(["ace/keyboard/vim"], function(acevim) {
                                e.setKeyboardHandler(acevim.handler);
                            
            });
                    
        });
            
    });
        window.ace = ace;

};
```

##Others
  * <a href="http://www.amazon.cn/gp/product/059652983X/ref=as_li_tf_tl?ie=UTF8&camp=536&creative=3200&creativeASIN=059652983X&linkCode=as2&tag=droidyue-23">Learning the vi and Vim Editors</a><img src="http://ir-cn.amazon-adsystem.com/e/ir?t=droidyue-23&l=as2&o=28&a=059652983X" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

