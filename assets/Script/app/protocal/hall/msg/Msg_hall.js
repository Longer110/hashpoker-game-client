let MSG = {
};

let proto = require("proto_hall");
let Lobby_Proto = proto.Lobby_Proto.create();
for (const key in Lobby_Proto) {
    let value = Lobby_Proto[key];
    if(typeof key == 'string' && typeof value == 'number'){
        MSG[key] = "hall_" + key;
    }
}
Lobby_Proto = null;

module.exports = MSG;