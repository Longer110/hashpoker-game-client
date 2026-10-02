cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    createMenuItem:function(helpControl,keyMatchArry,key,name,zhAtlas,unZhAtlas){
        this.helpControl = helpControl;

        let index = -1;
        for (let i=0; i<keyMatchArry.length; i++) {
            let keyMatchItem = keyMatchArry[i];

            if (keyMatchItem.key==String(key)) {
                index = keyMatchItem.data;
                
                break;
            }
        }

        if (index>=0) {
            //构造按钮
            
            let Btn_light = this.node.getChildByName("Btn_light");
            let Label_light = Btn_light.getChildByName("Label_light");
            let Btn_dark = this.node.getChildByName("Btn_dark");
            let Label_dark = Btn_dark.getChildByName("Label_dark");

            let menuStrArry = ["btn_dark","dark_"+index,"btn_light","light_"+index];
            for (let j=0; j<menuStrArry.length; j++) {
                let selectAtlas = unZhAtlas;
                let curSprite = Btn_dark;
                if (j==1) {
                    selectAtlas = zhAtlas;
                    curSprite = Label_dark;
                }else if (j==2) {
                    selectAtlas = unZhAtlas;
                    curSprite = Btn_light;
                }else if(j==3) {
                    selectAtlas = zhAtlas;
                    curSprite = Label_light;
                }
                let imgCard = menuStrArry[j];
                let frame = selectAtlas.getSpriteFrame(imgCard);
                if(null!=frame){
                    curSprite.getComponent(cc.Sprite).spriteFrame = frame;
                }
            }

            if (name=="zhajinhua") {
                if (index==1) {
                    Label_light.x = Label_dark.x = app.config.LANG == "vi"?-5:0;
                }else if(index==2) {
                    Label_light.x = Label_dark.x = app.config.LANG == "vi"?-20:0;
                }else if(index==3) {
                    Label_light.x = Label_dark.x = app.config.LANG == "vi"?-3:0;
                }
            }

            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node; 
            clickEventHandler.component = "TexasHelpPanelMenuItem";
            clickEventHandler.handler = "onClickBtnMenu";
            clickEventHandler.customEventData = index;
            
            let button = this.node.getComponent(cc.Button);
            button.clickEvents.push(clickEventHandler);


            let toggle = this.node.getComponent(cc.Toggle);
            if (toggle && toggle.isChecked) {
                if(Btn_dark){
                    Btn_dark.active = false
                }
                if(Btn_light){
                    Btn_light.active = true
                }
            }else{
                if(Btn_dark){
                    Btn_dark.active = true
                }
                if(Btn_light){
                    Btn_light.active = false
                }
            }
            
        }else {
            cc.error("------------------------错误信息:帮助菜单数据不存在 index=:" + index + "------------------------");
        }
    },

    //菜单按钮响应
    onClickBtnMenu(event, customEventData) {

        let Btn_light = this.node.getChildByName("Btn_light");
        let Btn_dark = this.node.getChildByName("Btn_dark");
        let toggle = this.node.getComponent(cc.Toggle);
        
        if(this.helpControl.currentMenuToggle){
            let Btn_light_1 = this.helpControl.currentMenuToggle.node.getChildByName("Btn_light")
            let Btn_dark_1 = this.helpControl.currentMenuToggle.node.getChildByName("Btn_dark")

            if(Btn_light_1){
                Btn_light_1.active = false
            }
            if(Btn_dark_1){
                Btn_dark_1.active = true
            }
        }

        if (toggle) {
            if(Btn_dark){
                Btn_dark.active = false
            }
            if(Btn_light){
                Btn_light.active = true
            }
        }else{
            if(Btn_dark){
                Btn_dark.active = true
            }
            if(Btn_light){
                Btn_light.active = false
            }
        }

        this.helpControl.currentMenuToggle = toggle
        if (this.helpControl && this.helpControl._isCanClickItem) {
            let event = "toggle" + customEventData;

            this.helpControl.onClickToggle(event,customEventData);
        }

    },


});
