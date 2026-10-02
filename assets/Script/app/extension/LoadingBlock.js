// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

// [[
//     * @Author:      wangb
//     * @DateTime:    2018-07-18 10:05:23
//     * @Description: 顶层UI触摸拦截控件
// ]]

let DEBUG_BLOCK_LOG = false;

let i18n = require("i18n");

let CALLBACK_HANDLES = [];
let BLOCK_INDEX = 0;
let PERCENT = 0;
let TEXT_INFO = null;

//Loading面板位置
let EPosition = cc.Enum({
    CENTER: 1, //中间
    BOTTOM: 2,  //底部
});


let LoadingBlock = cc.Class({
    extends: cc.Component,

    properties: {
        block: cc.BlockInputEvents,
        loadingBlockBG: cc.Node,
        content: cc.Node,
        loading: cc.Node,
        labelText: cc.Label,
        itemHide: cc.Node,
        PanelMallwin: cc.Node,
        PanelMaxlive: cc.Node,
        PanelClub: cc.Node,
        clubBg: cc.SpriteFrame,
        _textString: "",
        _blockIndex: 0,
        _percent: 0,
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if(LoadingBlock._instance){
            cc.error("LoadingBlock", "重复的实例化组件");
        }
        LoadingBlock._instance = this;
        this._init();
    },

    // start () {
    // },

    lateUpdate(dt) {
        // if(this._dotAnimation && this._labelPanel.active){
        //     this._deltaTimeInterval += dt;

        //     let text = [".","..","...","....",".....","......",];
        //     let num = this._deltaTimeInterval * 1000 / 500;
        //     let index = Math.floor(num)%text.length;
        //     this.labelText.string = this._textString + " " + text[index%text.length];
        // };

        // if (CALLBACK_HANDLES.length > 0) {
        //     let array = CALLBACK_HANDLES;
        //     for (let i = array.length - 1; i >= 0; i--) {
        //         const handle = array[i];
        //         if (handle.timeout > 0) {
        //             handle.interval += dt;
        //             if (handle.interval >= handle.timeout) {
        //                 if (handle.callback) {
        //                     handle.callback()
        //                 }
        //                 LoadingBlock.hide(handle.blockIndex);
        //             }
        //         }
        //     }
        // }
    },

    _init() {
        if(TEXT_INFO){
            LoadingBlock.setText(TEXT_INFO.text, TEXT_INFO.dotAnimation, TEXT_INFO.visible);
            TEXT_INFO = null;
        }
        LoadingBlock.updateContent();
        LoadingBlock._invoke();
    },

    onClickBlock(event, data) {
        if (CALLBACK_HANDLES.length > 0) {
            let array = CALLBACK_HANDLES;
            for (let i = array.length - 1; i >= 0; i--) {
                const handle = array[i];
                if (typeof handle.onCancel == 'function') {
                    handle.onCancel();
                    LoadingBlock.hide(handle.blockIndex);
                }
            }
        }
    },

    onClickHide(event, data){
        if (CALLBACK_HANDLES.length > 0) {
            let array = CALLBACK_HANDLES;
            for (let i = array.length-1; i >= 0; i--) {
                const handle = array[i];
                if(typeof handle.onHide == 'function'){
                    handle.onHide();
                }
            }
        }

        // LoadingBlock.setBtnHideVisible(false);
        if(typeof LoadingBlock._onBtnHideCallback == 'function'){
            LoadingBlock._onBtnHideCallback();
        }
    },

    statics: {
        _instance: null,
        _onBtnHideCallback: null,
        EPosition: EPosition,
        _pos: EPosition.CENTER, //默认居中

        _invoke() {
            // this._deltaTimeInterval = 0;
            let visible = CALLBACK_HANDLES.length > 0 ? true : false;
            let self = LoadingBlock._instance;
            if(!self) return;

            self.node.active = visible;
            // self._labelPanel.active = visible;
            if(!visible){
                self._textString = "";
            }

            LoadingBlock.count();

            if(DEBUG_BLOCK_LOG){
                 //console.error("block _invoke: ", visible);
            }
        },
    
        show(callback, timeout, onHide) {
            LoadingBlock.setBtnHideVisible(false);

            BLOCK_INDEX++;
            let nextIndex = BLOCK_INDEX;
            if(DEBUG_BLOCK_LOG){
                 //console.error("block show:", nextIndex);
            }

            //默认10秒超时
            if (!timeout) {
                timeout = callback ? 10 : 120;
            }
            CALLBACK_HANDLES.push({
                blockIndex: nextIndex,
                interval: 0,
                timeout: timeout,
                callback: callback,
                onHide: onHide,
            })

            LoadingBlock._invoke();

            return nextIndex;
        },

        hide(blockIndex) {
            if(DEBUG_BLOCK_LOG){
                 //console.error("block hide:", blockIndex);
            }

            if (typeof blockIndex != "number") {
                //无效的索引
                 //console.error("[UILoadingBlock]hide error: invalid index", blockIndex);
                return;
            }
            if (blockIndex <= 0) { 
                return;
            }
            
            if (CALLBACK_HANDLES.length > 0) {
                for (let i = CALLBACK_HANDLES.length - 1; i >= 0; i--) {
                    const handle = CALLBACK_HANDLES[i];
                    if (handle.blockIndex == blockIndex) {
                        CALLBACK_HANDLES.splice(i, 1);
                        break;
                    }
                }
            } else {
                 //console.debug("UILoadingBlock: 调用[hide]方法次数多于调用[show]");
            }
            if(DEBUG_BLOCK_LOG){
                 //console.error("block hide _invoke: ", CALLBACK_HANDLES.length, CALLBACK_HANDLES.length>0?true:false);
            }

            LoadingBlock._invoke();
        },

        clear() {
            if(DEBUG_BLOCK_LOG){
                let array = CALLBACK_HANDLES.map((item)=>item.blockIndex);
                let str = "[" + array.join(',') + "]";
                 //console.error("block clear: " + str);
            }

            CALLBACK_HANDLES.length = 0;
            LoadingBlock._invoke();
        },

        count() {
            let str = "[]";
            if(CALLBACK_HANDLES.length>0){
                let array = [];
                for (let index = 0; index < CALLBACK_HANDLES.length; index++) {
                    const item = CALLBACK_HANDLES[index];
                    array.push(item.blockIndex);
                    if(index>=5){
                        array.push("...");
                        break;
                    }
                }
                str = "[" + array.join(',') + "]";
            }
            
            cc.log("LoadingBlock", "count = " + CALLBACK_HANDLES.length + " " + str);
           
            return CALLBACK_HANDLES.length;
        },

        setText(text, dotAnimation, visible) {
            if(DEBUG_BLOCK_LOG){
                 //console.warn("setText in: ", BLOCK_INDEX, "'" + text + "'", visible);
            }

            let self = LoadingBlock._instance;
            if(!self){
                TEXT_INFO = {
                    text,
                    dotAnimation,
                    visible,
                }
                return;
            }

            if (!text || text==""){
                if(CALLBACK_HANDLES.length>0 && self._textString!=""){
                    text = self._textString;
                    visible = true;
                }
                else{
                    text = "";
                }
            }
            
            if(DEBUG_BLOCK_LOG){
                 //console.error("setText: ", BLOCK_INDEX, "'" + text + "'", visible);
            }
    
            if (text == "") {
                self.content.active = false;
            } else {
                self.content.active = true;
            }
            // return;


            if (text == "" || !visible) {
                LoadingBlock.setTextVisible(false);
            } else {
                LoadingBlock.setTextVisible(true);
            }
            self._dotAnimation = !!dotAnimation;
            self._textString = text;

            self.labelText.string = text;
            self.labelText._forceUpdateRenderData();
            let size = self.labelText.node.getContentSize();

            
            let scene = cc.director.getScene()
            let scale = 1
            if(scene){
                let canvas = scene.getChildByName("Canvas") ? scene.getChildByName("Canvas").getComponent(cc.Canvas):null
                if(canvas){
                    let designSize = cc.view.getDesignResolutionSize();
                    let winSize = cc.view.getFrameSize();
                    if(canvas.fitHeight && !canvas.fitWidth && size.width > (winSize.width - self.loading.width - 40)){
                        
                        scale = winSize.width / designSize.width;
                        if(scale > 1){
                            scale = 1
                        }
                    }

                    if (size.width > winSize.width){
                        for (let i = 0; i < text.length; i++) {
                           if(i == Math.ceil(text.length/2)){
                                text = text.slice(0, i) + "\n" + text.slice(i);
                                break;
                           }    
                        }

                        self.labelText.string = text;
                        self.labelText._forceUpdateRenderData();
                        size = self.labelText.node.getContentSize();
                    }
                }
            }

           
            // self.labelText.node.x = -size.width/2;
            // size = cc.size(size.width+300, size.height+20);
            self.labelText.node.parent.setContentSize(size);
            // self.labelText.node.parent.scale = scale
            let labelParentNode = self.labelText.node.parent;

            if (visible) {
                self.loading.scale = scale
                self.loading.x = labelParentNode.x - (labelParentNode.width) / 2 - (self.loading.width*scale) / 2 - 13;
                // self.PanelClub.scale = scale
                // self.PanelClub.x = self.loading.x;
            } else {
                self.loading.x = 0;
                // self.PanelClub.x = 0;
    
            }

        },
        debug(enable){
            DEBUG_BLOCK_LOG = !!enable;
        }, 
        setTextVisible(visible){
            let instance = LoadingBlock._instance;
            if(!instance){
                return;
            }

            instance.labelText.node.parent.active = visible;
        },
        showPercent(str_percent) {
            PERCENT = 0;

            if(str_percent == ""){

            }
            else if(!str_percent){
                str_percent = "  0%";
            }
            let text = str_percent;
            LoadingBlock.setText(text, true, true);

            LoadingBlock.updateContentByAppKey(true);
        },
        hidePercent() {
            PERCENT = 0;

            let text = "";
            if(!CALLBACK_HANDLES.length>0){
                LoadingBlock.setText(text, false, false);
            }
        },

        showDownload(percent){

            if (percent > 0 && percent <= 1) {
                percent = Math.floor(percent * 100);
            }
            if (percent > PERCENT) {
                PERCENT = percent;
            }

            if (percent > 100) {
                percent = 100;
            }

            if (percent < 10) {
                percent = '  ' + percent;
            }
            else if (percent < 100) {
                percent = ' ' + percent;
            }

            let text =  percent + "%";
            LoadingBlock.setText(text, true, true);
        },


        setDownloadPercent(percent){

            if (percent > 0 && percent <= 1) {
                percent = Math.floor(percent * 100);
            }
            if (percent > PERCENT) {
                PERCENT = percent;
            }

            if (percent > 100) {
                percent = 100;
            }

            if (percent < 10) {
                percent = '  ' + percent;
            }
            else if (percent < 100) {
                percent = ' ' + percent;
            }

            let text =  percent + "%";
            if(LoadingBlock._instance){
                LoadingBlock._instance.labelText.string = text;
            }

        },

        setPercent(percent) {
            if (percent > 0 && percent <= 1) {
                percent = Math.floor(percent * 100);
            }
            if (percent > PERCENT) {
                PERCENT = percent;
            }
            LoadingBlock._updatePercent();
        },
        _updatePercent() {
            let percent = PERCENT;
            if (percent > 100) {
                percent = 100;
            }
            if (percent < 10) {
                percent = '  ' + percent;
            }
            else if (percent < 100) {
                percent = ' ' + percent;
            }
            let text = percent + "%";
            if(LoadingBlock._instance){
                LoadingBlock._instance.labelText.string = text;
            }
        },
        setContentPosition(position){
            position = Number(position);

            //统一在中间显示
            position = EPosition.CENTER;

            LoadingBlock._pos = position;
            LoadingBlock.updateContent();
        },
        updateContent(){
            let instance = LoadingBlock._instance;
            if(!instance) return;
            
            let visible = false;
            let y = (instance.content.height - cc.winSize.height)/2;
            let pos = LoadingBlock._pos;
            switch (pos) {
                case EPosition.CENTER:
                    y = 0;
                    break;
                case EPosition.BOTTOM:
                    // visible = true;
                    break;
                default:
                    break;
            }
            LoadingBlock.setBtnHideVisible(visible);
            instance.content.y = y;
            if(DEBUG_BLOCK_LOG){
                 //console.error("block updateContent: ", y, visible);
            }
        },
        //根据appkey显示不同的loading动画
        updateContentByAppKey(visible_baseon_appkey){
            let instance = LoadingBlock._instance;
            if(!instance) return;

            // let visible = true;

            //  instance.PanelClub.active = true;
            // instance.loading.active = visible;
            // // instance.loadingBlockBG.active = visible;
            // instance.PanelMallwin.active = !visible;
            // instance.PanelMaxlive.active = !visible;
            // if(visible_baseon_appkey){
            //     if (app.config.IS_CLUB_ONLY){
            //         instance.loading.active = !visible;
            //         instance.PanelMallwin.active = !visible;
            //         instance.PanelMaxlive.active = !visible;
            //         instance.PanelClub.active = visible;
            //         instance.loadingBlockBG.getComponent(cc.Sprite).spriteFrame = instance.clubBg;
            //         return;
            //     }
            //     if(app.isMoreWin() || app.isCCLive()){
            //         LoadingBlock.setTextVisible(!visible);
            //         instance.loading.active = !visible;
            //         instance.loadingBlockBG.active = !visible;
            //         instance.PanelMallwin.active = app.isMoreWin();
            //         instance.PanelMaxlive.active = app.isCCLive();
		    //         instance.PanelClub.active = !visible;
            //     }
            // }
        },

        setCancelCallback(blockIndex, callback) {
            if (CALLBACK_HANDLES.length > 0) {
                let array = CALLBACK_HANDLES;
                for (let i = array.length - 1; i >= 0; i--) {
                    const handle = array[i];
                    if (handle.blockIndex == blockIndex) {
                        handle.onCancel = callback;
                        break;
                    }
                }
            }
        },
        setHideCallback(callback){
            LoadingBlock._onBtnHideCallback = callback;
        },  
        setBtnHideVisible(visible){
            let instance = LoadingBlock._instance;
            if(!instance) return;
      
            visible = !!visible;

            if(visible){
                LoadingBlock.updateContentByAppKey(false);
            }
            if(instance.itemHide.active == visible){
                return;
            }

            cc.log("LoadingBlock", "setBtnHideVisible", visible);
            instance.itemHide.active = visible;
        },
        isLoadingVisible(){
            let instance = LoadingBlock._instance;
            if(!instance) return false;

            return instance.node.active;
        }
    },
});

module.exports = LoadingBlock;