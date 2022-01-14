import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { createClient } from 'redis';

dotenv.config()

const DATA_SOURCE = "http://psuaddservice.fenris.ucn.dk/";
const client = createClient({ url: process.env.REDIS_URL });

client.connect();


client.on('error', (err) => {
  console.log("Error " + err)
});

const cacheData = (cacheName, data) => {
  client.set(cacheName, data);
}

export const retrieveCachedData = (key = process.env.REDIS_DATA_STORAGE) => {
  return new Promise((resolve, reject) => {
    client.get(key)
      .then((data) => {
        resolve(data)
      }).catch(error => reject("Failed to retrieve cached data => " + error))
  })
}

const getOrSetCache = (key, callback) => {
  return new Promise((resolve, reject) => {
    client.get(key, async (error, data) => {
      if (error) return reject(error)
      if (data != null) return resolve(JSON.parse(data))
      const freshData = await callback()

      const ttl = process.env.REDIS_DATA_EXPIRATION
      if (ttl) {
        await client.set(key, ttl, JSON.stringify(freshData));
      } else {
        await client.set(key, JSON.stringify(freshData))
      }
      resolve(freshData)
    })
  })
}

const pushNewAdd = (ad, callback) => {
  client.lPush(process.env.REDIS_DATA_STORAGE, ad, (error) => {
    if (error) return callback(error)
    callback()
  })
}

export const getRandomAdd = async (count = 1) => {
  // TODO: implement me please
  const ads = await retrieveCachedData(process.env.REDIS_DATA_STORAGE)
  return ["My name is Kamil.", "I do not like mushrooms!"]
}

export const run = () => {
  const fetchLoop = setInterval(() => {
    loadAdsData();
  }, process.env.FETCH_CYCLE_MS || 600000, {});

  process.once('SIGINT', () => {
    clearInterval(fetchLoop)
    process.exit(0);
  })
}

const loadAdsData = () => {
  fetchWithTimeout(DATA_SOURCE, process.env.REQUEST_TIMEOUT_MS).then(async load => {
    const text = await load.text()
    try {
      const data = await parseAd(text)
      pushNewAdd(process.env.REDIS_DATA_STORAGE, data);
    } catch (error) {
      console.error('Text could not be process due to wrong format!')
      console.error(error.toString())
    }
  }).catch(error => console.error(`Error while fetching data from ${ DATA_SOURCE } => ` + error));
}

const fetchWithTimeout = (url, ms = 15000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`TIMEOUT.. no response within ${ ms / 1000. } seconds.`))
    }, ms)

    fetch(url)
      .then(value => {
        clearTimeout(timer)
        resolve(value)
      })
      .catch(reason => {
        clearTimeout(timer)
        reject(reason)
      })
  })
}

export const parseAd = (text) => {
  if (!text) {
    throw new Error('Nothing returned, external service is down!')
  }
  const data = text.match(/>.*</g);
  if (data.length !== 1) {
    throw new Error("Unprocessable data => " + text)
  }

  return data[0].replace(/(<|>)/g, '')
}
