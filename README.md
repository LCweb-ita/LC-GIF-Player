# LC GIF Player

__Prior note:__ this is a [libgif-js](https://github.com/buzzfeed/libgif-js) fork.<br/>
A very nice javascript piece to manipulate animated GIFs, by [BuzzFeed](https://github.com/buzzfeed)

This tiny project born since I had the necessity to create a GIF player for my product documentations. <br/>
GIFs are easy to be implemented and maintained, then sometimes are better than videos.

So.. here it is! A reponsive GIF player featuring __preloader, prev/next commands and a fullscreen mode__.<br/>
It is __pure javascript and CSS__, then is super quick to be implemented and customized.

Supports modern browsers (_IE 10+_)


![lc-gif-player](https://lcweb.it/wp-content/uploads/2018/05/lc_gif_player_github.png)


&nbsp;


How to use
---

Easiest way to get started is to play with the demo.html file. Here's the code used:


``` html
<!doctype html>
<html>
<head>
	<link href="lc_gif_player.css" rel="stylesheet">
</head>

<body>
	<div class="gif_player">
		<img src="" rel:animated_src="path/to_the_image.gif" />
	</div>
	

	<script type="text/javascript" src="lc_gif_player.pack.js"></script>

	<script type="text/javascript">
	document.addEventListener("DOMContentLoaded", function(event) {   
		lc_gif_player('.gif_player');     
	});
	</script>
</body>
</html>
```

&nbsp;


Function parmeters
---

lc_gif_player function has got one mandatory and 3 optional parameters:

1. __DOM element selector__ _(string) (mandatory)_<br/>
 &nbsp; &nbsp; whatever you may target through _querySelectorAll_ javasctipt function

2. __Autoplay__ _(bool)_<br/>
 &nbsp; &nbsp; true if you want to autoplay the GIF once loaded. By default is false 

3. __Extra classes__ _(string)_<br/>
 &nbsp; &nbsp; you may need to add extra classes to player's wrapper. Just write them together in a single string  

4. __Hidden commands__ _(array)_<br/>
 &nbsp; &nbsp;  you can hide prev/next and fullscreen comands by inserting _move_ and _fullscreen_ keywords inside an array

&nbsp;

Here's a complete example

``` html
<script type="text/javascript">
lc_gif_player('.target_2', true, 'class1 class2', ['move', 'fullscreen']);
</script>
```

&nbsp;


### One last thing: same-domain origin


The gif has to be on the same domain (and port and protocol) as the page you're loading.

The library works by parsing gif image data in js, extracting individual frames, and rendering them on a canvas element. There is no way to get the raw image data from a normal image load, so this library does an XHR request for the image and forces the MIME-type to "text/plain". Consequently, using this library is subject to all the same cross-domain restrictions as any other XHR request.


* * *

Copyright &copy; [Luca Montanari (aka LCweb)](https://lcweb.it)
