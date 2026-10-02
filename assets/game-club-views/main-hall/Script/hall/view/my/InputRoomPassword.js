// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let UIFrame = require("UIFrame");
let UserInfo = require("UserInfo");
let MsgManager = require("MsgManager");
let Base64 = require("base64");
let CMD = require("protocol_club");
let MSG = require("Msg_club");

cc.Class({
    extends: cc.Component,

    properties: {

        passEditBox: cc.EditBox,
        lookNode: cc.Node,
        errorNode: cc.Node,
        label_title: cc.Label,
        labelList: {
            default: [],
            type: cc.Label
        },
        cursor: cc.Node,
        editBox: cc.EditBox,

        _data: null,
        _repEdit: null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        // this._repEdit = new RegExp('^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!%*#?&~_-])[A-Za-z0-9$@$!%*#?&~_-]{8,20}$')
        this.passwordStr = ''
        this._repEdit = new RegExp('[0-9]{6}')
        this.editBox.placeholder = "";
        
        this.regiester();
        //延迟0.1秒弹出键盘
        // this.scheduleOnce(() => {
            this.onClickEditbox();
        // }, 1);
    },


    onDestroy() {
        MsgManager.un(this._onClubSTablePassRspCallBack);
    },

    regiester(){
        MsgManager.on(MSG.GAME_CLUB.ClubSTablePassRsp_CMD, this._onClubSTablePassRspCallBack, this);
    },

    _onClubSTablePassRspCallBack(data){
        if (data.nRlt == 0){
            if (this._data && this._data.callBack){
                this._data.callBack(this.passwordStr);
            }
            this.OnClickClose();
        
        }else{
            UIFrame.showTips('房间密码错误，请重新输入');
        }
    },

    //获取密码校验信息
    goConfirmPassword(password) {
        this.passwordStr = password;
        let CMD = require("protocol_club");
        let gameIds = [125, 126, 175]
        let params = {
            sTableId: this._data.sTableId,
            nPass: Base64.encode(password),
        }
        cc.warn("[密码房] 验密码 sTableId:", this._data.sTableId, "|明文密码:", password, "|Base64后:", Base64.encode(password), "|params:", JSON.stringify(params));
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSTablePassReq_CMD, params);
    },

    init(data){
        this._data = data;
        if (data.title){
            this.label_title.string = data.title;
        }
    },
    
    OnClickClose(){
        this.node.destroy();
    },

    OnClickCertain() {
        let str = this.editBox.string;
        if (str == "" || str.length != 6 || !str){
            UIFrame.showTips("请输入正确的6位数字密码");
            return;
        }
        this.goConfirmPassword(str);
    },


    onEditingDidBegin(){
        let str = this.editBox.string;
        let len = str.length;

        if (len != 6){
            this.cursor.active = true;
        }
    },

    onEditDidReturn(){
        this.cursor.active = false;
    },

    
    onEditTextChanged(text, editbox, customEventData){
        let str = this.editBox.string;
        let len = str.length;
        for (let i = 0; i < this.labelList.length; i++) {
            let label = this.labelList[i];
            if (label){
                if (str[i]){
                    label.string = str[i];
                }else{
                    label.string = "";
                }
                
            }

            if (i == len){
                this.cursor.x = label.node.x;
                this.cursor.active = true;
            }

            if (this.labelList.length == len){
                this.cursor.active = false;
                this.OnClickCertain();
            }
            
        }
    },

    onClickEditbox(){
        // this.editBox.blur();
        // this.scheduleOnce(() => {
        //     this.editBox.focus();
        // }, 0.1);
        this.editBox.focus();
        let str = this.editBox.string;
        let len = str.length;

        if (len != 6){
            this.cursor.active = true;
        }
    },

});
