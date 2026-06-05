---
title: 'Cakephp DebugKit css/js issue'
date: '2012-01-18T05:04:00.000-08:00'
originalPublished: '2012-01-18T05:04:00.000-08:00'
tags:
  - 'cakephp'
---
If you are using cakephp develope your website , you should definitely checkout the [DebugKit](https://github.com/cakephp/debug_kit). A nifty tools to help smooth out your debugging experience

after following the instruction for installation , you might have notice that Cakephp will require you to load the plugin using cakephp::load('DebugKit') and according to CookBook 2.0 ( I assume you are using 2.0+ )

> New for CakePHP 2.0, plugins need to be loaded manually in app/Config/bootstrap.php.
> You can either load them one by one or all of them in a single call:
> <?phpCakePlugin::loadAll(); // Loads all plugins at onceCakePlugin::load('ContactManager'); //Loads a single plugin

You must put the code in bootstrap.php else the css/js will not get loaded.

[Original post](https://24lawn.blogspot.com/2012/01/cakephp-debugkit-cssjs-issue.html) · Updated 2012-01-18T05:04:38.479-08:00
