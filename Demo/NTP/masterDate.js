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

function masterDate(mm, onDate) {

    var clientTimestamp = new Date() ;
    mm.onReceiveDateDetails = (masterClientRequestDiffTime, masterTimeStamp) => {
        console.log('masterClientRequestDiffTime: ' +masterClientRequestDiffTime + ", masterTimeStamp: " + masterTimeStamp) ;
        var nowTimeStamp = new Date() ;
        var serverClientRequestDiffTime = masterClientRequestDiffTime;
        var serverTimestamp = masterTimeStamp;
        var serverClientResponseDiffTime = nowTimeStamp - serverTimestamp;
        console.log('serverClientResponseDiffTime: ' + serverClientResponseDiffTime) ;
        var responseTime = (serverClientRequestDiffTime - nowTimeStamp.valueOf() + clientTimestamp.valueOf() - serverClientResponseDiffTime )/2 ;
        console.log('responseTime: ' + responseTime) ;
        var syncedServerTime = new Date(new Date() + (serverClientResponseDiffTime - responseTime));
        console.log('syncedServerTime: '+ syncedServerTime) ;
        onDate(syncedServerTime) ;
    } ;
    mm.requestDate(clientTimestamp) ;

}

