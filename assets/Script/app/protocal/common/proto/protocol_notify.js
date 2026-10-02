let Protocol = {
    NOTIFY: {
        ["value"]: 1100,
    },
};

let proto = require("proto_notify");
let NotifyCli_Proto = proto.NotifyCli_Proto.create();
for (const key in NotifyCli_Proto) {
    let value = NotifyCli_Proto[key];
    if(typeof key == 'string' && typeof value == 'number'){
        Protocol.NOTIFY[key] = value;
    }
}
NotifyCli_Proto = null;

module.exports = Protocol;