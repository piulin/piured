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

let m ;
let s ;

// let URLbattleServer = 'http://localhost:8001'
let URLbattleServer = 'https://piulin.gentakojima.me:8001'
async function connectMaster() {

    createBattleButtonWorking() ;

    m = new Master() ;

    m.onOpen(() => {
        console.log('opened') ;
        $('#createBattleModal').modal('hide');
        readFileContent('online-multiplayer-master.html', function (content) {
            $('body').html(content) ;
        }) ;
    }) ;

    m.onIceCompleted(()=>{
        resetCreateBattleButton() ;
        $.ajax({
            method: 'POST',
            url: URLbattleServer + '/setSDP',
            data: {'sdp': m.sdp},
            dataType: 'json',
            crossDomain: true,
            async: false,
            success: (res) => {
                const {id} = res ;
                $('#generatedInviteCodeTextField').val(id) ;
                $('#createBattleModal').modal('show');
            }
        });

    }) ;

    await m.init() ;

}

function resetCreateBattleButton() {
    $('#confirmationCodeTextField').val("");
    $('#masterSpinner').hide();
    $('#masterButton').prop('disabled', false);
    $('#masterButtonLabel').text('Create Battle');
}

function createBattleButtonWorking() {
    $('#masterSpinner').show();
    $('#masterButton').prop('disabled', true);
    $('#masterButtonLabel').text('Generating invite code...');
}

function connectingButtonWorking() {
    $('#connectSlaveSpinner').show();
    $('#connectSlaveButton').prop('disabled', true);
    $('#connectSlaveButtonLabel').text('Connecting...');
}

function resetConnectButton() {
    $('#connectSlaveSpinner').hide();
    $('#connectSlaveButton').prop('disabled', false);
    $('#connectSlaveButtonLabel').text('Connect');
}

function addSlave(remoteId) {
    connectingButtonWorking() ;
    $.ajax({
        method: 'POST',
        url: URLbattleServer + '/getSDP',
        data: {'id': remoteId },
        dataType: 'json',
        crossDomain: true,
        async: false,
        success: function (res) {
            let remoteSDP = res.sdp ;
            m.addSlave(remoteSDP, () => {
                    resetConnectButton() ;
                    $('#confirmationCodeTextField').addClass('is-invalid') ;
                },
                () => {
                    $('#confirmationCodeTextField').removeClass('is-invalid') ;
                }) ;
        }
    });


}

function connectSlave(remoteId) {
    $.ajax({
        method: 'POST',
        url: URLbattleServer + '/getSDP',
        data: {'id': remoteId },
        dataType: 'json',
        crossDomain: true,
        async: false,
        success: async function (res) {
            let remoteSDP = res.sdp ;
            inviteButtonWorking() ;

            s = new Slave(remoteSDP, () => {
                resetInviteButton() ;
                $('#inviteCodeTextField').addClass('is-invalid') ;
            }) ;


            s.onOpen(() => {
                console.log('opened!');
                $('#joinBattleModal').modal('hide');
                readFileContent('online-multiplayer-slave.html', function (content) {
                    $('body').html(content) ;
                }) ;
            }) ;

            s.onIceCompleted(() => {
                $('#inviteCodeTextField').removeClass('is-invalid') ;

                $.ajax({
                    method: 'POST',
                    url: URLbattleServer + '/setSDP',
                    data: {'sdp': s.sdp},
                    dataType: 'json',
                    crossDomain: true,
                    async: false,
                    success: (res) => {
                        const {id} = res ;
                        $('#generatedConfirmationCodeTextField').val(id) ;
                        resetInviteButton() ;
                        $('#joinBattleModal').modal('show');
                    }
                });

            }) ;

            await s.init() ;
        }
    });


}

function inviteButtonWorking() {
    $('#slaveSpinner').show();
    $('#slaveButton').prop('disabled', true);
    $('#slaveButtonLabel').text('Generating confirmation code...');
}

function resetInviteButton() {
    $('#inviteCodeTextField').val("") ;
    $('#slaveSpinner').hide();
    $('#slaveButton').prop('disabled', false);
    $('#slaveButtonLabel').text('Accept Invite');
}