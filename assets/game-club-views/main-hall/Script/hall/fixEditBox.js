
let UIFrame = require("UIFrame");

let EventManager = require("EventManager");
let target = EventManager.Target;
let event = EventManager.Event;

cc.Class({
    extends: cc.Component,

    properties: {
        editBoxes: {
            type: cc.EditBox,
            default: []
        },
    },

    onLoad() {
        let  isIosWeb = UIFrame.isOpenInIosWebview();
        if(!isIosWeb) return;
        target.on(event.IOS_WEB_RESIZE, this._onResized, this);

        this._originalPos = this.node.position.clone();
        this._isFocusing = false; 

        // 绑定 editing-did-began 事件
        this.editBoxes.forEach(eb => {
            eb.node.on('editing-did-began', this.onFocus, this);
            eb.node.on('editing-did-ended', this.onBlur, this);
        });
    },


    onFocus(ed) {
        this.editBox = ed.node
        this._isFocusing = true;
    },

    onBlur(ed) {
        this.editBox = ed.node
        this._isFocusing = false;

        // 键盘关闭 → 恢复 Canvas
        this.node.stopAllActions();
        this.node.runAction(cc.moveTo(0.2, cc.v2(this.node.x, this._originalY)));
    },

    _onResized() {
        if (!this._isFocusing) return; 

        this.scheduleOnce(() => {
            
            let boxWorldPos = this.editBox.convertToWorldSpaceAR(cc.Vec2.ZERO);
            let winSize = cc.winSize;
            
            //判断是否在在屏幕上半部分
            if (boxWorldPos.y > winSize.height * 0.6) return;

            // 目标位置：让输入框移动到屏幕中间偏上的位置
            let targetY = this._originalY + (winSize.height * 0.6 - boxWorldPos.y);

            // 移动 Canvas
            this.node.stopAllActions();
            this.node.runAction(cc.moveTo(0.2, cc.v2(this.node.x, targetY)));
        }, 0);
    },
});
