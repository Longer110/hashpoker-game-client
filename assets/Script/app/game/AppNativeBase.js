// let AppBridge = require("AppBridge");
// let BridgeManager = require("BridgeManager");

class AppNativeBase extends cc.EventTarget {
    _rollbacks = [
        // {
        //     callback: ()=>void,
        //     target: cc.Component,
        // }
    ];

    _keyMap = new Map();

    constructor(){
        super();
        this.load();
    }

    load(){
		cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this._onKeyUp, this);
	}
	destroy(){
		cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this._onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this._onKeyUp, this);
	}

    /**
     * 增加一个原生平台界面回退时的调用
     * @param {Object} target cc.Component
     * @param {Function} callback ()=>void 
     */
    addRollback(target, callback){
        //俱乐部平台才处理
        if(!app.config.IS_CLUB_ONLY){
            return;
        }

        if(CC_DEV){
             //console.warn("AppNativeBase", "addRollback", target?target.name:"[undefine]");
        }

        if(!callback || !cc.isValid(target)){
            QYLogs.error("AppNativeBase", "无效的参数");
            return;
        }

        let index = this._getRollbackIndex(target, callback);
        if(index>=0){
            this.removeRollback(target, callback);
        }

        let content = target.name || "[undefine]";
        let scene = cc.director.getScene();
        if(scene){
            content = `${content} - scene<${scene.name}>`
        }
        this._rollbacks.push({
            target,
            callback,
            content 
        })
    }

    /**
     * 移除一个原生平台界面回退时的调用
     * @param {Object} target cc.Component
     * @param {Function} callback (void)=>boolean
     */
    removeRollback(target, callback){
        let index = this._getRollbackIndex(target, callback);
        if(index>=0){
            this._rollbacks.splice(index, 1);
        }
    }

    clearRollback(){
        this._rollbacks.length = 0;
    }

    _getRollbackIndex(target, callback){
        let index = this._rollbacks.findIndex(e=>e.callback==callback&&e.target==target);
		return index;
    }

    _onKeyUp(event) {
        let keyCode = event.keyCode;
        this._keyMap.delete(keyCode);
    }

    _onKeyDown(event) {
        let keyCode = event.keyCode;
        this._keyMap.set(keyCode, 1);

        //浏览器开发环境
        if(CC_DEV && cc.sys.isBrowser){
            const KEY_SHIFT = 16;
            const KEY_BACK = 8;

            // shift + back 模拟手势回退效果
            if(this._keyMap.get(KEY_SHIFT) && keyCode === KEY_BACK){
                keyCode = cc.macro.KEY.back; //6
            }
        }
        switch (keyCode) {
            case cc.macro.KEY.back:
				if(this._rollbacks.length>0){
					let e = this._rollbacks[this._rollbacks.length-1];
                    if(cc.isValid(e.target)){
                        QYLogs.warn("AppNativeBase", "触发一次手势", e.content);
                        e.callback.call(e.target);
                    }
                    else{
                        QYLogs.error("AppNativeBase", "对象已释放", e.content);
                        this._rollbacks.pop();
                    }
				}
                break;
            default:
                break;
        }

        return true;
    }

    // register(){
    //     // this._onAppMessage = this.onMessage.bind(this);
    //     // this.postMessage = this._postToWebview;
    //     // //原生项目消息封装
    //     // if(cc.sys.isNative){
    //     //     cc.log("AppNativeBase:isNative")
    //     //     if(this.isNativeAppLib()){
    //     //         cc.log("AppNativeBase:isNativeAppLib")
    //     //         qygameengine.MessageManager.getInstance().setGameMsgCallback(this._onAppMessage);
    //     //         this.postMessage = this._postToNative;
    //     //     }
    //     // }
      
    //     // BridgeManager.default.load();
    // }
    // unregister(){
    //     //TODO
    // }
    // isNativeAppLib(){
    //     if(cc.sys.isNative && window['qygameengine'] && qygameengine.MessageManager){
    //         return true;
    //     }
    //     return false;
    // }
    // onMessage(eventString){
    //     if(!eventString){
    //         eventString = "{}";
    //     }
        
    //     let json = JSON.parse(eventString);
    //     let event = {
    //         data: json,
    //     }
    //     // BridgeManager.default._onMessage(event);
    // }
    // _postToWebview(msg, data){
    //     // BridgeManager.default.postMessage(msg, data);
    // }
    // _postToNative(msg, data){
    //     msg = msg || AppBridge.MESSAGE;
    //     if(!data && data!=0){
    //         data = "{}";
    //     }
    //     let event = {
    //         msg: msg,
    //         data: data,
    //         key: AppBridge.CLIENT_KEY,
    //     } 
    //     let eventString = JSON.stringify(event);
    //     qygameengine.MessageManager.getInstance().gameAction(eventString);
    // }
    // postMessage(msg, data){
    // }
}

module.exports = AppNativeBase;