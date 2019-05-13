const protocol = require('./protocol');
const dgram = require('dgram');
const udpSocket = dgram.createSocket('udp4');
const moment = require('moment');
const net = require('net');
const mapMusician = new Map();

var server = net.createServer();
server.on('connection', newClientHasArrived);
server.listen(2205, "0.0.0.0");

function newClientHasArrived(socket) {
    var musicians = new Array();

    mapMusician.forEach(function (value, key) {
        var activeMusician = {
            uuid: key,
            instrument:value["instrument"],
            activeSince: value["activeSince"]
        };
        musicians.push(activeMusician);

    });
    var payload = JSON.stringify(musicians);
    socket.write(payload + '\n');
    socket.end();
}

function Activity(instrument, activeSince) {
    this.instrument = instrument;
    this.activeSince = activeSince;
}


udpSocket.bind(protocol.PROTOCOL_PORT, function() {
    console.log("Joining multicast group, address : " + protocol.PROTOCOL_MULTICAST_ADDRESS + ", port :" + protocol.PROTOCOL_PORT);
    udpSocket.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

udpSocket.on('message', function(msg, source) {
    var rcv = JSON.parse(msg);
    var uuid = rcv["uuid"];
    var instrument = rcv["instrument"];


    if(mapMusician.has(uuid)) {
        if(mapMusician.has(uuid)) {
            mapMusician.get(uuid)["activeSince"] = moment().format();
        }
    } else {
        var activity = new Activity(instrument, moment().format());
        mapMusician.set(uuid, activity);
    }
});

function checkMusicianStillActive() {
    mapMusician.forEach(function (value, key) {
        var now = moment().format();
        var then = value["activeSince"];
        var comparaison = moment(now).diff(moment(then), 'second');
        if(comparaison > 5) {
            mapMusician.delete(key);
        }
    });
}

setInterval(checkMusicianStillActive, 1000);