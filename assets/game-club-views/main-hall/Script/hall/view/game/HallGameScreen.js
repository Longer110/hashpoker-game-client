// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let clubGameConfig = require("clubGameConfig");
let HallClubLogic = require("HallClubLogic");
let Utils = require("Utils");
let i18n = require("i18n");

//牌桌筛选
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    initData(){
        this._chipList = clubGameConfig.CLUB_GAME_SCREEN.CHIP;
        this._playerNum = clubGameConfig.CLUB_GAME_SCREEN.PLAYER_NUM;
        this._sScreen = {
            arrChipLevel:[],
            arrPlayerCnt: [],
            isForceBlind: false,
            isAOF: false,
            isOpenInsure: false,
        }
    },

    init(data){
        this._data = data;
        this.initData();
        this.initUI();
    },

    initUI(){
        this.initChip();
        this.initPlayerNum();

        let title = this.node.getChildByName("content").getChildByName("title").getComponent(cc.Label);
        title.lang = "HALL_CLUB_GAME_NAME." + this._data.nGameId;

        let node = this.node.getChildByName("content").getChildByName("panel4");
        if (this._data.nGameId == clubGameConfig.CLUB_GAME_CONFIG.ShortTexas){
            node.active = false;
        }else{
            node.active = true;
        }
    },

    initChip(){
        let node = this.node.getChildByName("content").getChildByName("panel1");
        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i];
            let nor = child.getChildByName("nor");
            let norTitle = nor.getChildByName("label_title").getComponent(cc.Label);
            let sel = child.getChildByName("sel");
            let selTitle = sel.getChildByName("label_title").getComponent(cc.Label);
            if (this._chipList[i]){
                child.active = true;
                nor.active = true;
                sel.active = false;
                if (this._chipList[i][0] >= 1000){
                    norTitle.string = this._chipList[i][0] + "+";
                    selTitle.string = this._chipList[i][0] + "+";
                }else{
                    norTitle.string = this._chipList[i][0] + "-" + this._chipList[i][1];
                    selTitle.string = this._chipList[i][0] + "-" + this._chipList[i][1];
                }   
              
            }else{
                child.active = false;
            }
        }
    },

    initPlayerNum(){
        let node = this.node.getChildByName("content").getChildByName("panel2");
        for (let i = 0; i < node.children.length; i++) {
            let child = node.children[i];
            let nor = child.getChildByName("nor");
            let norTitle = nor.getChildByName("label_title").getComponent(cc.Label);
            let sel = child.getChildByName("sel");
            let selTitle = sel.getChildByName("label_title").getComponent(cc.Label);
            if(this._playerNum[i]){
                child.active = true;
                nor.active = true;
                sel.active = false;
                if (this._playerNum[i][0] == this._playerNum[i][1]){
                    let str = Utils.replaceAll(i18n.t("CLUB_HALL.USER_COUNT"), "XXX", this._playerNum[i][0]);
                    norTitle.string = str;
                    selTitle.string = str;
                }else{
                    let str = Utils.replaceAll(i18n.t("CLUB_HALL.USER_COUNT"), "XXX", this._playerNum[i][0] + "-" + this._playerNum[i][1]);
                    norTitle.string = str;
                    selTitle.string = str;
                }
            }else{
                child.active = false;
            }
        }
    },

    onClickChip(event, customEventData){
        let node = event.target;
        let num = Number(customEventData);
        let nor = node.getChildByName("nor");
        let sel = node.getChildByName("sel");

        if (sel.active){
            sel.active = false;
            nor.active = true;
            for (let i = 0; i < this._sScreen.arrChipLevel.length; i++) {
                let tmp = this._chipList[num];
                if (tmp[0] == this._sScreen.arrChipLevel[i][0]){
                    this._sScreen.arrChipLevel.splice(i, 1);
                    break;
                }
            }
        }else{
            sel.active = true;
            nor.active = false;
            if (this._chipList[num]){
                this._sScreen.arrChipLevel.push(this._chipList[num]);
            }
        }

        this._sScreen.arrChipLevel.sort(function(a, b){
            return a[0] - b[0]
        })

        this.screenTableList();

    },

    onClickPlayerNum(event, customEventData){
        let node = event.target;
        let num = Number(customEventData);
        let nor = node.getChildByName("nor");
        let sel = node.getChildByName("sel");

        if (sel.active){
            sel.active = false;
            nor.active = true;
            for (let i = 0; i < this._sScreen.arrPlayerCnt.length; i++) {
                let tmp = this._playerNum[num];
                if (tmp[0] == this._sScreen.arrPlayerCnt[i][0]){
                    this._sScreen.arrPlayerCnt.splice(i, 1);
                    break;
                }
            }
        }else{
            sel.active = true;
            nor.active = false;
            if (this._playerNum[num]){
                this._sScreen.arrPlayerCnt.push(this._playerNum[num]);
            }
        }

        this._sScreen.arrPlayerCnt.sort(function(a, b){
            return a[0] - b[0]
        })

        this.screenTableList();
    },

    onClickAOF(event){
        let node = event.target;
        let nor = node.getChildByName("nor");
        let sel = node.getChildByName("sel");
        if (sel.active){
            sel.active = false;
            nor.active = true;
            this._sScreen.isAOF = false;
        }else{
            sel.active = true;
            nor.active = false;
            this._sScreen.isAOF = true;
        }

        this.screenTableList();
    },

    onClickInsure(event){
        let node = event.target;
        let nor = node.getChildByName("nor");
        let sel = node.getChildByName("sel");
        if (sel.active){
            sel.active = false;
            nor.active = true;
            this._sScreen.isOpenInsure = false;
        }else{
            sel.active = true;
            nor.active = false;
            this._sScreen.isOpenInsure = true;
        }

        this.screenTableList();
    },

    onClickForceBet(event){
        let node = event.target;
        let nor = node.getChildByName("nor");
        let sel = node.getChildByName("sel");
        if (sel.active){
            sel.active = false;
            nor.active = true;
            this._sScreen.isForceBlind = false;
        }else{
            sel.active = true;
            nor.active = false;
            this._sScreen.isForceBlind = true;
        }

        this.screenTableList();
    },

    screenTableList(){
        if(this._data.callBack){
            this._data.callBack(this._sScreen);
        }
    }
});
