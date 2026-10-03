// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let UIFrame = require("UIFrame");
let AppWebApi = require("AppWebApi");

cc.Class({
    extends: cc.Component,

    properties: {
       

        _allData: [],
        webView: {
            default: null,
            type: cc.WebView,
        },


        selectToggleIdx : 0,
        toggleList: [cc.Node],


        webViewNodeList: []
    },

    // LIFE-CYCLE CALLBACKS:



    onLoad () {
       

        // this.onClickToggle(null,0)
    },


    start () {
       
    },

    _safeDecodeBase64(str) {
        if (!str || typeof str !== "string") return str;
        try {
            return decodeURIComponent(escape(atob(str)));
        } catch (e) {
            return str;
        }
    },

    _toMsTimestamp(val) {
        if (!val) return 0;
        if (typeof val === "number") {
            return val < 1e12 ? val * 1000 : val;
        }
        if (typeof val === "string") {
            let t = Date.parse(val);
            if (!isNaN(t)) return t;
            let n = parseInt(val, 10);
            if (!isNaN(n)) return n < 1e12 ? n * 1000 : n;
        }
        return 0;
    },

    _mapRestToActivityData(restData) {
        if (!restData) return { actTypeList: [], actList: [] };
        let rawTypes = restData.actTypeList || [];
        let rawDefs  = restData.actList     || [];

        let TAG = "HallActivityMain._mapRestToActivityData";
        QYLogs.log(TAG, "rawTypes.length=" + rawTypes.length + " rawDefs.length=" + rawDefs.length);

        let actTypeList = rawTypes.map((t, i) => ({
            id:     t.id       !== undefined ? t.id       : (t.ID     !== undefined ? t.ID     : (t.typeId !== undefined ? t.typeId : (i + 1))),
            name:   this._safeDecodeBase64(t.name   !== undefined ? t.name   : (t.Name   !== undefined ? t.Name   : "")),
            sort:   t.sort     !== undefined ? Number(t.sort)   : (t.Sort     !== undefined ? Number(t.Sort)     : (i + 1)),
            state:  t.state    !== undefined ? Number(t.state)  : (t.State    !== undefined ? Number(t.State)    : 1),
        }));

        let actList = rawDefs.map((a, i) => ({
            ID:         a.ID        !== undefined ? a.ID        : (a.id        !== undefined ? a.id        : (i + 1)),
            name:       this._safeDecodeBase64(a.name      !== undefined ? a.name      : (a.Name      !== undefined ? a.Name      : "")),
            url:        a.url       !== undefined ? a.url       : (a.Url       !== undefined ? a.Url       : (a.linkUrl  !== undefined ? a.linkUrl  : "")),
            image:      a.image     !== undefined ? a.image     : (a.Image     !== undefined ? a.Image     : (a.imgUrl   !== undefined ? a.imgUrl   : (a.picUrl !== undefined ? a.picUrl : ""))),
            state:      a.state     !== undefined ? Number(a.state)     : (a.State     !== undefined ? Number(a.State)     : 1),
            sort:       a.sort      !== undefined ? Number(a.sort)      : (a.Sort      !== undefined ? Number(a.Sort)      : (i + 1)),
            type_id:    a.type_id   !== undefined ? a.type_id   : (a.typeId    !== undefined ? a.typeId    : (a.TypeId !== undefined ? a.TypeId : (a.TypeID !== undefined ? a.TypeID : 0))),
            startTime:  this._toMsTimestamp(a.startTime !== undefined ? a.startTime : (a.StartTime !== undefined ? a.StartTime : (a.start_at !== undefined ? a.start_at : 0))),
            endTime:    this._toMsTimestamp(a.endTime   !== undefined ? a.endTime   : (a.EndTime   !== undefined ? a.EndTime   : (a.end_at   !== undefined ? a.end_at   : 0))),
        }));

        QYLogs.log(TAG, "mapped actTypeList=" + JSON.stringify(actTypeList.slice(0,3)) + " actList[0..1]=" + JSON.stringify(actList.slice(0,2)));
        return { actTypeList: actTypeList, actList: actList };
    },

    loadActivityDataViaRest() {
        let TAG = "HallActivityMain";
        let self = this;

        try {
            let AWA = require("AppWebApi");
            if (AWA && typeof AWA.getCachedRestToken === "function" && (!AWA.getCachedRestToken || AWA.getCachedRestToken() === "")) {
                try {
                    let LocalStorage = require("LocalStorage");
                    let UserKey = require("UserKey");
                    let KEY = UserKey && UserKey.COMMON ? UserKey.COMMON : {};
                    let foundToken = "";
                    try {
                        let storage = app && app.storage ? app.storage : null;
                        let tempKey = KEY.TEMP_TOKEN || "TEMP_TOKEN";
                        let tempObj = null;
                        if (storage && typeof storage.getItem === "function") tempObj = storage.getItem(tempKey, null);
                        if (!tempObj) tempObj = LocalStorage.getItem ? LocalStorage.getItem(tempKey, null) : null;
                        if (tempObj && typeof tempObj === "object") {
                            for (let k in tempObj) {
                                if (tempObj.hasOwnProperty(k) && tempObj[k] && tempObj[k].token && tempObj[k].token !== "") {
                                    foundToken = tempObj[k].token;
                                    break;
                                }
                            }
                        }
                        if (!foundToken) {
                            let adminKey = "ADMIN_X_TOKEN";
                            if (storage && typeof storage.getItem === "function") foundToken = storage.getItem(adminKey, "");
                            if (!foundToken && LocalStorage.getItem) foundToken = LocalStorage.getItem(adminKey, "");
                        }
                    } catch (eToken) {}
                    if (foundToken && foundToken !== "" && AWA && typeof AWA.setRestToken === "function") {
                        AWA.setRestToken(foundToken);
                        QYLogs.log(TAG, "fallback inject REST token, len=" + foundToken.length);
                    }
                } catch (eInject) {}
            }
        } catch (e) {}

        let fallbackEmpty = function(reason, extraErr) {
            try {
                QYLogs.warn(TAG, "[loadActivityDataViaRest] fallback empty, reason=" + reason + (extraErr ? (" err=" + extraErr) : ""));
            } catch (e) {}
            self._allData = self.formatActivityData({ actTypeList: [], actList: [] });
            self.initToggle(self._allData);
        };

        try {
            if (!AppWebApi || typeof AppWebApi.getAllActivityData !== "function") {
                fallbackEmpty("getAllActivityData missing");
                return;
            }
        } catch (e) {
            fallbackEmpty("precheck exc", e.message);
            return;
        }

        QYLogs.log(TAG, "[loadActivityDataViaRest] calling getAllActivityData");
        try {
            AppWebApi.getAllActivityData(function(err, restData){
                try {
                    if (err) {
                        QYLogs.error(TAG, "[loadActivityDataViaRest] getAllActivityData failed:", err && err.errorMessage ? err.errorMessage : err);
                    }
                    let data = self._mapRestToActivityData(restData);
                    self._allData = self.formatActivityData(data);
                    QYLogs.log(TAG, "[loadActivityDataViaRest] 整理后的数据:", JSON.stringify(self._allData));
                    self.initToggle(self._allData);
                } catch (eCb) {
                    fallbackEmpty("callback exc", eCb.message);
                }
            });
        } catch (eCall) {
            fallbackEmpty("call exc", eCall.message);
        }
    },

    loadActivityData(url) {
        cc.loader.load({ url: url, type: 'json' }, (err, json) => {
            if (err) {
                cc.error("加载活动数据失败:", err);
                return;
            }

            let data = json;

            this._allData = this.formatActivityData(data);
            
            cc.log("整理后的数据:",  this._allData);
            this.initToggle(this._allData);
        });
    },

    initToggle(_allData){
        let TAG = "HallActivityMain.initToggle";
        let cloneToggleItem = this.node.getChildByName("content").getChildByName("toggleScollView").getChildByName("view").getChildByName("toggleItem")
        let cloneToggleParent = this.node.getChildByName("content").getChildByName("toggleScollView").getChildByName("view").getChildByName("content")
        let activityContent = this.node.getChildByName("content").getChildByName("activityScollView").getChildByName("view").getChildByName("content")
        let emptyNode = this.node.getChildByName("content").getChildByName("emptyTip")
        cloneToggleItem.active = false
        this.toggleList = []
        let children = cloneToggleParent.children;
        let length = Math.max(children.length, _allData.length);

        if (!_allData || _allData.length === 0 ||
            (_allData.length === 1 && _allData[0].name === "全部活动" && (!_allData[0].actList || _allData[0].actList.length === 0))) {
            try { QYLogs.warn(TAG, "★★活动数据为空★★ 显示「暂无活动」提示。请检查：1)后端是否已重新编译部署最新代码；2)数据库 ActivityType/ActivityDefine 表是否有 state=1 且时间范围内有效 的记录。"); } catch (e) {}
            for (let i = 0; i < children.length; i++) {
                children[i].active = false;
            }
            if (activityContent) activityContent.destroyAllChildren(false);
            if (emptyNode) emptyNode.active = true;
            return;
        }
        if (emptyNode) emptyNode.active = false;

        for (let index = 0; index < length; index++) {
            let cloneToggle = children[index];
            if(!cloneToggle) {
                cloneToggle = cc.instantiate(cloneToggleItem);
                cloneToggleParent.addChild(cloneToggle);
            }else if(index >= _allData.length){
                cloneToggle.active = false
                continue;
            }
            this.toggleList.push(cloneToggle)

            cloneToggle.active = true
            cloneToggle.getChildByName("label").getComponent(cc.Label).string = _allData[index].name
            cloneToggle.getChildByName("seleted").getComponent(cc.Label).string = _allData[index].name
            cloneToggle.index = index
            cloneToggle.y = 0;
            
            cloneToggle.off(cc.Node.EventType.TOUCH_END, function(event){}, this);
            cloneToggle.on(cc.Node.EventType.TOUCH_END, function(event){
                this.onClickToggle(event,cloneToggle.index);
            }, this);
        }

        this.onClickToggle(null,0);
    },

    formatActivityData(data) {
        if (!data || !data.actTypeList || !data.actList) {
            return [];
        }
        let typeList = data.actTypeList.slice(); // 复制
        let actList = data.actList.slice();
        typeList.sort((a, b) => a.sort - b.sort);
        actList.sort((a, b) => a.sort - b.sort);

        const now = Date.now(); // 当前时间戳

        let result = [];//活动页签
        for (let i = 0; i < typeList.length; i++) {
            let type = typeList[i];

            let acts = actList
                .filter(act => act.type_id === type.id)
                .filter(act => {
                    // 时间戳 过滤
                    return now >= act.startTime && now <= act.endTime;
                })
                .map(act => ({
                    ID: act.ID,
                    name: act.name,
                    url: act.url,
                    image: act.image,
                    state: act.state,
                    sort: act.sort,
                    startTime: act.startTime,
                    endTime: act.endTime,
                }))
                .sort((a, b) => a.sort - b.sort);

            result.push({
                id: type.id,
                name: type.name,
                sort: type.sort,
                state: type.state,
                actList: acts
            });
        }

        // 全部活动
        let allActs = actList
            .filter(act => {
                // 时间过滤
                return now >= act.startTime && now <= act.endTime;
            })
            .map(act => ({
                ID: act.ID,
                name: act.name,
                url: act.url,
                image: act.image,
                state: act.state,
                sort: act.sort,
                startTime: act.startTime,
                endTime: act.endTime
            }))
            .sort((a, b) => a.sort - b.sort);

        result.unshift({
            id: 0,
            name: "全部活动",
            sort: 0,
            state: 1,
            actList: allActs
        });

        return result;
    },

    onDestroy(){
     
    },

    init(control){
        this.hideAllWenView();
        this.control = control;
        this.webView.node.active = false;
        this.loadActivityDataViaRest();
    },

     
    hideAllWenView(){

        this.webViewNodeList.forEach(item =>{
            item.active = false
        } )
    },

    
    openWebView(_url,actID){ 
        if(this.webViewNodeList[actID]){
            this.webViewNodeList[actID].active = true
        }else{
            let webViewNode = cc.instantiate(this.webView.node);
            webViewNode.parent = this.webView.node.parent;
            this.webViewNodeList[actID] = webViewNode
            webViewNode.getComponent(cc.WebView).url = _url +"&date=" + new Date().getTime();
            webViewNode.active = true
        }
        //原有逻辑
        // this.webView.node.active = true
        // this.webView.url = _url +"&date=" + new Date().getTime();

    },  

    hideWebView(event){
        event.currentTarget.parent.active = false
        //原有逻辑
        // this.webView.url = ""
        // this.webView.node.active = false
    },

    onClickActivityItem(data){
        if(data.url){
            this.openWebView(data.url,data.ID)
        }
    },


    //======================= new ==============================

    onClickToggle(event,index){
        if (!this._allData || this._allData.length === 0) return;
        if (index < 0 || index >= this._allData.length) {
            index = 0;
        }
        for (let i = 0; i < this.toggleList.length; i++) {
            if (!this.toggleList[i]) continue;
            this.toggleList[i].getChildByName("seleted").active = i == index
            this.toggleList[i].getChildByName("label").active = i != index
            
        }
        this.selectToggleIdx = index

        this.createContentItem(this.selectToggleIdx)
    },

    createContentItem(){
        let TAG = "HallActivityMain.createContentItem";
        let cloneActivityItem = this.node.getChildByName("content").getChildByName("item")
        let clonActivityParent = this.node.getChildByName("content").getChildByName("activityScollView").getChildByName("view").getChildByName("content")
        if (!cloneActivityItem || !clonActivityParent) {
            try { QYLogs.error(TAG, "createContentItem 节点缺失：item 或 activityScollView/content 不存在"); } catch (e) {}
            return;
        }
        clonActivityParent.destroyAllChildren(false);
        cloneActivityItem.active = false

        let emptyNode = this.node.getChildByName("content").getChildByName("emptyTip")
        let category = this._allData ? this._allData[this.selectToggleIdx] : null;
        if (!category || !category.actList || category.actList.length === 0) {
            try { QYLogs.warn(TAG, "当前页签「" + (category ? category.name : "N/A") + "」下没有活动（selectToggleIdx=" + this.selectToggleIdx + "）"); } catch (e) {}
            if (emptyNode) emptyNode.active = true;
            return;
        }
        if (emptyNode) emptyNode.active = false;

        let actList = category.actList
        try { QYLogs.log(TAG, "页签「" + category.name + "」下渲染 " + actList.length + " 个活动项"); } catch (e) {}
        for (let index = 0; index < actList.length; index++) {
            let cloneItem = cc.instantiate(cloneActivityItem);
            clonActivityParent.addChild(cloneItem);
            cloneItem.active = true
            cloneItem.x = 0;
            if(actList[index].image){
                (function(item, imgUrl){
                    cc.loader.load({ url: imgUrl, type: 'png' }, (err, tex) => {
                        if (!err && tex && item && item.isValid) {
                            let sprite = item.getComponent(cc.Sprite);
                            if (sprite) sprite.spriteFrame = new cc.SpriteFrame(tex);
                        }
                    });
                })(cloneItem, actList[index].image);
            }
            
            cloneItem.on(cc.Node.EventType.TOUCH_END, (event) => {
                const now = Date.now();
                if(now >= actList[index].startTime && now <= actList[index].endTime){
                    this.onClickActivityItem(actList[index]);
                }else{
                     UIFrame.showTips("活动已结束")
                }
                
                
            }, this);
        }
    },


    onClickActivityItem(act){
        
        if (act.url && act.url.length > 0) {
                // act.url = "http://192.168.31.173:8060/activityDir/activityIndex.html"
                this.openWebView(act.url,act.ID)
        }else {
            UIFrame.showTips("活动已结束")
        }
       
        // UIFrame.showTips("活动暂未开启")
    }

});
