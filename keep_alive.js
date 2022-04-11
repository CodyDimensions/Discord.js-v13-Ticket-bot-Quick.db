var http = require('http');

http.createServer(function (req, res) {
  res.write("Cody Dimensions is alive.");
  res.end();
}).listen(8080);