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
//     * @Description: 动效控制
// ]]

cc.Class({
    extends: cc.Component,

    properties: {
        _duration: 2.5,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
    },

    // update (dt) {},

    /**
     * 抖动动画
     */
    runActionShake() {
        let targetNode = this.node;

        if(!targetNode._shakeOriginalPosition){
            targetNode._shakeOriginalPosition = targetNode.position;
        }
        else{
            targetNode.position = targetNode._shakeOriginalPosition;
        }

        var deltaTime = 0.02;
        var offset = 5;
        var camera = targetNode;
        targetNode.stopAllActions()
        camera.runAction(cc.sequence(
                cc.moveBy(deltaTime, cc.v2(offset * 2, 0)),
                cc.moveBy(deltaTime * 2, cc.v2(-offset * 4)),
                cc.moveBy(deltaTime, cc.v2(offset * 2)),

                cc.moveBy(deltaTime, cc.v2(0, offset * 2)),
                cc.moveBy(deltaTime * 2, cc.v2(0, -offset * 4)),
                cc.moveBy(deltaTime, cc.v2(0, offset * 2)),

                cc.moveBy(deltaTime, cc.v2(offset, 0)),
                cc.moveBy(deltaTime * 2, cc.v2(-offset * 2, 0)),
                cc.moveBy(deltaTime, cc.v2(offset, 0)),

                cc.moveBy(deltaTime, cc.v2(0, offset)),
                cc.moveBy(deltaTime * 2, cc.v2(0, -offset * 2)),
                cc.moveBy(deltaTime, cc.v2(0, offset)),
                // cc.delayTime(1)
            )
        )
    },

    // 缩放动画
    runActionScale() {
        let node = this.node;

        node.stopAllActions()
        node.scale = 1
        let scaleDuration = 0.3;
        let scale1 = cc.scaleTo(scaleDuration, 1.2);
        let scale2 = cc.scaleTo(scaleDuration, 1.0);
        let seq = cc.sequence(cc.repeat(cc.sequence(scale1,scale2),2), cc.delayTime(0.5));
        let repeat = cc.repeatForever(seq);
        node.runAction(repeat);
    },
});
