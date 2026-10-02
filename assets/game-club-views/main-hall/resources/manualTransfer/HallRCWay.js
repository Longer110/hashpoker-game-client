// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        HallPayType: cc.Prefab,
        handRecharge: cc.Node,
        line: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    init(data){
        this._data = data;
        //充值开关
        if(data.userInfo.nTransSwitch == 0){
            this.handRecharge.active = true;
            this.line.active = true;
        }else{
            this.handRecharge.active = false;
            this.line.active = false;
        }
    },

    onClickClose(){
        this.node.destroy();
    },

    onClickOnlineRecharge(){
        //在线
        cc.sys.openURL(this._data.url);
    },

    onClickHandRecharge(){
        //手动
        let node = cc.instantiate(this.HallPayType);
        this.node.addChild(node);
        let com = node.getComponent("HallPayType");
        if (com){
            com.init({nType:1, userInfo: this._data.userInfo});
        }

    }
});
