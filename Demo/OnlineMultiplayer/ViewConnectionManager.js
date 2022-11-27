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
let serverId = undefined;
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
let intervalId;
let alive = true;
function findMate() {
    $('#findMateStatus').text('Finding players...')
    $('#findMateModal').modal('show');
    $.ajax({
        method: 'POST',
        url: URLbattleServer + '/register',
        data: {},
        dataType: 'json',
        crossDomain: true,
        async: false,
        success: (res) => {
            const {id} = res ;
            (function postAlive() {
                $.ajax({
                    method: 'POST',
                    url: URLbattleServer + '/alive',
                    data: {'id': id},
                    dataType: 'json',
                    crossDomain: true,
                    async: true,
                    // success: (res) => {console.log('y')}
                });
                if( alive === true) {
                    setTimeout(postAlive, 2500)
                }
            })()
            poll(id)
        }
    });
}

function poll(id) {
    $('#findMateStatus').text('Finding players...')
    $.ajax({
        method: 'POST',
        url: URLbattleServer + '/poll',
        data: {'id': id},
        dataType: 'json',
        crossDomain: true,
        async: false,
        success: async (res) => {
            const {paired, assignedType} = res;
            if (paired === true) {
                if (assignedType === 'master') {
                    await postMasterSDP(id)
                } else {
                    getMasterSDPAndPostSlaveSDP(id)
                }
            } else {
                delay().then(() => poll(id))
            }

        }
    });
}

async function postMasterSDP(id) {

    $('#findMateStatus').text('Found a player! Gathering connection details...')
    m = new Master() ;

    m.onOpen(() => {
        clearInterval(intervalId)
        serverId = id;
        console.log('opened') ;
        $('#findMateModal').modal('hide');
        readFileContent('online-multiplayer-master.html', function (content) {
            $('body').html(content) ;
        }) ;
    }) ;

    m.onIceCompleted(()=>{
        $.ajax({
            method: 'POST',
            url: URLbattleServer + '/postMasterSDP',
            data: {'id': id, 'sdp': m.sdp},
            dataType: 'json',
            crossDomain: true,
            async: false,
            success: (res) => {
                getSlaveSDP(id)
            }
        });

    }) ;

    await m.init() ;
}

function getSlaveSDP(id) {

    $('#findMateStatus').text('Gathering your partner\'s details...')
    $.ajax({
        method: 'POST',
        url: URLbattleServer + '/getSlaveSDP',
        data: {'id': id},
        dataType: 'json',
        crossDomain: true,
        async: false,
        success: (res) => {
            const {slaveSDP, action} = res
            if (slaveSDP === '') {
                if (action === 'poll') {
                    poll(id)
                } else {
                    delay().then(() => getSlaveSDP(id))
                }
            } else {

                m.addSlave(slaveSDP, () => {
                    console.log('could not connect to slave. Sdp failed')
                    },
                    () => {
                    console.log('slave sdp ok.')
                    }) ;
            }
        }

    });
}
function delay(time = 2000) {
    return new Promise(resolve => setTimeout(resolve, time));
}


function getMasterSDPAndPostSlaveSDP(id) {
    $('#findMateStatus').text('Player found! Gathering partner\'s details...')
    $.ajax({
        method: 'POST',
        url: URLbattleServer + '/getMasterSDP',
        data: {'id': id },
        dataType: 'json',
        crossDomain: true,
        async: false,
        success: async (res) => {
            const {masterSDP, action} = res
            if (masterSDP === '') {
                if (action === 'poll') {
                    poll(id)
                } else {
                    delay().then(() => getMasterSDPAndPostSlaveSDP(id))
                }
            } else {
                postSlaveSDP(id, masterSDP)
            }
        }
    });
}

async function postSlaveSDP(id, masterSDP) {
    $('#findMateStatus').text('Gathering your connection details...')
    s = new Slave(masterSDP, () => {
        console.log('masterSDP is wrong')
    });

    s.onOpen(() => {
        console.log(`intervalId ${intervalId}`)
        serverId = id;
        clearInterval(intervalId)
        $('#findMateModal').modal('hide');
        readFileContent('online-multiplayer-slave.html', function (content) {
            $('body').html(content);
        });
    });

    s.onIceCompleted(() => {
        $.ajax({
            method: 'POST',
            url: URLbattleServer + '/postSlaveSDP',
            data: {'id': id, 'sdp': s.sdp},
            dataType: 'json',
            crossDomain: true,
            async: false,
            success: (res) => {
                $('#findMateStatus').text('Waiting for connection to establish...')
                console.log('slave is waiting for connection')
            }
        });

    });

    await s.init();
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

$.ajax({
    method: 'POST',
    url: URLbattleServer + '/noPlayersWaiting',
    data: {},
    dataType: 'json',
    crossDomain: true,
    async: false,
    success: (res) => {
        const {count} = res
        $('#noPlayersWaiting').text(count)
    }
});
$.ajax({
    method: 'POST',
    url: URLbattleServer + '/noBattles',
    data: {},
    dataType: 'json',
    crossDomain: true,
    async: false,
    success: (res) => {
        const {count} = res
        $('#noOnlineMatches').text(count)
    }
});
