cc.Class({
    extends: cc.Component,

    properties: {
        nameStr: cc.Label,
        itemBg: {
            default: [],
            type: cc.SpriteFrame,
        },
        _ctrl: null,
        _data: null,
    },

    // onEnable() {
    //     this.node.on(cc.Node.EventType.TOUCH_START, this.onClickItem, this);
    // },

    // onDisable() {
    //     this.node.off(cc.Node.EventType.TOUCH_START, this.onClickItem, this);
    // },

    init(data, ctrl, index) {
        this.nameStr.string = data.NAME;
        this._data = data;
        this._ctrl = ctrl;

        if (index%2 == 0){
            this.node.getComponent(cc.Sprite).spriteFrame = this.itemBg[0];
        }else{
            this.node.getComponent(cc.Sprite).spriteFrame = this.itemBg[1];
        }
    },

    onClickItem(event, data) {
        if(this._ctrl){
            this._ctrl.onClickServerMenu(this._data);
        }
    },

});
