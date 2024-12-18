import express from 'express';
import { _dirname } from './utils.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/view.router.js';
import { Server } from 'socket.io';

const app = express();
const httpServer = app.listen(8080, () => console.log("Listening on PORT 8080"));

// Configuração do Socket.io
const io = new Server(httpServer);

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

// Socket.io eventos
io.on('connection', (socket) => {
    console.log('Novo cliente conectado');
    
    socket.on('message', (data) => {
        io.emit('messageLogs', data);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});