---
layout: post
title:  "Parsing C/C++ using Clang with Python"
categories: project
---

<!-- https://twitter.com/matalaz/status/580600098092105728 -->
Context  
---  
[Cef](http://en.wikipedia.org/wiki/Chromium_Embedded_Framework) is a framework allowing us to embed chromium into our application   
[Golang](https://golang.org/) is the language designed by Google employee with heavy support on concurrency.  

I'm trying to translate some Cef code to Golang for binding ( because manually tranlsating them all are insane and less fun ). 

Sample code
---

Its it rather easy to parse your C code using python 

```py

#cef_parser.py
from clang.cindex import Index
from pprint import pprint
from optparse import OptionParser, OptionGroup

def get_info(node):
  children = [get_info(c) for c in node.get_children()]
  return { 'id' : get_cursor_id(node),
           'kind' : node.kind,
           'usr' : node.get_usr(),
           'spelling' : node.spelling,
           'location' : node.location,
           'extent.start' : node.extent.start,
           'extent.end' : node.extent.end,
           'is_definition' : node.is_definition(),
           'definition id' : get_cursor_id(node.get_definition()),
           'children' : children }

parser = OptionParser("usage: %prog [options] {filename} [clang-args*]")
parser.disable_interspersed_args()
(opts, args) = parser.parse_args()

index = Index.create()
tu = index.parse(None, args)
if not tu:
  parser.error("unable to load input")

pprint(('nodes', get_info(tu.cursor)))
```

`index.parse(None, args)`, is doing the heavy lifting task, `args` contain all the options require to help `clang` parsing our code.  
For example:  
`python cef_parser.py main.h -I./included_header `  
This will allow clang to read `main.h` header file in `./inlcuded_header`, then `get_info(node)` will dump the information in this particular node. 

The properties in node is rather confusing if you read the source file, I compiled the reference for [Python-Clang](https://coggle.it/diagram/VSk7_32dyC9M7Wtk). 


Reference from  :  
[Parsing C++ in Python with Clang](http://eli.thegreenplace.net/2011/07/03/parsing-c-in-python-with-clang)  
[python-clang](https://github.com/trolldbois/python-clang)