---
title: 'Bypassing firewall / NAT router with reverse SSH'
date: 2016-04-24
tags:
  - 'note'
---
+------+
 +--->Server|
 |   +------+
 |       |
 |   +---v----+
 |   |Firewall|
 |   +--------+
 |       |
 |   +---v---------+
 |   |Public Server|
 |   +-^-----------+
 |     |
 |   +---+
 +---+You|
     +---+

You have a server behind NAT and with to ssh into your server without having to mess with the NAT. The configuration is as follow

[Public Server]
vim /etc/ssh/sshd_config
# add this line
GatewayPorts yes

[Server]
ssh -R 2222:localhost:22 public-server-user@public-server-ip

[you]
ssh -p 2222 server-user@public-server-ip
