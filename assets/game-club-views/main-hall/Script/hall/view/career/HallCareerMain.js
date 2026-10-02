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

cc.Class({
    extends: cc.Component,

    properties: {
        head: cc.Sprite,
        label_name: cc.Label,
        exp: cc.RichText,
        label_totalField: cc.Label,
        label_totalHand: cc.Label,
        label_singleField: cc.Label,
        label_singleHand: cc.Label,
        progress: cc.ProgressBar,
        slider: cc.Node,
        label_ID: cc.Label,
        noVip: cc.Node,
        vip: cc.Node,
        levelList: {
            default: [],
            type: cc.Node,
        },

        data_panel: cc.Node,
        honor_panel: cc.Node,
        record_panel: cc.Node,
        
        _prefabs: [],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        if (app.config.LANG == "en"){
            let label_title = this.node.getChildByName("content").getChildByName("top").getChildByName("label_title").getComponent(cc.Label);
            label_title.string = label_title.string.toUpperCase();
        }
        
        let isOpen = true;//cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS;
        if(this.data_panel){
            this.data_panel.active = !isOpen;
        }
        if(this.honor_panel){
            this.honor_panel.active = !isOpen;
        }

        if (isOpen){
            let dataWidget = this.data_panel.getComponent(cc.Widget);
            let recordWidget = this.record_panel.getComponent(cc.Widget);
            recordWidget.top = dataWidget.top;
            recordWidget.left = dataWidget.left;
            recordWidget.right = dataWidget.right;
            recordWidget.updateAlignment();
        }
    },

    init(){
        this.regiester();
        this.getClubConfig();
        this.getMyInfo();
    },

    //获取俱乐部配置
    getClubConfig(){
        let params = {
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSGetClubConfigReq_CMD, params);
    },

    onDestroy() {
        this.unRegiester();
    },

    unRegiester(){
        MsgManager.un(this._onUserInfo);
        MsgManager.un(this._getClubConfig);
    },

    regiester(){
        this.unRegiester();
        MsgManager.on(MSG.NOTIFY.ClubSUserInfoResp_ui, this._onUserInfo, this);
        MsgManager.on(MSG.NOTIFY.ClubSGetClubConfigResp_ui, this._getClubConfig, this);
    },

    getMyInfo(){
        let params = {
            nUserId: UserInfo.getInfo().nUserID,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSUserInfoReq_CMD, params);
    },

    // update (dt) {},

    initUI(data){
        this.label_name.string = Utils.getShortText(Base64.decode(data.sName), 20);
        let nTotalExp = this.getUpdateExp(data.nExp);
        let str = "<color=#fdd14e>" + (data.nExp ||0) +"</c><color=#bdbbcd>/" + (nTotalExp || 1000) + "</color>";
        this.exp.string = str;
        this.label_totalField.string = data.nAllCount;
        this.label_totalHand.string = data.nHandCount || 0;
        this.label_singleField.string = Utils.convertNumberToStr(data.nMaxProfit);
        this.label_singleHand.string = Utils.convertNumberToStr(data.nMaxHandProfit || 0);

        this.progress.progress = (data.nExp || 0)/(data.nTotalExp || 1000);
        this.slider.x = this.progress.totalLength *  this.progress.progress - this.slider.width/2;
        Utils.changeUserHead(this.head, data.sFaceId, app.ClubAssets);

        this.label_ID.string = "ID:" + data.nUserId;
        // if(!data.nVip){
        //     this.noVip.active = true;
        //     this.vip.active = false;
        // }else{
        //     this.noVip.active = false;
        //     this.vip.active = true;
        //     let vipLv = this.vip.getChildByName("vipLv");
        //     if (vipLv){
        //         vipLv.string = data.nVip;
        //     }
        // }

        // this.levelList[data.nGloryLevel].active = true;
        // let childList = this.levelList[data.nGloryLevel].children;
        // for (let i = 0; i < childList.length; i++) {
        //     if (data.nLevelStart >= (i + 1)){
        //         childList[i].active = true;
        //     }else{
        //         childList[i].active = false;
        //     }
            
        // }
    },

    getUpdateExp(nExp){
        if (this._config){
            for (let i = 0; i < this._config.arrLevel.length; i++) {
                let exp = this._config.arrLevel[i][1];
                if (nExp < exp){
                    return exp;
                }
                
            }
        }

        return 0;
    },

    onClickGameRecord(){
        //牌谱
        this.loadPrefab("HallCareerGameRecord");
    },

    onClickData(){
        //数据
    },

    onClickHonor(){
        //荣誉
    },

    onClickRecord(){
        //战绩
        this.loadPrefab("HallCareerRecord");
    },

    loadPrefab(prefabName, data, isAdd){
        let callBack = function(){
            let node = cc.instantiate(this._prefabs[prefabName]);
            this.node.parent.parent.getChildByName("popup").addChild(node, 1024);
            let component = node.getComponent(prefabName);
            if (component && component.init){
                component.init(data, isAdd)
            }
        }.bind(this);
        
        let wrapper = app.ClubViews;
        let path = prefabName;
        path = wrapper.path(path,null,"main-hall/resources/prefab/");
        
        this.loadUI(path, prefabName, callBack);
    },

    //加载UI
    loadUI(path, name, callBack){
        if (this._prefabs[name]){
            if(callBack){
                callBack();
            }

            return;
        }

        app.ClubViews.bundle.load(path,cc.Prefab,function (error, prefab){
            if(!error && cc.isValid(this)){
                this._prefabs[name] = prefab;
                if(callBack){
                    callBack();
                }
            }else{
            }
            
        }.bind(this))
    },

    _onUserInfo(data){
        if (data.nRlt == 0){
            this._userInfo = data.tUserInfo;
            this.initUI(this._userInfo);
        }
    },

    _getClubConfig(data){
        this._config = JSON.parse(data.sClubConfig);
    },

});
