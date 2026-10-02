// 扫码功能
cc.Class({
    extends: cc.Component,

    properties: {
        cameraSprite: { type: cc.Sprite, default: null },
        resultLabel: { type: cc.Label, default: null },
        scanFrame: { type: cc.Node, default: null },
        safeMask: { type: cc.Node, default: null },
        scanAreaSize: { type: cc.Size, default: cc.size(300, 300) },
        scanBtn: { type: cc.Button, default: null }
    },

    onLoad: function () {
        // 初始化变量
        this.video = null;
        this.canvas = null;
        this.middleCanvas = null;
        this.ctx = null;
        this.middleCtx = null;
        this.scanning = false;
        this.jsQR = null;
        this.texture = new cc.Texture2D();
        this.spriteFrame = new cc.SpriteFrame();
        this.isVideoReady = false; // 视频是否已显示的标记

        // 初始化UI
        this.initResultLabel();
        this.initOtherUI();
        this.initCanvases();

        // 加载扫码库
        // this.updateResultLabel("加载扫码功能中...");
        this.loadJsQR(() => {
            // this.updateResultLabel("点击开始扫码");
            this.scanBtn.node.active = true; // 扫码按钮
        });
    },

    // 初始化结果标签
    initResultLabel: function () {
        if (!this.resultLabel) {
            let labelNode = new cc.Node("ResultLabel");
            this.resultLabel = labelNode.addComponent(cc.Label);
            labelNode.parent = this.node;
            console.warn("未绑定resultLabel，已自动创建");
        }
        this.resultLabel.node.active = true;
        // this.resultLabel.node.zIndex = 100;
        // this.resultLabel.node.position = cc.v2(0, -cc.winSize.height/2 + 50);
        // this.resultLabel.fontSize = 24;
        // this.resultLabel.color = cc.Color.WHITE;
        // this.resultLabel.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
    },

    // 初始化其他UI
    initOtherUI: function () {
        // 摄像头精灵
        if (this.cameraSprite) {
            this.cameraSprite.node.active = true;
            this.cameraSprite.node.zIndex = 10;
            this.cameraSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        }

        // 安全底
        if (this.safeMask) {
            // this.safeMask.active = true;
            this.safeMask.zIndex = 9;
            this.safeMask.color = cc.Color.BLACK;
            this.safeMask.opacity = 180;
            this.safeMask.width = cc.winSize.width;
            this.safeMask.height = cc.winSize.height;
        }

        // 扫描框（初始隐藏）
        if (this.scanFrame) {
            this.scanFrame.active = false; // 初始不显示
            this.scanFrame.zIndex = 30;
            this.scanFrame.width = this.scanAreaSize.width;
            this.scanFrame.height = 4;
        }
    },

    // 更新标签文字
    updateResultLabel: function (text) {
        if (this.resultLabel) {
            this.resultLabel.string = text;
            // this.resultLabel.node.getComponent(cc.Label).string = text;
            // this.resultLabel._forceUpdateRenderData();
            console.log("标签更新: ", text);
        }
    },

    // 加载jsQR库
    loadJsQR: function (onLoaded) {
        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
        script.onload = function () {
            this.jsQR = window.jsQR;
            onLoaded && onLoaded();
        }.bind(this);
        script.onerror = () => {
            this.updateResultLabel("扫码库加载失败");
        };
        document.head.appendChild(script);
    },

    // 开始扫码
    startScan: function () {
        if (!this.jsQR) {
            this.updateResultLabel("扫码库未就绪");
            return;
        }
        this.isVideoReady = false; // 重置视频就绪状态
        
        this.setupCamera();
        // 此时不启动动画，等待视频就绪后再启动
        this.safeMask.active = true;
        this.cameraSprite.node.active = true;
    },

    // 初始化画布
    initCanvases: function () {
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        }
        if (!this.middleCanvas) {
            this.middleCanvas = document.createElement('canvas');
            this.middleCtx = this.middleCanvas.getContext('2d');
        }
    },

    // 启动摄像头
    setupCamera: function () {
        var that = this;
        navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: 640, height: 480 }
        }).then(function (stream) {
            that.video = document.createElement('video');
            that.video.srcObject = stream;
            that.video.playsInline = true;
            that.video.autoplay = true;

            that.video.onloadedmetadata = function () {
                var w = that.video.videoWidth;
                var h = that.video.videoHeight;
                that.middleCanvas.width = w;
                that.middleCanvas.height = h;
                that.canvas.width = w;
                that.canvas.height = h;

                // 初始化纹理和精灵
                that.initTextureAndSprite();
                that.scanning = true;
                that.startRefreshLoop();
                that.startScanLoop();
                that.updateResultLabel("准备中...");
            };
        }).catch(function (err) {
            that.updateResultLabel("请允许摄像头权限");
            console.error("摄像头错误: ", err);
            that.onScanCompleted("");
        });
    },

    // 初始化纹理和精灵
    initTextureAndSprite: function () {
        this.texture.initWithElement(this.middleCanvas);
        this.texture.handleLoadedTexture();
        this.spriteFrame.setTexture(this.texture);
        this.spriteFrame.setRect(cc.rect(0, 0, this.middleCanvas.width, this.middleCanvas.height));
        this.cameraSprite.spriteFrame = this.spriteFrame;

        var scale = Math.min(cc.winSize.width / this.middleCanvas.width, cc.winSize.height / this.middleCanvas.height);
        this.cameraSprite.node.scale = scale;
    },

    // 画面刷新循环（关键：检测视频是否就绪）
    startRefreshLoop: function () {
        var that = this;
        function refresh() {
            if (!that.scanning || !that.video) return;

            // 绘制视频帧到中间画布
            that.middleCtx.drawImage(that.video, 0, 0, that.middleCanvas.width, that.middleCanvas.height);
            
            // 刷新纹理
            that.texture.initWithElement(this.middleCanvas);
            that.texture.handleLoadedTexture();
            that.spriteFrame.setTexture(that.texture);
            that.cameraSprite.spriteFrame = that.spriteFrame;

            // 检测视频是否已显示（首次绘制成功后启动动画）
            if (!that.isVideoReady) {
                // 通过检查中间画布是否有内容判断视频是否显示
                const imageData = that.middleCtx.getImageData(0, 0, 1, 1).data;
                if (imageData[0] + imageData[1] + imageData[2] > 0) { // 非全黑帧
                    that.isVideoReady = true;
                    that.onVideoReady(); // 视频就绪，启动动画
                }
            }

            requestAnimationFrame(refresh);
        }
        refresh();
    },

    // 视频就绪后执行（启动扫描动画）
    onVideoReady: function () {
        this.updateResultLabel("对准二维码扫描...");
        if (this.scanFrame) {
            this.scanFrame.active = true; // 显示扫描框
            this.scanAreaSize = cc.size(this.cameraSprite.node.width, this.cameraSprite.node.height);
            this.startScanAnimation(); // 启动动画
        }
    },

    // 扫描动画
    startScanAnimation: function () {
        // 扫描线从顶部移动到底部，循环往复
        this.scanFrame.y = this.scanAreaSize.height / 2; // 起始位置（顶部）
        const moveDown = cc.moveTo(2, 0, -this.scanAreaSize.height / 2); // 下移到顶部
        const moveUp = cc.moveTo(2, 0, this.scanAreaSize.height / 2); // 上移到顶部
        this.scanFrame.runAction(cc.repeatForever(cc.sequence(moveDown, moveUp)));
    },

    // 扫码识别循环
    startScanLoop: function () {
        var that = this;
        function scan() {
            if (!that.scanning || !that.video) return;
            that.ctx.drawImage(that.video, 0, 0, that.canvas.width, that.canvas.height);
            var imageData = that.ctx.getImageData(0, 0, that.canvas.width, that.canvas.height);
            var code = that.jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'auto' });
            if (code) {
                that.onScanCompleted(code.data);
            }
            requestAnimationFrame(scan);
        }
        scan();
    },

    // 扫描完成
    onScanCompleted: function (result) {
        this.scanning = false;
        this.updateResultLabel(result);
        if (this.scanFrame) {
            this.scanFrame.stopAllActions(); // 停止动画
        }
        this.stopCamera();
        // setTimeout(() => this.closeView(), 1500);
        this.scanFrame.active = false; // 隐藏扫描框
        this.safeMask.active = false; // 隐藏安全底
        this.cameraSprite.node.active = false; // 隐藏摄像头画面
    },

    // 关闭视图
    closeView: function () {
        this.node.active = false;
    },

    // 停止摄像头
    stopCamera: function () {
        if (this.video && this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
            this.video = null;
        }
    },

    onDestroy: function () {
        this.scanning = false;
        this.stopCamera();
    }
});