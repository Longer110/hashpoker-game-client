// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        _canvas: null,
        targetNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.init();
    },

    start() {

    },

    init() {
        let texture = new cc.RenderTexture();
        let gl = cc.game._renderContext;
        texture.initWithSize(this.node.width, this.node.height, gl.STENCIL_INDEX8);
        this.camera = this.node.addComponent(cc.Camera);
        this.camera.targetTexture = texture;
        this.texture = texture;
    },

    // create the img element
    initImage() {
        // return the type and dataUrl
        var dataURL = this._canvas.toDataURL("image/png");
        var img = document.createElement("img");
        img.src = dataURL;
        return img;
    },

    // create the canvas and context, filpY the image Data
    createSprite() {
        let nodeCamera = new cc.Node();
        nodeCamera.parent = cc.find("Canvas");
        let camera = nodeCamera.addComponent(cc.Camera);

        let width = this.targetNode.width;
        let height = this.targetNode.height;

        let texture = new cc.RenderTexture();
        texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height, cc.gfx.RB_FMT_S8);

        camera.targetTexture = texture;

        if (!this._canvas) {
            this._canvas = document.createElement('canvas');
            this._canvas.width = width;
            this._canvas.height = height;
        } else {
            this.clearCanvas();
        }

        let ctx = this._canvas.getContext('2d');
        camera.render();

        // 指定需要读取的区域的像素
        let size = this.targetNode.getContentSize();
        let pixels = new Uint8Array(size.width * size.height * 4);
        let x = texture.width / 2 - this.targetNode.width / 2;
        let y = texture.height / 2 - this.targetNode.height / 2;
        let w = this.targetNode.width;
        let h = this.targetNode.height;
        let data = texture.readPixels(pixels, x, y, w, h);

        // write the render data
        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let imageData = ctx.createImageData(width, 1);
            let start = srow * width * 4;
            for (let i = 0; i < rowBytes; i++) {
                imageData.data[i] = data[start + i];
            }

            ctx.putImageData(imageData, 0, row);
        }

        return this._canvas;
    },

    getTargetArea() {
        let targetPos = this.targetNode.convertToWorldSpaceAR(cc.v2(0, 0))
        let y = cc.winSize.height - targetPos.y - this.targetNode.height / 2;
        let x = cc.winSize.width - targetPos.x - this.targetNode.width / 2;
        return {
            x,
            y
        }
    },




    //截图保存无法设置，直接分享文字
    downloadImg(text) {

        let ShareUtil = require("ShareUtil");
        setTimeout(async () => {
            ShareUtil.shareToTelegram(null, text)
        })



        return

        // 先生成画布内容
        this.createSprite();

        // 优先使用 canvas.toBlob -> objectURL 的方式
        let canvas = this._canvas;
        if (!canvas) return;

        // 检测 Telegram 内嵌或常见受限环境
        let ua = (navigator && navigator.userAgent) ? navigator.userAgent : "";
        let isTelegramWebview = ua.indexOf("Telegram") !== -1 || !!(window.Telegram && window.Telegram.WebApp);

        // 尝试使用 toBlob（推荐）
        if (canvas.toBlob) {
            canvas.toBlob((blob) => {
                if (!blob) {
                    // 兜底：直接展示图片供长按保存
                    let img = this.initImage();
                    this.showFullscreenImage(img);
                    return;
                }

                // 如果是在受限 WebView（如 Telegram）中，直接展示大图让用户长按保存
                if (isTelegramWebview) {
                    let img = this.initImage(); // 生成 img 元素（dataURL）
                    this.showFullscreenImage(img);
                    return;
                }

                // 普通浏览器：用 objectURL + a.download 尝试下载
                let url = URL.createObjectURL(blob);
                let a = document.createElement("a");
                a.href = url;
                a.download = `screenshot_node_${Date.now()}.png`;
                // 尽量在用户手势上下文触发，若不是用户手势，某些浏览器会阻止弹出
                document.body.appendChild(a);
                try {
                    a.click();
                } catch (e) {
                    // 如果 click 被拦截，改为在新窗口打开，用户手动保存
                    window.open(url, '_blank');
                }
                setTimeout(() => {
                    z``
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 1000);
            }, 'image/png');
            return;
        }

        // toBlob 不支持时回退为 dataURL -> 展示大图或尝试下载
        try {
            let dataURL = canvas.toDataURL("image/png");
            if (isTelegramWebview) {
                let img = document.createElement("img");
                img.src = dataURL;
                this.showFullscreenImage(img);
                return;
            }

            let a = document.createElement("a");
            a.href = dataURL;
            a.download = `screenshot_node_${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (e) {
            // 最后兜底：展示大图
            let img = this.initImage();
            this.showFullscreenImage(img);
        }
    },

    // 在页面中以全屏弹窗展示图片，提示用户“长按保存”
    showFullscreenImage(imgElement) {
        // 创建遮罩
        let overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.left = 0;
        overlay.style.top = 0;
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0,0,0,0.9)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = 999999;
        overlay.style.flexDirection = 'column';

        // 配置图片元素
        imgElement.style.maxWidth = '95%';
        imgElement.style.maxHeight = '80%';
        imgElement.style.borderRadius = '6px';
        imgElement.style.boxShadow = '0 2px 12px rgba(0,0,0,0.5)';
        overlay.appendChild(imgElement);

        // 提示文案（中文）
        let tip = document.createElement('div');
        tip.innerText = '长按图片保存到手机';
        tip.style.color = '#fff';
        tip.style.marginTop = '12px';
        tip.style.fontSize = '14px';
        overlay.appendChild(tip);

        // 点击或触摸任意位置关闭
        overlay.addEventListener('click', () => {
            document.body.removeChild(overlay);
        }, { once: true });

        document.body.appendChild(overlay);

    },

    // show on the canvas
    showSprite(img) {
        let y = this.getTargetArea().y;
        let x = this.getTargetArea().x;
        let rect = new cc.Rect(x, y, 770, 800)
        let texture = new cc.Texture2D();
        texture.initWithElement(img);

        let spriteFrame = new cc.SpriteFrame();
        spriteFrame.setTexture(texture);
        spriteFrame.setRect(rect)

        let node = new cc.Node();
        let sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = spriteFrame;

        node.zIndex = cc.macro.MAX_ZINDEX;
        node.parent = cc.director.getScene();
        // set position
        let width = cc.winSize.width;
        let height = cc.winSize.height;
        node.x = width / 2;
        node.y = height / 2;
        node.on(cc.Node.EventType.TOUCH_START, () => {
            node.parent = null;
            node.destroy();
        });
        this.captureAction(node, width, height);
    },

    // sprite action
    captureAction(capture, width, height) {
        let scaleAction = cc.scaleTo(1, 0.3);
        let targetPos = cc.v2(width - width / 6, height / 4);
        let moveAction = cc.moveTo(1, targetPos);
        let spawn = cc.spawn(scaleAction, moveAction);

        let finished = cc.callFunc(() => {
            capture.destroy();
        })
        let action = cc.sequence(spawn, finished);
        capture.runAction(action);
    },

    clearCanvas() {
        let ctx = this._canvas.getContext('2d');
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    },

    // update (dt) {},
});
