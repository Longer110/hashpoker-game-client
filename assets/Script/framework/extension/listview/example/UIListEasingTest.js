/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2023-01-09 15:36:32
 * @LastEditors: OreoWang
 * @LastEditTime: 2023-01-12 17:24:59
 * @Description: 
 */
// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let UIListView = require("UIListView");
let UIListEasing = require("UIListEasing");

cc.Class({
    extends: cc.Component,

    properties: {
        listView: {
            default: null,
            type: UIListView,
        },

        listView2: {
            default: null,
            type: UIListView,
        },

        _data: [],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.init();
    },

    init(){
        let data = this._data = this.createData();
        this.listView.init(this, data);
        let cell = this.listView.queryCell(e=>{
            let key = e.getData();
            if(UIListEasing[key]==this.listView2.getEasingHandler()){
                return true;
            }
            return false;
        })
        if(cell){
            this.listView.onClickCell(cell);
        }
    },


    // update (dt) {},

    /**
     * 
     * @param {UIListCell} cell 
     */
     onAttachCell(cell){
        let label = cell.node.getChildByName("label").getComponent(cc.Label);
        let data = cell.getData();
        label.string = data;
        cell.node.getChildByName("check").active = false;
    },
    onSelectCell(cell){
        cell.node.getChildByName("check").active = true;

        this.listView2.setEasingHandler(UIListEasing[cell.getData()]);
    },
    unSelectCell(cell){
        cell.node.getChildByName("check").active = false;
    },

    createData(){
        let data = [];
        for (const key in UIListEasing) {
            if (Object.hasOwnProperty.call(UIListEasing, key)) {
                // const element = object[key];
                if(key.indexOf("Out")>=0 
                    && key.indexOf("In")<0
                ){
                    data.push(key);
                }
            }
        }
        //  //console.log(data)
        return data;
    }
});
