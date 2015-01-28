---
layout: post
title: Decoding JSON in golang
category: golang
except : true
---

When writting some Go code that require testing I meet some weird error (but not bug).
Since this error bug me more than once, I figure it would be useful to document this error 

{% highlight Go %}
package main

import(
	"fmt"
	"encoding/json"
)

func main() {
	jsonmsg := []byte(`{"item1":"1", "item2":"2"}`)
	// it is important to note that variable in struct must be capital letter ]
	// so that Unmarshall able to parse them properly
	type msg struct{
		Item1 string
		Item2 string
	}
	
	var m msg
	_ = json.Unmarshal(jsonmsg, &m)
	fmt.Println(m)


	// fail example 
	type msgs struct{
		item1 string
		item2 string
	}
	
	var m2 msgs
	_ = json.Unmarshal(jsonmsg, &m2)
	fmt.Println(m2)
}

// output :
//{1 2}
//{ }
{% endhighlight %}

[Play Ground Example](http://play.golang.org/p/kx6T4pUYcR)

The reason Example 1 word are because as explained in [GoTutorial](http://golangtutorials.blogspot.kr/2011/06/structs-in-go-instead-of-classes-in.html)  
```
if the first letter is capital, it is visible outside the package. That’s it. 
```

So the reason is that simple. 

