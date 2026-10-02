// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html


let obj = cc.Class({
    properties: {
        buffData: Object,
    },

    ctor: function(){
        let data = [
            // {
            //     sDetails:"aaaaaaaadfffffffffffffffffff",
            // }
        ];
        this.setData(data)
        
    },

    setData: function (value){
        this.noticeData = value;
    },
    getData: function(){
        return this.buffData;
    },
    isEmpty:function () {
        let len = this.noticeData.length;
        if(len > 0 ){
            return false
        }else{
            return true
        }
    },
    pushData(data){
        this.noticeData.push(data);
    },

    firstData(){
        if(this.noticeData.length>0){
            return this.noticeData[0];
        }else{
            return null;
        }
    },
    deleteFirstData(){
        this.noticeData.shift();
    },

    clear(){
        this.setData([])
    },
});

let instance = new obj();
module.exports = instance;