'use strict' ;


class MessageManager {

    _host ;
    hostReady = false ;
    guestReady = false ;
    _onSendDate = undefined ;
    start ;

    constructor(host, engine) {
        this._host = host ;
        this.engine = engine ;

        engine.onFrameLog = frameLog => {
            this.sendFrameLog(frameLog) ;
        } ;
    }

    onMessage(data) {

        if (data.action === 'logFrame') {
            this.engine.logFrame(data.frameLog) ;
        } else if ( data.action === 'readyToStart' ) {
            this.guestReady = true ;
            if (this.areBothReady()) {
                this.setUpStartSong() ;
            }
        } else if (data.action === 'startDate') {
            let startDate = new Date(data.date) ;
            console.log('current date: ' + syncTime() ) ;
            console.log('date to start: ' + startDate) ;
            console.log('milis: '+ startDate.getMilliseconds() ) ;
            this.engine.startPlayBack(startDate, syncTime) ;
        } else if (data.action === 'requestDate') {
            this.sendDate() ;
        }

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

    requestDate() {
        this._host.send( {
            'action':'requestDate'
        }) ;
    }

    sendDate() {
        this._host.send(
            {
                'action':'currentDate',
                'value': new Date()
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

    setUpStartSong() {

        if (this._host instanceof Master) {
            // let currentDate = syncTime() ;
            let currentDate = new Date();
            let startDate = new Date(currentDate) ;
            startDate.setSeconds(currentDate.getSeconds() + 5.0) ;
            console.log('current date: ' + currentDate ) ;
            console.log('date to start: ' + startDate) ;
            console.log('milis: '+ startDate.getMilliseconds() ) ;
            this.sendStartDate(startDate) ;
            this.engine.startPlayBack(startDate, () =>  { return new Date() }) ;
            // this.engine.startPlayBack(startDate, syncTime) ;
        }
    }


}