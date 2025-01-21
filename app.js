import express from 'express';
import { _dirname } from './utils.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/view.router.js';
import { Server } from 'socket.io';

const app = express();
const httpServer = app.listen(8080, () => console.log("Listening: http://localhost:8080"));

// Configuração do Socket.io
const io = new Server(httpServer);

// Array para armazenar mensagens e usuários
let messages = [];
let users = [];

// Configuração do Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', _dirname + '/views');
app.set('view engine', 'handlebars');

// Configuração de arquivos estáticos
app.use(express.static(_dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/', viewsRouter);

// Rota para enviar mensagens (POST)
app.post('/send-message', (req, res) => {
    const { user, content } = req.body;
    const time = new Date().toLocaleTimeString();

    // Armazenando a mensagem
    const newMessage = { user, content, time, sent: true };
    messages.push(newMessage);

    // Emitir as mensagens para todos os clientes
    io.emit('messageLogs', messages);

    res.json(newMessage);
});

// Rota para carregar mensagens
app.get('/', (req, res) => {
    res.json({ messages });
});

// Socket.io eventos
io.on('connection', socket => {
    console.log('Novo cliente conectado');

    // Enviar histórico de mensagens para o novo usuário
    socket.emit('messageLogs', messages);

    // Evento para autenticar um novo usuário
    socket.on('authenticatedUser', username => {
        // Adiciona o usuário à lista de usuários ativos
        users.push({ id: socket.id, username });

        // Notificar outros usuários sobre a chegada do novo usuário
        socket.broadcast.emit('newUserConnected', username);
        
        // Enviar a lista de usuários conectados para o cliente
        io.emit('usersList', users);
    });

    // Receber mensagem de um usuário
    socket.on('message', data => {
        messages.push(data);
        // Reenviar mensagens para todos os clientes
        io.emit('messageLogs', messages);
    });

    // Evento de desconexão de um usuário
    socket.on('disconnect', () => {
        // Remover o usuário da lista ao desconectar
        users = users.filter(user => user.id !== socket.id);

        // Notificar outros usuários sobre a desconexão
        socket.broadcast.emit('userDisconnected', socket.id);

        // Atualizar a lista de usuários conectados
        io.emit('usersList', users);
    });
});
