import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { mockData } from './adsmock.js';
import { createClient } from 'redis';

dotenv.config()

/*
    TODO:
    1. compose file update with my service
    2. Simple loop to get data every 2 min
    3. Cache new data
*/ 

const DEFAULT_CACHE = "ads-cache";
const DATA_SOURCE = "http://psuaddservice.fenris.ucn.dk/";
const client = createClient({ url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}` });

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
                resolve(data);
            }else {
                reject("Problem loading a cache.");
            }
        });
    })
}

export const loadAdsData = () => {
    let data;
    let filtered;

    fetch(DATA_SOURCE).then(async load => {
        const text = await load.text()
        filtered = text.split(">")[1];

        if(filtered != undefined) {
            data = filtered.substring(0, filtered.indexOf("<"));
            cacheData(DEFAULT_CACHE, data);
            return true;
        }else {
            console.log("Request has failed, trying again.");
            return false;
        }
    });
}

