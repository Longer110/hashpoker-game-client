
if(!CC_EDITOR){
    // cc.warnID(1400, "require(\"init_game\")", "app.game");
}
let app = require("App");
let proto = app.game;
let string = "App"+".Game";
proto && Object.defineProperties(proto, {
    currentGame: {
        // writable: false,
        enumberable: false,
        get(){
            cc.errorID(1400, `${string}.currentGame`, "app.game.getGame()");
            return app.game.getGame();
        }
    },
    setCurrentGameData: {
        // writable: false,
        enumberable: false,
        value: function (data) {
            cc.errorID(1400,  `${string}.setCurrentGameData()`, "app.game.setData()");
            return app.game.setData(data);
        },
    },
    getCurrentGameData: {
        // writable: false,
        enumberable: false,
        value: function () {
            cc.errorID(1400,  `${string}.getCurrentGameData()`, "app.game.getData()");
            return app.game.getData();
        },
    },
    clearCurrentGameData: {
        // writable: false,
        enumberable: false,
        value: function (data) {
            cc.errorID(1400,  `${string}.clearCurrentGameData()`, "app.game.clearData()");
            return app.game.clearData(data);
        },
    },
})
module.exports = proto

