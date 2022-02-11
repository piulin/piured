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
    _onPopUpBlocked = undefined ;
    _onReceivePerformance = undefined ;
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
        }else if (data.action === 'popUpBlocked') {
            if (this._onPopUpBlocked !== undefined) {
                this._onPopUpBlocked() ;
            }
        } else if ( data.action === 'performance') {
            if ( this._onReceivePerformance !== undefined ) {
                this._onReceivePerformance(data.performance) ;
            }
        }

    }


    set onReceivePerformance(value) {
        this._onReceivePerformance = value;
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


    set onPopUpBlocked(value) {
        this._onPopUpBlocked = value;
    }

    sendSelectedLevel(sscPath) {
        this._host.send({

            'action':'selectedLevel',
            'sscPath':sscPath

        }) ;
    }

    sendPerformance(performance) {
        this._host.send({
            'action':'performance',
            'performance':performance
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

    sendPopUpBlocked() {
        this._host.send({
            'action': 'popUpBlocked'
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