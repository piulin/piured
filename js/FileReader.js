
function readFileContent (pathToFile, callbackFunction) {

    $.ajax(
        {
            url: pathToFile,
            method: 'GET',
            success: callbackFunction,
            crossDomain: true,
            async: false
        }
    ) ;

}
