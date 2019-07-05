let settings = require("./static/js/settings.json")
let gameServer = require('./gameServer.js');
let express = require('express');
let exphbs  = require('express-handlebars');
let app = express();
app.use('/static', express.static('static'))
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Render main view
app.get('/', function (req, res) {
    res.render('main.hbs');
});


// Get game state
app.get('/state', function(req, res){
    console.log('get the current game state')
})

// Post data about game state
app.post('/update', function(req, res){
    console.log('update the state')
})


// Start web server
app.listen(settings.SERVER_PORT);

// Create game server
let server = new gameServer();

// Start game server
server.start()

// var server = net.createServer(function(socket) {
//     console.log('connected');
//     socket.on('data', function (data) {
//         console.log(data.toString());
//     });
//     // socket.write("Hello world")
//     // socket.pipe(socket);
//     // console.log('wrote correctly')

// });

// // Start game server
// server.listen(settings.SOCKET_PORT, settings.SERVER_ADDRESS);


