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
"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode


class Master {

    _localConnection ;
    _dc ;

    constructor() {


        const iceConfiguration = { }
        iceConfiguration.iceServers = [];


        iceConfiguration.iceServers.push({
            urls: 'turn:piulin.gentakojima.me:3478?transport=tcp',
            credential: 'jwKfAooM69Pp8pAXojt',
            username: 'piured'
        }) ;

        iceConfiguration.iceServers.push({
            urls: 'stun:stun4.l.google.com:19302'
        }) ;

        iceConfiguration.iceServers.push({
            urls: 'stun:stun2.l.google.com:19302'
        }) ;

        iceConfiguration.iceServers.push({
            urls: 'stun:stunserver.org'
        }) ;



        this._localConnection = new RTCPeerConnection(iceConfiguration) ;
        // this._localConnection = new RTCPeerConnection() ;
        this._dc = this._localConnection.createDataChannel("dc");
        this._dc.onclose = e => console.log("Connection closed!");

    }

    onIceCompleted(func) {
        this._localConnection.onicegatheringstatechange = ev => {
            let connection = ev.target;
            switch(connection.iceGatheringState) {
                case "gathering":
                    console.log('gathering') ;
                    break;
                case "complete":
                    console.log('complete') ;
                    func() ;
                    break;
            }
        }
    }

    async init () {
       let o = await this._localConnection.createOffer() ;
       await this._localConnection.setLocalDescription(o) ;
    }

    get sdp() {
        return btoa(this._localConnection.localDescription.sdp);
    }

    onMessage(func) {
        this._dc.onmessage = e => func(JSON.parse(e.data)) ;
    }

    onOpen(func) {
        this._dc.onopen = e => func();
    }

    send(data) {
        this._dc.send(JSON.stringify(data)) ;
    }

    addSlave(sdp, onSDPFail = undefined, onSDPOk = undefined) {
        let answer ;
        try {
            answer = { "type":"answer","sdp": atob(sdp) } ;
        } catch (e) {
            onSDPFail() ;
            return ;
        }

        // this._localConnection.setRemoteDescription(answer).then(a=> console.log('SDP added')).catch(console.error('wrong sdp')) ;
        this._localConnection.setRemoteDescription(answer).then( () => {
                if (onSDPOk !== undefined ) {
                    onSDPOk () ;
                }
            }
        ).catch( () => {
            if (onSDPFail !== undefined ) {
                onSDPFail() ;
            }
        }) ;
    }


    onClose(func) {
        this._dc.onclose = func ;
    }



}