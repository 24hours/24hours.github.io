---
layout: post
title:  "Installing Old nvdia card on ubuntu server"
categories: note
---

<!-- guess what .... the card failed anyway, because theano dont support old card very well -->
I spend whole afternoon trying to figure out why theano wont play nice with my Nvidia GT 9800 card. Here is the 5 minute solution I learnt.
1. Before downloading nvidia driver, check which version you should use [here](http://www.nvidia.com/Download/Find.aspx).
2. While CUDA toolkit is backward compatible, i.e. CUDA 7 can support old card,the reverse is not true, old card will **NOT** support new toolkit. 
3. In my case, GT 9800 card is supported by nvidia-340 driver which only support CUDA 6.5 toolkit. 
4. Here is the command i used
> ubuntu-drivers devices #show what driver is supporting my card  
> wget cuda\_toolkit\_[version]  
> sudo apt-get install cuda-[version]
5. if you are using nvidia for computing purpose only (no monitor), the card will not be enabled when you are using theano. You must run the program as root to activate the card.  
> sudo ./deviceQuery #cuda sample.
> python theano.py 