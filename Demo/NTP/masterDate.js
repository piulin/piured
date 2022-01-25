

function masterDate(mm, onDate) {

    var clientTimestamp = new Date() ;
    mm.onReceiveDateDetails = (masterClientRequestDiffTime, masterTimeStamp) => {
        console.log('masterClientRequestDiffTime: ' +masterClientRequestDiffTime + ", masterTimeStamp: " + masterTimeStamp) ;
        var nowTimeStamp = new Date() ;
        var serverClientRequestDiffTime = masterClientRequestDiffTime;
        var serverTimestamp = masterTimeStamp;
        var serverClientResponseDiffTime = nowTimeStamp - serverTimestamp;
        console.log('serverClientResponseDiffTime: ' + serverClientResponseDiffTime) ;
        var responseTime = (serverClientRequestDiffTime - nowTimeStamp.valueOf() + clientTimestamp.valueOf() - serverClientResponseDiffTime )/2 ;
        console.log('responseTime: ' + responseTime) ;
        var syncedServerTime = new Date(new Date() + (serverClientResponseDiffTime - responseTime));
        console.log('syncedServerTime: '+ syncedServerTime) ;
        onDate(syncedServerTime) ;
    } ;
    mm.requestDate(clientTimestamp) ;

}

