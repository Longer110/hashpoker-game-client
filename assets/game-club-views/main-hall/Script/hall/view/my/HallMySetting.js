// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let i18n = require("i18n");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let LocalStorage = require("LocalStorage");

cc.Class({
    extends: cc.Component,

    properties: {
        label_version: cc.Label,
        prefabList: {
            default: [],
            type: cc.Prefab,
        },

        btn_deleteAccount: cc.Node,
        label_phone: cc.Label,
        label_mailbox: cc.Label,
        changeBindPrefab: cc.Prefab,

        soundToggle: cc.Toggle,
        
        _openProtection: 0,

        languageSetPrefab:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        app.util.addClickSoundToNode(this.node);
    },

    start () {
        // if(cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS){
        //     this.btn_deleteAccount.active = true;
        // }else{
        //     this.btn_deleteAccount.active = false;
        // }
    },

    // update (dt) {},

    initUI(control, data){
        let effectVolume = app.storage.getEffectVolume();
        if (effectVolume <= 0){
            this.soundToggle.isChecked = false;
            this.onClickToggle(this.soundToggle);
        }else{
            this.soundToggle.isChecked = true;
            this.onClickToggle(this.soundToggle);
        }
        this.control = control;
        this._openProtection = data.nOpenProtection;
        // if(app.config.ENVIRONMENT){
        //     this.label_version.string = app.config.ENVIRONMENT + "." + app.config.VERSION;
        // }else{
        //     this.label_version.string = app.config.VERSION;
        // }
        this.label_version.string = "v1.0." + app.config.BUILDVERSION;
        
        // this.setPhone(data.sPhone);
        // this.setMailbox(data.sMail);
    },

    setPhone(sPhone){
        if (!sPhone){
            this.label_phone.lang = "CLUB_BINDING.GO_TO_BIND";
            let color = new cc.Color(139, 138, 147, 255);
            this.label_phone.node.color = color;
            return;
        }

        this._hasPhone = true;
        let arr = sPhone.split("-");
        let str = arr[1];
        str = str.substring(0, 3) + "****" + str.substring(str.length - 4);
        this.label_phone.string = str;
        let color = new cc.Color(226, 199, 162, 255);
        this.label_phone.node.color = color;
    },

    changePhone(phone){
        if (this.control){
            this.control.changePhone(phone);
        }

        this.setPhone(phone);
    },

    setMailbox(sMailbox){
        if (!sMailbox){
            this.label_mailbox.lang = "CLUB_BINDING.GO_TO_BIND";
            let color = new cc.Color(139, 138, 147, 255);
            this.label_mailbox.node.color = color;
            return;
        }

        this._hasMailbox = true;
        let arr = sMailbox.split("@");
        let str = arr[0];
        str = str.substring(0, 1) + "****" + str.substring(str.length - 1) + "@" + arr[1];
        this.label_mailbox.string = str;
        let color = new cc.Color(226, 199, 162, 255);
        this.label_mailbox.node.color = color;
    },

    changeMailbox(mailbox){
        if (this.control){
            this.control.changeMailbox(mailbox);
        }

        this.setMailbox(mailbox);
    },

    onClickGameSetting(){
        //牌局设置
        this.addUI(this.prefabList[0]);
    },

    onClickChangePsw(){
        //安全管理
        let node = cc.instantiate(this.prefabList[1]);
        this.node.addChild(node);
        let component = node.getComponent("HallSecurityManager");
        if (component) {
            component.initUI(this._openProtection);
        }
    },

    onClickLanguage(){
        //语言选择
        // this.addUI(this.prefabList[2]);
        let languageNode = cc.instantiate(this.languageSetPrefab)
        this.node.addChild(languageNode);
        return languageNode;
    },


    onClickChangeAccount(){
        //切换账号
        let params = {
            text: i18n.t("CLUB_HALL_TIP.CHANGE_COUNT"),
            callBack: function(isOk){
                if (isOk){
                    LocalStorage.setAutoLoginState(false);
                    this._logOut();
                }
                
            }.bind(this),
            isOKAndCancel: true,
        }
        MsgManager.fire(MSG.NOTIFY.OPEN_DIALOG, params);
        
    },

    onClickDeleteAccount(){
        //注销账号
        this.addUI(this.prefabList[3]);
        
    },

    onClickClose(){
        this.node.destroy();
    },

    onClickBindPhone(){
        if (this._hasPhone){
            let node = this.addUI(this.changeBindPrefab);
            let component = node.getComponent("HallMyChangeBinding");
            if (component) {
                component.init(this, 1);
            }
            return;
        }
        let node = this.addUI(this.prefabList[4]);
        let component = node.getComponent("HallMyBinding");
        if (component) {
            component.init(this, 1);
        }
    },

    onClickBindMailbox(){
        if (this._hasMailbox){
            let node = this.addUI(this.changeBindPrefab);
            let component = node.getComponent("HallMyChangeBinding");
            if (component) {
                component.init(this, 2);
            }
            return;
        }

        let node = this.addUI(this.prefabList[4]);
        let component = node.getComponent("HallMyBinding");
        if (component) {
            component.init(this, 2);
        }
    },

    onClickToggle(event, customData) {
        let node = event.node
        if (event.isChecked){
            app.storage.setEffectVolume(1);
            node.getChildByName("Background").active = false
        }else{
            app.storage.setEffectVolume(0);
            node.getChildByName("Background").active = true
        }
    },

    addUI(prefab){
        let node = cc.instantiate(prefab);
        this.node.addChild(node);
        return node;
    },

     //登出
     _logOut(){
        //断开游戏连接
        if (app.net.isConnect()) {
            app.net.disConnect(true);
            app.net.release();
        }

        MsgManager.fire("logout");
        
        //退出登录，返回到登录界面
        // UIFrame.loadScene("login", null, null, null, true);
        app.res.loadLogin(function onComplete(params) {
            
        })
    },

});
