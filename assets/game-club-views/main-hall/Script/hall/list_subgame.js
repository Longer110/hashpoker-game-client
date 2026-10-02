if(!CC_EDITOR){
    // cc.warnID(1400, "require(\"list_subgame\")", "app.game");
}

let app = require("App");
let proto = app.game;
let string = "ListSubGame";
proto && Object.defineProperties(proto, {
    // getRoomList: {
    //     // writable: false,
    //     enumberable: false,
    //     value: function (nGameId) {
    //         cc.errorID(1400,  `${string}.getRoomList()`, "app.hall.ctrl.reqRoomList()");
    //         app.hall.ctrl.reqRoomList(nGameId);
    //     },
    // },
    getSubGameID: {
        // writable: false,
        enumberable: false,
        value: function () {
            cc.errorID(1400,  `${string}.getSubGameID()`, "app.game.getGameID()");
            app.game.setData();
        },
    },
    setSubGameID: {
        // writable: false,
        enumberable: false,
        value: function (data) {
            cc.errorID(1400,  `${string}.setSubGameID()`, "app.game.setGameID()");
            return app.game.setGameID(data);
        },
    },
    getSubGameList: {
        // writable: false,
        enumberable: false,
        value: function () {
            cc.errorID(1400,  `${string}.getSubGameList()`, "app.game.getGameList()");
            return app.game.getGameList();
        },
    },
    setSubGameList: {
        // writable: false,
        enumberable: false,
        value: function (data) {
            cc.errorID(1400,  `${string}.setSubGameList()`, "app.game.setGameList()");
            return app.game.setGameList(data);
        },
    },
    getSubSessionList: {
        // writable: false,
        enumberable: false,
        value: function () {
            cc.errorID(1400,  `${string}.getSubSessionList()`, "app.game.getRoomList()");
            return app.game.getRoomList();
        },
    },
    setSubSessionList: {
        // writable: false,
        enumberable: false,
        value: function (data) {
            cc.errorID(1400,  `${string}.setSubSessionList()`, "app.game.setRoomList()");
            return app.game.setRoomList(data);
        },
    },
    getSubGameItem: {
        // writable: false,
        enumberable: false,
        value: function (gameid) {
            cc.errorID(1400,  `${string}.getSubSessionList()`, "app.game.getGameItem()");
            return app.game.getGameItem(gameid);
        },
    },
});

module.exports = proto;