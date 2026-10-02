let DynamicPageView = require("DynamicPageView");

cc.Class({
    extends: cc.Component,

    properties: {
        panelAdapter: {
            default: null,
            type: cc.Node,
            tooltip: "适配面板，用于界面适配",
        },
        itmeContent: {
            default: null,
            type: cc.Node,
            tooltip: "item父节点",
        },
        item: {
            default: null,
            type: cc.Prefab,
            tooltip: "item预制体",
        },
        indexLabel: {
            default: null,
            type: cc.Label,
            tooltip: "翻页索引label",
        },
        btnPageUp: {
            default: null,
            type: cc.Node,
            tooltip: "上翻页按钮",
        },
        btnPageDown: {
            default: null,
            type: cc.Node,
            tooltip: "下翻页按钮",
        },
        label_noRecord: {
            default: null,
            type: cc.Node,
            tooltip: "\"没有战绩\"文本",
        },
        style1: {
            default: null,
            type: cc.Node,
            tooltip: "风格1",
        },
        style2: {
            default: null,
            type: cc.Node,
            tooltip: "风格2",
        },
        curSkin:"",
    },

    initPanel(gameCtrl) {
        this._gameCtrl = gameCtrl;

        if (App.isHelloGame()) {
            this.style1.active = true;
            this.style2.active = false;
        }

        if (App.isMoreWin()) {
            this.style1.active = false;
            this.style2.active = true;
        }

        //new动态滚动列表
        this.initPageVew();
    },

    onLoad() {
        if (cc.sys.isMobile) {
            this._onResizedCallback = this._onResized.bind(this);
            //window.addEventListener('resize', this._onResizedCallback, false);
        }
        else {
            //cc.view.on('canvas-resize', this._onResized, this);
        }
        this._onResized();
    },

    onDestroy() {
        this.pageView.destroy();

        if (cc.sys.isMobile) {
            if (this._onResizedCallback) {
                //window.removeEventListener('resize', this._onResizedCallback);
                this._onResizedCallback = null;
            }
        }
        else {
            //cc.view.off('canvas-resize', this._onResized);
        }
    },

    _onResized() {
        // if (!this.panelAdapter) return;

        // this.panelAdapter.parent.getComponent(cc.Widget).updateAlignment();

        // let scaleX = 0;
        // let scaleY = 0;
        // let scale = 0;
        // //如果是百家乐语音房
        // if (this.curSkin == "c" && app.game.getGameID() == 122) {
        //     let actualSize = this.panelAdapter.parent.getContentSize();
        //     scaleX = actualSize.width / 750;
        //     scaleY = actualSize.height / 939;
        // }
        // else {
        //     let designSize = this.panelAdapter.getContentSize();
        //     let winSize = cc.winSize;
        //     scaleX = winSize.width / designSize.width;
        //     scaleY = winSize.height / designSize.height;
        // }
        // scale = Math.min(scaleX, scaleY);
        // this.panelAdapter.scale = scale;
    },

    onEnable() {
        this._onResized();
    },

    //初始化滚动列表
    initPageVew() {
        //调用构造函数，传入构造参数
        this.pageView = new DynamicPageView({
            content: this.itmeContent,
            itemPrefab: this.item,
            cb_host: this,
            //设置item的回调方法
            item_setter: this.item_setter,
            //末页回调
            page_to_end_cb: this.page_to_end_cb,
            //底部页数索引label
            indexLabel: this.indexLabel,
            btnPageUp: this.btnPageUp,
            btnPageDown: this.btnPageDown,
        });
    },

    //设置item的回调方法，对item进行设置
    item_setter(node, data, index) {
        let item = node.getComponent("RecordItem");
        item.init(data);
        if (this._gameCtrl && this._gameCtrl.updateItem){
            this._gameCtrl.updateItem(node, index);
        }
    },

    //末页回调
    page_to_end_cb(dataArr) {
        if (dataArr.length <= 0) return;

        //如果已经到最后没有数据了，则不再进行请求
        if (this._isLast) return;

        this._gameCtrl.reqRecord(this.nMinId);
    },

    setData(data) {

        if(!data){
            return
        }

        if(!data.arrItem){
            data.arrItem = []
        }

        this.nMinId = data.nMinId

        if(data.nSumItem){
            this.pageView.set_maxlength(data.nSumItem);
        }
        if (this.node.active) {
            this.appendData(data.arrItem);
            return;
        }
        this.node.active = true;
        this.label_noRecord.active = false;
        if (data.arrItem.length == 0) {
            this.label_noRecord.active = true;
        }

        

        //设置列表item数据
        let dataArr = data.arrItem;
        if (dataArr.length > 0) {
            this._isLast = false;
        }
        else {
            this._isLast = true;
        }
        //设置数据
        this.pageView.set_data(dataArr);
    },

    //增加数据
    appendData(data) {
        if (data.length == 0) {
            this._isLast = true;
            return;
        };

        //设置列表item数据
        let dataArr = data;
        if (dataArr.length > 0) {
            this._isLast = false;
        }
        this.pageView.append_data(dataArr);
    },

    hide() {
        this.node.active = false;
    },

});