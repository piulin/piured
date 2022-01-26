function syncTime() {
    // Set up our time object, synced by the HTTP DATE header
    // Fetch the page over JS to get just the headers
    // console.log("syncing time")
    let latency = 100000 ;
    let systemtime = null ;
    let i = 0 ;
    while( latency > 100 && i < 10) {
        var r = new XMLHttpRequest();
        var start = (new Date).getTime();

        r.open('HEAD', document.location + '?prevCache='+new Date(), false);
        r.onreadystatechange = function()
        {
            if (r.readyState != 4)
            {
                return;
            }
            latency = (new Date).getTime() - start;

            var timestring = r.getResponseHeader("DATE");

            // Set the time to the **slightly old** date sent from the
            // server, then adjust it to a good estimate of what the
            // server time is **right now**.
            systemtime = new Date(timestring);
            systemtime.setMilliseconds(systemtime.getMilliseconds() + (latency/2)) ;
            console.log('systemtime: '+systemtime) ;
            i ++ ;
            // console.log('latency: '+ latency) ;
        };
        r.send(null);
    }
    return systemtime ;
}

function getAverageLatency () {

    let latency = 0 ;

    for (let i = 0 ; i < 3 ; i++) {
        var r = new XMLHttpRequest();
        var start = (new Date).getTime();
        r.open('HEAD', document.location, false);
        r.onreadystatechange = function()
        {
            if (r.readyState != 4)
            {
                return;
            }
            latency += (new Date).getTime() - start;
            // console.log('latency: '+ latency) ;
        };
        r.send(null);
    }

    return latency /= 3.0 ;
}