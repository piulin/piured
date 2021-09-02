
let audioBuf = null
let chart_level = null
let speed = null

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


if (window.FileList && window.File && window.FileReader) {
    document.getElementById('ssc-file').addEventListener('change', event => {

        clear('level')
        // console.log(event)
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.addEventListener('load', event => {
            // console.log(event.target.result)
            localStorage.setItem('sscPath', event.target.result);
            discoverLevels(event.target.result)

        });
        reader.readAsDataURL(file);
    });


    document.getElementById('audio-file').addEventListener('change', event => {

        const file = event.target.files[0];

        const reader = new FileReader();
        reader.addEventListener('load', event => {

            audioBuf = event.target.result
            console.log('Audio ready')
            // console.log(event.target.result)

        });
        reader.readAsArrayBuffer(file);
    });
}

$( "#play" ).click(function() {

    engine = new Engine() ;
    let sscPath =localStorage.getItem('sscPath');
    document.getElementById('selector').style.display = 'none' ;
    let speed = parseInt(document.getElementById('speed').value) ;
    let offset = parseFloat(document.getElementById('offset').value) ;
    let noteskin = document.getElementById('noteskin').value ;
    console.log(speed)
    engine.start(  sscPath, audioBuf, chart_level, speed, offset, noteskin);


});
