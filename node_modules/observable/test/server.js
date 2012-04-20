var connect = require("connect"),
    http = require("http"),
    observable = require("observable")

var app = connect(),
    server = http.createServer(app),
    observable = observable(server)

app.use(connect.static(__dirname))

server.listen(3000)
console.log('listening to port 3000')