// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: 场景管理
// ]]

let EventManager = require("EventManager");
let Target = EventManager.Target;
let Event = EventManager.Event;
let env = require("EnvironmentManager").default;
let queue_scenes = [];
let MsgManager = require("MsgManager");
let Msg = require("Msg");
let UIFrame = null;
try {
    UIFrame = require("UIFrame");
    if (UIFrame && UIFrame.default) UIFrame = UIFrame.default;
} catch (eUIFrame) {
    UIFrame = null;
}
let i18n = null;
try {
    i18n = require("i18n");
    if (i18n && i18n.default) i18n = i18n.default;
} catch (eI18n) {
    i18n = null;
}

function _getUIFrame() {
    if (window.app && window.app.ui && typeof window.app.ui.clearAllBlock === "function") {
        return window.app.ui;
    }
    if (UIFrame && typeof UIFrame.clearAllBlock === "function") {
        return UIFrame;
    }
    return null;
}
function _uiClearAllBlock() {
    try {
        var ui = _getUIFrame();
        if (ui && typeof ui.clearAllBlock === "function") { ui.clearAllBlock(); return; }
        if (window.UIFrame && typeof window.UIFrame.clearAllBlock === "function") { window.UIFrame.clearAllBlock(); return; }
        var lcs = cc.find && cc.find("Canvas");
        if (lcs) { for (var ci = lcs.childrenCount - 1; ci >= 0; ci--) { var c = lcs.children[ci]; if (c && c.name && (c.name.indexOf("Loading") >= 0 || c.name.indexOf("loading") >= 0 || c.name.indexOf("Block") >= 0 || c.name.indexOf("block") >= 0)) { c.active = false; } } }
    } catch (e) { try { console.error("SceneManager _uiClearAllBlock ex:", e && e.message ? e.message : e); } catch (e2) {} }
}
function _uiShowBlockText(text, dotAnimation, onClick) {
    try {
        var ui = _getUIFrame();
        if (ui && typeof ui.showBlockText === "function") { ui.showBlockText(text, !!dotAnimation, onClick, -1); return; }
        if (UIFrame && typeof UIFrame.showBlockText === "function") { UIFrame.showBlockText(text, !!dotAnimation, onClick, -1); return; }
        try {
            var my = require("my");
            if (my && my.ui && typeof my.ui.showBlockText === "function") { my.ui.showBlockText(text, !!dotAnimation, onClick, -1); return; }
        } catch (eMy) {}
        if (window.alert) { try { window.alert(text); if (typeof onClick === "function") onClick(); } catch (eA) {} }
    } catch (e) { try { console.error("SceneManager _uiShowBlockText ex:", e && e.message ? e.message : e); } catch (e2) {} }
}
function _getI18n(key, def) {
    try {
        if (!def) def = "";
        if (window.app && window.app.i18n && typeof window.app.i18n.t === "function") { var r = window.app.i18n.t(key); if (r && r !== key) return r; }
        if (i18n && typeof i18n.t === "function") { var r2 = i18n.t(key); if (r2 && r2 !== key) return r2; }
    } catch (e) {}
    return def;
}

let SceneManager = function (params) {
    this._indexScene = 0;
    this._handler = null;
    this.name = "SceneManager";
    this._retryCount = 0;
    this._MAX_RETRY = 2;
}

let proto = SceneManager.prototype;
proto.load = function (params) {
}
proto.destroy = function (params) {
}

proto.getIndex = function (params) {
    return this._indexScene;
}

// 加载场景预处理
proto.setHandler = function (handler) {
    this._handler = handler;
}

/**
 * 加载场景
 * sceneName: 场景名称
 * options = {
     onLaunched: function(empty, scene),
     onProgress: function(completedCount, totalCount, item),
     onLoaded: function(error),
 }
 */
proto.loadScene = function (sceneName, options) {
    window.logTimestamp("SceneManager.js '" + sceneName + "' loadScene start");

    options = options || {};
    if (this._handler) {
        if (this._handler(sceneName, options)) {
            return;
        }
    }

    if (queue_scenes.length >= 2) {//同时最多只允许两个加载场景进入队列
        cc.log(this.name, "loadScene 同时最多只能有两个加载场景队列。sceneName=" + sceneName, queue_scenes.map(item => item.sceneName));
        queue_scenes.pop();
    }
    else if (queue_scenes.length == 1) {
        if (!queue_scenes[0].loading) {
            cc.log(this.name, "loadScene 第一个场景尚未开始加载，已移除。sceneName=" + queue_scenes[0].sceneName);
            queue_scenes.shift();
        }
        else if (queue_scenes[0].sceneName == sceneName) {
            cc.log(this.name, "loadScene 忽略重复加载同一个场景。sceneName=" + sceneName);
            return; //忽略重复加载同一个场景
        }
    }

    console.log("  queue_scenes sceneName:" + sceneName);
    
    queue_scenes.push({
        loading: false,
        sceneName: sceneName,
        options: options || {},
    });

    let item_loading = queue_scenes[0];
    if (item_loading.loading) {//第一个场景已经在加载
        cc.log(this.name, "loadScene 当前已存在加载场景：sceneName=" + item_loading.sceneName);
        return;
    }

    //直播独立项目
    if (env.get("IS_LIVE_ONLY")) {
        this._loadScene(item_loading);
    }
    else {
        this._preloadScene(item_loading);
    }
}

/**
 * 预加载场景
 * sceneName: 场景名称
 * options = {
     onProgress: function(completedCount, totalCount, item),
     onLoaded: function(error, asset),
 }
 */
proto.preloadScene = function (sceneName, options) {
    window.logTimestamp("SceneManager.js '" + sceneName + "' preloadScene start");

    Target.emit(Event.LOAD_SCENE_START, {
        sceneName: sceneName,
        sceneIndex: options.sceneIndex,
        onCancel: options.onCancel,
    })
    let self = this;
    let onProgress = function (completedCount, totalCount, item) {
        if (options.onProgress) {
            options.onProgress(completedCount, totalCount, item);
        }
        let percent = 0;
        if (totalCount > 0) {
            percent = completedCount / totalCount;
            percent = percent.toFixed(2);
        }

        Target.emit(Event.LOAD_SCENE_PERCENT, {
            sceneName: sceneName,
            sceneIndex: options.sceneIndex,
            percent: percent,
        })
    };

    let onLoaded = function (error) {
        window.logTimestamp("SceneManager.js '" + sceneName + "' preloadScene onLoaded");

        Target.emit(Event.LOAD_SCENE_END, {
            sceneName: sceneName,
            sceneIndex: options.sceneIndex,
        })

        if (options.onLoaded) {
            options.onLoaded(error);
        }
    }
    // cc.director.preloadScene(sceneName, onProgress, onLoaded);
    var bundle = cc.assetManager.bundles.find(function (bundle) {
        return bundle.getSceneInfo(sceneName);
    });
    if (bundle) {
        // this.emit(cc.Director.EVENT_BEFORE_SCENE_LOADING, sceneName);
        // this._loadingScene = sceneName;
        // var self = this;
        //  //console.time('LoadScene ' + sceneName);
        bundle.loadScene(sceneName, null, onProgress, onLoaded);
        return true;
    }
    else {
        cc.errorID(1209, sceneName);
        return false;
    }
}

/**
 * 
 * @param {Object} item 
 * item = {
 *      loading: false,
 *      sceneName: sceneName,
 *      options : {
 *          onLaunched: function(empty, scene),
 *          onProgress: function(completedCount, totalCount, item),
 *          onLoaded: function(error),
 *      }
 *  }
 */
proto._preloadScene = function (item) {
    let self = this;


    let _indexScene = self._indexScene;
    let sceneName = item.sceneName;

    item.loading = true;
    let options = item.options;
    options.sceneIndex = _indexScene;
    let options_onLoaded = options.onLoaded;
    let time_start = Date.now();

    let isCancel = false;

    let _onLoaded = function (error) {
        try {
            let time_end = Date.now();
            let time_interval = (time_end - time_start) / 1000;
            let scene_name = item.sceneName;
            cc.log(self.name, "加载场景用时：time=" + time_interval + "(s)", "scene_name: " + scene_name);

            window.logTimestamp("SceneManager.js '" + scene_name + "' _preloadScene onLaunched");

            if (isCancel) {
                cc.log(self.name, "加载场景已提前取消: scene_name: " + scene_name);
                return;
            }

            queue_scenes.shift();
            if (queue_scenes.length == 0) {
                try { options_onLoaded && options_onLoaded(error); } catch (eOL) { cc.error(self.name, "options_onLoaded ex:", eOL && eOL.message ? eOL.message : eOL); }
                if (error) {
                    cc.error(self.name, "loadScene 加载场景出错：error=", error);
                    _uiClearAllBlock();
                    if (self._retryCount < self._MAX_RETRY) {
                        self._retryCount++;
                        cc.warn(self.name, "场景加载失败，自动重试 " + self._retryCount + "/" + self._MAX_RETRY + " scene=" + scene_name);
                        var retryItem = {
                            loading: false,
                            sceneName: scene_name,
                            options: JSON.parse(JSON.stringify(item.options || {})),
                        };
                        retryItem.options.onLoaded = options_onLoaded;
                        queue_scenes.push(retryItem);
                        self._preloadScene(queue_scenes[0]);
                        return;
                    }
                    self._retryCount = 0;
                    var tip = "场景加载失败(" + scene_name + ")";
                    var i18nTip = _getI18n("COMMON.LOAD_FAIL", "");
                    if (i18nTip && i18nTip !== "COMMON.LOAD_FAIL") tip = i18nTip;
                    _uiShowBlockText(tip + "\n点击屏幕任意处刷新重试", false, function () {
                        try {
                            if (window && window.location && typeof window.location.reload === "function") {
                                window.location.reload(true);
                            }
                        } catch (eRL) { try { if (window && window.history && window.history.go) window.history.go(0); } catch (eHG) {} }
                    });
                    return;
                }
                self._retryCount = 0;

                console.log(" cc.director.loadScene:" + scene_name);
                try {
                    cc.director.loadScene(scene_name, function (empty, scene) {
                        try {
                            self._indexScene++;
                            options.onLaunched && options.onLaunched(empty, scene);
                            self._onLaunchedScene(scene_name, options);
                        } catch (eLS) {
                            cc.error(self.name, "cc.director.loadScene cb ex:", eLS && eLS.message ? eLS.message : eLS);
                            _uiClearAllBlock();
                            var tip2 = "场景启动失败(" + scene_name + ")\n点击屏幕任意处刷新重试";
                            _uiShowBlockText(tip2, false, function () { try { window.location.reload(true); } catch (e2) {} });
                        }
                    });
                } catch (eDL) {
                    cc.error(self.name, "cc.director.loadScene ex:", eDL && eDL.message ? eDL.message : eDL);
                    _uiClearAllBlock();
                    var tip3 = "场景启动失败(" + scene_name + ")\n点击屏幕任意处刷新重试";
                    _uiShowBlockText(tip3, false, function () { try { window.location.reload(true); } catch (e3) {} });
                }
            }
            else {
                let item_next = queue_scenes[0];
                cc.log(self.name, "loadScene 第一个场景" + scene_name + "加载完成。继续加载第二个场景：sceneName=" + item_next.sceneName);
                self._preloadScene(item_next);
            }
        } catch (eOuter) {
            try {
                cc.error(self.name, "_onLoaded 总兜底异常:", eOuter && eOuter.message ? eOuter.message : eOuter);
                _uiClearAllBlock();
                var tip4 = "场景加载异常\n点击屏幕任意处刷新重试";
                _uiShowBlockText(tip4, false, function () { try { window.location.reload(true); } catch (e4) {} });
            } catch (eFinal) {}
        }
    }
    let _onCancel = function () {
        Target.emit(Event.LOAD_SCENE_CANCEL, {
            sceneName: sceneName,
            sceneIndex: _indexScene,
        })

        isCancel = true;
        let time_end = Date.now();
        let time_interval = (time_end - time_start) / 1000;
        cc.log(self.name, "loadScene 场景加载已取消。加载场景用时：time=" + time_interval + "(s)", "scene_name: " + item.sceneName);
        queue_scenes.shift();
    }


    options.onLoaded = _onLoaded;
    options.onCancel = _onCancel;

    self.preloadScene(item.sceneName, options);
}

/**
 * 
 * @param {Object} item 
 * item = {
 *      loading: false,
 *      sceneName: sceneName,
 *      options : {
 *          onLaunched: function(empty, scene),
 *          onProgress: function(completedCount, totalCount, item),
 *          onLoaded: function(error),
 *      }
 *  }
 */
proto._loadScene = function (item) {
    let self = this;


    let _indexScene = self._indexScene;
    let sceneName = item.sceneName;

    item.loading = true;
    let options = item.options;
    options.sceneIndex = _indexScene;

    let time_start = Date.now();
    let onLaunched = function (error, scene) {
        try {
            self._indexScene++;
            let time_end = Date.now();
            let time_interval = (time_end - time_start) / 1000;
            let scene_name = item.sceneName;
            cc.log(self.name, "加载场景用时：time=" + time_interval + "(s)", "scene_name: " + scene_name);

            window.logTimestamp("SceneManager.js '" + scene_name + "' _loadScene onLaunched");

            queue_scenes.shift();
            Target.emit(Event.LOAD_SCENE_END, {
                sceneName: scene_name,
                sceneIndex: options.sceneIndex,
            })

            if (queue_scenes.length == 0) {
                if (error) {
                    cc.error(self.name, "loadScene 加载场景出错：error=", error);
                    _uiClearAllBlock();
                    if (self._retryCount < self._MAX_RETRY) {
                        self._retryCount++;
                        cc.warn(self.name, "场景启动失败，自动重试 " + self._retryCount + "/" + self._MAX_RETRY + " scene=" + scene_name);
                        var retryItem = {
                            loading: false,
                            sceneName: scene_name,
                            options: JSON.parse(JSON.stringify(item.options || {})),
                        };
                        queue_scenes.push(retryItem);
                        self._loadScene(queue_scenes[0]);
                        return;
                    }
                    self._retryCount = 0;
                    var tip = "场景加载失败(" + scene_name + ")";
                    var i18nTip = _getI18n("COMMON.LOAD_FAIL", "");
                    if (i18nTip && i18nTip !== "COMMON.LOAD_FAIL") tip = i18nTip;
                    _uiShowBlockText(tip + "\n点击屏幕任意处刷新重试", false, function () {
                        try {
                            if (window && window.location && typeof window.location.reload === "function") {
                                window.location.reload(true);
                            }
                        } catch (eRL2) { try { if (window && window.history && window.history.go) window.history.go(0); } catch (eHG2) {} }
                    });
                    return;
                }
                self._retryCount = 0;
                try { options.onLaunched && options.onLaunched(error, scene); } catch (eOL2) { cc.error(self.name, "options.onLaunched ex:", eOL2 && eOL2.message ? eOL2.message : eOL2); }
                self._onLaunchedScene(scene_name, options);
            }
            else {
                let item_next = queue_scenes[0];
                cc.log(self.name, "loadScene 第一个场景" + scene_name + "启动完成。继续启动第二个场景：sceneName=" + item_next.sceneName);
                self._loadScene(item_next);
            }
        } catch (eOuter2) {
            try {
                cc.error(self.name, "_loadScene onLaunched 总兜底异常:", eOuter2 && eOuter2.message ? eOuter2.message : eOuter2);
                _uiClearAllBlock();
                var tip5 = "场景启动异常\n点击屏幕任意处刷新重试";
                _uiShowBlockText(tip5, false, function () { try { window.location.reload(true); } catch (e5) {} });
            } catch (eFinal2) {}
        }
    }
    Target.emit(Event.LOAD_SCENE_START, {
        sceneName: sceneName,
        sceneIndex: options.sceneIndex,
        noPercent: true,
    })

    console.log(" cc.director.loadScene 0000:" + sceneName);
    try {
        cc.director.loadScene(sceneName, onLaunched);
    } catch (eDL2) {
        try {
            cc.error(self.name, "cc.director.loadScene ex:", eDL2 && eDL2.message ? eDL2.message : eDL2);
            _uiClearAllBlock();
            var tip6 = "场景启动异常\n点击屏幕任意处刷新重试";
            _uiShowBlockText(tip6, false, function () { try { window.location.reload(true); } catch (e6) {} });
        } catch (eFinal3) {}
    }
}

proto._onLaunchedScene = function (sceneName, options) {
    window.logTimestamp("SceneManager.js '" + sceneName + "' _onLaunchedScene");

    Target.emit(Event.LOAD_SCENE_LAUNCH, {
        sceneName: sceneName
    });
    MsgManager.fire(Msg.UIMANAGER.CLEAR_UIMANAGE_RES);//清除UIManager资源
    // cc.sys.garbageCollect();
}

/**
 * 创建并加载一个空场景
 * @param {Function} cb (empty, scene)
 */
proto.loadEmpty = function (onLoad, onLaunch) {
    var scene = new cc.Scene("[EMPTY]");
    var root = new cc.Node("Canvas");
    root.parent = scene;
    var widget = root.addComponent(cc.Widget);
    widget.isAlignTop = true;
    widget.isAlignBottom = true;
    widget.isAlignLeft = true;
    widget.isAlignRight = true;
    widget.top = 0;
    widget.bottom = 0;
    widget.left = 0;
    widget.right = 0;
    var canvas = root.addComponent(cc.Canvas);
    canvas.fitHeight = false;
    canvas.fitWidth = true;
    let design = env.get("design");
    let winSize = cc.size(window.innerWidth, window.innerHeight);
    // let width = winSize.width > winSize.height ? design.width : design.height;
    // let height = winSize.width > winSize.height ? design.height : design.width;
    canvas.designResolution = cc.size(750, 1334);
    var camera = new cc.Node("Main Camera");
    camera.parent = root;
    camera = camera.addComponent(cc.Camera);
    camera.backgroundColor = new cc.Color(0, 0, 0, 0);

    cc.director.runSceneImmediate(scene, function () {
        onLoad && onLoad();
    }, function (empty, s) {
        onLaunch && onLaunch(empty, s);
    });
}

SceneManager.default = new SceneManager(null);
module.exports = SceneManager;