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
//     * @Description: 漂字提示控件
// ]]

let UIBase = require("UIBase");

cc.Class({
    extends: cc.Component,

    properties: {
        targetNode: cc.Node,
        labelText: cc.Label,
        panel: cc.Node,

        _color: cc.Color.WHITE,
        _opacity: 255,
        _list: {
            type: Array,
            default: [],
        },
        _pool: {
            type: Array,
            default: [],
        },
        _duration: 10,
        _heightCount: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._list = []
        this._pool = []
        this._heightCount = 0
        this._duration = 1
        this.targetNode.active = false
        this._pool.push(this.targetNode)
    },

    // update (dt) {},

    setText(text){
        this.node.active = true
        
        this._list.push(text)
        this.initItem(text)
        
    },

    initItem(text) {
        if(this._list.length <= this._pool.length) {
            for (let index = 0; index < this._pool.length; index++) {
                const element = this._pool[index];
                if(element && !element.active) {
                    element.active = true
                    this._action(element, text)
                    break
                }
            }
        }else {
            let item = cc.instantiate(this.targetNode)
            this.node.addChild(item)
            item.active = true
            this._pool.push(item)
            this._action(item, text)
        }
    },


    _initBaseData(){
        this._super();

        this._duration = 10;
        this._color = this.node.color;
        this._opacity = this.node.opacity;
    },

    _resetBaseData(){
        this._super();

        // this.node.stopAllActions();

        this.node.position = this._originalPosition;
        this.node.color = this._color;
        this.node.opacity = this._opacity;
    },

    _action(target, text) {
        target.opacity = 255
        target.getChildByName('label').getComponent(cc.Label).string = text
        target.getChildByName('label').getComponent(cc.Label)._forceUpdateRenderData()
        let sizeY = target.getChildByName('label').getContentSize().height + 30
        // target.y = this._heightCount
        // this._heightCount += sizeY
        target.y = 0;
        let preCallback = cc.callFunc(function () {
        }, this);
        let callback = cc.callFunc(function () {
            target.active = false
            this.resetData()
        }, this);

        let offsetY = 100;
        let seq = cc.sequence(
            preCallback,
            cc.delayTime(0.5),
            cc.moveBy(this._duration, 0, offsetY),
            cc.delayTime(0.25),
            cc.fadeOut(0.25),
            callback
        );
        
        target.runAction(seq);
    },


    resetData() {
        this._list.shift()
        if(this._list.length == 0) {
            this._heightCount = 0
            this.node.active = false
        }
    },

    _invoke(){

    }
});
