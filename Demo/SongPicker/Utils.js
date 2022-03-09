/*
 * # Copyright (C) Pedro G. Bascoy
 # This file is part of piured <https://github.com/piulin/piured>.
 #
 # piured is free software: you can redistribute it and/or modify
 # it under the terms of the GNU General Public License as published by
 # the Free Software Foundation, either version 3 of the License, or
 # (at your option) any later version.
 #
 # piured is distributed in the hope that it will be useful,
 # but WITHOUT ANY WARRANTY; without even the implied warranty of
 # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 # GNU General Public License for more details.
 #
 # You should have received a copy of the GNU General Public License
 # along with piured. If not, see <http://www.gnu.org/licenses/>.
 *
 */

let resources = 'https://piulin.gentakojima.me/'
// let resources = './'



function clear(id) {
    var gl = document.getElementById(id);
    gl.innerHTML = '' ;
}

function change_level(l) {
    // alert('The option with value ' + $(this).val());

    localStorage.setItem('last_level', l)
    chart_level = l ;
    let song = selsong ;
    let level = song.levels[l] ;

    document.getElementById('st').innerHTML = level.STEPSTYPE ;
    document.getElementById('t').innerHTML = song.meta.TITLE ;
    document.getElementById('a').innerHTML = song.meta.ARTIST ;
    document.getElementById('d').innerHTML = level.DESCRIPTION ;
    document.getElementById('m').innerHTML = level.METER ;
    document.getElementById('c').innerHTML = level.CREDIT ;
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

    if ( song.getWARPS(l).length > 0  ) {
        document.getElementById('warps').innerHTML = 'YES' ;
    } else {
        document.getElementById('warps').innerHTML = 'NO' ;
    }

    if ( song.getSpeeds(l).length > 1  ) {
        document.getElementById('speeds').innerHTML = 'YES' ;
    } else {
        document.getElementById('speeds').innerHTML = 'NO' ;
    }


    if ( level.STEPSTYPE === 'pump-single' || level.STEPSTYPE === 'pump-double' || level.STEPSTYPE === 'pump-halfdouble') {
        document.getElementById('playable-false').style.display = 'none' ;
        document.getElementById('playable-true').style.display = '' ;
        document.getElementById('playable-unknown').style.display = 'none' ;

        if ( level.SPECIALNOTES.size !== 0 ) {
            document.getElementById('playable-false').style.display = 'none';
            document.getElementById('playable-true').style.display = 'none';
            document.getElementById('playable-unknown').style.display = '';
        }

    } else {
        document.getElementById('playable-false').style.display = '' ;
        document.getElementById('playable-true').style.display = 'none' ;
        document.getElementById('playable-unknown').style.display = 'none' ;

    }

    if ( level.SPECIALNOTES.size !== 0 ) {
        document.getElementById('trickNotes').innerHTML = [...level.SPECIALNOTES].join(', ');
    } else {
        document.getElementById('trickNotes').innerHTML = 'NO' ;
    }






}




function changeOnlineSong(i){

    localStorage.setItem("last_song", i);

    clear('level')
    songIndex = i
    let song = songsJson.children[stageIndex].children[i] ;


    let x=/^.+\.(mp3|wav|ogg|MP3|WAV|OGG)/i;
    let y=/^.+\.(ssc|SSC)/i;

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
    change_level(0) ;
}

function change_stage(i) {
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


    $.getJSON(resources+"songs.json", function(json) {

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
