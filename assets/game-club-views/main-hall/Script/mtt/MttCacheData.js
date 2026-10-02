//MTT大厅缓存数据
let i18n = require("i18n");
let Base64 = require("base64");

let MttCacheData = cc.Class({
    extends: cc.Component,
    ctor() {
        this.initData();
    },

    initData(){
        this._mttList = [];
        this.players = [];
        this.awards = [];
    },
    
    clearPlayers(){
        this.players.length = 0;
    },

    addPlayers(data){
        if(data.hasOwnProperty("arrItems")){
            for(let k=0;k<data.arrItems.length;k++){
                this.players.push(data.arrItems[k]);
            }
        }
    },

    getPlayers(){
        return this.players;
    },


    clearAwards(){
        this.awards.length = 0;
    },

    addAwards(data){
        if(data.hasOwnProperty("arrItems")){
            for(let k=0;k<data.arrItems.length;k++){
                this.awards.push(data.arrItems[k]);
            }
        }
    },

    getAwards(){
        return this.awards;
    },



    //mtt列表
    setMttList(data){
        if(data.hasOwnProperty("arrEvents")){
            this._mttList = data.arrEvents;
            if(this._mttList){
                if(data.hasOwnProperty("nTimeStampNow")){
                    for(let k=0;k<this._mttList.length;k++){
                        this._mttList[k].nTimeStampNow = data.nTimeStampNow
                    }
                }
                this._mttList.sort(function(a, b){
                    return a.nEventId - b.nEventId;
                })
            }
        }
    },
    //获取mtt列表
    getMttList(){
        return this._mttList;
    },

    updateMttUserCnt(data){
        for(let k=0;k<this._mttList.length;k++){
            if(this._mttList[k].nEventId == data.nEventId){
                this._mttList[k].nUserCnt = data.nUserCnt;
                break;
            }
        }
    },
    updateMttSignUp(data){
        for(let k=0;k<this._mttList.length;k++){
            if(this._mttList[k].nEventId == data.nEventId){
                if(this._mttList[k].nSignUp == 0){
                    this._mttList[k].nSignUp = 1;
                }
                if(data.hasOwnProperty("nOp")){
                    this._mttList[k].nOp = data.nOp;
                }
                break;
            }
        }
    },
    updateMttSignUpCancel(data){
        for(let k=0;k<this._mttList.length;k++){
            if(this._mttList[k].nEventId == data.nEventId){
                if(this._mttList[k].nSignUp == 1){
                    this._mttList[k].nSignUp = 0;
                }
                if(data.hasOwnProperty("nOp")){
                    this._mttList[k].nOp = data.nOp;
                }
                break;
            }
        }
    },

    //更新比赛信息页面
    updateRule(data){
        for(let k=0;k<this._mttList.length;k++){
            if(this._mttList[k].nEventId == data.nEventId){
                if(data.hasOwnProperty("tSt")){
                    this._mttList[k].tSt.nUserCnt = data.tSt.nUserCnt
                    this._mttList[k].tSt.nBlindUpR = data.tSt.nBlindUpR
                    this._mttList[k].tSt.nBlindLevel = data.tSt.nBlindLevel
                    this._mttList[k].tSt.nChipAvg = data.tSt.nChipAvg
                    this._mttList[k].tSt.nLevelUpTo = data.tSt.nLevelUpTo
                }
                break;
            }
        }
    },

    updateStateAndnOp(data){
        if(data.hasOwnProperty("nEventId")){
            for(let k=0;k<this._mttList.length;k++){
                if(this._mttList[k].nEventId == data.nEventId){
                    if(data.hasOwnProperty("nOp")){
                        this._mttList[k].nOp = data.nOp;
                    }
                    if(data.hasOwnProperty("nStage")){
                        this._mttList[k].nStage = data.nStage;
                        if(data.nStage == 1 || data.nStage == 0){
                            this._mttList[k].nUserCnt = 0;
                        }
                    }
                    if(data.hasOwnProperty("nTimeStampBegin")){
                        this._mttList[k].nTimeStampBegin = data.nTimeStampBegin;
                    }
                    if(data.hasOwnProperty("nTimeStampNow")){
                        this._mttList[k].nTimeStampNow = data.nTimeStampNow;
                    }

                   
                    break;
                }
            }
        }
    },

    getMttDataById(id){
        for(let k=0;k<this._mttList.length;k++){
            if(this._mttList[k].nEventId == id){
                return this._mttList[k];
            }
        }
        return null;
    },

    updateMttListTime(dt){
        for(let k=0;k<this._mttList.length;k++){
            this._mttList[k].nTimeStampNow += dt;
            this._mttList[k].tSt.nBlindUpR -= dt;
            if(this._mttList[k].tSt.nBlindUpR < 0){
                this._mttList[k].tSt.nBlindUpR = 0;
            }
        }
    },

    startMttListSchedule(){
        if(cc.director.getScheduler().isScheduled(this.updateMttListTime, this)){
            cc.director.getScheduler().unschedule(this.updateMttListTime, this);
        }
        cc.director.getScheduler().schedule(this.updateMttListTime,this,0,false);
    },
    stopMttListSchedule(){
        if(cc.director.getScheduler().isScheduled(this.updateMttListTime, this)){
            cc.director.getScheduler().unschedule(this.updateMttListTime, this);
        }
    },

});

let object = new MttCacheData();
module.exports = object;
