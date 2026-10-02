let TexasPanelAction = require("TexasPanelAction");
let TexasUtils = require("TexasUtils");
let Base64 = require("base64");
let Utils = require("Utils");
const i18n = require('i18n');
let TexasData = require("TexasData");
let CMD = require("protocol_texas");

cc.Class({
    extends: TexasPanelAction,

    properties: {
        layout: cc.Node,
        layout1: cc.Node,

        scrolHeight: cc.Node,

        listNode: cc.Node,

        content1: cc.Node,
        content2: cc.Node,

        scrollView1: cc.ScrollView,
        scrollView2: cc.ScrollView,
        scrollView3: cc.ScrollView,

        nRecordNum: cc.Label,//牌局编号
        nGame: cc.Label,//游戏
        nMang: cc.RichText,//盲注   
        nInsureNum: cc.Label,//保险
        roundNum: cc.Label, //第几手
        tableTime: cc.Label, //牌桌时间

        betInfoLabel: cc.Label, //筹码信息
        toggleNode: cc.Node, //页签



        itemUserInfoPrefab: {//玩家资料预制
            default: null,
            type: cc.Prefab,
        },

        itemLookerPrefab: {//旁观玩家预制
            default: null,
            type: cc.Prefab,
        },

        _time: 0,
        _partInUserList: [],
        _partInsuranceList: [],
        _lookerList: [],
        _isGetAllData: false,
        _arrInsurance: [],
    },

    onLoad() {
        this.hide();
        this._offsetX = this.panelPosition.x;


        this.listNode.active = false
    },

    onDestroy() {

    },

    close() {
        this._super();
        this._partInUserList = [];
        this._partInsuranceList = [];
        this._arrInsurance = [];
        this._isGetAllData = false;
        this.getProcessInfo(-1);
    },

    update(dt) {
        if (this.bStopTableTime || !this.panel.active) {
            return;
        }

        this._time += dt;
        if (this._time >= 1) {
            this.nRemainTime -= 1;
            this._time = 0;
            this.setTableTime();
        }
    },

    _setProcess(data) {
        this.nRemainTime = data.nRemainTime;
        this.setTableTime();
        this.stopTabelTime(TexasData.getElapsedStatus())
        this._setText(data);

        let _isFirstSet = false;
        if (this._partInUserList.length == 0) {
            //分批获取，第一次返回才需要刷新旁观玩家信息
            _isFirstSet = true;
        }

        if (data.nEndFlag != 1) {
            this._isGetAllData = true;
        }
        let insureGold = {
            nInsur: data.nInsur,
            nInsurGot: data.nInsurGot,
            arrInsurance: data.arrInsurance,
            isInsure: true,

        }
        this._setUserInfo(data.arrPartInUser, data.arrInsurance, insureGold);
        if (_isFirstSet) {
            this._setLooker(data.arrLooker);
        }


        // this.layout.active = true;
        this.onnClickToggleBtn({ target: { name: "zhangDanToggle" } })
    },

    //设置文本
    _setText(data) {
        let gameId = app.game.getGame().getSubGameID()
        this.nGame.string = "" + Base64.decode(data.sTableName || "");

        var paijuId = ((data.sPaiJuId || "") + "").replace(/^kk/i, "HP");
        this.nRecordNum.string = paijuId;//牌局编号

        let text = Utils.showClubTableInfo(
            '',
            data.nSmallBlind,
            data.nBigBlind,
            data.nZhuaTou,
            data.nBetBefore,
            TexasData._getPreAnteOdd(),
            gameId,
        );
        this.betInfoLabel.string = text;
        this.nInsureNum.string = TexasUtils._saveTwoPoint(data.nInsur);//保险
        this.roundNum.string = Utils.replaceAll(i18n.t("gameTip.189"), "XXX", data.nRound || 1);
    },

    //设置玩家信息
    _setUserInfo(arrPartInUser, arrInsurance, insureGold) {


        // arrInsurance = []
        // for (let ii = 0; ii < 20; ii++) {
        //     let testData = {
        //         nUserId : 123456,
        //         sName : "123456",
        //         stage : 1,
        //         buy : 12555.22,
        //         win : 1.22,
        //     }
        //     testData.nUserId = ii + 100021
        //     testData.sName = Base64.encode("VIP000" + ii) 
        //     testData.stage =  ii%2 == 1 ? 1 : 2
        //     testData.buy =  ii + 10544
        //     testData.win =  ii + 1.222
        //     arrInsurance.push(testData)

        // }
        if (arrPartInUser && arrPartInUser.length > 0) {
            arrPartInUser.sort(function (a, b) {//从大到小排列
                if ((a.nStatus == 0) && (b.nStatus == 0)) {
                    return b.nProfitSum - a.nProfitSum;
                } else {
                    return (b.nStatus == 0) - (a.nStatus == 0)
                }
            });
            arrPartInUser.push(insureGold)
            if (this._partInUserList.length == 0) {
                // this.content1.destroyAllChildren();
            }
            if (this._partInUserList.length == 0) {
                this._partInUserList = arrPartInUser;
                if (this.scrollView1) {
                    let dys = this.scrollView1.getComponent("DynamicScrollView");
                    dys.init(arrPartInUser);
                }

            } else {
                if (this.scrollView1) {
                    let dys = this.scrollView1.getComponent("DynamicScrollView");
                    this.appendData2(dys, arrPartInUser);
                }
            }
        }
        if (arrInsurance && arrInsurance.length > 0) {
            arrInsurance.sort(function (a, b) {//从大到小排列
                return b.win - a.win;
            });
            if (!this._arrInsurance || this._arrInsurance.length == 0) {
                this._arrInsurance = arrInsurance;
                if (this.scrollView3) {
                    let dys3 = this.scrollView3.getComponent("DynamicScrollView");
                    dys3.init(arrInsurance);
                }
            } else {
                if (this.scrollView3) {
                    let dys3 = this.scrollView3.getComponent("DynamicScrollView");
                    // dys3.append_data(arrInsurance);
                    this.appendData2(dys3, arrInsurance);
                }
            }

        }


    },


    appendData2(scrollView, data) {
        //设置列表item数据
        let dataArr = data;
        let allData = [];
        //对数据进行包装
        for (let i = 0; i < dataArr.length; i++) {
            let newData = {
                key: "item1",
                data: dataArr[i]
            }
            allData.push(newData);
        }

        let Offset = scrollView.scrollview.getScrollOffset();//记录之前所在的位置
        let x = Offset.x;
        let y = Offset.y;
        //设置数据，key为item样式，data为数据
        scrollView.append_data(allData);

        // this.scview.scrollview.stopAutoScroll();
        scrollView.scrollview.scrollToOffset(cc.v2(x, y));//滑动到之前所在的位置
    },


    updateListView1(node, data) {
        let texasProcessItem = node.getComponent("texasProcessItem");
        texasProcessItem.createProcessItem(data);
    },

    //设置旁观玩家
    _setLooker(data) {
        if (!data) return;

        // this.content2.destroyAllChildren();
        this.panel.getChildByName("greyBg2").getChildByName("count").getComponent(cc.Label).string = "(" + data.length + ")"
        data.sort(function (a, b) {
            return a.nStatus - b.nStatus;
        })

        if (data && this.scrollView2) {
            let dys = this.scrollView2.getComponent("DynamicScrollView");
            dys.init(data);
        }

    },

    updateListView2(node, data) {
        let head = node.getChildByName("mask").getChildByName("head").getComponent(cc.Sprite);
        Utils.changeUserHead(head, data.sFaceId);//玩家头像
        let name = node.getChildByName("name").getComponent(cc.Label);
        name.string = Utils.getShortText(Base64.decode(data.sName), 6, '.');
        node.active = true;

        let offline = node.getChildByName("mask").getChildByName("offline");
        if (data.nStatus == 1) {
            offline.active = true;
            TexasUtils._setColor(name.node, "#5A5B5A");
        } else {
            offline.active = false;
            TexasUtils._setColor(name.node, "#E8DFD1");
        }
    },


    // message InsuranceItem {
    //     required int32 nUserId=1;    //用户id
    //     required string sName=2;    //昵称
    //     required int32 stage=3;        //阶段 1转牌 2:河牌
    //     required double buy=4;       //投保金额
    //     required double win=5;       //赔付
    // }
    updateListView3(node, data) {


        node.getChildByName("name").getComponent(cc.Label).string = Utils.getShortText(Base64.decode(data.sName), 8);
        node.getChildByName("activity").getComponent(cc.Label).string = data.stage == 1 ? "转牌" : (data.stage == 2 ? "河牌" : "");
        node.getChildByName("pushBao").getComponent(cc.Label).string = data.buy + "";
        let nProfitNode = node.getChildByName("profit").getComponent(cc.Label)
        let color16 = "#E8DFD1";
        if (Number(data.win) < 0) {
            color16 = "#EC3856";
        } else if (Number(data.win) > 0) {
            color16 = "#00FF86";
        }
        var color = cc.Color.BLACK;
        let curColor = color.fromHEX(color16);
        nProfitNode.string = data.win;
        nProfitNode.node.color = new cc.Color(curColor.r, curColor.g, curColor.b);
        node.active = true;
    },

    _setLayout(data) {
        // this._layout = 0;

        // let len = data.length;

        // let nHeight = this.listNode.height;

        // if (len * nHeight < this.scrolHeight.height) {
        //     this._layout = 1;
        // }
    },

    setTableTime() {
        this.tableTime.string = this._getTime(this.nRemainTime);
    },

    _getTime(time) {
        if (!time) {
            return "";
        }
        if (time < 0) {
            time = 0;
        }
        let second = parseInt(time)
        let minute = 0
        let hour = 0

        //  如果秒数大于60，将秒数转换成整数
        if (second > 60) {
            //  获取分钟，除以60取整数，得到整数分钟
            minute = parseInt(second / 60)
            //  获取秒数，秒数取佘，得到整数秒数
            second = parseInt(second % 60)
            //  如果分钟大于60，将分钟转换成小时
            if (minute > 60) {
                //  获取小时，获取分钟除以60，得到整数小时
                hour = parseInt(minute / 60)
                //  获取小时后取佘的分，获取分钟除以60取佘的分
                minute = parseInt(minute % 60)
            }
        }

        hour = hour < 10 ? ("0" + hour) : hour;
        minute = minute < 10 ? ("0" + minute) : minute;
        second = second < 10 ? ("0" + second) : second;

        return hour + ":" + minute + ":" + second;
    },

    stopTabelTime(status) {
        this.bStopTableTime = status != 0;
    },

    onScrollEnd() {
        if (!this._isGetAllData) {
            this.getProcessInfo(1);
        }
    },

    getProcessInfo(index) {
        if (index <= 0) {
            return
        }
        let params = {
            nNoUse: index,
        }

        let nStr = "牌桌总览请求";
        TexasUtils._gameReqNotify(nStr, CMD.ClubTexas.value, CMD.ClubTexas.ClubDeZhouOverViewReq_CMD, params);
    },



    onnClickToggleBtn(event) {
        let isZhangDanNode = event.target.name == "zhangDanToggle"
        this.toggleNode.getChildByName("zhangDanToggle").getChildByName("selectLabel").active = isZhangDanNode
        this.toggleNode.getChildByName("zhangDanToggle").getChildByName("norLabel").active = !isZhangDanNode
        this.toggleNode.getChildByName("baoXianToggle").getChildByName("selectLabel").active = !isZhangDanNode
        this.toggleNode.getChildByName("baoXianToggle").getChildByName("norLabel").active = isZhangDanNode
        this.layout.active = isZhangDanNode
        this.layout1.active = !isZhangDanNode
    },



    onClickCopy() {
        if (this.nRecordNum && this.nRecordNum.string.length > 0) {
            Utils.copyToClipBoard(this.nRecordNum.string);
        }
    }
});