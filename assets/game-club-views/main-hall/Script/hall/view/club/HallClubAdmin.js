// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//俱乐部管理员
let i18n = require("i18n");
let TAG = "club_admin";
let DynamicListView = require("DynamicListView");
let Utils = require("Utils");
let HallClubCacheData = require("HallClubCacheData");
let UIFrame = require("UIFrame");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let CMD = require("protocol_club");
let Base64 = require("base64");

cc.Class({
    extends: cc.Component,

    properties: {
        scrollview: {
            default: null,
            type: cc.ScrollView,
        }, 
        mask: {
            default: null,
            type: cc.Node
        },
        itmeContent: {
            default: null,
            type: cc.Node
        },
        item: {
            default: null,
            type: cc.Node
        },

        itemBg: cc.Node,

        prefab: cc.Prefab, //修改管理员权限
        prefab2: cc.Prefab, //增加管理员
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        app.util.addClickSoundToNode(this.node);
    },

    start () {
        this.initList();
        this._clubId = HallClubCacheData.getCurLoginClub();
        this.regiester();
        this.getAdminList();
    },

    // update (dt) {},

    regiester(){
        MsgManager.on(MSG.NOTIFY.ClubSAdminListResp_ui, this._onAdminList, this);
        MsgManager.on(MSG.NOTIFY.ClubSAdminMgrResp_ui, this._onAdminMgr, this);
        MsgManager.on(MSG.NOTIFY.ClubSChangeAdminPowerResp_ui, this._onChangeAdminPower, this);
    },

    onDestroy() {
        MsgManager.un(this._onAdminList);
        MsgManager.un(this._onAdminMgr);
    },

    onClickClose(){
        this.node.destroy();
    },

    //初始化滚动列表
    initList() {
        QYLogs.log(TAG, "----------------initList---------------");

        //调用构造函数，传入构造参数
        this.scview = new DynamicListView({
            scrollview: this.scrollview,
            mask: this.mask,
            content: this.itmeContent,
            item_templates:  [
                { key: "item1", node: cc.instantiate(this.item) },
            ],
            cb_host: this,
            //设置item的回调方法
            item_setter: this.item_setter,
            gap_y: 0,
            gap_x: 0,
            auto_scrolling: false,
            //滚动方向，1为垂直，2为水平
            direction: 1,
        });
    },

    //设置item的回调方法，对item进行设置，需要返回节点的宽度和高度用于列表布局
    item_setter(node, key, data, index) {
        this.initItem(node, data, index);

        return [node.width, node.height];
    },

    //nPowerType权限类型:1:成员管理权限 2:俱乐部币管理权限 3:开桌管理权限.
    initItem(node, data, index){
        let line = node.getChildByName("line");
        let label_name = node.getChildByName("label_name").getComponent(cc.Label);
        let label_authority = node.getChildByName("label_authority").getComponent(cc.Label);
        let head = node.getChildByName("head").getComponent(cc.Sprite);
        Utils.changeUserHead(head, data.sFaceId, app.ClubAssets);
        label_name.string = Utils.getShortText(Base64.decode(data.sName), 12);
        let powerList = JSON.parse(data.sPower)
        let str = "";
        for (let i = 0; i < powerList.length; i++) {
            let tmp = powerList[i];
            if (tmp.isOpen){
                str += i18n.t("CLUB_ADMIN_AUTHORITY." + tmp.nPowerType) + " ";
            }
            
        }

        if ((index + 1) == this.list.length){
            line.active = false;
        }else{
            line.active = true;
        }


        label_authority.string = str;
        data.powerList = powerList;

        node.off(cc.Node.EventType.TOUCH_END);

        node.on(cc.Node.EventType.TOUCH_END, function (button) {
            this.onClickItem(data);
         }.bind(this))
    },

    updateScrollView(listData) {
        QYLogs.log(TAG, "----------------updateScrollView---------------",listData);
        //设置列表item数据
        this.list = Utils.clone(listData);
        let dataArr = listData;
        let allData = [];
        //对数据进行包装
        for (let i = 0; i < dataArr.length; i++) {
            let Data = {
                key: "item1",
                data: dataArr[i]
            }
            allData.push(Data);
        }
        //设置数据，key为item样式，data为数据
     
        this.scview.set_data(allData);

        if (allData.length == 0){
            return;
        }

        let scHeight = this.scrollview.node.height;
        let tmpHeight = listData.length * this.item.height;
        let height = Math.min(tmpHeight, scHeight);
        this.itemBg.height = height + 20;

        if (tmpHeight < scHeight){
            this.scrollview.vertical = false;
        }else{
            this.scrollview.vertical = true;
        }
    },

    onClickAddMin(){
        let node = cc.instantiate(this.prefab2);
        this.node.addChild(node, 0, "addPrefab");
        let com = node.getComponent("HallClubMember");
        if (com){
            com.init({uiType:"admin"});
        }
    },

    onClickItem(data){
        let node = cc.instantiate(this.prefab);
        this.node.addChild(node, 0, "addPrefab");
        let com = node.getComponent("HallClubAdminManage");
        if (com){
            com.init(data);
        }
    },

    getAdminList(){
        let params = {
            nClubId: this._clubId,
            nCnt: 20,
            nPage: 1,
        }

        app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB.ClubSAdminListReq_CMD, params);
    },

    _onAdminList(data){
        this._adminList = data.arrAdminList;
        this.updateScrollView(data.arrAdminList || []);
    },

    _onAdminMgr(data){
        if (data.nRlt == 0){
            if (data.nOpType == 1){
                UIFrame.showTips(i18n.t("CLUB_ERROR.ADMIN_MGR5"));
            }else{
                UIFrame.showTips(i18n.t("CLUB_ERROR.ADMIN_MGR6"));
            }

            let child = this.node.getChildByName("addPrefab");
            if (child){
                child.destroy();
            }
            this.getAdminList();
            
        }else{
            if (data.nRlt == 1){
                UIFrame.showTips(i18n.t("CLUB_ERROR.ADMIN_MGR1"));
            }else if (data.nRlt == 2){
                UIFrame.showTips(i18n.t("CLUB_ERROR.DATA_ERROR"));
            }else if (data.nRlt == 3){
                UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_HAS_CLUB"));
            }else if (data.nRlt == 4){
                UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_POWER"));
            }else if (data.nRlt == 5){
                UIFrame.showTips(i18n.t("CLUB_ERROR.ADMIN_MGR2"));
            }else if (data.nRlt == 6){
                UIFrame.showTips(i18n.t("CLUB_ERROR.ADMIN_MGR3"));
            }else if (data.nRlt == 7){
                UIFrame.showTips(i18n.t("CLUB_ERROR.ADMIN_MGR4"));
            }
        }
    },

    _onChangeAdminPower(data){
        if (data.nRlt == 0){
            UIFrame.showTips(i18n.t("CLUB_ERROR.CHANGE_SUCCESS"));
            for (let i = 0; i < this._adminList.length; i++) {
                let tmp = this._adminList[i];
                if (tmp.nUserId == data.nUserId){
                    tmp.sPower = data.sPower;
                    break;
                }
                
            }

            this.updateScrollView(this._adminList);

        }else{
            if (data.nRlt == 1){
                UIFrame.showTips(i18n.t("CLUB_ERROR.ADMIN_MGR1"));
            }else if (data.nRlt == 2){
                UIFrame.showTips(i18n.t("CLUB_ERROR.DATA_ERROR"));
            }else if (data.nRlt == 3){
                UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_HAS_CLUB"));
            }else if (data.nRlt == 4){
                UIFrame.showTips(i18n.t("CLUB_ERROR.NOT_POWER"));
            }else if (data.nRlt == 5){
                UIFrame.showTips(i18n.t("CLUB_ERROR.ADMIN_MGR2"));
            }else if (data.nRlt == 6){
                // UIFrame.showTips(i18n.t("CLUB_ERROR.ADMIN_MGR3"));
            }else if (data.nRlt == 7){
                UIFrame.showTips(i18n.t("CLUB_ERROR.ADMIN_MGR4"));
            }
        }
    }
});
