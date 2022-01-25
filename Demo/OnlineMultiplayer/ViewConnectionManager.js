
let m ;
let s ;

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
        $('#generatedInviteCodeTextField').val(m.sdp) ;
        $('#createBattleModal').modal('show');
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

function addSlave(remoteSDP) {
    connectingButtonWorking() ;
    m.addSlave(remoteSDP, () => {
        resetConnectButton() ;
        $('#confirmationCodeTextField').addClass('is-invalid') ;
    },
        () => {
            $('#confirmationCodeTextField').removeClass('is-invalid') ;
        }) ;
}

async function connectSlave(remoteSDP) {



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
        $('#generatedConfirmationCodeTextField').val(s.sdp) ;
        resetInviteButton() ;
        $('#joinBattleModal').modal('show');

    }) ;

    await s.init() ;

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