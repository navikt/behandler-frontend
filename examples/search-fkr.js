const {JWT} = require('jose');
const axios = require('axios');
const flatCache = require('flat-cache');
const fs = require('fs');
const path = require('path');
const secrets = require('./secrets.fkr.json');
const cache = flatCache.load('FKR');

const getToken = async () => {
  const result = await axios.post(
      secrets.stsUrl,
      new URLSearchParams({
        grant_type: 'client_credentials',
      }), {
        auth: {
          username: secrets.clientId,
          password: secrets.accessKey,
        },
      });

  return result.data;
};

const getTokenCached = async () => {
  const token = cache.getKey('token');
  if (token) {
    const nowTime = (new Date()).getTime() / 1000;
    const tokenContent = JWT.decode(token.access_token);
    if (nowTime < tokenContent.exp) {
      console.log('Using old token');
      return token.access_token;
    }
  }
  const newToken = await getToken();
  cache.setKey('token', newToken);
  cache.save();
  console.log('Fetched a new token');
  return newToken.access_token;
};
const url = 'https://hint-inet.utv.helsedir.no/kontaktregister/ekstern/Patient';
const search = async () => {
  const token = await getTokenCached();
  const result = await axios.get(url, {
    headers: {Authorization: `Bearer ${token}`},
    params: {
      //identifier: '19087999648',
      name: "Michael"
    },
  });
  return result.data;
};

/*
getTokenCached().then((res) => {
  console.log(res);
}).catch(error => {
  console.error(error.message);
});
*/

search().then(rs => {
  if (rs.entry) {
    fs.writeFileSync('./result.json', JSON.stringify(rs.entry));
    rs.entry.forEach(entry => {
      console.log(entry.resource);
    });
  }
}).catch(error => {
  console.error(error.message);
});


