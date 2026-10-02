// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let _circlepoints =[];
function _calculateCircle (center, radius, segements) {
    _circlepoints.length = 0;
    let anglePerStep = Math.PI * 2 / segements;
    for (let step = 0; step < segements; ++step) {
        _circlepoints.push(cc.v2(radius.x * Math.cos(anglePerStep * step) + center.x,
            radius.y * Math.sin(anglePerStep * step) + center.y));
    }

    return _circlepoints;
}

let MaskType = cc.Enum({
    /**
     * !#en Rect mask.
     * !#zh 使用矩形作为遮罩
     * @property {Number} RECT
     */
    RECT: 0,
});

cc.Class({
    extends: cc.Mask,

    properties: {
        
        materials: {
            get () {
                return this._materials;
            },
            set (val) {
                this._materials = val;
                this._activateMaterial();
            },
            type: [cc.Material],
            displayName: 'Materials',
            animatable: false,
            override: true,
            visible:false,
        },

        _type: MaskType.RECT,
        type: {
            get: function () {
                return this._type;
            },
            set: function (value) {
                if (this._type !== value) {
                    this._resetAssembler();
                }
                this._type = value;
                this._updateGraphics();
                this._activateMaterial();
            },
            type: MaskType,
            tooltip: CC_DEV && 'i18n:COMPONENT.mask.type',
            override: true,
            visible:false,
        },

        spriteFrame: {
            type: cc.SpriteFrame,
            tooltip: CC_DEV && 'i18n:COMPONENT.mask.spriteFrame',
            override: true,
            visible:false,
            get: function () {
                return this._spriteFrame;
            },
            set: function (value) {
                let lastSprite = this._spriteFrame;
                if (CC_EDITOR) {
                    if ((lastSprite && lastSprite._uuid) === (value && value._uuid)) {
                        return;
                    }
                }
                else {
                    if (lastSprite === value) {
                        return;
                    }
                }
                this._spriteFrame = value;
                this.setVertsDirty();
                this._updateMaterial();
            },
        },

        alphaThreshold: {
            default: 0.1,
            type: cc.Float,
            range: [0, 1, 0.1],
            slide: true,
            tooltip: CC_DEV && 'i18n:COMPONENT.mask.alphaThreshold',
            override: true,
            visible:false,
            notify: function () {
                if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
                    cc.warnID(4201);
                    return;
                }
                this._updateMaterial();
            }
        },

        _segments: 64,
        segements: {
            get: function () {
                return this._segments;
            },
            set: function (value) {
                this._segments = misc.clampf(value, SEGEMENTS_MIN, SEGEMENTS_MAX);
                this._updateGraphics();
            },
            type: cc.Integer,
            tooltip: CC_DEV && 'i18n:COMPONENT.mask.segements',
            override: true,
            visible:false,
        },


        /** 圆角半径 */
        _radius: 30,
        radius: {
            get: function () {
                return this._radius;
            },
            set: function (value) {
                this._radius = value
                if (this._type == cc.Mask.Type.RECT) {
                    this._updateGraphics();
                }
            },
            type: cc.Integer,
            tooltip:'圆角半径',
        },
        isFillet: {
            default: false,
            type: cc.Boolean,
            tooltip: '开启圆角',
            notify: function () {
                if (this._type == cc.Mask.Type.RECT) {
                    this._updateGraphics();
                }
            }
        },  
    },

    _updateGraphics () {
        if(this._type === cc.Mask.Type.RECT) {
            let node = this.node;
            let graphics = this._graphics;
            graphics.clear(false);
            let width = node._contentSize.width;
            let height = node._contentSize.height;
            let x = -width * node._anchorPoint.x;
            let y = -height * node._anchorPoint.y;
            if(this.isFillet){
                graphics.roundRect(x, y, width, height, this.radius);
            }else{
                graphics.rect(x, y, width, height);
            }
            if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
                graphics.stroke();
            }
            else {
                graphics.fill();
            }
        }else{
            this._super();
        }
    },

});
