/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2023-01-04 18:24:25
 * @LastEditors: OreoWang
 * @LastEditTime: 2023-01-10 15:47:20
 * @Description: 
 */

const dev = console;
const DEBUG_LOG = true;

let DefaultStatus = {
    normal: "下拉刷新",
    handling: "正在刷新",
    handled: "刷新完成",
    cancel: "取消刷新"
}

cc.Class({
	extends: cc.Component,

	properties: {
		panel: {
			default: null,
			type: cc.Node,
			tooltip: '刷新/加载 子面板（用于作动画）',
		},
		loading: {
			default: null,
			type: cc.Node,
			tooltip: '刷新/加载 图标',
		},
		label: {
			default: null,
			type: cc.Label,
			tooltip: '刷新/加载 文字提示',
		},
		
		_size: null,
		_status: null,
		_inited: false,
        _isHandling: false,
        _isShowing: false,
	},

	
    init(vertical, status){
		if(!this._inited){
			this._inited = true;
			this._size = cc.size(this.node.width, this.node.height);
        }
		
        if(!status || typeof status!='object'){
            status = DefaultStatus;
        }
        else{
            for (const key in DefaultStatus) {
                if(typeof status[key] == 'undefined'){
                    status[key] = DefaultStatus[key];
                }
            }
        }
        this._isHandling = false;
        this._isShowing = false;
        this._status = status;
		this.node.width = vertical ? this._size.width : 0;
        this.node.height = vertical ? 0 : this._size.height;
        this.node.scale = 0;
        this.panel.scale = 0;
        this._onNormal();
    },

    show(){
        this._isShowing = true;
        let target = this.node;
        let panel = this.panel;
        const { width, height } = this._size;
        // let scale = cc.Vec2.ONE;
		let scale = 1;
        target.setScale(scale);
        target.width = width;
        target.height = height;
        cc.Tween.stopAllByTarget(target);
        cc.Tween.stopAllByTarget(panel);
        cc.tween(panel).call(()=>{
            this._onNormal();
        }).to(0.25, {scale}).call(()=>{
		}).start();
    },
    hide(isCancel = false){
        this._isShowing = false;
        let target = this.node;
        let panel = this.panel;
        let width = 0;
        let height = 0;
        // let scale = cc.Vec2.ZERO;
		let scale = 0;
        cc.Tween.stopAllByTarget(target);
        cc.Tween.stopAllByTarget(panel);
        cc.tween(target).call(()=>{
            // dev.log("TODO width,height");
        }).delay(0.25).to(0.25, {scale, width, height}).call(()=>{
        }).start();
        cc.tween(panel).call(()=>{
            if(isCancel){
                this._onCancel();
            }
            else{
                this._onHandled();
            }
        }).delay(0.25).to(0.25, {scale}).call(()=>{
        }).start();
    },
    handling(callback){
        this._onHandling(callback);
    },
    handled(){
        this.hide(false);
    },
    cancel(){
        this.hide(true);
    },
    _onNormal(){
        this._isHandling = false;
        this.setText(this._status.normal);
        this.loading.angle = 0;
        this.loading.scale = 0;
        this.loading.active = false;
    },
    _onHandling(callback){
        this._isHandling = true;
        this.setText(this._status.handling);
        this.loading.active = true;
        this.loading.scale = 0;
        cc.Tween.stopAllByTarget(this.loading);
        cc.tween(this.loading).to(0.2, {scale: 1}).delay(0.25).call(()=>{
			if(callback){
				callback();
			}
		}).start();
        cc.tween(this.loading).by(1, {angle: -360}).repeatForever().start();
    },
    _onHandled(){
        this._isHandling = false;
        this.setText(this._status.handled);
		cc.tween(this.loading).to(0.2, {scale: 0}).call(()=>{
			cc.Tween.stopAllByTarget(this.loading);
        }).start();
    },
    _onCancel(){
        this._isHandling = false;
        this.setText(this._status.cancel);
        cc.Tween.stopAllByTarget(this.loading);
        this.loading.angle = 0;
        this.loading.scale = 0;
        this.loading.active = false;
    },
    isShowing(){
        return this._isShowing;
    },
    isHandling(){
        return this._isHandling;
    },
    isScaling(){
        let scale = this.panel.scale;
        return scale<0.99;
    },
    setText(text){
        if(typeof text != "string"){
            text = "";
        }
        this.label.string = text;
    }
})