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
//     * @Description: 单个 SpriteFrame 渲染方式条件过滤
// ]]

cc.Class({
    extends: cc.Component,

    properties: {
        srcBlendFactor: {
            default: cc.macro.BlendFactor.SRC_ALPHA,
            type: cc.Enum(cc.macro.BlendFactor),
            // tooltip: '',
        },
        dstBlendFactor: {
            default: cc.macro.BlendFactor.ONE_MINUS_SRC_ALPHA,
            type: cc.Enum(cc.macro.BlendFactor),
            // tooltip: '',
        },
        premultiplyAlpha: false,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
