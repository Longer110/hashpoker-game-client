
let i18n = require("i18n");

let UIFrame = require("UIFrame");
cc.Class({
    extends: cc.Component,

    properties: {

        amount_edit: cc.EditBox,

        arrival_amount: cc.Label,

        arrival_time: cc.Label,

        arrival_fees: cc.Label,

        arrival_min: cc.Label,
        
        amount_list: [ cc.Node ],

        prefabBill: cc.Prefab,

        prefabPassword: cc.Prefab,

        selectHostNetPrefab: {
            default: null,
            type: cc.Prefab
        },

        selectHostNetText: {
            default: null,
            type: cc.Label
        },


        coinAdder: {
            default: null,
            type: cc.Label
        },

        _amountConfig: [],
        _fees: 1,
        _minRecharge: 1,
        _time: '1-10',
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        app.util.addClickSoundToNode(this.node);
    },

    start () {
        this._amountConfig = [10, 50, 100, 200, 500, 1000, 2000, 5000]
    },

    // update (dt) {},
    

    OnClickClose(){
        this.node.destroy();
    },


    OnClickSelectUSDT(){
        UIFrame.showTips("只能选择USDT");
    },

    OnClickHostNet(){
        let hostNetNode = this.addUI(this.selectHostNetPrefab)


        // let testDataItem = {name: "TRON-TRC20",count: 1, minCoin : 200, open:false}
        // let testData = []
        // for (let index = 0; index < 10; index++) {
        //     testDataItem.name = "TRON-TRC20" + index
        //     testDataItem.count =  index
        //     testDataItem.minCoin =  index * 30
        //     testDataItem.open =  (index % 2) == 0
        //     testData.push(testDataItem)
            
        // }

        // TODO ：请求数据。打开界面
        let component = hostNetNode.getComponent("selectHostNetPanel");
        if (component) {
            component.updateView(testData, this.updateHotNetText.bind(this));
        }

    },

    updateHotNetText(text){
        this.selectHostNetText.text =  text + " ";
    },

    OnEditEnded(event, customData) {
        if(event.string) {
            this.setArrivalAmount(Number(event.string))
        }
    },

    OnClickAmount(event, customData) {
        let count = this._amountConfig[Number(customData) - 1]
        if(count) {
            this.amount_edit.string = count
            this.setArrivalAmount(count)
        }
    },

    setArrivalAmount(value) {
        this.arrival_amount.string = String(value - value * this._fees / 1000)
    },

    initUi() {
        this.arrival_fees.string = this._fees + ''
        this.arrival_min.string = this._minRecharge + 'USDT'
        this.arrival_time.string = this._time + '分钟'
        for (let index = 0; index < this.amount_list.length; index++) {
            const element = this.amount_list[index];
            if(this._amountConfig[index]) {
                element.active = true
                element.getChildByName('num').getComponent(cc.Label).string = this._amountConfig[index]
            }else {
                element.active = false
            }
            
        }
    },

    OnClickSubmit() {
        if(!this.amount_edit.string) {
            UIFrame.showTips('请输入充币金额！')
            return
        }
        
        if(this.prefabPassword) {
            let obj = cc.instantiate(this.prefabPassword)
            this.node.addChild(obj)
            obj.getComponent('HallMyInputPayPassword').setData(this)
        }

        // app.net.send(CMD.GAME_CLUB.value, CMD.GAME_CLUB, params);
    },

    //支付密码确定回调，充币协议
    onInputPayPassword(password) {
        if(password) {

        }
    },

    //账单记录
    OnClickToRecord() {
        let prefab = this.prefabBill
        if (prefab) {
            let node = cc.instantiate(prefab);
            this.getAddNode().addChild(node, 1024);
            node.getComponent('HallMyBill').init(null, 0)
        }
    },

    getAddNode() {
        let scene = cc.director.getScene();
        return scene.getChildByName("Canvas").getChildByName("root").getChildByName("popup")
    },

    addUI(prefab){
        let node = cc.instantiate(prefab);
        this.node.addChild(node);
        return node;
    },
});
