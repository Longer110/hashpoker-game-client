
let i18n = require("i18n");
let Utils = require("Utils");

let MsgManager = require("MsgManager");
let HALL_CMD = require("protocol_hall");
let HALL_MSG = require("Msg_hall");
let UserInfo = require("UserInfo");
let UIFrame = require("UIFrame");

cc.Class({
    extends: cc.Component,

    properties: {
        qrcodeNode: cc.Node,

        selectHostNetText: {
            default: null,
            type: cc.Label
        },

        coinAdderss: {
            default: null,
            type: cc.Label
        },


        _address: '',
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        app.util.addClickSoundToNode(this.node);
    },

    start () {
        // this.setData({address: 'TKMUjSCUB6Lh2Hsai9kmibpMFjGFc7KacJ'})
        this.rechargeData = null;
        this.selectIndex = 0;
        this.regiester(); 
        this.getAccountPayURL();
    },

    
    onDestroy() {
        MsgManager.un(this._onGetAccountPayURLRsp);
    },

    regiester(){
        MsgManager.on(HALL_MSG.AccountPayURLRsp_CMD, this._onGetAccountPayURLRsp, this);
    },


    _onGetAccountPayURLRsp(msg) {
        if (msg.nCode == 0) {
            this.setData(msg)
        }
    },

    getAccountPayURL() {
        let params = {
            nUserId: UserInfo.getInfo().nUserID,
        }
        app.net.send(HALL_CMD.Main_CMD.value, HALL_CMD.Main_CMD.AccountPayURLReq_CMD, params)
    },

    // update (dt) {},
    
    setData(data) {
        if(data.strPayURL) {
            this.rechargeData = data;
            this.arrAddressList = data.arrAddressList || [];
            this._address = data.strPayURL;
            this.showCoinAdderss(this._address);
            this.updateUI();
        }
    },

    updateUI() {
        let contentNode = this.node.getChildByName("content");
        let hostNetNode = contentNode.getChildByName("net");
        let selectData = this.arrAddressList[this.selectIndex] || {};
        if (hostNetNode) {
            let textNode = hostNetNode.getChildByName("name");
            if (textNode) {
                textNode.getComponent(cc.Label).string = selectData.strMainNet || "TRON-TRC20";
            };
        };
    },

    OnClickClose(){
        this.node.destroy();
    },

    showCoinAdderss(address) {
        this.coinAdderss.string = address
        this.updateQRcode(address)
    },

    updateQRcode(url) {
        let qrcode = this.qrcodeNode?.getComponent('HallQRCodeUI')
        if(qrcode && url) qrcode.init(url)
    },


    OnClickCopyAddress() {
        Utils.copyToClipBoard(this._address)
    },
});
