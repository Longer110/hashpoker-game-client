// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
//进度条


//裁切模式
let EMaskDirection= cc.Enum({
    vertical: 0,//垂直
    horizontal: 1, //水平
});


cc.Class({
    extends: cc.Component,

    properties: {
        maskNode: {
            default: null,
            type: cc.Node,
            tooltip: '裁切节点',
        },

        //裁切模式
        showAction: {
            default: EMaskDirection.vertical,
            type: cc.Enum(EMaskDirection),
            tooltip: '裁切模式',
        },

        backgroundNode: {
            default: null,
            type:cc.Node,
            tooltip: '背景图',
        },

        iconNode: {
            default: null,
            type:cc.Node,
            tooltip: '浮标',
        },
        _percent:0,
        _value:100,
        _currentValue:1,
        _minValue:1,

    },
    // onLoad () {},

    start () {

    },

    touchStartCallback(event){
        
        let pos = this.backgroundNode.convertTouchToNodeSpace(event.touch)
        this._calculateProgress(pos)
    },
    touchMoveCallback(event){
        let pos = this.backgroundNode.convertTouchToNodeSpace(event.touch)
        this._calculateProgress(pos)
    },
    touchEndCallback(event){

    },

    onEnable(){
        this.node.on(cc.Node.EventType.TOUCH_START,this.touchStartCallback,this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.touchMoveCallback,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.touchEndCallback,this);
    },
    onDisable(){
        this.node.off(cc.Node.EventType.TOUCH_START,this.touchStartCallback,this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE,this.touchMoveCallback,this);
        this.node.off(cc.Node.EventType.TOUCH_END,this.touchEndCallback,this);
        
    },

    //设置进度
    _calculateProgress(pos){
        cc.log(pos)
        let offset = 0
        let Max = 0
        let Min = 0
        let currentNum = 0
       
        if(this.showAction === EMaskDirection.vertical){
            Max = this.backgroundNode.height
            if(pos.y <= Min){
                currentNum =Min
            }else if(pos.y >= Max){
                currentNum =Max
            }else{
                currentNum =pos.y
            }
            this.maskNode.height = currentNum
            pos.y = currentNum
            if(this.iconNode){
                this.iconNode.y = this.node.convertToNodeSpaceAR(this.backgroundNode.convertToWorldSpace(pos)).y
            }
        }else{
            Max = this.backgroundNode.width
            if(pos.x <= Min){
                currentNum = Min
            }else if(pos.x >= Max){
                currentNum = Max
            }else{
                currentNum = pos.x
            }
            this.maskNode.width = currentNum
            pos.x = currentNum
            if(this.iconNode){
                this.iconNode.x = this.node.convertToNodeSpaceAR(this.backgroundNode.convertToWorldSpace(pos)).x
            }
        }
        this._percent = currentNum/Max
        this.setValueStr(Math.ceil(this._percent*this._value))
        cc.log("percent=",this._percent)
    },

    setValueStr(value){
        
        this._currentValue = value < this._minValue ? this._minValue:value;
        if(this.iconNode){
            let num = this.iconNode.getChildByName("num");
            if(num){
                num.getComponent(cc.Label).string = this._currentValue + ""
            }
        }
        cc.log("this._currentValue",this._currentValue)
    },
    setValue(value){
        this._value = value
    },
    setMinValue(value){
        this._minValue = value
        this.setValueStr(0)
        if(this.showAction === EMaskDirection.vertical){
            if(this.maskNode){
                this.maskNode.height = 0
            }
            if(this.iconNode){
                this.iconNode.y = 33
            }
        }else{
            if(this.maskNode){
                this.maskNode.width = 0
            }
            if(this.iconNode){
                this.iconNode.x = 0
            }
        }
    },
    getValue(){
        return this._currentValue
    },
    getPercent(){
        return this._percent
    },
});
