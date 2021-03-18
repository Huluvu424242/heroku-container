const PORT = process.env.PORT || 5000;
const express = require('express');
const path = require('path');
const feeder = require('@huluvu424242/liona-feeds');

const server = express()
    .use(express.static(path.join(__dirname, '../public')))
    .use('/@huluvu424242/honey-news', express.static(path.join(__dirname, '../node_modules/@huluvu424242/honey-news/dist/')))
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

    .listen(PORT, () => console.log(`Listening on ${PORT}`));

// Datenbank leveldb mit client replicas via websocket

const level = require('level')
const SubLevel = require('level-sublevel')
const Replicate = require('level-replicate')

// Datenbank initialisieren.
const db = SubLevel(level('ring-db'));

// Replication hinzufügen
const master = Replicate(db, 'master', "MASTER-1");

// Replication zwischen verbundenen Clients aufsetzen.

const  WebSocket  = require('ws');

const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
    console.log('Client connected');
    // ws.stream.pipe(master.createStream({tail: true})).pipe(stream);
    ws.on('close', () => console.log('Client disconnected'));
});

const stream = WebSocket.createWebSocketStream(wss, { encoding: 'utf8' });

stream.pipe(master.createStream({tail: true})).pipe(stream);
// process.stdin.pipe(duplex);


//
// const wss = require('websocket-stream').createServer({server}, (stream) => {
//     stream.pipe(master.createStream({tail: true})).pipe(stream);
// })
