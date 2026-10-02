/**
 * 顶部通知弹窗队列管理器
 * 管理多个弹窗的队列显示、动画、倒计时
 * 
 * 特性：
 * - 支持多个弹窗队列显示（新消息显示在最上面）
 * - 每个弹窗独立倒计时控制
 * - 自动调整显示位置
 * - 集成对象池复用机制
 * 
 * 使用示例：
 * let manager = TopNotificationManager.getInstance();
 * manager.show('invite', inviteData, {prefab: myPrefab, duration: 10});
 */

let NotificationTypeEnum = {
    // 邀请好友
    INVITE_FRIEND: 'inviteFriendNotification',
    // 转账通知
    TRANSFER: 'transferNotification',
    // 充值成功
    RECHARGE: 'rechargeSuccessNotification',
    //提币成功
    WITHDRAW: 'withdrawSuccessNotification',
};

let NotificationPool = require("NotificationPool");

let TopNotificationManager = cc.Class({
    name: "TopNotificationManager",
    extends: cc.Component,

    statics: {
        NotificationTypeEnum: NotificationTypeEnum,
    },
    properties: {
        // 容器节点（存放所有弹窗）
        container: cc.Node,
        // 子节点
        itemPrefab: [cc.Prefab],

        notificationPool: NotificationPool,
        // 初始垂直间距
        initSpacing: 18,
        // 弹窗之间的垂直间距
        itemSpacing: 12,
        // 弹窗显示动画时长
        showDuration: 0.3,
        // 弹窗隐藏动画时长
        hideDuration: 0.3,
        // 起始位置（屏幕上方）
        startYOffset: 400,
    },

    ctor() {
        this._queue = [];          // 等待显示的队列
        this._showing = [];        // 正在显示的弹窗
        this._pool = null;         // 对象池
    },

    onLoad() {
        this.itemSpacing = 12;
        this.initSpacing = 28;
        if (!this.container) {
            cc.error("TopNotificationManager: container is not set");
        }
        
        this._pool = this.notificationPool
    },

    /**
     * 添加通知到队列
     * @param {string} type - 通知类型（对应预制体类型）
     * @param {Object} data - 通知数据
     * @param {Object} options - 配置选项
     *   - prefab: cc.Prefab (必需)
     *   - duration: number (显示时长，默认 10)
     *   - onClose: Function (关闭回调)
     */
    show(type, data, options) {
        if (!type || !data || !options) {
            cc.error("TopNotificationManager.show: invalid parameters");
            return;
        }
        let item = null;
        let prefabType =  type > 1 ? NotificationTypeEnum.TRANSFER : type;
        for (let i = 0; i < this.itemPrefab.length; i++) {
            let prefab = this.itemPrefab[i];
            if (prefab.name === prefabType) {
                item = prefab;
                break;
            }
        }
        if (!item) {
            cc.error(`TopNotificationManager.show: no prefab found for type ${prefabType}`);
            return;
        }
        
        let notifyData = {
            type: type,
            data: data,
            prefab: item,
            duration: options.duration || 10,
            onClose: options.onClose,
            item: null
        };

        // 将新通知插入队列顶部（最先显示）
        this._queue.unshift(notifyData);
        // 立即处理队列
        this._processQueue();
    },

    /**
     * 处理通知队列
     * @private
     */
    _processQueue() {
        if (this._queue.length === 0 && this._showing.length === 0) {
            // 所有通知已显示完毕，隐藏容器
            if (this.container) {
                this.container.active = false;
            }
            return;
        }

        if (this.container && !this.container.active) {
            this.container.active = true;
        }

        // 显示容器中的第一条（顶部）
        if (this._queue.length > 0) {
            let notifyData = this._queue.shift();
            this._displayNotification(notifyData);
        }
    },

    /**
     * 显示单个通知
     * @private
     */
    _displayNotification(notifyData) {
        // 从对象池获取组件
        let item = this._pool.get(notifyData.type, notifyData.prefab, this.container);
        
        if (!item) {
            cc.error("TopNotificationManager: Failed to get notification item from pool");
            return;
        }

        notifyData.item = item;
        this._showing.push(notifyData);

        // 设置弹窗数据
        let onClose = (data) => {
            this._onNotificationClosed(notifyData);
        };

        item.setData(notifyData.data, notifyData.duration, onClose, this);
        item.node.zIndex = 99
        // 计算显示位置（垂直堆叠）
        let yOffset = this._calculateYPosition();
        let startPos = cc.v2(0, this.startYOffset);
        let endPos = cc.v2(0, yOffset);

        // 调整其他正在显示的弹窗位置
        this._adjustExistingItems(true);

        // 显示弹窗
        item.show(startPos, endPos, this.showDuration);

        cc.log(`TopNotificationManager: Showing ${notifyData.type}, queue: ${this._queue.length}, showing: ${this._showing.length}`);
    },

    /**
     * 计算弹窗 Y 轴显示位置
     * @private
     */
    _calculateYPosition() {
        // 最新的弹窗显示在顶部，之前的逐个向下排列
        // let index = this._showing.length - 1;
        // return -index * this.itemSpacing;
        return -this.initSpacing;
    },

    /**
     * 调整已显示弹窗的位置
     * @private
     */
    _adjustExistingItems(isInit) {
        // 将已显示的弹窗逐个向下移动
        let targetY = -this.initSpacing;
        let length = isInit ? this._showing.length - 2 : this._showing.length - 1;
        for (let i = length; i >= 0; i--) {
            if (this._showing[i] && this._showing[i].item) { 
                let item = this._showing[i].item;
                if (item && item.content) {
                    item.content.stopAllActions();
                    if(this._showing[i + 1]) {
                        targetY += -this._showing[i + 1].item.node.height - this.itemSpacing;
                    }
                    // cc.log('test 其它位置  结束  ', targetY);
                    let moveSeq = cc.sequence(
                        cc.moveTo(0.2, cc.v2(0, targetY)),
                        cc.callFunc(() => {}, this)
                    );
                    item.content.runAction(moveSeq);
                }
            }
            
        }
    },

    /**
     * 处理通知关闭
     * @private
     */
    _onNotificationClosed(notifyData) {
        // 从显示列表中移除
        let index = this._showing.indexOf(notifyData);
        if (index !== -1) {
            this._showing.splice(index, 1);
        }

        // 触发外部回调
        if (notifyData.onClose) {
            notifyData.onClose(notifyData.data);
        }

        // 将项目放回对象池
        if (notifyData.item) {
            this._pool.put(notifyData.type, notifyData.item);
        }

        // 调整剩余弹窗位置
        this._adjustExistingItems();

        cc.log(`TopNotificationManager: Closed ${notifyData.type}, remaining: ${this._showing.length}`);

        // 继续处理队列
        this._processQueue();
    },

    /**
     * 关闭所有通知
     */
    closeAll() {
        this._queue = [];

        // 关闭正在显示的所有弹窗
        let showing = this._showing.slice();
        showing.forEach(notifyData => {
            if (notifyData.item && notifyData.item.hide) {
                notifyData.item.hide(this.hideDuration);
            }
        });

        this._showing = [];
        this.container.active = false;
    },

    /**
     * 获取统计信息
     */
    getStats() {
        return {
            queue: this._queue.length,
            showing: this._showing.length,
            pool: this._pool.getStats()
        };
    },

    /**
     * 清理资源
     */
    cleanup() {
        this.closeAll();
        if (this._pool) {
            this._pool.clear();
        }
    }
});
