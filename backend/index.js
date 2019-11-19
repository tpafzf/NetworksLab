const express = require('express')
const app = express()
const cors = require('cors');
const port = 17477

const MongoClient = require('mongodb').MongoClient;
const bodyparser = require('body-parser');
var http = require('http').createServer(app);
const io = require('socket.io')(http);
var userConnected = false;
var currentUser = null;
// Connection URL
const url = 'mongodb://localhost:27017';
const collectionName = 'users'
const dbName = 'chat-client';

// 3rd party middleware
app.use(cors());
app.use(bodyparser.json());

//request made to mongo database to check for valid credentials and validates login
app.post('/signin', (req, res) => {
    MongoClient.connect(url, {useUnifiedTopology: true} ,function(err, client) {
        const db = client.db(dbName);

        db.collection(collectionName, (err, collection) => {
            collection.findOne({name: req.body.name, pass: req.body.pass}, (err, queryResult) => {
                if (!queryResult || userConnected ===true) {
                    res.status(300).send('no user').end();
                } else {
                    res.status(200).send('success').end();
                }
                client.close();
            });
        });
        
      });
});

//request made to mongo database to check for existence of user then add it to db
app.post('/signup', (req, res) => {
    MongoClient.connect(url, {useUnifiedTopology: true} ,function(err, client) {
        const db = client.db(dbName);

        db.collection(collectionName, (err, collection) => {
            collection.findOne({name: req.body.name}, (err, queryResult) => {
                if (!queryResult && userConnected === false) {
                    collection.insertOne({name: req.body.name, pass: req.body.pass});
                    res.status(200).send('ok').end();
                } else {
                    res.status(301).send('user already exists').end();
                }
                client.close();
            });
        });
        
      });
});

//manages all of the socket logic
io.on('connection', function(socket){
    //closes socket when a user logs in successfully, sets current user
    socket.on('connection',(user)=>{
        console.log(`${user} has connected to the socket, socket closed`);
        currentUser = user;
        userConnected = true;
    });
    //when backend recieves a message, broadcasts it to all other listeners
    socket.on('chat-message', function(msg){
      console.log(`${currentUser}: ${msg}`)
      socket.broadcast.emit('incoming-message',{'name': currentUser, 'msg': msg})
    });
    //opens up socket when user logs out
    socket.on('disconnection',(user)=>{
        console.log(`${user} has disconnected from the socket, socket open`);
        userConnected = false;
    }); 

    //opens up socket when user leaves the page
    socket.on('disconnect',(user)=>{
        console.log(`user disconnected,  socket open`);
        userConnected = false;
    }); 
  });

http.listen(port, function(){
    console.log(`listening on *:${port}`);
  });