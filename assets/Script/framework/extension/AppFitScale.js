// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html



cc.Class({
    extends: cc.Component,

    properties: {
       //动态调用回调
        scaleNodes: {
            default: [],
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onLoad () {
        if (cc.sys.isMobile) {
            this._onResizedCallback = this._onResized.bind(this);
            //window.addEventListener('resize', this._onResizedCallback, false);
        }
        else {
            //cc.view.on('canvas-resize', this._onResized, this);
        }
        this._onResized();

    },
    onDestroy: function () {
        if (cc.sys.isMobile) {
            if(this._onResizedCallback){
               // window.removeEventListener('resize', this._onResizedCallback);
                this._onResizedCallback = null;
            }
        }
        else {
           // cc.view.off('canvas-resize', this._onResized);
        }
    },

    _onResized(){
        // let designSize = cc.view.getDesignResolutionSize();
        // let winSize = cc.winSize;
        // let scaleX = winSize.width / designSize.width;
        // let scaleY = winSize.height / designSize.height;

        // let scale = Math.min(scaleX,scaleY)
    
        // //QYLogs.warn("AppFitScale:_onResized ","designSize.width="+designSize.width+"designSize.height="+designSize.height+"winSize.width="+winSize.width+"winSize.height="+winSize.height+"scale"+scale)
        // //QYLogs.warn("AppFitScale:_onResized","getVisibleSize.widht="+cc.view.getVisibleSize().width+"getVisibleSize height="+cc.view.getVisibleSize().height)
        
        // for(let i=0;i<this.scaleNodes.length;i++){
        //     let node = this.scaleNodes[i]
        //     if(cc.isValid(node)){
        //         node.scale = scale
        //     }
        // }

    },


    // update (dt) {},
});
