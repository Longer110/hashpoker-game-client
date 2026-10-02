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
        _material: null,
        _k: 1,
        _b: 1,
        _bMax: 1,
        _bMin: 0,
        _gray: false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._bMax = 0.5;
        this._bMin = 0;
        this._b = this._bMax;
    },

    start () {
        //获取材质
        // this._material = this.node.getComponent(cc.Sprite).getMaterial(0);
        this._material = this.node.getComponent(cc.Sprite).sharedMaterials[0];
        //设置参数k
        this._material.setProperty("k", this._k);
        this.setGray(this._gray);
    },

    update (dt) {
        if(this._gray){
            return;
        }

        if(this._material != null){
            //设置参数b
            this._material.setProperty("b", this._b);
            
            this._b -= dt/0.02*0.005;
            if(this._b < this._bMin){
                this._b = this._bMax;
            }
        }
    },

    setGray(gray){
        this._gray = gray;
        if(this._material){
            this._material.setProperty("gray", this._gray ? 1 : 0);
        }
        if(this._gray){
            this._b = this._bMax;
            this._material.setProperty("b", this._b);
        }
    }
});
