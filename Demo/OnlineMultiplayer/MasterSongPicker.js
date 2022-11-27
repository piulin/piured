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

// if (serverId !== undefined) {
//     intervalId = setInterval(() => {
//         $.ajax({
//             method: 'POST',
//             url: URLbattleServer + '/alive',
//             data: {'id': serverId},
//             dataType: 'json',
//             crossDomain: true,
//             async: true,
//         });
//     }, 3000)
// }

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
let slaveStageConfig = null ;
let gameWindow = null ;

m.onClose(()=>{
    $('#waitingForOpponentModal').modal('hide');
    $('#connectionClosedModal').modal('show');
}) ;

$('#connectionClosedModal').on('hide.bs.modal', function(){
    if (gameWindow !== null) {
        gameWindow.close() ;
    }
    window.location.href = '/piured/online-multiplayer.html' ;
}) ;

$('#highLatencyAlertGuest').hide() ;

let mm = new MessageManager(m) ;

mm.onStageConfig = (config) => {
    slaveIsReady = true ;
    slaveStageConfig = config ;
    console.log(config) ;
    $('#opponentReadyAlert').show() ;
    prepareBattleIfReady() ;
} ;

mm.onCancelStageConfig = () => {
    slaveIsReady = false ;
    $('#opponentReadyAlert').hide() ;
    $('#highLatencyAlertGuest').hide() ;
} ;

mm.onReceiveHighLatency = () => {
    $('#highLatencyAlertGuest').show() ;
} ;

mm.onReceivePerformance = (perf) =>  {
    $('#P2performanceSong').html($('#t').html() + " - " + $('#a').html() + " - Lvl. " + slaveStageConfig.levelDifficulty ) ;
    $('#P2perfect').html(perf.p) ;
    $('#P2great').html(perf.gr) ;
    $('#P2good').html(perf.go) ;
    $('#P2bad').html(perf.b) ;
    $('#P2miss').html(perf.m) ;
    $('#P2maxCombo').html(perf.maxCombo) ;
    $('#P2score').html(perf.score) ;
    $('#P2grade').html(perf.grade) ;
}

mm.onPopUpBlocked = () => {
    masterIsReady = false ;
    if (gameWindow !== null) {
        gameWindow.close() ;
    }
    $('#waitingForOpponentModal').modal('hide');
}

mm.onIncomingMessage = (message) => {
    receiveMessage(message)
}

readSongList() ;

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

    masterIsReady = true ;


    let speed = parseInt(document.getElementById('speed').value) ;
    let playback = 1.0 ;
    let offset = parseFloat(document.getElementById('offset').value) ;
    let noteskin = document.getElementById('noteskin').value ;
    let config = {
        'speed': speed,
        'playback': playback,
        'offset': offset,
        'sscpath': sscpath,
        'mp3path': mp3path,
        'chartLevel': chart_level,
        'noteskin': noteskin,
        'levelDifficulty': $('#m').html()
    } ;

    mm.sendStageConfig(config) ;

    prepareBattleIfReady();
}

$('#waitingForOpponentModal').on('hide.bs.modal', function(){
    masterIsReady = false ;
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
        'playerId': 0,
        'P1speed': speed,
        'P2speed': slaveStageConfig.speed,
        'playback': playback,
        'offset': offset,
        'P1noteskin': noteskin,
        'P2noteskin': slaveStageConfig.noteskin,
        'resources': resources,
        'sscpath': sscpath,
        'mp3path': mp3path,
        'resourcePath': 'piured-engine/',
        'leftKeyMap': leftKeyMap,
        'rightKeyMap': rightKeyMap,
        'P1chartLevel': chart_level,
        'P2chartLevel': slaveStageConfig.chartLevel
    } ;

    gameWindow = window.open("/piured/battleStage.html");

    if (gameWindow === null) {
        mm.sendPopUpBlocked() ;
        $('#waitingForOpponentModal').modal('hide');
        $('#popUpWindowModal').modal('show');

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

            const perf = window.performanceMetric[0] ;
            mm.sendPerformance(perf) ;
            $('#performance').collapse('show') ;
            window.scrollTo(0,0) ;
            $('#P1performanceSong').html( $('#t').html() + " - " + $('#a').html() + " - Lvl. " + $('#m').html() ) ;
            $('#P1perfect').html(perf.p) ;
            $('#P1great').html(perf.gr) ;
            $('#P1good').html(perf.go) ;
            $('#P1bad').html(perf.b) ;
            $('#P1miss').html(perf.m) ;
            $('#P1maxCombo').html(perf.maxCombo) ;
            $('#P1score').html(perf.score) ;
            $('#P1grade').html(perf.grade) ;
        }
    }


}

