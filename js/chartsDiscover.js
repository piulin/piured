
let audioBuf = null
let chart_level = null
let speed = null
let songsJson = null
let stageIndex = null
let songIndex = null
let mp3path = null
let sscpath = null

let resources = 'http://193.196.53.175/'

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
    // alert('The option with value ' + $(this).val());
    chart_level = $(this).val()
    let song = JSON.parse(localStorage.getItem('song')); //retrieve the object
    let level = song.levels[$(this).val()] ;

    document.getElementById('st').innerHTML = level.meta.STEPSTYPE ;
    document.getElementById('t').innerHTML = song.meta.TITLE ;
    document.getElementById('a').innerHTML = song.meta.ARTIST ;
    document.getElementById('d').innerHTML = level.meta.DESCRIPTION ;
    document.getElementById('m').innerHTML = level.meta.METER ;
    document.getElementById('c').innerHTML = level.meta.CREDIT ;
    document.getElementById('b').innerHTML = JSON.stringify(level.meta.BPMS) ;


});


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


    });
}

$("#stage").live('change', function() {
    // alert('The option with value ' + $(this).val());

    clear('online-song') ;
    let i = $(this).val()
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


});

$("#online-song").live('change', function() {
    // alert('The option with value ' + $(this).val());

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


    discoverLevels( resources + sscpath )




});


readSongList() ;