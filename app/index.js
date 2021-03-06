const cool = require('cool-ascii-faces');
const feeder = require('@huluvu424242/liona-feeds');
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

express()
    .use(express.static(path.join(__dirname, '../public')))
    .use('/@huluvu424242', express.static(path.join(__dirname, '../node_modules/@huluvu424242/honey-webcomponents/dist')))
    .set('views', path.join(__dirname, '../views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .get('/cool', (req, res) => res.send(cool()))
    .get('/times', (req, res) => res.send(showTimes()))
    .get('/feed/:feedurl', (req, res) => res.send(feeder.getFeedData(req.params.feedurl)))
    .get('/feed/', (req, res) => {
        res.send(feeder.getFeedData(req.query.url, req.query.period, req.query.nostatistic));
    })

    .listen(PORT, () => console.log(`Listening on ${PORT}`));


showTimes = () => {
    let result = '';
    const times = process.env.TIMES || 5;
    for (i = 0; i < times; i++) {
        result += i + ' ';
    }
    return result;
}
