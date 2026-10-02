/*
    德州带出筹码
*/
let CMD = require("protocol_texas");
let TexasUtils = require("TexasUtils");
let MsgManager = require("MsgManager");
let MSG = require("Msg_Texas");
let UserInfo = require("UserInfo");
let TexasBase = require("TexasBase");
let TexasData = require("TexasData");

let TexasConfig = require("TexasConfig");
let TexasMusicPath = TexasConfig.TEXASMUSICPATH;

cc.Class({
    extends: cc.Component,

    properties: {
        _content:cc.Node,//滑动组件
        _sliderGold:cc.Slider,//滑动组件
        _canCarryGold:cc.Label,//可撤出筹码

        _cur_label:cc.Label,//当前设置滑动

        _min_label:cc.Label,//最小滑动
        _max_label:cc.Label,//最大滑动
        _zancunGold:cc.Label,//暂存筹码
        _autoCarryNode:cc.Node,//设置自动撤码
        _autoTip :cc.Node, //自动撤码界面
        _helpTipNode : cc.Node, //撤码提示界面

        _maskForeground :cc.Node,//滑动条前图节点

        _data:null, //请求可以带出的数据

        _isAutoCarry:false, //是否自动撤码


        _maxCarryNum:0,//最多撤码数
    },

    // LIFE-CYCLE CALLBACKS:

    
    onLoad () {
        this.initNode()
        this._sliderGold.node.on('slide', this.onSliderTouchMove, this);
        this._sliderGold.node.on(cc.Node.EventType.TOUCH_END,this.onSliderTouchEnd, this);
        this._sliderGold.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTouchEnd, this);
        // MsgManager.on(MSG.NOTIFY.NOTIFY_UPDATE_BUY_GOLD, this._repUpdateCarryGold, this);

    },
    
    onDestroy(){
        // MsgManager.un(this._repUpdateCarryGold);
        if(this._sliderGold.node){
            this._sliderGold.node.off('slide', this.onSliderTouchMove, this);
            this._sliderGold.node.off(cc.Node.EventType.TOUCH_END,this.onSliderTouchEnd, this);
            this._sliderGold.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTouchEnd, this);
        }
    },

    initNode(){
        if(this._content) return
        this._content = this.node.getChildByName("content")
        let sliderNode = this._content.getChildByName("slider")
        this._sliderGold = sliderNode.getChildByName("slider_gold").getComponent(cc.Slider)
        this._canCarryGold = this._content.getChildByName("canCarryGold").getChildByName("num").getComponent(cc.Label)
        this._zancunGold = this._content.getChildByName("zancun").getChildByName("num").getComponent(cc.Label)
        this._autoCarryNode = this._content.getChildByName("auto")
        this._min_label = sliderNode.getChildByName("min_label").getComponent(cc.Label)
        this._max_label = sliderNode.getChildByName("max_label")
        this._cur_label = this._sliderGold.node.getChildByName("curCarry").getComponent(cc.Label)
        this._maskForeground = this._sliderGold.node.getChildByName("progress").getChildByName("Foreground")

        this._autoTip = this._content.getChildByName("autoTip")
        this._autoTip.active = false
        this._helpTipNode = this.node.parent.parent.parent.getChildByName("helpTipNode")
        this._helpTipNode.active = false
    },


    _initTip(control,data) {
        this.control = control;
        this.initNode()
        this._sliderGold.progress = 1;
        // this._setSliderMask(0)
        if(data.nCanOutChips <= 0){
            this._sliderGold.progress = 0
        }
        this._updateView(data)
        this.onSliderTouchMove(this._sliderGold)
    },


    _closeTip() {
        cc.log("_closeTip");

        MsgManager.fire(MSG.NOTIFY.NOTIFY_SAVE_CLOSE_WINDOW);

        this.control.TexasGameBottomTip.node.active = false;
    },

        // message ClubDeZhouSCTakeOutInfoRsp {
        //   required int32 nRlt=1;              //返回值 0成功 1不在座位上 2牌桌撤码未开启 3可撤码余额不足
        //   optional double nTempChips=2;        //暂存区数值
        //   optional double nCanOutChips=3;        //剩余可撤码数值
        //   optional bool isAutoTabkeOut=4;        //当前设置是否自动撤码
        // }

        

    _updateView(data){
        this._data = data
        this._zancunGold.string = data.nTempChips + ""
        this._canCarryGold.string = data.nCanOutChips + ""
        //最大最小
        let tableInfo = TexasData._getTableInfo();
        // this._min_label.string = tableInfo.nTabkeOutOdd + "倍"
        this._min_label.string = "最小"
        this._max_label.string = "最大"
        this._autoTip.getChildByName("tip").getChildByName("num").getComponent(cc.Label).string =  tableInfo.nTabkeOutOdd * tableInfo.nBuyMin + ""

        this._maxCarryNum = data.nCanOutChips

        this._autoCarryNode.getChildByName("selected").active = data.isAutoTabkeOut
        this._isAutoCarry = data.isAutoTabkeOut
        this.updateAutoSelectView()
    },

    onSliderTouchMove(slider){
        let progress = slider.progress;
        let value = progress * this._maxCarryNum;
        this._setSliderMask(progress)
        // if(value > 0){
            value = Math.floor(value * 10) / 10
        // }else{
        //     value = 0
        // }
        this._cur_label.string =  value + ""
        this.showGreyBtn(value <= 0);
    },

    _setSliderMask(progress){
        let fwidth = this._maskForeground.width
        this._maskForeground.x = (1- progress) * (- fwidth)
    },


    onSliderTouchEnd() {
        TexasUtils._playEffect( TexasMusicPath.TEXAS_MUSIC_PATH  + "slide_huadong");
       
    },

        
    // update (dt) {},

    //金币变动请求带出范围
    _repUpdateCarryGold() {
        if (this.control && this.control.TexasGameBottomTip.node.active && this.control.TexasGameBottomTip.contemtList[1].active) {
            this.control._onClickBtnCarry()
        }
    },

    
    onClickAutoBtn(){
        // this._isAutoCarry = !this._isAutoCarry
        // this.updateAutoSelectView()
        if(this.control){
            this.control._onClickSetAutoCarry(!this._isAutoCarry)
        }
    },

    onClickShowHelpTip(){
        this._helpTipNode.active = !this._helpTipNode.active 
    },

    updateAutoSelectView(){
        this._autoCarryNode.getChildByName("selected").active = this._isAutoCarry

        this._content.getChildByName("btn_sure").active = !this._isAutoCarry
        this._content.getChildByName("canCarryGold").active = !this._isAutoCarry
        this._content.getChildByName("slider").active = !this._isAutoCarry
        this._autoTip.active = this._isAutoCarry
        if(this._isAutoCarry) {
            this.showGreyBtn(false);
        }else {
            this.showGreyBtn(Number(this._cur_label.string) <= 0);
        }

        // this._content.getChildByName("zancun").active = this._isAutoCarry
    },

    //确定带出
    onClickSureCarry() {
       if(this.control){
            this.control._onClickBtnCarrySure(this._cur_label.string)
        }
    },

    showGreyBtn(isShow){  
        this._content.getChildByName("btn_grey").active = isShow;
    },

});
