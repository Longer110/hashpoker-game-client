

//模板
let i18n = require("i18n");
let TAG = "career_record";
let DynamicListView = require("DynamicListView");
let Utils = require("Utils");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
let CMD = require("protocol_club");
let UIFrame = require("UIFrame");
let LocalStorage = require("LocalStorage");
let AppBridge = require("AppBridge");
let UserInfo = require("UserInfo");
let Base64 = require("base64");
let clubGameConfig = require("clubGameConfig");
let MAXCount = 10;
let UIListView = require("UIListView");
let TOTAL_COUNT = 40;
let AppWebApi = require("AppWebApi");
let HallClubCacheData = require("HallClubCacheData");
//let TexasGameReview = require("TexasGameReview");

cc.Class({
    extends: cc.Component,

    properties: {
        //TexasGameReview: TexasGameReview,//牌局回顾
        listView: {
            default: null,
            type: UIListView,
        },

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
        
        content: cc.Node,
        noData: cc.Node,
        prefab_CreateGame: cc.Prefab,
        tipNode: cc.Node, //提示

        _templateList: [],
        _curPage: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        app.util.addClickSoundToNode(this.node);
    },

    start () {
        this._loadingPlayback = false;  // 防重复加载
        this._blockIndex = 0;           // Loading 索引，确保关闭时能隐藏
        this.init();
    },

    // update (dt) {},

    regiester(){
        MsgManager.on(MSG.NOTIFY.UPDATE_ROOM_TEMPLATE, this.initTemplateData, this);
    },

    unRegiester(){
        MsgManager.un(this.initTemplateData, this);
    },

    onDisable() {
        this.unRegiester();
    },

    onDestroy() {
        this.unRegiester();
        // 关闭 Loading
        if (this._blockIndex) {
            UIFrame.hideBlock(this._blockIndex);
            this._blockIndex = 0;
        }

    },

    init(){
        this.listView.init(this);
        // this.initList();
        this.unRegiester();
        this.regiester();
        this._curSelectGameIndex = 0
        this.initTemplateData();
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
            scroll_to_end_cb: this.scroll_to_end_cb,
        });
    },

    //设置item的回调方法，对item进行设置，需要返回节点的宽度和高度用于列表布局
    item_setter(node, key, data, index) {
        this.initItem(node, data, index);

        return [node.width, node.height];
    },

    scroll_to_end_cb(dataArr){
        if (dataArr.length <= 0 || this._isEnd) return;
        this.getGameRecord(this._curPage + 1);
    },

    initItem(node, data, index){
        node.off(cc.Node.EventType.TOUCH_END);

        node.on(cc.Node.EventType.TOUCH_END, function (button) {
            console.log("item click");
            this.onClickItem(data, false);
        }.bind(this))

        let btnDelete = node.getChildByName("bg").getChildByName("btnDelete");
        let btnEidt = node.getChildByName("bg").getChildByName("btnEidt");
        //添加点击事件
        if (btnDelete) {
            btnDelete.off(cc.Node.EventType.TOUCH_END);
            btnDelete.on(cc.Node.EventType.TOUCH_END, function (event) {
                console.log("btnDelete");
                if (event && event.stopPropagation) {
                    event.stopPropagation();
                }
                this.deleteTemplate(data);
            }.bind(this));
        }

        if (btnEidt) {
            btnEidt.off(cc.Node.EventType.TOUCH_END);
            btnEidt.on(cc.Node.EventType.TOUCH_END, function (event) {
                console.log("btnEidt");
                if (event && event.stopPropagation) {
                    event.stopPropagation();
                }
                this.onClickItem(data, true);
            }.bind(this));
        }
        

        node.active = true;
        if (node.dataId && node.dataId == data.nId){
            return;
        }

        node.dataId = data.nId;
    },

    onClickItem(data, isCreateTemplate){
        // this.onClickClose();
        let prefab = this.prefab_CreateGame;
        if(prefab){
            let node = cc.instantiate(prefab);
            let createGameComponent = node.getComponent("HallCreateGame");
            if (createGameComponent){
                createGameComponent.onInit({isCreateTemplate: isCreateTemplate,tempIndex:data.tempIndex, configData:cc.instantiate(data),isFromTemplate:true});
            }
            this.getAddNode().addChild(node, 1024);
        }
    },


    //nType: 1:近期 2:收藏
    updateScrollView(listData) {
        QYLogs.log(TAG, "----------------updateScrollView---------------",listData);
        //设置列表item数据
        this._templateList = listData;
       
        
        let dataArr = listData;

        this.listView.resetData(dataArr);
    },

    //向列表末端插入新的数据
    appendData(data){
        QYLogs.log(TAG, "----------------appendData---------------",data);
        for (let i = 0; i < data.length; i++) {
            this._templateList.push(data[i]); 
        }  
        
        //设置列表item数据
        let dataArr = data;
        this.listView.onLoadMoreFinish(data);
    },
    initTemplateData(){
        let tempData = LocalStorage.getItem("CLUB_CREATE_TEXAS_TABLE_TEMPLATE") ||[]
        let dataList = tempData.slice();
        let templateData = [[], []];
        for (let i = 0; i < dataList.length; i++) {
            let data = dataList[i];
            data.tempIndex = i;
            if (data.gameId == 125) {
                templateData[0].push(data);
            }else if (data.gameId == 175) {
                templateData[1].push(data);
            }
           
        }
        this.updateScrollView(templateData[this._curSelectGameIndex]);
        this.noData.active =  templateData[this._curSelectGameIndex].length == 0;
    },

    //显示loading
    _showLoading(isShow) {
        if (this._blockIndex) {
            UIFrame.hideBlock(this._blockIndex);
            this._blockIndex = 0;
        }

        if (isShow) {
            this._blockIndex = UIFrame.showLoading(i18n.t("COMMON.JIA_ZAI_ZHONG"), true, function (params) {
                this._blockIndex = 0;
            }.bind(this), 30);
        }
    },



    onAttachCell(cell){
        cell.node.active = true;
        this.initItem(cell.node, cell.getData())
    },

    onLoadMoreStart(){
        let isGetAll = this.getRecordCount && this.getRecordCount > 0;
        if (!this._isEnd && this._templateList.length >= TOTAL_COUNT && !isGetAll){
            this.getRecordCount = TOTAL_COUNT;
            this.getGameRecord(this._curPage + 1);
        }else{
            this.listView.onLoadMoreFinish();
        }
    },

    onClickCreateTemplate(){
        // this.onClickClose();
        let prefab = this.prefab_CreateGame;
        if(prefab){
            let node = cc.instantiate(prefab);
            let createGameComponent = node.getComponent("HallCreateGame");
            if (createGameComponent){
                createGameComponent.onInit({isCreateTemplate: true,tempIndex:null,isFromTemplate:true});
            }
            this.getAddNode().addChild(node, 1024);
        }
    },
    
    getAddNode(){
        return this.node.parent.parent.getChildByName("popup");
    },

    // 删除指定的模板数据
    deleteTemplate(data) {
        // 显示确认对话框
        this.tipNode.active = true;
        this.deleteData = data;
        // let dialogData = {
        //     text: i18n.t("CLUB_HALL.DELETE_TEMPLATE_CONFIRM") || "确定要删除这个模板吗？",
        //     isOKAndCancel: true,
        //     callBack: (isOK) => {
        //         if (isOK) {
        //             this.confirmDeleteTemplate(data);
        //         }
        //     }
        // };
        
        // // 使用UIFrame显示确认对话框
        // this.showConfirmDialog(dialogData);
    },

    // 确认删除模板
    confirmDeleteTemplate(event, data) {
        let index = Number(data);
        if (index == 1) {
            // 删除模板
            HallClubCacheData._gameTemplateConfig.splice(this.deleteData.tempIndex, 1);
            
            UIFrame.showTips("模板删除成功");
            LocalStorage.setItem("CLUB_CREATE_TEXAS_TABLE_TEMPLATE", HallClubCacheData._gameTemplateConfig)
            this.initTemplateData()
        } else {
            
        }
        this.onCloseTip();
    },

    onCloseTip(){
        this.tipNode.active = false;
    },



    // 显示确认对话框
    showConfirmDialog(dialogData) {
        // 可以根据项目中已有的对话框组件来实现
        // 这里提供一个基础实现
        let path = "popup/dialog/UIDialog";
        let parent = app.node;
        let wrapper = app.ClubAssets;
        
        wrapper.ui.loadPopup(path, function (component) {
            parent.addChild(component.node, 1024);
            component.setShowType(0); // 设置为确认取消类型
            component.setUIBtnTitle();
            component.show(dialogData.text, function (isOK) {
                if (dialogData.callBack) {
                    dialogData.callBack(isOK);
                }
            });
            component.node.position = cc.Vec2.ZERO;
        }.bind(this), {
            path_resources: "main-common/resources/"
        });
    },

    onClickGame(event, data){
        let index = Number(data);
        switch (index) {
            case 1:
                //德州
                this._curSelectGameIndex = 0;
                this.initTemplateData(0);
                break;
            case 2:
                //短牌
                this._curSelectGameIndex = 1;
                this.initTemplateData(1);
                break;
        }
    },
});
