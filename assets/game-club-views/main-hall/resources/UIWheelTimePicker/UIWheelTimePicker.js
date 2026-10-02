cc.Class({
    extends: cc.Component,

    properties: {
        // 两个 ScrollView：小时和分钟
        scrollHour: cc.ScrollView,
        scrollMinute: cc.ScrollView,
        // 每个 item 的高度（像素），注意与预制 item 高度一致
        itemHeight: 110,
        // 可见的中间高亮行数（一般为1）
        visibleCount: 3,
        // item 预制体（包含一个 cc.Label）
        itemLabel: cc.Label,
        hourItemOffsetX: 40,
        minuteItemOffsetX: -40,
        // 是否循环显示（如果 true，会在列表前后补充以模拟循环）
        loop: false,
        // 缩放渐变设置
        minScale: 0.80,
        maxScale: 1.20,
        // 边缘最小 alpha
        minAlpha: 0.6,
        // 选中颜色与普通颜色（会根据距离插值）
        selectedColor: {
            default: cc.color(255, 255, 255),
            type: cc.Color,
        },
        normalColor: {
            default: cc.color(150, 150, 150),
            type: cc.Color,
        },
    },

    onLoad() {
        this.hourCount = 24;
        this.minuteCount = 60;
        this._hourSelected = 0;
        this._minuteSelected = 0;
        this._callback = null;

        if (this.scrollHour) {
            this._hourContent = this.scrollHour.content;
            this.scrollHour.node.on('scroll-ended', this._onHourScrollEnded, this);
            // 在滚动过程中更新缩放
            this.scrollHour.node.on('scrolling', () => { this._updateItemScales(this.scrollHour); }, this);
        }
        if (this.scrollMinute) {
            this._minuteContent = this.scrollMinute.content;
            this.scrollMinute.node.on('scroll-ended', this._onMinuteScrollEnded, this);
            this.scrollMinute.node.on('scrolling', () => { this._updateItemScales(this.scrollMinute); }, this);
        }
    },

    start()
    {
       
    },

    // 填充小时/分钟列表
    _buildLists() {
        if (this._hourContent) {
            this._fillList(this._hourContent, this.hourCount, (i) => {
                return (i < 10 ? '0' + i : '' + i);
            }, this.hourItemOffsetX);
        }
        if (this._minuteContent) {
            this._fillList(this._minuteContent, this.minuteCount, (i) => {
                return (i < 10 ? '0' + i : '' + i);
            }, this.minuteItemOffsetX);
        }

    },

    // 填充单个列表
    _fillList(contentNode, count, labelFn, offsetX) {
        // 清空
        contentNode.removeAllChildren();

        // 为了让中间项居中，顶部和底部需要填充占位空项。这里填充 (visibleCount-1)/2
        let pad = Math.floor(this.visibleCount / 2);
        let total = count + pad * 2;
        // 设置内容高度
        contentNode.height = total * this.itemHeight;

        for (let i = 0; i < total; i++) {
            let itemNode = null;
            if (this.itemLabel.node) {
                itemNode = cc.instantiate(this.itemLabel.node);
                itemNode.active = true;
            } else {
                itemNode = new cc.Node('item');
                let lbl = itemNode.addComponent(cc.Label);
                lbl.fontSize = 42;
                lbl.lineHeight = 44;
                lbl.node.setContentSize(cc.size(160, 44));
                lbl.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
                lbl.verticalAlign = cc.Label.VerticalAlign.CENTER;
            }
            itemNode.y = - (i * this.itemHeight + this.itemHeight / 2);
            itemNode.x = offsetX || 0;
            itemNode.parent = contentNode;

            // 填写文本（如果是填充区间则显示空）
            let idx = i - pad;
            let label = itemNode.getComponent(cc.Label);
            if (idx >= 0 && idx < count) {
                if (label) label.string = labelFn(idx);
                itemNode._itemIndex = idx;
            } else {
                if (label) label.string = '';
                itemNode._itemIndex = -1; // 占位
            }
        }

        // 把 content 的锚点、位置调整到顶部左上（常规 ScrollView 内容）
        contentNode.anchorY = 1;
        contentNode.y = 0;
    },

    // 设置初始时间
    init(hour, minute) {
        if (typeof hour === 'number') this._hourSelected = Math.max(0, Math.min(23, hour));
        if (typeof minute === 'number') this._minuteSelected = Math.max(0, Math.min(59, minute));
        // 延迟到下一帧再设置滚动位置，避免在构建后 layout 尚未完成时设置导致偏移
        this.scheduleOnce(() => {
            this._buildLists();
            this._scrollTo(this.scrollHour, this._hourSelected);
            this._scrollTo(this.scrollMinute, this._minuteSelected);
            // 更新缩放表现
            this._updateItemScales(this.scrollHour);
            this._updateItemScales(this.scrollMinute);
        }, 0.1);
    },

    // 设置确认回调：function(hour, minute)
    setConfirmCallback(cb) {
        this._callback = cb;
    },

    // 获取当前选择
    getSelected() {
        return { hour: this._hourSelected, minute: this._minuteSelected };
    },

    // 内部：处理 hour 滚动结束
    _onHourScrollEnded() {
        this._hourSelected = this._calcSelectedIndex(this._hourContent, this.hourCount);
        cc.log('_onHourScrollEnded selected hour:', this._hourSelected);
        this._snapTo(this.scrollHour, this._hourSelected);
        // snap 完成时也更新缩放（_snapTo 使用动作，延迟一小会儿以确保位置更新）
        this.scheduleOnce(() => { this._updateItemScales(this.scrollHour); }, 0.02);
        this._emitChange();
    },

    // 内部：处理 minute 滚动结束
    _onMinuteScrollEnded() {
        this._minuteSelected = this._calcSelectedIndex(this._minuteContent, this.minuteCount);
        cc.log('_onHourScrollEnded selected minute:', this._minuteSelected);
        this._snapTo(this.scrollMinute, this._minuteSelected);
        this.scheduleOnce(() => { this._updateItemScales(this.scrollMinute); }, 0.02);
        this._emitChange();
    },

    // 计算 content 中最接近中间的 item 索引（真实值 0..count-1）
    _calcSelectedIndex(contentNode, count) {
        if (!contentNode) return 0;
        // contentNode.y 表示相对于 scrollView 节点的偏移（锚点1时，向上滚动 y 增大）
        // 计算中间位置在 content 的偏移
        // 中间项的中心相对于 content 的偏移为： (visiblePad) * itemHeight + itemHeight/2 + scrollOffset
        let pad = Math.floor(this.visibleCount / 2);
        // 获取 content 的 scroll 偏移：使用 content._position 或 content.y 
        let offsetY = -contentNode.y; // 取反方便计算
        let centerPos = offsetY + pad * this.itemHeight + this.itemHeight;
        let idx = Math.abs(Math.floor(centerPos / this.itemHeight));

        idx = Math.max(0, Math.min(count - 1, idx));
        return idx;
    },

     // 对齐到最近的项
    alignToNearestItem(scrollView, totalItems) {
        const content = scrollView.content;
        const scrollViewHeight = scrollView.height;
        const contentHeight = scrollView.content.height;
        
        const scrollOffset = scrollView.getScrollOffset();
        const maxOffset = contentHeight - scrollViewHeight;
        
        // 计算当前选中的索引
        const currentPos = -scrollOffset.y;
        let selectedIndex = Math.abs(Math.round(currentPos / this.itemHeight));
        selectedIndex = Math.max(0, Math.min(selectedIndex, totalItems - 1));
        cc.log("currentPos=", currentPos, " selectedIndex=", selectedIndex);
        
        // 对齐到选中的项
        const targetY = -selectedIndex * this.itemHeight;
        scrollView.scrollToOffset(cc.v2(0, targetY), 0.12);
    },

    // 立即滚动到索引（不播放动画）
    _scrollTo(scrollView, index) {
        if (!scrollView) return;
        let content = scrollView.content;
        let pad = Math.floor(this.visibleCount / 2);
        // 计算目标 content.y（锚点为1）
        let targetY = ((index + pad) * this.itemHeight) + this.itemHeight / 2;
        content.y = targetY;
        // 更新 _scrolling 或 progress
        // scrollView.scrollToTop(0); // 触发一次刷新（坐标已设置）
        // 更新缩放表现
        let offsetY = Math.floor(this.visibleCount / 2) * this.itemHeight;; // 用于调整缩放计算的偏移量
        this._updateItemScales(scrollView, - offsetY);
    },

    // 平滑吸附到目标索引（如果 scrollToPercentVertical 可用则用之）
    _snapTo(scrollView, index) {
        if (!scrollView) return;
        let content = scrollView.content;
        let pad = Math.floor(this.visibleCount / 2);
        let targetY = ((index + pad) * this.itemHeight) + this.itemHeight / 2;
        // 平滑过渡
        let duration = 0.00;
        let move = cc.moveTo(duration, cc.v2(content.x, targetY));
        content.stopAllActions();
        content.runAction(move);
        // 在动作期间持续更新缩放：使用 schedule 更新，取消上一次任务
        const key = `__scale_update_${scrollView._id || Math.random()}`;
        // 先取消同类调度
        try { this.unschedule(key); } catch (e) {}
        const self = this;
        let elapsed = 0;
        const tick = (dt) => {
            elapsed += dt;
            self._updateItemScales(scrollView);
            if (elapsed >= duration + 0.02) {
                self.unschedule(key);
            }
        };
        this.schedule(tick, 0.016, duration / 0.016, 0, key);
    },

    // 根据 scrollView 当前滚动位置更新子项缩放与透明度
    _updateItemScales(scrollView, offsetY = 0) {
        if (!scrollView || !scrollView.content) return;
        const content = scrollView.content;
        const children = content.children;
        const itemH = this.itemHeight;
        // scrollOffset.y 为相对于 content 的偏移（向下为正）
        const offset = scrollView.getScrollOffset();
        const currentPos = offset.y + offsetY; // 从内容顶部到视口顶部的像素距离
        const viewportCenter = currentPos + scrollView.node.height / 2;
        const maxDist = scrollView.node.height / 2 + itemH; // 归一化距离上限
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (!child) continue;
            // child's center distance from content top:
            const childCenter = Math.abs(child.y); // because child.y = -center
            const dist = Math.abs(childCenter - viewportCenter);
            const t = Math.min(dist / maxDist, 1);
            const scale = this.maxScale - (this.maxScale - this.minScale) * t;
            child.scale = scale;
            // alpha interpolation
            const alpha = 1 - (1 - this.minAlpha) * t;
            // try apply to Label or Sprite components
            const lbl = child.getComponent(cc.Label);
            const sp = child.getComponent(cc.Sprite);
            if (lbl) lbl.node.opacity = Math.round(alpha * 255);
            if (sp) sp.node.opacity = Math.round(alpha * 255);
            // also set node opacity for generic nodes
            if (!lbl && !sp) child.opacity = Math.round(alpha * 255);

            // 颜色插值：靠近中心显示 selectedColor，远离显示 normalColor
            try {
                const sc = this.selectedColor || cc.Color.WHITE;
                const nc = this.normalColor || cc.Color.GRAY;
                const r = Math.round(sc.r + (nc.r - sc.r) * t);
                const g = Math.round(sc.g + (nc.g - sc.g) * t);
                const b = Math.round(sc.b + (nc.b - sc.b) * t);
                const color = cc.color(r, g, b);
                if (lbl) {
                    lbl.node.color = color;
                }
                if (sp) {
                    sp.node.color = color;
                }
                if (!lbl && !sp) {
                    child.color = color;
                }
            } catch (e) {
            }
        }
    },

    // 执行回调（选择改变或确认时）
    _emitChange() {
        if (this._callback) {
            this._callback(this._hourSelected, this._minuteSelected);
        }
    },

    // 供外部调用的确认方法（例如按下确定）
    confirm() {
        if (this._callback) this._callback(this._hourSelected, this._minuteSelected);
    }

});