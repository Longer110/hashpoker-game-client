let my = require("my");
let app = require("App");
let UIFrame = require("UIFrame");

class AppComponent extends cc.Component {
    name = "AppComponent";
    _sceneBase = null;
    _blockIndex = 0;
    _blockList = [];
    _cacheScenes = {};
    _cacheBundles = {};
    _timeoutid = 0;
    _timestamp = 0;

    constructor(){
        super();
    }
    onLoad(){
        this._initScene(cc.director.getScene());
        this._initUI();
        my.target.on(my.event.AFTER_LAUNCH, this._afterLaunch, this);
        my.target.on(my.event.LOAD_WRAPPER_START, this._onLoadWrapperStart, this);
        my.target.on(my.event.LOAD_WRAPPER_END, this._onLoadWrapperEnd, this);
        my.target.on(my.event.LOAD_SCENE_START, this._onLoadSceneStart, this);
        my.target.on(my.event.LOAD_SCENE_END, this._onLoadSceneEnd, this);
        my.target.on(my.event.LOAD_SCENE_LAUNCH, this._onLoadSceneLaunch, this);
        my.target.on(my.event.LOAD_SCENE_CANCEL, this._onLoadSceneCancel, this);
        my.target.on(my.event.LOAD_SCENE_PERCENT, this._onLoadScenePercent, this);
        my.target.on(my.event.LOAD_POPUP_START, this._onLoadPopupStart, this);
        my.target.on(my.event.LOAD_POPUP_END, this._onLoadPopupEnd, this);


        my.target.on(my.event.LOAD_DOWNLOAD_SHOW, this._onLoadDownloadShow, this);
        my.target.on(my.event.LOAD_DOWNLOAD_PERCENT, this._onLoadDownloadPercent, this);
        my.target.on(my.event.LOAD_DOWNLOAD_HIDE, this._onLoadDownloadHide, this);
    }
    onDestroy(){
        my.target.targetOff(this);
        app.native.removeRollback(this, this._onRollback);
    }

    _initUI(){
        // this._loadUIAtlas();
        // --this._loadBackground();
        this._initDefaultUIPool();
        this._loadUIBlockLoading();
        if(app.config.ISDEVELOP){
            this._loadUIAppPanel();
        }

        app.native.addRollback(this, this._onRollback);
    }

    _onRollback(){
        let t = Date.now();
        //一定时间内退出游戏
        const second = 2;
        if(t - this._timestamp < 1000 * second){
            QYLogs.log("AppComponent", "_onRollback", "退出游戏");
            if(cc.sys.isNative){
                cc.game.end();    
            }
            else if(cc.sys.isBrowser){
                window.location.reload();
            }
        }
        else{
            QYLogs.log("AppComponent", "_onRollback", "再按一次退出游戏");
            this._timestamp = t;
            let text = app.i18n.t("COMMON.TAP_TO_EXIT");
            let key = "tap_to_exit";
            app.ui.showTips(text);
        }
    }

    _initScene(scene){
        this._sceneBase = null;
        if(scene){
            let canvas = scene.getChildByName("Canvas");
            if(canvas){
                let _sceneBase = canvas.getComponent("SceneBase");
                this._sceneBase = _sceneBase;
            }
        }
    }
    _afterLaunch(scene){
        this._initScene(scene);
    }
    _isValidFunc(func){
        if(typeof func == 'function'){
            return true;
        }
        return false;
    }

    /**
     * 
     * @param {Object} data {bundleName}
     */
    _onLoadWrapperStart(data){
        if(cc.isValid(this._sceneBase)){
            if(this._isValidFunc(this._sceneBase._onLoadWrapperStart)){
                let handled = this._sceneBase._onLoadWrapperStart(data);
                if(handled) return;
            }
        }

        if(!this._cacheBundles[data.bundleName]){
            this._showLoading(true, "");
        }
    }
    /**
     * 
     * @param {Object} data {bundleName, success}
     */
    _onLoadWrapperEnd(data){
        if(data.success && !this._cacheBundles[data.bundleName]){
            this._cacheBundles[data.bundleName] = 1;
        }

        if(cc.isValid(this._sceneBase)){
            if(this._isValidFunc(this._sceneBase._onLoadWrapperEnd)){
                let handled = this._sceneBase._onLoadWrapperEnd(data);
                if(handled){
                    if(this._blockIndex>0){
                        this._hideLoading(true);
                    }
                    return;
                };
            }
        }

        if(!data.success){
            this._hideLoading(true);
            return;
        }
        
        // this._hideLoading(true);

        let delay = 0.5;
        //延迟执行，避免场景加载随后开始造成loading闪一下
        let _blockIndex = this._blockIndex;
        this._blockIndex = 0;
        this._blockList.push(_blockIndex);

        if(this._timeoutid){
            clearTimeout(this._timeoutid);
        }
        this._timeoutid = setTimeout(() => {
            this._clearLoading();
        }, 1000*delay);
    }

    /**
     * 
     * @param {Object} data {sceneName, sceneIndex}
     */
    _onLoadSceneStart(data){
        if(cc.isValid(this._sceneBase)){
            if(this._isValidFunc(this._sceneBase._onLoadSceneStart)){
                let handled = this._sceneBase._onLoadSceneStart(data);
                if(handled){
                    this._clearLoading();
                    return;
                }
            }
        }

        if(!this._cacheScenes[data.sceneName]){
            this._showLoading(true, data.noPercent ? "" : null);
        }
        this._clearLoading();
    }
    /**
     * 
     * @param {Object} data {sceneName, sceneIndex}
     */
    _onLoadSceneEnd(data){
        if(!this._cacheScenes[data.sceneName]){
            this._cacheScenes[data.sceneName] = 1;
        }

        this._clearLoading();

        if(data.sceneName.indexOf("hall")>=0){
            app.util.setOrientation(false);
        }

        if(cc.isValid(this._sceneBase)){
            if(this._isValidFunc(this._sceneBase._onLoadSceneEnd)){
                let handled = this._sceneBase._onLoadSceneEnd(data);
                if(handled){
                    if(this._blockIndex>0){
                        this._hideLoading(true);
                    }
                    return;
                };
            }
        }

        // this._hideLoading(true);
    }
    /**
     * 
     * @param {Object} data {sceneName, sceneIndex}
     */
    _onLoadSceneLaunch(data){
        this._hideLoading(true);
    }

    /**
     * 
     * @param {Object} data {sceneName, sceneIndex}
     */
    _onLoadSceneCancel(data){
        if(cc.isValid(this._sceneBase)){
            if(this._isValidFunc(this._sceneBase._onLoadSceneCancel)){
                let handled = this._sceneBase._onLoadSceneCancel(data);
                if(handled) return;
            }
        }

    }
    /**
     * 
     * @param {Object} data {sceneName, sceneIndex, percent}
     */
    _onLoadScenePercent(data){
        if(cc.isValid(this._sceneBase)){
            if(this._isValidFunc(this._sceneBase._onLoadScenePercent)){
                let handled = this._sceneBase._onLoadScenePercent(data);
                if(handled) return;
            }
        }

        app.ui.setLoadingPercent(data.percent);
    }

    /**
     * 
     * @param {Object} data {popupName}
     */
    _onLoadPopupStart(data){
        this._showLoading();
    }

    /**
     * 
     * @param {Object} data {popupName, success} 
     */
    _onLoadPopupEnd(data){
        this._hideLoading();
    }

    _onLoadPopupStart(data){
        this._showLoading();
    }

    _onLoadDownloadShow(data){
        if (app.config.IS_CLUB_ONLY){
            return;
        }
        this._showDownload(true,data.percent);
    }

    _onLoadDownloadPercent(data){
    
        app.ui.showDownloadPercent(data.percent);
    }

    _onLoadDownloadHide(data){
        this._hideLoading(true);
    }

    _showDownload(show_percent,percent){
        this._hideLoading(true);
        this._blockIndex = app.ui.showLoading(app.i18n.t("COMMON.XIA_ZAI_ZHONG"));
        if(show_percent){
            app.ui.showDownload(percent);
        }
    }

    _showLoading(show_percent, str_percent){
        this._hideLoading(true);
        this._blockIndex = app.ui.showLoading(app.i18n.t("COMMON.JIA_ZAI_ZHONG"));
        if(show_percent){
            app.ui.showLoadingPercent(str_percent);
        }
    }


    _hideLoading(hide_percent){
        if(this._blockIndex>0){
            app.ui.hideLoading(this._blockIndex);
            if(hide_percent){
                app.ui.hideLoadingPercent();
            }
        }
        this._blockIndex = 0;
    }
    _clearLoading(){
        if(this._timeoutid>0){
            clearTimeout(this._timeoutid);
            this._timeoutid = 0;
        }
        
        let array = this._blockList;
        for (let index = 0; index < array.length; index++) {
            const _blockIndex = array[index];
            if(_blockIndex>0){
                app.ui.hideLoading(_blockIndex);
            }
        }   
        this._blockList.length = 0; 
    }
    
    _loadUIAppPanel (params) {
        let path = "prefab/UIAppPanel";
        let wrapper = app.common;//my.wrapper.getCommon();
        path = wrapper.path(path);
        wrapper.bundle.load(path, cc.Prefab, function (error, prefab) {
            if (error) {
                 //console.error(error);
                return;
            }
    
            let node = cc.instantiate(prefab);
            node.name = "[UIAppPanel]";
            app.node.addChild(node, cc.macro.MAX_ZINDEX-9);
            app.UIAppPanel = node.getComponent("UIAppPanel");
            app.UIAppPanel.init();
            node.active = false
        });
    }
    // _loadUIAtlas(params) {
    //     let path = "prefab/UIAtlas";
    //     let wrapper = app.common;//my.wrapper.getCommon();
    //     path = wrapper.path(path);
    //     wrapper.bundle.load(path, cc.Prefab, function (error, prefab) {
    //         if (error) {
    //              //console.error(error);
    //             return;
    //         }

    //         let node = cc.instantiate(prefab);
    //         node.name = "[UIAtlas]";
    //         app.UIAtlas = node.getComponent("UIAtlas");
    //         app.addRoot(node);
    //     });
    // }
    _loadUIBlockLoading(){
        let loading = require("LoadingBlock");
        loading.setHideCallback(function (params) {
            UIFrame.clearAllBlock();
            app.pauseMusic();
            app.postMessage(app.bridge.EVENT.GAME_HIDE, {
            });
        });
        app.ui.initBlockLoading(loading);
        
        let count = 0;
        let path = "popup/loading/block/LoadingBlock";
        let wrapper = app.common;//my.wrapper.getCommon();
        path = wrapper.path(path);
        let loadRes = function () {
            wrapper.bundle.load(path, cc.Prefab, function (error, prefab) {
                if (error) {
                    count++;
                    if(count<=3){
                        cc.error("UIFrame", "_initUIBlockLoading", "加载资源失败，正在重新加载：count=" + count);
                        loadRes();
                    }
                    else{
                        cc.error("UIFrame", "_initUIBlockLoading", "加载资源失败：error=" + error);
                    }
                    return;
                }
        
                let node = cc.instantiate(prefab);
                app.node.addChild(node, cc.macro.MAX_ZINDEX-10);
                node.position = cc.Vec2.ZERO;
            });
        }
        loadRes();
    }
    
    _initUIPool(config){
        let wrapper = app.common;//my.wrapper.getCommon();
        let _uiPool = wrapper.ui.getUIPool();

        let array = [];
        for (let index = 0; index < config.length; index++) {
            const element = config[index];
            let item = {};
            if(typeof element == "string"){
                item.path = element;
                item.size = 1;
            }
            else{
                item.path = element.path;
                item.size = element.size;
            }
            item.path = wrapper.path(item.path);
            array.push(item);
        }
        _uiPool.loadConfig(array, 1, null, function (index, total, success) {
            //  //console.log("load: ", index, total, success);
            if(index==total){
                //TODO
            }
            else if(!success){
                 //console.error("资源加载失败");
            }
        });
    }

    //直播/合集共用预制体初始化
    _initDefaultUIPool(){
        let config = [
            {path: "prefab/UIFlyText", size:1},  // 1 可指定path路径并指定size大小
            {path: "prefab/TopNotificationManager", size: 1},
            {path: "prefab/SysTopInfoTips", size: 1},
            // "prefab/HallFullScreenTip",       // 2 可直接按字符路径加载，默认size=1
            // "popup/dialog/UIDialog",       // 2 可直接按字符路径加载，默认size=1
        ];

        this._initUIPool(config);
    }

    //合集独用预制体初始化
    initSetUIPool(){
        let config = [
            // {path: "prefab/UIFlyText", size:1},  // 1 可指定path路径并指定size大小
            "prefab/HallFullScreenTip",       // 2 可直接按字符路径加载，默认size=1
            // "popup/dialog/UIDialog",       // 2 可直接按字符路径加载，默认size=1
        ];

        this._initUIPool(config);
    }

    // _loadBackground(params) {
    //     let path = "prefab/AppBackground";
    //     let wrapper = app.common;//my.wrapper.getCommon();
    //     path = wrapper.path(path);
    //     wrapper.bundle.load(path, cc.Prefab, function (error, prefab) {
    //         if (error) {
    //              //console.error(error);
    //             return;
    //         }

    //         let node = cc.instantiate(prefab);
    //         node.name = "[AppBackground]";
    //         App.addRoot(node);
    //     });
    // }
}

module.exports = AppComponent;