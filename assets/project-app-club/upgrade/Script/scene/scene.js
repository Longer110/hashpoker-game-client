// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

let EventManager = require("EventManager");
let target = EventManager.Target;
let event = EventManager.Event;
let SceneBase = require("SceneBase");
let i18n = require('i18n');

cc.Class({
    extends: cc.Component,

    properties: {
        progress: cc.ProgressBar,
        label_pro: cc.Label,
        tip: cc.Label,

        _curTime: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        my.target.on(my.event.LOAD_DOWNLOAD_PERCENT, this._onLoadDownloadPercent, this);
        my.target.on(my.event.LOAD_DOWNLOAD_SHOW, this._onLoadDownloadShow, this);
        this._applyHashPokerLaunchScene();
    },

    _applyHashPokerLaunchScene() {
        try {
            let scene = cc.director.getScene();
            let canvas = scene ? scene.getChildByName('Canvas') : null;
            if (!canvas) return;
            let bgName = '_tech_fullscreen_bg_';
            let oldFull = canvas.getChildByName(bgName);
            if (oldFull) oldFull.destroy();
            let techBg = new cc.Node(bgName);
            techBg.setAnchorPoint(0.5, 0.5);
            techBg.setPosition(0, 0);
            let winS = cc.winSize;
            let W = Math.max(winS.width, canvas.width || 1080);
            let H = Math.max(winS.height, canvas.height || 1920);
            techBg.width = W;
            techBg.height = H;
            techBg.opacity = 255;
            canvas.insertChild(techBg, 0);
            if (cc.director.setClearColor) {
                cc.director.setClearColor(cc.color(10, 15, 44, 255));
            }
            this._drawTechLaunchBackground(techBg, W, H);
            let all = [];
            let walk = function (n, dep, maxD, out) {
                if (!n || dep > maxD) return;
                out.push(n);
                if (n.children && n.childrenCount > 0) {
                    for (let i = 0; i < n.childrenCount; i++) walk(n.children[i], dep + 1, maxD, out);
                }
            };
            walk(canvas, 0, 8, all);
            let bgTop = null, logo = null, content = null;
            for (let i = 0; i < all.length; i++) {
                let n = all[i];
                if (n.name === 'bg' && n.width >= 1000 && n.height >= 1800 && !bgTop) bgTop = n;
                if (n.name === 'logo') logo = n;
                if (n.name === 'content' && n.parent && n.parent.name === 'Canvas') content = n;
                let spr = n.getComponent && n.getComponent(cc.Sprite);
                if (spr && spr.spriteFrame) {
                    let sf = spr.spriteFrame.name;
                    if (sf === 'fssfd' || sf === 'logo' || sf === 'gfj' || sf.indexOf('gfj1') !== -1 || sf === 'logo' || sf === 'New Label') {
                        spr.spriteFrame = null;
                        spr.enabled = false;
                        n.opacity = 0;
                    }
                }
            }
            if (content) {
                let layerBG = content.getChildByName('LayerBG');
                if (layerBG) {
                    let oldBg = layerBG.getChildByName('bg');
                    if (oldBg) {
                        let bs = oldBg.getComponent(cc.Sprite);
                        if (bs) { bs.spriteFrame = null; bs.enabled = false; }
                        oldBg.opacity = 0;
                        for (let oi = oldBg.childrenCount - 1; oi >= 0; oi--) {
                            try { oldBg.children[oi].destroy(); } catch (e) {}
                        }
                    }
                }
            }
            if (bgTop) {
                let spr = bgTop.getComponent(cc.Sprite);
                if (spr) { spr.spriteFrame = null; spr.enabled = false; }
                bgTop.opacity = 0;
            }
            if (logo) {
                let sp = logo.getComponent(cc.Sprite);
                if (sp) { sp.spriteFrame = null; sp.enabled = false; }
                logo.removeAllChildren();
                let R = 230;
                if (logo.width < 600) logo.width = 600;
                if (logo.height < 500) logo.height = 500;
                logo.setAnchorPoint(0.5, 0.5);
                logo.x = 0;
                logo.y = 100;
                logo.opacity = 255;
                let hp = new cc.Node('hp');
                hp.setAnchorPoint(0.5, 0.5);
                hp.x = 0; hp.y = 28;
                hp.width = 520;
                hp.height = 250;
                let hl = hp.addComponent(cc.Label);
                hl.fontSize = 175; hl.lineHeight = 175; hl.string = '哈希德州';
                hl.fontFamily = 'Arial Black, Arial, sans-serif';
                hl.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
                hl.verticalAlign = cc.Label.VerticalAlign.CENTER;
                hl.enableBold = true;
                hl.color = cc.color(245, 215, 125, 255);
                hp.color = cc.color(245, 215, 125, 255);
                let ho = hp.addComponent(cc.LabelOutline);
                ho.color = cc.color(140, 95, 25, 200); ho.width = 5.2;
                logo.addChild(hp);

                let suits = new cc.Node('suits');
                suits.setAnchorPoint(0.5, 0.5);
                suits.x = 0; suits.y = -120;
                suits.width = 360;
                suits.height = 72;

                let s1 = new cc.Node("s1");
                let l1 = s1.addComponent(cc.Label);
                l1.string = "\u2660";
                l1.fontSize = 58;
                l1.lineHeight = 58;
                l1.enableWrapText = false;
                s1.color = cc.color(25, 25, 35, 255);
                s1.setPosition(-44, 0);
                suits.addChild(s1);

                let s2 = new cc.Node("s2");
                let l2 = s2.addComponent(cc.Label);
                l2.string = "\u2665";
                l2.fontSize = 58;
                l2.lineHeight = 58;
                l2.enableWrapText = false;
                s2.color = cc.color(205, 55, 75, 255);
                s2.setPosition(44, 0);
                suits.addChild(s2);

                let s3 = new cc.Node("s3");
                let l3 = s3.addComponent(cc.Label);
                l3.string = "\u25C6";
                l3.fontSize = 36;
                l3.lineHeight = 36;
                l3.enableWrapText = false;
                s3.color = cc.color(232, 199, 106, 255);
                s3.setPosition(0, 2);
                suits.addChild(s3);

                logo.addChild(suits);

                let tit = new cc.Node('hashPokerTitle');
                tit.setAnchorPoint(0.5, 0.5);
                tit.x = 0; tit.y = 100 - R - 170;
                let tl = tit.addComponent(cc.Label);
                tl.fontSize = 78; tl.lineHeight = 96;
                tl.string = 'HASH POKER';
                tl.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
                tl.color = cc.color(232, 199, 106, 255);
                tl.fontFamily = 'Arial Black, Arial, sans-serif';
                tl.enableBold = true;
                let to = tit.addComponent(cc.LabelOutline);
                to.color = cc.color(150, 105, 30, 180); to.width = 4;
                logo.parent.addChild(tit);
            }
        } catch (e) {
            cc.warn('_applyHashPokerLaunchScene failed:', e && e.message);
        }
    },

    _drawTechLaunchBackground(bgNode, W, H) {
        if (!bgNode || !cc.isValid(bgNode)) return;
        try {
            let g = bgNode.addComponent(cc.Graphics);
            let halfW = W * 0.5;
            let halfH = H * 0.5;

            g.rect(-halfW, -halfH, W, H);
            g.fillColor = cc.color(8, 16, 42, 255);
            g.fill();

            let bgGradSteps = 18;
            for (let si = 0; si < bgGradSteps; si++) {
                let t = si / bgGradSteps;
                let r = Math.floor(8 + t * (28 - 8));
                let gg = Math.floor(16 + t * (50 - 16));
                let b = Math.floor(42 + t * (100 - 42));
                let layerH = H / bgGradSteps;
                g.rect(-halfW, halfH - (si + 1) * layerH, W, layerH + 1);
                g.fillColor = cc.color(r, gg, b, 255);
                g.fill();
            }

            let vignetteSteps = 12;
            let vgMaxR = Math.sqrt(halfW * halfW + halfH * halfH);
            for (let vi = vignetteSteps; vi >= 1; vi--) {
                let vr = vgMaxR * (vi / vignetteSteps);
                let alpha = Math.floor(6 + (vignetteSteps - vi) * 3);
                g.circle(0, 0, vr);
                g.fillColor = cc.color(2, 6, 20, alpha);
                g.fill();
            }

            let haloCx = -halfW * 0.45;
            let haloCy = halfH * 0.55;
            let haloR = Math.min(W, H) * 0.52;
            let haloSteps = 10;
            for (let hi = haloSteps; hi >= 1; hi--) {
                let hr = haloR * (hi / haloSteps);
                let alpha = Math.floor(4 + (haloSteps - hi) * 4);
                g.circle(haloCx, haloCy, hr);
                g.fillColor = cc.color(70, 100, 175, alpha);
                g.fill();
            }

            let halo2Cx = halfW * 0.5;
            let halo2Cy = -halfH * 0.5;
            let halo2R = Math.min(W, H) * 0.45;
            for (let hi = haloSteps; hi >= 1; hi--) {
                let hr = halo2R * (hi / haloSteps);
                let alpha = Math.floor(3 + (haloSteps - hi) * 3);
                g.circle(halo2Cx, halo2Cy, hr);
                g.fillColor = cc.color(50, 80, 150, alpha);
                g.fill();
            }

            let cornerSize = Math.min(W, H) * 0.12;
            let cornerLineW = 2.2;
            let cornerAlpha = 110;

            let drawCorner = function (cx, cy, dirX, dirY) {
                g.moveTo(cx, cy - dirY * cornerSize * 0.75);
                g.lineTo(cx, cy);
                g.lineTo(cx - dirX * cornerSize * 0.75, cy);
                g.strokeColor = cc.color(205, 170, 100, cornerAlpha);
                g.lineWidth = cornerLineW;
                g.stroke();

                let inS = cornerSize * 0.55;
                let off = cornerSize * 0.08;
                g.moveTo(cx - dirX * off, cy - dirY * (inS + off));
                g.lineTo(cx - dirX * off, cy - dirY * off);
                g.lineTo(cx - dirX * (inS + off), cy - dirY * off);
                g.strokeColor = cc.color(205, 170, 100, Math.floor(cornerAlpha * 0.55));
                g.lineWidth = 1.2;
                g.stroke();
            };
            drawCorner(-halfW + cornerSize * 0.18, halfH - cornerSize * 0.18, -1, 1);
            drawCorner(halfW - cornerSize * 0.18, halfH - cornerSize * 0.18, 1, 1);
            drawCorner(-halfW + cornerSize * 0.18, -halfH + cornerSize * 0.18, -1, -1);
            drawCorner(halfW - cornerSize * 0.18, -halfH + cornerSize * 0.18, 1, -1);

            let gridStep = Math.min(W, H) * 0.095;
            g.lineWidth = 0.45;
            g.strokeColor = cc.color(120, 155, 210, 10);
            for (let gx = -halfW; gx <= halfW + gridStep; gx += gridStep) {
                g.moveTo(gx, -halfH);
                g.lineTo(gx, halfH);
            }
            for (let gy = -halfH; gy <= halfH + gridStep; gy += gridStep) {
                g.moveTo(-halfW, gy);
                g.lineTo(halfW, gy);
            }
            g.stroke();

            let dotCount = 80;
            for (let i = 0; i < dotCount; i++) {
                let dx = (Math.random() * 2 - 1) * halfW * 0.96;
                let dy = (Math.random() * 2 - 1) * halfH * 0.96;
                let r = 0.6 + Math.random() * 1.4;
                let shade = Math.random();
                let col;
                if (shade < 0.72) {
                    col = cc.color(200, 220, 255, 55 + Math.floor(Math.random() * 35));
                } else {
                    col = cc.color(235, 205, 145, 60 + Math.floor(Math.random() * 35));
                }
                g.circle(dx, dy, r);
                g.fillColor = col;
                g.fill();
            }

            let accentDotCount = 6;
            for (let i = 0; i < accentDotCount; i++) {
                let dx = (Math.random() * 2 - 1) * halfW * 0.82;
                let dy = (Math.random() * 2 - 1) * halfH * 0.82;
                let rings = 3;
                for (let ri = rings; ri >= 1; ri--) {
                    let rr = (2.2 + ri * 3.2);
                    let a = 10 + (rings - ri) * 14;
                    g.circle(dx, dy, rr);
                    g.strokeColor = cc.color(205, 170, 100, a);
                    g.lineWidth = 0.9;
                    g.stroke();
                }
                g.circle(dx, dy, 1.6);
                g.fillColor = cc.color(230, 195, 135, 150);
                g.fill();
            }
        } catch (e) {
            cc.warn('_drawTechLaunchBackground failed:', e && e.message);
        }
    },

    start () {
        this.setTip();
    },

    // update (dt) {},

    onDestroy() {
        target.targetOff(this);
        this.unschedule(this._connectingServer);
    },

    _onLoadDownloadPercent(data){
        this.progress.node.active = true;
        this.progress.progress = data.percent;
        this.label_pro.string = Math.floor(data.percent * 100) + "%";
    },

    _onLoadDownloadShow(){
        this.unschedule(this._connectingServer);
        this.progress.node.active = true;
    },

    // _onResize(){
    //     this._updataCanvas();
    // },

    // _updataCanvas(){
    //     let designSize = cc.view.getDesignResolutionSize();
    //     let winSize = cc.view.getFrameSize();
    //     let scaleX = winSize.width / designSize.width;
    //     let scaleY = winSize.height / designSize.height;
    //     let canvas = this.node.getComponent(cc.Canvas);

    //     if(canvas){
    //         canvas.fitWidth = scaleX<=scaleY ? true : false;
    //         canvas.fitHeight = scaleX>=scaleY ? true : false;
    //         // canvas.alignWithScreen();
    //     }
    // },

    // _onLoadSceneStart(data){
    //     return true;
    // },

    setTip(str){
        this.tip.string = "";
        // this.schedule(this._connectingServer, 1);
    },

    _connectingServer(){
        // if (this._curTime > 3){
        //     this._curTime = 0;
        // }
        // let str = i18n.t("COMMON.ZHENG_ZAI_LIAN_JIE_FU_WU_QI");
        // for (let i = 0; i < this._curTime; i++) {
        //     str += ".";
            
        // }
        // this.label_pro.string = str;
        // this._curTime += 1;
    }
});
