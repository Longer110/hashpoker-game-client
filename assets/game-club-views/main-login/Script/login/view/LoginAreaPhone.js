// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let UIListView = require("UIListView");
let i18n = require('i18n');
let UIFrame = require("UIFrame");

cc.Class({
    extends: cc.Component,

    properties: {
        listView: {
            default: null,
            type: UIListView,
        },
        editbox: cc.EditBox,

        item: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.editbox.placeholder = i18n.t("CLUB_LOGIN.COUNTRY");
        this.listView.init(this);
        let text = i18n.t("CLUB_AREA_PHONE");
        this._config = JSON.parse(text);
        this.updateTableScrollView(this._config);
    },

    init(control){
        this._control = control
    },

    // update (dt) {},

    updateTableScrollView(listData) {
        //设置列表item数据
        let dataArr = listData;
        this.listView.resetData(dataArr);
    },

    onAttachCell(cell){
        cell.node.active = true;
        let data = cell.getData();
        let countryName = cell.node.getChildByName("countryName").getComponent(cc.Label);
        let code = cell.node.getChildByName("code").getComponent(cc.Label);
        countryName.string = data.name;
        code.string = "+" + data.code;

        let button = cell.node.getComponent(cc.Button);
        button.node.off(cc.Node.EventType.TOUCH_END);
        button.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.onClickItem(data, cell.node);
        }.bind(this));
    },

    onLoadMoreStart(){
        this.listView.onLoadMoreFinish();
    },

    onClickItem(data, node){
        if (this._control){
            this._control.setContryCode(data);
        }

        this.onClickClose();
    },

    onClickSearch(){
        let str = this.editbox.string;
        let array = [];
        for (let i = 0; i < this._config.length; i++) {
            let arr = this._config[i];
            if (arr.name.indexOf(str)>= 0){
                array.push(arr);
            }
            
        }

        if (array.length > 0){
            this.updateTableScrollView(array);
        }else{
            UIFrame.showTips(i18n.t("CLUB_LOGIN.COUNTRY_TIP"));
        }
    },

    onEditTextEnd(editBox) {
        if (this.editbox.string == ""){
            this.updateTableScrollView(this._config);
        }
        
    },

    onClickClose(){
        this.node.destroy();
    },
});
