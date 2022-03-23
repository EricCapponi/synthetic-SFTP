const sftpClient = require('ssh2-sftp-client')
const zlib = require('zlib');
const request = require('request');

var assert = require('assert')
var sftp = new sftpClient()

// Connection parameters
const cHost = $secure.SFTPHOST
const cPort = '22'
const cUsername = $secure.SFTPUSER
const cPassword = $secure.SFTPPASSWORD
const cPrivateKey = $secure.SFTPPKEY
const loggingAccount = $secure.LOGGINGACCOUNT
const ingestKey = $secure.INGESTAPIKEY
// The eventType defines which NRDB table the data is written to
const eventType = 'synCheck'
const eventTS = Date.now()

// This object is used to connect to teh sftp site
// if the const cPrivateKey is not null then a provate key
// will be used to log in, other wise a password is used
var connectObject = {
    host: cHost,
    post: cPort,
    username: cUsername,
    }

// This is the biolerplate API call for ingesting the events
var eventAPIcallOptions = { 
    method: 'POST',
    url: `https://insights-collector.newrelic.com/v1/accounts/${loggingAccount}/events`,
    headers: { 
      'Content-Type': 'application/json', 
      'Api-Key': ingestKey, 
      'Content-Encoding': 'gzip'
    },
    body: null
  }

if (cPrivateKey) {
    connectObject.privateKey = cPrivateKey
} else {
    connectObject.password = cPassword
}

function sendEvent(payload) {
    eventAPIcallOptions.body = zlib.gzipSync(Buffer.from(JSON.stringify(payload)))

      try {
        request(eventAPIcallOptions, (err, res, body) => { 
           if (err) {
             assert.fail(`API error posting events: ${err}`)
           } else {
             console.log("Posted successfully")
             return
           }
         })
      }
      catch (error) {
        assert.fail(`Error posting events: ${error}`);
      }
}
function mainProc() {
sftp.connect(connectObject)
.then((data) => {
    // Log connected
    // Now we post the stats 
    payload = {
        timestamp: eventTS,
        eventType: eventType,
        'sftp.site': cHost,
        'sftp.connect': 'success'
      }
    sendEvent(payload)
    sftp.end()
})
.catch((error) => {
    // Now we post the stats 
    payload = {
        timestamp: eventTS,
        eventType: eventType,
        'sftp.site': cHost,
        'sftp.connect': 'failure',
        'sftp.error': error.code + ":" + error.message
      }
    sendEvent(payload)
})
}

mainProc()