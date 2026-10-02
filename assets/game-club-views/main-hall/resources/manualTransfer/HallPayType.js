// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let i18n = require("i18n");
let CMD = require("protocol_club");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let Base64 = require("base64");
let UserInfo = require("UserInfo");
let UIFrame = require("UIFrame");
let HallClubLogic = require("HallClubLogic");

cc.Class({
    extends: cc.Component,

    properties: {
        HallRCPay: cc.Prefab,
        HallWithdraw: cc.Prefab,
        panel: cc.Node,
        title: cc.Label,
        item: cc.Node,
        listPanel: cc.Node,

        scrollview: cc.ScrollView,
        scContent: cc.Node,
        menuItem: cc.Node,

        _curSelArea: -1,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
    },

    // update (dt) {},

    onDestroy() {
        this.unRegiester();
    },

    unRegiester(){
        MsgManager.un(this._onTrCallback);
    },

    regiester(){
        MsgManager.on(MSG.NOTIFY.ClubTransferWayRsp_ui, this._onTrCallback, this);
    },

    //配置信息
    _onTrCallback(data){
        let info = JSON.parse(data.sInfos || "[]"); //地区信息，包括充值和提现额度、汇率、币种
        this.initInfo(info);
        let wayInfo = JSON.parse(data.nWayInfo || "[]");
        this.initData(wayInfo);
        this._curSelArea = -1;
        this.initMenu();
    },

    getDataByArea(area){
        if (!this._areaInfo){
            return;
        }
        for (const key in this._areaInfo) {
            if (this._areaInfo.hasOwnProperty.call(this._areaInfo, key)) {
                let info = this._areaInfo[key];
                if (info != "" && info.id == area){
                    return info;
                }
            }
        }

        return;
    },

    initInfo(info){
        this._areaInfo = [];
        for (const key in info) {
            if (info.hasOwnProperty.call(info, key) && info[key] != "") {
                let tmpArray = JSON.parse(info[key]);
                this._areaInfo.push(tmpArray); 
                
            }
        }
    },

    initData(data){
        let info = [];
        for (const key in data) {
            if (data.hasOwnProperty.call(data, key) && data[key] != "") {
                let tmpArray = JSON.parse(data[key]);
                let areaInfo = this.getDataByArea(tmpArray.area);
                if (areaInfo){
                    tmpArray.currency = areaInfo.Currency;
                    tmpArray.rate = areaInfo.Rate;
                    tmpArray.minRecharge = areaInfo.MinRecharge;
                }
                info.push(tmpArray);
            }
        }

        this._wayInfo = [];
        let tmpArray = [];
        let curArea = -1;
        let areaName = "";

        info.sort(function(a, b){
            return a.area - b.area;
        })

        for (let i = 0; i < info.length; i++) {
            if (curArea != -1){
                if (curArea == info[i].area){
                    tmpArray.push(info[i]);
                }else{
                    this._wayInfo.push({area: curArea, areaName: areaName, info: tmpArray});
                    tmpArray = [];
                    tmpArray.push(info[i]);
                    curArea = info[i].area;
                    areaName = info[i].areaName;
                }
            }else{
                tmpArray.push(info[i]);
                curArea = info[i].area;
                areaName = info[i].areaName;
            }

            if (i == info.length - 1){
                this._wayInfo.push({area: curArea, areaName: areaName, info: tmpArray});
            }
        }
    },

    initMenu(){
        let length = this._wayInfo.length;
        let width = length * this.menuItem.width + 10 * length;
        if (width > this.listPanel.width){
            width = this.listPanel.width - 50;
        }
        this.scrollview.node.width = width;
        this.scrollview.node.x = 0;
        this.scrollview.node.getChildByName("view").width = width;

        for (let i = 0; i < this._wayInfo.length; i++) {
            let info = this._wayInfo[i];
            let item = cc.instantiate(this.menuItem);
            item.active = true;
            let nor = item.getChildByName("nor");
            let sel = item.getChildByName("sel");
            nor.getChildByName("label").getComponent(cc.Label).string = info.areaName || "";
            sel.getChildByName("label").getComponent(cc.Label).string = info.areaName || "";
           

            this.scContent.addChild(item);
            let call = item.getComponent(cc.Button).clickEvents[0]
            if(call){
                call.customEventData = info.area;
            }

            if (i == 0){
                this.onClickMenu({target: item}, info.area);
            }
        }

        
    },

    onClickMenu(event, customEventData){
        let area = Number(customEventData);
        if (area == this._curSelArea){
            return;
        }

        let children = this.scContent.children;
        for (let i = 0; i < children.length; i++) {
            let child = children[i];
            if (child.active){
                let nor = child.getChildByName("nor");
                let sel = child.getChildByName("sel");
                if (child == event.target){
                    sel.active = true;
                    nor.active = false;
                }else{
                    sel.active = false;
                    nor.active = true;
                }
            }
        }

        for (let i = 0; i < this._wayInfo.length; i++) {
            if (this._wayInfo[i].area == area){
                this.createList(this._wayInfo[i].info);
                break;
            }
            
        }

        this._curSelArea = area;
    },

    createList(data){
        let index = 0;
        let pNode = cc.instantiate(this.panel);
        let width = pNode.width;
        let itemWidth = this.item.width;
        let space = (width - itemWidth * 3)/4;
        this.listPanel.destroyAllChildren();

        for (let i = 0; i < data.length; i++) {
            let node = cc.instantiate(this.item);
            this.setNodeInfo(node, pNode, data[i]);
            let layout = pNode.getComponent(cc.Layout);
            if (layout){
                layout.spacingX = space;
                layout.paddingLeft = space;
                layout.paddingRight = space;
                layout.updateLayout();
            }
            index += 1;
            if (index >= 3 || i == (data.length - 1)){
                pNode.parent = this.listPanel;
                pNode = cc.instantiate(this.panel);
                index = 0;
            }
            
        }
       
    },

    setNodeInfo(node, parent, data){
        node.active = true;
        let sprite = node.getChildByName("itemIcon").getComponent(cc.Sprite);
        let label_name = node.getChildByName("label_name");
        if (sprite){
            this._loadImg(data.imgUrl, sprite);
        }

        if (label_name){
            label_name.getComponent(cc.Label).string = data.channelName;
        }

        let call = node.getComponent(cc.Button).clickEvents[0]
        if(call){
            call.customEventData = data
        }
        node.parent = parent;
    },

    _loadImg(url, spriteNode){
        if(!url){
            return;
        }

        spriteNode.node.active = false;
        cc.assetManager.loadRemote(url, function (error, texture) { 
            if (cc.isValid(spriteNode)){
                spriteNode.node.active = true;
            }
            if(error) {
                QYLogs.error("HallMyInfo", "加载资源出错: url=" + url, error);
            }
            else{
                if (cc.isValid(spriteNode)){
                    let spriteFrame = new cc.SpriteFrame(texture);
                    spriteNode.spriteFrame = spriteFrame;
                }
            }
        }.bind(this))
    },

    init(data){
        this._data = data;
        if (data.nType == 1){
            //充值
            this.title.lang = "CLUB_RECHARGE.HAND_RECHARGE";
        }else{
            //提现
            this.title.lang = "CLUB_RECHARGE.HAND_WITHDRAW";
        }

        this.unRegiester();
        this.regiester();

        let transferWay = HallClubLogic.getTransferWay();
        if (transferWay){
            this._onTrCallback(transferWay)
        }else{
            this.requestTransferWay()
        }
    },

    requestTransferWay(){
        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubTransferWayReq_CMD, {nUserId: UserInfo.getInfo().nUserID});
    },

    onClickClose(){
        this.node.destroy()
    },

    onClickBtn(event, customEventData){
        let data = customEventData;
        let params = {
            titleStr: data.channelName, 
            name: data.name,
            account: data.account,
            id: data.id,
            rate: data.rate,
            currency: data.currency,
            minRecharge: data.minRecharge,
            area: data.area,
            userInfo: this._data.userInfo
        }
        if (this._data.nType == 1){
            this.openRCPay(params);
        }else{
            this.openWithdraw(params);
        }
       
    },

    openRCPay(data){
        let node = cc.instantiate(this.HallRCPay);
        this.node.addChild(node);
        let com = node.getComponent("HallRCPay");
        if (com){
            com.init(data);
        }
    },

    openWithdraw(data){
        let node = cc.instantiate(this.HallWithdraw);
        this.node.addChild(node);
        let com = node.getComponent("HallWithdraw");
        if (com){
            com.init(data);
        }
    }


});
