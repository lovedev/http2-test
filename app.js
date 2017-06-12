'use strict';

const fs = require('fs');
const express = require('express');
const http = require('http');
const http2 = require('http2');
const app = express();
const http2express = require('express-http2-workaround');
//인증서옵션
const certOptions = {
    'key': fs.readFileSync(__dirname + '/cert/server.key'),
    'cert': fs.readFileSync(__dirname + '/cert/server.crt'),
    'ca': fs.readFileSync(__dirname + '/cert/server.crt')
};

const PUBLIC_DIR = `${__dirname}/public`;

// express에서 http2 사용가능하도록 추가
http2express({express: express, http2: http2, app: app});

// Http/1.1
let httpServer = http.Server(app);
httpServer.listen(10080,  (err) => {
    if(!!err){
        throw new Error('HTTP/1 Server Error');
    }
    console.log("HTTP/1.1 server started");
});

// Http/2.0
let http2Server = http2.createServer(certOptions, app);
http2Server.listen(10443, (err) => {
    if(!!err){
        throw new Error('HTTP/2 Server Error');
    }
    console.log("HTTP/2 server started");
});

//정적파일 처리
app.use('/static', express.static(PUBLIC_DIR));

// Http version check
app.get('/version', (req, res) => {
    res.send(`HTTP Version : ${req.httpVersion}`);
});

//sudo npm install -g npm@next
//process.setMaxListeners(0);