
  
//Creating a new express application

const express =require('express');

//Calls the express function "express()" and puts new Express application inside the app variable 
const app = express();

// Create HTTP module
const server = require('http').Server(app);



//Establish connection to server using web sockets
const io = require("socket.io")(server);





//PeerJS server combined with Express Server
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

//to import the package and create unique id
const {v4: uuidv4}= require('uuid');

//peerjs is the path that the peerServer will be connected to.
app.use('/peerjs', peerServer);

//Setup view engine
app.set('view engine','ejs');

//Serving static files in express
app.use(express.static('public'));

app.use(require('cors')())


app.get("/", (req, res) => {
  res.render("home");
});

//Respnse and redirect to uuid
app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
});


// Get the path of the room and renders it to the client
app.get('/:room', (req, res) => {
    res.render('room', { roomLink: req.params.room })
});



//Coonects socket
io.on('connection', socket => {
  //Join room and emits user is connected
  socket.on('join-room', (roomLink, userLink) => {
    socket.join(roomLink)
    socket.broadcast.to(roomLink).emit('user-connected', userLink);
    // messages
    socket.on('message', (message) => {
      //send message to the same room
      io.to(roomLink).emit('createMessage', message)
  }); 
    //Disconnects the user
    socket.on('disconnect', () => {
      socket.broadcast.to(roomLink).emit('user-disconnected', userLink)
    });
  });
  
});



//Now listen to your ip and port.
server.listen(process.env.PORT || 3000);



