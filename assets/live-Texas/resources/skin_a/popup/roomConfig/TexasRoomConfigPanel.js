/*
    德州买入筹码
*/

let CMD = require("protocol_texas");
let Utils = require("Utils");
let TexasUtils = require("TexasUtils");
let MsgManager = require("MsgManager");
let MSG = require("Msg_Texas");
let TexasData = require("TexasData");
let TexasBase = require("TexasBase");
var ConfigGame = require("ConfigGame");
var accuracy = 10000


cc.Class({
    extends: TexasBase,

    properties: {
        select: cc.Node,
        timeSelect: cc.Node,
        numBg: cc.Node,
        rememberCheck: cc.Node,

        mangzhu: cc.Label,//盲注
        dairu: cc.Label,//最低/最高带入
        times: cc.Label,//牌局间隔
        time1: cc.Label,//短暂
        time2: cc.Label,//适中
        time3: cc.Label,//漫长
        renshu: cc.Label,//人数
        remember: cc.Label,//记住配置

        itemConfigPrefab:{//配置预制
            default: null,
            type: cc.Prefab
        },

        _nConfigId: 0,//配置id
        _nCapacity: 0,//人数配置
        _nIntervalLev: 2,//牌局间隔
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // MsgManager.on(MSG.NOTIFY.NOTIFY_UPDATE_BUY_GOLD, this._repUpdateBuyGold, this);
    },

    onDestroy(){
        // MsgManager.un(this._repUpdateBuyGold);
    },

    start () {
    },

    // update (dt) {},

    //初始化提示
    _initConfigPanel(data) {
        this.data = data;
        this.initChat();
        this._setText();
        this._setRememberConfig(TexasData._getCheckRemember());
        this._setTime(data.nIntervalLevDefault);
        this._setPanelInfo(data);
        if (TexasUtils._getSkin(["default"])){
            this.initSlider();
        }
        
    },

    //设置文本
    _setText() {
        if (TexasUtils._getSkin(["default","d"])) {
            this.mangzhu.string = TexasUtils._getText(3);//盲注
            this.dairu.string = TexasUtils._getText(4);//最低/最高带入
            this.times.string = TexasUtils._getText(58);//牌局间隔
            this.time1.string = TexasUtils._getText(59);//短暂
            this.time2.string = TexasUtils._getText(60);//适中
            this.time3.string = TexasUtils._getText(61);//漫长
            this.renshu.string = TexasUtils._getText(17);//人数
            this.remember.string = TexasUtils._getText(75);//记住配置
        }
    },

    initSlider(){
        this.unRegiester();
        var slider = this.numBg.getChildByName("slider_num").getComponent(cc.Slider)
        slider.handle.node.on(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd.bind(this, slider, 1), this);
        slider.handle.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTuchCancel.bind(this, slider, 1), this);
        slider.handle.node.on(cc.Node.EventType.TOUCH_START, this.onSliderTouchBegin.bind(this, slider, 1), this);
        slider.node.on(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd.bind(this, slider, 1), this);
        slider.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTuchCancel.bind(this, slider, 1), this);
        slider.node.on(cc.Node.EventType.TOUCH_START, this.onSliderTouchBegin.bind(this, slider, 1), this);

        var slider2 = this.timeSelect.getChildByName("slider_time").getComponent(cc.Slider)
        slider2.handle.node.on(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd.bind(this, slider, 2), this);
        slider2.handle.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTuchCancel.bind(this, slider, 2), this);
        slider2.handle.node.on(cc.Node.EventType.TOUCH_START, this.onSliderTouchBegin.bind(this, slider, 2), this);
        slider2.node.on(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd.bind(this, slider, 2), this);
        slider2.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTuchCancel.bind(this, slider, 2), this);
        slider2.node.on(cc.Node.EventType.TOUCH_START, this.onSliderTouchBegin.bind(this, slider, 2), this);
    },

    unRegiester(){
        var slider = this.numBg.getChildByName("slider_num").getComponent(cc.Slider)
        slider.handle.node.off(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd, this);
        slider.handle.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTuchCancel, this);
        slider.handle.node.off(cc.Node.EventType.TOUCH_START, this.onSliderTouchBegin, this);
        slider.node.off(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd, this);
        slider.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTuchCancel, this);
        slider.node.off(cc.Node.EventType.TOUCH_START, this.onSliderTouchBegin, this);

        var slider2 = this.timeSelect.getChildByName("slider_time").getComponent(cc.Slider)
        slider2.handle.node.off(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd, this);
        slider2.handle.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTuchCancel, this);
        slider2.handle.node.off(cc.Node.EventType.TOUCH_START, this.onSliderTouchBegin, this);
        slider2.node.off(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd, this);
        slider2.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTuchCancel, this);
        slider2.node.off(cc.Node.EventType.TOUCH_START, this.onSliderTouchBegin, this);
    },

    //设置记住配置
    _setRememberConfig(isCheck) {
        if (this.rememberCheck) {
            let isRemember = isCheck?"remember":"unRemember";
            TexasData._saveCheckRemember(isRemember);
            this.rememberCheck.active = isCheck;
        }
    },

    //设置时间间隔
    _setTime(index) {
        if (!TexasUtils._getSkin(["d"])) return;

        index = index?index:2;

        this._nIntervalLev = index;

        let timeChild = this.timeSelect.children;
        if (timeChild && timeChild.length>0) {
            for (let i=0; i<timeChild.length; i++) {
                let child = timeChild[i];

                let gou = child.getChildByName("gou");
                let text = child.getChildByName("text");

                gou.active = i+1==index?true:false;

                let color16 = i+1==index?"#e9c04d":"#dadbe1";
                var color = cc.Color.BLACK;
                let curColor = color.fromHEX(color16);
                text.color = new cc.Color(curColor.r,curColor.g,curColor.b);
            }
        }
    },

    //设置面板信息
    _setPanelInfo(data) {
        this.select.destroyAllChildren();

        if (data) {
            let arrConfig = data.arrConfig;//可选的盲注配置
            let arrCapacity = data.arrCapacity;//可选的人数配置

            let tableNum = ConfigGame.IS_LIVE_ONLY?6:9;//直播6人桌，合集9人桌
            let nConfigIdDefault = data.nConfigIdDefault?data.nConfigIdDefault:arrConfig[0].nConfigId;//默认配置
            let nCapacityDefault = data.nCapacityDefault?data.nCapacityDefault:tableNum;//默认人数

            this._nConfigId = nConfigIdDefault;
            this._nCapacity = nCapacityDefault;
            // this._nIntervalLev = data.nIntervalLevDefault?data.nIntervalLevDefault:0;

            if (arrConfig && arrConfig.length>0) {
                for (let i=0; i<arrConfig.length; i++) {
                    let info = arrConfig[i];
    
                    let configItem = cc.instantiate(this.itemConfigPrefab);
                    configItem.parent = this.select;
                    let roomConfigItem = configItem.getComponent("roomConfigItem");
                    roomConfigItem._createConfigItem(this,nConfigIdDefault,info);
                    configItem.active = true;
                }
            }
          
            if (arrCapacity && arrCapacity.length>0) {
                let peopleChild = this.numBg.children;
                if (peopleChild && peopleChild.length>0) {
                    for (let i=0; i<arrCapacity.length; i++) {
                        let count = arrCapacity[i];

                        for (let j=0; j<peopleChild.length; j++) {
                            let child = peopleChild[j];

                            if (i==j) {
                                let chip = child.getChildByName("chip");
                                if(chip){
                                    chip.active = count==nCapacityDefault?true:false;
                                }
                                

                                let num = child.getChildByName("num").getComponent(cc.Label);
                                num.string = count;

                                let color16 = count==nCapacityDefault?"#e9c04d":"#FFFFFF";
                                var color = cc.Color.BLACK;
                                let curColor = color.fromHEX(color16);
                                num.node.color = new cc.Color(curColor.r,curColor.g,curColor.b);

                                break;
                            }
                        }
                    } 
                }

               
            }

            if (TexasUtils._getSkin(["default"])){
                this.playerNumList = data.arrCapacity;
                this.initPlayerNum();
                this.initSelectTime();
            }
        }

       
    },
    
    //获得是否与上一次配置一致
    _getIsSameConfig() {
        let isSameConfig = true;

        let configData = Utils.clone(TexasData._getSelectConfig());

        if (this.data) {
            let data = this.data;
            let nConfigIdDefault = data.nConfigIdDefault;//默认配置
            let nCapacityDefault = data.nCapacityDefault;//默认人数
            let nIntervalLevDefault = data.nIntervalLevDefault;//默认牌局间隔 1:短暂 2:适中 3:漫长 

            if (nConfigIdDefault!=this._nConfigId || nCapacityDefault!=this._nCapacity || nIntervalLevDefault!=this._nIntervalLev) {
                isSameConfig = false;
            }
        }

        if (!isSameConfig) {
            configData.nConfigIdDefault = this._nConfigId;
            configData.nCapacityDefault = this._nCapacity;
            configData.nIntervalLevDefault = this._nIntervalLev;

            TexasData._setSelectConfig(configData);
        }
        
        return isSameConfig;
    },

    //点击toggle
    _clickToggle(nConfigId) {
        this._nConfigId = nConfigId;

        let configChild = this.select.children;
        if (configChild && configChild.length>0) {
            for (let i=0; i<configChild.length; i++) {
                let child = configChild[i];

                let roomConfigItem = child.getComponent("roomConfigItem");
                roomConfigItem._setSelected(false);
                if (roomConfigItem._nConfigId==nConfigId) {
                    roomConfigItem._setSelected(true);
                }
            }
        }
    },

    //点击Slider
    onClickSlider(event,data) {
        data = Number(data);

        if (this.data) {
            let peopleChild = this.numBg.children;
            if (peopleChild && peopleChild.length>0) {
                for (let i=0; i<peopleChild.length; i++) {
                    let child = peopleChild[i];
                    let chip = child.getChildByName("chip");
                    let num = child.getChildByName("num");

                    chip.active = i+1==data?true:false;

                    let color16 = i+1==data?"#e9c04d":"#dadbe1";
                    var color = cc.Color.BLACK;
                    let curColor = color.fromHEX(color16);
                    num.color = new cc.Color(curColor.r,curColor.g,curColor.b);
                }
            }

            let arrCapacity = this.data.arrCapacity;
            if (arrCapacity && arrCapacity.length) {
                if (arrCapacity[data-1]) {
                    this._nCapacity = arrCapacity[data-1];
                }
            }
        }

    },

    //点击时间间隔
    onClickTime(event,data) {
        data = Number(data);

        this._setTime(data);
    },

    //点击记住配置
    onClickBtnRemember() {
        if (this.rememberCheck) {
            let isCheck = !this.rememberCheck.active;
            this._setRememberConfig(isCheck);
        }
    },

    //确定
    onClickBtnSure() {
        this._nCapacity = TexasUtils._getSkin(["c"])?9:this._nCapacity;
        let data = {
            nConfigId: this._nConfigId,
            nCapacity: this._nCapacity,
            nIntervalLev: this._nIntervalLev,//牌局间隔 1:短暂 2:适中 3:漫长
        }

        let nStr = "房间设置请求"

        if (TexasUtils._getClub()) {
            TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouCofingReq_CMD, data);
            // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouCofingReq_CMD, data);
        }else {
            TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhouCofingReq_CMD, data);
            // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouCofingReq_CMD, data);
        }

        this.onClickBtnClose();
    },

    //关闭弹窗
    onClickBtnClose() {
        TexasData._setIsShowRoomConfig(false);
        this.node.active = false;
    },

    initPlayerNum(){
        let slider = this.numBg.getChildByName("slider_num");
        let widget = slider.getComponent(cc.Widget);
        if (widget){
            widget.updateAlignment();
        }
        
        let space = slider.width/(this.playerNumList.length - 1);
        let selectIndex = this.playerNumList.length;
        var panelNum = this.numBg.getChildByName("panelNum")
        for (let i = 0; i < this.playerNumList.length; i++) {
            if (this._nCapacity == this.playerNumList[i]){
                selectIndex = i + 1;
            }
            let child = panelNum.children[i];
            if (i < this.playerNumList.length){
                if (i == 0){
                    child.x = space * i;
                }else{
                    child.x = space * i;
                }
            }
        }
        this.setPlayerNumSlider(slider.getComponent(cc.Slider), selectIndex)
    },

    setPlayerNumSlider(slider, selIndex){
        let length = this.playerNumList.length;

        let callBack = function(pro){
            this.setPlayerNumProgress(pro);
        }.bind(this)

        this.calculateProgress(slider, selIndex, length, callBack);
    },

    setPlayerNumProgress(pro){
        let progress = this.numBg.getChildByName("slider_num").getComponent(cc.ProgressBar);
        progress.progress = pro;

        let length = this.playerNumList.length;
        let total = (length-1) * 2
        let curMark = Math.floor(pro * accuracy)/accuracy;
        let perMark = Math.floor(1/total * accuracy)/accuracy;
        let index = Math.ceil(curMark/perMark);

        let setColor = function(index){
            var panelNum = this.numBg.getChildByName("panelNum")
            for (let i = 0; i < 5; i++) {
                var num = panelNum.getChildByName("num" + (i+1));
                if (i == index){
                    num.color = new cc.Color(226, 199, 162, 255);
                    num.getComponent(cc.Label).fontSize = 30;
                }else{
                    num.color = new cc.Color(169, 168, 174, 255);
                    num.getComponent(cc.Label).fontSize = 25;
                }
                
            }
        }.bind(this);
        
        if (index >= total){
            this._nCapacity = this.playerNumList[length - 1];
            setColor(length - 1);
            return;
        }

        if (index%2 != 0){
            index = index - 1;
        }

        this._nCapacity = this.playerNumList[index/2];
        setColor(index/2);
    },

    //计算滑动到那一格
    calculateProgress(slider, selIndex, len, callBack){
        let pro = slider.progress;
        let length = len;
        let total = (length-1) * 2
        let perMark = Math.floor(1/total * accuracy)/accuracy;
        if (selIndex){
            slider.progress = Math.floor((selIndex - 1) * 2 *perMark * accuracy)/accuracy;
            pro = slider.progress;
        }
        let curMark = Math.floor(pro * accuracy)/accuracy;
        let index = Math.ceil(curMark/perMark);
        
        if (index >= total){
            slider.progress = 1;
            callBack(1);
            return;
        }

        if (index%2 != 0){
            index = index - 1;
        }

        slider.progress = index * perMark;
        callBack(index * perMark);
    },

    initSelectTime(){
        let slider = this.timeSelect.getChildByName("slider_time");
        let widget = slider.getComponent(cc.Widget);
        if (widget){
            widget.updateAlignment();
        }
        
        let space = slider.width/2;
        this.intervalArr = [1,2,3]
        let selectIndex = 2;
        for (let i = 0; i < this.intervalArr.length; i++) {
            if (this._nIntervalLev == this.intervalArr[i]){
                selectIndex = i + 1;
            }
        }
        this.setSelectTimeSlider(slider.getComponent(cc.Slider), selectIndex)
    },

    setSelectTimeSlider(slider, selIndex){
        let length = this.intervalArr.length;

        let callBack = function(pro){
            this.setSelectTimeProgress(pro);
        }.bind(this)

        this.calculateProgress(slider, selIndex, length, callBack);
    },

    setSelectTimeProgress(pro){
        let progress = this.timeSelect.getChildByName("slider_time").getComponent(cc.ProgressBar);
        progress.progress = pro;

        let length = this.intervalArr.length;
        let total = (length-1) * 2
        let curMark = Math.floor(pro * accuracy)/accuracy;
        let perMark = Math.floor(1/total * accuracy)/accuracy;
        let index = Math.ceil(curMark/perMark);

        let setColor = function(index){
            for (let i = 0; i < 3; i++) {
                var text = this.timeSelect.getChildByName("box" + (i+1)).getChildByName("text");
                if (i == index){
                    text.color = new cc.Color(226, 199, 162, 255);
                    text.getComponent(cc.Label).fontSize = 30;
                }else{
                    text.color = new cc.Color(169, 168, 174, 255);
                    text.getComponent(cc.Label).fontSize = 25;
                }
                
            }
        }.bind(this);
        
        if (index >= total){
            this._nIntervalLev = this.intervalArr[length - 1];
            setColor(length - 1);
            return;
        }

        if (index%2 != 0){
            index = index - 1;
        }

        this._nIntervalLev = this.intervalArr[index/2];
        setColor(index/2);
    },


    onSliderTouchBegin(event, customEventData){
    },

    onSliderTouchEnd(event, customEventData){
        let index = Number(customEventData);
        
        switch(index){
            case 1: 
                //设置人数
                let slider = this.numBg.getChildByName("slider_num").getComponent(cc.Slider);
                this.setPlayerNumSlider(slider);
                break;
            case 2:
                //设置时间间隔
                let sliderTime = this.timeSelect.getChildByName("slider_time").getComponent(cc.Slider);
                this.setSelectTimeSlider(sliderTime);
                break;

        }
        
    },

    onSliderTuchCancel(event, customEventData){
        this.onSliderTouchEnd(event, customEventData);
    },

    onClickSlider(slider, customEventData){
        let index = Number(customEventData);
        switch(index){
            case 1: 
                //设置人数
                this.setPlayerNumProgress(slider.progress);
                break;
            case 2: 
                //设置时间间隔
                this.setSelectTimeProgress(slider.progress);
                break;
        }
    }
});
