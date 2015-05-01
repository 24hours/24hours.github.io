---
layout: post
title:  "Compile your own linux kernel"
categories: history
---

<!-- take the time machine .. go to the past .. of commit tree -->

assuming you installed centos 7, here is the command I use 

```sh
yum groupinstall "Development Tools"
yum install ncurses-devel
yum install bc #somehow you will need this 
git clone https://github.com/torvalds/linux & cd ./linux
cp /boot/config-`uname -r` .config
make menuconfig #save and exit 

make
make modules
make modules_install
make install 
# yay complete. 
```