
let MsgManager = require("MsgManager");
let MSG = require("Msg_Texas");
let CMD = require("protocol_texas");
let TexasData = require("TexasData");
let TexasUtils = require("TexasUtils");

cc.Class({
    extends: cc.Component,

    properties: {
        titleList: {
            default: [],
            type: cc.Node
        },
        contemtList: {
            default: [],
            type: cc.Node
        },

        toggleClose: {
            default: null,
            type: cc.Node
        },

        toggleOpen: {
            default: null,
            type: cc.Node
        },

        _targetIndex: -1,
        _control: null
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        MsgManager.on(MSG.NOTIFY.NOTIFY_UPDATE_BUY_GOLD, this._repUpdateBottomView, this);
    },

    onDestroy() {
        MsgManager.un(this._repUpdateCarryGold);
    },

    start() {
        
    },

    // update (dt) {},


    toggleTitle(control, index) {
        this._control = control
        this.titleList[1].active = TexasData._getIsCarry();
        // console.log("切换页签 *****11111********* index :" + index)
        // if(this._targetIndex == index){
        //     return
        // }
        // this._targetIndex = index
        this.onClickTitleBtn({ "target": this.titleList[index] })
    },



    _repUpdateBottomView() {
        if (!this.node) {
            return
        }
        if (!this.node.active) {
            return
        }
        if (this.contemtList[0].active && this._targetIndex == 0) {//买入
            this._control._onClickBtnBuy()
        } else if (this.contemtList[1].active && this._targetIndex == 1) {//撤码
            this._control._onClickBtnCarry()
        }

    },


    onClickTitleBtn(event) {
        let idx = -1
        for (let i = 0; i < this.titleList.length; i++) {
            let avtiveBo = event.target == this.titleList[i]
            this.titleList[i].getChildByName("normal").active = !avtiveBo
            this.titleList[i].getChildByName("selected").active = avtiveBo

            this.contemtList[i].active = avtiveBo
            if (avtiveBo) {
                idx = i
            }
        }
        
        if (idx != this._targetIndex) {
            this._targetIndex = idx
            this._repUpdateBottomView()
        }
        this._targetIndex = idx



        if (this._targetIndex == 0) {
            TexasData._setWindowData(4);
        } else if (this._targetIndex == 1) {
            TexasData._setWindowData(6);
        }

    },

    onClickCloseBtn() {
        cc.log('test --=== bottom close ==----')
        if (this._targetIndex === 0) {
            //不参与游戏中,或者没带入金额,关闭买入要站起
            // if (!TexasData._getSelfParticipating() || TexasData._getUserGold() == 0) {
            if (TexasData._getUserGold() == 0) {
                if (this._control) {
                    this._control._onClickBtnStand();
                }
            }
        }
        MsgManager.fire(MSG.NOTIFY.NOTIFY_SAVE_CLOSE_WINDOW);
        this.node.active = false
        this._targetIndex = -1
    },


    //保险
    onClickOpenBaoxianBtn(event) {
        return;
        let isOpen = event.target.name == "toggleOpen"
        this.toggleClose.active = isOpen
        this.toggleOpen.active = !isOpen
        // this.node.getChildByName("LayerBaoxianTip").getChildByName("toggle").getChildByName("toggleOpen").active = !isOpen

        //TODO ：请求设置保险开关
    }
});
