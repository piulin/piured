

async function setUpRemoteConnection(playerId, engine, onOpen) {


    if (playerId === 1) {

        let m = new Master() ;
        let mm = new MessageManager(m, engine) ;

        m.onOpen(() => {
            console.log('opened') ;
            onOpen(mm);
        }) ;
        m.onMessage(data => {
            mm.onMessage(data) ;
        })

        m.onIceCompleted(()=>{
            console.log(m.sdp) ;
            // alert(m.sdp) ;
            let remoteSDP = prompt('Type remote SDP: ') ;
            // let r = 'dj0wDQpvPS0gNDgyNDM2Nzc5MDE5NDU2OTQ2MCAyIElOIElQNCAxMjcuMC4wLjENCnM9LQ0KdD0wIDANCmE9Z3JvdXA6QlVORExFIDANCmE9ZXh0bWFwLWFsbG93LW1peGVkDQphPW1zaWQtc2VtYW50aWM6IFdNUw0KbT1hcHBsaWNhdGlvbiA5IFVEUC9EVExTL1NDVFAgd2VicnRjLWRhdGFjaGFubmVsDQpjPUlOIElQNCAwLjAuMC4wDQphPWNhbmRpZGF0ZTozMzc0OTk0NDEgMSB1ZHAgMjExMzkzNzE1MSAwZTM5MWU2ZC1lNmIxLTQxMDktYWZmMy02ZmQxYTM1ZTRmNDAubG9jYWwgNTg1ODUgdHlwIGhvc3QgZ2VuZXJhdGlvbiAwIG5ldHdvcmstY29zdCA5OTkNCmE9aWNlLXVmcmFnOjMxTDgNCmE9aWNlLXB3ZDpXZitzbC8xYWdVQXp4ZzY3Mm12WGVkMkYNCmE9aWNlLW9wdGlvbnM6dHJpY2tsZQ0KYT1maW5nZXJwcmludDpzaGEtMjU2IDEwOjIzOjdGOkQyOjNGOjM0OkQzOjk5OjY4OkMxOjk4OkJGOjA0OkM5OjYyOjQwOjY2OjdBOjQ0OjcxOjM4Ojc1OjQxOjAzOjk1OjUzOjYxOkU3OjMxOjk0Ojc5OkM3DQphPXNldHVwOmFjdGl2ZQ0KYT1taWQ6MA0KYT1zY3RwLXBvcnQ6NTAwMA0KYT1tYXgtbWVzc2FnZS1zaXplOjI2MjE0NA0K' ;
            m.addSlave(remoteSDP) ;
        }) ;

        await m.init() ;

        return mm ;



    } else if (playerId === 2) {

        let remoteSDP = prompt('Type remote SDP: ') ;
        // let r = 'dj0wDQpvPS0gODg3NDU3OTM1MjE2MjU2MjA0NCAyIElOIElQNCAxMjcuMC4wLjENCnM9LQ0KdD0wIDANCmE9Z3JvdXA6QlVORExFIDANCmE9ZXh0bWFwLWFsbG93LW1peGVkDQphPW1zaWQtc2VtYW50aWM6IFdNUw0KbT1hcHBsaWNhdGlvbiA5IFVEUC9EVExTL1NDVFAgd2VicnRjLWRhdGFjaGFubmVsDQpjPUlOIElQNCAwLjAuMC4wDQphPWNhbmRpZGF0ZTozMzc0OTk0NDEgMSB1ZHAgMjExMzkzNzE1MSAwYTg2ZGMzYi0xZmMxLTQyNTctYmU2My05MGIzZDEwYTQ5YmMubG9jYWwgNDQ4MDkgdHlwIGhvc3QgZ2VuZXJhdGlvbiAwIG5ldHdvcmstY29zdCA5OTkNCmE9aWNlLXVmcmFnOkUyYXANCmE9aWNlLXB3ZDp6Yk81eXp5aWZ4Q1FtSUptZ1RrSk1VV2kNCmE9aWNlLW9wdGlvbnM6dHJpY2tsZQ0KYT1maW5nZXJwcmludDpzaGEtMjU2IEEyOjM1OjA2OjlBOjkwOjMzOkREOjFFOjkyOjgwOkMyOjMwOjA5OkEzOkQwOkYyOjE3OjUyOkJCOkE4Ojg1OkRCOjUwOkFFOjAxOjk2OjQ1OkJBOkM3OkQxOjM0OjI1DQphPXNldHVwOmFjdHBhc3MNCmE9bWlkOjANCmE9c2N0cC1wb3J0OjUwMDANCmE9bWF4LW1lc3NhZ2Utc2l6ZToyNjIxNDQNCg==' ;
        let s = new Slave(remoteSDP) ;
        let mm = new MessageManager(s, engine) ;
        s.onOpen(() => {
            console.log('opened!');
            onOpen(mm);
        }) ;

        s.onIceCompleted(() => {

            s.onMessage(data => {
                mm.onMessage(data) ;
            })
            // console.log({'SDP': s.sdp}) ;
            console.log(s.sdp) ;
            // alert(s.sdp) ;
        }) ;

        await s.init() ;

        return mm ;



    }


}