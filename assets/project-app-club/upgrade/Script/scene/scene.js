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
                let R = 220;
                if (logo.width < R * 2) logo.width = R * 2 + 80;
                if (logo.height < R * 2) logo.height = R * 2 + 80;
                logo.setAnchorPoint(0.5, 0.5);
                logo.x = 0;
                logo.y = 80;
                logo.opacity = 255;
                let lg = logo.addComponent(cc.Graphics);
                lg.circle(0, 0, R + 40);
                lg.fillColor = cc.color(255, 225, 140, 28);
                lg.fill();
                lg.circle(0, 0, R);
                lg.fillColor = cc.color(232, 199, 106, 255);
                lg.fill();
                lg.circle(0, 0, R - 6);
                lg.strokeColor = cc.color(180, 140, 50, 200);
                lg.lineWidth = 3.5;
                lg.stroke();
                lg.circle(0, 0, R - 22);
                lg.fillColor = cc.color(12, 18, 56, 255);
                lg.fill();
                for (let d = 0; d < 12; d++) {
                    let ang = (Math.PI * 2 / 12) * d;
                    let dx = Math.cos(ang) * (R - 32);
                    let dy = Math.sin(ang) * (R - 32);
                    lg.circle(dx, dy, 5.2);
                    lg.fillColor = cc.color(255, 220, 130, 245);
                    lg.fill();
                }
                let hp = new cc.Node('hp');
                hp.setAnchorPoint(0.5, 0.5);
                hp.x = 0; hp.y = 20;
                let hl = hp.addComponent(cc.Label);
                hl.fontSize = 188; hl.lineHeight = 188; hl.string = 'HP';
                hl.fontFamily = 'Arial Black, Arial, sans-serif';
                hl.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
                hl.color = cc.color(245, 215, 125, 255);
                let ho = hp.addComponent(cc.LabelOutline);
                ho.color = cc.color(140, 95, 25, 200); ho.width = 5;
                logo.addChild(hp);
                let suits = new cc.Node('suits');
                suits.setAnchorPoint(0.5, 0.5);
                suits.x = 0; suits.y = -122;
                let sl = suits.addComponent(cc.Label);
                sl.fontSize = 56; sl.lineHeight = 56;
                sl.string = '♠         ♥         ♦';
                sl.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
                sl.color = cc.color(235, 205, 115, 255);
                let so = suits.addComponent(cc.LabelOutline);
                so.color = cc.color(100, 65, 15, 220); so.width = 2.5;
                logo.addChild(suits);
                let tit = new cc.Node('hashPokerTitle');
                tit.setAnchorPoint(0.5, 0.5);
                tit.x = 0; tit.y = 80 - R - 180;
                let tl = tit.addComponent(cc.Label);
                tl.fontSize = 78; tl.lineHeight = 96;
                tl.string = 'HASH POKER';
                tl.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
                tl.color = cc.color(232, 199, 106, 255);
                tl.fontFamily = 'Arial Black, Arial, sans-serif';
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
            let halfW = W * 0.5, halfH = H * 0.5;
            g.rect(-halfW, -halfH, W, H);
            g.fillColor = cc.color(10, 15, 44, 255);
            g.fill();
            let stripW = 260;
            let cols = Math.ceil((W + H) / stripW) + 2;
            for (let c = -cols; c < cols; c++) {
                g.moveTo(-halfW + c * stripW, -halfH);
                g.lineTo(-halfW + c * stripW + H, halfH);
                g.lineTo(-halfW + c * stripW + H + stripW * 0.45, halfH);
                g.lineTo(-halfW + c * stripW + stripW * 0.45, -halfH);
                g.close();
                g.fillColor = (c % 2 === 0) ? cc.color(28, 22, 85, 85) : cc.color(55, 28, 120, 65);
                g.fill();
            }
            g.circle(-halfW * 0.38, halfH * 0.48, Math.min(W, H) * 0.4);
            g.fillColor = cc.color(115, 65, 190, 115);
            g.fill();
            g.circle(halfW * 0.38, -halfH * 0.48, Math.min(W, H) * 0.38);
            g.fillColor = cc.color(55, 95, 210, 105);
            g.fill();
            for (let i = 0; i < 100; i++) {
                let sx = (Math.random() * 2 - 1) * halfW * 0.95;
                let sy = (Math.random() * 2 - 1) * halfH * 0.95;
                let r = 0.9 + Math.random() * 2.8;
                let sh = Math.random();
                let col;
                if (sh < 0.5) col = cc.color(255, 255, 255, 195 + Math.floor(Math.random() * 60));
                else if (sh < 0.85) col = cc.color(195, 215, 255, 175 + Math.floor(Math.random() * 70));
                else col = cc.color(255, 228, 155, 195 + Math.floor(Math.random() * 60));
                g.circle(sx, sy, r);
                g.fillColor = col;
                g.fill();
            }
            let cubes = [
                { x: -halfW * 0.7, y: halfH * 0.7, s: 46, col: cc.color(95, 135, 250, 115) },
                { x: halfW * 0.7, y: halfH * 0.45, s: 60, col: cc.color(255, 195, 125, 105) },
                { x: -halfW * 0.58, y: -halfH * 0.6, s: 68, col: cc.color(95, 135, 250, 115) },
                { x: halfW * 0.7, y: -halfH * 0.68, s: 56, col: cc.color(255, 215, 165, 110) },
                { x: halfW * 0.1, y: halfH * 0.82, s: 36, col: cc.color(155, 185, 255, 90) },
                { x: -halfW * 0.18, y: -halfH * 0.85, s: 42, col: cc.color(255, 230, 175, 85) },
                { x: -halfW * 0.84, y: -halfH * 0.1, s: 34, col: cc.color(85, 125, 235, 105) },
                { x: halfW * 0.88, y: -halfH * 0.08, s: 30, col: cc.color(255, 220, 165, 95) }
            ];
            for (let k = 0; k < cubes.length; k++) {
                let cu = cubes[k];
                let cx = cu.x, cy = cu.y, s = cu.s, hs = s * 0.5;
                g.rect(cx - hs, cy - hs, s, s);
                g.fillColor = cu.col;
                g.fill();
                g.moveTo(cx - hs, cy); g.lineTo(cx + hs, cy);
                g.moveTo(cx, cy - hs); g.lineTo(cx, cy + hs);
                g.strokeColor = cc.color(255, 255, 255, 125);
                g.lineWidth = 1.1;
                g.stroke();
                g.rect(cx - hs, cy - hs, s, s);
                g.strokeColor = cc.color(255, 255, 255, 155);
                g.lineWidth = 1.5;
                g.stroke();
            }
            g.circle(-halfW * 0.9, halfH * 0.88, 8);
            g.fillColor = cc.color(255, 218, 128, 215);
            g.fill();
            g.circle(halfW * 0.88, -halfH * 0.9, 9);
            g.fillColor = cc.color(255, 218, 128, 215);
            g.fill();
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
