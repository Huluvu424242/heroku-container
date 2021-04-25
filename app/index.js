const PORT = process.env.PORT || 5000;
const express = require('express');
const path = require('path');
const feeder = require('@huluvu424242/liona-feeds');

express()
    .use(express.static(path.join(__dirname, '../public')))
    .use('/@huluvu424242/honey-news', express.static(path.join(__dirname, '../node_modules/@huluvu424242/honey-news/dist/')))
    .use(feeder.addCORSHeader)
    .use(function(req, res, next) {
       if( res.status(404)){
           redirect404(computeSegmentCount(2, 0));
       }
    })
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



////
//// inhalt von redirect.js weil import unklar
///

// Single Page Apps for GitHub Pages
// https://github.com/rafrex/spa-github-pages
// Copyright (c) 2016 Rafael Pedicini, licensed under the MIT License
// modified by Huluvu424242 at 2021

const isLocal = () => {
    const originURL = window.location.origin;
    return originURL.startsWith("http://localhost") || originURL.startsWith("https://localhost")
};

const computeSegmentCount = (localSegmentCount,remoteSegmentCount) => {
    return isLocal()? localSegmentCount:remoteSegmentCount;
};

const redirect404 = (segmentCount) => {
    const location = window.location;
    const origin = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
    const base = location.pathname.split('/').slice(0, 1 + segmentCount).join('/');

    location.replace(
        origin +
        base + '/?p=/' +
        location.pathname.slice(1).split('/').slice(segmentCount).join('/').replace(/&/g, '~and~') +
        (location.search ? '&q=' + location.search.slice(1).replace(/&/g, '~and~') : '') +
        location.hash
    );
};

const recieveRedirect = () => {
    (function (location) {
        if (location.search) {
            var q = {};
            location.search.slice(1).split('&').forEach(function (v) {
                var a = v.split('=');
                q[a[0]] = a.slice(1).join('=').replace(/~and~/g, '&');
            });
            if (q.p !== undefined) {
                window.history.replaceState(null, null,
                    location.pathname.slice(0, -1) + (q.p || '') +
                    (q.q ? ('?' + q.q) : '') +
                    location.hash
                );
            }
        }
    }(window.location));
};
