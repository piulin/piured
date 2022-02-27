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

function stageCleared(performance) {

    window.opener.performanceMetric = performance ;
    document.removeEventListener( 'touchstart', onTouchDown, false );
    document.removeEventListener( 'touchend', onTouchUp, false );
    engine = null ;
    window.close() ;
    window.onGameHasEnded() ;


}

let config = window.config ;
console.log(config) ;
engine = new Engine() ;

let mm = config.mm ;
mm.engine = engine ;

let P1speed = config.P1speed ;
let P2speed = config.P2speed ;
let playback = 1.0 ;
let offset = config.offset ;
let P1noteskin = config.P1noteskin ;
let P2noteskin = config.P2noteskin ;
let resources = config.resources ;
let sscpath = config.sscpath ;
let mp3path = config.mp3path ;
let resourcePath = config.resourcePath ;
let leftKeyMap = config.leftKeyMap ;
let rightKeyMap = config.rightKeyMap ;
let P1chartLevel = config.P1chartLevel ;
let P2chartLevel = config.P2chartLevel ;
const playerId = config.playerId ;


let stageConfig = new StageConfig(resources+sscpath,
    resources+mp3path,
    playback,
    offset,
    'piured-engine/',
    [P1noteskin,P2noteskin],
    () => {
        mm.readyToStart() ;
    }) ;

engine.configureStage(stageConfig) ;
let p1InputConfig ;
let accuracyMargin = 0.15 ;

let p1StageType = engine.queryStageType(P1chartLevel) ;
let p2StageType = engine.queryStageType(P2chartLevel) ;

if (p1StageType === 'pump-double' || p1StageType === 'pump-halfdouble' || p2StageType === 'pump-double' || p2StageType === 'pump-halfdouble' ) {
    engine.setCameraPosition(0,-3.4,12) ;
}

window.onkeydown = onKeyDown ;
window.onkeyup = onKeyUp ;

p1InputConfig = new KeyInputConfig(leftKeyMap, rightKeyMap) ;

let p1Config = new PlayerConfig(p1InputConfig,
    P1noteskin,
    P1chartLevel,
    P1speed,
    accuracyMargin) ;

let p2Config = new PlayerConfig(new RemoteInput(),
    P2noteskin,
    P2chartLevel,
    P2speed,
    accuracyMargin) ;

if (playerId === 0) {
    let player1Id = engine.addPlayer(p1Config) ;
    let player2Id = engine.addPlayer(p2Config) ;
} else {
    let player2Id = engine.addPlayer(p2Config) ;
    let player1Id = engine.addPlayer(p1Config) ;
}


engine.addToDOM('container');

window.addEventListener( 'resize', engine.onWindowResize.bind(engine), false );

engine.onStageCleared = stageCleared ;

engine.start();

