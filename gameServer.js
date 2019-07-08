
let settings = require("./static/js/settings.json")
let WebSocket = require('ws')
let Worker = require("tiny-worker");





function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


class GameServer{
    constructor(){
        this.state = {};
        this.server = new WebSocket.Server({ port: 8001 });
        this.sockets = []
    }

    start(){
        let context = this;
        this.server.on('connection', function(webSocket){
            // console.log(context)
            // var x = 2
            // var worker = new Worker(function(){
            //     console.log(this);
            //     console.log('created worker thread')
            //     // console.log(webSocket)
            //     while(true){

            //     }
            //     // console.log(x)
            //     // console.log(context);
            //     // co
            //     // context.handlePlayer(webSocket);
            // });

            context.handlePlayer(webSocket);
            // let playerId = guidGenerator();
            // context.state[playerId] = {
            //     "x" : 100,
            //     "y" : 100
            // }
            // context.sockets.push(webSocket);
            // webSocket.send(JSON.stringify({
            //     "init" : playerId,
            //     "state" : context.state
            // }));
            // context.broadCast(JSON.stringify(context.state));
            // webSocket.on('message', message => {
            //     context.handleMessage(message);
            // })

            // webSocket.on("close", event => {

            // })
        })
    }

    broadCast(message){
        for (let i in this.sockets){
            let socket = this.sockets[i];
            socket.send(message);
        }
    }
    
    handleMessage(message){
        let jsonMessage = JSON.parse(message);
        if ("closing" in jsonMessage){
            let playerId = jsonMessage["closing"];
            delete this.state[playerId];
            this.broadCast(JSON.stringify(this.state));
        }
        else{
            this.broadCast(message)
        }

    }

    handlePlayer(webSocket){
        let playerId = guidGenerator();
        let context = this;
        this.state[playerId] = {
            "x" : 100,
            "y" : 100
        }
        this.sockets.push(webSocket);
        webSocket.send(JSON.stringify({
            "init" : playerId,
            "state" : context.state
        }));
        this.broadCast(JSON.stringify(this.state));
        webSocket.on('message', message => {
            context.handleMessage(message);
        })

        webSocket.on("close", event => {

        })
    }
}


module.exports = GameServer;