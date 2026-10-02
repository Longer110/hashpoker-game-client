// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let MsgManager = require("MsgManager");
let MSG = require("Msg");

cc.Class({
    extends: cc.Component,

    properties: {

        res_array: {
            default: [],
            type: cc.SpriteFrame,
            tooltip: '资源列表',
        },

    },

    onEnable() {
        MsgManager.on(MSG.PING.PING_TIME_SERVER, this.pingTimeServer, this);
    },

    onDisable() {
        MsgManager.un(this.pingTimeServer,this);
    },


    pingTimeServer(data){

        if(this._data){
            let netUrl = `${data.server.HEAD}://${data.server.HOST}:${data.server.PORT}`;
            let url = `${this._data.server.HEAD}://${this._data.server.HOST}:${this._data.server.PORT}`;
            if(netUrl == url){
                this._data.server = data.server
                this.updateItem(this._data);
            }
        }
    },


    loadRes(node,key){
        if(!cc.isValid(node)){
            return
        }
        for(let i=0;i<this.res_array.length;i++){
            //更新图标
            if(this.res_array[i]!=null)
            {
                if(this.res_array[i].name == key){
                    let sprite = node.getComponent(cc.Sprite);
                    sprite.spriteFrame = this.res_array[i];
                }
            }
        }
    },


    setData(data){
        this._data = data;
        this.updateItem(data);
    },

    updateItem(data){

        let toggle = this.node.getChildByName("toggle");
        let name = this.node.getChildByName("name");
        let signal = this.node.getChildByName("signal");
        if(name){
            name.active =  true;
            name.getComponent(cc.Label).string = data.name + "  " + Math.floor(data.server.DELAYED) + " ms";
        }
        if(toggle){
            toggle.active = true;

            let call = toggle.getComponent(cc.Toggle).checkEvents[0]
            if(call){
                call.customEventData = data.server
            }
            let server = app.net.getServer()
            if(server){
                let netUrl = `${server.HEAD}://${server.HOST}:${server.PORT}`;
                let url = `${data.server.HEAD}://${data.server.HOST}:${data.server.PORT}`;
                if(url == netUrl){
                    toggle.getComponent(cc.Toggle).isChecked = true;
                    toggle.getComponent("UISound").forceTouchEnabled(false)
                }else{
                    toggle.getComponent("UISound").forceTouchEnabled(true)
                }
            }else{
                toggle.getComponent("UISound").forceTouchEnabled(true)
            }
        }
        if(signal){
            let unIndex = 0;
            let time = Math.floor(data.server.DELAYED)
            if(time > 400 && time <= 500){
                unIndex = 1;
            }
            if(time > 300 && time <= 400){
                unIndex = 2;
            }
            if(time > 200 && time <= 300){
                unIndex = 3;
            }
            if(time > 100 && time <= 200){
                unIndex = 4;
            }
            if(time <= 100){
                unIndex = 5;
            }
            for(let i=1;i<6;i++){
                let img = signal.getChildByName("img_"+i);
                if(img){
                    img.active = true;
                    if(i > unIndex){
                        this.loadRes(img,"serverline_signal_1");
                    }else{
                        if(unIndex == 5 || unIndex == 4){
                            this.loadRes(img,"serverline_signal_2");
                        }
                        if(unIndex == 3 || unIndex == 2){
                            this.loadRes(img,"serverline_signal_3");
                        }
                        if(unIndex == 1){
                            this.loadRes(img,"serverline_signal_4");
                        }
                    }
                }
            }
            signal.active = true;
        }
    },

});
