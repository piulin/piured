function sendMessage() {
    let message = $('#messageInput').val()
    if (message === '') {
        return;
    }
    $('#messageInput').val('')
    let card = createMessageCard(message, 'you')
    mdiv = document.getElementById('messages')
    mdiv.append(card)
    mdiv.scrollTop = mdiv.scrollHeight
    mm.sendMessage(message)
    // console.log(message)
}

$('#messageInput').keydown(function (e) {
    if (e.keyCode == 13) {
        sendMessage()
    }
})

function receiveMessage(message) {
    let card = createMessageCard(message, 'pumper')
    mdiv = document.getElementById('messages')
    mdiv.append(card)
    mdiv.scrollTop = mdiv.scrollHeight
}



function createMessageCard(message, author) {
    let card = document.createElement('div');
    // a.setAttribute('data-idx', idx) ;
    // a.setAttribute('data-bs-toggle', "list") ;
    card.className = "card border-0" ;

    let cardBody = document.createElement('div')
    cardBody.className = "card-body";

    let title = document.createElement('h6')
    if (author === 'you') {
        title.className = "card-subtitle mb-2 text-primary"
        title.innerHTML = "You: "
    } else {
        title.className = "card-subtitle mb-2 text-muted"
        title.innerHTML = "Pumper: "
    }
    let messagep = document.createElement('p')
    messagep.className = "card-text";
    messagep.innerHTML = message

    card.append(cardBody)
    cardBody.append(title)
    cardBody.append(messagep)

    return card ;
}
