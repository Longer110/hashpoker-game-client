let Utils = require("Utils");

cc.Class({
    extends: cc.Component,

    properties: {
        label_ID: cc.Label,
        label_time: cc.Label,
        label_betNum: cc.Label,
        label_profit: cc.Label,
        change: cc.Node,
    },

    init(data) {
        //牌局编号
        this.label_ID.string = data.sPaiJuID;
        //下注
        this.label_betNum.string = Utils.convertNumberToStr(data.nBet);
        //派彩
        if (data.nProfit >= 0) {
            this.label_profit.node.color = new cc.Color(4, 153, 0);
            this.label_profit.string = "+" + Utils.convertNumberToStr(data.nProfit);
        }
        else {
            this.label_profit.node.color = new cc.Color(246, 59, 9);
            this.label_profit.string = Utils.convertNumberToStr(data.nProfit);
        }
        //时间
        this.label_time.string = this.timeFormat(data.sTime);

        if(this.change){
            let call = this.change.getComponent(cc.Button).clickEvents[0]
            if(call){
                call.customEventData = data
            }

            if(app.config.DISABLE_RECORD_DETAILS){
                this.change.active = false
            }

            if (this.node.getComponent(cc.Button)) {
                let nodeCall = this.node.getComponent(cc.Button).clickEvents[0]
                if (nodeCall) {
                    nodeCall.customEventData = data
                }
            }
        }

        if (App.isHelloGame()) {
            this.label_ID.node.active = true;
            this.label_ID.node.x = -179;
            this.label_time.node.x = -11;
            this.label_betNum.node.x = 110;
            this.label_profit.node.x = 226;
            if(this.change){
                this.change.x = 226;
            }
         
            
        }

        if (App.isMoreWin()) {
            this.label_ID.node.active = false;
            this.label_time.node.x = -164;
            this.label_betNum.node.x = 44;
            this.label_profit.node.x = 204;
            if(this.change){
                this.change.x = 204;
            }
        }
    },

    timeFormat(timeStr) {
        let arr1 = timeStr.split(" ");
        let arr2 = arr1[0].split("-");
        let arr3 = arr1[1].split(":");

        let year = arr2[0];
        let month = arr2[1];
        let date = arr2[2];
        let hour = arr3[0];
        let minute = arr3[1];
        let second = arr3[2];


        return year + "-"+ month + "-" + date + "\n" + hour + ":" + minute+":"+second;
        // if (App.isMoreWin()) {
        //     return month + "/" + date + " " + hour + ":" + minute+":"+second;
        // }else{
        //     return month + "/" + date + "\n" + hour + ":" + minute;
        // }

    },

    formatZero(num, len = 2) {
        if (String(num).length > len) return num;
        return (Array(len).join(0) + num).slice(-len);
    },

});