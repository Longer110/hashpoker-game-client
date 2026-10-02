let Protocol = {
    GAME_CLUB: {
        ["value"]: 263,
    },

    GAME_CLUB_MTT: {
        ["value"]: 337,
    },
};

let proto = require("proto_club");
let club_Proto = proto.ClubS_Proto.create();
for (const key in club_Proto) {
    let value = club_Proto[key];
    if (typeof key == 'string' && typeof value == 'number') {
        Protocol.GAME_CLUB[key] = value;
    }
}
club_Proto = null;

let club_Proto2 = proto.ClubS_Proto2.create();
for (const key in club_Proto2) {
    let value = club_Proto2[key];
    if (typeof key == 'string' && typeof value == 'number') {
        Protocol.GAME_CLUB[key] = value;
    }
}
club_Proto2 = null;

let club_mtt = proto.TEvt_Proto.create();
for (const key in club_mtt) {
    let value = club_mtt[key];
    if (typeof key == 'string' && typeof value == 'number') {
        Protocol.GAME_CLUB_MTT[key] = value;
    }
}
club_mtt = null;


module.exports = Protocol;