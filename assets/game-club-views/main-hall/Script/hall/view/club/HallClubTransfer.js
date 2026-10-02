// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//转账
let i18n = require("i18n");
let TAG = "club_member_transfer";
let Utils = require("Utils");
let HallClubCacheData = require("HallClubCacheData");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let CMD = require("protocol_club");
let Base64 = require("base64");
let UserInfo = require("UserInfo");
let UIFrame = require("UIFrame");

cc.Class({
    extends: cc.Component,

    properties: {

        label_id: {
            default: null,
            type: cc.Label
        },

        headSp: {
            default: null,
            type: cc.Sprite
        },

        label_Name: {
            default: null,
            type: cc.Label
        },

        btn_max: {
            default: null,
            type: cc.Button
        },

        btn_transfer: {
            default: null,
            type: cc.Button
        },

        label_count: {
            default: null,
            type: cc.Label
        },

        inputPassword: cc.Prefab,
        editBox: cc.EditBox,
        content: cc.Node,

        _clubId: 0,
        _nToUserId: 0,
        _sToName: "",
        _sToFaceId: 0,
        _nClubId: 0,
        _nMaxCount: 0,
        _nMyUserId: 0,

    },
    onLoad() {
        MsgManager.on(MSG.NOTIFY.ClubSGoldTransToUserRsp_ui, this._onTransBack, this);
        this.playEnterAni()
    }, 

    start() {
        this._clubId = HallClubCacheData.getCurLoginClub();
        Utils._fixNumericEditBox(this.editBox)
    },


    // update (dt) {},

    onDestroy() {
        MsgManager.un(this._onTransBack)
    },

    // update (dt) {},

    init(data) {
        if (data) {
            this._nToUserId = data.nToUserId
            this._sToName = data.sToName
            this._sToFaceId = data.sToFaceId
            this._nClubId = data.nClubId
            this._nMaxCount = data.nMaxCount
            this._nMyUserId = data.nMyUserId
        }
        //console.log("==========传过来的数据===检测一下==========",data)

        this.label_id.string = 'ID:' + this._nToUserId.toString()
        this.label_count.string = this._nMaxCount.toString()

        if (this._sToName) {
            this.label_Name.string = Utils.getShortText(this._sToName, 12)
        }
        if (this._sToFaceId) {
            Utils.changeUserHead(this.headSp, this._sToFaceId, app.ClubAssets);
        }
    },

    onClickClose() {
        //console.log("==============删除转账界面===================")
        this.node.destroy();
    },

    onMaxBtnClicked() {
        //console.log("==============转账最大===================")
        if (this._nMaxCount) {
            this.editBox.string = this._nMaxCount.toString()
        } else {

        }

    },

    onEditChanged(event) {
        if (event.string) {
            let num = Math.floor(Number(event.string) * 10) / 10;
            this.editBox.string = num.toString();
            if (this._nMaxCount == 0) {
                this.editBox.string = "0"
                UIFrame.showTips('您的余额不足，无法发红包!')
                return
            }
            if (this._nMaxCount && num > this._nMaxCount) {
                this.editBox.string = this._nMaxCount.toString()
                return
            }
        }
    },

    onTransferBtnClicked() {
        //console.log("==============转账按钮点击===================")
        //输入支付密码
        let str = this.editBox.string;

        if (this._nMaxCount == 0) {
            UIFrame.showTips('您的余额不足，无法发红包!')
            return
        }

        if (!str) {
            UIFrame.showTips('请输入红包数量!')
            return
        }

        let reg = new RegExp('[0-9.]*')
        if (!reg.test(str) || Number(str) <= 0) {
            UIFrame.showTips('请输入正确的红包数量!')
            return
        }


        // if(this.inputPassword) {
        //     let obj = cc.instantiate(this.inputPassword)
        //     this.node.addChild(obj)
        //     obj.getComponent('HallMyInputPayPassword').setData(this)
        // }

        //内部转账不需要密码
        this.onInputPayPassword(null)
    },


    //支付密码确定回调，转币协议
    onInputPayPassword(password) {
        let params = {
            nUserId: this._nToUserId,
            nAmount: Number(this.editBox.string),
            nName: this._sToName
        }
        params.nPassWord = password ? Base64.encode(password) : null;
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSGoldTransToUserReq_CMD, params);
    },

    _onTransBack(data) {
        if (!data) return;
        if (data.nRlt == 0) {
            UIFrame.showTips('发送红包成功!')
            this._requestUserInfo()
            this.onClickClose()
        } else if (data.nRlt == 1) {
            UIFrame.showTips('发送红包失败!')
        } else if (data.nRlt == 2) {
            UIFrame.showTips('余额不足!')
        } else if (data.nRlt == 3) {
            UIFrame.showTips('支付密码错误!')
        } else if (data.nRlt == 4) {
            UIFrame.showTips('未开启红包功能!')
        }
    },

    _requestUserInfo() {
        let params = {
            nUserId: UserInfo.getInfo().nUserID,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSUserInfoReq_CMD, params);
    },

    //页面从顶部弹出动画
    playEnterAni() {
        this.content.y = -cc.winSize.height;
        this.content.runAction(cc.moveTo(0.3, cc.v2(0, -381)).easing(cc.easeCubicActionOut()));
    }
});
