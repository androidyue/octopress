---
layout: post
title: "Issues About Installing Octopress"
date: 2013-09-07 15:44
comments: true
categories: Github OctoPress Ruby RVM
---

Actually I am fresh to Write Blog with Octopress in Github Pages.According to the <a href="http://octopress.org/docs/deploying/github/" alt="Introduction for Installing Octopress in Github Pages" target="_blank">Introduction</a>   .And now I have make it avaible and the website is present.
However I have suffered some problems when I did the setup.Here is a summary of what I have sufferd and how I resolved.

##### Could not find rdiscount-2.0.7.3 in any of the sources Run `bundle install` to install missing gems.
    source ~/.rvm/scripts/rvm
    rvm use 1.9.3 --default 

##### I have used <code>rake preview </code>,But I got 404 when I open the [http://127.0.0.1:4000](http://127.0.0.1)
    [androidyue@androidyue octopress]$ rake preview
    Starting to watch source with Jekyll and Compass. Starting Rack on port 4000
    [2013-09-07 15:46:20] INFO  WEBrick 1.3.1
    [2013-09-07 15:46:20] INFO  ruby 1.9.3 (2013-06-27) [i686-linux]
    [2013-09-07 15:46:20] INFO  WEBrick::HTTPServer#start: pid=10490 port=4000
    Configuration from /home/androidyue/github/octopress/_config.yml
    Auto-regenerating enabled: source -> public/
    [2013-09-07 15:46:21] regeneration: 95 files changed
    >>> Change detected at 15:46:21 to: screen.scss
       create public/github/stylesheets/screen.css 
       Errno::ENOENT on line ["56"] of /home/androidyue/.rvm/gems/ruby-1.9.3-p448/gems/compass-0.12.2/lib/compass/actions.rb: No such file or directory - /home/androidyue/github/octopress/public/github/stylesheets/screen.css
       Run with --trace to see the full backtrace]

As the above information and all the sources are outputed in public/ folder And the following are a part of my _config.yml file

    # If publishing to a subdirectory as in http://site.com/project set 'root: /project'
    root: /
    permalink: /blog/:year/:month/:day/:title/
    source: source
    destination: public/
    plugins: plugins
    code_dir: downloads/code
    category_dir: blog/categories

So compare the two piece information and check the output dir and is public or a subdirectory in public folder.If your outputdir is a subdirectory you should use this link [http://127.0.0.1:4000/yourSubDirName](http://127.0.0.1:4000/yourSubDirName) 
P.S.This is the help from StackOverflow [http://stackoverflow.com/questions/17465404/rake-preview-not-working-in-octopress](http://stackoverflow.com/questions/17465404/rake-preview-not-working-in-octopress)


I will keep record about this topic becuase I am making friends with Octopress in Github Pages



