// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    setData(text, itemName, pos) {
        cc.log('test 聊天气泡', text, itemName, pos)
        this.node.active = true
        this.node.zIndex = 99
        this.updateUi(text, itemName, pos)
        this.unscheduleAllCallbacks()
        this.scheduleOnce(() => {
            this.node.zIndex = 0
            this.node.active = false
        }, 2.5)
    },

    updateUi(text, itemName, pos) {
        let childs = this.node.children

        for (let index = 0; index < childs.length; index++) {
            const element = childs[index];
            if(element.name == itemName) {
                element.active = true
                element.getChildByName('text').getComponent(cc.Label).string = text
                this.setUiSize(text, element, itemName)
                if(pos) this.node.setPosition(pos)
            }else {
                element.active = false
            }
        }
    },

    setUiSize(text, item, itemName) {
        let tragetWidth = 400
        if(itemName == 'right' || itemName == 'left') {
            tragetWidth = 740
        }
        let textNode = item.getChildByName('text')
        textNode.width = tragetWidth
        item.width = tragetWidth + 60
        let lb = textNode.getComponent(cc.Label)
        if(text.length <= 6) {
            lb.horizontalAlign = cc.Label.HorizontalAlign.LEFT
            lb.overflow = cc.Label.Overflow.NONE
            lb._forceUpdateRenderData()

            let textWidth = textNode.getContentSize().width
            if(textWidth < 132) {
                lb.overflow = cc.Label.Overflow.CLAMP
                textNode.width = 132
                item.width = 192
                lb.horizontalAlign = cc.Label.HorizontalAlign.CENTER
            }else if(textWidth < tragetWidth){
                // lb.overflow = cc.Label.Overflow.NONE
                item.width = textWidth + 60
            }else {
                lb.overflow = cc.Label.Overflow.RESIZE_HEIGHT
                textNode.width = tragetWidth
                item.width = tragetWidth + 60
            }
        }else {
            lb.overflow = cc.Label.Overflow.RESIZE_HEIGHT
            lb.horizontalAlign = cc.Label.HorizontalAlign.LEFT
            lb._forceUpdateRenderData()
            let textHeight = textNode.getContentSize().height
            if(textHeight < 60) {
                lb.overflow = cc.Label.Overflow.NONE
                lb._forceUpdateRenderData()
                item.width =  textNode.getContentSize().width + 60
            }else {
                textNode.width = tragetWidth
                item.width = tragetWidth + 60
            }
        }
    },

    // update (dt) {},
});
