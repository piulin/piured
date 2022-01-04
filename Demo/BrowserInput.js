

let addOffsetKeyMap = '1' ;
let subtractOffsetKeyMap = '2' ;

let addPlayBackSpeedKeyMap = '3' ;
let subtractPlayBackSpeedKeyMap = '4' ;


function onKeyDown(event) {

    let key = event.key.toLowerCase() ;

    if ( key === addOffsetKeyMap) {
        engine.updateOffset(1,0.01) ;
    } else if (key === subtractOffsetKeyMap ) {
        engine.updateOffset(1,-0.01 ) ;
    }

    else if ( key === addPlayBackSpeedKeyMap) {
        engine.tunePlayBackSpeed(0.05) ;
    } else if (key === subtractPlayBackSpeedKeyMap) {
        engine.tunePlayBackSpeed( -0.05 ) ;
    }


    engine.keyDown(event) ;

}

function onKeyUp(event) {

    engine.keyUp(event) ;

}

function onTouchDown(event) {

    event.preventDefault();
    event.stopPropagation();
    engine.touchDown(event) ;

}

function onTouchUp(event) {

    event.preventDefault();
    event.stopPropagation();
    engine.touchUp(event) ;

}

