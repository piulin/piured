# PIURED: A Web-based Pump It Up Engine
![PIURED](https://github.com/piulin/piured-engine/blob/main/imgs/piuredg.gif?raw=true)

## Engine Demo & Online Play

![Demo Webpage](https://github.com/piulin/piured-engine/blob/main/imgs/demo-webpage.png?raw=true)

Currently, this repository's [Github page site](https://piulin.github.io/piured/) is running a demo of the engine. 
There is also a tutorial on how to use the webpage to play Pump It Up online without Stepmania in this [youtube video](https://www.youtube.com/watch?v=UMc8gmjEE88).

[![Tutorial](https://img.youtube.com/vi/UMc8gmjEE88/0.jpg)](https://www.youtube.com/watch?v=UMc8gmjEE88)

In the demo webpage, you can:
1. Browse a list of hundreds of songs to play organized by dance stages.
2. Select from a number of different levels (both single and double-style).
3. Choose from a variety of official [noteskins](https://github.com/cesarmades/piunoteskins).
4. Tune your stepchart speed & beat offset.
5. Select Keyboard or Touch as input methods.
6. Play a tune alone or create a battle to play online with a friend!

The default keymap is the following:
- Pump-single: 'Q', 'E', 'S', 'Z', and 'C' keys for up-left, up-right, center, down-left and down-right steps,
respectively.
- Pump-double: 'Q', 'E', 'S', 'Z', and 'C' keys for up-left, up-right, center, down-left and down-right steps of the LEFT dance pad,
respectively, and 'R', 'Y', 'G', 'V', and 'N'  keys for up-left, up-right, center, down-left and down-right steps of the RIGHT dance pad,
respectively.

## Browser Requirements

PIURED's demo should work without issues in any modern browser. Mozilla Firefox, Chrome, or any 
Chrome-based browser (e.g. Opera, Microsoft Edge) have already been successfully tested. In case
you are using a different browser, make sure it supports:
1. WebGL (a graphics library for drawing graphics on the web). 
   You can check your browser's compatibility [here](https://get.webgl.org/).
2. WebAudio (a library for handling audio & effects on the web). 
   [Here](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API#browser_compatibility)
   is a comprehensive list with all compatible browsers.
   
### Troubleshooting

1. Safari won't load up the dance stage: Unfortunately, Safari does NOT currently support WebAudio
   (it is a experimental feature that must be enabled in the browser settings). Try out any other browser.
2. Low FPS: It could happen for a number of reasons. Chances are, specially if you are on Linux,
that you don't have video acceleration enabled/installed in your system/browser. 
   [Here](https://wiki.archlinux.org/title/Hardware_video_acceleration) is a pointer on how to fix
   it.
3. The stage loads up, but the song won't start playing: Some browsers feature a system that prevents audio to be
played if the user did not interact with the webpage (e.g. Google Chrome). 
   Make sure to make interactions (e.g. by clicking anywhere in the screen) way before the song starts to play.

## Hardware Requirements

- CPU: Anything that is less than 15 years old, I guess.
- GPU: Any integrated GPU (iGPU) would do.

## License

This project is licensed under the terms of the GPL-3.0 license.
