
cc.Class({
    extends: cc.Component,

    properties: {
        rollbackEvents: {
            default: [],
            type: cc.Component.EventHandler,
            tooltip: CC_DEV && '界面回滚逻辑',
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {

    // },

    // update (dt) {},

    onEnable(){
        app.native.addRollback(this, this._onRollback);
    },

    onDisable(){
        app.native.removeRollback(this, this._onRollback);
    },

	_onRollback() {
		if(this.rollbackEvents.length > 0){
			cc.Component.EventHandler.emitEvents(this.rollbackEvents, null);
		}
		else{
			QYLogs.error("UIRollback", "_onRollback", "未指定界面回滚逻辑");
		}
    }
})