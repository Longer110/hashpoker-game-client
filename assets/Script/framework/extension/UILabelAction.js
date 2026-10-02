// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


//动作类型
let EActionType= cc.Enum({
    scroll_up_and_down: 0,//上下滚动
});

//字体类型
let ELabelType= cc.Enum({
    gold: 0,//金币
});


let Utils = require("Utils")
cc.Class({
    extends: cc.Component,

    properties: {
        //动作类型
        showAction: {
            default: EActionType.scroll_up_and_down,
            type: cc.Enum(EActionType),
        },

        //字体类型
        labelType: {
            default: ELabelType.gold,
            type: cc.Enum(ELabelType),
        },

        //字体类型
        actionTime: {
            default: 1.0,
            type: cc.Float,
            tooltip: '动作时间',
        },

        _label:cc.Label,
        _startValue:0,
        _currentTime:0,
        _endValue:0,
        _offsetValue:0,
        _isRunAction:false
    },

    // LIFE-CYCLE CALLBACKS:
    
    onLoad () {
        this._label = this.node.getComponent(cc.Label)
        this._isRunAction = false
    },

    
    //销毁
    onDestroy(){
       
        this.unschedule(this._actionUpdateCallback);

    },


    _setString(value){
        this._startValue = value
        if(cc.isValid(this._label)){
            if(this.labelType === ELabelType.gold){
                this._label.string =  Utils.convertNumberToStr2(value)
            }
        }
    },

    /*
        startNum 开始数字
        endNum 结束数值
        isScroll 是否执行动作
    */
    runScrollAction(){
        let oneValue = arguments[0]
        let twoValue = arguments[1]
        let threeValue = arguments[2]

        if(threeValue){
            this._endValue = twoValue
        }else{
            this._endValue = oneValue
            if(!this._isRunAction){
                this._setString(oneValue)
            }
        }
        if(threeValue){
            if(this.showAction === EActionType.scroll_up_and_down){
                this._scroll_up_and_down(twoValue)
            }
        }

    },

    _scroll_up_and_down(value){

        this.unschedule(this._actionUpdateCallback);

        if(this._startValue === value){
            return
        }
        let valueOffset = value - this._startValue
        this._offsetValue = valueOffset/this.actionTime
        this._currentTime = this.actionTime
        this.schedule(this._actionUpdateCallback, 0.1);
        this._isRunAction = true

    },

    _actionUpdateCallback(dt){

        this._currentTime = this._currentTime - dt
        if(this._currentTime <= 0){
            this.unschedule(this._actionUpdateCallback);
            this._startValue = this._endValue
            this._setString(this._startValue)
            this._isRunAction = false
        }else{
            this._startValue = this._startValue + (this._offsetValue*dt)
            this._setString(Math.floor(this._startValue))
        }
        
    },




    // update (dt) {},
});
