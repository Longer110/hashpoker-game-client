cc.Class({
    extends: cc.Component,

    properties: {
        lbDay: cc.Label,
        spSel: cc.Sprite,
    },

    setDay(index, day, sel, cb) {
        this.index = index;
        this.day = day;
        this.cb = cb;

        this.lbDay.string = day;
        this.lbDay.node.color = new cc.Color(255, 255, 255);
        if(sel){
            this.lbDay.node.color = new cc.Color(6, 19, 29);
        }
        this.spSel.enabled = sel;
    },

    onClickItem() {
        if (this.cb) {
            this.cb(this.index, this.day);
        }
    },
});
