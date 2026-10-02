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
        this.isVideoReady = false;

        // 预初始化画布（TG WebView 兼容）
        this.initCanvases(true);

        // 初始化UI
        this.initResultLabel();
        this.initOtherUI();

        // 【关键修复】兼容只读的 mediaDevices，移除直接赋值
        this.checkMediaDeviceSupport();

        // 加载扫码库
        this.loadJsQR(() => {
            // this.scanBtn.node.active = true;
        });
    },

    // 画布初始化（支持强制创建+全局挂载）
    initCanvases: function (forceInit) {
        // 识别画布（全局挂载，避免TG WebView回收）
        if (!this.canvas || forceInit) {
            this.canvas = window.__scanCanvas || document.createElement('canvas');
            window.__scanCanvas = this.canvas;
            this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
            if (!this.ctx) {
                this.canvas = document.createElement('canvas');
                window.__scanCanvas = this.canvas;
                this.ctx = this.canvas.getContext('2d');
                console.warn("画布创建重试");
            }
        }

        // 中间画布（全局挂载）
        if (!this.middleCanvas || forceInit) {
            this.middleCanvas = window.__middleScanCanvas || document.createElement('canvas');
            window.__middleScanCanvas = this.middleCanvas;
            this.middleCtx = this.middleCanvas.getContext('2d');
            if (!this.middleCtx) {
                this.middleCanvas = document.createElement('canvas');
                window.__middleScanCanvas = this.middleCanvas;
                this.middleCtx = this.middleCanvas.getContext('2d');
                console.warn("中间画布创建重试");
            }
        }

        console.log("画布初始化状态：", {
            canvas: !!this.canvas,
            ctx: !!this.ctx,
            middleCanvas: !!this.middleCanvas,
            middleCtx: !!this.middleCtx
        });
    },

    // 【核心修复】mediaDevices 只读属性兼容
    checkMediaDeviceSupport: function () {
        // 1. 不修改只读属性，直接使用原有 mediaDevices（若存在）
        const mediaDevices = navigator.mediaDevices;

        // 2. 若浏览器不支持 mediaDevices（旧版），直接提示不兼容
        if (!mediaDevices) {
            this.updateResultLabel("浏览器不支持摄像头访问");
            console.error("mediaDevices 未定义，浏览器不兼容");
            return;
        }

        // 3. 若支持 mediaDevices，但无 getUserMedia 方法（极少数情况），适配旧版API
        if (!mediaDevices.getUserMedia) {
            // 不修改原 mediaDevices，而是创建临时适配函数
            const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            if (!getUserMedia) {
                this.updateResultLabel("浏览器不支持摄像头访问");
                console.error("无可用的 getUserMedia API");
                return;
            }
            // 重写 mediaDevices.getUserMedia（通过原型链，避免直接赋值）
            mediaDevices.getUserMedia = function (constraints) {
                return new Promise(function (resolve, reject) {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });
            };
        }

        // 4. HTTPS 检测
        if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
            this.updateResultLabel("请在HTTPS环境下使用");
            console.error("非HTTPS环境，禁止访问摄像头");
        }
    },

    // 初始化结果标签
    initResultLabel: function () {
        if (!this.resultLabel) {
            let labelNode = new cc.Node("ResultLabel");
            this.resultLabel = labelNode.addComponent(cc.Label);
            labelNode.parent = this.node;
            labelNode.zIndex = 100;
            labelNode.position = cc.v2(0, -cc.winSize.height/2 + 50);
            this.resultLabel.fontSize = 24;
            this.resultLabel.color = cc.Color.WHITE;
            console.warn("未绑定resultLabel，已自动创建");
        }
        this.resultLabel.node.active = true;
    },

    // 初始化其他UI
    initOtherUI: function () {
        if (this.cameraSprite) {
            this.cameraSprite.node.active = false;
            this.cameraSprite.node.zIndex = 10;
            this.cameraSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        }
        if (this.safeMask) {
            this.safeMask.active = false;
            this.safeMask.zIndex = 9;
            this.safeMask.color = cc.Color.BLACK;
            this.safeMask.opacity = 180;
            this.safeMask.width = cc.winSize.width;
            this.safeMask.height = cc.winSize.height;
        }
        if (this.scanFrame) {
            this.scanFrame.active = false;
            this.scanFrame.zIndex = 30;
            this.scanFrame.width = this.scanAreaSize.width;
            this.scanFrame.height = 4;
        }
        if (this.scanBtn) {
            this.scanBtn.node.active = false;
        }
    },

    // 更新标签文字
    updateResultLabel: function (text) {
        if (this.resultLabel) {
            this.resultLabel.string = text;
            this.resultLabel._forceUpdateRenderData();
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
            if (this.scanBtn) this.scanBtn.node.active = false;
        };
        document.head.appendChild(script);
    },

    // 开始扫码
    startScan: function () {
        if (!this.jsQR) {
            this.updateResultLabel("扫码库未就绪");
            return;
        }
        // 再次初始化画布（防止被回收）
        this.initCanvases(false);
        this.isVideoReady = false;
        this.setupCamera();
        this.safeMask.active = true;
        this.cameraSprite.node.active = true;
    },

    // 启动摄像头（强制后置失败切前置）
    setupCamera: function () {
        var that = this;
        // 优先使用后置摄像头
        var backCameraConstraints = {
            video: {
                facingMode: { ideal: 'environment', exact: 'environment' },
                width: { ideal: 640 },
                height: { ideal: 480 },
                frameRate: { ideal: 15 }
            }
        };

        // 直接使用 navigator.mediaDevices（已在 checkMediaDeviceSupport 中兼容）
        navigator.mediaDevices.getUserMedia(backCameraConstraints)
        .then(function (stream) {
            that.initVideoStream(stream, "对准二维码扫描...");
        })
        .catch(function (err) {
            // 强制后置失败，切换前置
            if (err.name === 'OverconstrainedError' || err.name === 'NotFoundError') {
                console.warn("强制后置失败，切换前置", err);
                var frontCameraConstraints = {
                    video: {
                        facingMode: 'user',
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        frameRate: { ideal: 15 }
                    }
                };
                return navigator.mediaDevices.getUserMedia(frontCameraConstraints);
            }
            throw err;
        })
        .then(function (stream) {
            that.initVideoStream(stream, "后置不可用，已切换前置");
        })
        .catch(function (err) {
            // 错误分类提示
            if (err.name === 'NotAllowedError') {
                that.updateResultLabel("请授予摄像头权限");
            } else if (err.name === 'NotFoundError') {
                that.updateResultLabel("未检测到摄像头");
            } else if (err.name === 'NotSupportedError') {
                that.updateResultLabel("浏览器不支持摄像头");
            } else {
                that.updateResultLabel("摄像头访问失败");
            }
            console.error("摄像头错误: ", err);
            that.onScanCompleted("");
        });
    },

    // 初始化视频流
    initVideoStream: function (stream, tipText) {
        var that = this;
        that.video = document.createElement('video');
        that.video.srcObject = stream;
        // iOS/TG WebView 关键配置
        that.video.playsInline = true;
        that.video.setAttribute('webkit-playsinline', 'true');
        that.video.autoplay = true;
        that.video.muted = true;

        that.video.onloadedmetadata = function () {
            // 确认画布存在
            if (!that.canvas || !that.middleCanvas) {
                that.initCanvases(true);
            }

            var w = that.video.videoWidth || 640;
            var h = that.video.videoHeight || 480;
            // 强制设置画布尺寸
            that.canvas.width = w;
            that.canvas.height = h;
            that.middleCanvas.width = w;
            that.middleCanvas.height = h;

            that.initTextureAndSprite();
            that.scanning = true;
            that.startRefreshLoop();
            that.startScanLoop();
            that.updateResultLabel(tipText);
        };

        that.video.onerror = function (e) {
            that.updateResultLabel("视频加载失败");
            console.error("视频错误: ", e);
            that.onScanCompleted("");
        };
    },

    // 初始化纹理和精灵
    initTextureAndSprite: function () {
        if (!this.middleCanvas || !this.texture) {
            console.error("初始化失败：画布或纹理未定义");
            this.updateResultLabel("初始化失败");
            return;
        }
        this.texture.initWithElement(this.middleCanvas);
        this.texture.handleLoadedTexture();
        this.spriteFrame.setTexture(this.texture);
        this.spriteFrame.setRect(cc.rect(0, 0, this.middleCanvas.width, this.middleCanvas.height));
        this.cameraSprite.spriteFrame = this.spriteFrame;

        var scale = Math.min(
            cc.winSize.width / this.middleCanvas.width,
            cc.winSize.height / this.middleCanvas.height
        );
        this.cameraSprite.node.scale = scale;
        this.cameraSprite.node.position = cc.v2(0, 0);
    },

    // 画面刷新循环（TG WebView 兼容）
    startRefreshLoop: function () {
        var that = this;
        function refresh() {
            if (!that.scanning || !that.video || !that.middleCanvas || !that.middleCtx) {
                requestAnimationFrame(refresh);
                return;
            }

            try {
                // 绘制视频帧
                that.middleCtx.drawImage(that.video, 0, 0, that.middleCanvas.width, that.middleCanvas.height);
                
                // 刷新纹理
                that.texture.initWithElement(that.middleCanvas);
                that.texture.handleLoadedTexture();
                that.spriteFrame.setTexture(that.texture);
                that.cameraSprite.spriteFrame = that.spriteFrame;

                // 检测视频就绪
                if (!that.isVideoReady) {
                    const imageData = that.middleCtx.getImageData(0, 0, 1, 1).data;
                    if (imageData[0] + imageData[1] + imageData[2] > 0) {
                        that.isVideoReady = true;
                        that.onVideoReady();
                    }
                }
            } catch (e) {
                console.warn("刷新循环异常: ", e);
            }

            requestAnimationFrame(refresh);
        }
        refresh();
    },

    // 视频就绪启动动画
    onVideoReady: function () {
        if (this.scanFrame) {
            this.scanFrame.active = true;
            this.scanAreaSize.width = this.cameraSprite.node.width;
            this.scanAreaSize.height = this.cameraSprite.node.height;
            this.scanFrame.width = this.scanAreaSize.width;
            this.startScanAnimation();
        }
    },

    // 扫描动画
    startScanAnimation: function () {
        if (!this.scanFrame) return;
        this.scanFrame.y = this.scanAreaSize.height / 2;
        const moveDown = cc.moveTo(2, 0, -this.scanAreaSize.height / 2);
        const moveUp = cc.moveTo(2, 0, this.scanAreaSize.height / 2);
        this.scanFrame.runAction(cc.repeatForever(cc.sequence(moveDown, moveUp)));
    },

    // 扫码识别循环
    startScanLoop: function () {
        var that = this;
        function scan() {
            if (!that.scanning || !that.video || !that.canvas || !that.ctx || !that.jsQR) {
                requestAnimationFrame(scan);
                return;
            }

            try {
                that.ctx.drawImage(that.video, 0, 0, that.canvas.width, that.canvas.height);
                var imageData = that.ctx.getImageData(0, 0, that.canvas.width, that.canvas.height);
                var code = that.jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'auto' });
                if (code) {
                    that.onScanCompleted(code.data);
                }
            } catch (e) {
                console.warn("扫码循环异常: ", e);
            }

            requestAnimationFrame(scan);
        }
        scan();
    },

    // 扫描完成
    onScanCompleted: function (result) {
        this.scanning = false;
        this.updateResultLabel(result || "扫描失败");
        if (this.scanFrame) {
            this.scanFrame.stopAllActions();
            this.scanFrame.active = false;
        }
        this.safeMask.active = false;
        this.cameraSprite.node.active = false;
        this.stopCamera();
        if (this.scanBtn) this.scanBtn.node.active = true;
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