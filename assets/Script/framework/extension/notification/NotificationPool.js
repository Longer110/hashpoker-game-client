/**
 * 通知弹窗对象池管理器
 * 支持多种类型弹窗的复用和缓存
 * 
 * 使用示例：
 * let pool = NotificationPool.getInstance();
 * let item = pool.get('invite', prefab);
 * // 使用...
 * pool.put('invite', item);
 */

let NotificationPool = cc.Class({
    name: "NotificationPool",
    
    extends: cc.Component,

    properties: {
        // 每种类型预制体对应的默认缓存数量
        defaultPoolSize: 2,
    },

    ctor() {
        this._pools = {};  // 按类型存储对象池 {type: [item1, item2, ...]}
        this._inUse = {};  // 正在使用的对象 {type: [item1, item2, ...]}
    },

    /**
     * 从对象池获取一个通知项目
     * @param {string} type - 弹窗类型（用于区分不同的预制体）
     * @param {cc.Prefab} prefab - 弹窗预制体
     * @param {cc.Node} parent - 父节点
     * @returns {cc.Component} 通知项目组件
     */
    get(type, prefab, parent) {
        if (!type || !prefab) {
            cc.error("NotificationPool.get: type or prefab is invalid");
            return null;
        }

        // 初始化该类型的池
        if (!this._pools[type]) {
            this._pools[type] = [];
            this._inUse[type] = [];
        }

        let item = null;

        // 如果池中有可用对象，直接使用
        if (this._pools[type].length > 0) {
            let pItem = this._pools[type].pop();
            if(!pItem.active) {
                item = pItem;
                cc.log(`NotificationPool: Reuse ${type} item from pool, remaining: ${this._pools[type].length}`);
            }else {
                cc.log(`NotificationPool: Discard ${type} item from pool, remaining: ${this._pools[type].length}`);
            }
        } 
        if(!item) {
            // 否则创建新对象
            let node = cc.instantiate(prefab);
            if (parent) {
                node.parent = parent;
            }
            item = node.getComponent("TopNotificationItem");
            
            if (!item) {
                cc.warn(`NotificationPool: ${type} prefab does not have TopNotificationItem component`);
            }
            
            cc.log(`NotificationPool: Create new ${type} item`);
        }

        // 记录正在使用
        if (item) {
            this._inUse[type].push(item);
        }

        return item;
    },

    /**
     * 将通知项目放回对象池
     * @param {string} type - 弹窗类型
     * @param {cc.Component} item - 通知项目组件
     */
    put(type, item) {
        if (!type || !item) return;

        if (!this._inUse[type]) {
            this._inUse[type] = [];
        }

        // 从使用中移除
        let index = this._inUse[type].indexOf(item);
        if (index !== -1) {
            this._inUse[type].splice(index, 1);
        }

        // 重置对象状态
        if (item.reset) {
            item.reset();
        }

        // 放入缓存池
        if (!this._pools[type]) {
            this._pools[type] = [];
        }

        this._pools[type].push(item);
        cc.log(`NotificationPool: Put ${type} item back to pool, total: ${this._pools[type].length}`);
    },

    /**
     * 清空所有缓存（某一类型或全部）
     * @param {string} type - 指定类型，不指定则清空所有
     */
    clear(type) {
        if (type) {
            if (this._pools[type]) {
                this._pools[type].forEach(item => {
                    if (item && item.node) {
                        item.node.destroy();
                    }
                });
                this._pools[type] = [];
            }
            cc.log(`NotificationPool: Cleared ${type} pool`);
        } else {
            // 清空所有类型
            for (let key in this._pools) {
                this._pools[key].forEach(item => {
                    if (item && item.node) {
                        item.node.destroy();
                    }
                });
            }
            this._pools = {};
            this._inUse = {};
            cc.log("NotificationPool: Cleared all pools");
        }
    },

    /**
     * 获取指定类型的池大小
     * @param {string} type - 弹窗类型
     * @returns {number} 缓存数量
     */
    getPoolSize(type) {
        return this._pools[type] ? this._pools[type].length : 0;
    },

    /**
     * 获取所有类型的统计信息
     * @returns {Object} {type: {pool: count, inUse: count}, ...}
     */
    getStats() {
        let stats = {};
        
        for (let type in this._pools) {
            stats[type] = {
                pool: this._pools[type].length,
                inUse: this._inUse[type] ? this._inUse[type].length : 0
            };
        }
        
        return stats;
    },

    /**
     * 销毁对象池（清理资源）
     */
    onDestroy() {
        this.clear();
    }
});

