/*
    德州操作按钮
*/

let CMD = require("protocol_texas");
let TexasData = require("TexasData");
let TexasController = require("TexasController");
let TexasPlayerController = require("TexasPlayerController");
let TexasUtils = require("TexasUtils");
let UserInfo = require("UserInfo");
let LocalStorage = require("LocalStorage");
let TexasConfig = require("TexasConfig");
let TexasMusicPath = TexasConfig.TEXASMUSICPATH;
cc.Class({
    extends: cc.Component,

    properties: {
        TexasPlayerController: TexasPlayerController,//玩家容器

        TexasController: TexasController,

        sliderBg: cc.Node,//滑动箭头背景
        addBetSlider: cc.Node,//加注滑动
        poolButton: cc.Node,//底池按钮

        stateBtn: cc.Node,//阶段按钮
        unStateBtn: cc.Node,//非阶段按钮
        otherBtn: cc.Node,//其他按钮

        alarmClock: cc.Node,//倒计时-弃牌
        alarmClockGuoPai: cc.Node,//倒计时-过牌

        btn_jiazhu: cc.Node,//加注按钮
        btn_allin: cc.Node,//allin按钮
        allinIcon: cc.Node,//allin
        btn_guopai: cc.Node,//让牌
        sliderGold: cc.Node,
        addBetLabel: cc.Node,//加注按钮文本
        addBetIcon: cc.Node,//加注按钮背景
        addBetIcon2: cc.Node,//加注2

        addBetBg: cc.Node,//滑动背景

        addBetCount: cc.Label,//加注值
        callCount: cc.Label,//跟注值
        unStateCallCount: cc.Label,//预选按钮跟注值
        sliderLabel: cc.Label,//滑动值
        maxLabel: cc.Label,//最大下注值

        qpText: cc.Label,
        gpText: cc.Label,
        gzText: cc.Label,
        autokpText: cc.Label,
        autogzText: cc.Label,
        zyjzText: cc.Label,
        jzText: cc.Label,
        jzText_grey: cc.Label,
        qhgText: cc.Label,
        grhText: cc.Label,
        lpText: cc.Label,
        jshlpText: cc.Label,
        hdpjText: cc.Label,
        zxText: cc.Label,
        countdownClock: cc.Node,//倒计时
        countdownClockGuoPai: cc.Node,//倒计时-过牌

        unStateBtnArry: {//非执行按钮
            default: [],
            type: cc.SpriteFrame
        },

        betBg: {//滑动背景
            default: [],
            type: cc.SpriteFrame
        },
        quickBetBtnSpriteFrames: {
            default: [],
            type: cc.SpriteFrame
        },

        _touch: false,//滑动
        _lastTouchPos: 0,//上一次滑动值
        _curTouchPos: 0,//当前滑动值

        _noStateGen: 0,//预跟注值
        _addBet: 0,//加注值
        _step: 0.01,//步长
        _poolButtonChildPos: [],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._blueGlow = new cc.Color(62, 225, 230);//非阶段蓝色 #3EE1E6
        this._whiteGlow = new cc.Color(255, 255, 255);//非阶段白色 #FFFFFF
        this._redGlow = new cc.Color(251, 114, 114);//非阶段红色  #FB7272
        if (this.sliderGold) {
            this.sliderGold.getComponent(cc.Slider).handle.node.on(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd, this);
            this.sliderGold.getComponent(cc.Slider).handle.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTouchEnd, this);
            this.sliderGold.getComponent(cc.Slider).node.on(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd, this);
            this.sliderGold.getComponent(cc.Slider).node.on(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTouchEnd, this);
        }
    },




    onSliderTouchEnd() {//结束只播放音效
        TexasUtils._playEffect(TexasMusicPath.TEXAS_MUSIC_PATH + "slide_huadong");
        // this.onTouchJiaZhuEnd();
    },

    start() {
        this._poolButtonChildPos = [
            [cc.v2(-190, 36), cc.v2(0, 93), cc.v2(190, 36)],
            [cc.v2(-205, -7), cc.v2(-78, 93), cc.v2(78, 93), cc.v2(205, -7)],
            [cc.v2(-285, -112), cc.v2(-167, 49), cc.v2(0, 93), cc.v2(167, 49), cc.v2(285, -122)],
        ];
        //console.log("_poolButtonChildPos:", this._poolButtonChildPos);
        this._hideSoundComponent();
        this.setQuickBetButton()
    },

    onEnable() {
        if (TexasUtils._getClub()) {
            // this.btn_jiazhu.on(cc.Node.EventType.TOUCH_START, this.onTouchJiaZhuStart, this);
            // this.btn_jiazhu.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchJiaZhuMove,this);
            // this.btn_jiazhu.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchJiaZhuEnd,this);
            // this.btn_jiazhu.on(cc.Node.EventType.TOUCH_END,this.onTouchJiaZhuEnd,this);
        }
    },

    onDisable() {
        if (TexasUtils._getClub()) {
            // this.btn_jiazhu.off(cc.Node.EventType.TOUCH_START, this.onTouchJiaZhuStart, this);
            // this.btn_jiazhu.off(cc.Node.EventType.TOUCH_MOVE,this.onTouchJiaZhuMove,this);
            // this.btn_jiazhu.off(cc.Node.EventType.TOUCH_CANCEL,this.onTouchJiaZhuEnd,this);
            // this.btn_jiazhu.off(cc.Node.EventType.TOUCH_END,this.onTouchJiaZhuEnd,this);
        }
        if (this.sliderGold) {
            this.sliderGold.getComponent(cc.Slider).handle.node.off(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd, this);
            this.sliderGold.getComponent(cc.Slider).handle.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTouchEnd, this);
            this.sliderGold.getComponent(cc.Slider).node.off(cc.Node.EventType.TOUCH_END, this.onSliderTouchEnd, this);
            this.sliderGold.getComponent(cc.Slider).node.off(cc.Node.EventType.TOUCH_CANCEL, this.onSliderTouchEnd, this);
        }
    },

    update(dt) {
        // if (this._touch && this.nBarHigh) {
        //     if (this._lastTouchPos==0) {
        //         this.progres = 0;
        //         this._lastTouchPos = this._curTouchPos;

        //         return;
        //     }

        //     let nReduce = this._curTouchPos - this._lastTouchPos;

        //     if (Math.abs(nReduce)<10 || nReduce==0) return;

        //     if (this.progres<=0) {
        //         this.progres = nReduce>0?0.03:-0.03;

        //         if (Math.abs(nReduce)>=30) {
        //             this.progres = nReduce>0?0.1:-0.1;
        //         }
        //     }

        //     let nProgress = Number(this.progressValue) + this.progres;
        //     if (nProgress>=1) {
        //         nProgress = 1;
        //     }else if(nProgress<=0){
        //         nProgress = 0;
        //     }

        //     this.progres = 0;

        //     let slider = {
        //         progress: Number(nProgress)
        //     }

        //     this._lastTouchPos = this._curTouchPos;
        //     this.onSlideredGold(slider);
        // }
    },

    //隐藏音效组件
    _hideSoundComponent() {
        let poolBtns = this.poolButton.getComponentsInChildren(cc.Button);
        for (let i = 0; i < poolBtns.length; i++) {
            let child = poolBtns[i];
            child.node.getComponent("UISound").enabled = false;
        }
        let stateBtns = this.stateBtn.getComponentsInChildren(cc.Button);
        for (let i = 0; i < stateBtns.length; i++) {
            let child = stateBtns[i];
            child.node.getComponent("UISound").enabled = false;
        }
    },

    //isSelfBet: 1:自己阶段 2:非自己阶段 3:其他按钮 
    _initOperatePanel(data, isSelfBet, isBtnJiazhu, callBack) {
        cc.log("_initOperatePanel data,isSelfBet:", data, isSelfBet);
        //初始化弃牌过牌按钮
        this._initAlarmClock();
        this.data = data;

        this._touch = false;
        this._lastTouchPos = 0,//上一次滑动值
            this._curTouchPos = 0,//当前滑动值

            this._setText();

        this.initUnStateButton();
        // this.initOtherButton();

        this._showOperateBtn(isSelfBet);

        if (isSelfBet == 1) {
            let poolChild = this.poolButton.children;

            if (poolChild && poolChild.length > 0) {
                for (let i = 0; i < poolChild.length; i++) {
                    let child = poolChild[i];

                    child.active = false;
                }
            }

            this._initSelfState(data);
            if (TexasUtils._getClub()) {
                this.poolButton.active = true;//加注底池按钮
            }


            if (!isBtnJiazhu && TexasUtils._getClub()) {
                for (let i = 0; i < this.poolButton.children.length; i++) {
                    let child = this.poolButton.children[i];
                    if (child && child.active) {
                        child.stopAllActions();
                        child.scale = 0;
                        child.runAction(cc.sequence(cc.delayTime(0.1), cc.scaleTo(0.15, 1).easing(cc.easeOut(3)), cc.callFunc(function (args) {
                            child.scale = 1
                        })));
                    }
                }

                if (!this.btn_allin.active && callBack) {
                    callBack();
                }

                for (let i = 0; i < this.stateBtn.children.length; i++) {
                    let child = this.stateBtn.children[i];
                    if (child && child.active) {
                        if (child.name == "btnQiPai") {
                            child.x = -236;
                        } else if (child.name == "btn_guopai" || child.name == "btn_genzhu" || child.name == "btn_jiazhuGrey") {
                            child.x = 236;
                        }

                        let posy = child.y;
                        let posx = child.x;
                        child.stopAllActions();
                        if (posx < -10 || posx > 10) {
                            child.x = 5;
                        }
                        child.scale = 0;
                        child.runAction(cc.sequence(cc.delayTime(0.1), cc.scaleTo(0.15, 1).easing(cc.easeOut(3))));
                        child.runAction(cc.sequence(cc.delayTime(0.1), cc.moveTo(0.15, posx, posy).easing(cc.easeOut(3)), cc.callFunc(function (args) {
                            cc.warn("--------------operate run action end-----------------" + child.name);
                            child.scale = 1;
                            child.x = posx;
                        })));
                    }

                }
            }


            // this.stateBtn.scale = 0;
            // this.stateBtn.runAction(cc.scaleTo(0.3, 1));

        } else if (isSelfBet == 2) {
            this._initUnSelfState(data);
        } else if (isSelfBet == 3) {
            this._showButton(4, data);
        }
    },

    //设置文本
    _setText() {
        if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
            this.qpText.string = TexasUtils._getText(21);
            this.gpText.string = TexasUtils._getClub() ? TexasUtils._getText(182) : TexasUtils._getText(22);
            if (TexasUtils._getSkin(["default"])) {
                this.gpText.string = TexasUtils._getText(182);
            }
            if (this.gzText) {
                this.gzText.string = TexasUtils._getText(23);
            }
            if (this.autokpText) {
                this.autokpText.string = TexasUtils._getText(180);
            }
            if (this.autogzText) {
                this.autogzText.string = TexasUtils._getText(181);
            }
            if (this.zyjzText) {
                this.zyjzText.string = TexasUtils._getText(178);
            }
            this.jzText.string = "";
            this.jzText_grey.string = TexasUtils._getText(19);
            this.qhgText.string = TexasUtils._getClub() ? TexasUtils._getText(179) : TexasUtils._getText(24);
            this.grhText.string = TexasUtils._getText(25);
            this.lpText.string = TexasUtils._getText(26);
            this.jshlpText.string = TexasUtils._getText(27);
            this.hdpjText.string = TexasUtils._getText(28);
            this.zxText.string = TexasUtils._getText(29);
        }
    },

    //加注
    _showOperateJiaZhu(visible) {
        this.sliderBg.active = visible;//加注滑动背景
        this.addBetSlider.active = visible;//加注滑动
        this.poolButton.active = visible;//加注底池按钮
    },

    //操作按钮
    _showOperateStateBtn(visible) {
        this.stateBtn.active = visible;
    },

    _clearAllOperateBtn() {
        this._showOperateStateBtn(false)
        this._showOperateOtherBtn(false)
        this._showOperateUnStateBtn(false)
    },



    //预操作按钮
    _showOperateUnStateBtn(visible) {
        this.unStateBtn.active = visible;
    },

    //其他按钮
    _showOperateOtherBtn(visible) {
        this.otherBtn.active = visible;
    },

    _showOperateBtn(isSelfBet) {
        this.sliderBg.active = false;//加注滑动背景
        this.addBetSlider.active = false;//加注滑动
        this.poolButton.active = false;//加注底池按钮
        this.stateBtn.active = isSelfBet && Number(isSelfBet) == 1 ? true : false;
        this.unStateBtn.active = isSelfBet && Number(isSelfBet) == 2 ? true : false;
        this.otherBtn.active = isSelfBet && Number(isSelfBet) == 3 ? true : false;
    },

    parseValueToNumber(str) {
        if (str.includes("/")) {
            const [num, den] = str.split("/").map(Number);
            return num / den; // 分数转换为小数
        } else {
            return Number(str); // 整数或小数
        }
    },

    _initSelfState(data) {
        let info = UserInfo.getInfo();

        if (data.tRaiseChoice) {
            let tRaiseChoice = data.tRaiseChoice;
            let nMin = tRaiseChoice.nMin;//加注最小值
            let nMax = tRaiseChoice.nMax;//加注最大值
            let arrQuickRaise = tRaiseChoice.arrQuickRaise;//可快速操作的选项 -10:(1/2底池)  -11:(2/3底池) -12:(1个底池)  -13:(2个大盲) -14:(3个大盲)  -15:(4个大盲)  -1:(AllIn)

            if (Number(nMin) >= 0) {
                this._addBet = nMin;
            }

            if (TexasUtils._getClub()) {
                this._addBet = 0;
            }

            // (1: 1/2; 2: 2/3; 3:1 4:2个盲注 5:3个盲注 6:4个盲注 7:allin)
            let poolBtnArr = [];
            if (TexasUtils._getClub()) {
                if (!TexasData._getIsAOF()) {
                    let poolNum = TexasData._getRewardPoolSum();
                    let selfGold = this.TexasPlayerController._getGold("nUserId", info.nUserID);//获得自己金币
                    let betSelectStorage = LocalStorage.getItem("CLUB_GAME_BET_SELECT", []);
                    if (betSelectStorage.length == 0) {
                        betSelectStorage = ["1/3", "1/2", "2/3", "1", "2"]
                        LocalStorage.setItem("CLUB_GAME_BET_SELECT", betSelectStorage);
                    }

                    let poolChildPosList = this._poolButtonChildPos[betSelectStorage.length - 3];
                    //根据本地存储的选择显示，最小三个最多五个
                    for (let i = 0; i < betSelectStorage.length; i++) {

                        let child = this.poolButton.getChildByName("addBetBtn" + (i + 1));
                        let grayChild = child.getChildByName("gray");
                        let titlepre = child.getChildByName("titlepre").getComponent(cc.Label);
                        titlepre.string = betSelectStorage[i];
                        let labelnum = child.getChildByName("num").getComponent(cc.Label);
                        let selectnum = this.parseValueToNumber(betSelectStorage[i]) * poolNum;
                        let showselectnum = Math.ceil(parseFloat(TexasUtils._tranfPointNumber(selectnum)) * 10) / 10;
                        labelnum.string = showselectnum;
                        if (Number(nMin) <= selectnum && nMax >= selectnum) {
                            labelnum.node.active = true;
                            grayChild.active = false;
                            child.opacity = 255;
                            let childBetButton = child.getChildByName("addBetBtn").getComponent(cc.Button);
                            let call = childBetButton.clickEvents[0];
                            if (call) {
                                call.customEventData = selectnum;
                            }
                        } else {
                            grayChild.active = true;
                            child.opacity = 102;
                            labelnum.node.active = true;
                        }
                        child.setPosition(poolChildPosList[i]);
                        child.active = true;
                    }
                }
            } else {
                if (arrQuickRaise && arrQuickRaise.length > 0) {
                    for (let i = 0; i < arrQuickRaise.length; i++) {
                        let arr = Number(arrQuickRaise[i]);

                        if (arr == -10) {
                            arr = 1;
                        } else if (arr == -11) {
                            arr = 2;
                        } else if (arr == -12) {
                            arr = 3;
                        } else if (arr == -13) {
                            arr = 4;
                        } else if (arr == -14) {
                            arr = 5;
                        } else if (arr == -15) {
                            arr = 6;
                        } else if (arr == -1) {
                            arr = 7;
                        }

                        poolBtnArr.push(arr);
                    }
                }
            }

            //this._showButton(3,poolBtnArr);
        }

        let nOpA = Number(data.nOpA);//按钮1显示  -5:弃牌
        let nOpB = Number(data.nOpB);//按钮2显示  -1:AllIn, -2:让牌, >0:跟注xx
        let nOpC = Number(data.nOpC);//按钮3显示  -1:AllIn, -3:加注 -4:加注(置灰)

        // (1:弃牌 2:让牌 3:跟注 4:加注 5:Allin 6:加注置灰)
        this.stateBtnArr = [];
        if (nOpA == -5) {
            nOpA = 1;
        }

        if (nOpB == -1) {
            nOpB = 5;
        } else if (nOpB == -2) {
            nOpB = 2;
            this.setBetButtonText(false)
        } else if (nOpB > 0) {
            this.callCount.string = TexasUtils._tranfPointNumber(nOpB);
            // this.callCount.node.active = false;
            this.setBetButtonText(true)
            nOpB = 3;
        }

        // if (TexasUtils._getSkin(["d"])) {
        //     this.btn_allin.x = 5.764;
        //     this.btn_allin.getComponent(cc.Widget).bottom = 253.12;
        //     if (nOpC==-4) {
        //         this.btn_allin.x = 146.144;
        //         this.btn_allin.getComponent(cc.Widget).bottom = 185.23;
        //     }
        // }else if (TexasUtils._getSkin(["b"])) {
        //     this.btn_allin.x = -0.791;
        //     this.btn_allin.getComponent(cc.Widget).bottom = 341.16;
        //     if (nOpC==-4) {
        //         this.btn_allin.x = 138.483;
        //         this.btn_allin.getComponent(cc.Widget).bottom = 272.50;
        //     }
        // }else if (TexasUtils._getSkin(["c","default"])) {
        //     this.btn_allin.x = 5.609;
        //     // this.btn_allin.getComponent(cc.Widget).bottom = 177.50;
        //     if (nOpC==-4) {
        //         this.btn_allin.x = 128.609;
        //     }
        // }

        if (nOpC == -1) {
            nOpC = 5;
            if (nOpB == 3) {
                nOpC = 7; //跟注优化 + 中间allin按钮
            } else if (nOpB == 2) {
                nOpC = 7; //让牌优化 + 中间allin按钮
            }
        } else if (nOpC == -3) {
            nOpC = 4;
        } else if (nOpC == -4) {
            // nOpC = 6;
            nOpC = 0;
        }

        if (this.TexasPlayerController) {
            if (nOpC == 0) {
                this.TexasPlayerController._setHead(true);
            } else {
                this.TexasPlayerController._setHead(false);
            }
        }


        this.stateBtnArr = [nOpA, nOpB, nOpC];
        this._showButton(1, this.stateBtnArr);

        this.addBetLabel.active = true;
        this.addBetIcon.active = true;
        this.addBetIcon2.active = false;

    },

    _initUnSelfState(data) {
        let arrOption = data.arrOption;

        let unStateBtnArr = [];
        for (let i = 0; i < arrOption.length; i++) {
            let arrOptionItem = arrOption[i];
            let nOpId = Number(arrOptionItem.nOpId);//-20:弃或过  -21:让牌 -22:跟任何注 >0:跟xx -23:结束后亮牌 -24:亮牌
            let isOn = arrOptionItem.isOn;//当前预操作按钮选中状态 true:选中 false:未选中

            // (1:弃或过 2:让牌 3:跟 4:跟任何注 5:亮牌 6:结束后亮牌)
            if (nOpId == -20) {
                nOpId = 1;
            } else if (nOpId == -21) {
                nOpId = 2;
            } else if (nOpId == -22) {
                nOpId = 4;
            } else if (nOpId == -23) {
                nOpId = 6;
            } else if (nOpId == -24) {
                nOpId = 5;
            } else if (nOpId > 0) {
                this._noStateGen = nOpId;

                let count = TexasUtils._tranfPointNumber(nOpId);
                if (TexasUtils._getSkin(["default"])) {
                    count = ""
                }
                this.unStateCallCount.string = count;

                nOpId = 3;
            }

            if (isOn) {
                this.initUnStateButton(nOpId);
            }

            if (nOpId != 4) {
                unStateBtnArr.push(nOpId);
            }

        }

        this._showButton(2, unStateBtnArr);
    },

    /*************************************按钮类型显示***************************************************/

    //按钮显示 [type(1:阶段按钮 2:非阶段按钮 3:底池按钮 4:其他按钮)]
    _showButton(type, arry) {
        cc.log("显示阶段按钮 :", arry);


        let nButton = this.stateBtn;
        if (type == 2) {
            nButton = this.unStateBtn;
        } else if (type == 3) {
            nButton = this.poolButton;
        } else if (type == 4) {
            nButton = this.otherBtn;
        }

        // cc.log("显示阶段按钮 nButton:", nButton);
        let btnChild = nButton.children;

        if (btnChild && btnChild.length > 0) {
            for (let i = 0; i < btnChild.length; i++) {
                let child = btnChild[i];

                if (child.name.toString() != "chip") {
                    child.active = false;
                }
            }

            for (let i = 0; i < btnChild.length; i++) {
                let child = btnChild[i];

                for (let j = 0; j < arry.length; j++) {
                    let arryItem = arry[j];

                    if (i + 1 == arryItem) {
                        if (TexasUtils._getClub()) {
                            if (type == 3 && child.getChildByName("num")) {//(1: 1/4; 2: 1/3; 3:1/2 4:2/3 5:1)
                                arryItem = Number(arryItem);
                                if (arryItem >= 1 && arryItem <= 5) {
                                    let num = child.getChildByName("num").getComponent(cc.Label);
                                    let poolNum = TexasData._getRewardPoolSum();
                                    let pool = poolNum;
                                    if (arryItem == 1) {
                                        pool = 1 / 4 * poolNum;
                                    } else if (arryItem == 2) {
                                        pool = 1 / 3 * poolNum;
                                    } else if (arryItem == 3) {
                                        pool = 1 / 2 * poolNum;
                                    } else if (arryItem == 4) {
                                        pool = 2 / 3 * poolNum;
                                    }
                                    num.string = TexasUtils._tranfPointNumber(pool);
                                }
                            }
                        } else {
                            if (type == 3 && child.getChildByName("num")) {//(1: 1/2; 2: 2/3; 3:1 4:2个盲注 5:3个盲注 6:4个盲注 7:allin)
                                arryItem = Number(arryItem);
                                if (arryItem >= 1 && arryItem <= 6) {
                                    let num = child.getChildByName("num").getComponent(cc.Label);
                                    if (arryItem >= 4 && arryItem <= 6) {
                                        let nBigBlind = TexasData._getBigBlind();//大盲注

                                        let nReduce = 2;
                                        let nGame = TexasData._getGame();
                                        if (nGame == 3) {
                                            nReduce = 1;
                                            nBigBlind = TexasData._getPreAnte();
                                        }

                                        let nMan = arryItem - nReduce;
                                        num.string = nMan * nBigBlind;
                                    } else {
                                        let poolNum = TexasData._getRewardPoolSum();
                                        let pool = poolNum / 2;
                                        if (arryItem == 2) {
                                            pool = 2 / 3 * poolNum;
                                        } else if (arryItem == 3) {
                                            pool = poolNum;
                                        }
                                        num.string = TexasUtils._tranfPointNumber(pool);
                                    }
                                }
                            }
                        }

                        console.log(`显示阶段按钮 child : ` + child.name);
                        child.active = true;

                        break;
                    }


                }
            }

        }

    },

    /*************************************按钮***************************************************/

    //获得按钮类型
    _getButtonType(index) {
        cc.log("获得按钮类型 index,this.stateBtnArr:", index, this.stateBtnArr);

        let type = 0;

        if (this.stateBtnArr && this.stateBtnArr.length > 0) {
            let arry = this.stateBtnArr;

            for (let i = 0; i < arry.length; i++) {
                let nIndex = Number(arry[i]);
                if (nIndex == 7) {
                    type = 3;   //中间allin
                    break;
                } else if (index == nIndex) {
                    type = i + 1;

                    break;
                }

            }
        }

        return type;
    },

    //阶段按钮(1:弃牌 2:让牌 3:跟注 4:加注 5:Allin 6:亮牌 7:回到牌局 8:加注置灰)
    onClickBtnStateBtn(event, data) {
        cc.log("点击阶段按钮:", data);

        data = Number(data);

        if (data != 4) {
            this._showOperateBtn();

            let type = this._getButtonType(data);

            if (type && Number(type) > 0) {
                let nData = {
                    nOpButton: type,
                }

                if (Number(type) == 3) {
                    nData.nRaise = this._addBet;
                }

                let nStr = "阶段按钮操作请求";
                // cc.warn("-----------------------------------------------------------------------------------------德州阶段按钮操作请求",nData);
                if (TexasUtils._getClub()) {
                    TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouOpReq_CMD, nData);
                    // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouOpReq_CMD, nData);
                } else {
                    TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhouOpReq_CMD, nData);
                    // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouOpReq_CMD, nData);
                }
            }
        } else {
            if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
                if (!this.addBetIcon.active && !this.addBetIcon2.active) {//已点击加注按钮选择加注值
                    this._showOperateBtn();

                    let nData = {
                        nOpButton: 3,
                        nRaise: this._addBet,
                    }

                    let nStr = "阶段按钮操作请求";
                    // cc.warn("-----------------------------------------------------------------------------------------德州阶段按钮操作请求",nData);
                    if (TexasUtils._getClub()) {
                        TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouOpReq_CMD, nData);
                        // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouOpReq_CMD, nData);
                    } else {
                        TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhouOpReq_CMD, nData);
                        // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouOpReq_CMD, nData);
                    }
                } else {
                    this.addBetLabel.active = false;
                    this.addBetIcon.active = false;
                    this.addBetIcon2.active = false;
                    this.btn_jiazhu.active = false;

                    this._showSlider(this.data);
                }
            } else {
                if (!this.addBetIcon.active && this.addBetIcon2.active) {//已点击加注按钮选择加注值
                    this._showOperateBtn();

                    let nData = {
                        nOpButton: 3,
                        nRaise: this._addBet,
                    }

                    let nStr = "阶段按钮操作请求";
                    // cc.warn("-----------------------------------------------------------------------------------------德州阶段按钮操作请求",nData);
                    if (TexasUtils._getClub()) {
                        TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouOpReq_CMD, nData);
                        // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouOpReq_CMD, nData);
                    } else {
                        TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhouOpReq_CMD, nData);
                        // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouOpReq_CMD, nData);
                    }
                } else {
                    this.addBetLabel.active = false;
                    this.addBetIcon.active = false;
                    this.addBetIcon2.active = true;

                    this._showSlider(this.data);
                }
            }
        }
    },

    //非阶段按钮(1:弃或过 2:让牌 3:跟 4:跟任何注 5:亮牌 6:结束后亮牌)
    onClickBtnUnStateBtn(event, data) {
        cc.log("点击非阶段按钮:", data);

        data = Number(data);

        let isOn = false;

        let saveOperate = Number(TexasData._getSaveOperate());//获得保存执行动作(1:弃或过 2:让牌 3:跟 4:跟任何)
        if (data != Number(saveOperate)) {
            isOn = true;
        }

        if (isOn) {
            this.initUnStateButton(data);
        } else {
            this.initUnStateButton();
            TexasData._setSaveOperate(0);
        }

        //-20:弃或过  -21:让牌 -22:跟任何注 >0:跟xx -23:结束后亮牌 -24:亮牌
        let nOpId = -20;
        if (data == 2) {
            nOpId = -21;
        } else if (data == 3) {
            nOpId = this._noStateGen;
        } else if (data == 4) {
            nOpId = -22;
        } else if (data == 5) {
            nOpId = -24;
        } else if (data == 6) {
            nOpId = -23;
        }

        let nData = {
            nOpId: nOpId,
            isOn: isOn,
        }

        let nStr = "预操作请求";
        // cc.warn("-----------------------------------------------------------------------------------------德州预操作请求",nData);
        if (TexasUtils._getClub()) {
            TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouPreOpReq_CMD, nData);
        } else {
            TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhouPreOpReq_CMD, nData);
            // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouPreOpReq_CMD, nData);
        }
    },

    //阶段按钮(1:回到牌局 2:坐下)
    onClickBtnOtherBtn(event, data) {
        cc.log("点击其他按钮:", data);

        data = Number(data);

        if (data == 1) {//回到牌局(取消托管)
            this._showOperateBtn();

            let nStr = "取消托管请求";
            // cc.warn("-----------------------------------------------------------------------------------------德州取消托管请求");
            if (TexasUtils._getClub()) {
                TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouCancelAutoReq_CMD, {});
                // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouCancelAutoReq_CMD, {});
            } else {
                TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhouCancelAutoReq_CMD, {});
                // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouCancelAutoReq_CMD, {});
            }
        } else if (data == 2) {//坐下
            // this._showOperateBtn();

            if (!TexasUtils._getSkin(["default", "b", "c", "d"])) {
                let data = {
                    nPos: 0,
                }

                if (TexasUtils._getClub()) {
                    TexasUtils._getLongAndLatitude(function (longitude, latitude) {
                        if (longitude && latitude) {
                            let tGps = {
                                nLongitude: longitude,
                                nLatitude: latitude,
                            }

                            data.tGps = tGps;
                        }

                        if (TexasUtils._getCanSitDown()) {
                            let nStr = "坐下请求";
                            // cc.warn("-----------------------------------------------------------------------------------------德州坐下请求",data);
                            TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouSitDownReq_CMD, data);
                            // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouSitDownReq_CMD, data);
                        }
                    });
                } else {
                    let nStr = "坐下请求";
                    // cc.warn("-----------------------------------------------------------------------------------------德州坐下请求",data);
                    TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhouSitDownReq_CMD, data);
                    // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouSitDownReq_CMD, data);
                }
            }
        }

    },

    initUnStateBtn() {
        let btnChild = this.unStateBtn.children;

        if (btnChild && btnChild.length > 0) {
            for (let i = 0; i < btnChild.length; i++) {
                let child = btnChild[i];

                // if (i!=4 && i!=5) {
                child.active = false;
                // }

            }
        }
    },

    initPoolButton() {
        let btnChild = this.poolButton.children;

        if (btnChild && btnChild.length > 0) {
            for (let i = 0; i < btnChild.length; i++) {
                let child = btnChild[i];

                child.active = false;

            }
        }
    },

    //初始化非阶段按钮
    initUnStateButton(index) {
        let btnChild = this.unStateBtn.children;

        if (btnChild && btnChild.length > 0) {
            for (let i = 0; i < btnChild.length; i++) {
                let child = btnChild[i];

                if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
                    let lable = child.getChildByName("labels");
                    if (lable) {
                        lable.color = this._whiteGlow;
                    }
                    if (i + 1 != 5) {
                        if (i + 1 == 6) {
                            child.getComponent(cc.Sprite).spriteFrame = this.unStateBtnArry[4];
                        } else if (i + 1 == 1) {
                            child.getComponent(cc.Sprite).spriteFrame = this.unStateBtnArry[0];
                        } else {
                            if (TexasUtils._getClub()) {
                                if (i + 1 == 2) {
                                    child.getComponent(cc.Sprite).spriteFrame = this.unStateBtnArry[5];
                                } else if (i + 1 == 3) {
                                    child.getComponent(cc.Sprite).spriteFrame = this.unStateBtnArry[6];
                                }
                            } else {
                                child.getComponent(cc.Sprite).spriteFrame = this.unStateBtnArry[5];
                            }
                        }
                    }

                    if (index && index != 5 && index == i + 1) {
                        TexasData._setSaveOperate(index);
                        if (index == 1) {
                            child.getComponent(cc.Sprite).spriteFrame = this.unStateBtnArry[2];
                            if (lable) lable.color = this._redGlow;
                        } else if (index == 6) {
                            child.getComponent(cc.Sprite).spriteFrame = this.unStateBtnArry[3];
                        } else {
                            if (TexasUtils._getClub() && index == 3) {
                                child.getComponent(cc.Sprite).spriteFrame = this.unStateBtnArry[7];
                            } else {
                                child.getComponent(cc.Sprite).spriteFrame = this.unStateBtnArry[1];
                                if (lable) lable.color = this._blueGlow;
                            }
                        }
                    }
                } else {
                    if (i + 1 != 5) {
                        child.getComponent(cc.Sprite).spriteFrame = this.unStateBtnArry[0];
                    }

                    if (index && index != 5 && index == i + 1) {
                        TexasData._setSaveOperate(index);
                        child.getComponent(cc.Sprite).spriteFrame = this.unStateBtnArry[1];
                    }
                }

            }
        }
    },

    //底池按钮(1: 1/2; 2: 2/3; 3:1 4:2个盲注 5:3个盲注 6:4个盲注 7:allin)
    onClickBtnDiZhu(event, data) {
        cc.log("点击底池按钮:", data);

        data = Number(data);

        this._showOperateBtn();

        if (TexasUtils._getClub()) {
            // let poolNum = TexasData._getRewardPoolSum();
            // let pool = poolNum;
            // if (data==1) {
            //     pool = 1/4 * poolNum;
            // }else if (data==2) {
            //     pool = 1/3 * poolNum;
            // }else if (data==3) {
            //     pool = 1/2 * poolNum;
            // }else if (data==4) {
            //     pool = 2/3 * poolNum;
            // }

            let nData = {
                nOpButton: 3,
                nRaise: data,
            }

            let nStr = "阶段按钮操作请求";
            // cc.warn("-----------------------------------------------------------------------------------------德州阶段按钮操作请求",nData);
            TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouOpReq_CMD, nData);
        } else {
            let nRaise = -10;
            if (data == 2) {
                nRaise = -11;
            } else if (data == 3) {
                nRaise = -12;
            } else if (data == 4) {
                nRaise = -13;
            } else if (data == 5) {
                nRaise = -14;
            } else if (data == 6) {
                nRaise = -15;
            } else if (data == 7) {
                nRaise = -1;
            }

            let nData = {
                nOpButton: 3,
                nRaise: nRaise,
            }

            let nStr = "底池操作请求";
            // cc.warn("-----------------------------------------------------------------------------------------德州底池操作请求",nData);
            if (TexasUtils._getClub()) {
                TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouOpReq_CMD, nData);
                // app.net.send(CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouOpReq_CMD, nData);
            } else {
                TexasUtils._gameReqNotify(nStr, CMD.Texas.value, CMD.Texas.DeZhouOpReq_CMD, nData);
                // app.net.send(CMD.Texas.value, CMD.Texas.DeZhouOpReq_CMD, nData);
            }
        }
    },

    /*************************************加注滑动条***************************************************/
    _showSlider(data) {
        cc.log("_showSlider data:", data);

        //全下文本
        this.allinIcon.active = false;

        // if (this.addBetBg && this.betBg) {
        //     this.addBetBg.getComponent(cc.Sprite).spriteFrame = this.betBg[0];
        // }

        //加注限制
        this.nBarLow = Number(data.tRaiseChoice.nMin);//加注下限
        this.nBarHigh = Number(data.tRaiseChoice.nMax);//加注上限

        this.progressValue = 0;

        if (this.maxLabel) {
            this.maxLabel.string = TexasUtils._tranfPointNumber(this.nBarLow);
        }

        this._addBet = this.nBarLow;

        // this.sliderLabel.string = TexasUtils._tranfPointNumber(this.nBarLow);
        // if (TexasUtils._getClub()) {
        //     this.sliderLabel.string = 0;
        // }
        // this.sliderLabel.node.active = true;

        //更新加注值
        // let count = TexasUtils._getSkin(["default","b","c","d"])?TexasUtils._getText(19) + " " + TexasUtils._tranfPointNumber(this.nBarLow):TexasUtils._tranfPointNumber(this.nBarLow);
        // this.addBetCount.string = count;

        // this.addBetCount.node.active = true;

        this.result = Number( TexasUtils._tranfPointNumber(this.nBarLow));

        this.refreshVolume(0);

        this.sliderBg.active = true;
        this.addBetSlider.active = true;
        this.poolButton.active = !TexasUtils._getClub() ? true : false;
    },

    //刷新
    refreshVolume(percentage) {
        this.progressValue = percentage;

        let sliderHeight = this.sliderGold.height * percentage;
        this.sliderGold.getComponent(cc.Slider).progress = percentage;
        this.sliderGold.getChildByName("progress").height = sliderHeight;
        this.setSliderBBLabel();
    },

    getbBBValue(){
        let info = TexasData._getTableInfo();
        let value = info.nBigBlind
        if (info.nBigBlind == 0 && info.nSmallBlind == 0){
            value = info.preAnteOdd * info.nPreAnte
        }
        return value
    },


    setSliderBBLabel() {
        let nBigBlind = this.getbBBValue();

        let bbValue = Math.floor(this.result / nBigBlind * 10) / 10;
        this.sliderGold.getComponent(cc.Slider).handle.node.getChildByName("betBB").getComponent(cc.Label).string = bbValue + "BB";
    },


    onClickAddBet(event) {
        let baseBBLabel = this.sliderGold.getComponent(cc.Slider).handle.node.getChildByName("betBB").getComponent(cc.Label)
        let baseBB = baseBBLabel.string.slice(0, -2)
        let nBigBlind = this.getbBBValue();
        if (event.target.name == "addBtn") {
            baseBB = Number(baseBB) + 1
            this.result = Math.floor(Math.min(baseBB * nBigBlind, this.nBarHigh) * 10) / 10;
        } else {
            baseBB = Number(baseBB) - 1
            this.result = Math.floor(Math.max(baseBB * nBigBlind, this.nBarLow) * 10) / 10;
        }


        this.progressValue = (this.result - this.nBarLow) / (this.nBarHigh - this.nBarLow);

        if (this.result == this.nBarHigh) {
            this.allinIcon.active = true;
            this.maxLabel.node.color = new cc.Color(255, 255, 255, 255)
        } else {
            this.allinIcon.active = false;
            this.maxLabel.node.color = new cc.Color(60, 50, 21, 255)
        }

        this.maxLabel.string = this.result;
        this.refreshVolume(this.progressValue);
    },

    //滑动事件特殊处理阶段按钮
    _showTouchOperateBtn(isShow) {
        this.stateBtn.active = !isShow;
        for (let i = 0; i < this.stateBtn.children.length; i++) {
            let child = this.stateBtn.children[i];

            if (child.name.toString() == "btn_jiazhu") {
                child.active = true;
            } else {
                child.active = false;
            }
        }
    },

    onTouchJiaZhuStart(event) {
        if (!TexasUtils._getClub()) return;
        this.betTouch = false;
        this._setTouchPos(event);
        // this.addBetLabel.active = false;
        // this.addBetIcon.active = false;
        // this.addBetIcon2.active = false;
        // this.btn_jiazhu.active = false;
        this._showOperateStateBtn(false);
        // this._showTouchOperateBtn();
        this._showSlider(this.data);
        // this.scheduleOnce(function () {
        //     this._touch = true;
        //     this.betTouch = true;
        // }, 0.2);
    },

    onTouchJiaZhuMove(event) {
        if (!TexasUtils._getClub()) return;
        if (!this.betTouch) return;
        this._setTouchPos(event);
    },

    onTouchJiaZhuEnd(event) {
        if (!TexasUtils._getClub()) return;
        // if (!this.betTouch) return;
        this._touch = false;
        this.betTouch = false;
        this._lastTouchPos = 0;//上一次滑动值
        this._curTouchPos = 0;//当前滑动值

        if (this._addBet <= 0) {
            this.scheduleOnce(function () {
                this._initOperatePanel(this.data, 1, true);
            }, 0.05);

            return;
        }

        if (!this.addBetSlider.active && this.stateBtn.active) return;

        this._showOperateBtn();

        let nData = {
            nOpButton: 3,
            nRaise: this._addBet,
        }

        let nStr = "阶段按钮操作请求";
        // cc.warn("-----------------------------------------------------------------------------------------德州阶段按钮操作请求",nData);
        TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouOpReq_CMD, nData);
    },

    _setClockUI(time, fillRange) {
        let isGuoPai = this.stateBtnArr && this.stateBtnArr.length > 0 && this.stateBtnArr[1] == 2;
        let countdownNode = isGuoPai ? this.countdownClockGuoPai : this.countdownClock;
        countdownNode.active = time && time > 0;
        countdownNode.getChildByName("time").getComponent(cc.Label).string = time;
        countdownNode.getChildByName("filled").getComponent(cc.Sprite).fillRange = fillRange;
    },


    _setTouchPos(event) {
        let location = event.getLocation();
        this._curTouchPos = location.y;//当前滑动值
    },

    //设置闹钟(10s)
    _setAlarmSchedule(time, maxTime) {
        let self = this;
        let isGuoPai = this.stateBtnArr && this.stateBtnArr.length > 0 && this.stateBtnArr[1] == 2;
        let countdownNode = isGuoPai ? this.alarmClockGuoPai : this.alarmClock;
        countdownNode.parent.getChildByName('label_name').y = 20;
        let timeLight = countdownNode.getChildByName("timeLight");
        let reduceRotation = 90 / 0.25;

        if (time < 0) {
            countdownNode.active = false;
            countdownNode.parent.getChildByName('mask').active = false
            countdownNode.parent.getChildByName('timeText').active = false
            return;
        }

        if (time >= 0) {

            let spriteRanges = time / maxTime;

            countdownNode.getComponent(cc.Sprite).fillRange = spriteRanges;

            timeLight.angle = spriteRanges * reduceRotation;

            countdownNode.active = true;
            // countdownNode.parent.getChildByName('mask').active = true
            countdownNode.parent.getChildByName('timeText').getComponent(cc.Label).string = Math.ceil(time)
            countdownNode.parent.getChildByName('timeText').active = true
        }
    },

    //重置弃牌过牌按钮闹钟
    _initAlarmClock() {
        let qiepaiNode = this.alarmClock.parent;
        this.alarmClock.active = false;
        this.alarmClock.getChildByName("timeLight").angle = 0;
        qiepaiNode.getChildByName("mask").active = false;
        qiepaiNode.getChildByName("timeText").active = false;
        qiepaiNode.getChildByName('clock').active = false;
        qiepaiNode.getChildByName("timeMask").active = false;
        qiepaiNode.getChildByName('label_name').y = 0;

        let guopaiNode = this.alarmClockGuoPai.parent;
        this.alarmClockGuoPai.active = false;
        this.alarmClockGuoPai.getChildByName("timeLight").angle = 0;
        guopaiNode.getChildByName("mask").active = false;
        guopaiNode.getChildByName("timeText").active = false;
        guopaiNode.getChildByName('clock').active = false;
        guopaiNode.getChildByName("timeMask").active = false;
        guopaiNode.getChildByName('label_name').y = 0;
    },

    //点击背景关闭滑块界面
    onClickSliderBg(event, data) {
        if (!TexasUtils._getClub()) return;
        this.sliderBg.active = false;//加注滑动背景
        this.addBetSlider.active = false;//加注滑动
        this.poolButton.active = true;
        this._showOperateStateBtn(true);
    },

    //滑动
    onSlideredGold(slider) {
        slider.progress = slider.progress.toFixed(2);
        let result = (this.nBarHigh - this.nBarLow) * slider.progress + this.nBarLow;
        result = parseInt(result);
        this._addBet = result;
        if (slider.progress == 0) {
            result = TexasUtils._tranfPointNumber(this.nBarLow);
            this._addBet = this.nBarLow;
            // if (TexasUtils._getClub()) {
            //     result = 0;
            //     this._addBet = 0;
            // }
        } else if (slider.progress >= 1) {
            result = TexasUtils._tranfPointNumber(this.nBarHigh);
            this._addBet = this.nBarHigh;
        }

        this.result = Number(result);

        //更新加注值
        let count = TexasUtils._getSkin(["default", "b", "c", "d"]) ? TexasUtils._getText(19) + " " + result : result;
        this.addBetCount.string = count;

        this.allinIcon.active = false;
        // if (TexasUtils._getSkin(["default","b","c","d"])) {
        //     this.sliderLabel.node.active = true;
        // }
        this.maxLabel.node.color = new cc.Color(60, 50, 21, 255)
        if (TexasUtils._tranfPointNumber(this.nBarHigh) == Number(this.result)) {//allIn
            this.allinIcon.active = true;
            this.maxLabel.node.color = new cc.Color(255, 255, 255, 255)
            // if (this.addBetBg && this.betBg) {
            //     this.addBetBg.getComponent(cc.Sprite).spriteFrame = this.betBg[1];
            // }
            // if (TexasUtils._getSkin(["default","b","c","d"])) {
            //     this.sliderLabel.node.active = false;
            // }
        }

        // this.sliderLabel.string = result;

        this.maxLabel.string = result;

        this.refreshVolume(slider.progress);
    },


    hideCutPokerNode(isAllHide) {
        let lookOrCutNode = this.node.getChildByName("lookOrCutBtn");
        if (isAllHide) {
            lookOrCutNode.active = false;
            return;
        }
        lookOrCutNode.getChildByName("btnCutCards").active = false;
    },

    //显示切牌，发发看 ,偷偷看 按钮
    showlookOrCutView(isShow, stateObj = {}) {
        
        let lookOrCutNode = this.node.getChildByName("lookOrCutBtn");
        if (!isShow) {
            lookOrCutNode.active = false;
            return
        }
        let tableInfo = TexasData._getTableInfo();
        if(!tableInfo.nTableCost){
             return;
        }
        let nTableCost = JSON.parse(tableInfo.nTableCost);
        if (!nTableCost || (nTableCost.length <= 0)) {
            lookOrCutNode.active = false;
            return;
        }
        let isCanLookCommonCards = nTableCost[0].open == 1;//发发看
        let isCanLookOtherCards = nTableCost[1].open == 1;//偷偷看
        let isCanCutCards = nTableCost[2].open == 1;//切牌


        if (stateObj.isHideCutBtn) {
            isCanCutCards = false;
        }
        if (stateObj.isHideLookCommonBtn) {
            isCanLookCommonCards = false;
        }
        if (stateObj.isHideLookOtherBtn) {
            isCanLookOtherCards = false;
        }


        lookOrCutNode.getChildByName("btnCutCards").getChildByName("gold").getComponent(cc.Label).string = nTableCost[2].nCost;
        lookOrCutNode.getChildByName("btnLookCommonCards").getChildByName("gold").getComponent(cc.Label).string = nTableCost[0].nCost;
        lookOrCutNode.getChildByName("btnLookOtherCards").getChildByName("gold").getComponent(cc.Label).string = nTableCost[1].nCost;


        lookOrCutNode.getChildByName("btnCutCards").active = isCanCutCards;
        lookOrCutNode.getChildByName("btnLookCommonCards").active = isCanLookCommonCards;
        lookOrCutNode.getChildByName("btnLookOtherCards").active = isCanLookOtherCards;

        let showCards = TexasData._getIsShowCard();
        if (showCards) {
            lookOrCutNode.getChildByName("btnLookOtherCards").active = false;
        }
        lookOrCutNode.active = isShow;
    },




    //     message ClubDeZhouCutCardReq {
    //   required int32 nIndex = 1;          //切牌位置
    //   required bool nIsStart = 2;         //开始/结束
    // }
    //切牌，发发看 ,偷偷看
    onClickBtnPeek(event) {
        cc.log("点击切牌，发发看 ,偷偷看 按钮:", event.target.name);


        this.TexasController.reqCutOrLookCards(event.target.name);
        // switch (event.target.name) {
        //     case "btnCutCards"://切牌
        //         TexasUtils._gameReqNotify("切牌请求",  CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouCutCardReq_CMD, {nIndex: 2, nIsStart: true});
        //         break;
        //     case "btnLookCommonCards"://发发看
        //         TexasUtils._gameReqNotify("发发看请求", CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouCardOpenReq_CMD, {});
        //         break;
        //     case "btnLookOtherCards"://偷偷看
        //         TexasUtils._gameReqNotify("发发看请求", CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouHandCardReq_CMD, {});
        //         break;
        //     default:
        //         break;
        // }

        event.target.active = false;

    },

    //设置快捷下注按钮
    setQuickBetButton() {
        let quickBetNode = this.poolButton.children;
        for (let i = 0; i < quickBetNode.length; i++) {
            let child = quickBetNode[i];
            let gameBg = LocalStorage.getItem("CLUB_GAME_BG");
            let betSp = child.getChildByName("addBetBtn");
            if (betSp) {
                if (!gameBg || gameBg == 4) {
                    betSp.getComponent(cc.Sprite).spriteFrame = this.quickBetBtnSpriteFrames[0];
                } else {
                    betSp.getComponent(cc.Sprite).spriteFrame = this.quickBetBtnSpriteFrames[1];
                }
            }

        }
    },

    reqCutCardOver(nIndex) {
        this.TexasController.reqCutCardsOver(nIndex);
    },

    //设置加注或下注按钮文字
    setBetButtonText(isAddBet) {
        let betButton = this.stateBtn.getChildByName("btn_jiazhu");
        if (betButton) {
            let buttonLabel = betButton.getChildByName("labels");
            if (buttonLabel) {
                buttonLabel.getComponent(cc.Label).string = isAddBet ? "加注" : "下注";
            }
        }
    }

});
