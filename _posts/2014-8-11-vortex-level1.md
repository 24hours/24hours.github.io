---
layout : post
title : Vortex Level 1 Write up
category : ctf
---

<!-- I never know  GDB allow me to do this, all my stack smashing practice would have been easier -->
level 1 provide us with this [vortex.c](http://overthewire.org/wargames/vortex/vortex1.c) file , i have cleaned up and added some comment

<!--more-->
```c
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>


#define e(); 
	// ptr should begin with 0xca_____
	if(((unsigned int)ptr & 0xff000000)==0xca000000)  
	{ 
		setresuid(geteuid(), geteuid(), geteuid()); 
		execlp("/bin/sh", "sh", "-i", NULL); 
	}

void print(unsigned char *buf, int len)
{
        int i;

        printf("[ ");
        for(i=0; i < len; i++) printf("%x ", buf[i]); 
        printf(" ]\n");
}

int main()
{
        unsigned char buf[512];
        unsigned char *ptr = buf + (sizeof(buf)/2);
        unsigned int x;

        while((x = getchar()) != EOF) {
                switch(x) {
                        case '\n': 
                        	print(buf, sizeof(buf)); 
                        	continue; 
                        	break;
                        
                        case '\\': 
                        	ptr--; 
                        	break; 

                        default: 
                        	e(); //we should get the code flow into this line 
                        	if(ptr > buf + sizeof(buf)) // prevent buffer overflow 
                        		continue; 
                        	ptr++[0] = x; // key part to set ptr = 0xca____
                        	break;
                }
        }
        printf("All done\n");
}
```

The task is input a bunch of character untill it hit special condition

first compile the program with debugging flag

```
gcc -m32 -g vortex1.c -o v1
```


