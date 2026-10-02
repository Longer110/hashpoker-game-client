// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//我的 牌局设置
let i18n = require("i18n");
let TAG = "club_adminManage";
let DynamicListView = require("DynamicListView");
let Utils = require("Utils");
let LocalStorage = require("LocalStorage");
let UIFrame = require("UIFrame");

let UIDialog = require("UIDialog");

//我的 牌局设置 修改需要同步预制体HallGameSetting
cc.Class({
    extends: cc.Component,

    properties: {
        toggle1: cc.Toggle, //背景音乐设置
        toggle2: cc.Toggle, //音效设置
        btn_gameBgList: {
            default: [],
            type: cc.Node,
        },

        btn_PokerList: {
            default: [],
            type: cc.Node,
        },

        betSelectLayout: {
            default: null,
            type: cc.Node,
        },

        betSelectTipNode: {
            default: null,
            type: cc.Node,
        },


        _scene:null,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },



    start () {
        let musicVolume = app.storage.getMusicVolume();
        let effectVolume = app.storage.getEffectVolume();
        if (musicVolume <= 0){
            this.toggle1.isChecked = false;
            this.onClickToggle(this.toggle1, 1);
        }else{
            this.toggle1.isChecked = true;
            this.onClickToggle(this.toggle1, 1);
        }

        if (effectVolume <= 0){
            this.toggle2.isChecked = false;
            this.onClickToggle(this.toggle2, 2);
        }else{
            this.toggle2.isChecked = true;
            this.onClickToggle(this.toggle2, 2);
        }

        let gameBgIndex = LocalStorage.getItem("CLUB_GAME_BG");
        if (!gameBgIndex){
            gameBgIndex = 4;
            
        }
        this.setGameBg(gameBgIndex);

        let pokerSkin = LocalStorage.getItem("CLUB_POKER_SKIN");
        if (!pokerSkin){
            pokerSkin = 1;
        }
        this.setPoker(pokerSkin);


        
        this.betSelectStorage = LocalStorage.getItem("CLUB_GAME_BET_SELECT",[]);
        if(this.betSelectStorage.length == 0){
            this.betSelectStorage = ["1/3","1/2", "2/3", "1", "2"];
        }
        this._selectBetItem(this.betSelectStorage)
    },

    // update (dt) {},

    init(data){
        this._data = data;
    },

    onClickClose(){
        this.node.destroy();
    },

    onClickBetSeletTip(){
        this.betSelectTipNode.active = true
    },
    onClickCloseSeletTip(){
        this.betSelectTipNode.active = false
    },


    onClickbetSelectItem(event){
        if(event.target.getChildByName("selected").active && this.betSelectStorage.length == 3){
            UIFrame.showTips("快捷加注最少3个");
            return
        }
        if(!event.target.getChildByName("selected").active && this.betSelectStorage.length == 5){
            UIFrame.showTips("快捷加注最多5个");
            return
        }

        if(event.target.getChildByName("selected").active){
            if(this.betSelectStorage.length == 3){//最少3个
                UIFrame.showTips("快捷加注最少3个");
                return
            }else{
                let value = event.target.getChildByName("value").getComponent(cc.Label).string
                this.betSelectStorage = this.betSelectStorage.filter(num => num != value);
            }
        }else{
            if( this.betSelectStorage.length == 5){//最多5个
                UIFrame.showTips("快捷加注最多5个");
                return
            }else{
                let value = event.target.getChildByName("value").getComponent(cc.Label).string
                this.betSelectStorage.push(value)
            }
        }
        this._selectBetItem(this.betSelectStorage)
    },



    //[1/2,1/3]
    _selectBetItem(dataList){
        let localList = []
        for (let index = 0; index < this.betSelectLayout.childrenCount; index++) {
            this.betSelectLayout.children[index].getChildByName("selected").active = false
            let valueNumber = this.betSelectLayout.children[index].getChildByName("value").getComponent(cc.Label).string
            for (let i = 0; i < dataList.length; i++) {
                if(valueNumber == dataList[i]){
                    this.betSelectLayout.children[index].getChildByName("selected").active = true
                    localList.push(valueNumber)
                }
            } 
        }
        
        this.betSelectStorage = this.sortFractions(localList);

        LocalStorage.setItem("CLUB_GAME_BET_SELECT",localList)


        // let test = LocalStorage.getItem("CLUB_GAME_BET_SELECT",null);
        //  //console.log("test CLUB_GAME_BET_SELECT :",test);
        
    },

    sortFractions(arr) {
        return arr.slice().sort((a, b) => {
            const parseValue = (str) => {
            if (str.includes("/")) {
                const [num, den] = str.split("/").map(Number);
                return num / den; // 分数
            } else {
                return Number(str); // 整数或小数
            }
            };

            return parseValue(a) - parseValue(b);
        });
    },



    onClickToggle(event, data){
        let num = Number(data);
        let node = event.node;
        // let sp_select = node.getChildByName("sp_select");
        // if (event.isChecked){
        //     sp_select.x = 23;
        // }else{
        //     sp_select.x = -23;
        // }

        if (num == 1){
            if (event.isChecked){
                app.storage.setMusicVolume(1);
                node.getChildByName("Background").active = false
            }else{
                app.storage.setMusicVolume(0);
                node.getChildByName("Background").active = true
            }
            
        }else{
            if (event.isChecked){
                app.storage.setEffectVolume(1);
                node.getChildByName("Background").active = false
            }else{
                app.storage.setEffectVolume(0);
                node.getChildByName("Background").active = true
            }
        }
    },

    onClickGameBg(event, customEventData){
        let index = Number(customEventData);
        this.setGameBg(index);
        LocalStorage.setItem("CLUB_GAME_BG", index);

        if (this._data && this._data.callBack){
            this._data.callBack({bg: index});
        }
    },

    //背景：1,2,3,4//只使用3,4
    setGameBg(index){
        if((index == 1) || (index == 2) ) {
            index = 4
        }
        for (let i = 0; i < this.btn_gameBgList.length; i++) {
            let btn = this.btn_gameBgList[i];
            let select = btn.getChildByName("select");
            if (index == (i + 1)){
                select.active = true;
            }else{
                select.active = false;
            }
            
        }
    },

    //扑克牌：1,2
    onClickPoker(event, customEventData){
        let index = Number(customEventData);
        this.setPoker(index);

        LocalStorage.setItem("CLUB_POKER_SKIN", index);
        if (this._data && this._data.callBack){
            this._data.callBack({poker: index});
        }
    },

    setPoker(index){
        for (let i = 0; i < this.btn_PokerList.length; i++) {
            let btn = this.btn_PokerList[i];
            let select = btn.getChildByName("select");
            if (index == (i + 1)){
                select.active = true;
            }else{
                select.active = false;
            }
            
        }
    }
});
