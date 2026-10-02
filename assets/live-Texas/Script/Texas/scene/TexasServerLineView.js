// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let i18n = require("i18n");


cc.Class({
    extends: cc.Component,

    properties: {
        center:cc.Node,
  
    },

    // LIFE-CYCLE CALLBACKS:


    init(){
        let DynamicScrollView = this.node.getComponent("DynamicScrollView")
        if(DynamicScrollView){
            DynamicScrollView.init([]);
        }
        
    },

    item_update(item,data){

        item.getComponent("TexasServerLineItem").setData(data);
    },

    initData(){

        let array = []
        if(app.ping){
            let nets = app.ping.getPingNets();
            for(let i=0;i<nets.length;i++){
                let server = nets[i].getServer();
                array.push({
                    name:i18n.t("TEXAS_SERVERLINE.3")+(i+1),
                    server:server,
                })
            }
        }
        let DynamicScrollView = this.node.getComponent("DynamicScrollView")
        if(DynamicScrollView){
            DynamicScrollView.init(array);
        }
    },

    show(){

        this.init();
        if(this.center && !this._show){
            this.node.active = true
            this._show = true
            this.center.scale = 0
            cc.tween(this.center)
            .to(0.2, {scale: 1,})
            .call(()=>{
                this.initData();
            })
            .start()
        }
    },

    close(){
        this.node.active = false
        this._show = false
    },


    //重新检测
    checkCallback(){
        if(app.ping){
            app.ping.reConnect();
        }
    },


    //切换线路
    clickLineCallack(event, customEventData){
        this.close();
        cc.log("customEventData = ",customEventData)
        if(app && app.net){
            app.net.release();
            app.net.connect(customEventData);
        }
    },

    // update (dt) {},
});
