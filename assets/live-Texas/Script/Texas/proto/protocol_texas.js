let Protocol = {
    ClubTexas: {
        ["value"]: 231,
    },
    Texas: {
        ["value"]: 229,
    },

    LiveSlave: {
        ["value"]: 302,
    },
};

let proto = require("proto_texas");
let ClubTexasProto = proto.ClubDeZhou_Proto.create();
for (const key in ClubTexasProto) {
    let value = ClubTexasProto[key];
    if(typeof key == 'string' && typeof value == 'number'){
        Protocol.ClubTexas[key] = value;
    }
}
ClubTexasProto = null;

let TexasProto = proto.DeZhou_Proto.create();
for (const key in TexasProto) {
    let value = TexasProto[key];
    if(typeof key == 'string' && typeof value == 'number'){
        Protocol.Texas[key] = value;
    }
}
TexasProto = null;

let LiveSlave_Proto = proto.LiveSlave_Proto.create();
for (const key in LiveSlave_Proto) {
    let value = LiveSlave_Proto[key];
   // cc.log("LiveSlave_Proto ="+key+"value=",value)
    if(typeof key == 'string' && typeof value == 'number'){
        Protocol.LiveSlave[key] = value;
    }
}
LiveSlave_Proto = null;

module.exports = Protocol;