// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let Base64 = require("base64");
let i18n = require("i18n");
let Utils = require("Utils");
let clubGameConfig = require("clubGameConfig");
const UIListCell = require("UIListCell");
let MsgManager = require("MsgManager");
let MSG = require("Msg_club");
const { init } = require("../../../../../../Script/framework/i18n/i18n");

cc.Class({
    extends: UIListCell,

    properties: {
        tableName: cc.Label,
        label_game: cc.Label,
        baoxian: cc.Label,
        gameMonthTime: cc.Label,
        gameDayTime: cc.Label,
        gameClockTime: cc.Label,
        goldCost: cc.Label,
        chipCount: cc.Label,
        costTime: cc.Label,
        mangzhu: cc.Label,
        recordInfoPrefab: cc.Prefab,
        //定义头像列表
        avatarList: [cc.Sprite],
        //定义一个字符串数组,为1到12月份的英文缩写
        monthNames: [],
        // 添加私有数据属性
        _data: {
            default: null,
            visible: false
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
    },

    init(initData) {
        //console.log("HallHistoryItem init called with initData:", initData);
    },

    // update (dt) {},
    onInit(data, isUpdateUserNum) {
        //console.log("HallHistoryItem onInit called with data:", data);

        this.monthNames = ["1月", "2月", "3月", "4月", "5月", "9月", "7月", "8月", "9月", "10月", "11月", "12月"];
        if (data.sTableName) {
            this.tableName.string = Base64.decode(data.sTableName);
        } else {
            this.tableName.string = "";
        }

        if (!data.nGameId || data.nGameId == 0) {
            this.label_game.lang = "";
        } else {
            this.label_game.lang = "HALL_CLUB_GAME_NAME." + data.nGameId;
        }

        // 确保数据被正确保存
        this._data = data;
        //console.log("HallHistoryItem _data assigned:", this._data);
        // 解析时间 "2025-09-15 03:49:47"
        if (data.sTime) {
            let timeStr = data.sTime;
            let datePart = timeStr.split(' ')[0]; // "2025-09-15"
            let timePart = timeStr.split(' ')[1]; // "03:49:47"

            let dateParts = datePart.split('-'); // ["2025", "09", "15"]
            let month = parseInt(dateParts[1]) - 1; // 月份从0开始，所以减1
            let day = parseInt(dateParts[2]);

            // 设置月份缩写 (Sep)
            this.gameMonthTime.string = this.monthNames[month] || "";

            // 设置日期 (15)
            this.gameDayTime.string = day.toString();

            // 设置时间，只显示小时和分钟 (03:49)
            let timeParts = timePart.split(':'); // ["03", "49", "47"]
            this.gameClockTime.string = timeParts[0] + ":" + timeParts[1];
        } else {
            this.gameMonthTime.string = "";
            this.gameDayTime.string = "";
            this.gameClockTime.string = "";
        }

        // 解析sExData获取盲注信息
        if (data.sExData) {
            try {
                let exData = JSON.parse(data.sExData);
                let mangzhuStr = Utils.showClubTableInfo('', exData.nSB, exData.nBB, exData.nZhuaTou, exData.nPreAnte, exData.preAnteOdd, this._data.nGameId)

                this.mangzhu.string = mangzhuStr;
            } catch (e) {
                cc.warn("解析sExData失败:", e);
                this.mangzhu.string = "";
            }
        } else {
            this.mangzhu.string = "";
        }

        this.goldCost.string = data.nWinLose || 0;
        this.setLabelColor(this.goldCost, data.nWinLose)
        //this.chipCount.string = 200;

        if (data.nKeepTime) {
            let hours = data.nKeepTime / 3600;
            if (hours % 1 === 0) {
                // 整数小时，不显示小数
                this.costTime.string = hours + "小时";
            } else {
                // 有小数，保留一位小数
                this.costTime.string = hours.toFixed(1) + "小时";
            }
        } else {
            this.costTime.string = "0小时";
        }

        let headAvatarList = data.nFaceIdList;
        if (headAvatarList && headAvatarList != "") {
            let headList = headAvatarList.split(",");
            for (let i = 0; i < this.avatarList.length; i++) {
                let avatarNode = this.avatarList[i];
                if (headList[i]) {
                    Utils.changeUserHead(avatarNode, headList[i], app.ClubAssets);
                    avatarNode.node.active = true;
                }
            }
        }
    },

    onRefresh() {
        if (this._data) {
            this.onInit(this._data, true);
        } else {
            // 如果 _data 不存在，尝试从父类获取
            let parentData = this.getData && this.getData();
            if (parentData) {
                this.onInit(parentData, true);
            } else {
                cc.warn("HallHistoryItem: No data available for refresh");
            }
        }
    },

    onClick() {
        //console.log("HallHistoryItem onClick triggered, _data:", this._data);

        // 检查数据是否存在
        if (!this._data) {
            cc.warn("HallHistoryItem: _data is null or undefined in onClick");
            return;
        }

        let parentNode = this._listView._delegate._adapter.node;
        // //console.log("Parent node of the list view:", parentNode);
        // 创建详情弹窗
        let node = cc.instantiate(this.recordInfoPrefab);
        parentNode.addChild(node);
        let com = node.getComponent("HallClubRecordInfo");
        if (com) {
            //data.nGameId = this._curGameId;
            com.init(this._data, true);
        } else {
            cc.warn("HallHistoryItem: Cannot find HallClubRecordInfo component");
        }
    },

    setLabelColor(label, value) {
        if (value == 0 || !value) {
            let color = new cc.Color(230, 229, 242, 255);
            label.node.color = color;
        } else if (value < 0) {
            let color = new cc.Color(255, 30, 67, 255);
            label.node.color = color;
        } else {
            let color = new cc.Color(0, 255, 134, 255);
            label.node.color = color;
        }
    },

});
