$.ajaxSetup({
    async: false
});

let audioBuf = null
let chart_level = null
let speed = null
let songsJson = null
let stageIndex = null
let songIndex = null
let mp3path = null
let sscpath = null

let resources = 'https://piulin.gentakojima.me/'

function discoverCharts(pathToFolder) {

}


function discoverLevels( sscPath ) {
    let song = new Song( sscPath ) ;

    localStorage.setItem('song', JSON.stringify(song)); //stringify object and store

    let select = document.getElementById('level') ;

    for ( let i = 0 ; i < song.levels.length ; i++ ) {

        let level = song.levels[i] ;

        // console.log(level.meta.METER)

        let opt = document.createElement('option');
        opt.value = i ;
        opt.innerHTML = '' + level.meta.METER + ' - ' + level.meta.DESCRIPTION;

        select.appendChild(opt)

    }
}

$("#level").live('change', function() {
    localStorage.setItem("last_level", $(this).val());
    change_level($(this).val())
});

function change_level(l) {
    // alert('The option with value ' + $(this).val());
    chart_level = l ;
    let song = JSON.parse(localStorage.getItem('song')); //retrieve the object
    let level = song.levels[l] ;

    document.getElementById('st').innerHTML = level.meta.STEPSTYPE ;
    document.getElementById('t').innerHTML = song.meta.TITLE ;
    document.getElementById('a').innerHTML = song.meta.ARTIST ;
    document.getElementById('d').innerHTML = level.meta.DESCRIPTION ;
    document.getElementById('m').innerHTML = level.meta.METER ;
    document.getElementById('c').innerHTML = level.meta.CREDIT ;
    document.getElementById('b').innerHTML = JSON.stringify(level.meta.BPMS) ;


}


function clear(id) {
    var select = document.getElementById(id);
    var length = select.options.length;
    for (let i = length-1; i >= 0; i--) {
        select.options[i] = null;
    }
}

//
// if (window.FileList && window.File && window.FileReader) {
//     document.getElementById('ssc-file').addEventListener('change', event => {
//
//         clear('level')
//         // console.log(event)
//         const file = event.target.files[0];
//
//         const reader = new FileReader();
//         reader.addEventListener('load', event => {
//             // console.log(event.target.result)
//             localStorage.setItem('sscPath', event.target.result);
//             // localStorage.setItem('sscPath', 'http://193.196.53.175/else/16A0%20-%20Sr.%20Lan%20Belmont%20-%20Can-can%20~Orpheus%20in%20The%20Party%20Mix~.ssc');
//             discoverLevels(event.target.result)
//             // discoverLevels('http://193.196.53.175/else/16A0%20-%20Sr.%20Lan%20Belmont%20-%20Can-can%20~Orpheus%20in%20The%20Party%20Mix~.ssc')
//
//         });
//         reader.readAsDataURL(file);
//     });
//
//
//     document.getElementById('audio-file').addEventListener('change', event => {
//
//         const file = event.target.files[0];
//
//         const reader = new FileReader();
//         reader.addEventListener('load', event => {
//
//             audioBuf = event.target.result
//             console.log('Audio ready')
//             // console.log(event.target.result)
//
//         });
//         reader.readAsArrayBuffer(file);
//     });
// }

$( "#play" ).click(function() {

    engine = new Engine() ;
    // let sscPath =localStorage.getItem('sscPath');
    document.getElementById('selector').style.display = 'none' ;
    let speed = parseInt(document.getElementById('speed').value) ;
    let offset = parseFloat(document.getElementById('offset').value) ;
    let noteskin = document.getElementById('noteskin').value ;
    // console.log(speed)
    engine.start( resources + sscpath, resources + mp3path, chart_level, speed, offset, noteskin);


});

$( "#noteskin" ).live("change", function(){
  localStorage.setItem("last_noteskin", $(this).val());
});

$( "#speed" ).live("change", function(){
  localStorage.setItem("last_speed", $(this).val());
});

$( "#offset" ).live("change", function(){
  localStorage.setItem("last_offset", $(this).val());
});

function readSongList() {


    $.getJSON("songs.json", function(json) {

        let stages = json.children[0] ;

        songsJson = stages


        let select = document.getElementById('stage') ;

        for ( let i = 0 ; i < stages.children.length ; i++ ) {

                let stage = stages.children[i] ;

                // console.log(level.meta.METER)

                let opt = document.createElement('option');
                opt.value = i ;
                opt.innerHTML = stage.name;

                select.appendChild(opt)


        }

        /* Set default selection for dynamic values: Stage, Song and Level */

        let default_stage = localStorage.getItem("last_stage") !== null ? parseInt(localStorage.getItem("last_stage")) : 14 ;
        change_stage(default_stage) ;
        $( "#stage" ).val(default_stage) ;

        let default_song = localStorage.getItem("last_song") !== null ? parseInt(localStorage.getItem("last_song")) : 0 ;
        $( "#online-song" ).val(default_song) ;
        $( "#online-song" ).trigger("change") ;

        let default_level = localStorage.getItem("last_level") !== null ? parseInt(localStorage.getItem("last_level")) : 0 ;
        change_level(default_level) ;
        $( "#level" ).val(default_level) ;


    });
}

$("#stage").live('change', function() {

    localStorage.setItem("last_stage", $(this).val());
    change_stage($(this).val()) ;


});

function change_stage(i) {
    // alert('The option with value ' + $(this).val());

    clear('online-song') ;
    clear('level')
    stageIndex = i ;
    let stage = songsJson.children[i] ;

    console.log(stage)

    let select = document.getElementById('online-song') ;

    for ( let i = 0 ; i < stage.children.length ; i++ ) {

        let song = stage.children[i] ;

        // console.log(level.meta.METER)

        let opt = document.createElement('option');
        opt.value = i ;
        opt.innerHTML = song.name;

        select.appendChild(opt)


    }
}

$("#online-song").live('change', function() {
    // alert('The option with value ' + $(this).val());

    localStorage.setItem("last_song", $(this).val());

    clear('level')

    let i = $(this).val()
    songIndex = i
    let song = songsJson.children[stageIndex].children[i] ;

    console.log(song)

    let x=/^[^.]+\.(mp3|wav|ogg)$/i;
    let y=/^[^.]+\.ssc$/i;

    mp3path = null
    sscpath = null

    for ( let i = 0 ; i < song.children.length ; i++ ) {

        let attr = song.children[i] ;

        if (x.test(attr.name)) {
            mp3path = attr.path ;
        }

        if (y.test(attr.name)) {
            sscpath = attr.path ;
        }
    }


    discoverLevels( resources + sscpath ) ;
    change_level(0) ;




});

/* Load dynamic values and set thise defaults */

readSongList() ;

/* Set default selection for static values: Noteskin, Speed and Offset */

let default_noteskin = localStorage.getItem("last_noteskin") !== null ? localStorage.getItem("last_noteskin") : "EXCEED2-OLD" ;
$( "#noteskin" ).val(default_noteskin) ;

let default_speed = localStorage.getItem("last_speed") !== null ? parseInt(localStorage.getItem("last_speed")) : 4 ;
$( "#speed" ).val(default_speed) ;

let default_offset = localStorage.getItem("last_offset") !== null ? parseFloat(localStorage.getItem("last_offset")) : "0.0" ;
$( "#offset" ).val(default_offset) ;
