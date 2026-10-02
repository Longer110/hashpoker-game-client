// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

var UIFrame = require("UIFrame");
var AppWebApi = require("AppWebApi");

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

    _safeDecodeBase64: function(str) {
        if (!str || typeof str !== "string") return str;
        try {
            return decodeURIComponent(escape(atob(str)));
        } catch (e) {
            return str;
        }
    },

    _toMsTimestamp: function(val) {
        if (!val) return 0;
        if (typeof val === "number") {
            return val < 1e12 ? val * 1000 : val;
        }
        if (typeof val === "string") {
            var t = Date.parse(val);
            if (!isNaN(t)) return t;
            var n = parseInt(val, 10);
            if (!isNaN(n)) return n < 1e12 ? n * 1000 : n;
        }
        return 0;
    },

    _mapRestToActivityData: function(restData) {
        if (!restData) return { actTypeList: [], actList: [] };
        var rawTypes = restData.actTypeList || [];
        var rawDefs  = restData.actList     || [];

        var TAG = "HallActivityMain._mapRestToActivityData";
        QYLogs.log(TAG, "rawTypes.length=" + rawTypes.length + " rawDefs.length=" + rawDefs.length);

        var actTypeList = rawTypes.map(function(t, i) {
            return {
                id:     t.id       !== undefined ? t.id       : (t.ID     !== undefined ? t.ID     : (t.typeId !== undefined ? t.typeId : (i + 1))),
                name:   this._safeDecodeBase64(t.name   !== undefined ? t.name   : (t.Name   !== undefined ? t.Name   : "")),
                sort:   t.sort     !== undefined ? Number(t.sort)   : (t.Sort     !== undefined ? Number(t.Sort)     : (i + 1)),
                state:  t.state    !== undefined ? Number(t.state)  : (t.State    !== undefined ? Number(t.State)    : 1),
            };
        }.bind(this));

        var actList = rawDefs.map(function(a, i) {
            return {
                ID:         a.ID        !== undefined ? a.ID        : (a.id        !== undefined ? a.id        : (i + 1)),
                name:       this._safeDecodeBase64(a.name      !== undefined ? a.name      : (a.Name      !== undefined ? a.Name      : "")),
                url:        a.url       !== undefined ? a.url       : (a.Url       !== undefined ? a.Url       : (a.linkUrl  !== undefined ? a.linkUrl  : "")),
                image:      a.image     !== undefined ? a.image     : (a.Image     !== undefined ? a.Image     : (a.imgUrl   !== undefined ? a.imgUrl   : (a.picUrl !== undefined ? a.picUrl : ""))),
                state:      a.state     !== undefined ? Number(a.state)     : (a.State     !== undefined ? Number(a.State)     : 1),
                sort:       a.sort      !== undefined ? Number(a.sort)      : (a.Sort      !== undefined ? Number(a.Sort)      : (i + 1)),
                type_id:    a.type_id   !== undefined ? a.type_id   : (a.typeId    !== undefined ? a.typeId    : (a.TypeId !== undefined ? a.TypeId : (a.TypeID !== undefined ? a.TypeID : 0))),
                startTime:  this._toMsTimestamp(a.startTime !== undefined ? a.startTime : (a.StartTime !== undefined ? a.StartTime : (a.start_at !== undefined ? a.start_at : 0))),
                endTime:    this._toMsTimestamp(a.endTime   !== undefined ? a.endTime   : (a.EndTime   !== undefined ? a.EndTime   : (a.end_at   !== undefined ? a.end_at : 0))),
            };
        }.bind(this));

        QYLogs.log(TAG, "mapped actTypeList=" + JSON.stringify(actTypeList.slice(0,3)) + " actList[0..1]=" + JSON.stringify(actList.slice(0,2)));
        return { actTypeList: actTypeList, actList: actList };
    },

    loadActivityDataViaRest: function() {
        var TAG = "HallActivityMain";
        var self = this;

        try {
            var AWA = require("AppWebApi");
            if (AWA && typeof AWA.getCachedRestToken === "function" && (!AWA.getCachedRestToken || AWA.getCachedRestToken() === "")) {
                try {
                    var LocalStorage = require("LocalStorage");
                    var UserKey = require("UserKey");
                    var KEY = UserKey && UserKey.COMMON ? UserKey.COMMON : {};
                    var foundToken = "";
                    try {
                        var storage = app && app.storage ? app.storage : null;
                        var tempKey = KEY.TEMP_TOKEN || "TEMP_TOKEN";
                        var tempObj = null;
                        if (storage && typeof storage.getItem === "function") tempObj = storage.getItem(tempKey, null);
                        if (!tempObj) tempObj = LocalStorage.getItem ? LocalStorage.getItem(tempKey, null) : null;
                        if (tempObj && typeof tempObj === "object") {
                            for (var k in tempObj) {
                                if (tempObj.hasOwnProperty(k) && tempObj[k] && tempObj[k].token && tempObj[k].token !== "") {
                                    foundToken = tempObj[k].token;
                                    break;
                                }
                            }
                        }
                        if (!foundToken) {
                            var adminKey = "ADMIN_X_TOKEN";
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

        QYLogs.log(TAG, "[loadActivityDataViaRest] calling getAllActivityData");
        try {
            if (!AppWebApi || typeof AppWebApi.getAllActivityData !== "function") {
                QYLogs.error(TAG, "[loadActivityDataViaRest] getAllActivityData 方法不存在，使用空数据兜底");
                self._allData = self.formatActivityData({ actTypeList: [], actList: [] });
                self.initToggle(self._allData);
                return;
            }
        } catch (eCheck) {}

        AppWebApi.getAllActivityData(function(err, restData){
            if (err) {
                QYLogs.error(TAG, "[loadActivityDataViaRest] getAllActivityData failed:", err && err.errorMessage ? err.errorMessage : err);
                self._allData = self.formatActivityData({ actTypeList: [], actList: [] });
                self.initToggle(self._allData);
                return;
            }
            var data = self._mapRestToActivityData(restData);
            self._allData = self.formatActivityData(data);
            QYLogs.log(TAG, "[loadActivityDataViaRest] 整理后的数据:", JSON.stringify(self._allData));
            self.initToggle(self._allData);
        });
    },

    loadActivityData: function(url) {
        var self = this;
        cc.loader.load({ url: url, type: 'json' }, function(err, json) {
            if (err) {
                cc.error("加载活动数据失败:", err);
                return;
            }

            var data = json;

            self._allData = self.formatActivityData(data);
            
            cc.log("整理后的数据:",  self._allData);
            self.initToggle(self._allData);
        });
    },

    initToggle: function(_allData){
        var cloneToggleItem = this.node.getChildByName("content").getChildByName("toggleScollView").getChildByName("view").getChildByName("toggleItem")
        var cloneToggleParent = this.node.getChildByName("content").getChildByName("toggleScollView").getChildByName("view").getChildByName("content")
        // cloneToggleParent.destroyAllChildren(false);
        cloneToggleItem.active = false
        this.toggleList = []
        var children = cloneToggleParent.children;
        var length = Math.max(children.length, _allData.length);
        var self = this;
        for (var index = 0; index < length; index++) {
            var cloneToggle = children[index];
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
            
            cloneToggle.off(cc.Node.EventType.TOUCH_END, null, this);
            (function(toggleNode, idx){
                cloneToggle.on(cc.Node.EventType.TOUCH_END, function(event){
                    self.onClickToggle(event, idx);
                }, self);
            })(cloneToggle, index);
        }

        this.onClickToggle(null,0);
    },

    formatActivityData: function(data) {
        if (!data || !data.actTypeList || !data.actList) {
            return [];
        }
        var typeList = data.actTypeList.slice(); // 复制
        var actList = data.actList.slice();
        typeList.sort(function(a, b) { return a.sort - b.sort; });
        actList.sort(function(a, b) { return a.sort - b.sort; });

        var now = Date.now(); // 当前时间戳

        var result = [];//活动页签
        for (var i = 0; i < typeList.length; i++) {
            var type = typeList[i];

            var acts = actList
                .filter(function(act) { return act.type_id === type.id; })
                .filter(function(act) {
                    // 时间戳 过滤
                    return now >= act.startTime && now <= act.endTime;
                })
                .map(function(act) {
                    return {
                        ID: act.ID,
                        name: act.name,
                        url: act.url,
                        image: act.image,
                        state: act.state,
                        sort: act.sort,
                        startTime: act.startTime,
                        endTime: act.endTime,
                    };
                })
                .sort(function(a, b) { return a.sort - b.sort; });

            result.push({
                id: type.id,
                name: type.name,
                sort: type.sort,
                state: type.state,
                actList: acts
            });
        }

        // 全部活动
        var allActs = actList
            .filter(function(act) {
                // 时间过滤
                return now >= act.startTime && now <= act.endTime;
            })
            .map(function(act) {
                return {
                    ID: act.ID,
                    name: act.name,
                    url: act.url,
                    image: act.image,
                    state: act.state,
                    sort: act.sort,
                    startTime: act.startTime,
                    endTime: act.endTime
                };
            })
            .sort(function(a, b) { return a.sort - b.sort; });

        result.unshift({
            id: 0,
            name: "全部活动",
            sort: 0,
            state: 1,
            actList: allActs
        });

        return result;
    },

    onDestroy: function(){
     
    },

    _updateTitleText: function() {
        var self = this;
        var trySetTitle = function(node) {
            if (!node) return false;
            var label = node.getComponent(cc.Label);
            if (label) {
                label.string = "哈希德州活动";
                return true;
            }
            return false;
        };

        var pathsToTry = [
            function() { return self.node.getChildByName("title"); },
            function() { var bg = self.node.getChildByName("bg"); return bg ? bg.getChildByName("title") : null; },
            function() { var content = self.node.getChildByName("content"); return content ? content.getChildByName("title") : null; },
        ];
        for (var i = 0; i < pathsToTry.length; i++) {
            try {
                var n = pathsToTry[i]();
                if (trySetTitle(n)) return;
            } catch (e) {}
        }
        // 兜底：遍历根节点子节点查找叫 title 的 Label
        try {
            var allNodes = [self.node];
            while (allNodes.length > 0) {
                var cur = allNodes.shift();
                var children = cur.children;
                for (var j = 0; j < children.length; j++) {
                    var ch = children[j];
                    if (ch.name === "title" || ch._name === "title") {
                        if (trySetTitle(ch)) return;
                    }
                    allNodes.push(ch);
                }
            }
        } catch (e2) {}
    },

    init: function(control){
        var self = this;
        try {
            this._updateTitleText();
        } catch (eTitle) {
            QYLogs.error("HallActivityMain", "更新标题失败:", eTitle.message);
        }
        this.hideAllWenView();
        this.control = control;
        if (this.webView && this.webView.node) {
            this.webView.node.active = false;
        }
        try {
            this.loadActivityDataViaRest();
        } catch (eInit) {
            QYLogs.error("HallActivityMain", "init 异常:", eInit.message);
            this._allData = this.formatActivityData({ actTypeList: [], actList: [] });
            try { this.initToggle(this._allData); } catch (et) {}
        }
    },

     
    hideAllWenView: function(){
        for (var i = 0; i < this.webViewNodeList.length; i++) {
            if (this.webViewNodeList[i]) {
                this.webViewNodeList[i].active = false;
            }
        }
    },

    
    openWebView: function(_url,actID){ 
        if(this.webViewNodeList[actID]){
            this.webViewNodeList[actID].active = true
        }else{
            var webViewNode = cc.instantiate(this.webView.node);
            webViewNode.parent = this.webView.node.parent;
            this.webViewNodeList[actID] = webViewNode
            webViewNode.getComponent(cc.WebView).url = _url +"&date=" + new Date().getTime();
            webViewNode.active = true
        }
        //原有逻辑
        // this.webView.node.active = true
        // this.webView.url = _url +"&date=" + new Date().getTime();

    },  

    hideWebView: function(event){
        if (event && event.currentTarget && event.currentTarget.parent) {
            event.currentTarget.parent.active = false;
        }
        //原有逻辑
        // this.webView.url = ""
        // this.webView.node.active = false
    },

    onClickActivityItem: function(data){
        if(data.url){
            this.openWebView(data.url,data.ID)
        }
    },


    //======================= new ==============================

    onClickToggle: function(event,index){
        for (var i = 0; i < this.toggleList.length; i++) {
            if (!this.toggleList[i]) continue;
            var selNode = this.toggleList[i].getChildByName("seleted");
            var labNode = this.toggleList[i].getChildByName("label");
            if (selNode) selNode.active = (i == index);
            if (labNode) labNode.active = (i != index);
        }
        this.selectToggleIdx = index

        this.createContentItem(this.selectToggleIdx)
    },

    createContentItem: function(){
        var self = this;
        var cloneActivityItem = this.node.getChildByName("content").getChildByName("item")
        var clonActivityParent = this.node.getChildByName("content").getChildByName("activityScollView").getChildByName("view").getChildByName("content")
        clonActivityParent.destroyAllChildren(false);
        cloneActivityItem.active = false
        if (!this._allData || !this._allData[this.selectToggleIdx] || !this._allData[this.selectToggleIdx].actList) {
            return;
        }
        var actList = this._allData[this.selectToggleIdx].actList
        for (var index = 0; index < actList.length; index++) {
            var cloneItem = cc.instantiate(cloneActivityItem);
            clonActivityParent.addChild(cloneItem);
            cloneItem.active = true
            cloneItem.x = 0;
            // cloneToggle.getChildByName("label").getComponent(cc.Label).string = data[index].name
            if(actList[index].image){
                // actList[index].image = "http://192.168.31.173:8060/activityDir/tu_0002.png"
                (function(imgUrl, itemNode){
                    cc.loader.load({ url: imgUrl, type: 'png' }, function(err, tex) {
                        if (!err && tex && cc.isValid(itemNode)) {
                            itemNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(tex)
                        }
                    });
                })(actList[index].image, cloneItem);
            }
            
            (function(actData){
                cloneItem.on(cc.Node.EventType.TOUCH_END, function(event) {
                    var now = Date.now(); // 当前时间戳
                    if(now >= actData.startTime && now <= actData.endTime){
                        self.onClickActivityItem(actData);
                    }else{
                         UIFrame.showTips("活动已结束")
                    }
                }, self);
            })(actList[index]);
        }
    },


    onClickActivityItem: function(act){
        
        if (act.url && act.url.length > 0) {
                // act.url = "http://192.168.31.173:8060/activityDir/activityIndex.html"
                this.openWebView(act.url,act.ID)
        }else {
            UIFrame.showTips("活动已结束")
        }
       
        // UIFrame.showTips("活动暂未开启")
    }

});
