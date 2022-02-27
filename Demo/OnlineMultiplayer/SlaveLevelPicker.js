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

let leftKeyMap = {
    dl: 'Z',
    ul : 'Q',
    c : 'S',
    ur : 'E',
    dr: 'C'
}

let rightKeyMap = {
    dl: 'V',
    ul : 'R',
    c : 'G',
    ur : 'Y',
    dr: 'N'
}

let slaveIsReady = false ;
let masterIsReady = false ;
let masterStageConfig = null ;
let gameWindow = null ;

$('#opponentReadyAlert').hide() ;
$('#highLatencyAlertGuest').hide() ;

s.onClose(()=>{
    $('#waitingForOpponentModal').modal('hide');
    $('#connectionClosedModal').modal('show');
}) ;

$('#connectionClosedModal').on('hide.bs.modal', function(){
    if (gameWindow !== null) {
        gameWindow.close() ;
    }
    window.location.href = '/piured/online-multiplayer.html' ;
}) ;


let mm = new MessageManager(s) ;



mm.onPopUpBlocked = () => {
    slaveIsReady = false ;
    if (gameWindow !== null) {
        gameWindow.close() ;
    }
    $('#waitingForOpponentModal').modal('hide');

}

mm.onSelectedLevel = (sscPath) => {
    slaveIsReady = false ;
    $('#waitingForOpponentModal').modal('hide');
    mm.sendCancelStageConfig() ;
    clear('level') ;
    discoverLevels(sscPath) ;
    change_level(0) ;
}

mm.onStageConfig = (config) => {
    masterIsReady = true ;
    masterStageConfig = config ;
    $('#opponentReadyAlert').show() ;
    prepareBattleIfReady();
}

mm.onCancelStageConfig = () => {
    masterIsReady = false ;
    $('#opponentReadyAlert').hide() ;
    $('#highLatencyAlertGuest').hide() ;
}

mm.onReceivePerformance = (perf) =>  {
    $('#P1performanceSong').html($('#t').html() + " - " + $('#a').html() + " - Lvl. " + masterStageConfig.levelDifficulty ) ;
    $('#P1perfect').html(perf.p) ;
    $('#P1great').html(perf.gr) ;
    $('#P1good').html(perf.go) ;
    $('#P1bad').html(perf.b) ;
    $('#P1miss').html(perf.m) ;
    $('#P1maxCombo').html(perf.maxCombo) ;
    $('#P1score').html(perf.score) ;
    $('#P1grade').html(perf.grade) ;
}

mm.onReceiveHighLatency = () => {
    $('#highLatencyAlertGuest').show() ;
} ;

function checkLatency() {
    return getAverageLatency() <= 50.0;

}

function joinBattle() {

    $('#highLatencyAlertModal').hide() ;
    $('#waitingForOpponentModal').modal('show');

    if (checkLatency() === false ) {
        $('#highLatencyAlertModal').show() ;
        mm.sendHighLatencyNotification() ;
    }

    slaveIsReady = true ;

    let speed = parseInt(document.getElementById('speed').value) ;
    let playback = 1.0 ;
    let offset = parseFloat(document.getElementById('offset').value) ;
    let noteskin = document.getElementById('noteskin').value ;
    let config = {
        'speed': speed,
        'playback': playback,
        'offset': offset,
        'chartLevel': chart_level,
        'noteskin': noteskin,
        'levelDifficulty': $('#m').html()
    } ;

    mm.sendStageConfig(config) ;

    prepareBattleIfReady();
}

$('#waitingForOpponentModal').on('hide.bs.modal', function(){
    slaveIsReady = false ;
    mm.sendCancelStageConfig() ;
}) ;

function prepareBattleIfReady() {
    if (slaveIsReady && masterIsReady) {
        prepareBattle() ;
    }
}

function prepareBattle() {

    slaveIsReady = false;
    masterIsReady = false ;
    mm.sendCancelStageConfig() ;

    let speed = parseInt(document.getElementById('speed').value) ;
    let playback = 1.0 ;
    let offset = parseFloat(document.getElementById('offset').value) ;
    let noteskin = document.getElementById('noteskin').value ;

    let config = {
        'mm': mm,
        'playerId': 1,
        'P2speed': masterStageConfig.speed,
        'P1speed': speed,
        'playback': playback,
        'offset': offset,
        'P1noteskin': noteskin,
        'P2noteskin': masterStageConfig.noteskin,
        'resources': resources,
        'sscpath': masterStageConfig.sscpath,
        'mp3path': masterStageConfig.mp3path,
        'resourcePath': 'piured-engine/',
        'leftKeyMap': leftKeyMap,
        'rightKeyMap': rightKeyMap,
        'P2chartLevel': masterStageConfig.chartLevel,
        'P1chartLevel': chart_level
    } ;

    gameWindow = window.open("/piured/battleStage.html");

    if (gameWindow === null) {
        $('#waitingForOpponentModal').modal('hide');
        $('#popUpWindowModal').modal('show');
        mm.sendPopUpBlocked() ;

    } else {
        gameWindow.config = config ;
        gameWindow.onGameHasEnded = () => {
            $('#waitingForOpponentModal').modal('hide');
            mm.sendCancelStageConfig() ;
            gameWindow = null ;
        }

        gameWindow.onbeforeunload = () => {
            $('#waitingForOpponentModal').modal('hide');
            mm.sendCancelStageConfig() ;
            gameWindow = null ;

            const perf = window.performanceMetric[1] ;
            mm.sendPerformance(perf) ;
            $('#performance').collapse('show') ;
            window.scrollTo(0,0) ;
            $('#P2performanceSong').html($('#t').html() + " - " + $('#a').html() + " - Lvl. " + $('#m').html() ) ;
            $('#P2perfect').html(perf.p) ;
            $('#P2great').html(perf.gr) ;
            $('#P2good').html(perf.go) ;
            $('#P2bad').html(perf.b) ;
            $('#P2miss').html(perf.m) ;
            $('#P2maxCombo').html(perf.maxCombo) ;
            $('#P2score').html(perf.score) ;
            $('#P2grade').html(perf.grade) ;

        }
    }


}