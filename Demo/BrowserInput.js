/*
 * # Copyright (C) Pedro G. Bascoy
 # This file is part of piured <https://github.com/piulin/piured>.
 #
 # piured is free software: you can redistribute it and/or modify
 # it under the terms of the GNU General Public License as published by
 # the Free Software Foundation, either version 3 of the License, or
 # (at your option) any later version.
 #
 # piured is distributed in the hope that it will be useful,
 # but WITHOUT ANY WARRANTY; without even the implied warranty of
 # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 # GNU General Public License for more details.
 #
 # You should have received a copy of the GNU General Public License
 # along with piured. If not, see <http://www.gnu.org/licenses/>.
 *
 */

let addOffsetKeyMap = ',' ;
let subtractOffsetKeyMap = '.' ;

let addPlayBackSpeedKeyMap = '+' ;
let subtractPlayBackSpeedKeyMap = '-' ;

let playbackSpeedKeyInput = 1.0 ;

function onKeyDown(event) {

    let key = event.key.toLowerCase() ;

    if ( key === addOffsetKeyMap) {
        engine.updateOffset(0,0.01) ;
    } else if (key === subtractOffsetKeyMap ) {
        engine.updateOffset(0,-0.01 ) ;
    }

    else if ( key === addPlayBackSpeedKeyMap) {
        playbackSpeedKeyInput += 0.05 ;
        engine.tunePlayBackSpeed(playbackSpeedKeyInput) ;
    } else if (key === subtractPlayBackSpeedKeyMap) {
        playbackSpeedKeyInput -= 0.05 ;
        engine.tunePlayBackSpeed( playbackSpeedKeyInput ) ;
    }
    if (playbackSpeedKeyInput < 0.0) {
        playbackSpeedKeyInput = 0.0 ;
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

