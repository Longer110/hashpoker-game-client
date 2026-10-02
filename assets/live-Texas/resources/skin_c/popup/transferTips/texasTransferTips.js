// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        tipsLabel1: cc.Label,
        tipsLabel2: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
    },

    // update (dt) {},

    setData(type) {
        let text = ''
        let textTips = ''
        if(type === 3) {
            text = '您尚未绑定邮箱和支付密码，为保障账号安全，请先绑定邮箱和支付密码。'
            textTips = '大厅-我的-绑定邮箱/支付密码'
            
        }else if(type === 1) {
            text = '您尚未绑定邮箱，为保障账号安全，请先绑定邮箱。'
            textTips = '大厅-我的-绑定邮箱'
            
        }else if(type === 2) {
            text = '您尚未设置支付密码，为保障账号安全，请先设置支付密码。'
            textTips = '大厅-我的-支付密码'
        }
        this.tipsLabel1.string = text
        this.tipsLabel2.string = textTips
    },

    onClickClose() {
        this.node.destroy()
    }
});
