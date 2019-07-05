
let settings = require("./static/js/settings.json")
let WebSocket = require('ws')




// const wss = new WebSocket.Server({ port: 80 })
// wss.on('connection', ws => {
//   ws.on('message', message => {
//     console.log(`Received message => ${message}`)
//   })
//   ws.send('ho!')
// })
function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


class GameServer{
    constructor(){
        this.state = {};
        this.server = new WebSocket.Server({ port: 80 });
        this.sockets = []
    }

    start(){
        let context = this;
        this.server.on('connection', webSocket => {
            let playerId = guidGenerator();
            context.state[playerId] = {
                "x" : 100,
                "y" : 100
            }
            // console.log('new connection')
            console.log(context.state)
            context.sockets.push(webSocket);
            webSocket.send(JSON.stringify({
                "init" : playerId,
            }));
            context.broadCast();
            webSocket.on('message', message => {
                context.handleMessage(message);
            })
        })

    }

    broadCast(){
        for (let i in this.sockets){
            console.log('sent message thru socket')
            let socket = this.sockets[i];
            this.sendState(socket);
        }
    }
    
    handleMessage(message){
        // console.log('parse message');
    }
    sendState(webSocket){
        webSocket.send(JSON.stringify(this.state));
    }
}


module.exports = GameServer;