const PORT = process.env.PORT || 5000;
const express = require('express');
const path = require('path');
const feeder = require('@huluvu424242/liona-feeds');

express()
    .use(express.static(path.join(__dirname, '../public')))
    .use('/@huluvu424242/honey-news', express.static(path.join(__dirname, '../node_modules/@huluvu424242/honey-news/dist/')))
    // .set('views', path.join(__dirname, '../views'))
    // .set('view engine', 'ejs')
    // .get('/', (req, res) => res.render('pages/index'))
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
