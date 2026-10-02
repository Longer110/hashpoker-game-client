cc.Class({
    extends: cc.Component,

    properties: {
        itemNode: cc.Node,           //克隆节点

        _dataArr: [],                //数据数组
        _showArr: [],                //显示中的节点数组
    },

    onLoad() {
        //开始定时器
        this.schedule(this.updateState, 3);
    },

    onDestroy() {
        //停止定时器
        this.unschedule(this.updateState);
    },

    //刷新显示状态
    updateState() {
        //删除第一条
        if (this._showArr.length > 0) {
            let subItem = this._showArr.shift();
            subItem.destroy();
            this.layout();
        }

        if (this._dataArr.length <= 0) return;

        //最多显示3条
        while (this._showArr.length < 3) {
            let subData = this._dataArr.shift();
            let item = this.createItem(subData);
            item.parent = this.node;
            this._showArr.push(item);

            if (this._dataArr.length <= 0) break;
        }

        this.layout();
    },

    //布局位置
    layout() {
        for (let i = 0; i < this._showArr.length; i++) {
            this._showArr[i].setPosition(0, i * -80);
        }
    },

    //创建节点
    createItem(data) {
        let item = cc.instantiate(this.itemNode);

        //牌桌名称
        item.getChildByName("name_label").getComponent(cc.Label).string = data.tableName;
        //下注额
        item.getChildByName("bet_label").getComponent(cc.Label).string = app.util.convertNumberToStr2(data.betNum)
        //结算金额
        let profitLabel = item.getChildByName("profit_label").getComponent(cc.Label);
        if (data.profit >= 0) {
            profitLabel.node.color = new cc.Color(60, 215, 17);
            profitLabel.string = "+" + app.util.convertNumberToStr2(data.profit);
        }
        else {
            profitLabel.node.color = new cc.Color(201, 34, 34);
            profitLabel.string = app.util.convertNumberToStr2(data.profit);
        }
        //显示节点
        item.active = true;

        return item;
    },

    //添加数据
    pushData(data) {
        this._dataArr.push(data);
    },

});