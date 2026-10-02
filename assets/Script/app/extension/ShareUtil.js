// ShareUtil.js - 主入口，整合截图与分享策略
let ScreenshotUtil = require("ScreenshotUtil");
let TelegramShareUtil = require("TelegramShareUtil");

cc.Class({

    statics: {
        /**
         * 统一的分享入口：截图并分享到Telegram
         * @param {cc.Node} targetNode 要截图的游戏节点
         * @param {string} text 分享文本
         * @param {object} options 可选配置
         */
        async shareToTelegram(targetNode, text = '看看我的游戏成就！', options = {}) {
            let screenshotCanvas = null;
            if (targetNode != null) {
                screenshotCanvas = ScreenshotUtil.captureNode(targetNode);
            }

            await TelegramShareUtil.shareOutsideTelegram(screenshotCanvas, text);
        }
    }
});