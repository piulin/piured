


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

mm.onPopUpBlocked = () => {
    masterIsReady = false ;
    if (gameWindow !== null) {
        gameWindow.close() ;
    }
    $('#waitingForOpponentModal').modal('hide');
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

    let config = {
        'speed': speed,
        'playback': playback,
        'offset': offset,
        'sscpath': sscpath,
        'mp3path': mp3path,
        'chartLevel': chart_level
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
        'noteskin': noteskin,
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
        }
    }


}

