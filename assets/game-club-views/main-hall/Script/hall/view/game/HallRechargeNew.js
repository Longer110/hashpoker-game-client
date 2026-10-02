
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
        qrcodeDetails: cc.Node,
        selectHostNetPrefab: {
            default: null,
            type: cc.Prefab
        },

        selectHostNetText: {
            default: null,
            type: cc.Label
        },

        coinAdderss: {
            default: null,
            type: cc.Label
        },

        rechargeDetails: cc.Node,
        detailsAddress: cc.Label,

        prefabBill: cc.Prefab,

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
        let contentNode = this.node.getChildByName("bg").getChildByName("ScrollView").getChildByName("view").getChildByName("content");
        let hostNetNode = contentNode.getChildByName("selectHostNet");
        let selectData = this.arrAddressList[this.selectIndex] || {};
        if (hostNetNode) {
            let textNode = hostNetNode.getChildByName("name");
            if (textNode) {
                textNode.getComponent(cc.Label).string = selectData.strMainNet || "TRON-TRC20";
            };
        };
        let limitCoinNode = contentNode.getChildByName("limitCoin");
        if (limitCoinNode) {
            let textNode = limitCoinNode.getChildByName("value");
            if (textNode) {
                textNode.getComponent(cc.Label).string = (selectData.nMinTopup || 9) + " USDT";
            }
        };

        let netCostNode = contentNode.getChildByName("netCost");
        if (netCostNode) {
            let textNode = netCostNode.getChildByName("value");
            if (textNode) {
                textNode.getComponent(cc.Label).string = (selectData.nInputCompileTime || 1) + "次区块确认";
            }
        };

        let withdrawalUnlockNode = contentNode.getChildByName("withdrawalUnlock");
        if (withdrawalUnlockNode) {
            let textNode = withdrawalUnlockNode.getChildByName("value");
            if (textNode) {
                textNode.getComponent(cc.Label).string = (selectData.nOutputCompileTime || 1) + "次区块确认";
            }
        };

        let contractAddressNode = contentNode.getChildByName("contractAddress");
        if (contractAddressNode) {
            let textNode = contractAddressNode.getChildByName("value");
            if (textNode) {
                let strContractAddres = selectData.strContractAddres || "";
                strContractAddres = strContractAddres.substring(0, 6) + "..." + strContractAddres.substring(strContractAddres.length - 6);
                textNode.getComponent(cc.Label).string = strContractAddres || "";
            }
        };

        let detailsContentNode = this.rechargeDetails.getChildByName("content");
        let detailNet = detailsContentNode.getChildByName("net");
        if (detailNet) {
            detailNet.getComponent(cc.Label).string = selectData.strMainNet || "TRON-TRC20";
        };

        let address = detailsContentNode.getChildByName("address");
        if (address) {
            address.getComponent(cc.Label).string = this._address || "";
        };

    },

    OnClickClose(){
        this.node.destroy();
    },

    OnClickDetailsClose() {
        this.rechargeDetails.active = false
    },

    OnClickSure() {
        this.rechargeDetails.active = true
        this.updateDetailsQRcode(this._address)
        let detailsContentNode = this.rechargeDetails.getChildByName("content");
        Utils.copyToClipBoard(this._address)
        //延迟1秒关闭
        setTimeout(async () => {
            let ShareUtil = require("ShareUtil");
            let strMainNet = 'TRON-TRC20';
            if(this.arrAddressList && this.arrAddressList.length > 0) {
                strMainNet = this.arrAddressList[this.selectIndex]?.strMainNet || 'TRON-TRC20';
            }
            let shareText = '充币地址：' + this._address + '\n主网：' + (strMainNet || 'TRON-TRC20');
            ShareUtil.shareToTelegram(detailsContentNode, shareText)
            .catch(error => {
                cc.error('分享过程出错:', error);
            });
            // try {
            //     let ScreenshotUtil = require("ScreenshotUtil");
            //     let ShareUtil = require("ShareUtil");
            //     // 1. 截图
            //     const canvas = ScreenshotUtil.captureNode(detailsContentNode);
                
            //     // 2. 尝试调起系统分享
            //     const shareSuccess = await ShareUtil.shareToTelegram(canvas, '我的游戏截图', '快来看看我的游戏成就！');
                
            //     if (!shareSuccess) {
            //         cc.log('系统分享不可用，已触发截图下载。');
            //     }
            // } catch (error) {
            //     cc.error('截图或分享过程出错:', error);
            //     // 出错时也尝试提供下载
            //     ShareUtil.downloadScreenshot(canvas);
            // } finally {
            //     // 3. 关闭详情界面
            // }
        }, 1000);
    },

    OnClickSelectUSDT(){
        // UIFrame.showTips("只能选择USDT");
    },

    OnClickHostNet(){


        if (this.arrAddressList && this.arrAddressList.length > 0) {
            let hostNetNode = this.addUI(this.selectHostNetPrefab)
            let dataItem = {}
            let listData = []
            for (let index = 0; index < this.arrAddressList.length; index++) {
                let item = this.arrAddressList[index];
                dataItem.name = item.strMainNet || "";
                dataItem.count =  index;
                dataItem.minCoin =  item.nMinTopup || 0;
                dataItem.open =  true;
                dataItem.strContractAddres = item.strContractAddres || "";
                dataItem.nInputCompileTime = item.nInputCompileTime || 0;
                dataItem.nOutputCompileTime = item.nOutputCompileTime || 0;
                listData.push(dataItem);
                
            }

            // TODO ：请求数据。打开界面
            let component = hostNetNode.getComponent("selectHostNetPanel");
            if (component) {
                component.updateView({data:listData,selectIndex:this.selectIndex,title:"选择主网",selectType:1}, this.updateHotNetText.bind(this));
            }
        };
        // let testDataItem = {name: "TRON-TRC20",count: 1, minCoin : 200, open:false}
        // let testData = []
        // for (let index = 0; index < 10; index++) {
        //     testDataItem.name = "TRON-TRC20" + index
        //     testDataItem.count =  index
        //     testDataItem.minCoin =  index * 30
        //     testDataItem.open =  (index % 2) == 0
        //     testData.push(testDataItem)
            
        // }



    },

    updateHotNetText(index){
        this.selectIndex = index;
        this.updateUI();
        // let selectData = this.arrAddressList[this.selectIndex] || {};
        // let text = selectData.strMainNet || "TRON-TRC20";
        // this.selectHostNetText.text =  text + " ";
    },


    showCoinAdderss(address) {
        this.coinAdderss.string = address
        this.updateQRcode(address)
    },

    updateQRcode(url) {
        let qrcode = this.qrcodeNode?.getComponent('HallQRCodeUI')
        if(qrcode && url) qrcode.init(url)
    },

    updateDetailsQRcode(url) {
        let qrcode = this.qrcodeDetails?.getComponent('HallQRCodeUI')
        if(qrcode && url) qrcode.init(url)
    },

    OnClickCopyAddress() {
        Utils.copyToClipBoard(this._address)
    },

    
    //账单记录
    OnClickToRecord() {
        let prefab = this.prefabBill
        if (prefab) {
            let node = cc.instantiate(prefab);
            this.getAddNode().addChild(node, 1024);
            node.getComponent('HallMyBill').init(null, 0)
        }
    },

    
    getAddNode() {
        return this.node
    },

    addUI(prefab){
        let node = cc.instantiate(prefab);
        this.node.addChild(node);
        return node;
    },
});
