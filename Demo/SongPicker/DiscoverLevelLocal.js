
function discoverLevels( sscPath ) {
    let song = new Song( sscPath ) ;

    selsong =  song ;

    let gl = document.getElementById('level') ;

    for ( let i = 0 ; i < song.levels.length ; i++ ) {

        let level = song.levels[i] ;


        let a = createListGroupLinkSubtitle(i, level.meta.METER + " - " + level.meta.DESCRIPTION, level.meta.STEPSTYPE, level.meta.CREDIT, function () {
            change_level(i) ;
        }) ;

        gl.append(a) ;

    }
}