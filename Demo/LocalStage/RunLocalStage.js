
function stageCleared(performance) {

    console.log(performance) ;
    document.removeEventListener( 'touchstart', onTouchDown, false );
    document.removeEventListener( 'touchend', onTouchUp, false );
    engine = null ;
    window.close() ;


}

let config = window.config ;

engine = new Engine() ;

let speed = config.speed ;
let playback = 1.0 ;
let offset = config.offset ;
let noteskin = config.noteskin ;
let touchpadSize = config.touchpadSize;
let useTouchInput = config.useTouchInput ;
let resources = config.resources ;
let sscpath = config.sscpath ;
let mp3path = config.mp3path ;
let resourcePath = config.resourcePath ;
let leftKeyMap = config.leftKeyMap ;
let rightKeyMap = config.rightKeyMap ;
let chartLevel = config.chartLevel ;


let stageConfig = new StageConfig(resources+sscpath,
    resources+mp3path,
    playback,
    offset,
    resourcePath,
    noteskin,
    () => {
        let dateToStart = new Date() ;
        // delay of 2 secs
        dateToStart.setMilliseconds(dateToStart.getMilliseconds() + 2000.0) ;
        engine.startPlayBack(dateToStart, () => {return new Date() ;}) ;
    }) ;

engine.configureStage(stageConfig) ;

let p1InputConfig ;
let accuracyMargin = 0.15 ;

if (useTouchInput) {

    if (document.requestFullscreen) {
        document.requestFullscreen();
    } else if (document.webkitRequestFullscreen) { /* Safari */
        document.webkitRequestFullscreen();
    } else if (document.msRequestFullscreen) { /* IE11 */
        document.msRequestFullscreen();
    }
    document.addEventListener( 'touchstart', onTouchDown, false );
    document.addEventListener( 'touchend', onTouchUp, false );

    let stageType = engine.queryStageType(chartLevel) ;
    if (stageType === 'pump-single') {
        p1InputConfig = new TouchInputConfig(0.8*touchpadSize,0,-9) ;
        engine.setCameraPosition(0,-6,17) ;
    } else if (stageType === 'pump-double' || stageType === 'pump-halfdouble') {
        p1InputConfig = new TouchInputConfig(0.55*touchpadSize,0,-12) ;
        engine.setCameraPosition(0,-8,22) ;
    }

} else {

    accuracyMargin = 0.25 ;

    window.onkeydown = onKeyDown ;
    window.onkeyup = onKeyUp ;

    p1InputConfig = new KeyInputConfig(leftKeyMap, rightKeyMap) ;
}

let p1Config = new PlayerConfig(p1InputConfig,
    chartLevel,
    speed,
    accuracyMargin) ;


engine.addPlayer(p1Config) ;


engine.addToDOM('container');

window.addEventListener( 'resize', engine.onWindowResize.bind(engine), false );

engine.stageCleared = stageCleared ;

engine.performReady() ;

engine.start();