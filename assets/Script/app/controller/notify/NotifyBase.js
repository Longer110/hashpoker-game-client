let MsgManager = require("MsgManager");

class NotifyBase extends cc.Component {
    name = "NotifyBase";
    _listHandler = [];
    constructor(options) {
        super(options);
    }

    onLoad(){

    }
    onDestroy(){
        this._un();
    }
    _on(msg, handler) {
        MsgManager.on(msg, handler, this);
        this._listHandler.push(handler);
    }
    _un(handler) {
        if(handler){
            for (let index = 0; index < this._listHandler.length; index++) {
                let callback = this._listHandler[index];
                if(handler==callback){
                    MsgManager.un(callback, this);
                    this._listHandler.splice(index, 1);
                    break;
                }
            }
        }
        else if(this._listHandler){
            for (let index = 0; index < this._listHandler.length; index++) {
                let callback = this._listHandler[index];
                MsgManager.un(callback, this);
            }
            this._listHandler = [];
        }
    }
}

module.exports = NotifyBase;