/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2023-01-04 17:20:03
 * @LastEditors: OreoWang
 * @LastEditTime: 2023-01-15 16:05:03
 * @Description: 
 */

const UIListRefresh = require("UIListRefresh");
const UIListOption = require("UIListOption");
const UIListEasing = require("UIListEasing");
const UIListUtils = require("UIListUtils");
const { DefaultOption } = UIListOption;

const DEBUG_CONTENT_BG = false && CC_DEV;

const EASING_DEFAULT_HANDLER = UIListEasing.easeOutExpo;
// const EASING_DEFAULT_HANDLER = UIListEasing.easeOutBezier;
const dev = console;

// export interface ListOption {
//     poolSize?: number,
//     extendSize?: number,
//     minOffset?: number,
//     initImmediate?: boolean,
//     autoSetContent?: boolean,
//     statusRefresh?: Status,
//     statusLoadMore?: Status,
// }

const REFRESH_ITEM_SIZE = 50;
const ETemplateType = cc.Enum({
    PREFAB: 1, 
    NODE: 2,
});

cc.Class({
	extends: cc.Component,
	editor: CC_EDITOR && {
        requireComponent: cc.ScrollView,
		disallowMultiple: true,
    },
    properties: {
		templateType: {
			default: ETemplateType.PREFAB,
			type: ETemplateType,
			tooltip: '模板类型'
		},
		nodeTemplate: {
			default: null,
			type: cc.Node,
			displayName: "Template Item",
			tooltip: '滚动节点预制体模板(Node)',
			visible: function (){
				return this.templateType == ETemplateType.NODE
			}
		},
		prefabTemplate: {
			default: null,
			type: cc.Prefab,
			displayName: "Template Item",
			tooltip: '滚动节点预制体模板(Prefab)',
			visible: function (){
				return this.templateType == ETemplateType.PREFAB
			}
		},
		template: {
			visible: false,
			get(){
				if(this.templateType == ETemplateType.NODE){
					return this.nodeTemplate;
				}
				return this.prefabTemplate;
			}
		},
		
		_useDynamicData: {
			visible: false,
			tooltip: '是否使用动态数据（上拉可加载，下拉可刷新）',
			get(){
				return this.needDownRefresh || this.needLoadMore;
			}
		},
		needDownRefresh: {
			default: false,
			tooltip: '是否启用"下拉刷新"功能'
		},
		needLoadMore: {
			default: false,
			tooltip: '是否启用上拉"加载更多"功能'
		},
		templateRefreshH: {
			default: null,
			type: cc.Prefab,
			tooltip: '下拉刷新/上拉加载 模板（横向滚动时）',
			visible: function (){
				return this._useDynamicData;
			},
		},
		templateRefreshV: {
			default: null,
			type: cc.Prefab,
			tooltip: '下拉刷新/上拉加载 模板（纵向滚动时）',
			visible: function (){
				return this._useDynamicData;
			},
		},
		templateRefresh: {
			// serializable: false,
			visible: false,
			get(){
				return this.horizontal ? this.templateRefreshH : this.templateRefreshV;
			},
		},
		layoutRefresh: {
			visible: false,
			default: null,
			type: UIListRefresh,
		},
		layoutLoadMore: {
			visible: false,
			default: null,
			type: UIListRefresh,
		},
		layoutHead: {
			visible: false,
			default: null,
			type: cc.Node,
			tooltip: '头部空白节点，用于调整大小以同步由于回收 layoutContainer 头部节点后产生的偏移量'
		},
		layoutContainer: {
			visible: false,
			default: null,
			type: cc.Layout,
			tooltip: '实际布局容器'
		},
		layoutTail: {
			visible: false,
			default: null,
			type: cc.Node,
			tooltip: '尾部空白节点，用于调整大小以同步由于回收 layoutContainer 尾部节点后产生的偏移量'
		},

		scroll: {
			visible: false,
			get(){
				return this.getComponent(cc.ScrollView);
			}
		},
		horizontal: {
			visible: false,
			get(){
				return this.scroll.horizontal;
			}
		},
		vertical: {
			visible: false,
			get(){
				return this.scroll.vertical;
			}
		},
		isGridLayout: {
			visible: false,
			get(){
				return this._isGrid;
			}
		},

		// _easingScale: {
		// 	default: 1.02,
		// 	tooltip: '缓动缩放系数'
		// },

        // _speedScale: {
		// 	default: 1.5,
		// 	tooltip: '滑动时速度系数缩放'
		// },

        // _brakeDefault: {
        //     default: 0.3,
		// 	tooltip: '默认衰减系数'
        // },
        
        _brakeDefault: 0.3, //默认衰减系数
        _easingScale: 1.02, //缓动缩放系数
        _speedScale: 1.5, //滑动时速度系数缩放

        _blockNode: null, 		//禁止触摸
		_easingHandler: null,
		_delegate: null,   // UIListView事件代理
		_uiPool: null,         // UIListPool 节点缓存池;
		_curCell: null,        // 当前选中的节点
		_curCellIndex: -1,                 // 当前选中节点的索引
		
		_option: null,    //列表初始化选项
	
		_events: [],           //组件事件注册
		
		_indexHead: -1,        //布局头节点索引
		_indexTail: -1,        //布局尾节点索引
		_infoHead: null,  //布局头部节点回收信息
		_infoTail: null,  //布局尾部节点回收信息
		_sizeRefresh: cc.Size.ZERO,   //"下拉刷新"节点大小
		_sizeLoadMore: cc.Size.ZERO,  //"上拉加载"节点大小
		_sizeTemplate: cc.Size.ZERO, //预制体节点大小（按grid布局时自动计算列数）
		_isGrid: false,    //是否grid布局（根据 layout 的 type 是否为 GRID 来判断）
		_gridColumn: 1,     //ScrollView.content 按 Grid 排列时按 _sizeTemplate 计算得到的列数
	},

	onEnable(){
        this._addEventListeners();
    },
    onDisable(){
        this._removeEventListeners();
    },
	
	onUpdate(dt) {
        
    },
    forceUpdate() {

    },
    onMoveContent(deltaMove){

	},
	onScrollChildren(deltaMove){

	},
    onAutoScrolling(deltaMove){
    
    },
	setEasingHandler(handler){
		this._easingHandler = handler;
	},
	getEasingHandler(){
		let handler = this._easingHandler;
		if(typeof handler != "function"){
			handler = EASING_DEFAULT_HANDLER;
		}
		
		return handler;
	},
	setEasingScale(scale){
		this._easingScale = scale;
	},
	getEasingScale(){
		return this._easingScale;
	},
    getSpeedScale(){
        return this._speedScale;
    },
    setSpeedScale(scale){
        this._speedScale = scale;
    },
    getBrakeDefault(){
        return this._brakeDefault;
    },
    setBrakeDefault(brake){
        this._brakeDefault = brake;
        this.scroll.brake = brake;
    },
    _addEventListeners() {
        this._register("scrolling", this._onScrolling);
        // if(this._useDynamicData){
            let scroll_to_min = "scroll-to-left";
            let scroll_to_max = "scroll-to-right";
			let bounce_to_min = "bounce-left";
            let bounce_to_max = "bounce-right";
            if(this.horizontal){
            }
            else if(this.vertical){
				scroll_to_min = "scroll-to-top";
            	scroll_to_max = "scroll-to-bottom";
                bounce_to_min = "bounce-top";
                bounce_to_max = "bounce-bottom";
            }

			// this._register(scroll_to_min, this._onScrollMin);
            // this._register(scroll_to_max, this._onScrollMax);
            this._register(bounce_to_min, this._onBounceMin);
            this._register(bounce_to_max, this._onBounceMax);
            this._register("scroll-ended", this._onScrollEnded);
			// this._register("scroll-ended-with-threshold", this._onScrollEndedWidthThreshold)
        // }
    },
    _removeEventListeners() {
        for (let index = 0; index < this._events.length; index++) {
            const event = this._events[index];
            this.scroll.node.off(event.key, event.handler, this);
        }
    },
    _register(key, handler){
        this._events.push({
            key,
            handler
        })
        this.scroll.node.on(key, handler, this);
    },

	/**
	 * 
	 * @param {DefaultOption} option 
	 */
    _initOption(option){
        if(!option || typeof option!='object'){
            option = {}
        }
        for (const key in DefaultOption) {
            if(typeof option[key] == 'undefined'){
                option[key] = DefaultOption[key];
            }
        }
        this._option = option;
    },

    _initScrollView(){
        let content = this.scroll.content;
        if(!content){
            return;
        }

        let layout = content.getComponent(cc.Layout);
		if(!layout){
			 //console.error("scroll.content 需要挂载 cc.Layout 组件");
			return;
		}

        this.scroll.brake = this.getBrakeDefault();

		do {
			let node = new cc.Node("UIListBlock");
			let block = node.addComponent(cc.BlockInputEvents);
			let widget = node.addComponent(cc.Widget);
			widget.isAlignBottom = true;
			widget.isAlignTop = true;
			widget.isAlignLeft = true;
			widget.isAlignRight = true;
			this.node.addChild(node);
			this._blockNode = node;
			this._hideBlockNode();
		} while (0);

		UIListUtils.overrideScrollView(this, this.scroll);

        content.destroyAllChildren();
        let trans = content; //.getComponent(UITransform);
        let view = content.parent;
        let size = this._sizeTemplate;
        if(layout && layout.type == cc.Layout.Type.GRID){
            this._isGrid = true;
            if(!size.equals(cc.Size.ZERO)){
                let width = trans.width - layout.paddingLeft - layout.paddingRight - layout.spacingX;
                let height = trans.height - layout.paddingTop - layout.paddingBottom - layout.spacingY;
                if(this.horizontal){
                    this._gridColumn = Math.floor(height / size.height);
                }
                else if(this.vertical){
                    this._gridColumn = Math.floor(width / size.width);
                }
                if(this._gridColumn < 1){
                    this._gridColumn = 1;
                }
            }
        }

        if(this._option.autoSetContent){
            if(this.vertical){
                if(!this._isGrid && layout.type!=cc.Layout.Type.VERTICAL){
                    dev.warn("ScrollView与Layout方向不一致");
                    layout.type = cc.Layout.Type.VERTICAL;
                }
                content.anchorX = 0.5;
                content.anchorY = 1;
                content.width = view.width;
                content.height = 0;
                let pos = content.getPosition();
                pos.x = view.width*(content.anchorX-view.anchorX);
                pos.y = view.height*(content.anchorY-view.anchorY);
                content.setPosition(pos);
            }
            else if(this.horizontal){
                if(!this._isGrid && layout.type!=cc.Layout.Type.HORIZONTAL){
                    dev.warn("ScrollView与Layout方向不一致");
                    layout.type = cc.Layout.Type.HORIZONTAL;
                }

                content.anchorX = 0;
                content.anchorY = 0.5;
                content.width = 0;
                content.height = view.height;
                let pos = content.getPosition();
                pos.x = view.width*(content.anchorX-view.anchorX);
                pos.y = view.height*(content.anchorY-view.anchorY);
                content.setPosition(pos);
            }
        }

		this._sizeRefresh = cc.size(REFRESH_ITEM_SIZE, REFRESH_ITEM_SIZE);
		this._sizeLoadMore = cc.size(REFRESH_ITEM_SIZE, REFRESH_ITEM_SIZE);
        if(this.needDownRefresh && this.templateRefresh){
            this.layoutRefresh = this._createRefreshItem(this.templateRefresh);
            this._sizeRefresh = this.layoutRefresh.node.getContentSize();
        }

        this.layoutHead = this._createLayoutItem("layoutHead");
        this.layoutContainer = this._createLayoutContainer("layoutContainer");
        this.layoutTail = this._createLayoutItem("layoutTail");
        if(this.needLoadMore && this.templateRefresh){
            this.layoutLoadMore = this._createRefreshItem(this.templateRefresh);
            this._sizeLoadMore = this.layoutLoadMore.node.getContentSize();
        }

        let sprite = this.scroll.getComponent(cc.Sprite);
        // if(sprite) sprite.enabled = false;
        if(DEBUG_CONTENT_BG){
            if(sprite) sprite.enabled = true;

            dev.warn("TODO cocoscreate v3.0");
            // this.layoutHead.color = Color.RED;
            // this.layoutHead.opacity = 100;
            // this.layoutContainer.node.color = Color.YELLOW;
            // this.layoutTail.color = Color.GREEN;
            // this.layoutTail.opacity = 80;
        }
    },
    _createLayoutItem(name){
        let content = this.scroll.content;
        let {width, height} = content;
        let node = new cc.Node(name);
        // node.addComponent(UITransform);
        node.width = this.vertical ? width : 0;
        node.height = this.horizontal ? height : 0;
        let pos = node.getPosition();
        if(this.horizontal){
            pos.y = height*(node.anchorY - content.anchorY);
        }
        else if(this.vertical){
            pos.x = width*(node.anchorX - content.anchorX);
        }
        content.addChild(node);

        if(DEBUG_CONTENT_BG){
            dev.warn("TODO cocoscreator v3.0")
            // let sprite = node.addComponent(Sprite);
            // sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            // sprite.spriteFrame = ResourceManager.default.getBuildinSpriteFrame("default_sprite_splash");
            // node.color = cc.Color.BLUE;
        }
        return node;
    },
    _createRefreshItem(template){
        let content = this.scroll.content;
        let {width, height} = content;
        let node = cc.instantiate(template);
        node.width = this.vertical ? width : node.width;
        node.height = this.horizontal ? height : node.height;
        let pos = node.getPosition();
        if(this.horizontal){
            pos.y = height*(node.anchorY - content.anchorY);
        }
        else if(this.vertical){
            pos.x = width*(node.anchorX - content.anchorX);
        }
        node.setPosition(pos);
        content.addChild(node);
        let refresh = node.getComponent(UIListRefresh);
        return refresh;
    },
    _createLayoutContainer(name){
        let content = this.scroll.content;
        let node = this._createLayoutItem(name);
        
        //Layout属性拷贝
        let target = node.addComponent(cc.Layout);
        let original = content.getComponent(cc.Layout);
        target.type = original.type;
        this._cloneLayoutComponent(original, target);
        
        if(this._isGrid){
            target.cellSize = original.cellSize;   //每个格子的大小，
            target.startAxis = original.startAxis; //起始轴方向类型，可进行水平和垂直布局排列

            //原始属性调整
            content.removeComponent(cc.Layout);
            original = content.addComponent(cc.Layout);
            // this._cloneLayoutComponent(target, original);

            if(this.horizontal){
                original.type = cc.Layout.Type.HORIZONTAL;
                content.height = node.height;
                // content.anchorX = 0;
                // content.anchorY = 0.5;
            }
            else if(this.vertical){
                original.type = cc.Layout.Type.VERTICAL;
                content.width = node.width;
                // content.anchorX = 0.5;
                // content.anchorY = 1;
            }
            original.resizeMode = target.resizeMode;
        }

        original.spacingX = 0;
        original.spacingY = 0;
        original.paddingLeft = 0;
        original.paddingRight = 0;
        original.paddingTop = 0;
        original.paddingBottom = 0;

        original.horizontalDirection = target.horizontalDirection;
        original.verticalDirection = target.verticalDirection;
        original.affectedByScale = false;
        
        let widget = node.addComponent(cc.Widget);
        if(this.vertical){
            widget.isAlignLeft = true;
            widget.isAlignRight = true;
        }
        else if(this.horizontal){
            widget.isAlignTop = true;
            widget.isAlignBottom = true;
        }
        
        // let widgetOriginal = content.getComponent(cc.Widget);
		// if(widgetOriginal){
		// 	let widgetTarget = node.addComponent(cc.Widget);
		// 	this._cloneWidgetComponent(widgetOriginal, widgetTarget);
		// }

        return target;
    },
    _cloneLayoutComponent(original, target){
        // target.type = original.type;
        target.resizeMode = original.resizeMode;
        target.paddingLeft = original.paddingLeft;
        target.paddingRight = original.paddingRight;
        target.paddingTop = original.paddingTop;
        target.paddingBottom = original.paddingTop;
        target.spacingX = original.spacingX;
        target.spacingY = original.spacingY;
        target.horizontalDirection = original.horizontalDirection;
        target.verticalDirection = original.verticalDirection;
        target.affectedByScale = original.affectedByScale;
    },
   
	// _cloneWidgetComponent(original, target){
	// 	target.isAlignTop = original.isAlignTop;
    //     target.isAlignVerticalCenter = original.isAlignVerticalCenter;
    //     target.isAlignBottom = original.isAlignBottom;
    //     target.isAlignLeft = original.isAlignLeft;
    //     target.isAlignHorizontalCenter = original.isAlignHorizontalCenter;
    //     target.isAlignRight = original.isAlignRight;
    //     target.isStretchWidth = original.isStretchWidth;
    //     target.isStretchHeight = original.isStretchHeight;
    //     target.top = original.top;
    //     target.bottom = original.bottom;
    //     target.left = original.left;
    //     target.right = original.right;
    //     target.horizontalCenter = original.horizontalCenter;
    //     target.verticalCenter = original.verticalCenter;
    //     target.isAbsoluteHorizontalCenter = original.isAbsoluteHorizontalCenter;
    //     target.isAbsoluteVerticalCenter = original.isAbsoluteVerticalCenter;
    //     target.isAbsoluteTop = original.isAbsoluteTop
    //     target.isAbsoluteBottom = original.isAbsoluteBottom;
    //     target.isAbsoluteLeft = original.isAbsoluteLeft
    //     target.isAbsoluteRight = original.isAbsoluteRight;
    //     target.alignMode = original.alignMode
	// }, 
    
    _initContent(){
        let content = this.scroll.content;
        let {width, height} = content;
        let horizontal = this.horizontal;
        let vertical = this.vertical;
        this.layoutHead.width = horizontal ? 0 : width;
        this.layoutTail.width = horizontal ? 0 : width;
        this.layoutHead.height = vertical ? 0 : height;
        this.layoutTail.height = vertical ? 0 : height;
        
        if(this.layoutRefresh){
            this.layoutRefresh.init(vertical, this._option.statusRefresh);
		}
		if(this.layoutLoadMore){
            this.layoutLoadMore.init(vertical, this._option.statusLoadMore);
        }

        this._clearContent();

        this.layoutContainer.updateLayout();
        this._unSelectCell(this._curCell);
        this._curCell = null;
        this._curCellIndex = -1;
        this._indexHead = -1;
        this._indexTail = -1;
		if(!this._infoHead){
			this._infoHead = new Map();
		}
		if(!this._infoTail){
			this._infoTail = new Map();
		}	
        this._infoHead.clear();
        this._infoTail.clear();
    },
    _clearContent(){
        //onDestroy里调用时，节点已销毁
        if(!this.layoutContainer || !this.layoutContainer.node){
            return;
        }

        let array = this.layoutContainer.node.children;
        for (let index = array.length-1; index >= 0; index--) {
            let child = array[index];
            this._uiPool.unuse(child);
        }
    },
    _getHeadItems(){
        let children = this.layoutContainer.node.children;
        let offset = this._gridColumn;
        let items = {
            cell0: children[offset*(0+this._option.extendSize)],
            cell1: children[offset*(1+this._option.extendSize)],
            // cell2: children[offset*(2+this._option.extendSize)],
        }
        return items;
    },
    _getTailItems(){
        let children = this.layoutContainer.node.children;
        let length = children.length;
        let offset = this._gridColumn;
        let items = {
            cell0: children[length-1-offset*(0+this._option.extendSize)],
            cell1: children[length-1-offset*(1+this._option.extendSize)],
            // cell2: children[length-1-offset*(2+this._option.extendSize)],
        }
        return items;
    },
    _getLastItem(){
        let children = this.layoutContainer.node.children;
        let length = children.length;
        return children[length-1];
    },
    _getFirstItem(){
        let children = this.layoutContainer.node.children;
        return children[0];
    },
	_showBlockNode(){
		this._blockNode.active = true;
	},
	_hideBlockNode(){
		this._blockNode.active = false;
	},
    _onScrolling(target){
		// dev.log("_onScrolling")
    },
	// _onScrollEndedWidthThreshold(target){
	// 	// this._hideBlockNode();
	// 	// dev.log("_onScrollEndedWidthThreshold", this.scroll._autoScrolling, )
	// 	return this._useDynamicData;
	// },
    _onScrollEnded(target){
		// this._hideBlockNode();
		// dev.log("_onScrollEnded", this.scroll._autoScrolling, )
		return this._useDynamicData;
    },
    _onBounceMin(){
		// this._hideBlockNode();
		// dev.log("_onBounceMin")
		return this._useDynamicData;
    },
    _onBounceMax(){
		// this._hideBlockNode();
		// dev.log("_onBounceMax")
		return this._useDynamicData;
    },
	// _onScrollMin(){
	// 	// this._showBlockNode();
	// 	// dev.log("_onScrollMin")
	// 	return this._useDynamicData;
    // },
    // _onScrollMax(){
	// 	// this._showBlockNode();
	// 	// dev.log("_onScrollMax")
	// 	return this._useDynamicData;
    // },

    
    onSizeChange(cell, size, oldSize){
        this._delegate.onSizeChange(cell, size, oldSize);
    },
    //点击UIListItem时回调
    onClickCell(cell){
        //先处理选中逻辑
        this._onSelectCell(cell);

        //再处理点击事件
        this._delegate.onClickCell(cell);
    },
    //获取当前选中项
    getSelectCell(){
        return this._curCell;
    },
	//获取当前选中索引
	getSelectIndex(){
		return this._curCellIndex;
	},
    //Cell 选中时回调
    _onSelectCell(cell){
        if(cc.isValid(this._curCell)){
            if(cell!=this._curCell){
                this._unSelectCell(this._curCell);
                cell.onSelect();
            }
        }
        else{
            cell.onSelect();
        }
        this._curCell = cell;
        this._curCellIndex = cell.getIndex();
    
        this._delegate.onSelectCell(cell);
    },
    //Cell 取消选中时回调
    _unSelectCell(cell){
        if(cc.isValid(this._curCell)){
            if(cell==this._curCell){
                this._curCell.unSelect();
            }
            this._delegate.unSelectCell(cell);
        }
        this._curCell = null;
		/** 这里不能将索引清掉，否则节点重新加入列表时无法重新选中 */
		// this._curCellIndex = -1;
    },
    
    /**
     * 检测 node 是否在 ScrollView 包围盒内
     * @param node 
     */
    _containsItem(node, result){
        let scroll = this.scroll;
        let content = scroll.content;
        let view = content.parent;

        let posWorld = node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let pos = view.parent.convertToNodeSpaceAR(posWorld);
        let width = node.width;
        let height = node.height;
        let minX = pos.x - width*node.anchorX;
        let minY = pos.y - height*node.anchorY;
        let rectItem = cc.rect(minX, minY, width, height);
        let rectView = view.getBoundingBox();

        if(result){
            result.rectView = rectView;
            result.rectItem = rectItem;
        }

        if(rectView.containsRect(rectItem)||rectView.intersects(rectItem)){
            return true;
        }
        return false;
    },
    _updateScrollViewSize(){
        let layout = this.scroll.content.getComponent(cc.Layout);
        layout.updateLayout();
    },
    _updateLayoutContainerSize(){
        this.layoutContainer.updateLayout();
    },
})
