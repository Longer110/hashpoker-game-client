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
//     * @Description: 可拖拽控件
// ]]

cc.Class({
    extends: cc.Component,

    properties: {
        interactable: {
            default: true,
            visible: false,
        },
        _touchBeganLocation: null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    onEnable(){
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
    },

    onDisable(){
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
    },

    // touch event handler
    _onTouchBegan (event) {
        if (!this.interactable || !this.enabledInHierarchy) return;

        this.node.emit("uisound", this);

        this._pressed = true;
        let touch = event.touch;
        this._touchBeganLocation = touch.getLocation();
    },

    _onTouchMove (event) {
        if (!this.interactable || !this.enabledInHierarchy || !this._pressed) return;
        
        let touch = event.touch;
        let location = touch.getLocation();
        if(!this._touchBeganLocation){
            this._touchBeganLocation = location;
            return;
        }

        let offset = location.sub(this._touchBeganLocation);
        this._touchBeganLocation = location;

        let position = this.node.getPosition();
        this.node.setPosition(position.add(offset)); 
    },

    _onTouchEnded (event) {
        if (!this.interactable || !this.enabledInHierarchy) return;

        this._pressed = false;
        this._touchBeganLocation = null;
    },

    _onTouchCancel () {
        if (!this.interactable || !this.enabledInHierarchy) return;

        this._pressed = false;
        this._touchBeganLocation = null;
    },
});
