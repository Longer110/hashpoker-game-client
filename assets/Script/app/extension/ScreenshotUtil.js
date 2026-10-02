// ScreenshotUtil.js
cc.Class({
    statics: {
        /**
         * 截取指定节点及其子节点
         * @param {cc.Node} targetNode 需要截图的节点
         * @returns {HTMLCanvasElement} 包含图像数据的Canvas元素
         */
        captureNode(targetNode) {
            // 确保节点正确渲染
            const originalActive = targetNode.active;
            targetNode.active = true;

            // 创建临时相机节点
            const cameraNode = new cc.Node('_screenshotCamera');
            cameraNode.parent = cc.director.getScene();
            const camera = cameraNode.addComponent(cc.Camera);

            // 获取目标节点的世界坐标包围盒[1](@ref)
            const nodeBoundingBox = targetNode.getBoundingBoxToWorld();
            const width = Math.floor(nodeBoundingBox.width);
            const height = Math.floor(nodeBoundingBox.height);

            // 创建RenderTexture并配置相机[2,3](@ref)
            const renderTexture = new cc.RenderTexture();
            renderTexture.initWithSize(width, height);
            camera.targetTexture = renderTexture;
            camera.clearFlags = cc.Camera.ClearFlags.SOLID_COLOR;
            camera.backgroundColor = cc.color(0, 0, 0, 0); // 透明背景
            camera.cullingMask = 0xffffffff; // 渲染所有层级

            // 调整相机位置和视口以确保完整捕获目标节点[1,4](@ref)
            cameraNode.position = targetNode.parent.convertToWorldSpaceAR(targetNode.position);

            // 渲染目标节点到RenderTexture
            camera.render(targetNode);

            // 从RenderTexture读取像素数据[3](@ref)
            const pixels = renderTexture.readPixels();
            
            // 创建Canvas并处理像素数据（包括Y轴翻转和RGBA转换）[3](@ref)
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            const imageData = ctx.createImageData(width, height);
            
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const srcIndex = (y * width + x) * 4;
                    const dstIndex = ((height - 1 - y) * width + x) * 4; // Y轴翻转
                    
                    // BGRA 转 RGBA[3](@ref)
                    imageData.data[dstIndex] = pixels[srcIndex + 2];     // R
                    imageData.data[dstIndex + 1] = pixels[srcIndex + 1];   // G
                    imageData.data[dstIndex + 2] = pixels[srcIndex];      // B
                    imageData.data[dstIndex + 3] = pixels[srcIndex + 3];   // A
                }
            }
            
            ctx.putImageData(imageData, 0, 0);

            // 恢复节点状态并清理临时资源
            targetNode.active = originalActive;
            cameraNode.destroy();
            renderTexture.destroy();

            return canvas;
        }
    }
});