import express from "express";
import {dirname} from "./utils.js"
import handlebars from "express-handlebars"
import viewsRouter from "./routes/view.router.js"
import { Server} from "socket.io";

const app=express();
const httpServer = app.listen(8080, ()=>console.log("Porta 8080 ok"))

const io = new Server(httpServer);
app.engine('handlebars',handlebars.engine());
app.set('views',dirname+"/views");
app.set('view engine ',"handlebars");

app.use(express.static(dirname+ "./public"));
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/", viewsRouter);
io.on('connection',(socket)=>{
    console.log("Novo cliente conectado");
    socket.on('message',(data) =>{
        io.emit("messageLogs", data);
    });
    socket.on("Disconectado",() =>{
        console.log("Cliente desconectado")
    });
})
