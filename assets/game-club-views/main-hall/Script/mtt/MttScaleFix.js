// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


//缩放类型
let EScaleType= cc.Enum({
    WIDTH: 0,
    HEIGHT: 1,
});

cc.Class({
    extends: cc.Component,

    properties: {

        //缩放类型
        scaleType: {
            default: EScaleType.WIDTH,
            type: cc.Enum(EScaleType),
        },
    },

    start () {
        this._onResized();
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
                //window.removeEventListener('resize', this._onResizedCallback);
                this._onResizedCallback = null;
            }
        }
        else {
           // cc.view.off('canvas-resize', this._onResized);
        }
    },

    _onResized(){
        // this.on_size_change();
    },


    on_size_change(){
        if(cc.isValid(this.node)){
            let designSize = cc.view.getDesignResolutionSize();
            let winSize = cc.winSize;
            let scaleX = winSize.width / designSize.width;
            let scaleY = winSize.height / designSize.height;
            if(this.scaleType == EScaleType.WIDTH){
                this.node.scale = scaleX
            }
            if(this.scaleType == EScaleType.HEIGHT){
                this.node.scale = scaleY
            }
        }
    },
});
