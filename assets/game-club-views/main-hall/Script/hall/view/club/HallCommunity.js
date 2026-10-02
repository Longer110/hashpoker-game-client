let UIFrame = require("UIFrame");
const DOMAIN_MATCH_DEV = "test-teaching.hashpoker.vip";
const DOMAIN_MATCH_PRO = "pro-teaching.hashpoker.vip";

cc.Class({
    extends: cc.Component,

    properties: {
        webView: cc.WebView
    },

    onLoad () {
    },


    init() {

        this.webView = this.node.getChildByName("webView").getComponent(cc.WebView);
        this.webView.node.width = 534;//先设置小宽度保证是竖版手机适配
        // 注册一次 message 监听
        if(!this._messageHandlerRegistered){
        window.addEventListener('message', this._onWebViewMessage.bind(this));
            this._messageHandlerRegistered = true;
        }
        let urlHOST =  DOMAIN_MATCH_DEV
        if(app.config.DEVELOPVERSION == 2){
            urlHOST = DOMAIN_MATCH_PRO
        }
        this.setWebView("https://" + urlHOST +"/texa-app/index.html");
        this.adjustWebViewSize();
        // 加载网页
        // this.setWebView("http://192.168.31.173:8060/texa-app/index.html");

    },


    adjustWebViewSize() {
        let node = this.webView.node;
        let designWidth = 534;
        let winSize = cc.view.getVisibleSize();
        let scale = winSize.width / designWidth;
        node.scale = scale;

        let nodeWidget = node.getComponent(cc.Widget)
        nodeWidget.top = 0; 
        nodeWidget.bottom = 250; 

        node.active = true;
        nodeWidget.updateAlignment();
        
    },
    _onWebViewMessage(event) {
        if (event.data.type === 'ready') {
            const iframe = this.webView._impl?._iframe;
            if (iframe && window.Telegram?.WebApp?.initDataUnsafe) {
                const tgUserInfo = window.Telegram.WebApp.initDataUnsafe;
                iframe.contentWindow.postMessage({
                    type: 'tgUserInfo',
                    data: JSON.stringify(tgUserInfo)
                }, '*');
            }
        }
    },

    setWebView(url) {
        // 添加时间戳避免缓存
        this.webView.url = url + "?date=" + new Date().getTime();
    },

    

    onDestroy() {
        
    }
});
