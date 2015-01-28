---
layout : post
title : Talent That I don't have 
category : shoulder-of-giant
---

Last year the someone offer HITB-2014 ( The last HITB ) free ticket for anyone who solve this puzzle. Me, being a python newbies, attempted this puzzle and failed horribly. 

Instead of doing myself, lets learn from the other [http://doar-e.github.io/](http://doar-e.github.io/blog/2014/09/06/dissection-of-quarkslabs-2014-security-challenge/)

<!-- no homo -->

```python
(lambda g, c, d: (lambda _: (_.__setitem__('$', ''.join([(_['chr'] if ('chr'
in _) else chr)((_['_'] if ('_' in _) else _)) for _['_'] in (_['s'] if ('s'
in _) else s)[::(-1)]])), _)[-1])( (lambda _: (lambda f, _: f(f, _))((lambda
__,_: ((lambda _: __(__, _))((lambda _: (_.__setitem__('i', ((_['i'] if ('i'
in _) else i) + 1)),_)[(-1)])((lambda _: (_.__setitem__('s',((_['s'] if ('s'
in _) else s) + [((_['l'] if ('l' in _) else l)[(_['i'] if ('i' in _) else i
)] ^ (_['c'] if ('c' in _) else c))])), _)[-1])(_))) if (((_['g'] if ('g' in
_) else g) % 4) and ((_['i'] if ('i' in _) else i)< (_['len'] if ('len' in _
) else len)((_['l'] if ('l' in _) else l)))) else _)), _) ) ( (lambda _: (_.
__setitem__('!', []), _.__setitem__('s', _['!']), _)[(-1)] ) ((lambda _: (_.
__setitem__('!', ((_['d'] if ('d' in _) else d) ^ (_['d'] if ('d' in _) else
d))), _.__setitem__('i', _['!']), _)[(-1)])((lambda _: (_.__setitem__('!', [
(_['j'] if ('j' in _) else j) for  _[ 'i'] in (_['zip'] if ('zip' in _) else
zip)((_['l0'] if ('l0' in _) else l0), (_['l1'] if ('l1' in _) else l1)) for
_['j'] in (_['i'] if ('i' in _) else i)]), _.__setitem__('l', _['!']), _)[-1
])((lambda _: (_.__setitem__('!', [1373, 1281, 1288, 1373, 1290, 1294, 1375,
1371,1289, 1281, 1280, 1293, 1289, 1280, 1373, 1294, 1289, 1280, 1372, 1288,
1375,1375, 1289, 1373, 1290, 1281, 1294, 1302, 1372, 1355, 1366, 1372, 1302,
1360, 1368, 1354, 1364, 1370, 1371, 1365, 1362, 1368, 1352, 1374, 1365, 1302
]), _.__setitem__('l1',_['!']), _)[-1])((lambda _: (_.__setitem__('!',[1375,
1368, 1294, 1293, 1373, 1295, 1290, 1373, 1290, 1293, 1280, 1368, 1368,1294,
1293, 1368, 1372, 1292, 1290, 1291, 1371, 1375, 1280, 1372, 1281, 1293,1373,
1371, 1354, 1370, 1356, 1354, 1355, 1370, 1357, 1357, 1302, 1366, 1303,1368,
1354, 1355, 1356, 1303, 1366, 1371]), _.__setitem__('l0', _['!']), _)[(-1)])
            ({ 'g': g, 'c': c, 'd': d, '$': None})))))))['$'])
```

Looking at this pile of code, the horror.  
first, the basic   
1. `__setitem__` : basically a builtin function for dictionary.

```python
x.__setitem__("a", 1)
x["a"] = 1 #both does the same thing 
```


2. `lamda` : lamda ? why ? but this is how it is used

```python
f = lambda x, y : x + y
f(1,1)
#2
```

what is the actual use of lamda ? except being very very good in obfuscating the code, no idea

#Begin solving

unpacking part of the code we have   

```python
tab0 = [
    1375, 1368, 1294, 1293, 1373, 1295, 1290, 1373, 1290, 1293,
    1280, 1368, 1368, 1294, 1293, 1368, 1372, 1292, 1290, 1291,
    1371, 1375, 1280, 1372, 1281, 1293, 1373, 1371, 1354, 1370,
    1356, 1354, 1355, 1370, 1357, 1357, 1302, 1366, 1303, 1368,
    1354, 1355, 1356, 1303, 1366, 1371
]

z = lambda x: (
    x.__setitem__('!', tab0),
    x.__setitem__('l0', x['!']),
    x
)[-1]
```

the lamda take x, set two items, `'!', 'l0'` and generate a tuples as 

```python
(none,
none,
{'!' : tabs , 'l0' : tabs}
)
```

finally, `[-1]` is used to trim away `none` leaving only what we need behind

by untangle the code 

```python
# Returns { 
  # 'g':g, 'c':c, 'd':d,
  # '!':[],
  # 's':[],
  # 'l':[j for i in zip(tab0, tab1) for j in i],
  # 'l1':tab1,
  # 'l0':tab0,
  # 'i': 0,
  # 'j': 1302,
  # '$':None
#}
res_after_all_operations = (
  (
    lambda x: (
        x.__setitem__('!', []),
        x.__setitem__('s', x['!']),
        x
    )[-1]
  )
  # ..
  (
    (
      lambda x: (
          x.__setitem__('!', ((x['d'] if ('d' in x) else d) ^ (x['d'] if ('d' in x) else d))),
          x.__setitem__('i', x['!']),
          x
      )[-1]
    )
    # ..
    (
      (
        lambda x: (
            x.__setitem__('!', [(x['j'] if ('j' in x) else j) for x[ 'i'] in (x['zip'] if ('zip' in x) else zip)((x['l0'] if ('l0' in x) else l0), (x['l1'] if ('l1' in x) else l1)) for x['j'] in (x['i'] if ('i' in x) else i)]),
            x.__setitem__('l', x['!']),
            x
        )[-1]
      )
      # Returns { 'g':g, 'c':c, 'd':d, '!':tab1, 'l1':tab1, 'l0':tab0, '$':None}
      (
        (
          lambda x: (
              x.__setitem__('!', tab1),
              x.__setitem__('l1', x['!']),
              x
          )[-1]
        )
        # Return { 'g' : g, 'c', 'd': d, '!':tab0, 'l0':tab0, '$':None }
        (
          (
            lambda x: (
                x.__setitem__('!', tab0),
                x.__setitem__('l0', x['!']),
                x
            )[-1]
          )
          ({ 'g': g, 'c': c, 'd': d, '$': None})
        )
      )
    )
  )
)
```

looking throught the code, we can see that `g,c,d` are required to be a proper value  
so here is the requirement:  
`g` : not divisible by 4, function return nothing if it is   
`c` : magic value that we don't know   
`d` : useless value, it is used for XOR with itself.   

so ..... how to get the magic value ?  brute force of course 

```python 
tab0 = [1375, 1368, 1294, 1293, 1373, 1295, 1290, 1373, 1290, 1293, 1280, 1368, 1368,1294, 1293, 1368, 1372, 1292, 1290, 1291, 1371, 1375, 1280, 1372, 1281, 1293,1373, 1371, 1354, 1370, 1356, 1354, 1355, 1370, 1357, 1357, 1302, 1366, 1303,1368, 1354, 1355, 1356, 1303, 1366, 1371]
tab1 = [1373, 1281, 1288, 1373, 1290, 1294, 1375, 1371,1289, 1281, 1280, 1293, 1289, 1280, 1373, 1294, 1289, 1280, 1372, 1288, 1375,1375, 1289, 1373, 1290, 1281, 1294, 1302, 1372, 1355, 1366, 1372, 1302, 1360, 1368, 1354, 1364, 1370, 1371, 1365, 1362, 1368, 1352, 1374, 1365, 1302]

func = (
    lambda g, c, d:
    (
        lambda x: (
            x.__setitem__('$', ''.join([(x['chr'] if ('chr' in x) else chr)((x['_'] if ('_' in x) else x)) for x['_'] in (x['s'] if ('s' in x) else s)[::-1]])),
            x
        )[-1]
    )
    (
        (
            lambda x:
                (lambda f, x: f(f, x))
            (
                (
                    lambda __, x:
                    (
                        (lambda x: __(__, x))
                        (
                            # i += 1
                            (
                                lambda x: (
                                    x.__setitem__('i', ((x['i'] if ('i' in x) else i) + 1)),
                                    x
                                )[-1]
                            )
                            (
                                # s += [c ^ l[i]]
                                (
                                    lambda x: (
                                        x.__setitem__('s', (
                                                (x['s'] if ('s' in x) else s) +
                                                [((x['l'] if ('l' in x) else l)[(x['i'] if ('i' in x) else i)] ^ (x['c'] if ('c' in x) else c))]
                                            )
                                        ),
                                        x
                                    )[-1]
                                )
                                (x)
                            )
                        )
                        # if ((x['g'] % 4) and (x['i'] < len(l))) else x
                        if (((x['g'] if ('g' in x) else g) % 4) and ((x['i'] if ('i' in x) else i)< (x['len'] if ('len' in x) else len)((x['l'] if ('l' in x) else l))))
                        else x
                    )
                ),
                x
            )
        )
        # Returns { 'g':g, 'c':c, 'd':d, '!':zip(tab1, tab0), 'l':zip(tab1, tab0), l1':tab1, 'l0':tab0, 'i': 0, 'j': 1302, '!':0, 's':[] }
        (
            (
                lambda x: (
                    x.__setitem__('!', []),
                    x.__setitem__('s', x['!']),
                    x
                )[-1]
            )
            # Returns { 'g':g, 'c':c, 'd':d, '!':zip(tab1, tab0), 'l':zip(tab1, tab0), l1':tab1, 'l0':tab0, 'i': 0, 'j': 1302, '!':0}
            (
                (
                    lambda x: (
                        x.__setitem__('!', ((x['d'] if ('d' in x) else d) ^ (x['d'] if ('d' in x) else d))),
                        x.__setitem__('i', x['!']),
                        x
                    )[-1]
                )
                # Returns { 'g' : g, 'c', 'd': d, '!':zip(tab1, tab0), 'l':zip(tab1, tab0), l1':tab1, 'l0':tab0, 'i': (1371, 1302), 'j': 1302}
                (
                    (
                        lambda x: (
                            x.__setitem__('!', [(x['j'] if ('j' in x) else j) for x[ 'i'] in (x['zip'] if ('zip' in x) else zip)((x['l0'] if ('l0' in x) else l0), (x['l1'] if ('l1' in x) else l1)) for x['j'] in (x['i'] if ('i' in x) else i)]),
                            x.__setitem__('l', x['!']),
                            x
                        )[-1]
                    )
                    # Returns { 'g' : g, 'c', 'd': d, '!':tab1, 'l1':tab1, 'l0':tab0}
                    (
                        (
                            lambda x: (
                                x.__setitem__('!', tab1),
                                x.__setitem__('l1', x['!']),
                                x
                            )[-1]
                        )
                        # Return { 'g' : g, 'c', 'd': d, '!' : tab0, 'l0':tab0}
                        (
                            (
                                lambda x: (
                                    x.__setitem__('!', tab0),
                                    x.__setitem__('l0', x['!']),
                                    x
                                )[-1]
                            )
                            ({ 'g': g, 'c': c, 'd': d, '$': None})
                        )
                    )
                )
            )
        )
    )['$']
)

for i in range(0x1000):
    try:
        ret = func(1, i, 0)
        if 'quarks' in ret:
            print ret
    except:
        pass

#/blog.quarkslab.com/static/resources/b7d8438de09fffb12e3950e7ad4970a4a998403bdf3763dd4178adf
```

easy right ? and I failed ..... the key is `1337` btw. 