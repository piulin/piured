"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode


class Slave {

    _remoteConnection ;
    _dc ;
    onMessageFn ;
    onOpenFn ;

    constructor(sdp, onSDPFail = undefined, onSDPOk = undefined) {

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

        let offer ;
        try {
            offer = { "type":"offer","sdp":atob(sdp) } ;
        } catch (e) {
            onSDPFail() ;
            return ;
        }


        this._remoteConnection = new RTCPeerConnection(iceConfiguration) ;
        // this._remoteConnection = new RTCPeerConnection() ;

        this._remoteConnection.ondatachannel = e => {

            const receiveChannel = e.channel;
            receiveChannel.onopen = e => console.log("open!");
            receiveChannel.onclose = e => console.log("closed!");
            this._dc = receiveChannel;
            this._dc.onmessage = e => this.onMessageFn(JSON.parse(e.data)) ;
            this._dc.onopen = e => this.onOpenFn() ;

        }
        this._remoteConnection.setRemoteDescription(offer).then( () => {
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

    onClose(func) {
        this._dc.onclose = func ;
    }





}