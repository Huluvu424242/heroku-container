//
// Tutorial: https://blog.logrocket.com/guide-to-orbitdb-node-js/
//

const IPFS = require('ipfs');
const OrbitDB = require('orbit-db');
const Identities = require('orbit-db-identity-provider');


/* IIFE https://developer.mozilla.org/en-US/docs/Glossary/IIFE */
(async () => {

    // optional settings for the ipfs instance
    const ipfsOptions = {
        EXPERIMENTAL: {
            pubsub: true
        },
    }

    const ipfs = await IPFS.create(ipfsOptions)

    const Identities = require('orbit-db-identity-provider')
    const options = { id: 'local-id' }
    const identity = await Identities.createIdentity(options)
    console.log("Identity:", identity.toJSON());
    console.log("Public Key:", identity.publicKey)


    // const orbitdb = await OrbitDB.createInstance(ipfs)
    const orbitdb = await OrbitDB.createInstance(ipfs, {identity: identity})

    const optionsToWrite = {
        // Give write access to the creator of the database
        accessController: {
            type: 'orbitdb', //OrbitDBAccessController
            write: [orbitdb.identity.id, '04ad4d2a7812cac1f0e6331edf22cec1a74b9694de6ad222b7cead06f79ec44a95e14b002ee7a0f6f03921fcf2ff646724175d1d31de4876c99dcc582cde835b4c'],
        }
    }

    const db = await orbitdb.docs('test-db', optionsToWrite)

    console.log("DB Adresse:", db.address.toString())

    await db.put({_id: 'test1', name: 'test-doc-db', category: 'distributed'})


    const value2 = db.get('') // this gets all the entries in the database store

    console.log("Log ALL:",value2)

    // Listen for updates from peers
    db.events.on("replicated", address => {
        console.log("### UPDATE: ",db.iterator({ limit: -1 }).collect())
    })


})();