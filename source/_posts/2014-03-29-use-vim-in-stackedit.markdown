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
