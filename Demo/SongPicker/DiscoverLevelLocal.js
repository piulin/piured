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
function discoverLevels( sscPath ) {
    let song = new Song( sscPath ) ;

    selsong =  song ;

    let gl = document.getElementById('level') ;

    for ( let i = 0 ; i < song.levels.length ; i++ ) {

        let level = song.levels[i] ;


        let a = createListGroupLinkSubtitle(i, level.METER + " - " + level.DESCRIPTION, level.STEPSTYPE, level.CREDIT, function () {
            change_level(i) ;
        }) ;

        gl.append(a) ;

    }
}