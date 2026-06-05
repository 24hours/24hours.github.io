---
title: 'Calling other Model using relation'
date: '2012-02-11T00:41:00.000-08:00'
originalPublished: '2012-02-11T00:41:00.000-08:00'
publish: false
tags:
  - 'blogspot'
---
confusing title .. haha

model:post

$hasMany = 'Comment'

controller:post

$this->Comment->find('all'); <--- Wrong

$this->Post->Comment->find('all'); <--- right ..

just a mistake that i made ... o god.. never understand how cakephp work internally

[Original post](https://24lawn.blogspot.com/2012/02/calling-other-model-using-relation.html) · Updated 2012-02-11T00:41:17.743-08:00
