const socket = io();
const chatBox = document.getElementById('chatBox');
const messageLogs = document.getElementById('messageLogs');

chatBox.addEventListener('keyup', (evt) => {
    if (evt.key === "Enter") {
        sendMessage();
    }
});

function sendMessage() {
    if (chatBox.value.trim().length > 0) {
        socket.emit('message', {
            user: 'Usuário',
            message: chatBox.value
        });
        chatBox.value = '';
    }
}

socket.on('messageLogs', data => {
    let messages = `<div class="message">
        <strong>${data.user}</strong>: ${data.message}
    </div>`;
    messageLogs.innerHTML += messages;
});