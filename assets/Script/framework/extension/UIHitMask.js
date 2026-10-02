// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

// [[
//     * @Author:      mygame
//     * @DateTime:    2020-06-18 10:05:23
//     * @Description: UI 点击区域mask控件，目前支持 RECT、ELLIPSE 模式
// ]]

let Mat4 = cc.Mat4;
let Vec2 = cc.Vec2;
let Vec3 = cc.Vec3;

let _vec2_temp = new Vec2();
let _mat4_temp = new Mat4();

// _hitTest temp var
var _htVec3a = new Vec3();
var _htVec3b = new Vec3();

/**
 * !#en the type for mask.
 * !#zh 遮罩组件类型
 * @enum Mask.Type
 */
let MaskType = cc.Enum({
    /**
     * !#en Rect mask.
     * !#zh 使用矩形作为遮罩
     * @property {Number} RECT
     */
    RECT: 0,
    /**
     * !#en Ellipse Mask.
     * !#zh 使用椭圆作为遮罩
     * @property {Number} ELLIPSE
     */
    ELLIPSE: 1,
});

cc.Class({
    extends: cc.Component,

    properties: {
        maskTarget: {
            default: null,
            type: cc.Node,
            tooltip: "用于计算遮罩区域的对象",
        },

        /**
         * !#en The mask type.
         * !#zh 遮罩类型
         * @property type
         * @type {Mask.Type}
         * @example
         * mask.type = cc.Mask.Type.RECT;
         */
        _type: MaskType.RECT,
        type: {
            get: function () {
                return this._type;
            },
            set: function (value) {
                if (this._type !== value) {
                }

                this._type = value;
            },
            type: MaskType,
            tooltip: "遮罩类型",
        },
        
        /**
         * !#en Reverse mask (Not supported Canvas Mode)
         * !#zh 反向遮罩（不支持 Canvas 模式）
         * @property inverted
         * @type {Boolean}
         * @default false
         */
        inverted: {
            default: false,
            tooltip: "反向遮罩",
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(!this.node._hitTest_original){
            this.node._hitTest_original = this.node._hitTest;
            this.node._hitTest = this._hitTest.bind(this);
        }
    },
    onDestroy(){
        if(this.node._hitTest_original){
            this.node._hitTest = this.node._hitTest_original;
            this.node._hitTest_original = null;
        }
    },

    _hitTest(point, listener){
        let hit = false;
        if(this.node._hitTest_original){
            hit = this.node._hitTest_original(point, listener);
        }
        else{
            hit = this.node._hitTest(point, listener);
        }

        if(hit){
            let cameraPt = _htVec3a;
            let camera = cc.Camera.findCamera(this);
            if (camera) {
                camera.getScreenToWorldPoint(point, cameraPt);
            }
            else {
                cameraPt.set(point);
            }

            hit = this._hitMask(cameraPt);
        }

        return hit;
    },

    _hitMask(cameraPt){
        let node = this.maskTarget || this.node;
        let size = node.getContentSize(),
            w = size.width,
            h = size.height,
            testPt = _vec2_temp;
        
        node._updateWorldMatrix();
        // If scale is 0, it can't be hit.
        if (!Mat4.invert(_mat4_temp, node._worldMatrix)) {
            return false;
        }
        Vec2.transformMat4(testPt, cameraPt, _mat4_temp);
        testPt.x += node._anchorPoint.x * w;
        testPt.y += node._anchorPoint.y * h;

        let result = false;
        if (this.type === MaskType.RECT || this.type === MaskType.IMAGE_STENCIL) {
            result = testPt.x >= 0 && testPt.y >= 0 && testPt.x <= w && testPt.y <= h;
        }
        else if (this.type === MaskType.ELLIPSE) {
            let rx = w / 2, ry = h / 2;
            let px = testPt.x - 0.5 * w, py = testPt.y - 0.5 * h;
            result = px * px / (rx * rx) + py * py / (ry * ry) < 1;
        }
        if (this.inverted) {
            result = !result;
        }

        return result;
    }
});
