import fetch from 'node-fetch';
import { mockData } from './adsmock.js';
import { createClient } from 'redis';

let LAST_TIME_PULL;
const LIMIT_TIME_IN_MIN = 2;
const DEFAULT_CACHE = "ads-cache";
const DATA_SOURCE = "http://psuaddservice.fenris.ucn.dk/";
const client = createClient();
client.connect();


client.on('error', (err) => {
    console.log("Error " + err)
});

const cacheData = (cacheName, data) => {
    client.set(cacheName, data);
}

export const retrieveCachedData = async (cacheName = DEFAULT_CACHE) => {
    return new Promise((resolve, reject) => {
        client.get(cacheName).then(data => {
            if(data) {
                resolve(JSON.parse(data));
            }else {
                reject("Infinite jest");
            }
        });
    })
}

export const loadAdsData = () => {
    let data;
    LAST_TIME_PULL = Date.now();

    data = fetch(DATA_SOURCE).then(dat => {
        console.log('Mock load finished');
    });

    data = JSON.stringify(mockData)
    cacheData(DEFAULT_CACHE, data);

    return data;
}

