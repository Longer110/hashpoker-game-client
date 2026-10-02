
let TexasPanelAction = require("TexasPanelAction");
let MsgManager = require("MsgManager");
let TexasData = require("TexasData");
let TexasUtils = require("TexasUtils");

cc.Class({
    extends: TexasPanelAction,

    properties: {
        scrollView: cc.ScrollView,

        scontent: cc.Node,

        _listPage: 0,
        _list: [],
    },

    start () {

    },

    onLoad() {
        this.hide();
        this._offsetX = this.panelPosition.x;

        let Msg_club = TexasUtils._getClub()?require("Msg_club"):null;

        if (Msg_club) {
            MsgManager.on(Msg_club.NOTIFY.ClubSGetTableListResp_ui, this._onGetTableList, this);
            MsgManager.on(Msg_club.NOTIFY.ClubSCloseTableNotify_ui, this._onCloseTable, this);
        }
    },

    onDestroy() {
        MsgManager.un(this._onGetTableList);
        MsgManager.un(this._onCloseTable);
    },

    //构建列表
    _createList(control) {
        // data = [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}];

        this.control = control;

        this.scrollView.scrollToTop(0.1);

        //处理数据
        this.scontent.destroyAllChildren(false);

        this._listPage = 0;
        this._list = [];
        // app.club.loginClub(0);

        let clubId = TexasData._getClubId();
        app.club.getClubTableList(this._listPage,clubId);
    },

    _showList(data) {
        if (data && this.scrollView) {
            let dys = this.scrollView.getComponent("DynamicScrollView");
            dys.init(data);
        }
    },

    updateListView(node,data){
        let itemPrefab = node.getComponent("texasTableInfoItem");
        itemPrefab.createTableInfoItem(this.control,data);
    },

    _onGetTableList(data){
        cc.warn("俱乐部牌桌列表返回:",data);
        if (data.hasOwnProperty("arrTableInfo")) {
            let arrTableInfo = data.arrTableInfo;

            if (arrTableInfo.length>0) {
                for (let i=0; i<arrTableInfo.length; i++) {
                    let list = JSON.parse(arrTableInfo[i]);
                    this._list.push(list);
                    this._listPage = list.nTableIndex;
                }
                
                let clubId = TexasData._getClubId();
                app.club.getClubTableList(this._listPage,clubId);
            }else {
                this._showList(this._list);
            }
        }
    },

    _onCloseTable(data) {
        let sTableIds = data.sTableId;

        let curTable = TexasData._getCurTableId();//获得当前牌桌
        if (sTableIds==curTable) return;

        this._deleTable(sTableIds,this._list);

        if (this.scrollView) {
            let dys = this.scrollView.getComponent("DynamicScrollView");
            this._deleTable(sTableIds,dys._data);
        }
        
        let tableChild = this.scontent.children;
        if (tableChild.length>0) {
            for (let i=0; i<tableChild.length; i++) {
                let table = tableChild[i];
                let texasTableInfoItem = table.getComponent("texasTableInfoItem");

                let tableIds = texasTableInfoItem._getTableId();

                if (sTableIds==tableIds) {
                    table.destroy();

                    break;
                }
            }
        }
    },

    _deleTable(sTableIds,lists) {
        for (let i=0; i<lists.length; i++) {
            let list = lists[i];
            let sTableId = list.sTableId;

            if (sTableIds==sTableId) {
                lists.splice(i, 1);

                break;
            }
        }
    },

});