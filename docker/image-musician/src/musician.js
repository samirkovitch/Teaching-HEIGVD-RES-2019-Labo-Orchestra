const uuidv4 = require('uuid/v4');
const dgram = require('dgram');
const udpSocket = dgram.createSocket('udp4');
const protocol = require('./protocol');
const moment = require('moment');

// tableau des sons
const SOUNDS = {
    piano: "ti-ta-ti",
    trumpet: "pouet",
    flute: "trulu",
    violin: "gzi-gzi",
    drum: "boum-boum"
};

var instrument = process.argv[2];

// Si l'instrument n'est pas definie
if(instrument === undefined){
    console.log("INSTRUMENT UNDEFINED !!! Please choose between those instruments :piano, trumpet, flute, violin, drum");
    process.exit(1);
}

console.log("Messages will be sent to : " + protocol.MULTICAST_ADDRESS + ":" + protocol.PORT);

setInterval(sendMessage, 1000);

var json = {
    uuid: uuidv4(),
    instrument: process.argv[2]
};

// envoie le message en "broadcast"
function sendMessage() {
    json.activeSince = moment();

    const payload = JSON.stringify(json);
    message = new Buffer(payload);

    console.log(SOUNDS[json.instrument] + ' message : ' + message);

    udpSocket.send(message, 0, message.length, protocol.PORT, protocol.MULTICAST_ADDRESS, function (err, bytes) {
        if (err) throw err;
    });
}