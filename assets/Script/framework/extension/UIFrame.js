// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

// [[
//     * @Author:      wangb
//     * @DateTime:    2019-03-25 10:05:23
//     * @Description: UI扩展框架
// ]]

let UIManager = require("UIManager");

let ZORDER_UIFLYTEXT = 2048;

let UIFrame = UIManager.default;
UIFrame._instance = UIFrame;
UIFrame._uiBlockLoading = null;

UIFrame.initBlockLoading = function (loading) {
    UIFrame._uiBlockLoading = loading;
}
UIFrame.initBlockTips = function (tips) {
    
}

UIFrame.isLoaded = function (params) {
    let self = UIFrame._instance;
    if(!self || !self._uiPool || !self._uiBlockLoading) return false;

    return self._uiPool.isLoaded();
}

UIFrame.showTips = function(strText){
    let self = UIFrame._instance;
    if(!self || !self._uiPool) return;
    if(self._listPopup["UIFlyText"]) {
        self._listPopup.UIFlyText.setText(strText)
    }else {
        let parent = app.node;
        let component = self._uiPool.reuse("UIFlyText");
        if(component){
            QYLogs.log("UIFrame", "showTips", strText);
            component.node.x = 0;
            parent.x = cc.winSize.width/2;
            parent.addChild(component.node, cc.macro.MAX_ZINDEX);
            component.setText(strText);
            self._listPopup["UIFlyText"] = component
        }
    }
    
    return;
}

UIFrame.updateBlockContent = function () {
    let self = UIFrame._instance;
    if(!self || !self._uiBlockLoading) return;

    self._uiBlockLoading.updateContent();
}

//onHide = dotAnimation
UIFrame.showBlockText = function(strText, dotAnimation, callback, timeout){
    let self = UIFrame._instance;
    if(!self || !self._uiBlockLoading) return 0;

    if(!app.getCanShowLoading()) return 0;

    let onHide = null;
    if(typeof dotAnimation=='function'){ //直播项目
        onHide = dotAnimation;
        dotAnimation = false;
        callback = null;
        timeout = -1;
    }

    self._uiBlockLoading.setText(strText, dotAnimation,true);
    let blockIndex = self._uiBlockLoading.show(callback, timeout, onHide);
    QYLogs.log("UIFrame", "showBlockText", blockIndex, strText);

    self._uiBlockLoading.updateContentByAppKey(false);

    return blockIndex;
}

UIFrame.hideBlockText = function(blockIndex){
    let self = UIFrame._instance;
    if(!self || !self._uiBlockLoading) return;

    QYLogs.log("UIFrame", "hideBlockText", blockIndex);
    self._uiBlockLoading.hide(blockIndex);
}

UIFrame.showBlock = function(strText, dotAnimation, callback, timeout){
    return UIFrame.showLoading(strText, dotAnimation, callback, timeout);
}

UIFrame.hideBlock = function(blockIndex){
    return UIFrame.hideLoading(blockIndex);
}

UIFrame.showLoading = function (strText, dotAnimation, callback, timeout) {
    let self = UIFrame._instance;
    if(!self || !self._uiBlockLoading) return -1;

    if(!app.getCanShowLoading()) return 0;

    self._uiBlockLoading.setText(strText, dotAnimation);
    let blockIndex = self._uiBlockLoading.show(callback, timeout);
    QYLogs.log("UIFrame", "showLoading", blockIndex, strText);

    self._uiBlockLoading.updateContentByAppKey(true);

    return blockIndex;
}

UIFrame.hideLoading = function (blockIndex){
    let self = UIFrame._instance;
    if(!self || !self._uiBlockLoading) return;

    QYLogs.log("UIFrame", "hideLoading", blockIndex);
    self._uiBlockLoading.hide(blockIndex);
}

UIFrame.setLoadingCancelCallback = function (blockIndex, callback) {
    let self = UIFrame._instance;
    if(!self || !self._uiBlockLoading) return;

    self._uiBlockLoading.setCancelCallback(blockIndex, callback);
}

UIFrame.showLoadingPercent = function (str_percent) {
    let self = UIFrame._instance;
    if(!self || !self._uiBlockLoading) return;

    self._uiBlockLoading.showPercent(str_percent);
}
UIFrame.hideLoadingPercent = function () {
    let self = UIFrame._instance;
    if(!self || !self._uiBlockLoading) return;

    self._uiBlockLoading.hidePercent();
}

UIFrame.setBtnHideVisible = function (visible) {
    let self = UIFrame._instance;
    if(!self || !self._uiBlockLoading) return;

    self._uiBlockLoading.setBtnHideVisible(visible);
}

UIFrame.isLoadingVisible = function () {
    let self = UIFrame._instance;
    if(!self || !self._uiBlockLoading) return false;

    return self._uiBlockLoading.isLoadingVisible();
}

UIFrame.showDownload = function (percent) {
    let self = UIFrame._instance;
    if(!self || !self._uiBlockLoading) return;

    self._uiBlockLoading.showDownload(percent);
}

UIFrame.showDownloadPercent = function (percent) {
    let self = UIFrame._instance;
    if(!self || !self._uiBlockLoading) return;

    self._uiBlockLoading.setDownloadPercent(percent);
}



UIFrame.setLoadingPercent = function (percent) {
    let self = UIFrame._instance;
    // if(typeof self._handleLoadingPercent == 'function'){
    //     self._handleLoadingPercent(percent);
    //     return;
    // }

    if(!self || !self._uiBlockLoading) return;
    self._uiBlockLoading.setPercent(percent);
}

UIFrame.setLoadingPercentHandler = function (handler) {
    cc.errorID(1400, "UIFrame.setLoadingPercentHandler", "my.target.on(my.event.LOAD_SCENE_PERCENT)");
    // let self = UIFrame._instance;
    // if(!self){
    //     return;
    // }

    // self._handleLoadingPercent = handler;
}

UIFrame.showLoginAccount = function () {
    let self = UIFrame._instance;
    if(!self || !self._uiPool) return;


    let path = "prefab/UICheckAccount";
    app.common.ui.loadPopup(path, function (component) {
        app.node.addChild(component.node, 1024);
        component.node.position = cc.Vec2.ZERO;
    }.bind(this));

    return;
}

// UIFrame.isCustomLoading = function (params) {
//     let self = UIFrame._instance;
//     return self._handleLoadingPercent!=null;
// }

UIFrame.clearBlock = function (params) {
    // let self = UIFrame._instance;
    // if(!self || !self._uiBlock) return;

    // return self._uiBlock.clear();
}
UIFrame.clearLoading = function (params) {
    let self = UIFrame._instance;
    if(!self || !self._uiBlockLoading) return;

    return self._uiBlockLoading.clear();
}
UIFrame.clearAllBlock = function (params) {
    UIFrame.clearBlock();
    UIFrame.clearLoading();
}

UIFrame.isPopupByName = function(componentName){
    let self = UIFrame._instance;
    if (!self) return false;

    if(componentName){
        let component = self._listPopup[componentName];
        if(!component){
            return false;
        }

        if(cc.isValid(component)){
            let uibase = component.getComponent("UIBase");
            if(uibase){
                return true
            }else{
                return false
            }
        }else{
            return false
        }
    }else{
        return false
    }
},


// UIFrame.removePopup = function(componentName){
//     let self = UIFrame._instance;
//     if (!self) return;
//     self._removePopup(componentName);
// }

//判断是否已全屏
UIFrame.checkFullScreen = function () {
    if(!document) return true;

    var e = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
    var full = (void 0 === e && (e = !1), e || document.body.scrollHeight == window.screen.height && document.body.scrollWidth == window.screen.width);
    if(!full){
        if (cc.sys.browserType == cc.sys.BROWSER_TYPE_SAFARI) {
            if (document.body.offsetHeight <= Math.round(1.01 * window.innerHeight) && (90 == window.orientation || -90 == window.orientation)){
                full = true;
            } 
        }
    }
    return full;
},

UIFrame.showFullScreenTip = function () {
    let self = UIFrame._instance;
    if(!self || !self._uiPool) return;

    if(!self._uiFullScreen && self._uiPool.isLoaded()){
        let parent = app.node;
        let component = self._uiPool.reuse("HallFullScreenTip");
        if(component){
            parent.addChild(component.node, cc.macro.MAX_ZINDEX-1);
            component.hide();
            self._uiFullScreen = component;
        }
    }
    if(self._uiFullScreen){
        self._uiFullScreen.show();
    }
    
    return;
}

UIFrame.showTopNotification = function (type, data, options) {
    let self = UIFrame._instance;
    if(!self || !self._uiPool) return;

    if(!self._uiNotification && self._uiPool.isLoaded()){
        let parent = app.node;
        let component = self._uiPool.reuse("TopNotificationManager");
        if(component){
            parent.addChild(component.node, cc.macro.MAX_ZINDEX-1);
            component.show(type, data, options)
            self._uiNotification = component;
        }
    }else if(self._uiNotification){
        self._uiNotification.show(type, data, options);
    }
    
    return;
}

UIFrame.showSysTopInfoTips = function (data) {
    let self = UIFrame._instance;
    if(!self || !self._uiPool) return;

    if(!self._uiSysTopInfoTips && self._uiPool.isLoaded()){
        let parent = app.node;
        let component = self._uiPool.reuse("SysTopInfoTips");
        if(component){
            parent.addChild(component.node, cc.macro.MAX_ZINDEX-1);
            component.setData(data)
            self._uiSysTopInfoTips = component;
        }
    }
    if(self._uiSysTopInfoTips){
        self._uiSysTopInfoTips.show();
    }
    
    return;
}

//私人房密码输入
UIFrame.showInputRoomPassword = function(parent,data) {
    //加载InputRoomPassword预制体，并创建InputRoomPassword
    let addRView = () => {
        parent = parent || app.node;
        if (!parent) {
            cc.warn("InputRoomPassword 获取父节点失败");
            return;
        }
        let node = cc.instantiate(this._inputRoomPassPrefab);
        parent.addChild(node, cc.macro.MAX_ZINDEX-1);
        node.getComponent("InputRoomPassword").init(data);
    };
    if (this._inputRoomPassPrefab) {
        addRView();
        return;
    }
    if (this._isLoadingInputRoomPassView) {
        return;
    }
    let wrapper = app.ClubViews;
    if (!wrapper || !wrapper.bundle) {
        cc.warn("InputRoomPassword ClubViews bundle 未就绪");
        return;
    }
    this._isLoadingInputRoomPassView = true;
    let path = "main-hall/Script/hall/view/my/InputRoomPassword";
    this.roomPasswordBlockIndex = UIFrame.showLoading("正在加载...", true);
    wrapper.bundle.load(path, cc.Prefab, function (error, prefab) {
        this._isLoadingInputRoomPassView = false;
        if (error) {
            cc.error("InputRoomPassword 加载预制体失败", error);
            return;
        }
        this._inputRoomPassPrefab = prefab;
        if (!cc.isValid(app.node)) {
            return;
        }
         UIFrame.hideLoading(this.roomPasswordBlockIndex);
        addRView();
    }.bind(this));
}

UIFrame.hideFullScreenTip = function () {
    let self = UIFrame._instance;
    if(!self || !self._uiPool) return;

    if(self._uiFullScreen){
        self._uiFullScreen.hide();
    }
    
    return;
}

UIFrame.isOpenInIosWebview = function () {
    if (0 == cc.sys.isMobile) return !1;
    if (0 == cc.sys.isBrowser) return !1;

    var e = navigator.userAgent,
        t = !(e.match(/Chrome\/([\d.]+)/) || e.match(/CriOS\/([\d.]+)/)) && e.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/);
    return cc.sys.os === cc.sys.OS_IOS ? 1 == t || null != t : void 0
},

UIFrame._testSize = function(){
    let size =      `window: ${window.innerWidth}, ${window.innerHeight}`;
    size += "\n" + `visible: ${cc.visibleRect.width}, ${cc.visibleRect.height}`;
    size += "\n" + `winsize: ${cc.winSize.width}, ${cc.winSize.height}`;
    size += "\n" + `framesize: ${cc.view.getFrameSize().width}, ${cc.view.getFrameSize().height}`;
    size += "\n" + `gameframe: ${cc.game.frame.clientWidth}, ${cc.game.frame.clientHeight}`;
    size += "\n" + `viewsize: ${cc.view._frameSize.width}, ${cc.view._frameSize.height}`;

    UIFrame.showTips(size, "UIFrame._testSize");
}

module.exports = UIFrame;