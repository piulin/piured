"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode


class Master {

    _localConnection ;
    _dc ;

    constructor(onSDPReady) {



        //you can specify a STUN server here
        const iceConfiguration = { }
        iceConfiguration.iceServers = [];
        //turn server
        // iceConfiguration.iceServers.push({
        //                 urls: 'turn:my-turn-server.mycompany.com:19403',
        //                 username: 'optional-username',
        //                 credentials: 'auth-token'
        //             })
        //stun  server
        iceConfiguration.iceServers.push({
                        urls: 'stun:stun4.l.google.com:19302'
                    }) ;
        // const localConnection = new RTCPeerConnection(iceConfiguration)



        // this._localConnection = new RTCPeerConnection(iceConfiguration) ;
        this._localConnection = new RTCPeerConnection() ;
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

    addSlave(sdp) {
        const answer = { "type":"answer","sdp": atob(sdp) } ;
        // this._localConnection.setRemoteDescription(answer).then(a=> console.log('SDP added')).catch(console.error('wrong sdp')) ;
        this._localConnection.setRemoteDescription(answer).then(a=> console.log('SDP added')) ;
    }





}