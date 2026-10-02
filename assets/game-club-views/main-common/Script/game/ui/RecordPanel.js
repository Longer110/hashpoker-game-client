let DynamicListView = require("DynamicListView");

cc.Class({
    extends: cc.Component,

    properties: {
        scrollview: {
            default: null,
            type: cc.ScrollView
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
            type: cc.Prefab
        },
        //适配面板
        panelAdapter: {
            default: null,
            type: cc.Node,
            tooltip: '适配面板，用于界面适配',
        },
        label_noRecord: cc.Node,
        style1: cc.Node,
        style2: cc.Node,
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
        this.initList();
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
        this.scview.destroy();

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
        //适配面板
        // if (this.panelAdapter) {
        //     let designSize = this.panelAdapter.getContentSize();
        //     let winSize = cc.winSize;
        //     let scaleX = winSize.width / designSize.width;
        //     let scaleY = winSize.height / designSize.height;
        //     let scale = Math.min(scaleX, scaleY);
        //     this.panelAdapter.scale = scale;
        // }
    },

    onEnable() {
        this._onResized();
    },

    //初始化滚动列表
    initList() {
        //item模板预制件，key为字符串名称，node为预制件
        let templates = [
            { key: "item1", node: this.item },
        ];

        //调用构造函数，传入构造参数
        this.scview = new DynamicListView({
            scrollview: this.scrollview,
            mask: this.mask,
            content: this.itmeContent,
            item_templates: templates,
            cb_host: this,
            //设置item的回调方法
            item_setter: this.item_setter,
            scroll_to_end_cb: this.scroll_to_end_cb,
            gap_y: 0,
            gap_x: 0,
            auto_scrolling: false,
            //滚动方向，1为垂直，2为水平
            direction: 1,
        });
    },

    //设置item的回调方法，对item进行设置，需要返回节点的宽度和高度用于列表布局
    item_setter(node, key, data, index) {
        let item = node.getComponent("RecordItem");
        item.init(data);

        return [node.width, node.height];
    },

    //滚动到末尾时的回调方法
    scroll_to_end_cb(dataArr) {
        if (dataArr.length <= 0) return;

        //如果已经到最后没有数据了，则不再进行请求
        if (this._isLast) return;

        this._gameCtrl.reqRecord(dataArr[0].data.data.nId);
    },

    setData(data) {
        if (this.node.active) {
            this.appendData(data);
            return;
        }

        this.node.active = true;

        this.label_noRecord.active = false;
        if (!data) {
            this.label_noRecord.active = true;
            data = [];
        };

        //设置列表item数据
        let dataArr = data;
        let allData = [];
        //对数据进行包装
        for (let i = 0; i < dataArr.length; i++) {
            let Data = {
                key: "item1",
                data: dataArr[i]
            }
            allData.push(Data);
        }

        if (allData.length > 0) {
            this._isLast = false;
        }
        else {
            this._isLast = true;
        }
        //设置数据，key为item样式，data为数据
        this.scview.set_data(allData);
    },

    //增加数据
    appendData(data) {
        if (!data) {
            this._isLast = true;
            return;
        };

        //设置列表item数据
        let dataArr = data;
        let allData = [];
        //对数据进行包装
        for (let i = 0; i < dataArr.length; i++) {
            let Data = {
                key: "item1",
                data: dataArr[i]
            }
            allData.push(Data);
        }

        if (allData.length > 0) {
            this._isLast = false;
        }
        this.scview.append_data(allData);
    },

    hide() {
        this.node.active = false;
    },

});