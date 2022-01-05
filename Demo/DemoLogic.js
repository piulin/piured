$.ajaxSetup({
    async: false
});
let engine = null
let audioBuf = null
let chart_level = null
let speed = null
let songsJson = null
let stageIndex = null
let songIndex = null
let mp3path = null
let sscpath = null
let selsong = null

let leftKeyMap = {
    dl: 'Z',
    ul : 'Q',
    c : 'S',
    ur : 'E',
    dr: 'C'
}

let rightKeyMap = {
    dl: 'V',
    ul : 'R',
    c : 'G',
    ur : 'Y',
    dr: 'N'
}

//FOR IOS/MAC: https://paulbakaus.com/tutorials/html5/web-audio-on-ios/
// window.addEventListener('touchstart', function() {
//
//     let context = null ;
//     if('webkitAudioContext' in window) {
//         context = new webkitAudioContext();
//     } else {
//         context = new AudioContext();
//     }
//     // create empty buffer
//     var buffer = context.createBuffer(1, 1, 22050);
//     var source = context.createBufferSource();
//     source.buffer = buffer;
//
//     // connect to output (your speakers)
//     source.connect(context.destination);
//
//     // play the file
//     source.noteOn(0);
//
// }, false);

let resources = 'https://piulin.gentakojima.me/'
// let resources = './'
$(window).on('unload', function() {
    if (engine != null) {
        engine.song.closeBuff() ;
    }

});
function keyMapChanged(km, pad, step) {

    km.value = km.value.charAt(0).toUpperCase() ;

    if (pad === 'l') {
        leftKeyMap[step] = km.value ;
        localStorage.setItem("last_lpad", JSON.stringify(leftKeyMap));
    } else {
        rightKeyMap[step] = km.value ;
        localStorage.setItem("last_rpad", JSON.stringify(rightKeyMap));
    }



}

function getDancePadCurrentValue(pad, step) {
    if (pad === 'l') {
        return leftKeyMap[step] ;
    } else {
        return rightKeyMap[step] ;
    }
}

function play(){
    engine = new Engine() ;

    document.getElementById('selector').style.display = 'none' ;
    document.getElementById('navbar').style.display = 'none' ;
    document.getElementById('container').style.display = 'block' ;

    let speed = parseInt(document.getElementById('speed').value) ;
    let playback = 1.0 ;
    let offset = parseFloat(document.getElementById('offset').value) ;
    let noteskin = document.getElementById('noteskin').value ;
    let touchpadSize = 1.2 - (document.getElementById('touchpadSize').value/10.0) ;
    let useTouchInput = document.getElementById("touchInput").checked ;

    console.log(touchpadSize) ;

    engine.configureStage(resources+sscpath,
                        resources+mp3path,
                                playback,
                                offset,
                                'piured-engine/',
                                noteskin) ;

    let p1InputConfig ;
    let accuracyMargin = 0.15 ;

    if (useTouchInput) {

        if (document.requestFullscreen) {
            document.requestFullscreen();
        } else if (document.webkitRequestFullscreen) { /* Safari */
            document.webkitRequestFullscreen();
        } else if (document.msRequestFullscreen) { /* IE11 */
            document.msRequestFullscreen();
        }
        document.addEventListener( 'touchstart', onTouchDown, false );
        document.addEventListener( 'touchend', onTouchUp, false );

        let stageType = engine.queryStageType(chart_level) ;
        if (stageType === 'pump-single') {
            p1InputConfig = new TouchInputConfig(0.8*touchpadSize,0,-9) ;
            engine.setCameraPosition(0,-6,17) ;
        } else if (stageType === 'pump-double' || stageType === 'pump-halfdouble') {
            p1InputConfig = new TouchInputConfig(0.55*touchpadSize,0,-12) ;
            engine.setCameraPosition(0,-8,22) ;
        }

    } else {

        accuracyMargin = 0.25 ;

        window.onkeydown = onKeyDown ;
        window.onkeyup = onKeyUp ;

        p1InputConfig = new KeyInputConfig(leftKeyMap, rightKeyMap) ;
    }

    let p1Config = new PlayerConfig(p1InputConfig,
        chart_level,
        speed,
        accuracyMargin) ;



    engine.addPlayer(p1Config) ;




    engine.addToDOM('container');

    window.addEventListener( 'resize', engine.onWindowResize.bind(engine), false );

    engine.stageCleared = stageCleared ;

    engine.start();
}

function discoverLevels( sscPath ) {
    let song = new Song( sscPath ) ;

    selsong =  song ;  // localStorage.setItem('song', JSON.stringify(song)); //stringify object and store

    let gl = document.getElementById('level') ;

    for ( let i = 0 ; i < song.levels.length ; i++ ) {

        let level = song.levels[i] ;

        // console.log(level.meta.METER)

        let a = createListGroupLinkSubtitle(i, level.meta.METER + " - " + level.meta.DESCRIPTION, level.meta.STEPSTYPE, level.meta.CREDIT, function () {
            change_level(i) ;
        }) ;

        gl.append(a) ;

    }
}



function change_level(l) {
    // alert('The option with value ' + $(this).val());

    localStorage.setItem('last_level', l)
    chart_level = l ;
    let song = selsong ;
    let level = song.levels[l] ;

    document.getElementById('st').innerHTML = level.meta.STEPSTYPE ;
    document.getElementById('t').innerHTML = song.meta.TITLE ;
    document.getElementById('a').innerHTML = song.meta.ARTIST ;
    document.getElementById('d').innerHTML = level.meta.DESCRIPTION ;
    document.getElementById('m').innerHTML = level.meta.METER ;
    document.getElementById('c').innerHTML = level.meta.CREDIT ;
    document.getElementById('b').innerHTML = song.getBMPs(l)[0][1];

    if ( song.getStops(l).length > 0  ) {
        document.getElementById('stops').innerHTML = 'YES' ;
    } else {
        document.getElementById('stops').innerHTML = 'NO' ;
    }

    if ( song.getDelays(l).length > 0  ) {
        document.getElementById('delays').innerHTML = 'YES' ;
    } else {
        document.getElementById('delays').innerHTML = 'NO' ;
    }

    if ( song.getScrolls(l).length > 1  ) {
        document.getElementById('scrolls').innerHTML = 'YES' ;
    } else {
        document.getElementById('scrolls').innerHTML = 'NO' ;
    }

    if ( song.getSpeeds(l).length > 1  ) {
        document.getElementById('speeds').innerHTML = 'YES' ;
    } else {
        document.getElementById('speeds').innerHTML = 'NO' ;
    }

    if (('WARPS' in level.meta && level.meta.WARPS[0].length > 1) ) {
        document.getElementById('playable-false').style.display = '' ;
        document.getElementById('playable-true').style.display = 'none' ;

    } else {
        document.getElementById('playable-false').style.display = 'none' ;
        document.getElementById('playable-true').style.display = '' ;

        if ( level.meta.STEPSTYPE === 'pump-single' || level.meta.STEPSTYPE === 'pump-double' || level.meta.STEPSTYPE === 'pump-halfdouble') {
            document.getElementById('playable-false').style.display = 'none' ;
            document.getElementById('playable-true').style.display = '' ;
        } else {
            document.getElementById('playable-false').style.display = '' ;
            document.getElementById('playable-true').style.display = 'none' ;
        }

    }




}


function clear(id) {
    var gl = document.getElementById(id);
    gl.innerHTML = '' ;
}


$( "#noteskin" ).on("change", function(){
  localStorage.setItem("last_noteskin", $(this).val());
});

$( "#touchpadSize" ).on("change", function(){
    localStorage.setItem("touchpadSize", $(this).val());
});


$( "#speed" ).on("change", function(){
  localStorage.setItem("last_speed", $(this).val());
});

$( "#offset" ).on("change", function(){
  localStorage.setItem("last_offset", $(this).val());
});

$("#touchInput").on("change", function() {
        localStorage.setItem("inputTouch", this.checked ? "true": "false")
});

function changeOnlineSong(i){

    localStorage.setItem("last_song", i);

    clear('level')
    songIndex = i
    let song = songsJson.children[stageIndex].children[i] ;


    let x=/^[^.]+\.(mp3|wav|ogg)$/i;
    let y=/^[^.]+\.ssc$/i;

    mp3path = null
    sscpath = null

    for ( let i = 0 ; i < song.children.length ; i++ ) {

        let attr = song.children[i] ;
        if ( JSON.parse(localStorage.getItem("last_lpad")) !== null ) {
        }
        if (x.test(attr.name)) {
            mp3path = attr.path ;
        }

        if (y.test(attr.name)) {
            sscpath = attr.path ;
        }
    }


    discoverLevels( resources + sscpath ) ;
    // change_level(0) ;
}

function createListGroupLink(idx, title, number, onclick) {
    let a = document.createElement('a');
    a.href = '#' ;
    a.setAttribute('data-idx', idx) ;
    a.setAttribute('data-bs-toggle', "list") ;
    a.className = "list-group-item list-group-item-action" ;
    a.onclick = onclick ;

    let div1 = document.createElement('div') ;
    div1.className = "d-flex w-100 justify-content-between" ;

    let divName = document.createElement('div') ;
    divName.className = "title" ;
    divName.innerHTML = title ;

    let span = document.createElement('span') ;
    span.className = "badge bg-primary rounded-pill" ;
    span.style = 'height: 20px;'
    span.innerHTML = number;

    div1.append(divName) ;
    if (number !== 0) {
        div1.append(span) ;
    }
    a.append(div1) ;
    return a ;
}
function createListGroupLinkSubtitle(idx, title, aside, subtitle, onclick) {
    let a = document.createElement('a');
    a.href = '#' ;
    a.setAttribute('data-idx', idx) ;
    a.setAttribute('data-bs-toggle', "list") ;
    a.className = "list-group-item list-group-item-action" ;
    a.onclick = onclick ;

    let div1 = document.createElement('div') ;
    div1.className = "d-flex w-100 justify-content-between" ;

    let divName = document.createElement('div') ;
    divName.className = "fw-bold" ;
    divName.innerHTML = title ;

    let small = document.createElement('small') ;
    small.innerHTML = aside;

    let small2 = document.createElement('small') ;
    small2.innerHTML = subtitle;

    div1.append(divName) ;

    div1.append(small) ;
    a.append(div1) ;

    a.append(small2) ;
    return a ;
}

function readSongList() {


    $.getJSON("songs.json", function(json) {

        let stages = json.children[0] ;

        songsJson = stages


        let gl = document.getElementById('stage') ;

        for ( let i = 0 ; i < stages.children.length ; i++ ) {

                let stage = stages.children[i] ;

                // console.log(level.meta.METER)

                let a = createListGroupLink(i, stage.name, stage.children.length,
                    function () {
                        change_stage(i);
                    }) ;
                gl.append(a) ;


        }

        /* Set default selection for dynamic values: Stage, Song and Level */

        let default_stage = localStorage.getItem("last_stage") !== null ? parseInt(localStorage.getItem("last_stage")) : 5 ;
        change_stage(default_stage) ;

        let default_song = localStorage.getItem("last_song") !== null ? parseInt(localStorage.getItem("last_song")) : 0 ;
        changeOnlineSong(default_song) ;
        let default_level = localStorage.getItem("last_level") !== null ? parseInt(localStorage.getItem("last_level")) : 0 ;

        change_level(default_level) ;


    });
}

function change_stage(i) {
    // alert('The option with value ' + $(this).val());
    localStorage.setItem('last_stage', i) ;
    clear('online-song') ;
    clear('level')
    stageIndex = i ;
    let stage = songsJson.children[i] ;


    let gl = document.getElementById('online-song') ;

    for ( let i = 0 ; i < stage.children.length ; i++ ) {

        let song = stage.children[i] ;

        let a = createListGroupLink(i, song.name, 0,
            function () {
                changeOnlineSong(i) ;
            }) ;

        gl.append(a) ;


    }
}



/* Load dynamic values and set thise defaults */

readSongList() ;

/* Set default selection for static values: Noteskin, Speed and Offset */

let inputTouch = localStorage.getItem("inputTouch") !== null ? JSON.parse(localStorage.getItem("inputTouch")) : false ;
$( "#touchInput" ).prop('checked', inputTouch) ;


let default_noteskin = localStorage.getItem("last_noteskin") !== null ? localStorage.getItem("last_noteskin") : "EXCEED2-OLD" ;
$( "#noteskin" ).val(default_noteskin) ;

let default_speed = localStorage.getItem("last_speed") !== null ? parseFloat(localStorage.getItem("last_speed")) : 3 ;
$( "#speed" ).val(default_speed) ;

let touchpadSize = localStorage.getItem("touchpadSize") !== null ? parseFloat(localStorage.getItem("touchpadSize")) : 2 ;
$( "#touchpadSize" ).val(touchpadSize) ;

let default_offset = localStorage.getItem("last_offset") !== null ? parseFloat(localStorage.getItem("last_offset")) : "0.0" ;
$( "#offset" ).val(default_offset) ;


if ( JSON.parse(localStorage.getItem("last_lpad")) !== null ) {
     leftKeyMap =JSON.parse(localStorage.getItem("last_lpad")) ;
}

if ( JSON.parse(localStorage.getItem("last_rpad")) !== null ) {
    rightKeyMap =JSON.parse(localStorage.getItem("last_rpad")) ;
}

function updateMappings() {
    $('#ldlmap').val(leftKeyMap['dl']) ;
    $('#lulmap').val(leftKeyMap['ul']) ;
    $('#lcmap').val(leftKeyMap['c']) ;
    $('#lurmap').val(leftKeyMap['ur']) ;
    $('#ldrmap').val(leftKeyMap['dr']) ;

    $('#rdlmap').val(rightKeyMap['dl']) ;
    $('#rulmap').val(rightKeyMap['ul']) ;
    $('#rcmap').val(rightKeyMap['c']) ;
    $('#rurmap').val(rightKeyMap['ur']) ;
    $('#rdrmap').val(rightKeyMap['dr']) ;
}

updateMappings() ;


function stageCleared(performance) {


    console.log(performance) ;

    document.getElementById('selector').style.display = 'block' ;
    document.getElementById('navbar').style.display = 'block' ;
    document.getElementById('container').style.display = 'none' ;

    document.removeEventListener( 'touchstart', onTouchDown, false );
    document.removeEventListener( 'touchend', onTouchUp, false );

    engine = null ;



}