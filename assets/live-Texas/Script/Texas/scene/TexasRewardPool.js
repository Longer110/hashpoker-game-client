/*
    德州奖池
*/

let TexasUtils = require("TexasUtils");
let TexasData = require("TexasData");
let Utils = require("Utils");

cc.Class({
    extends: cc.Component,

    properties: {
        pond: cc.Node,//奖池
        checkPond: cc.Node,//检测奖池
        pondObj: cc.Node,//奖池模板
        poolPos: cc.Node,//奖池位置

        poolSumNode: cc.Node,
        poolTextParent: cc.Node,//奖池文本父节点
        poolText: cc.Node,//奖池文本

        poolSumBg: cc.Node,//总筹码

        itemPaundPrefab: {//奖池预制
            default: null,
            type: cc.Prefab,
        },

        itemChipPrefab: {//筹码预制
            default: null,
            type: cc.Prefab,
        },

        _poolData: [],//奖池数据

        _totalTurnBet: 0,//本轮下注筹码数据
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},

    //初始化底池
    _initSidePond(control) {
        this.control = control;
        if (this.poolSumBg) {
            this.poolSumBg.active = false;
        }

        this._clearPondChild();//初始化展示底池
    },

    //删除底池子节点
    _clearPondChild() {
        this.pond.destroyAllChildren();

        if (!TexasUtils._getSkin(["default", "b", "c", "d"])) {
            this.checkPond.destroyAllChildren();
        }
        this._poolData = [];
        let poolType = this.checkPond.getChildByName("type_" + 1);
        let poolText = poolType.getChildByName("poolText");
        let poolTextPos = TexasUtils._getNodePos(poolText, this.poolSumNode);
        this.poolSumNode.position = poolTextPos
    },

    //奖池是不是为空
    _checkIsPoolNull() {

        let isPoolNull = false;

        if (this.pond.children <= 0) {
            isPoolNull = true;
        }

        return isPoolNull;
    },

    //增加底池
    _addPond(gold, isAddPond, isLink) {
        cc.log("_addPond gold,isAddPond,isLink:", gold, isAddPond, isLink);

        let pondChild = this.pond.children;
        if (isAddPond) {
            let poolNum = TexasData._getRewardPoolSum();
            TexasData._setRewardPoolSum(poolNum + gold);//设置奖池总额
        }


        if (isAddPond) {//在现有奖池加注
            if (pondChild && pondChild.length > 0) {
                let len = pondChild.length;
                if (this._poolData.length == 0) return

                let endPond = pondChild[len - 1];
                let count = endPond.getChildByName("count").getComponent(cc.Label);
                cc.log("_addPond this._poolData", Utils.clone(this._poolData));
                if (this._poolData.length == 0 || this._poolData[len - 1].gold == "undefined") return
                let saveLabel = this._poolData[len - 1].gold;
                cc.log("_addPond saveLabel:", saveLabel);
                count.string = TexasUtils._saveTwoPoint(saveLabel + Number(gold));
                cc.log("_addPond saveLabel + Number(gold):", saveLabel + Number(gold));
                this._poolData[len - 1].gold = saveLabel + Number(gold);

                if (!TexasUtils._getSkin(["default", "b", "c", "d"])) {
                    this._updatePoolChip(endPond, saveLabel + Number(gold));
                }
            }
        } else {//构建奖池
            if (TexasUtils._getSkin(["default", "b", "c", "d"])) {
                let nextPool = this._poolData.length + 1;

                // let endPoolPos = this.pond.position;
                // if (pondChild && pondChild.length>0) {
                //     endPoolPos = pondChild[pondChild.length-1].position;
                // }

                let itemPool = cc.instantiate(this.itemPaundPrefab);
                itemPool.parent = this.pond;
                itemPool.name = "Pool_" + nextPool;
                let count = itemPool.getChildByName("count").getComponent(cc.Label);
                count.string = TexasUtils._saveTwoPoint(gold);
                // itemPool.position = endPoolPos;
                itemPool.active = false;

                let data = {
                    index: nextPool,
                    gold: Number(gold),
                }

                this._poolData.push(data);

                let poolType = this.checkPond.getChildByName("type_" + nextPool);
                let poolText = poolType.getChildByName("poolText");
                poolText.active = false

                let poolTextPos = TexasUtils._getNodePos(poolText, this.poolTextParent);
                //console.log("poolTextPos :  " + poolTextPos);

                // this.poolTextParent.position = poolTextPos
                this.poolSumNode.position = poolTextPos
                this._setPoolItemPos();
                this._showLabelBetData();

                // let poolSumBg = this.poolText.getChildByName("poolSumBg");
                // let poolSumBgPos = TexasUtils._getNodePos(poolSumBg,this.poolSumBg);
                // if(TexasUtils._getClub()){
                //     this.poolSumBg.parent.x = this.poolTextParent.x;
                //     this.poolSumBg.parent.y = this.poolTextParent.y;
                // }



                if (poolType) {
                    for (let i = 0; i < this.pond.children.length; i++) {
                        let poolItem = this.pond.children[i];

                        poolItem.scale = 1;
                        if (TexasUtils._getSkin(["default", "d"])) {
                            poolItem.scale = nextPool == 5 || nextPool == 6 ? 0.76 : 1;
                        }

                        let poolTypeChild = poolType.getChildByName(poolItem.name);

                        if (poolTypeChild) {
                            let poolPos = TexasUtils._getNodePos(poolTypeChild, poolItem);
                            cc.log("_addPond poolPos.x,poolPos.y:", poolPos.x, poolPos.y);

                            // poolItem.stopAllActions();    

                            poolItem.active = true;
                            if (isLink) {
                                // poolItem.x = poolPos.x;
                                // poolItem.y = poolPos.y;
                            } else {
                                // var actionMove = cc.moveTo(0.5,poolPos.x,poolPos.y);
                                // poolItem.runAction(cc.sequence(actionMove,cc.callFunc(function (args) {

                                // })));
                            }
                        }

                    }
                }
            } else {
                //构建检测奖池
                let checkPoolChid = this.checkPond.children;
                let nextPoolIndex = checkPoolChid.length + 1;

                this.pos = 0;
                if (checkPoolChid.length > 0) {
                    this.pos = checkPoolChid[checkPoolChid.length - 1].x;
                }

                let itemCheckPool = cc.instantiate(this.itemPaundPrefab);
                itemCheckPool.parent = this.checkPond;
                itemCheckPool.name = "" + nextPoolIndex;
                itemCheckPool.opacity = 0;

                //构建显示奖池
                let itemPool = cc.instantiate(this.itemPaundPrefab);
                itemPool.parent = this.pond;
                itemPool.name = "Pool_" + nextPoolIndex;
                let count = itemPool.getChildByName("count").getComponent(cc.Label);
                count.string = TexasUtils._saveTwoPoint(gold);
                this._updatePoolChip(itemPool, Number(gold));
                // itemPool.x = this.pos;
                itemPool.active = false;

                let data = {
                    index: nextPoolIndex,
                    gold: Number(gold),
                }

                this._poolData.push(data);
                this._setPoolItemPos();
                this.scheduleOnce(function () {
                    for (let i = 0; i < this.checkPond.children.length; i++) {
                        let checkPool = this.checkPond.children[i];

                        let poolChild = this.pond.getChildByName("Pool_" + checkPool.name);
                        if (poolChild) {
                            // poolChild.stopAllActions();    

                            poolChild.active = true;
                            if (isLink) {
                                // poolChild.x = checkPool.x;
                                // poolChild.y = 0;
                            } else {
                                // var actionMove = cc.moveTo(0.5,checkPool.x,0);
                                // poolChild.runAction(cc.sequence(actionMove,cc.callFunc(function (args) {
                                //     if (i==checkPoolChid.length-1) {

                                //     }
                                // })));
                            }


                        }

                    }
                }, 0.1);
            }

        }
        this._updateTotalPoolText(); //刷新总底池文本

        if (!TexasUtils._getClub()) {
            return;
        }

        if (this._poolData.length <= 1) {
            this.pond.active = false;
        } else {
            this.pond.active = true;
        }

    },

    //刷新总底池文本
    _updateTotalPoolText(isInit = false) {
        let sumPool = TexasData._getRewardPoolSum();
        // for (let i=0; i<this._poolData.length; i++) {
        //     let pool = this._poolData[i];
        //     let gold = pool.gold;

        //     sumPool += gold;
        // }

        this.poolTextParent.active = true;
        if (sumPool == 0) {
            this.poolTextParent.active = false;
        }
        if (isInit) {
            sumPool = 0;
            this.poolTextParent.active = true;
        }

        this.poolText.getComponent(cc.Label).string = TexasUtils._getText(141, TexasUtils._saveTwoPoint(sumPool));

    },

    _setPoolItemPos() {
        let poolGrid = this._getPoolGrid();
        let count = 0;
        let rowCount = 0;
        for (let r = poolGrid.length - 1; r > -1; r--) {
            let row = poolGrid[r];
            if(row.length == 0){
                continue;
            }
            let index = rowCount;
            let yPos = index * 56 + 28 + (rowCount - 1) * 11;
            let xPosStart = -((row.length - 1) * (146 + 15)) / 2;
            for (let c = 0; c < row.length; c++) {
                count++;
                let poolItem = this.pond.getChildByName("Pool_" + count);
                if (poolItem) {
                    poolItem.y = yPos;
                    poolItem.x = xPosStart + c * (146 + 15);
                }
            }
            rowCount++;
        }
    },
    _updateSumPool(num) {
        let sumPool = 0;
        for (let i = 0; i < this._poolData.length; i++) {
            let pool = this._poolData[i];
            let gold = pool.gold;

            sumPool += gold;
        }

        if (num) {
            sumPool = num;
        }

        if (this.poolSumBg) {
            let sumPoolLabel = this.poolSumBg.getChildByName("label").getComponent(cc.Label);
            // sumPoolLabel.string = TexasUtils._saveTwoPoint(sumPool);

            this.poolSumBg.active = true;
            if (sumPool == 0) {
                this.poolSumBg.active = false;
            }
        }

    },

    //刷新底池文本位置
    _updatePoolText(len) {
        cc.log("刷新底池文本位置:", len);

        // if (TexasUtils._getSkin(["default","b","c","d"])) {
        //     let poolType = this.checkPond.getChildByName("type_" + len);
        //     let poolText = poolType.getChildByName("poolText");

        //     let poolTextPos = TexasUtils._getNodePos(poolText,this.poolText);
        //     this.poolTextParent.x = poolTextPos.x;
        //     this.poolTextParent.y = poolTextPos.y;
        //     cc.log("刷新底池文本位置:",poolTextPos.x,poolTextPos.y);

        //     if (!TexasUtils._getClub()){
        //         return;
        //     }
        //     //let poolSumBg = this.poolText.getChildByName("poolSumBg");
        //     //let poolSumBgPos = TexasUtils._getNodePos(poolSumBg,this.poolSumBg);
        //     this.poolSumBg.x = this.poolTextParent.x;
        //     this.poolSumBg.y = this.poolTextParent.y;
        // }
    },

    //刷新奖池筹码
    _updatePoolChip(node, count) {
        cc.log("刷新奖池筹码", count);

        let chipList = node.getChildByName("iconChip");
        chipList.destroyAllChildren();

        let data = TexasUtils._changeChipByConfig(count);//筹码数组
        for (let i = 0; i < data.length; i++) {
            let dataItem = data[i];

            let itemChip = cc.instantiate(this.itemChipPrefab);
            itemChip.parent = chipList;
            itemChip.x = 0;
            itemChip.y = 0;
            let texasChips = itemChip.getComponent("texasChip");
            texasChips._initChip(dataItem);
            itemChip.active = true;
        }
    },

    //刷新奖池
    _updatePond(arry) {

        if (arry && arry.length > 0) {
            let pondLen = this.pond.children.length;//现有奖池数目
            let needLen = arry.length;//需要的奖池数目

            if (needLen >= pondLen) {//需要的奖池数目大于现有底池数目，创建新奖池
                for (let i = 0; i < needLen; i++) {
                    let arryItem = arry[i];

                    if (pondLen > 0) {
                        for (let j = 0; j < pondLen; j++) {
                            let pondItem = this.pond.children[j];

                            if (i == j) {
                                let count = pondItem.getChildByName("count").getComponent(cc.Label);

                                this._updatePoolData(j + 1, Number(arryItem));

                                count.string = TexasUtils._saveTwoPoint(arryItem);

                                if (!TexasUtils._getSkin(["default", "b", "c", "d"])) {
                                    this._updatePoolChip(pondItem, Number(arryItem));
                                }

                                break;
                            }

                            if (i > pondLen - 1) {
                                this._addPond(arryItem);

                                break;
                            }

                        }
                    } else {
                        this._addPond(arryItem);

                        break;
                    }

                }
            } else {//需要的奖池数目小于现有底池数目，删除相应现有底池数目
                for (let i = 0; i < needLen; i++) {
                    let arryItem = arry[i];

                    for (let j = 0; j < pondLen; j++) {
                        let pondItem = this.pond.children[j];

                        if (i == j) {
                            let count = pondItem.getChildByName("count").getComponent(cc.Label);

                            this._updatePoolData(j + 1, Number(arryItem));

                            count.string = TexasUtils._saveTwoPoint(arryItem);
                            if (!TexasUtils._getSkin(["default", "b", "c", "d"])) {
                                this._updatePoolChip(pondItem, Number(arryItem));
                            }

                            break;
                        }
                    }
                }

                let pondChild = this.pond.children;
                for (let i = pondChild.length - 1; i >= needLen; i--) {
                    if (cc.isValid(pondChild[i])) {
                        pondChild[i].destroy();
                        this._poolData.splice(i, 1);
                    }
                }

                if (!TexasUtils._getSkin(["default", "b", "c", "d"])) {

                    let checkPoolChild = this.checkPond.children;
                    for (let i = checkPoolChild.length - 1; i >= needLen; i--) {
                        if (cc.isValid(checkPoolChild[i])) {
                            checkPoolChild[i].destroy();
                        }
                    }
                }

                let checkPondChilds = this.checkPond.children;
                for (let i = 0; i < checkPondChilds.length; i++) {
                    let checkPool = checkPondChilds[i];

                    let poolChild = this.pond.getChildByName("Pool_" + checkPool.name);
                    if (poolChild) {
                        poolChild.stopAllActions();

                        var actionMove = cc.moveTo(0.5, checkPool.x, 0);
                        poolChild.runAction(cc.sequence(actionMove, cc.callFunc(function (args) {
                            if (i == checkPondChilds.length - 1) {

                            }
                        })));

                    }

                }


            }

        }

    },

    //获取奖池二维数组
    _getPoolGrid() {
        let data = this._poolData ? this._poolData : [];
        let total = data.length;
        let rows = [[], [], []];

        if (total === 0) {
            return rows;
        }

        if (total >= 9) {
            // 完整 3x3
            for (let r = 0; r < 3; r++) {
                rows[r] = data.slice(r * 3, r * 3 + 3);
            }
            return rows;
        }

        if (total > 6) {
            // 7 或 8：前两行 3，最后一行为剩余
            rows[0] = data.slice(0, 3);
            rows[1] = data.slice(3, 6);
            rows[2] = data.slice(6, 6 + (total - 6));
            return rows;
        }

        if( total === 3) { 
            rows[0] = data.slice(0, 2);
            rows[1] = data.slice(2, 3);
            return rows;
        }

        // total <= 6：倒金字塔 3,2,1 的分配，遇到不足则上行优先填满
        const pyramid = [3, 2, 1];
        let idx = 0;
        for (let r = 0; r < 3; r++) {
            let take = Math.min(pyramid[r], Math.max(0, total - idx));
            if (take > 0) {
                rows[r] = data.slice(idx, idx + take);
                idx += take;
            } else {
                rows[r] = [];
            }
        }
        return rows;
    },

    //更新底池数据
    _updatePoolData(nIndex, gold) {
        if (this._poolData.length > 0) {
            for (let i = 0; i < this._poolData.length; i++) {
                let data = this._poolData[i];
                let index = data.index;

                if (Number(nIndex) == Number(index)) {
                    data.gold = gold;

                    break;
                }


            }

        }
    },

    //更新本轮下注筹码数据
    _updateTurnBetData(betNum) {
        this._totalTurnBet += betNum;
        this._showLabelBetData();
    },

    //清除本轮下注筹码数据
    _clearTurnBetData() {
        this._totalTurnBet = 0;
        this._showLabelBetData();
    },

    //显示下注筹码数据
    _showLabelBetData() {
        if (this.poolSumBg) {
            let sumBetLabel = this.poolSumBg.getChildByName("label").getComponent(cc.Label);
            sumBetLabel.string = TexasUtils._saveTwoPoint(this._totalTurnBet);
            if(this._poolData.length > 1) {
                sumBetLabel.node.active = false;
                this.poolSumBg.getChildByName("chouma").y = -64;
                this.poolSumBg.getChildByName("labBg").active = false;
            }else {
                sumBetLabel.node.active = true;
                sumBetLabel.node.y = -64;
                this.poolSumBg.getChildByName("chouma").y = 6;
                this.poolSumBg.getChildByName("labBg").active = true;
            }
            this.poolSumBg.active = true;
            if (this._totalTurnBet == 0) {
                // this.poolSumBg.active = false;
            } else if (this._totalTurnBet > 0) {

            }
        }
    },


    _playerChouMaAni() {
        let chouma = this.poolSumBg.getChildByName("chouma")
        let spine = chouma.getComponent(sp.Skeleton)
        chouma.active = true
        spine.setAnimation(0, "animation", false);
    },

    //获得奖池
    _getPool(id) {
        let pool = null;

        let pondChild = this.pond.children;
        cc.warn("pondChild.length,this._poolData:", pondChild.length, this._poolData);
        if (pondChild && pondChild.length > 0) {
            for (let i = 0; i < pondChild.length; i++) {
                let pools = pondChild[i];

                if ("Pool_" + id == pools.name.toString()) {
                    pool = pools;

                    break;
                }

            }

        }

        return pool;
    },

});
