---
layout: post
title:  "Down the rabbit hole of Shared object (Library) in Linux"
categories: note
---

Shared object or `.so` is no stranger to Linux user. The main purpose of shared object is a collection of code that can be reused by other project. Shared object can be loaded ( dynamic linked ) by executable file during runtime as oppose to static link with static library. The characteristic imply that executable may crash due to missing shared object. This text explain how dynamic linking is performed and later explore the possibilities of tapping the call between executable and shared object. 

Interested reader can familiarize themself with Executable and Linking file (ELF) structure.  
- [Basic ELF Structure](https://github.com/cirosantilli/assembly-cheat/blob/a0a2d3dfa58e010493104dcdd95e72776e3d3983/elf-hello-world.md)  
- [ELF manual](http://man7.org/linux/man-pages/man5/elf.5.html)  
- [ELF section explaination](https://www.cs.stevens.edu/~jschauma/631/elf.html)

# Index
[Source Code](#sourcecode)  
[Static Linking](#static)  
[Dynamic Linking](#dynamic)  
[Summary](#summary)

## <a name=sourcecode></a> Source code 

```c
//animal.c
#include "zoo.h"

int main(){
  cat();
  dog();
}
```

```c
//zoo.h
#include <stdio.h>

void cat();
void dog();
```

```c
// library file
// zoo.c
#include "zoo.h"

void cat(){
  printf("meow\n");
}

void dog(){
  printf("woff\n");
}
```

## <a name=static></a> Static linking 
This section explain how static linking is performed as a preliminary to guide reader into how slightly complicated dynamic linking is done. 

```bash
cc -o animal animal.c zoo.c
```

```bash
cc -c zoo.c
# create library
ar -cvq zoo.a zoo.o
cc -o animal animal.c zoo.a
```

First example may be more common to some users while second example valid as well. The [difference](http://stackoverflow.com/questions/654713/o-files-vs-a-files) between can be summarized as :

`.o` objects : They are the output of the compiler and input to the linker/librarian.
`.a` archives : They are groups of objects or static libraries and are also input into the linker.

### Difference between Object file and Executable file 

The result of static linking is obvious when dumping the assembly file of `animal.o` and `animal`  

{% highlight objdump linenos=table %}
 animal.o:     file format elf64-x86-64

Disassembly of section .text:

0000000000000000 <main>:
   0: 55                    push   %rbp
   1: 48 89 e5              mov    %rsp,%rbp
   4: b8 00 00 00 00        mov    $0x0,%eax
   9: e8 00 00 00 00        callq  e <main+0xe>
   e: b8 00 00 00 00        mov    $0x0,%eax
  13: e8 00 00 00 00        callq  18 <main+0x18>
  18: 5d                    pop    %rbp
  19: c3                    retq   
{% endhighlight %}

{% highlight objdump linenos=table %}
animal:     file format elf64-x86-64

000000000040052d <main>:
  40052d: 55                    push   %rbp
  40052e: 48 89 e5              mov    %rsp,%rbp
  400531: b8 00 00 00 00        mov    $0x0,%eax
  400536: e8 0c 00 00 00        callq  400547 <cat>
  40053b: b8 00 00 00 00        mov    $0x0,%eax
  400540: e8 12 00 00 00        callq  400557 <dog>
  400545: 5d                    pop    %rbp
  400546: c3                    retq  
{% endhighlight %}


Static linking has changed the address in Line 7, 9 

```objdump
   9: e8 00 00 00 00        callq  e <main+0xe>
  13: e8 00 00 00 00        callq  18 <main+0x18>

  400536: e8 0c 00 00 00        callq  400547 <cat>
  400540: e8 12 00 00 00        callq  400557 <dog>
```

In example file, `callq` with `0x0` as argument doesn't now make much sense since it would result in executable crash instantly. However, how does the resulting `0x0c` and `0x12` address is known in ELF file ? Upon close inspection of `.rela.text` in animal object file shows that what address value linker fill in. 

```
;readelf -r  animal.o
Relocation section '.rela.text' at offset 0x570 contains 2 entries:
  Offset          Info           Type           Sym. Value    Sym. Name + Addend
00000000000a  000a00000004 R_X86_64_PLT32    0000000000000000 cat - 4
000000000014  000b00000004 R_X86_64_PLT32    0000000000000000 dog - 4

Relocation section '.rela.eh_frame' at offset 0x5a0 contains 1 entries:
  Offset          Info           Type           Sym. Value    Sym. Name + Addend
000000000020  000200000002 R_X86_64_PC32     0000000000000000 .text + 0
```

`.rela.text` section clearly state that offset `0x0a` must be replaced with some value that is reference to `cat()`. The process of changed address is known as "Relocation". Interested reader may read [1] for different relocation type.s

## <a name=dynamic></a> Dynamic Linking 

The process of creating shared object and adding it to executable is as follow:

```bash
gcc -fPIC -c *.c
gcc -shared -Wl,-soname,libzoo.so -o libzoo.so zoo.o
gcc -Wl,-rpath,./ -I./ -L./ animal.c -lzoo -o animal
```

Dynamic Library entries symbols can be listed with:

```bash
nm -gC libzoo.so

0000000000201038 B __bss_start
00000000000006e5 T cat
00000000000006f7 T dog
```

Similarly, dependencies of executable can be shown using:

```bash
ldd animal
  linux-vdso.so.1 =>  (0x00007fff5bef2000)
  libzoo.so => ./libzoo.so (0x00007f6680d88000)
  libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f66809ae000)
  /lib64/ld-linux-x86-64.so.2 (0x00007f6680f8c000)
```

### How to call from executable to entries in Shared object

objdump for animal executable

```objdump
00000000004006dd <main>:
  4006dd: 55                    push   %rbp
  4006de: 48 89 e5              mov    %rsp,%rbp
  4006e1: b8 00 00 00 00        mov    $0x0,%eax
  4006e6: e8 f5 fe ff ff        callq  4005e0 <cat@plt>
  4006eb: b8 00 00 00 00        mov    $0x0,%eax
  4006f0: e8 cb fe ff ff        callq  4005c0 <dog@plt>
  4006f5: 5d                    pop    %rbp
  4006f6: c3                    retq
  4006f7: 66 0f 1f 84 00 00 00  nopw   0x0(%rax,%rax,1)
  4006fe: 00 00

00000000004005c0 <dog@plt>:
  4005c0: ff 25 5a 0a 20 00     jmpq   *0x200a5a(%rip)        # 601020 <_GLOBAL_OFFSET_TABLE_+0x20>
  4005c6: 68 01 00 00 00        pushq  $0x1 ;entries in .rela.plt 
  4005cb: e9 d0 ff ff ff        jmpq   4005a0 <_init+0x28>

00000000004005e0 <cat@plt>:
  4005e0: ff 25 4a 0a 20 00     jmpq   *0x200a4a(%rip)        # 601030 <_GLOBAL_OFFSET_TABLE_+0x30>
  4005e6: 68 03 00 00 00        pushq  $0x3
  4005eb: e9 b0 ff ff ff        jmpq   4005a0 <_init+0x28>

00000000004005a0 <__libc_start_main@plt-0x10>:
  4005a0: ff 35 62 0a 20 00     pushq  0x200a62(%rip)        # 601008 <_GLOBAL_OFFSET_TABLE_+0x8>
  4005a6: ff 25 64 0a 20 00     jmpq   *0x200a64(%rip)        # 601010 <_GLOBAL_OFFSET_TABLE_+0x10>
  4005ac: 0f 1f 40 00           nopl   0x0(%rax)
```

the execution flow of calling "cat()" is as follow

```objdump
  4006e6: e8 f5 fe ff ff        callq  4005e0 <cat@plt>
  4005c0: ff 25 5a 0a 20 00     jmpq   *0x200a5a(%rip)        # 601020 <_GLOBAL_OFFSET_TABLE_+0x20> ; *0x601020 point to nextline  
  4005c6: 68 01 00 00 00        pushq  $0x1 ;entries in .rela.plt 
  4005eb: e9 b0 ff ff ff        jmpq   4005a0 <_init+0x28>
  4005a0: ff 35 62 0a 20 00     pushq  0x200a62(%rip)        # 601008 <_GLOBAL_OFFSET_TABLE_+0x8>
  4005a6: ff 25 64 0a 20 00     jmpq   *0x200a64(%rip)        # 601010 <_GLOBAL_OFFSET_TABLE_+0x10>
  ; pause
```

take a look to Global Osset Table before continue 

```bash
objdump -s --start-address=0x601000 --stop-address=0x601030 animal
```

| Offset | value |  
| --- | --- |  
| <_GLOBAL_OFFSET_TABLE_+0x0> | 0x600e08 |
| <_GLOBAL_OFFSET_TABLE_+0x8> | 0x000000 |
| <_GLOBAL_OFFSET_TABLE_+0x10> | 0x000000 |
| <_GLOBAL_OFFSET_TABLE_+0x18> | 0x4005b6 |
| <_GLOBAL_OFFSET_TABLE_+0x20> | 0x4006c6 |
| <_GLOBAL_OFFSET_TABLE_+0x28> | 0x4005d6 |
| <_GLOBAL_OFFSET_TABLE_+0x30> | 0x4005e6 |

When looking at last intruction, jumping to `<_GLOBAL_OFFSET_TABLE_+0x10>` will crash the process again due to zero address. 

```objdump
  4006e6: e8 f5 fe ff ff        callq  4005e0 <cat@plt>
  4005c0: ff 25 5a 0a 20 00     jmpq   *0x200a5a(%rip)        # 601020 <_GLOBAL_OFFSET_TABLE_+0x20> ; *0x601020 point to nextline  
  4005c6: 68 01 00 00 00        pushq  $0x1 ;entries in .rela.plt 
  4005eb: e9 b0 ff ff ff        jmpq   4005a0 <_init+0x28>
  4005a0: ff 35 62 0a 20 00     pushq  0x200a62(%rip)        # 601008 <_GLOBAL_OFFSET_TABLE_+0x8>  
  4005a6: ff 25 64 0a 20 00     jmpq   *0x200a64(%rip)        # 601010 <_GLOBAL_OFFSET_TABLE_+0x10> ; *crash* 
  ; pause
```

Static Analysis reveal that the execution flow will inevitably crash. The conclusion is obvious since dynamic linking require program to be running before linking can happen. In the next run, we will use debugger to break at `0x4005a0` and reveal Global Offset Table (GOT) content.

Upon inspecting in run time, this is content go GOT. 

| Offset | value |  
| --- | --- |  
| <_GLOBAL_OFFSET_TABLE_+0x0> | 0x600e08 |
| <_GLOBAL_OFFSET_TABLE_+0x8> | <font color=red> 0x7ffff7ffe1c8 </font> |
| <_GLOBAL_OFFSET_TABLE_+0x10> | <font color=red> 0x7ffff7df04e0 <\_dl\_runtime_resolve> </font>|
| <_GLOBAL_OFFSET_TABLE_+0x18> | <font color=red> 0x7ffff7834dd0 <__libc_start_main> </font>|
| <_GLOBAL_OFFSET_TABLE_+0x20> | 0x4006c6 |
| <_GLOBAL_OFFSET_TABLE_+0x28> | 0x4005d6 |
| <_GLOBAL_OFFSET_TABLE_+0x30> | 0x4005e6 |

The execution process can now continue without crashing. After pushing `0x7ffff7ffe1c8` to stack then call `dl_runtime_resolve`. After runtime resolve;

Upon inspecting the source code for x86_64 architecture [link](http://osxr.org/glibc/source/sysdeps/x86_64/dl-trampoline.S?v=glibc-2.17#0032), at the end of the function, it called to `cat()` in libzoo.so. 

``asm
jmp *%r11       # Jump to function address.
```

Reader may wonder how did the execution flow ever continue after `cat()` is call since `ret` is never called. In fact, it is executed in cat(). 

```objdump
#  objdump -d libzoo.so
00000000000006e5 <cat>:
 6e5: 55                    push   %rbp
 6e6: 48 89 e5              mov    %rsp,%rbp
 6e9: 48 8d 3d 25 00 00 00  lea    0x25(%rip),%rdi        # 715 <_fini+0x9>
 6f0: e8 db fe ff ff        callq  5d0 <puts@plt>
 6f5: 5d                    pop    %rbp
 6f6: c3                    retq 
```

### \_DL\_RUNTIME_RESOLVE

How it work ?

``` asm
pushq  $0x1 ;entries in .rela.plt
pushq  0x200a62(%rip)        # 601008 <_GLOBAL_OFFSET_TABLE_+0x8>  
```

all we know is this 2 parameter is pushed, but the exact search process shall be explore in later update. 


## <a name=summary></a> Summary

<img src="http://image.slidesharecdn.com/elflinkerloader-110924101728-phpapp01/95/runtime-symbol-resolution-4-728.jpg?cb=1319926303">

Author : Ken Kawamoto  
Source : slideshare

<!--
# What if so file is strpped ?
stripping file :
strip libzoo.so
-->

## Reference
[1] [Slide about Dynamic Library](http://www.slideshare.net/kentarokawamoto/runtime-symbol-resolution)  
[2] [Relocation Type](http://lxr.free-electrons.com/source/arch/x86/um/asm/elf.h)