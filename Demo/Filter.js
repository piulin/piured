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

function filter() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("online-song");
    li = ul.getElementsByClassName("title");
    for (i = 0; i < li.length; i++) {
        txtValue = li[i].innerHTML
        // txtValue = a.innerHTML ;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].parentElement.parentElement.style.display = "";
        } else {
            li[i].parentElement.parentElement.style.display = "none";
        }
    }
}