let HallClubControl = require("HallClubControl");
let HallClubCacheData = require("HallClubCacheData");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    ctor() {
    },

    init(){
        HallClubControl.init(this);
    },

    //登录俱乐部 
    //clubId: 俱乐部id
    //callBack: 登录回调
    loginClub(clubId, callBack){
        HallClubControl.loginClub(clubId, callBack);
    },

    //获取俱乐部牌桌列表
    getClubTableList(index, clubId, callBack){
        HallClubControl.requestClubTableList(index, clubId);
    },

    //关闭俱乐部牌桌
    closeClubTable(clubId, tableId, callBack){
        HallClubControl.closeTable(clubId, tableId);
    },

    //获取回放数据
    getPlayBackData(sPaiJuId, callBack){
        if (!sPaiJuId){
            //没有牌局id直接获取缓存的记录
            return HallClubCacheData.getPlayBackData();
        }else{
            HallClubControl.requestPlaybackData(sPaiJuId, callBack)
        }
        
    },

    //清理回放数据
    cleanPlayBackData(){
        HallClubCacheData.savePlayBackData({});
    },

    //获取牌桌牌局id列表
    getTalblePaiJuIdList(sendData, callBack){
        HallClubControl.requestTalblePaiJuId(sendData, callBack);
    },

    //打开设置牌局界面
    //data:{callBack:callback}
    openGameSettingUI(data){
        let prefabName = "HallMyGameSetting";
        let wrapper = app.ClubViews;
        let path = prefabName;
        path = wrapper.path(path,null,"main-hall/resources/prefab/");
        
        app.ClubViews.bundle.load(path,cc.Prefab,function (error, prefab){
            if(!error && cc.isValid(this)){
                let node = cc.instantiate(prefab);
                let scene = cc.director.getScene();
                if (scene){
                    scene.addChild(node, 1024);
                    let component = node.getComponent(prefabName);
                    if (component && component.init){
                        component.init(data)
                    }
                }
                
            }else{
            }
            
        }.bind(this))
    }
    
});