// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

// let TexasPlayerController = require("TexasPlayerController");
// let TexasMagicFaceController = require("TexasMagicFaceController");

let TexasUtils = require("TexasUtils");
let UserInfo = require("UserInfo");

cc.Class({
    extends: cc.Component,

    properties: {
        // TexasPlayerController: TexasPlayerController,//玩家容器
        // TexasMagicFaceController: TexasMagicFaceController,//魔法表情控制

        scontent: cc.Node,
        playerController: cc.Node,//玩家容器
        magicFaceController: cc.Node,//魔法表情控制

        itemFacePrefab:{//表情按钮预制
            default:null,
            type:cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

     //设置魔法表情面板
     setMagicPanel(targetID) {
        cc.log("设置魔法表情面板:",targetID);

        let info = UserInfo.getInfo();
        
        if (targetID) {
            let TexasMagicFaceController = this.magicFaceController.getComponent("TexasMagicFaceController");
            TexasMagicFaceController._checkIsSameUser(targetID);
            
            this.scontent.destroyAllChildren(false);

            for (let i=1; i<=6; i++) {
                let facePrefab = cc.instantiate(this.itemFacePrefab);
                this.scontent.addChild(facePrefab);           
                let magicFace = facePrefab.getComponent("texasMagicFaceItem");
                magicFace.createMagicFace(this,i,targetID);
            }

            if (TexasUtils._getSkin(["c"])) {
                this.scontent.active = info.nUserID!=targetID?true:false;
            }

        }
    },

    //魔法表情控制
    _getMagicFaceController() {
        let TexasMagicFaceController = this.magicFaceController.getComponent("TexasMagicFaceController");
        return TexasMagicFaceController;
    },

    //获得玩家服务端座位
    _getSitId(nUserid) {
        cc.log("获得玩家服务端座位:",nUserid);

        let TexasPlayerController = this.playerController.getComponent("TexasPlayerController");
        let targetSitId = TexasPlayerController._getSitId("nUserId",nUserid);
        return targetSitId;
    },

});
