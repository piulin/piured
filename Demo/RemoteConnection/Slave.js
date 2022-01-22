"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode


class Slave {

    _remoteConnection ;
    _dc ;
    onMessageFn ;
    onOpenFn ;

    constructor(sdp) {

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

        const offer = { "type":"offer","sdp":atob(sdp) } ;

        this._remoteConnection = new RTCPeerConnection(iceConfiguration) ;

        this._remoteConnection.ondatachannel = e => {

            const receiveChannel = e.channel;
            receiveChannel.onopen = e => console.log("open!");
            receiveChannel.onclose = e => console.log("closed!");
            this._dc = receiveChannel;
            this._dc.onmessage = e => this.onMessageFn(JSON.parse(e.data)) ;
            this._dc.onopen = e => this.onOpenFn() ;

        }
        this._remoteConnection.setRemoteDescription(offer).then(a=>console.log("done"))


    }

    onIceCompleted(func) {
        this._remoteConnection.onicegatheringstatechange = ev => {
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

    async init() {
        let a = await this._remoteConnection.createAnswer();
        await this._remoteConnection.setLocalDescription(a) ;
    }

    get sdp() {
        return btoa(this._remoteConnection.localDescription.sdp) ;
    }

    onMessage(func) {
        this.onMessageFn = func ;
    }

    onOpen(func) {
        this.onOpenFn = func ;
    }

    send(data) {
        this._dc.send(JSON.stringify(data)) ;
    }






}