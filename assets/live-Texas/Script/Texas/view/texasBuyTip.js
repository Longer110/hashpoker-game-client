/*
    德州买入筹码
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
let UIDialog = require("UIDialog");
let UIFrame = require("UIFrame");

cc.Class({
    extends: TexasBase,

    properties: {
        btnStandUp: cc.Node,
        btnBuy: cc.Node,
        greyBtnBuy: cc.Node,
        sliderGold: cc.Node,
        numBg: cc.Node,
        leftBoreder: cc.Node,
        rightBorder: cc.Node,

        checkButton: cc.Toggle,

        gold: cc.Label,
        selfGold: cc.Label,
        maxTipGold: cc.Label,
        haveGold: cc.Label,
        autoBuyMax: cc.Label,
        centerText: cc.Label,
        centerTextGrey: cc.Label,
        titleText: cc.Label,

        tipBg: cc.Node,

        _isShowRecharge: false,//显示充值弹窗
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // if (this.titleText) {
        //     this.titleText.string = TexasUtils._getText(85);  
        // }
        this.sliderGold.getComponent(cc.Slider).handle.node.on(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd, this);
        this.sliderGold.getComponent(cc.Slider).handle.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTouchEnd, this);
        this.sliderGold.getComponent(cc.Slider).node.on(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd, this);
        this.sliderGold.getComponent(cc.Slider).node.on(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTouchEnd, this);
        // MsgManager.on(MSG.NOTIFY.NOTIFY_UPDATE_BUY_GOLD, this._repUpdateBuyGold, this);
    },


    onSliderTouchEnd() {//结束只播放音效
        TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + "slide_huadong");

    },
    onDestroy() {
        // MsgManager.un(this._repUpdateBuyGold);
        if (this._sliderGold) {
            this.sliderGold.getComponent(cc.Slider).handle.node.off(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd, this);
            this.sliderGold.getComponent(cc.Slider).handle.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTouchEnd, this);
            this.sliderGold.getComponent(cc.Slider).node.off(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd, this);
            this.sliderGold.getComponent(cc.Slider).node.off(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTouchEnd, this);
        }

    },


    // update (dt) {},

    //刷新购买金币
    _repUpdateBuyGold() {
        let nStr = "筹码买入范围查看请求";
        // cc.warn("-----------------------------------------------------------------------------------------德州筹码买入范围查看请求");
        if (this.control.TexasGameBottomTip.node.active && this.control.TexasGameBottomTip.contemtList[0].active) {
            TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouTakeInRangeReq_CMD, {});
        }
    },

    //初始化提示
    _initTip(control, data, hallGold, selfGold) {
        cc.log("_initTip data,hallGold,selfGold:", data, hallGold, selfGold);

        let info = UserInfo.getInfo();

        this.control = control;

        this.initChat();
        this._setText();

        this.haveGold.string = TexasUtils._saveTwoPoint(data.nGold);
        this.selfGold.string = TexasUtils._saveTwoPoint(selfGold);
        let tableInfo = TexasData._getTableInfo();
        this.maxTipGold.node.active = tableInfo.nTakeInLimit > 0 ? true : false;
        this.maxTipGold.string = "注意:该牌桌补码限制为: " + tableInfo.nTakeInLimit;

        this.autoBuyMax.string = TexasUtils._getText(9);

        this.checkButton.isChecked = data.nIsAuto == 1 ? true : false;

        this.miniBuy = this._setIsBuyTips() ? Number(data.nMin) : 0;
        this.maxBuy = Number(data.nMax);
        this.tipBg.active = false;
        this.sliderGold.getComponent(cc.Slider).handle.node.getChildByName("bg").opacity = 255;
        if (tableInfo.nTakeInLimit > 0 && this.maxBuy == 0) {
            this.tipBg.active = true;
            this.sliderGold.getComponent(cc.Slider).handle.node.getChildByName("bg").opacity = 200;
        }
        if (TexasUtils._getClub()) {
            let bigBlind = TexasData._getTableInfo().nBuyMin || 2;
            //系数
            let multiple = String(bigBlind).indexOf('.') > -1 ? 10 : 1;
            this.perGold = Math.ceil(bigBlind / 2 * multiple) / multiple;
            cc.log("test club buy tip this.perGold:", this.perGold);
        }


        let maxGolds = Number(this.maxBuy);

        if (this._setIsBuyTips()) {
            if (Number(hallGold) < Number(this.maxBuy)) {
                maxGolds = Number(hallGold);

                // if (Number(hallGold+selfGold)<Number(this.maxBuy)) {
                //     maxGolds = Number(hallGold+selfGold);
                // }
            }
        }

        // let maxGolds = Number(hallGold)<Number(this.maxBuy)?Number(hallGold+selfGold)>Number(this.maxBuy)?Number(this.maxBuy):Number(hallGold+selfGold):Number(this.maxBuy);


        this.result = maxGolds;
        if (TexasUtils._getClub()) {
            this.result = this.miniBuy
        }

        this._maxResult = maxGolds;

        this.btnBuy.active = true;
        this.greyBtnBuy.active = false;
        this._isShowRecharge = false;

        if (maxGolds < this.miniBuy) {
            // this.btnBuy.active = false;
            // this.greyBtnBuy.active = true;
            this._isShowRecharge = true;
        } else {
            if (maxGolds == this.miniBuy && maxGolds == 0) {
                this.btnBuy.active = false;
                this.greyBtnBuy.active = true;
                this._isShowRecharge = false;
            } else {
                // this.btnBuy.active = true;
                // this.greyBtnBuy.active = false;
                this._isShowRecharge = false;
            }
        }

        if (control) {
            let selfSitId = control.TexasPlayerController._getSitId("nUserId", info.nUserID);
            if (!selfSitId) {//玩家不在牌桌
                this.btnBuy.active = false;
                this.greyBtnBuy.active = true;
                this._isShowRecharge = true;
            }
            this.btnStandUp.active = selfSitId;
        }

        cc.log("_initTip this.miniBu,this.maxBuy,maxGolds:", this.miniBu, this.maxBuy, maxGolds);

        this.gold.string = TexasUtils._saveTwoPoint(maxGolds);//买入金币

        let percentage = 0;
        if (maxGolds >= this.miniBuy) {
            if ((maxGolds - this.miniBuy) != 0 && (this.maxBuy - this.miniBuy) != 0) {
                percentage = (maxGolds - this.miniBuy) / (this.maxBuy - this.miniBuy);
            }
        }

        this.percentage = percentage;
        if (TexasUtils._getClub()) {
            this.gold.string = TexasUtils._saveTwoPoint(this.miniBuy);//买入金币
            //俱乐部 默认最小值
            percentage = 0;

        }
        this.refreshVolume(percentage);
        let text = this.btnStandUp.getChildByName("contain")
        clearInterval(text._standUpTimer);
        if (TexasData._getUserGold() == 0) {
            this.setStandUpTime(text, 10)
        } else {
            if (text._standUpTimer) {
                clearInterval(text._standUpTimer);
                text._standUpTimer = null;
            }
            text.getComponent(cc.Label).string = "取消";
        }

    },

    setStandUpTime(node, time) {
        if (!node) return
        node.getComponent(cc.Label).string = "取消(" + time + ")";
        if (node._standUpTimer) {
            clearInterval(node._standUpTimer);
        }
        node._standUpTimer = setInterval(() => {
            time--;
            if (time <= 0) {
                if (!node || !cc.isValid(node)) return
                if (!node.getComponent(cc.Label)) return
                node.getComponent(cc.Label).string = "取消(0)";
                clearInterval(node._standUpTimer);
                node._standUpTimer = null;
                this._clickStandUpBtn();
            } else {
                if (!node || !cc.isValid(node)) return
                if (!node.getComponent(cc.Label)) return
                node.getComponent(cc.Label).string = "取消(" + time + ")";
            }
        }, 1000);
    },


    //设置文本
    _setText() {
        if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
            this.centerText.string = TexasUtils._getText(43);
            this.centerTextGrey.string = TexasUtils._getText(43);
        }
    },

    //弹窗
    _setIsBuyTips() {
        return true;
    },

    //刷新
    refreshVolume(percentage) {
        let sliderWidth = this.sliderGold.width * percentage;
        this.sliderGold.getComponent(cc.Slider).progress = percentage;
        this.sliderGold.getChildByName("progress").width = sliderWidth;

        this._updateBox();
    },

    //滑动
    onSlideredGold(slider) {
        let curPro = Number((this.maxBuy - this.miniBuy) * slider.progress);
        let result = curPro + this.miniBuy;
        if (this.perGold && this.perGold > 0) {
            result = Math.floor(curPro / this.perGold) * this.perGold + this.miniBuy;
        }
        if (slider.progress == 0) {
            result = this.miniBuy;
        } else if (slider.progress >= this.percentage) {
            result = this._maxResult;
        }

        this.result = result;

        if (this.result >= this._maxResult) {
            this.result = this._maxResult;

            this.refreshVolume(this.percentage);

            this.gold.string = TexasUtils._saveTwoPoint(this._maxResult);
        } else {
            this.gold.string = TexasUtils._saveTwoPoint(result);

            if (result <= 0) {
                this.refreshVolume(0);
            } else {
                this.refreshVolume(slider.progress);
            }
        }
    },

    //更新文本框
    _updateBox() {
        if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
            let anchors = this.numBg.anchorX;
            this.gold._forceUpdateRenderData();
            let nWidth = this.gold.node.width + 20;
            let percentage = 1 / nWidth;
            let len = anchors * nWidth;

            let maxLeftPos = TexasUtils._getNodePos(this.leftBoreder, this.numBg);
            let maxRightPos = TexasUtils._getNodePos(this.rightBorder, this.numBg);

            let leftPos = this.numBg.x - len - 10;//左边距位置
            let rightPos = this.numBg.x + ((1 - anchors) * nWidth) + 10;//右边距位置
            if (leftPos <= maxLeftPos.x) {//超出左边距
                let reduce = maxLeftPos.x - leftPos;
                let needMoveAnchor = reduce * percentage;
                this.numBg.anchorX = anchors - needMoveAnchor;
            } else if (rightPos >= maxRightPos.x) {//超出右边距
                let reduce = rightPos - maxRightPos.x;
                let needMoveAnchor = reduce * percentage;
                this.numBg.anchorX = anchors + needMoveAnchor;
            } else {//正常居中
                this.numBg.anchorX = 0.5;
            }
        }
    },

    //按钮
    onClickBtn(event, data) {
        if (!event) {
            this._closeTip();
            return
        }

        let target = event.target;
        switch (target.name) {
            case "block"://关闭
                this._clickStandUpBtn();
                break;
            case "btn_close"://关闭
                this._clickStandUpBtn();
                break;
            case "label"://自动买入
                this._clickAuto();
                break;
            case "btn_buy"://买入
                this._clickBuy();
                break;
            case "btn_standUp"://站起
                this._clickStandUpBtn();
                break;
            default:
                break;
        }
    },


    //站起
    _clickStandUpBtn() {
        // if(!this.control.TexasGameBottomTip.node.active){
        //     return
        // }
        // if (TexasData._getGameStart() || TexasData._getUserGold() > 0) {
        if (TexasData._getUserGold() > 0) {//去除开始游戏判断，只判断金币是否为0
            this._closeTip()
            return
        }
        if (this.control) {
            this.control._onClickBtnStand();
            this._closeTip()
        }
    },

    //关闭
    _closeTip() {
        cc.log("_closeTip");
        let text = this.btnStandUp.getChildByName("contain")
        if(text._standUpTimer) {
            clearInterval(text._standUpTimer)
            text._standUpTimer = null
        }

        MsgManager.fire(MSG.NOTIFY.NOTIFY_SAVE_CLOSE_WINDOW);

        this.control.TexasGameBottomTip.node.active = false;
    },

    //自动买入
    _clickAuto() {
        cc.log("_clickAuto");

        var toggle = this.checkButton.getComponent(cc.Toggle);
        if (null != toggle) {
            if (toggle.isChecked) {
                toggle.isChecked = false;
            } else {
                toggle.isChecked = true;
            }
        }
    },

    //买入
    _clickBuy() {
        cc.log("test _clickBuy  ", this._isShowRecharge);


        if (this._isShowRecharge) {
            this.setRechargeWindow()
            return;
        }
        this._closeTip();

        if (this.result > 0) {

            let isAuto = 0;
            var toggle = this.checkButton.getComponent(cc.Toggle);
            if (null != toggle) {
                if (toggle.isChecked) {
                    isAuto = 1;
                }
            }

            let data = {
                nTakeIn: this.result,
                nIsAuto: isAuto,
            }

            let nStr = "筹码买入请求";
            // cc.warn("-----------------------------------------------------------------------------------------德州筹码买入请求",data);
            if (TexasUtils._getClub()) {
                TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhoTakeInReq_CMD, data);
                // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhoTakeInReq_CMD, data);
            } else {
                TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhoTakeInReq_CMD, data);
                // app.net.send(CMD.Texas.value, CMD.Texas.DeZhoTakeInReq_CMD, data);
            }
        }
    },

    //打开充值弹窗
    setRechargeWindow() {
        let parent = cc.director.getScene().getChildByName('Canvas').getChildByName('LayerView')
        let path = "popup/dialog/UIDialog";
        let text = "余额不足无法购买，请先充值"; //余额不足无法购买，请先充值
        app.ui.loadPopup(path, function (component) {
            this._closeTip();
            UIFrame.clearAllBlock();
            parent.addChild(component.node, 1024);
            component.setBtnText(UIDialog.EShowType.OKCANCEL);
            component.show(text, function (isOK) {
                if (isOK) {
                    this.control.createGameRechargeView()
                    this.control.startStandUpTimer()
                } else {
                    this._clickStandUpBtn()
                }

            }.bind(this));
        }.bind(this));
    },


});
