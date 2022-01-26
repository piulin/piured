
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

    let config = {
        'speed': speed,
        'playback': playback,
        'offset': offset,
        'chartLevel': chart_level
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
        'noteskin': noteskin,
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
        }
    }


}