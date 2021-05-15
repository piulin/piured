
function readFileContent (pathToFile, callbackFunction) {

    $.ajax(
        {
            url: pathToFile,
            success: callbackFunction,
            dataType: 'text',
            async: false
        }
    ) ;

}
