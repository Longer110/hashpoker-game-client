/*
    德州买入提示
*/

cc.Class({
    extends: cc.Component,

    properties: {
        paomaPosition: cc.Node,

        panel: cc.Node,
        block: cc.Node,

        paoMaStr: cc.Label,

        _offsetX: 0,
    },

    onLoad() {
        
    },

    onDestroy() {

    },

    _initPaoMa(str) {
        this._offsetY = this.paomaPosition.y;

        this.hide();

        this.paoMaStr.string = str;
    },

    show() {
        this.block.active = true;

        // let pos = cc.v2(this.panel.x,this._offsetY);
        // let seq = cc.sequence(
        //     cc.moveTo(0.5, pos).easing(cc.easeBackOut()),
        //     cc.callFunc(function (params) {
                
        //     }, this)
        // )
        // this.panel.active = true;
        // this.panel.stopAllActions();
        // this.panel.runAction(seq);

        this.panel.x = this.panel.x;
        this.panel.y = this._offsetY;
        this.panel.active = true;

        this.scheduleOnce(function () {
            this.close();
        },3);
    },

    hide() {
        this.block.active = false;

        // this.panel.stopAllActions();
        // this.panel.active = false;
        // this.panel.setPosition(this.panel.x, this._offsetY + this.panel.height);

        this.panel.x = this.panel.x;
        this.panel.y = this._offsetY + this.panel.height;
        this.panel.active = false;
    },

    close() {
        this.block.active = false;

        // let pos = cc.v2(this.panel.x, this._offsetY + this.panel.height);
        // let seq = cc.sequence(
        //     cc.moveTo(0.5, pos).easing(cc.easeBackIn()),
        //     cc.callFunc(function (params) {
        //         this.panel.active = false;
        //     }, this)
        // )
        // this.panel.stopAllActions();
        // this.panel.runAction(seq);

        this.panel.x = this.panel.x;
        this.panel.y = this._offsetY + this.panel.height;
        this.panel.active = false;
    },

});