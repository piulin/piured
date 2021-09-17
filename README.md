# PIURED: A Web-based Pump It Up Engine
![PIURED](https://github.com/piulin/piured/blob/main/imgs/piuredg.gif?raw=true)


## Introduction

PIURED is a Pump It Up stage simulator that works directly in your browser.
There are already a number of dance simulators for Windows and Linux, most of them being StepMania-based. 
Stepmania is a great choice for DDR-style rhythm games, however it lacks to capture the behaviour as well as
the feel & look of a Pump It Up arcade. 

In this sense, PIURED's goal is to recreate as accurately as possible the Pump It Up-style experience
whilst keeping the engine cross-platform (web-based), so it can be enjoyed anywhere and anytime.

## Engine Demo & Online Play

![Demo Webpage](https://github.com/piulin/piured/blob/main/imgs/demo-webpage.png?raw=true)

Currently, this repository's [Github page site](https://piulin.github.io/piured/) is running a demo of the engine. 
There is also a tutorial on how to use the webpage to play Pump It Up online without Stepmania in this [youtube video](https://www.youtube.com/watch?v=UMc8gmjEE88).

[![Tutorial](https://img.youtube.com/vi/UMc8gmjEE88/0.jpg)](https://www.youtube.com/watch?v=UMc8gmjEE88)

In the demo webpage, you can:
1. Browse a list of hundreds of songs to play organized by dance stages.
2. Select from a number of different levels (both single and double-style).
3. Choose from a variety of official [noteskins](https://github.com/cesarmades/piunoteskins).
4. Tune your stepchart speed & beat offset.
5. Play a tune!

The current keymap (no rebind possible) is the following:
- Pump-single: 'Q', 'E', 'S', 'Z', and 'C' keys for up-left, up-right, center, down-left and down-right steps,
respectively.
- Pump-double: 'Q', 'E', 'S', 'Z', and 'C' keys for up-left, up-right, center, down-left and down-right steps of the LEFT dance pad,
respectively, and 'R', 'Y', 'G', 'V', and 'N'  keys for up-left, up-right, center, down-left and down-right steps of the RIGHT dance pad,
respectively.

## Browser Requirements

PIURED's engine should work without issues in any modern browser. Mozilla Firefox, Chrome, or any 
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

## Engine Review

PIURED is written in its whole in Javascript using [ThreeJS](https://threejs.org/). The code is organized
trying to mimick the structure of any game engine. The source code can be found in this repo under the folder `js`.

### Features

PIURED's engine features:

1. A Stepmania SSC parser. Stepcharts can be directly read from bare Stepmania files. No need to
convert them into another intermediate format. This means that all the songs that are available for Pump-style
   would work off-the-shelf in PIURED.
2. A loader that supports both MP3 and OGG audio formats. These are the most common formats used in Stepmania audio files.
4. Support for changes of BPM, changes of SCROLL as well as changes of SPEED (attributes used in Stepmania to create effects).
3. Pump-single and Pump-double styles.
4. VS. mode, including two players playing any combination of Pump-single and Pump-double styles.
5. On-the-fly tuning of the offset parameter.
6. Variable speed rates.
7. A number of Noteskins to choose from (sprite-based).
8. Game performance metrics.
9. Visual effects close to the original arcade.
10. A background theme which "FEELS THE BEAT".

### Limitations

There are, however, some features available in Stepmania that
PIURED does not support:

1. The engine does not support STOPS, or changes of it.
2. The engine only supports a 4/4 bar.
3. BGA in any video format is not supported.
4. Dance pads or Joysticks are not supported as input methods.
5. Performance metrics may not be deterministic.
6. Only Pump-single and Pump-double styles are supported. Pump-halfdouble and any other may cause 
the engine to crash.

## Contributing

Do you think everything is wrong? Don't you like what you see? I'd love to hear from you!
You can always get in touch with me by dropping an e-mail at <pepo_gonba@hotmail.com>. 
If you feel like getting your hands dirty, you can also
submit a pull request!

## Future Work

This project is currently being migrated to Godot. The final goal is to create a battle
platform, similar in style and functionality to [lichess](https://lichess.org).

## License

This project is licensed under the terms of the GPL-3.0 license.
