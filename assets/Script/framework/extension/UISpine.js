// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        spineChildResPath: "",
        _spine: sp.Skeleton,
        _bundle: null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    init(bundle){
        this._bundle = bundle;
    },
    start () {
        if(!this._bundle){
            let wrapper = my.game.getGame();
            if(wrapper){
                this._bundle = wrapper.bundle;
            }
        }
        if(!this._bundle){
            cc.error("UISpine", "bundle未设置");
            return;
        }
        if(this.spineChildResPath!=""){
            let self = this;
            this._bundle.load(this.spineChildResPath, cc.Prefab, function (error, prefab) {
                if (error) {
                     //console.error(error);
                    return;
                }

                if(!cc.isValid(self)){
                    return;
                }
                let node = cc.instantiate(prefab);
                self.node.addChild(node);
                node.position = cc.Vec2.ZERO;
                let spine = node.getComponent(sp.Skeleton);
                self._spine = spine;
            })
        }
    },

    // update (dt) {},
});
