let Protocol = {
    CHAT: {
        ["value"]: 110,
    },

};

let proto = require("proto_chat");
let Chat_Proto = proto.Chat_Proto.create();
for (const key in Chat_Proto) {
    let value = Chat_Proto[key];
    if (typeof key == 'string' && typeof value == 'number') {
        Protocol.CHAT[key] = value;
    }
}
Chat_Proto = null;

module.exports = Protocol;