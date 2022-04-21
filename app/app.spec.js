// const {spawn} = require('child_process');
// const got = require('got');
// const appSpec = require('tape');
//
// // Start the app
// const env = Object.assign({}, process.env, {PORT: 5000});
// const child = spawn('node', ['app/index.js'], {env});
//
// appSpec('responds to requests', (t) => {
//     t.plan(4);
//
//     // Wait until the server is ready
//     child.stdout.on('data', _ => {
//         // Make a request to our app
//         (async () => {
//             const response = await got('http://127.0.0.1:5000');
//             // stop the server
//             child.kill();
//             // No error
//             t.false(response.error);
//             // Successful response
//             t.equal(response.statusCode, 200);
//             // Assert content checks
//             t.notEqual(response.body.indexOf("<h1>Nutzung der honey-news Komponente</h1>"), -1);
//             t.notEqual(response.body.indexOf("<honey-news />"), -1);
//         })();
//     });
// });
