const socket = io();
let user;
const chatBox = document.getElementById('chatBox');

// Sweetalert para autenticação
Swal.fire({
    title: 'Identificação',
    input: 'text',
    text: 'Digite o nome de usuário para se identificar no chat',
    inputValidator: (value) => {
        return !value && 'Você precisa digitar um nome de usuário para continuar!'
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value;
    socket.emit('authenticatedUser', user);
});

// Ouvir por novos usuários conectados
socket.on('newUserConnected', username => {
    Swal.fire({
        text: `${username} se conectou ao chat`,
        toast: true,
        position: 'top-right'
    });
});

// Enviar mensagem
chatBox.addEventListener('keyup', evt => {
    if (evt.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
            socket.emit('message', {
                user: user,
                message: chatBox.value
            });
            chatBox.value = "";
        }
    }
});

// Receber mensagens
socket.on('messageLogs', data => {
    const log = document.getElementById('messageLogs');
    let messages = "";
    data.forEach(message => {
        messages = messages + `${message.user} diz: ${message.message}<br/>`
    });
    log.innerHTML = messages;
});