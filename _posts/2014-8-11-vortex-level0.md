---
layout : post
title : Vortex Level 0 Write up
category : ctf
---
<!-- It is embrassing that I don really understand little/big endian , hence this overly detail post -->

Visiting [Vortex level 0](http://overthewire.org/wargames/vortex/vortex0.html) we immediately greeted with such text 

> Your goal is to connect to port 5842 on vortex.labs.overthewire.org and read in 4 unsigned integers in host byte order. Add these integers together and send back the results to get a username and password for vortex1. This information can be used to log in using SSH.

Let start with these code and connect to server 

```python
import socket, struct
import telnetlib 


s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect(("vortex.labs.overthewire.org", 5842))
```

According to Instruction, we would recieve 4 integer, but the website also gave us such hint 
> Note: vortex is on an 32bit x86 machine (meaning, a little endian architecture)

```python
recieved = []
for i in range(4):
	recieved.append(s.recv(4))
```

Before summing it up, we have to consider network byte order (Big Endian) and host byte order (Little Endian)  
Both endian difference in a sense where how the computer representing them in memory 

consider a 4 byte `0A 0B 0C 0D`


|Addr| 0x1  | 0x2  | 0x3  | 0x4  |
|---|---|---|---|---|
|Little   | 0D  | 0C  |0B   |0A   |
|Big   |0A   |0B   |0C   |0D   |

As you can see  
Little Endian : Store Most Significant Bit (MSB) to **Largest** address  
Big Endian : Store MSB to **Smallest** address


Now lets check your system byte order  
in Python 

```python
>>> import sys 
>>> sys.byteorder
'little'
```

How number 1 are presented under different endianess 

```python
# < , litte-endian
# > , big-endian
# ! , network byte order (big-endian)
# I , Integer 
>>> from struct import *
>>> pack('<I', 1) # little
'\x01\x00\x00\x00'
>>> pack('>I', 1) # big
'\x00\x00\x00\x01'
>>> pack('!I', 1) # network 
'\x00\x00\x00\x01'
```

If you are careful, you would notice that big endian is how we would represent 1 in writting, `00 00 00 01` , remove the 0 
<!-- talk about useless thing-->

Back to the puzzle, we should treat recieved packet as little endian 

```python
total = 0
for i in range(4):
	total += struct.unpack('<I', s.recv(4))[0]
```

next also send in little endian format

````python
s.send(struct.pack('<I', total))

t = telnetlib.Telnet()
t.sock = s
t.interact()
#now only spew everything from wire (which should be password) 
```

