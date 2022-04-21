const PORT = process.env.PORT || 5000;
const express = require('express');
const path = require('path');
const feeder = require('@huluvu424242/liona-feeds');


const staticServer = express()
    .use("/", express.static(path.join(__dirname, '../public')))
    .use('/@huluvu424242/honey-news/', express.static(path.join(__dirname, '../node_modules/@huluvu424242/honey-news/dist/')))
    .use(feeder.addCORSHeader)
    .get('/feed/', (req, res) => {
        const uuid = req.query.uuid;
        if (uuid) {
            res.send(feeder.getFeedDataFor(uuid, req.query.url, req.query.period, req.query.statistic));
        } else {
            res.send(feeder.getFeedData(req.query.url, req.query.statistic));
        }
    })
    .get('/feeds/', (req, res) => {
        feeder.getRankedFeeds().subscribe(
            (values) => res.send(values)
        );
    })
    .get('/feed/:feedurl', (req, res) => {
        res.send(feeder.getFeedData(req.params.feedurl, req.query.statistic));
    })
    // .delete('feed/', (req, res) => {
    //     res.send(feeder.unsubscribeFeedFor(req.query.uuid, req.query.url));
    // })
    .use((req, res, next) => {
        res.sendFile(path.join(__dirname, '../public') + "/404.html");
    })

    .listen(PORT, () => console.log(`Listening on ${PORT}`));


//
//  Die Beispiele sind zu alt und arbeiten nicht mehr zusammen :( leveldb is too old
//
//  leveldb example: https://www.joocom.de/blog/posts/leveldb-in-nodejs-eine-einfuehrung/
//  Heroku: https://devcenter.heroku.com/articles/node-websockets
//



// Datenbank leveldb mit client replicas via websocket

// const {Level} = require('level')
// const sublevel = require('level-sublevel/legacy')
const Replicate = require('level-replicate')


var {Level} = require('level')

var db = new Level('/db/leveldb-ring')


// Datenbank initialisieren.
// const db = sublevel(new Level('db/leveldb-ring'));

// Replication hinzufügen
const master = Replicate(db, 'master', "MASTER-1", null);

// Replication zwischen verbundenen Clients aufsetzen.
const http = require('http');
const server = http.createServer();

const wss = require('websocket-stream').createServer({server}, (stream) => {
    stream.pipe(master.createStream({tail: true})).pipe(stream);
})

server.listen(9999);





//
// const WebSocket = require('ws');
//
// const wss = new WebSocket.Server({server});
// wss.on('connection', (ws) => {
//     console.log('Client connected');
//     // ws.stream.pipe(master.createStream({tail: true})).pipe(stream);
//     ws.on('close', () => console.log('Client disconnected'));
// });
//
// const stream = WebSocket.createWebSocketStream(wss, {encoding: 'utf8'});
//
// stream.pipe(master.createStream({tail: true})).pipe(stream);
// // process.stdin.pipe(duplex);
//
//
// //
// // const wss = require('websocket-stream').createServer({server}, (stream) => {
// //     stream.pipe(master.createStream({tail: true})).pipe(stream);
// // })
