---
title: 'Configuring subdomain on Apache2 Ubuntu'
date: '2012-01-06T05:12:00.000-08:00'
originalPublished: '2012-01-06T05:12:00.000-08:00'
publish: false
tags:
  - 'apache2 cakephp'
---
Im trying to install cakephp on my box.

While i can always try to expand the whole cakephp folder into /var/www but I want separate the folder which can be accessed using different name.

http://localhost/cakephp seems like giving the weird looking index.php so i decide to use http://cake.localhost to see if I can make the page look normal.

here is the step I took

$cd /etc/apache2/site-availables

$ sudo gedit ./cakephp

add the following

<VirtualHost *:80>

    DocumentRoot /var/www/cakephp/

    ServerName cake.localhost

</VirtualHost>

$sudo gedit /etc/hosts

add this line

127.0.0.1             cake.localhost

$cd /etc/apache2/site-enabled

$sudo ln -s ../site-available/cakephp ./cakephp

restart the apache server

$/etc/init.d/apache2 restart

note: if you see the warning message like "unable to resolve servername"

add this

$echo "serverName localhost" >> /etc/apache2/httpd.conf

Dont exactly know what happened on everything, since it work and Im happy with it

[Original post](https://24lawn.blogspot.com/2012/01/configuring-subdomain-on-apache2-ubuntu.html) · Updated 2012-01-18T05:05:37.375-08:00
