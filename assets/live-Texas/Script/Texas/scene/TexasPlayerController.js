/*
    玩家控制
*/

let TexasUtils = require("TexasUtils");
let UserInfo = require("UserInfo");
let TexasData = require("TexasData");
let Utils = require("Utils");
let TexasMagicFaceController = require("TexasMagicFaceController");

cc.Class({
    extends: cc.Component,

    properties: {
        panelContent: cc.Node,
        playerContent: cc.Node,
        light: cc.Node,//光

        playerPos: cc.Node,//玩家位置

        TexasMagicFaceController: TexasMagicFaceController,//魔法表情控制

        lightSpriteFrame: {//光圈
            default: [],
            type: cc.SpriteFrame
        },

        itemPlayerPrefab: {//玩家预制
            default: null,
            type: cc.Prefab,
        },

        _data: [],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},

    _initPlayerControl(control) {
        this.control = control;
        this.playJs = TexasUtils._getSkin(["d", "b"]) ? "texasPlayerDefault" : "texasPlayer";
        if (TexasUtils._getSkin(["c"])) {
            this.playJs = "texasPlayerC";
        } else if (TexasUtils._getSkin(["default"])) {
            this.playJs = "texasPlayerC";
        }
    },

    //获得玩家信息(key:对比键值  value:对比值 newKey:需要获得的键值)
    _getPlayerInfo(key, value, newKey) {
        this._data = [];
        let newValue = null;

        let nodeChild = this.playerContent.children;
        if (nodeChild && nodeChild.length > 0) {
            for (let i = 0; i < nodeChild.length; i++) {
                let child = nodeChild[i];

                if (child) {
                    let texasPlayer = child.getComponent(this.playJs);

                    if (texasPlayer && texasPlayer.data) {
                        this._data.push(texasPlayer.data);
                    }
                }
            }
        }

        if (!key && !value && !newKey) {
            //cc.log("****************************************玩家数据****************************************",this._data);

            return this._data;
        }

        for (let i = 0; i < this._data.length; i++) {
            let curValue = this._data[i][key];

            if (value == curValue) {
                newValue = this._data[i][newKey];

                break;
            }

        }

        //cc.log("****************************************玩家数据****************************************",key,value,newKey,newValue,this._data);
        return newValue;
    },

    //获得数据
    _getData() {
        // cc.log("获得数据:",this._data);

        return this._data;
    },

    //获得子节点
    _getChild() {

        let childArry = [];
        if (!this.playerContent) {
            return childArry
        }
        let playChild = this.playerContent.children;
        if (playChild && playChild.length > 0) {
            childArry = playChild;
        }

        return childArry;
    },

    //获得所有玩家脚本
    _getAllPlayerComponent() {

        let childArry = [];
        if (!this.playerContent) {
            return childArry
        }
        let playChild = this.playerContent.children;
        for (let i = 0; i < playChild.length; i++) {
            let texasPlayer = playChild[i].getComponent(this.playJs);
            if (texasPlayer) {
                childArry.push(texasPlayer);
            }
        }

        return childArry;
    },

    //获得玩家脚本
    _getTexasPlayer(seat) {
        let texasPlayer = null;

        let player = this.playerContent.getChildByName("player_" + seat);
        if (player) {
            texasPlayer = player.getComponent(this.playJs);
        }

        if (!texasPlayer) {
            cc.warn("--------------------------------------玩家站起或者离开未找到座位号:", seat);
        }

        return texasPlayer;
    },

    //玩家服务座位号获得玩家脚本
    _getTexasPlayerBySitId(nSitid) {
        //cc.log("玩家服务座位号获得玩家脚本:",nSitid);

        let texasPlayer = null;

        let nSeat = this._getSeat("nSitId", nSitid);
        if (nSeat) {
            texasPlayer = this._getTexasPlayer(nSeat);
        }

        return texasPlayer;
    },

    //获得玩家节点
    _getUserNode(userid) {
        //cc.log("获得玩家节点 userid:",userid);

        let userNode = null;

        let arry = this._getChild();
        for (let i = 0; i < arry.length; i++) {
            let texasPlayer = arry[i].getComponent(this.playJs);
            if (texasPlayer && texasPlayer.data.nUserId == userid) {
                userNode = arry[i];

                break;
            }

        }

        return userNode;
    },

    //添加玩家
    _addPlayer(seat, data, isMang, isNoAddPool) {
        cc.log("添加玩家:", seat, data, isMang, isNoAddPool);
        let sitId = this._getSitId("seat", seat);
        cc.log("添加玩家 的 sitId :", sitId);
        if (sitId) {
            this._clearPlayer(sitId);
        }

        let player = this.panelContent.getChildByName("player_" + seat);

        let PlayerItem = cc.instantiate(this.itemPlayerPrefab);
        PlayerItem.parent = this.playerContent;
        PlayerItem.name = "player_" + seat;
        let pos = TexasUtils._getNodePos(player, PlayerItem);
        PlayerItem.x = pos.x;
        PlayerItem.y = pos.y;
        let texasPlayer = PlayerItem.getComponent(this.playJs);
        texasPlayer.setPlayerInfo(this.control, seat, data, isMang, isNoAddPool);
        this._showDefaultSeat(seat, false);
        PlayerItem.active = true;

    },

    //删除玩家
    _clearPlayer(sitid) {
        cc.log("删除服务座位号玩家:", sitid);
        let arry = this.playerContent.children;

        if (!sitid) {
            for (let i = 0; i < arry.length; i++) {
                let removeNode = this.playerContent.children[i];
                this.playerContent.removeChild(removeNode)
                removeNode.destroy();
            }

            // this.playerContent.destroyAllChildren();
            this._showDefaultSeat();
            TexasData._setOperatingUserID(0);
            this._setLight();
            this._setMagicPanelPos();
        } else {
            //魔法表情面板
            if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
                let nUserId = this._getUserId("nSitId", sitid);
                let sSeat = this._getSeat("nSitId", sitid);
                if (this.TexasMagicFaceController) {
                    this.TexasMagicFaceController._hideMagicFacePanel(nUserId, sSeat);
                }
            }

            //玩家
            for (let i = 0; i < arry.length; i++) {
                let texasPlayer = arry[i].getComponent(this.playJs);
                if (texasPlayer) {
                    let nSitId = texasPlayer.data.nSitId;
                    let nSeat = this._getSeat("nSitId", nSitId);

                    if (sitid == nSitId) {
                        let removeNode = this.playerContent.children[i];
                        this.playerContent.removeChild(removeNode); // 手动移除保证之后查找this.playerContent.children的准确性
                        removeNode.destroy(); // 销毁节点
                        this._showDefaultSeat(nSeat, true);

                        break;
                    }

                }

            }
        }
    },

    //更新默认座位
    _updateDefaultSeat() {
        let userData = this._getPlayerInfo();

        if (userData && userData.length > 0) return;

        this._showDefaultSeat();
    },

    //设置玩家位置
    _setPlayerOpacity() {
        if (TexasUtils._getClub()) {
            for (let i = 1; i <= 9; i++) {
                let playerItem = this.panelContent.getChildByName("player_" + i);
                if (playerItem) {
                    playerItem.opacity = 255;
                }
            }
        }
    },

    //设置玩家位置
    _setPlayerPos(num, arrUsers) {
        if (TexasUtils._getClub()) {
            let len = arrUsers.length;

            let arry = TexasUtils._getClubPlayerPos(num);

            for (let i = 1; i <= 9; i++) {
                this._setNodePos(i, i)
            }

            for (let i = 1; i <= 9; i++) {
                let playerItem = this.panelContent.getChildByName("player_" + i);
                let defaultHead = playerItem.getChildByName("defaultHead");

                defaultHead.active = false;
                for (let j = 0; j < arry.length; j++) {
                    if (i == arry[j]) {
                        if (num == 2) {
                            if (arry[j] == 3) {
                                this._setNodePos(arry[j], 10);
                            }
                        } else if (num == 3) {
                            if (arry[j] == 4) {
                                this._setNodePos(arry[j], 15);
                            } else if (arry[j] == 7) {
                                this._setNodePos(arry[j], 16);
                            }
                        } else if (num == 4) {
                            if (arry[j] == 5) {
                                this._setNodePos(arry[j], 10);
                            } else if (arry[j] == 3) {
                                this._setNodePos(arry[j], 15);
                            } else if (arry[j] == 8) {
                                this._setNodePos(arry[j], 16);
                            }
                        } else if (num == 5) {
                            if (arry[j] == 3) {
                                this._setNodePos(arry[j], 13);
                            } else if (arry[j] == 5) {
                                this._setNodePos(arry[j], 11);
                            } else if (arry[j] == 6) {
                                this._setNodePos(arry[j], 12);
                            } else if (arry[j] == 8) {
                                this._setNodePos(arry[j], 14);
                            }
                        } else if (num == 6) {
                            if (arry[j] == 5) {
                                this._setNodePos(arry[j], 10);
                            } else if (arry[j] == 2) {
                                this._setNodePos(arry[j], 13);
                            } else if (arry[j] == 4) {
                                this._setNodePos(arry[j], 11);
                            } else if (arry[j] == 7) {
                                this._setNodePos(arry[j], 12);
                            } else if (arry[j] == 9) {
                                this._setNodePos(arry[j], 14);
                            }
                        } else if (num == 7) {
                            if (arry[j] == 2) {
                                this._setNodePos(arry[j], 13);
                            } else if (arry[j] == 4) {
                                this._setNodePos(arry[j], 11);
                            } else if (arry[j] == 7) {
                                this._setNodePos(arry[j], 12);
                            } else if (arry[j] == 9) {
                                this._setNodePos(arry[j], 14);
                            }
                        } else if (num == 8) {
                            if (arry[j] == 5) {
                                this._setNodePos(arry[j], 10);
                            }
                        }

                        if (len <= 0) {
                            let TexasDefaultHead = defaultHead.getComponent("TexasDefaultHead");
                            TexasDefaultHead._setSitid(j + 1);
                        }
                        defaultHead.active = true;

                        break;
                    }
                }
            }
        }
    },

    //设置节点位置
    _setNodePos(startPos, targetPos) {
        cc.log("startPos,targetPos:", startPos, targetPos);
        if (this.panelContent.getChildByName("player_" + startPos) && this.playerPos.getChildByName("player_" + targetPos)) {
            let startNode = this.panelContent.getChildByName("player_" + startPos);
            let targetNode = this.playerPos.getChildByName("player_" + targetPos);
            let pos = TexasUtils._getNodePos(targetNode, startNode);
            startNode.x = targetNode.x;
            startNode.y = targetNode.y;
        }
    },

    //设置胜率
    _setWinRate(tableUserArry) {
        if (!TexasUtils._getClub()) {
            return;
        }
        let userData = Utils.clone(tableUserArry);

        userData.sort(function (a, b) {//从大到小排列
            return b.nWinRate - a.nWinRate;
        });

        for (let i = 0; i < userData.length; i++) {
            let user = userData[i];
            let nSitId = user.nSitId;//座位号

            let nSeat = this._getSeat("nSitId", nSitId);
            let texasPlayer = this._getTexasPlayer(nSeat);
            if (texasPlayer) {
                let index = 0;
                if (i == 0) {
                    index = 1;
                }
                texasPlayer._setWinRateBg(index);
            }
        }
    },

    //获得牌桌服务端位置数据
    _getSitIdArry(sSeat, isShow) {
        //cc.log("_getSitIdArry sSeat,isShow:",sSeat,isShow);

        let maxTableNum = TexasData._getMaxTableSeat();//牌桌最大座位数
        let maxSeat = !TexasUtils._getSkin(["c"]) ? 6 : 9;
        let lockCount = maxSeat - maxTableNum;//锁座数

        if (lockCount < 0) {
            cc.error("lockCount<0");
        }

        let userData = this._getPlayerInfo();

        console.warn(`重连座位号展示 ：`, userData);
        // if (lockCount) {
        let seatData = [];

        if (userData && userData.length > 0) {
            let user = userData[0];
            let seat = user.seat;
            let sitId = user.nSitId;

            seatData.push({
                sitId: sitId,
                seat: seat,
            });

            // let sitidArr = [1,2,3,4,5,6];
            let seatArry = !TexasUtils._getSkin(["c"]) ? [1, 2, 3, 5, 8, 9] : [1, 2, 3, 4, 5, 6, 7, 8, 9];
            if (sSeat) {
                seatArry = !TexasUtils._getSkin(["c"]) ? [1, 2, 3, 5, 8, 9] : TexasUtils._getClubPlayerPos(TexasData._getMaxTableSeat());
            }

            let seatIndex = 0;
            for (let i = 0; i < seatArry.length; i++) {
                if (seat == seatArry[i]) {
                    seatIndex = i;

                    break;
                }
            }

            let len = maxSeat;
            if (TexasUtils._getClub()) {
                len = seatArry.length;
            }

            for (let i = 1; i <= len; i++) {
                let nextIndex = seatIndex + i;
                if (nextIndex > len - 1) {
                    nextIndex = nextIndex - len;
                }
                let nextSeat = seatArry[nextIndex];//客户端位置

                let nextSitId = sitId + i;//服务端位置
                if (nextSitId > len) {
                    nextSitId = nextSitId - len;
                }

                if (nextSeat != seat) {
                    let seatObj = {
                        sitId: nextSitId,
                        seat: nextSeat,
                    }
                    seatData.push(seatObj);
                }

            }

            console.log(`重连座位号展示000000000：`, seatData);
            for (let i = 0; i < seatData.length; i++) {
                let dataItem = seatData[i];
                let nSitId = dataItem.sitId;
                let nSeat = dataItem.seat;

                let playerItem = this.panelContent.getChildByName("player_" + nSeat);
                let defaultHead = playerItem.getChildByName("defaultHead");
                if (defaultHead) {
                    let TexasDefaultHead = defaultHead.getComponent("TexasDefaultHead");
                    TexasDefaultHead._setSitid(nSitId);
                }
            }

            if (sSeat) {
                for (let i = 0; i < seatData.length; i++) {
                    let dataItem = seatData[i];
                    let nSitId = dataItem.sitId;
                    let nSeat = dataItem.seat;

                    // if (sSeat==nSeat) {
                    let playerItem = this.panelContent.getChildByName("player_" + nSeat);
                    let defaultHead = playerItem.getChildByName("defaultHead");
                    if (defaultHead) {
                        let lock = defaultHead.getChildByName("lock");
                        let nullSeat = defaultHead.getChildByName("nullSeat");

                        if (nSitId > maxTableNum) {
                            lock.active = true;
                            nullSeat.active = false;
                            this._setDefaultHeat(defaultHead, false);
                        } else {
                            lock.active = false;
                            nullSeat.active = true;
                            this._setDefaultHeat(defaultHead, true);
                        }
                    }

                    if (sSeat == nSeat) {
                        defaultHead.active = isShow;
                    }

                    //     break;
                    // }
                }
            } else {
                for (let i = maxSeat; i >= maxTableNum + 1; i--) {
                    for (let j = 0; j < seatData.length; j++) {
                        let dataItem = seatData[j];
                        let nSitId = dataItem.sitId;
                        let nSeat = dataItem.seat;

                        if (i == nSitId) {
                            let playerItem = this.panelContent.getChildByName("player_" + nSeat);
                            let defaultHead = playerItem.getChildByName("defaultHead");
                            if (defaultHead) {
                                let lock = defaultHead.getChildByName("lock");
                                let nullSeat = defaultHead.getChildByName("nullSeat");

                                lock.active = true;
                                nullSeat.active = false;
                                this._setDefaultHeat(defaultHead, false);
                            }

                            break;
                        }

                    }
                }
            }
        } else {
            let seatArry = !TexasUtils._getSkin(["c"]) ? [1, 2, 3, 5, 8, 9] : [1, 2, 3, 4, 5, 6, 7, 8, 9];
            if (sSeat) {
                seatArry = !TexasUtils._getSkin(["c"]) ? [1, 2, 3, 5, 8, 9] : TexasUtils._getClubPlayerPos(TexasData._getMaxTableSeat());
            }
            for (let i = 0; i < seatArry.length; i++) {
                let playerItem = this.panelContent.getChildByName("player_" + seatArry[i]);
                let defaultHead = playerItem.getChildByName("defaultHead");
                if (defaultHead) {
                    let TexasDefaultHead = defaultHead.getComponent("TexasDefaultHead");
                    TexasDefaultHead._setSitid(i + 1);

                    let lock = defaultHead.getChildByName("lock");
                    let nullSeat = defaultHead.getChildByName("nullSeat");

                    lock.active = false;
                    nullSeat.active = true;
                    this._setDefaultHeat(defaultHead, true);

                    if (lockCount) {
                        if (i + 1 > maxTableNum) {
                            lock.active = true;
                            nullSeat.active = false;
                            this._setDefaultHeat(defaultHead, false);
                        }
                    }

                    defaultHead.active = true;
                }
            }
        }


        // }

    },

    //设置默认头像
    _setDefaultHeat(node, visible) {
        let TexasDefaultHead = node.getComponent("TexasDefaultHead");
        if (TexasDefaultHead) {
            TexasDefaultHead._setPoint(visible);
        }
    },

    //显示默认座位
    _showDefaultSeat(seat, isShow) {
        if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
            if (!seat) {
                this._getSitIdArry();
            } else {
                this._getSitIdArry(seat, isShow);

                // let playerItem = this.panelContent.getChildByName("player_"+ seat);
                // let defaultHead = playerItem.getChildByName("defaultHead");
                // if (defaultHead) {
                //     defaultHead.active = isShow;
                // }
            }
        }
    },

    //重置玩家
    _ResetPlayer() {
        let arry = this._getChild();
        for (let i = 0; i < arry.length; i++) {
            let texasPlayer = arry[i].getComponent(this.playJs);

            if (texasPlayer) {
                texasPlayer._ResetPlayer();
                cc.log("_setGrey1");
                texasPlayer._setGrey(true);//置灰

                if (TexasUtils._getClub()) {
                    texasPlayer.names.string = texasPlayer._name;
                }

                TexasUtils._setColor(texasPlayer.names.node);

                // if (texasPlayer.data.nUserId==UserInfo.getInfo().nUserID) {
                //     texasPlayer.names.node.active = false;
                // }
                texasPlayer.maxTime = TexasData._getMaxOperateTime();
            }
        }
    },

    //更新玩家麦克风按钮状态 "on": 打开 "off": 关闭
    _updatePlayerMike(micStatus, sShopAcc) {
        if (TexasUtils._getSkin(["default", "b", "d"])) {
            let info = UserInfo.getInfo();

            let arry = this._getChild();
            for (let i = 0; i < arry.length; i++) {
                let texasPlayer = arry[i].getComponent(this.playJs);

                if (texasPlayer) {
                    if (sShopAcc && texasPlayer._sShopAcc == sShopAcc) {
                        texasPlayer.setMikeImg(micStatus);

                        break;
                    }

                    if (!sShopAcc && texasPlayer.data.nUserId == info.nUserID) {
                        texasPlayer.setMikeImg(micStatus);

                        break;
                    }
                }

            }
        }
    },

    //更新玩家麦克风音量
    _updateMicVolume(data) {
        if (!data) return;

        if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
            let arry = this._getChild();
            for (let i = 0; i < arry.length; i++) {
                let texasPlayer = arry[i].getComponent(this.playJs);

                if (TexasUtils._getSkin(["c"])) {
                    //聊天室语音显示语音图标
                    if (data.isChatVoice && data.userid == texasPlayer.data.userId) {
                        // texasPlayer.showChatVoiceAnim(data.volume);
                        break;
                    }
                    if (data.fromAccount && data.fromAccount.indexOf(texasPlayer.data.nUserId + '') >= 0) {
                        texasPlayer._updateMic(data.volume);

                        break;
                    }
                } else {
                    if (data.userid && texasPlayer._sShopAcc == data.userid) {
                        texasPlayer._updateMicVolume(data.volume || 0);

                        break;
                    }
                }

            }
        }
    },

    // 更新所有玩家麦克风状态
    _updateAllPlayerMicState(users) {
        if (this._updateTimer) {
            clearTimeout(this._updateTimer);
            this._updateTimer = null;
        }
        let arry = this._getChild();
        for (let i = 0; i < arry.length; i++) {
            let texasPlayer = arry[i].getComponent(this.playJs);
            texasPlayer.showChatVoiceAnim(false);
            for (let j = 0; j < users.length; j++) {
                let userId = users[j];
                if (texasPlayer.data && texasPlayer.data.nUserId == Number(userId)) {
                    texasPlayer.showChatVoiceAnim(true);
                }
            }
        }

        // 一秒后全部关闭
        this._updateTimer = setTimeout(() => {
            this._updateTimer = null;
            this._updateAllPlayerMicState([]);
        }, 1000);
    },

    //更新上麦玩家麦克风状态
    _updateMicState(data) {
        if (!data) return;

        if (TexasUtils._getSkin(["default", "d"])) {
            let arry = this._getChild();
            for (let i = 0; i < arry.length; i++) {
                let texasPlayer = arry[i].getComponent(this.playJs);

                if (data.userid && texasPlayer._sShopAcc == data.userid) {
                    texasPlayer._updateMicState(data.status);

                    break;
                }

            }
        }
    },

    //获得自己是否站起
    _getIsSelfStand(sShopAcc) {
        if (!sShopAcc) return false;

        if (!TexasUtils._getSkin(["default", "b", "c", "d"])) return false;

        let info = UserInfo.getInfo();

        let isStand = false;

        let arry = this._getChild();
        for (let i = 0; i < arry.length; i++) {
            let texasPlayer = arry[i].getComponent(this.playJs);

            if (texasPlayer._sShopAcc == sShopAcc && texasPlayer.data.nUserId == info.nUserID) {
                isStand = true;

                break;
            }

        }

        cc.log("获得自己是否站起:", sShopAcc, isStand);

        return isStand;
    },

    //踢人
    _kickOutUser(sShopAcc) {
        if (!sShopAcc || sShopAcc == "") return;

        if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
            let arry = this._getChild();
            for (let i = 0; i < arry.length; i++) {
                let texasPlayer = arry[i].getComponent(this.playJs);

                if (texasPlayer._sShopAcc == sShopAcc) {
                    texasPlayer.onClickBtnKick();

                    break;
                }

            }
        }
    },

    //设置头像
    _setHead(visible) {
        let userData = this._getPlayerInfo();

        if (userData && userData.length > 0) {
            for (let i = 0; i < userData.length; i++) {
                let user = userData[i];
                let seat = user.seat;

                let texasPlayer = this._getTexasPlayer(seat);
                if (texasPlayer) {
                    texasPlayer._setHead(visible);
                }

            }
        }
    },

    //设置所有牌置灰
    _setAllCardGrey(nPos) {
        cc.log("_setAllCardGrey")
        let userData = this._getPlayerInfo();

        if (userData && userData.length > 0) {
            for (let i = 0; i < userData.length; i++) {
                let user = userData[i];
                let seat = user.seat;

                let texasPlayer = this._getTexasPlayer(seat);
                if (texasPlayer) {
                    cc.log("_setGrey2");
                    texasPlayer._setGrey(true, nPos);
                    texasPlayer._setCardLight();
                }

            }
        }
    },

    //设置魔法表情
    _setMagicFace(isShow) {
        if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
            let userData = this._getPlayerInfo();

            if (userData && userData.length > 0) {
                for (let i = 0; i < userData.length; i++) {
                    let user = userData[i];
                    let seat = user.seat;

                    let texasPlayer = this._getTexasPlayer(seat);
                    if (texasPlayer) {
                        texasPlayer._setMagic(isShow);
                    }

                }
            }
        }
    },

    //设置光效
    _setLight(seat) {
        if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
            if (!seat) {
                this._operateSeat = 0;
                // this._scheduleTime(this._updateAngle);
                if (!this.light) {
                    this.light = this.panelContent.getChildByName("light");
                }
                if (this.light) {
                    this.light.active = false;
                }
            } else {
                this._operateSeat = seat;

                let angle = 0;
                if (TexasUtils._getSkin(["c"])) {
                    if (seat != 1) {
                        let nSeat = seat;
                        if (seat == 10) {
                            nSeat = 1;
                        }

                        let player = this.panelContent.getChildByName("player_" + nSeat);

                        let lenY = Math.abs(this.light.y - player.y);
                        let lenX = Math.abs(this.light.x - player.x);

                        let atan = Math.atan(lenX / lenY);
                        if (seat == 4 || seat == 5 || seat == 8 || seat == 9) {
                            atan = Math.atan(lenY / lenX);
                        }

                        angle = (180 * atan) / 3.14;

                        if (seat == 4 || seat == 5) {
                            angle += 90;
                        } else if (seat == 6 || seat == 7) {
                            angle += 180;
                        } else if (seat == 8 || seat == 9) {
                            angle += 270;
                        }
                    }
                } else {
                    if (seat == 10) {
                        angle = 12;
                    } else if (seat == 5) {
                        angle = -180;
                    } else if (seat != 1) {
                        let player = this.panelContent.getChildByName("player_" + seat);

                        let lenY = Math.abs(this.light.y - player.y);
                        let lenX = Math.abs(this.light.x - player.x);

                        let atan = Math.atan(lenX / lenY);
                        if (seat == 3 || seat == 8 || seat == 9) {
                            atan = Math.atan(lenY / lenX);
                        }

                        angle = (180 * atan) / 3.14;

                        if (seat == 3) {
                            angle += 90;
                        } else if (seat == 8) {
                            angle = (270 - angle);
                        } else if (seat == 9) {
                            angle = (270 + angle);
                        }
                    }
                }

                if (this.light) {
                    if (TexasUtils._getSkin(["b"])) {
                        let type = 0;
                        if (seat == 2 || seat == 9) {
                            type = 1;
                        }

                        this.light.getComponent(cc.Sprite).spriteFrame = this.lightSpriteFrame[type];
                    } else if (TexasUtils._getSkin(["c"])) {
                        let type = 0;
                        if (seat >= 2 && seat <= 9) {
                            type = 1;
                        }

                        this.light.getComponent(cc.Sprite).spriteFrame = this.lightSpriteFrame[type];
                    }

                    this.light.stopAllActions();
                    if (!this.light.active) {
                        this.light.angle = 360 - angle;
                        this.light.active = true;
                    } else {
                        var rotateTo = cc.rotateTo(0.2, angle);
                        this.light.runAction(rotateTo);

                        // this._angle = this.light.angle;
                        // this._targetAngle = angle;

                        // let reduceAngle = Number(this._targetAngle) - Number(this._angle);
                        // if (Number(this._angle)>Number(this._targetAngle)) {
                        //     reduceAngle = Number(this._angle) - Number(this._targetAngle);
                        // }
                        // this._angleVolue = reduceAngle;

                        // this._scheduleTime(this._updateAngle,true,0.01);
                    }
                }

            }
        }
    },

    //设置魔法表情面板位置
    _setMagicPanelPos() {
        if (!TexasUtils._getSkin(["default", "b", "c", "d"]) || !this.TexasMagicFaceController) return;

        let magicChild = this.TexasMagicFaceController.node.children;
        if (magicChild && magicChild.length > 0) {
            for (let i = 0; i < magicChild.length; i++) {
                let child = magicChild[i];
                let name = child.name.toString();

                let index = 1;
                if (name == "magic_2") {
                    index = 2;
                } else if (name == "magic_3") {
                    index = 3;
                } else if (name == "magic_4") {
                    index = 4;
                } else if (name == "magic_5") {
                    index = 5;
                } else if (name == "magic_6") {
                    index = 6;
                } else if (name == "magic_7") {
                    index = 7;
                } else if (name == "magic_8") {
                    index = 8;
                } else if (name == "magic_9") {
                    index = 9;
                }

                let playerItem = this.panelContent.getChildByName("player_" + index);
                let magicPanel = child.getChildByName(name);
                let magicLook = playerItem.getChildByName(name);

                if (playerItem && magicPanel && magicLook) {
                    let pos = TexasUtils._getNodePos(magicLook, magicPanel);
                    magicPanel.x = pos.x;
                    magicPanel.y = pos.y;
                }

            }
        }
    },

    //定时器
    _scheduleTime(callback, isStart, time) {
        if (cc.director.getScheduler().isScheduled(callback, this)) {
            cc.director.getScheduler().unschedule(callback, this);
        }

        if (isStart) {
            cc.director.getScheduler().schedule(callback, this, time, false);
        }
    },

    //更新角度
    _updateAngle() {
        let isTargetAngle = false;

        let value = this._angleVolue / 2;

        this._angle -= value;
        if (this._angle <= -360) {
            this._angle = 0;
        }

        if (this._angle <= this._targetAngle && this._angle >= this._targetAngle - value) {
            isTargetAngle = true;
            this._angle = this._targetAngle;
        }

        this.light.angle = this._angle;

        if (!isTargetAngle) {
            this._scheduleTime(this._updateAngle, true, 0.01);
        } else {
            this._scheduleTime(this._updateAngle);

            return;
        }
    },

    //设置重置踢人按钮
    _resetKick() {
        let isMatchTable = TexasUtils._isMatchTable();
        if (TexasUtils._getSkin(["default", "d"]) && isMatchTable) {
            return;
        }

        let userData = this._getPlayerInfo();

        if (userData && userData.length > 0) {
            for (let i = 0; i < userData.length; i++) {
                let user = userData[i];
                let seat = user.seat;

                let texasPlayer = this._getTexasPlayer(seat);
                if (texasPlayer && texasPlayer.kickBtn) {
                    texasPlayer.kickBtn.active = false;
                }

            }

        }

    },

    //修改玩家客户端座位号
    _changeUserSeat() {
        let arry = this._getChild();

        for (let i = 0; i < arry.length; i++) {
            let texasPlayer = arry[i].getComponent(this.playJs);
            if (texasPlayer) {
                let nSeat = texasPlayer.seat;
                arry[i].name = "player_" + nSeat;
            }
        }
    },

    //检测牌桌是否有一样的玩家id
    _checkIsSameUser(data) {
        //cc.log("检测相同id玩家:",data);

        let isSame = false;

        let arry = this._getChild();
        for (let i = 0; i < arry.length; i++) {
            let texasPlayer = arry[i].getComponent(this.playJs);

            if (texasPlayer && texasPlayer.data) {
                let nData = texasPlayer.data;
                //cc.log("德州 nData,data.nUserId:",nData,data.nUserId);

                if (data.nUserId == nData.nUserId) {
                    isSame = true;
                    texasPlayer.data = data;
                    texasPlayer.data.seat = texasPlayer.seat;

                    break;
                }
            }
        }

        return isSame;
    },

    //检测游戏可开始
    _checkGameCanStart(gameStart) {

        if (gameStart) return true;

        let canStart = false;
        let people = 0;

        let arry = this._getChild();
        for (let i = 0; i < arry.length; i++) {
            let texasPlayer = arry[i].getComponent(this.playJs);

            if (texasPlayer) {
                if (!gameStart) {//游戏未开始，计算牌桌人数
                    people++;
                }
            }
        }

        let autoStartNum = TexasData._getAutoStartNum();
        if (TexasUtils._getClub()) {
            //俱乐部牌桌可以设置自动开始人数
            if (people >= autoStartNum) {
                canStart = true;
            }
        } else {
            if (people > 1) {
                canStart = true;
            }
        }


        cc.log("检测游戏可开始:", people, canStart);
        return canStart;
    },

    //获得玩家是否在玩
    _getIsPlaying(userId) {
        //cc.log("获得玩家是否在玩的id:",userId);

        let isPlaying = false;

        let arry = this._getChild();
        for (let i = 0; i < arry.length; i++) {
            let texasPlayer = arry[i].getComponent(this.playJs);

            if (texasPlayer) {
                let nUserId = texasPlayer.data.nUserId;
                let isPlayings = texasPlayer._isPlaying;

                if (userId == nUserId && isPlayings) {
                    isPlaying = true;

                    break;
                }
            }
        }

        return isPlaying;
    },

    //获得客户端座位号
    _getSeat(key, value) {
        // cc.log("获得客户端座位号 key,value:",key,value);

        return this._getPlayerInfo(key, value, "seat");
    },

    //获得服务端座位号
    _getSitId(key, value) {
        //  cc.log("获得服务端座位号 key,value:",key,value);

        return this._getPlayerInfo(key, value, "nSitId");
    },

    //获得玩家id
    _getUserId(key, value) {
        // cc.log("获得玩家id key,value:",key,value);

        return this._getPlayerInfo(key, value, "nUserId");
    },

    //获得金币
    _getGold(key, value) {
        // cc.log("获得玩家金币 key,value:",key,value);

        return this._getPlayerInfo(key, value, "nBalance");
    },

    //获得第三方id
    _getShopAcc(key, value) {
        //cc.log("获得玩家第三方id key,value:",key,value);

        return this._getPlayerInfo(key, value, "sShopAcc");
    },

});
