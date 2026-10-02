// TelegramShareUtil.js - 专注于Telegram分享
cc.Class({

    statics: {
        /**
         * 检测是否在Telegram迷你应用中运行
         * @returns {boolean}
         */
        isInTelegramWebApp() {
            return !!(window.Telegram && window.Telegram.WebApp);
        },

        /**
         * 在Telegram应用内使用SDK进行分享（最优体验）
         * @param {HTMLCanvasElement} canvas 截图的Canvas元素
         * @param {string} text 分享文本
         */
        shareInTelegram(canvas, text = '看看我的游戏截图！') {
            cc.log("尝试在Telegram应用内分享");
            if (!this.isInTelegramWebApp()) {
                return false;
            }

            try {
                const webApp = window.Telegram.WebApp;
                webApp.expand(); // 尝试扩展至全屏

                const imageDataUrl = canvas.toDataURL('image/png');
                const gameUrl = " ";
                const fullText = `${text} ${gameUrl}`;

                // 使用switchInlineQuery让用户选择分享目标
                webApp.switchInlineQuery(fullText, ['users', 'groups', 'channels']);
                return true;
            } catch (error) {
                console.error('Telegram SDK分享失败:', error);
                return false;
            }
        },

        /**
         * 在外部浏览器中通过URL Scheme分享到Telegram
         * @param {HTMLCanvasElement} canvas 截图的Canvas元素
         * @param {string} text 分享文本
         */
        async shareOutsideTelegram(canvas, text = '看看我的游戏截图！') {
            let imageUrl = ""
            if (imageUrl && imageUrl.length > 0) {
                imageUrl = await uploadImage(canvas);
            }
            const encodedUrl = encodeURIComponent(imageUrl);
            const encodedText = encodeURIComponent(text);
            const telegramShareUrl = `https://t.me/share/?url=${encodedUrl}&text=${encodedText}`
            if (window.Telegram.WebApp && window.Telegram.WebApp.openTelegramLink) {
                window.Telegram.WebApp.openTelegramLink(telegramShareUrl);
            } else if (window.Telegram.WebApp && window.Telegram.WebApp.shareUrl) {
                window.Telegram.WebApp.shareUrl(telegramShareUrl);
            }

        },

        //截图转blob
        canvasToBlob(canvas) {
            return new Promise(resolve => {
                canvas.toBlob(blob => resolve(blob), 'image/png');
            });
        },


        //上传到服务器
        async uploadImage(canvas) {
            return ""
            // const blob = await canvasToBlob(canvas);

            // const formData = new FormData();
            // formData.append('file', blob, 'screenshot.png');

            // const res = await fetch('/upload', {//上传地址
            //     method: 'POST',
            //     body: formData
            // });

            // const data = await res.json();
            // return data.url; // 返回公网图片 URL
        },




        /**
         * 显示图片分享引导界面（当自动分享不可用或失败时）
         * @param {HTMLCanvasElement} canvas 截图的Canvas元素
         */
        _showImageSharingGuide(canvas) {
            // 创建全屏引导层
            const guideOverlay = document.createElement('div');
            guideOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.85);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                color: white;
                font-family: Arial, sans-serif;
                text-align: center;
            `;

            // 创建引导内容
            guideOverlay.innerHTML = `
                <div style="background: #333; padding: 20px; border-radius: 10px; max-width: 90%; max-height: 90%; overflow: auto;">
                    <h3>分享游戏截图</h3>
                    <p>请按照以下步骤分享：</p>
                    <ol style="text-align: left; margin: 15px 0;">
                        <li>长按下方图片保存到相册</li>
                        <li>打开Telegram</li>
                        <li>选择好友或群组，发送刚保存的图片</li>
                    </ol>
                    <img id="guideScreenshot" src="${canvas.toDataURL('image/png')}" style="max-width: 300px; border: 2px solid #fff; margin: 10px 0;" />
                    <div>
                        <button id="downloadBtn" style="padding: 10px 20px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 5px;">下载图片</button>
                        <button id="closeGuideBtn" style="padding: 10px 20px; margin: 5px; background: #6c757d; color: white; border: none; border-radius: 5px;">关闭</button>
                    </div>
                </div>
            `;

            document.body.appendChild(guideOverlay);

            // 绑定按钮事件
            document.getElementById('downloadBtn').onclick = () => this.downloadImage(canvas);
            document.getElementById('closeGuideBtn').onclick = () => document.body.removeChild(guideOverlay);
        },

        /**
         * 下载图片作为最终备选方案
         * @param {HTMLCanvasElement} canvas 截图的Canvas元素
         * @param {string} filename 文件名
         */
        downloadImage(canvas, filename = 'game_screenshot.png') {
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    }
});