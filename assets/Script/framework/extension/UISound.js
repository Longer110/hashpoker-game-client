// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

// [[
//     * @Author:      wangb
//     * @DateTime:    2018-07-18 10:05:23
//     * @Description: 统一UI点击音效
// ]]

require("AudioManager");

cc.Class({
    extends: cc.Component,

    properties: {
        clickEffect: {
            default: "button/click",
        },
        clickInterval: {
            default: 0,
            visible: true,
        },
        interactable: {
            visible: false,
            get(){
                let enable = false;
                let button = this.getComponent(cc.Button);
                if(button){
                    enable = button.interactable;
                }
                return enable;
            },
            set(value){
                let button = this.getComponent(cc.Button);
                if(button && button.interactable!=value){
                    button.interactable = value;
                }
            },
        },
        _deltaInterval: 0,
        _touchEnabled: false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(this.clickEffect){
            app.common.audio.preload(this.clickEffect);
        }
        this._touchEnabled = this.interactable
    },

    onDestroy(){
        this.node.off('click', this._onClick, this);
        this.node.off('uisound', this._onClick, this);
    },

    start () {
        this.node.on('click', this._onClick, this);
        this.node.on('uisound', this._onClick, this);
    },

    update (dt) {
        this._deltaInterval += dt;
        if(!this._touchEnabled) return;

        if(!this.interactable && this._deltaInterval>=this.clickInterval){
            this._setTouchEnable(true);
        }
    },

    //外部强制不能点击，避免update自动设置回可点击
    forceTouchEnabled(enabled){
        this._touchEnabled = enabled;
        this.interactable = enabled;
    },

    // onEnable(){
    //     // cc.Button、cc.Toggle
    //     this.node.on('click', this._onClick, this);
    //     this.node.on('uisound', this._onClick, this);
    // },
    // onDisable(){
    //     this.node.off('click', this._onClick, this);
    //     this.node.off('uisound', this._onClick, this);
    // },

    _setTouchEnable(enable){
        this._deltaInterval = 0;
        this.interactable = enable;
    },

    _onClick(component){
        this._setTouchEnable(false);

        if(!this.clickEffect || this.clickEffect=="") return;
     
        cc.log("UISound", "_onClick: " + this.node.name);
        app.common.audio.playEffect(this.clickEffect);
        // cc.log(audio.id, audio.path);
    },
});
