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
//     * @DateTime:    2018-05-28 10:05:23
//     * @Description: UI弹窗基类
//     * 注意：不要覆盖start方法，有需要可重写onStart接口
// ]]

let wrapper = require("WrapperManager").default;

//界面显示动作
let EShowAction = cc.Enum({
    NONE: 0,
    DROP: 1, //下拉
    ZOOM: 2, //缩放
});

cc.Class({
    extends: cc.Component,

    properties: {
        //界面显示动作
        showAction: {
            default: EShowAction.NONE,
            type: cc.Enum(EShowAction),
            tooltip: '界面显示动作',
        },
        //用于半透明效果及禁止点击穿透
        block: {
            default: null,
            type: cc.BlockInputEvents,
            tooltip: '用于半透明效果及禁止点击穿透',
        }, 
        //内容可用于做动作效果
        content: {
            default: null,
            type: cc.Node,
            tooltip: '内容可用于做动作效果',
        },
        //适配面板
        panelAdapter: {
            default: null,
            type: cc.Node,
            tooltip: '适配面板，用于界面适配',
        },
        //main bundle name
        _wrapperOwner: {
            default: "main-common",
            tooltip: '当前界面是在哪个包里的',
            visible: false,
            serializable: false,
        },
        //sub bundle name
        _wrapperLoader: {
            default: "main-common",
            tooltip: '当前界面是由哪个子包加载的',
            visible: false,
            serializable: false,
        },

        _onCloseHandler: null,

        //UIPool
        _uiPool: null,

        _originalPosition: cc.v2(0, 0),
        _originalScaleX: 1,
        _originalScaleY: 1,

        _initBased: false,
        _duration: 0,
        _offset: cc.size(0, 0),
        _closeAction: null,
             
        _zoomNode: null,
        _handleBlock: false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad(){},

    // 注意：不要覆盖start方法，有需要可重写onStart接口
    start () {
        this._initBaseData();
        this._invoke();

    },

    _onResized(){
        //适配面板
        // if(this.panelAdapter){
        //     let designSize = cc.view.getDesignResolutionSize();
        //     let winSize = cc.winSize;
        //     let scaleX = winSize.width/designSize.width;
        //     let scaleY = winSize.height/designSize.height;
        //     let scale = Math.min(scaleX, scaleY);
        //     this.panelAdapter.scale = scale;
        // }
    },

    reuse(args){
        cc.log("reuse:", this.node.name, args);

        if (cc.sys.isMobile) {
            this._onResizedCallback = this._onResized.bind(this);
           // window.addEventListener('resize', this._onResizedCallback, false);
        }
        else {
            //cc.view.on('canvas-resize', this._onResized, this);
        }
        this._onResized();

        if(!this._initBased) return;
        

        this._invoke();
    },
    unuse(){
        cc.log("unuse:", this.node.name);
        this._resetBaseData();
        if (cc.sys.isMobile) {
            if(this._onResizedCallback){
               // window.removeEventListener('resize', this._onResizedCallback);
                this._onResizedCallback = null;
            }
        }
        else {
            //cc.view.off('canvas-resize', this._onResized);
        }
        
        if(!this._initBased) return;
       
    },

    setCloseHandler(handler){
        this._onCloseHandler = handler;
    },
    //获取资源所在主包
    getOwner(){
        return this._getWrapper(this._wrapperOwner);
    },
    setOwner(wrapper_owner_name){
        this._wrapperOwner = wrapper_owner_name;
    },
    //获取加载资源的子包
    getLoader(){
        return this._getWrapper(this._wrapperLoader);
    },
    setLoader(wrapper_loader_name){
        this._wrapperLoader = wrapper_loader_name;
    },
    _getWrapper(wrapper_name){
        let instance = wrapper.get(wrapper_name);
        return instance;
    },
    _setUIPool(value){
        this._uiPool = value;
    },

    _initBaseData(){
        if(this._initBased) return;

        this._initBased = true;
        
        this._duration = 0.25;
        this._offset = cc.winSize;

        let targetNode = this._getTargetNode();

        this._originalPosition = targetNode.position;
        this._originalScaleX = targetNode.scaleX;
        this._originalScaleY = targetNode.scaleY;

        //调整界面为满屏大小
        targetNode.setContentSize(cc.winSize);

        //适配面板
        if(this.panelAdapter){
            let designSize = cc.view.getDesignResolutionSize();
            let winSize = cc.winSize;
            let scaleX = winSize.width/designSize.width;
            let scaleY = winSize.height/designSize.height;
            let scale = Math.min(scaleX, scaleY);
            this.panelAdapter.scale = scale;
        }
    },

    _resetBaseData(){
        if(!this._initBased) return;

        this._zoomNode = null;
        this.setCloseHandler(null);
        if(this.block&&this._handleBlock){
            this._handleBlock = false;
            this.block.node.off("touchstart", this._onTouchBlock, this);
            // cc.log("UIBase off", "touchstart", this.node.name);
        }

        let targetNode = this._getTargetNode();
        targetNode.position = this._originalPosition;
        targetNode.scaleX = this._originalScaleX;
        targetNode.scaleY = this._originalScaleY;
    },

    _invoke(){
        if(!this._initBased) return;
        
        if(this.block&&!this._handleBlock){
            this._handleBlock = true;
            this.block.node.on("touchstart", this._onTouchBlock, this);
            // cc.log("UIBase on", "touchstart", this.node.name);
        }

        let targetNode = this._getTargetNode();
        let widget = targetNode.getComponent(cc.Widget);
        if(widget){
            widget.enabled = false;
        }

        let preCall = cc.callFunc(function () {
            this.onStart();
        }, this);

        let callback = cc.callFunc(function () {
            if(widget){
                widget.enabled = true;
            }
            this.onShow();
        }, this);

        var seq = null;
        if(this.showAction===EShowAction.DROP)
        {
            targetNode.y = this._originalPosition.y + this._offset.height;
            seq = cc.sequence(
                preCall,
                cc.moveTo(this._duration, this._originalPosition.x, this._originalPosition.y).easing(cc.easeBackOut()),
                callback
            );
        }
        else if(this.showAction===EShowAction.ZOOM)
        {
            targetNode.scale = 0;
            if(null!=this._zoomNode)
            {
                let posWorld = this._zoomNode.parent.convertToWorldSpaceAR(this._zoomNode.position);
                let posBegin = targetNode.parent.convertToNodeSpaceAR(posWorld);
                targetNode.position = posBegin;

                let spawn = cc.spawn(
                    cc.moveTo(this._duration, this._originalPosition), 
                    cc.scaleTo(this._duration, this._originalScaleX, this._originalScaleY)
                );

                seq = cc.sequence(
                    preCall,
                    spawn.easing(cc.easeBackOut()),
                    callback
                );
            }
            else
            {
                seq = cc.sequence(
                    preCall,
                    cc.scaleTo(this._duration, this._originalScaleX, this._originalScaleY).easing(cc.easeBackOut()),
                    callback
                );
            }
        }
        else
        {
            seq = cc.sequence(
                preCall,
                cc.delayTime(0.01),
                callback
            );
        }
        targetNode.runAction(seq);
    },

    _onTouchBlock(){
        cc.log("UIBase", "_onTouchBlock", this.node.name);
        this.close();
    },
    
    _getTargetNode(){
        let targetNode = this.content!=null ? this.content : this.node;

        return targetNode;
    },

    closeImmediate: function (force) {
        cc.log("UIBase:closeImmediate", this.node.name, force);

        if(!force){
            if(this._onCloseHandler){
                this._onCloseHandler();
            }
            this.onClose();
        }
        if(null!=this._uiPool){
            if(cc.isValid(this.node)){
                cc.log("存放到缓存池");
                this._uiPool.unuse(this.node);
            }else{
                cc.log("无效的节点，不能存放到缓存池");
            }
        }
        else{
            this.node.destroy();
            cc.log("不存放到缓存池");
        }
    },
    close: function()
    {
        if(this._closeAction!=null) return;

        let targetNode = this._getTargetNode();
        let widget = targetNode.getComponent(cc.Widget);
        if(widget){
            widget.enabled = false;
        } 
        let callback = cc.callFunc(function () {
            this._closeAction = null;
            this.closeImmediate();
        }, this);

        var seq = null;
        if(!this._initBased)
        {
            seq = callback;
        }
        else if(this.showAction===EShowAction.DROP)
        {
            seq = cc.sequence(
                cc.moveTo(this._duration, this._originalPosition.x, this._originalPosition.y + this._offset.height).easing(cc.easeBackIn()),
                callback
            );
        }
        else if(this.showAction===EShowAction.ZOOM)
        {
            if(null!=this._zoomNode)
            {
                let posWorld = this._zoomNode.parent.convertToWorldSpaceAR(this._zoomNode.position);
                let posBegin = targetNode.parent.convertToNodeSpaceAR(posWorld);
                let spawn = cc.spawn(
                    cc.moveTo(this._duration, posBegin), 
                    cc.scaleTo(this._duration, 0)
                );
                seq = cc.sequence(
                    spawn.easing(cc.easeBackIn()),
                    callback
                );
            }
            else
            {    
                seq = cc.sequence(
                    cc.scaleTo(this._duration, 0).easing(cc.easeBackIn()),
                    callback
                );
            }
        }
        else
        {
            seq = callback;
        }
        this._closeAction = targetNode.runAction(seq);
    },

    setZoomNode(item){
        this._zoomNode = item;
    },

    //显示界面前调用
    onStart(){
        // cc.log("UIBase onStart");
    },
    //显示界面后调用
    onShow(){
        // cc.log("UIBase onShow");
    },
    //关闭界面后调用
    onClose(){
        // cc.log("UIBase onClose");
    },

});
