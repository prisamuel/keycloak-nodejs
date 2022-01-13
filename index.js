var session = require('express-session');
var Keycloak = require('keycloak-connect');

var memoryStore = new session.MemoryStore();

let kcConfig = {
  clientId: 'nodejs-microservice',
  bearerOnly: true,
  serverUrl: 'http://localhost:8080/auth',
  realm: 'myrealm',
  credentials: {
      secret: 'QUSk7l1LVJD5LDvd9xwDYOVzn0DM3IHm'
  }
};

var express = require('express');
var app = express();

app.use(session({
  secret: 'some secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

let keycloak = new Keycloak({ store: memoryStore }, kcConfig)
app.use(keycloak.middleware());

app.get('/anonymous', function(req, res){
  res.send("Hello Anonymous");
});
app.get('/user', keycloak.protect('user'), function(req, res){
  res.send("Hello User");
});

app.get('/admin', keycloak.protect('admin'), function(req, res){
  res.send("Hello Admin");
});

app.get('/all-user', keycloak.protect(['user', 'admin']),function(req, res){
  res.send("Hello All User");
});

app.get('/', function(req, res){
   res.send("Server is up!");
});

app.listen(3000);