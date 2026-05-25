const https = require('https');
const fs = require('fs');
const url = 'https://' + 'github.com' + '/maurakrandall/daily-fuel/archive/refs/heads/main.zip';

https.get(url, (res) => {
  if (res.statusCode === 302) {
    https.get(res.headers.location, (res2) => {
      res2.pipe(fs.createWriteStream('repo.zip'));
    });
  } else {
    res.pipe(fs.createWriteStream('repo.zip'));
  }
});

