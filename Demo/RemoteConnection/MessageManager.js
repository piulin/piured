'use strict' ;


class MessageManager {

    _host ;
    hostReady = false ;
    guestReady = false ;
    _onSendDate = undefined ;
    _onSelectedLevel = undefined ;
    _onStageConfig = undefined ;
    _onCancelStageConfig = undefined ;
    _onReceiveDateDetails = undefined ;
    _onReceiveHighLatency = undefined ;
    start ;
    _engine ;

    constructor(host) {
        this._host = host ;

        this._host.onMessage(data => {
            this.onMessage(data) ;
        }) ;
    }

    set engine (val) {
        this._engine = val ;
        this._engine.onFrameLog = frameLog => {
            this.sendFrameLog(frameLog) ;
        } ;
    }

    onMessage(data) {

        if (data.action === 'logFrame') {
            this._engine.logFrame(data.frameLog) ;
        } else if ( data.action === 'readyToStart' ) {
            this.guestReady = true ;
            if (this.areBothReady()) {
                this.setUpStartSong() ;
            }
        } else if (data.action === 'startDate') {
            let startDate = new Date(data.date) ;
            // console.log('current date: ' + syncTime() ) ;
            console.log('date to start: ' + startDate) ;
            console.log('milis: '+ startDate.getMilliseconds() ) ;

            // masterDate(this, (currentDate) => {
            //
            //     this._engine.startPlayBack(startDate, currentDate) ;
            //
            // }) ;

            this._engine.startPlayBack(startDate, syncTime) ;
        } else if (data.action === 'requestDate') {

            let slaveTimeStamp = new Date(data.slaveTimeStamp);
            let masterTimeStamp = new Date();

            let masterClientRequestDiffTime = masterTimeStamp - slaveTimeStamp;
            console.log('slaveTimeStamp: ' + slaveTimeStamp) ;


            this.sendDate(masterClientRequestDiffTime, masterTimeStamp);

        } else if (data.action === 'sendDateDetails') {
            if (this._onReceiveDateDetails !== undefined) {
                this._onReceiveDateDetails(parseFloat(data.masterClientRequestDiffTime), new Date(data.masterTimeStamp)) ;
            }

        } else if (data.action === 'selectedLevel') {
            if (this._onSelectedLevel !== undefined) {
                this._onSelectedLevel(data.sscPath) ;
            }
        } else if (data.action === 'stageConfig') {
            if (this._onStageConfig !== undefined) {
                this._onStageConfig(data.config) ;
            }
        } else if (data.action === 'cancelStageConfig') {
            if (this._onCancelStageConfig !== undefined) {
                this._onCancelStageConfig() ;
            }
        } else if (data.action === 'highLatency') {
            if (this._onReceiveHighLatency !== undefined) {
                this._onReceiveHighLatency() ;
            }
        }

    }



    set onSelectedLevel(val) {
        this._onSelectedLevel = val ;
    }

    set onStageConfig(val) {
        this._onStageConfig = val ;
    }

    set onCancelStageConfig(val) {
        this._onCancelStageConfig = val ;
    }

    set onReceiveDateDetails(val) {
        this._onReceiveDateDetails = val ;
    }

    set onReceiveHighLatency (val) {
        this._onReceiveHighLatency = val ;
    }

    sendSelectedLevel(sscPath) {
        this._host.send({

            'action':'selectedLevel',
            'sscPath':sscPath

        }) ;
    }

    sendStageConfig(config) {
        this._host.send({
            'action':'stageConfig',
            'config':config
        }) ;
    }

    sendCancelStageConfig() {
        this._host.send({
            'action': 'cancelStageConfig'
        }) ;
    }

    sendFrameLog(framelog) {

        this._host.send({

            'action':'logFrame',
            'frameLog':framelog

        }) ;

    }

    sendReadyToStart() {
        this._host.send({
            'action':'readyToStart'
        }) ;
    }

    sendStartDate(date) {
        this._host.send( {
            'action':'startDate',
            'date': date
        }) ;
    }

    requestDate(slaveTimeStamp) {
        this._host.send( {
            'action':'requestDate',
            'slaveTimeStamp': slaveTimeStamp
        }) ;
    }

    sendDate(masterClientRequestDiffTime, masterTimeStamp) {
        this._host.send(
            {
                'action':'sendDateDetails',
                'masterTimeStamp': masterTimeStamp,
                'masterClientRequestDiffTime': masterClientRequestDiffTime
            }
        ) ;
    }

    readyToStart() {
        this.hostReady = true ;
        console.log('I am ready to start') ;
        this.sendReadyToStart() ;
        if (this.areBothReady()) {
            this.setUpStartSong() ;
        }
    }

    areBothReady() {
        return this.hostReady && this.guestReady;

    }

    sendHighLatencyNotification() {
        this._host.send({
            'action': 'highLatency'
        }) ;
    }

    setUpStartSong() {

        this.hostReady = false ;
        this.guestReady = false ;

        if (this._host instanceof Master) {
            let currentDate = syncTime() ;
            // let currentDate = new Date();
            let startDate = new Date(currentDate) ;
            startDate.setSeconds(currentDate.getSeconds() + 8.0) ;
            console.log('current date: ' + currentDate ) ;
            console.log('date to start: ' + startDate) ;
            console.log('milis: '+ startDate.getMilliseconds() ) ;
            this.sendStartDate(startDate) ;
            // this._engine.startPlayBack(startDate, new Date()) ;
            this._engine.startPlayBack(startDate, syncTime) ;
        }

    }


}