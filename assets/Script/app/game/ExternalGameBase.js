let my = require("my");

class ChessSetGame {
    constructor(package_name){
        let target = window;
        target[package_name] = this;
    }

    register(){
        this.unregister();
        this._onAppMessage = this._onMessage.bind(this);
        if(cc.sys.os==cc.sys.OS_IOS){
            window.addEventListener("message", this._onAppMessage, false);
        }
        else if(cc.sys.os==cc.sys.OS_ANDROID){
            window.document.addEventListener("message", this._onAppMessage, false);
        }
    }
    unregister(){
        if(this._onAppMessage){
            if(cc.sys.os==cc.sys.OS_IOS){
                window.addEventListener("message", this._onAppMessage, false);
            }
            else if(cc.sys.os==cc.sys.OS_ANDROID){
                window.document.addEventListener("message", this._onAppMessage, false);
            }
            this._onAppMessage = null;
        }
    }
    
    load(app, bundle) {
        
    }
    destroy(){
        
    }

    start(onComplete){
        onComplete&&onComplete(this);
    }
    exit(onComplete){
        onComplete&&onComplete(this);
    }
    
    _onMessage(event) {
         //console.error("onMessage: ", event);
    }
}

let external = new ChessSetGame("chessset");
module.exports = external;