cc.Class({
    extends: cc.Label,

    properties: {
        
        _softness:0.0625,
        softness: {
            tooltip: '字体整体柔和度',
            visible:true,
            type: cc.Float,
            get: function () {
                return this._softness;
            },
            set: function (value) {
                this._softness = value;
                this._refresh();
            }
        },
        _useOutline:false,
        useOutline: {
            tooltip: '描边开关',
            visible:true,
            type: cc.Boolean,
            get: function () {
                return this._useOutline;
            },
            set: function (value) {
                this._useOutline = value;
                this._refresh();
            }
        },
        _outlineColor: cc.Color.BLACK,
        outlineColor: {
            tooltip: '描边颜色',
            visible:true,
            type: cc.Color,
            get: function () {
                return this._outlineColor;
            },
            set: function (value) {
                this._outlineColor = value;
                this._refresh();
            }
        },

        _outlineThickness: 1,
        outlineThickness: {
            tooltip: '描边厚度',
            visible:true,
            type: cc.Integer,
            get: function () {
                return this._outlineThickness;
            },
            set: function (value) {
                this._outlineThickness = value;
                this._refresh();
            }
        },

        _useShadow:false,
        useShadow: {
            tooltip: '阴影开关',
            visible:true,
            type: cc.Boolean,
            get: function () {
                return this._useShadow;
            },
            set: function (value) {
                this._useShadow = value;
                this._refresh();
            }
        },

        _shadowColor: cc.Color.BLACK,
        shadowColor: {
            tooltip: '阴影颜色',
            visible:true,
            type: cc.Color,
            get: function () {
                return this._shadowColor;
            },
            set: function (value) {
                this._shadowColor = value;
                this._refresh();
            }
        },

        _shadowOffset: cc.v2(-2, -2),
        shadowOffset: {
            tooltip: '阴影偏移',
            visible:true,
            type: cc.Vec2,
            get: function () {
                return this._shadowOffset;
            },
            set: function (value) {
                this._shadowOffset = value;
                this._refresh();
            }
        },

        _shadowSmoothing:0.05,
        shadowSmoothing: {
            tooltip: '阴影平滑度',
            visible:true,
            type: cc.Float,
            get: function () {
                return this._shadowSmoothing;
            },
            set: function (value) {
                this._shadowSmoothing = value;
                this._refresh();
            }
        },

    },

    onDestroy: function () {
        if (cc.sys.isMobile) {
            if(this._onResizedCallback){
                //window.removeEventListener('resize', this._onResizedCallback);
                this._onResizedCallback = null;
            }
        }
        else {
            //cc.view.off('canvas-resize', this._onResized);
        }
    },

    _onResized(){
        this._refresh();
    },

    onLoad () {
        this._super();
        this.useSystemFont = false;
        if (cc.sys.isMobile) {
            this._onResizedCallback = this._onResized.bind(this);
            //window.addEventListener('resize', this._onResizedCallback, false);
        }
        else {
            //cc.view.on('canvas-resize', this._onResized, this);
        }
        this._onResized();
    },

    onEnable() {
        this._super();
        this._refresh();
    },
    _refresh(){
        this._updateSDFMaterial();
    },

    _updateSDFMaterial() {
        let material = this.getMaterial(0);
        if ((undefined === material) || (null === material) || 0 !== material.name.search("default-SDF-label-materiall")) {
            if(window.app && app.UIAtlasLive && app.UIAtlasLive.getMsdfMetarial){
                material = app.UIAtlasLive.getMsdfMetarial();
                this.setMaterial(0, material);
            }
            else{
                cc.error("SpriteOutline._updateMaterial: You should use material default-SDF-label-materiall.");
                return;
            }
        }
        material.define("USE_COLOR", true, 0, true);
        material.setProperty("softness", this.softness);
        material.define("USE_OUTLINE", this.useOutline, 0, true);
        if (this.useOutline) {
            material.setProperty("outlineColor", this.outlineColor);
            material.setProperty("outlineThickness", 0.5 - this.outlineThickness * 0.05);
        }
        material.define("USE_SHADOW", this.useShadow, 0, true);
        if (this.useShadow) {
            material.setProperty("shadowColor", this.shadowColor);
            material.setProperty("shadowOffset", cc.v2(this.shadowOffset.x * 0.0006, this.shadowOffset.y * -0.0006));
            material.setProperty("shadowSmoothing", this.shadowSmoothing);
        }
        material.define("USE_PIXELSNAP", true, 0, true);
        let designSize = cc.view.getVisibleSizeInPixel();
        material.setProperty("screenSize", cc.v2(designSize.width,designSize.height));
  
    },

});