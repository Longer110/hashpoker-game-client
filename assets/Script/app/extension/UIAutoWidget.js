// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

// [[
//     * @Author:      mygame
//     * @DateTime:    2018-05-28 10:05:23
//     * @Description: 按百分比自动对齐组件，依赖 cc.Widget 组件
// ]]

cc.Class({
    extends: cc.Component,

    properties: {
        vertical: {
            default: true,
            type: cc.Boolean,
            tooltip: "垂直对齐"
        },
        horizontal: {
            default: false,
            type: cc.Boolean,
            tooltip: "水平对齐"
        },
        offset: {
            default: 0,
            type: cc.Float,
            tooltip: "距父节点起始对齐位置的偏移百分比",
            notify (oldValue) {
                if(this.offset==oldValue) return;
                this.updatePercent(this.offset, this.percent);
            },
            range: [0, 1, 0.01],
        },

        _percent: 0.0,
        percent: {
            default: 0.0,
            type: cc.Float,
            tooltip: "占父节点的百分比",
            notify (oldValue) {
                if(this.percent==oldValue) return;
                this.updatePercent(this.offset, this.percent);
            },
            range: [0, 1, 0.01],
        },
    },
    editor: CC_EDITOR && {
        executeInEditMode: true,
        requireComponent: cc.Widget,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    updatePercent(offset, percent){
        let widget = this.getComponent(cc.Widget);
        if(!widget){
            return;
        }
        
        widget.isAbsoluteTop = true;
        widget.isAbsoluteBottom = true;
        widget.isAbsoluteLeft = true;
        widget.isAbsoluteRight = true;

        if(this.horizontal){
            widget.isAbsoluteLeft = false;
            widget.isAbsoluteRight = false;
            widget.left = offset;
            widget.right = 1 - offset- percent;
        }
        else{
            widget.isAbsoluteTop = false;
            widget.isAbsoluteBottom = false;
            widget.top = offset;
            widget.bottom = 1 - offset- percent;
        }
    }
});
