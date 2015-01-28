---
layout: post
title: "Golang and C"
date: 2015-01-29 00:00:00
category: golang
---

Golang is all good and sunshine .. untill you need a library which is only available in C / C++  

<!-- which make coding of golang binding in X boring, literally translating .h file to .go-->

Here is a few note for Golang <-> C binding : 

Calling C code from Golang 
----------


```c
//callme.c
#include <stdio.h>

void callme(){
	printf("Called from C");
}
```

```go
//main.go
package main

//extern void callme()
import "C"


func CallC(){
	C.callme()
}

//Called from C
```

Calling Go code from C 
----------

```c
//callme.c
#include <stdio.h>
#include <_cgo_export.h>

void callme(){
	GoCall();
}
```

```go
//main.go
package main

//extern void callme()
import "C"
import "fmt"

//export GoCall
func GoCall(){
	fmt.Println("Called from Go")	
}

func CallC(){
	C.callme()
}

//Called from Go
```

and of course there is some part where you need to take care of, not everything can be exported to C

