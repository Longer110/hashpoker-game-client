// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let i18n = require("i18n");
let UserInfo = require("UserInfo");
let Utils = require("Utils");
let CMD = require("protocol_club");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let Base64 = require("base64");
let HallClubCacheData = require("HallClubCacheData");
let UIFrame = require("UIFrame");
let Msg_login = require('Msg_login');
let HEAD_SIZE = 118;
let HallClubControl = require("HallClubControl");

cc.Class({
    extends: cc.Component,

    properties: {
        head: cc.Sprite,
        editBox1: cc.EditBox,//输入玩家昵称
        editBox2: cc.EditBox,//输入手机号
        editBox3: cc.EditBox,//输入个性签名
        toggle1: cc.Toggle,
        toggle2: cc.Toggle,
        inputCount1: cc.Label,
        inputCount3: cc.Label,
        myGold: cc.Label,
        costGold: cc.Label,
        changeHeadNode: cc.Node,
        label_tip: cc.Label,
        systemHead: cc.Prefab,
        tips: cc.Node,
        oldName: cc.Label,
        newName: cc.Label,
        leftTimes: cc.Label,
        changePirce: cc.Label,
        sureChangePrice: cc.Label,
        freeCostTip: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.regiester();
        this.getClubConfig();
        //直播APP消息交互
        this._onAppMessage = this._onMessage.bind(this);

        //app集成lib sdk
        if (cc.sys.isNative) {
            //设置原生消息交互回调
            qygameengine.MessageManager.getInstance().setOtherCallback(this._onAppMessage);
        }
        this.initNoSpace()
        //this.editBox1.node.on('editing-did-began', this._onEditingDidBegan, this);
    },

    // update (dt) {},

    onDestroy() {
        MsgManager.un(this._onChangeUserInfo);
        MsgManager.un(this._getClubConfig);
        MsgManager.un(this.onCorrCapital);
        MsgManager.un(this._onClubSNameCountNotify);
        if (cc.sys.isNative && qygameengine && qygameengine.MessageManager.getInstance().clearOtherCallback) {
            //设置原生消息交互回调
            qygameengine.MessageManager.getInstance().clearOtherCallback();

        }


    },

    regiester() {
        MsgManager.on(MSG.NOTIFY.ClubSChangeUserInfoResp_ui, this._onChangeUserInfo, this);
        MsgManager.on(MSG.NOTIFY.ClubSGetClubConfigResp_ui, this._getClubConfig, this);
        MsgManager.on(Msg_login.GATEWAY.SUB_CORR_CAPITAL, this.onCorrCapital, this);//网关金币更新
        MsgManager.on(MSG.NOTIFY.ClubSUserInfoChangeNotify_ui, this._onChangeUserInfo, this);

        MsgManager.on(MSG.NOTIFY.ClubSNameCountNotify_ui, this._onClubSNameCountNotify, this);//改名次数通知
    },

    _onMessage(result) {
        QYLogs.warn("ClubHead", "------------获取上传头像返回的图片数据----------result = " + result);
        if (cc.isValid(this.changeHeadNode)) {
            this.changeHeadNode.active = false;
        }

        if (!result) {
            return;
        }

        let resultData = JSON.parse(result);
        if (!resultData || resultData.key != "IMAGE_PICKER_KEY") {
            return;
        }

        let path = resultData.result;
        if (!path || !jsb || !jsb.fileUtils.isFileExist(path)) {
            return;
        }

        let data = jsb.fileUtils.getDataFromFile(path);
        let url = "https://platform.deaizhou.com/api/ImageFileManage/UploadImage" + "?UserID=" + UserInfo.getInfo().nUserID;

        if (window.ChannelConfig.SERVER_UPLOAD_HEAD && window.ChannelConfig.SERVER_UPLOAD_HEAD.length > 0) {
            let item = window.ChannelConfig.SERVER_UPLOAD_HEAD[0];
            url = item.HEAD + "://" + item.HOST + "?UserID=" + UserInfo.getInfo().nUserID;
        }

        QYLogs.warn("ClubHead URL= ", url)

        let method = "post";
        var xhr = cc.loader.getXMLHttpRequest(),
            errInfo = 'Load ' + url + ' failed!',
            navigator = window.navigator;
        xhr.open(method, url, true);

        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "application/octet-stream;charset=UTF-8");
        }
        xhr.setRequestHeader('Content-Type', 'application/octet-stream');

        if (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 0) {
                        QYLogs.warn("ClubHead", xhr.responseText)
                        let data = JSON.parse(xhr.responseText);
                        QYLogs.warn("ClubHead", data)
                        if (data.msg) {
                            UIFrame.showTips(i18n.t("CLUB_ERROR.UPLOAD_HEAD_SUCCESS"));
                            this.changeFace(data.msg.completeFilePath);
                            if (cc.isValid(this.head)) {
                                // Utils.changeUserHead(this.head, data.msg.completeFilePath, app.ClubAssets);
                            }
                        }
                    }
                    else {
                        UIFrame.showTips(i18n.t("CLUB_ERROR.UPLOAD_HEAD_FAILED"));
                        QYLogs.warn("ClubHead_error", xhr.status, errInfo);
                    }
                }
            }.bind(this);
        } else {
            if (xhr.overrideMimeType) xhr.overrideMimeType('text\/plain; charset=utf-8');
            xhr.onload = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 0) {
                        QYLogs.warn("ClubHead", xhr.responseText)
                        let data = JSON.parse(xhr.responseText);
                        QYLogs.warn("ClubHead", data)
                        if (data.msg) {
                            UIFrame.showTips(i18n.t("CLUB_ERROR.UPLOAD_HEAD_SUCCESS"));
                            this.changeFace(data.msg.completeFilePath);
                            if (cc.isValid(this.head)) {
                                // Utils.changeUserHead(this.head, data.msg.completeFilePath, app.ClubAssets);
                            }
                        }
                    }
                    else {
                        UIFrame.showTips(i18n.t("CLUB_ERROR.UPLOAD_HEAD_FAILED"));
                        QYLogs.warn("ClubHead_error", xhr.status, errInfo);
                    }
                }
            }.bind(this);
            xhr.onerror = function () {
                UIFrame.showTips(i18n.t("CLUB_ERROR.UPLOAD_HEAD_FAILED"));
            };
        }
        xhr.send(data);
    },

    init(data, callback) {
        this._data = data;
        this.initUI(data);
        this.callback = callback;
    },

    initUI(data) {
        if (!data) {
            return;
        }
        this._data = data
        this.editBox1.string = Base64.decode(data.sName);
        this.inputCount1.string = this.editBox1.string.length + "/" + this.editBox1.maxLength;
        if (data.sPhone) {
            this.editBox2.string = data.sPhone;
        } else {
            this.editBox2.string = "";
            this.editBox2.placeholder = i18n.t("CLUB_HALL.INPUT_PHONE")
        }
        // Utils.changeUserHead(this.head, data.sFaceId, app.ClubAssets)

        if (data.nSex == 0) {
            //男
            this.toggle1.isChecked = true;
            this.toggle2.isChecked = false;
        } else if (data.nSex == 1) {
            //女
            this.toggle1.isChecked = false;
            this.toggle2.isChecked = true;
        }

        if (data.sPersonality != "") {
            this.editBox3.string = Base64.decode(data.sPersonality);
            this.inputCount3.string = this.editBox3.string.length + "/" + this.editBox3.maxLength;
        } else {
            this.editBox3.placeholder = i18n.t("CLUB_HALL_TIP.INPUT_SIGNATURE");
            this.inputCount3.string = "0" + "/" + this.editBox3.maxLength;
            this.editBox3.string = "";
        }

        this.myGold.string = Utils.convertNumberToStr(data.nGold);

        this.leftTimes.string = i18n.t("HALL_CHANGE_NAME.4").replace("XXX", data.nFreeCount + "");
        if (data.nPrice > 0) {
            this.changePirce.node.parent.active = true;
            this.changePirce.string = Utils.convertNumberToStr(data.nPrice);
        }
        else {
            this.changePirce.node.parent.active = false;
        }
    },

    //获取俱乐部配置
    getClubConfig() {
        let params = {
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSGetClubConfigReq_CMD, params);
    },

    onClickEditHead() {
        //编辑头像
        // if (cc.sys.isNative){
        //     if(qygameengine.PlatformCommon.openPhoto){
        //         let path = jsb.fileUtils.getWritablePath()
        //         qygameengine.PlatformCommon.openPhoto(118, path, "head");
        //     }
        // }
        // HallClubControl.requestCheckSecurityPsw('editHead', {}, this.onClickChangeHead.bind(this), this.cancelChangeInfo.bind(this));
    },

    onEditBoxTouchBegin(event, customEventData) {
        let color = new cc.Color(255, 255, 255, 255);
        event.textLabel.node.color = color;
    },

    onEditBoxTextChange(str, event, customEventData) {
        let index = Number(customEventData);
        if (index == 1) {
            this.inputCount1.string = str.length + "/" + event.maxLength;
        } else if (index == 3) {
            this.inputCount3.string = str.length + "/" + event.maxLength;
        }
    },

    onClickChangeName() {
        this.setEditBoxColor(this.editBox1.textLabel);
    },

    onClickChangePhone() {
        this.setEditBoxColor(this.editBox2.textLabel);
    },

    onClickChangeSignatrue() {

    },

    setEditBoxColor(editBox) {
        let color = new cc.Color(148, 147, 152, 255);
        editBox.node.color = color;
    },

    onClickSave() {
        this.onShowTips();
    },


    initNoSpace() {
        this.editBox1.node.on('editing-did-ended', () => {
            const original = this.editBox1.string;
            const cleaned = original.replace(/[\s\u3000]/g, ''); // 去掉空格和全角空格

            if (cleaned !== original) {
                this.editBox1.string = cleaned; // 重新赋值
            }
        });

    },



    onClickSaveSend() {
        let params = { arrChange: [] };
        let isChange = false;
        let strName = this.editBox1.string;
        if (strName == "") {
            UIFrame.showTips(i18n.t("CLUB_HALL.INPUT_NAME"));
            return;
        }

        // 如果去掉所有空白（包括普通空格、全角空格等）后为空，则视为全是空格
        if (strName.replace(/[\s\u3000]/g, '') === "") {
            UIFrame.showTips(i18n.t("CLUB_HALL.INPUT_EMPTY"));
            return;
        }

        if (strName != "" && (strName.length < 2) || strName.length > 20) {
            UIFrame.showTips(i18n.t("CLUB_ERROR.USER_NAME_LEN"));
            return;
        }

        if (strName != Base64.decode(this._data.sName)) {
            let tmp = {}
            tmp.sKey = "sName";
            tmp.sVal = Base64.encode(strName);
            params.arrChange.push(tmp);
            isChange = true;
        }
        else {
            UIFrame.showTips(i18n.t("CLUB_HALL.INPUT_SAME"));
            return;
        }

        // let strPhone = this.editBox2.string;
        // if (strPhone != "" && (!Number(strPhone) || strPhone.length != 11 )){
        //     UIFrame.showTips(i18n.t("CLUB_HALL.INPUT_PHONE"));
        //     return;
        // }

        // if (strPhone != "" && strPhone != this._data.sPhone){
        //     let tmp = {}
        //     tmp.sKey = "sPhone";
        //     tmp.sVal = strPhone;
        //     params.arrChange.push(tmp);
        //     isChange = true;
        // }



        // let str = this.editBox3.string;

        // if (str != Base64.decode(this._data.sPersonality)){
        //     let tmp = {}
        //     tmp.sKey = "sPersonality";
        //     tmp.sVal = Base64.encode(str);
        //     params.arrChange.push(tmp);
        //     isChange = true;
        //     // 
        //     // // this.changeUserInfo(params);
        // }

        //  let nSex = "0";
        // if (this.toggle2.isChecked){
        //     nSex = "1";
        // }

        // if (nSex != this._data.nSex){
        //     let tmp = {}
        //     tmp.sKey = "nSex";
        //     tmp.sVal = nSex;
        //     params.arrChange.push(tmp);
        //     isChange = true;
        // }

        if (!isChange) {
            this.onClickClose();
            return;
        }

        this.changeUserInfo(params)
        // HallClubControl.requestCheckSecurityPsw('changeInfo', params, this.changeUserInfo.bind(this), this.cancelChangeInfo.bind(this));

    },

    onClickChangeHead(data) {
        if (!data) {
            return;
        }
        this.changeHeadNode.active = true;
        this.changeHeadNode.active = false;
    },

    onClickCloseChangeHead() {
        this.changeHeadNode.active = false;
    },

    onClickOpenPhoto() {
        if (cc.sys.isNative) {
            if (qygameengine.PlatformCommon.openPhoto) {
                let path = jsb.fileUtils.getWritablePath()
                qygameengine.PlatformCommon.openPhoto(HEAD_SIZE, path, "head");
            }
        }
    },

    onClickTakePhoto() {
        if (cc.sys.isNative) {
            if (qygameengine.PlatformCommon.takePhoto) {
                let path = jsb.fileUtils.getWritablePath()
                qygameengine.PlatformCommon.takePhoto(HEAD_SIZE, path, "head");
            }
        }
    },

    onClickSystemPhoto() {
        let node = cc.instantiate(this.systemHead);
        this.node.addChild(node);
        let com = node.getComponent("LoginRegSystemHead");
        if (com) {
            com.init(this, this._data.sFaceId);
        }

        this.onClickCloseChangeHead();
    },

    setSpHead(head) {
        this.changeFace(head + '');
    },

    //修改头像
    changeFace(sFaceId) {
        let params = { arrChange: [] };
        let tmp = {}
        tmp.sKey = "sFaceId";
        tmp.sVal = sFaceId;
        params.arrChange.push(tmp);
        this.changeUserInfo(params)

        // this.getMyInfo();
        if (this.callback && this._data) {
            this._data.sFaceId = sFaceId;
            this.callback(this._data);
        }

        UserInfo.setInfo({
            strHeadUrl: sFaceId,
        })
    },

    getMyInfo() {
        let params = {
            nUserId: UserInfo.getInfo().nUserID,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSUserInfoReq_CMD, params);
    },

    cancelChangeInfo() {
        this.initUI(this._data)
    },

    changeUserInfo(data) {
        this.changeInfo = data.arrChange;
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSChangeUserInfoReq_CMD, data);
    },

    onClickToggle(event, data) {
        //点击性别
        // let index = Number(data);
        // let params = {arrChange: []};
        // if (index == 1){
        //     //男
        //     let nSex = "0";
        //     if (nSex != this._data.nSex){
        //         let tmp = {}
        //         tmp.sKey = "nSex";
        //         tmp.sVal = nSex;
        //         params.arrChange.push(tmp);
        //         HallClubControl.requestCheckSecurityPsw('nSex', params, this.changeUserInfo.bind(this), this.cancelChangeInfo.bind(this));
        //         // this.changeUserInfo(params);
        //     }
        // }else{
        //     //女
        //     let nSex = "1";
        //     if (nSex != this._data.nSex){
        //         let tmp = {}
        //         tmp.sKey = "nSex";
        //         tmp.sVal = nSex;
        //         params.arrChange.push(tmp);
        //         HallClubControl.requestCheckSecurityPsw('nSex', params, this.changeUserInfo.bind(this), this.cancelChangeInfo.bind(this));
        //         // this.changeUserInfo(params);
        //     }
        // }
    },

    onClickClose() {
        this.node.destroy();
    },

    _onChangeUserInfo(data) {
        if (data.nRlt == 0) {
            let isChangeHead = false;
            UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_SUCCESS"));
            for (let i = 0; i < this.changeInfo.length; i++) {
                let tmp = this.changeInfo[i];
                if (this._data.hasOwnProperty(tmp.sKey)) {
                    this._data[tmp.sKey] = tmp.sVal;
                }

                if (tmp.sKey == "sName") {
                    UserInfo.setInfo({
                        strNickName: Base64.decode(tmp.sVal),
                    })
                }

                if (tmp.sKey == "sFaceId") {
                    isChangeHead = true;
                    // Utils.changeUserHead(this.head, tmp.sVal, app.ClubAssets)
                }

            }

            if (this.callback) {
                this.callback(this._data);
            }

            if (!isChangeHead) {
                this.onClickClose();
            }

        } else {
            if (!data.arrRlt) {
                return
            }
            for (let i = 0; i < data.arrRlt.length; i++) {
                if (data.arrRlt[i].nRlt == 1) {
                    UIFrame.showTips(i18n.t("CLUB_ERROR.DATA_ERROR"));
                    break;
                } else if (data.arrRlt[i].nRlt == 2) {
                    UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_USER_INFO1"));
                    break;
                } else if (data.arrRlt[i].nRlt == 3) {
                    UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_USER_INFO2"));
                    break;
                } else if (data.arrRlt[i].nRlt == 4) {
                    if (data.arrRlt[i].sKey == "sPersonality") {
                        UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_USER_INFO8"));
                    } else if (data.arrRlt[i].sKey == "sName") {
                        UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_USER_INFO7"));
                    } else {
                        UIFrame.showTips(i18n.t("CLUB_ERROR.LOGIN_PSW_ERROR2"));
                    }

                    break;
                } else if (data.arrRlt[i].nRlt == 5) {
                    UIFrame.showTips(i18n.t("CLUB_ERROR.USER_NAME_LEN"));
                    break;
                } else if (data.arrRlt[i].nRlt == 6) {
                    if (data.arrRlt[i].sKey == "sPersonality") {
                        UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_USER_INFO5"));
                    } else {
                        UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_USER_INFO3"));
                    }

                    break;
                } else if (data.arrRlt[i].nRlt == 7) {
                    if (data.arrRlt[i].sKey == "sPersonality") {
                        UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_USER_INFO6"));
                    } else {
                        UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_USER_INFO4"));
                    }

                    break;
                } else if (data.arrRlt[i].nRlt == 8) {
                    UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_USER_INFO4"));
                    break;
                } else if (data.arrRlt[i].nRlt == 9) {
                    UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_NAME_ERROR1"));
                    break;
                } else if (data.arrRlt[i].nRlt == 10) {
                    UIFrame.showTips(i18n.t("CLUB_ERROR.SECURITY_CODE_ERROR"));
                    break;
                } else if (data.arrRlt[i].nRlt == 11) {
                    UIFrame.showTips(i18n.t("CLUB_ERROR.SECURITY_CODE_ERROR1"));
                    break;
                } else if (data.arrRlt[i].nRlt == 12) {
                    UIFrame.showTips(i18n.t("CLUB_ERROR.SECURITY_CODE_ERROR2"));
                    break;
                }
            }

            this.initUI(this._data)

        }

        this.changeInfo = [];
    },

    _getClubConfig(data) {
        let config = JSON.parse(data.sClubConfig);
        if (config.tChangeName && config.tChangeName.nItemId == 1) {
            let str = i18n.t("CLUB_HALL_TIP.CHANGE_NAME_COST");
            str = Utils.replaceAll(str, "SSS", config.tChangeName.nCount);
            this.costGold.string = Utils.convertNumberToStr(config.tChangeName.nCount);
            this.label_tip.string = str;
        }
    },

    _onClubSNameCountNotify(data) {
        this.initUI(data);
    },

    onCorrCapital(data) {
        this.myGold.string = Utils.convertNumberToStr(data.nGold);
        this._data.nGold = data.nGold;
        if (this.callback) {
            this.callback(this._data);
        }
    },

    onShowTips() {
        if (this._data.nFreeCount <= 0) {
            UIFrame.showTips(i18n.t("HALL_CHANGE_NAME.5"));
            return;
        }
        this.oldName.string = Base64.decode(this._data.sName);
        this.newName.string = this.editBox1.string;
        if (this._data.nPrice > 0) {
            this.sureChangePrice.node.parent.active = true;
            this.freeCostTip.node.active = false;
            this.sureChangePrice.string = Utils.convertNumberToStr(this._data.nPrice);
        }
        else {

            this.sureChangePrice.node.parent.active = false;
            this.freeCostTip.node.active = true;
            this.freeCostTip.string = i18n.t("HALL_CHANGE_NAME.6");
        }
        this.tips.active = true;
    },

    onCloseTips() {
        this.tips.active = false;
    },

    onTipsSendChange() {
        this.tips.active = false;
        this.onClickSaveSend();
    },

    onEditChanged(str, event, customEventData) {
        if(str) {
            let text = this.getShortText(str);
            this.editBox1.string = text;
        }
    },

    getShortText(text) {
        if (!text) return '';

        const isChinese = c => /[^\x00-\xff]/.test(c);

        // 混合：按字节数取前最大12个字节
        let byteLen = 0;
        let result = '';

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const charBytes = isChinese(char) ? 2 : 1;

            if (byteLen + charBytes > 12) break; // 超过 12 字节就停止
            result += char;
            byteLen += charBytes;
        }

        return result
    },

});
