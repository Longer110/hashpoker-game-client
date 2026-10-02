//弹窗类型
let PanelType = cc.Enum({
    LEFT_TO_RIGHT: 0,    // 左到右
    RIGHT_TO_LEFT: 1,    // 右到左
});

cc.Class({
    extends: cc.Component,

    statics: {
        PanelType: PanelType,
    },

    properties: {
        //界面显示动作
        showType: {
            default: PanelType.LEFT_TO_RIGHT,
            type: cc.Enum(PanelType),
        },

        panel: cc.Node,
        panelPosition: cc.Node,
        block: cc.Node,

        _offsetX: 0,
    },

    onLoad() {

    },

    onDestroy() {

    },

    show() {//使用时 panel中的Widget组件左右不能勾选
        if (this.block.active) return;
        this.block.active = true;
        // this.panel.x = this.panelPosition.width
        let pos = cc.v2(this.panelPosition.x, this.panel.y);
        let seq = cc.sequence(
            cc.moveTo(0.3, pos).easing(cc.easeBackOut()),
            cc.callFunc(function (params) {
            }, this)
        )
        this.panel.active = true;
        this.panel.stopAllActions();
        this.panel.runAction(seq);
    },

    hide() {
        this.panel.active = false;
        this.block.active = false;
        this.panel.setPosition(this._getPos(), this.panel.y);
    },

    close() {
        if (!this.block.active) return;
        this.block.active = false;

        let pos = cc.v2(this._getPos(), this.panel.y);
        let seq = cc.sequence(
            cc.moveTo(0.3, pos).easing(cc.easeBackIn()),
            cc.callFunc(function (params) {
                this.panel.active = false;
            }, this)
        )
        this.panel.stopAllActions();
        this.panel.runAction(seq);
    },

    _getPos() {
        let pos = this.showType === PanelType.RIGHT_TO_LEFT ? this.panelPosition.x + this.panelPosition.width / 2 : this.panelPosition.x - this.panelPosition.width / 2;

        return pos;
    },

});