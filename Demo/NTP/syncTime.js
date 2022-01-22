function syncTime() {
    // Set up our time object, synced by the HTTP DATE header
    // Fetch the page over JS to get just the headers
    console.log("syncing time")
    var r = new XMLHttpRequest();
    let systemtime ;
    var start = (new Date).getTime();

    r.open('HEAD', document.location, false);
    r.onreadystatechange = function()
    {
        if (r.readyState != 4)
        {
            return;
        }
        var latency = (new Date).getTime() - start;

        var timestring = r.getResponseHeader("DATE");

        // Set the time to the **slightly old** date sent from the
        // server, then adjust it to a good estimate of what the
        // server time is **right now**.
        systemtime = new Date(timestring);
        systemtime.setMilliseconds(systemtime.getMilliseconds() + (latency/2))
        console.log('latency: '+ latency) ;
    };
    r.send(null);
    return systemtime ;
}