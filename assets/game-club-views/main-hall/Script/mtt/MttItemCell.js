// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
var UIListCell = require("UIListCell");
let i18n = require("i18n");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");

cc.Class({
    extends: UIListCell,

    properties: {
        mttName: cc.Label, //比赛名称
        numText: cc.Label, //人数
        timeInfoInTime: cc.Label, //剩余报名时间
        timeInfoNoInTime: cc.Label, //开赛时间

        chargeInfoTxt:cc.Label,  //报名费
        serviceInfoTxt:cc.Label, //服务费



        topIn:cc.Node,     //比赛中顶部
        topNoIn:cc.Node,   //未开始顶部
        numInfo:cc.Node,    //人数信息


        timeInfoIn:cc.Node, //比赛开始后时间信息
        timeInfoNoIn:cc.Node, //比赛未开始时间信息

        timeInfoNoInTimeInfo1:cc.Node, //即将开赛
        timeInfoNoInTimeInfo2:cc.Node, //开赛时间

        freeInfo:cc.Node,    //免费信息
        chargeInfo:cc.Node,  //报名费信息
        serviceInfo:cc.Node, //服务费信息


        battleBtn:cc.Node,   //观众按钮
        signupBtn:cc.Node,   //报名按钮
        delayedsignupBtn:cc.Node,   //延迟报名按钮
        contestBtn:cc.Node,   //进入比赛按钮
        cancelsignupBtn:cc.Node,   //取消报名按钮
        competitionBtn:cc.Node,   //比赛中按钮
        
    },
    start () {
    },
    onInit(data){
        cc.log("MttItemCell data",data)
        this.updateUI();
    },

    updateUI(){
        if(this.mttName){
            this.mttName.string = this.getName();
        }
        if(this.numText){
            this.numText.string = this.getNumStr();
        }
        if(this.numInfo && !this.numInfo.active){
            this.numInfo.active = true;
        }
        if(this.topIn){
            this.topIn.active = this.isStartGame();
        }
        if(this.topNoIn){
            this.topNoIn.active = !this.isStartGame();
        }
        if(this.timeInfoIn){
            this.timeInfoIn.active = this.isShowDelayedTime();
        }
        if(this.timeInfoNoIn){
            this.timeInfoNoIn.active = !this.isStartGame();
        }
        if(this.timeInfoInTime){
            this.timeInfoInTime.string = this.getDelayedTime();
        }
        if(this.timeInfoNoInTime){
            this.timeInfoNoInTime.string = this.getStartTime();
        }
        if(this.timeInfoNoInTimeInfo1){
            this.timeInfoNoInTimeInfo1.active = this.isBeforeTime();
        }
        if(this.timeInfoNoInTimeInfo2){
            this.timeInfoNoInTimeInfo2.active = !this.isBeforeTime();
        }
        if(this.signupBtn){
            this.signupBtn.active = this.isSignup();
        }
        if(this.battleBtn){
            this.battleBtn.active = this.isBattle();
        }
        if(this.delayedsignupBtn){
            this.delayedsignupBtn.active = this.isDelayedsignup();
        }
        if(this.contestBtn){
            this.contestBtn.active = this.isContest();
        }
        if(this.cancelsignupBtn){
            this.cancelsignupBtn.active = this.isCancelsignup();
        }
        if(this.competitionBtn){
            this.competitionBtn.active = false;
        }

        if(this.freeInfo){
            this.freeInfo.active = this.isFree();
        }
        if(this.chargeInfo){
            this.chargeInfo.active = !this.isFree();
        }
        if(this.serviceInfo){
            this.serviceInfo.active = !this.isFree();
        }
        if(this.chargeInfoTxt){
            this.chargeInfoTxt.string = this.getCharge();
        }
        if(this.serviceInfoTxt){
            this.serviceInfoTxt.string = this.getService();
        }

    },
    update(dt){
        this.updateUI();
    },
    onRefresh(){
        this.onInit(this.getData());
    },

    //获取报名费
    getCharge(){
        let data  = this.getData();
        if(data.tFeeSignUp.nFeeType == 2){//仅门票
            let txt = i18n.t("CLUB_MTT.Rule.19")
            txt = txt.replace(/\[TicketNeed]/g, data.tFeeSignUp.nTicketNeed);
            let ticketsinfoTxt = i18n.t("CLUB_MTT.Rule.40")
            ticketsinfoTxt = ticketsinfoTxt.replace(/\[num]/g, data.nTicketOwn);
            return txt + " " + ticketsinfoTxt;
        }else if(data.tFeeSignUp.nFeeType == 3){//金币或门票
            let txt = i18n.t("CLUB_MTT.Rule.18")
            txt = txt.replace(/\[TicketNeed]/g, data.tFeeSignUp.nTicketNeed);
            txt = txt.replace(/\[gold]/g, data.tFeeSignUp.nFeeA);
            let ticketsinfoTxt = i18n.t("CLUB_MTT.Rule.40")
            ticketsinfoTxt = ticketsinfoTxt.replace(/\[num]/g, data.nTicketOwn);
            return txt + " " + ticketsinfoTxt;
        }else{
            if(data.tFeeSignUp){
                return data.tFeeSignUp.nFeeA;
            }
        }
        return 0;
    },
    //获取服务费
    getService(){
        let data  = this.getData();
        if(data.tFeeSignUp){
            return data.tFeeSignUp.nFeeB;
        }
        return 0;
    },

    isStartGame(){
        let data  = this.getData();
        if(data.nStage == 0 || data.nStage == 1 || data.nStage == 2 || data.nStage == 10){
            return false;
        }
        return true;
    },

    isFree(){
        let data  = this.getData();
        if(data.tFeeSignUp && data.tFeeSignUp.nFeeType == 1){
            return true;
        }
        return false;
    },

    isCompetition(){
        let data  = this.getData();
        if(data.nOp == 0){
            return true;
        }
        return false;
    },

    isCancelsignup(){
        let data  = this.getData();
        if(data.nOp == 2){
            return true;
        }
        return false;
    },
    isContest(){
        let data  = this.getData();
        if(data.nOp == 3){
            return true;
        }
        return false;
    },

    isDelayedsignup(){
        let data  = this.getData();
        if(data.nOp == 4){
            return true;
        }
        return false;
    },
    isBattle(){
        let data  = this.getData();
        if(data.nOp == 5){
            return true;
        }
        return false;
    },

    isSignup(){
        let data  = this.getData();
        if(data.nOp == 1){
            return true;
        }
        return false;
    },
    isBeforeTime(){
        let data  = this.getData();
        if(!this.isStartGame()){
            if(data.nTimeStampBegin > data.nTimeStampNow){
                let offsetTime = data.nTimeStampBegin - data.nTimeStampNow;
                let beforeTime = 1 * 60 * 60;
                if(offsetTime <= beforeTime){
                    return true;
                }
            }
        }
        return false;
    },

    isShowDelayedTime(){
        if(this.isStartGame()){
            let data  = this.getData();
            if(data.nStage == 3){
                return true;
            }
        }
        return false;
    },
    getDelayedTime(){
        let timeAfter = "00:00";
        if(this.isStartGame()){
            let data  = this.getData();
            if(data.nTimeStampNow < (data.nTimeStampBegin + data.nTimeAfter)){
                let offsetTime = (data.nTimeStampBegin + data.nTimeAfter) - data.nTimeStampNow
                if(offsetTime < 0){
                    offsetTime = 0
                }
                timeAfter = this.format(i18n.t("CLUB_MTT.TimeFormat1"),new Date(Math.floor(offsetTime * 1000)))
            }
        }
        return timeAfter;
    },
    getStartTime(){
        let data  = this.getData();
        let timeBefore = ""
        let mttData = new Date(data.nTimeStampBegin * 1000);
        let curDate = new Date();
        if(curDate.getDate() == mttData.getDate()){
            timeBefore = this.format(i18n.t("CLUB_MTT.TimeFormat3"),mttData)
        }else{
            timeBefore = this.format(i18n.t("CLUB_MTT.TimeFormat2"),mttData)
        }
        if(!this.isStartGame()){
            if(data.nTimeStampBegin > data.nTimeStampNow){
                let offsetTime = data.nTimeStampBegin - data.nTimeStampNow;
                if(this.isBeforeTime()){
                    if(offsetTime < 0){
                        offsetTime = 0
                    }
                    timeBefore = this.format(i18n.t("CLUB_MTT.TimeFormat1"),new Date(Math.floor(offsetTime * 1000)))
                }
            }
        }
        return timeBefore;
    },
    getName(){
        let data  = this.getData();
        return data.sName;
    },
    getNumStr(){
        let data  = this.getData();
        return data.nUserCnt+"/"+data.nUserCntMax;
    },
    /**
     * 格式化日期显示
     * @param format 格式化字符串（例：yyyy-MM-dd hh:mm:ss）
     * @param date   时间对象
     */
    format(format, date) {
        let o = {
            "M+": date.getMonth() + 1,                      // month 
            "d+": date.getDate(),                           // day 
            "h+": date.getHours(),                          // hour 
            "m+": date.getMinutes(),                        // minute 
            "s+": date.getSeconds(),                        // second 
            "q+": Math.floor((date.getMonth() + 3) / 3),    // quarter 
            "S": date.getMilliseconds()                     // millisecond 
        }
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (let k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    },


    //报名回调
    signupClick(){
        cc.log("报名回调")
        if(clubMtt){
            clubMtt.signup(this.getData().nEventId);
        }
    },
    //延迟报名回调
    delayedsignupClick(){
        cc.log("延迟报名回调")
        if(clubMtt){
            clubMtt.delayedsignup(this.getData().nEventId);
        }
    },
    //取消报名回调
    cancelsignupClick(){
        cc.log("取消报名回调")
        // if(clubMtt){
        //     clubMtt.cancelsignup(this.getData().nEventId);
        // }
        MsgManager.fire(MSG.NOTIFY.MTT_CANCELSIGNUP,this.getData());
    },
    //进入比赛回调
    contestClick(){
        cc.log("进入比赛回调")
        if(clubMtt){
            clubMtt.contest(this.getData().nEventId);
        }
    },
    //观战回调
    battleClick(){
        cc.log("观战回调")
        if(clubMtt){
            clubMtt.battle(this.getData().nEventId);
        }
    },


    //规则回调
    ruleClick(){
        if(clubMtt){
            clubMtt.showMttRule(this.getData().nEventId);
        }
    }


});
