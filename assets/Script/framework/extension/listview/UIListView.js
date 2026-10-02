/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2023-01-04 17:19:48
 * @LastEditors: OreoWang
 * @LastEditTime: 2023-01-15 17:14:19
 * @Description: 
 */

const dev = console;
const UIListPool = require("UIListPool");
const UIListDelegate = require("UIListDelegate");
const UIListBase = require("UIListBase");
const UIListCell = require("UIListCell");
const UIListOption = require("UIListOption");
const { DefaultOption } = UIListOption;

cc.Class({
	extends: UIListBase,

    properties: {
		_data: [],             //列表所有数据

		_busying: {
			visible: false,
			get(){
				return this._refreshing || this._loading;
			}
		},
	
        _needUpdatePercent: 0.9,    //当一次移动距离超过列表视口一定百分比时，需要在下一帧强制渲染可见区域节点
        _needUpdateForce: false,    //是否需要强制渲染列表
		_dirty: false,         		//标志是否需要更新列表
		_refreshing: false,    		//下拉刷新标志
		_loading: false,       		//上拉加载标志
		_refreshHandling: false,    //标志 刷新 是否已经在处理中
		_loadMoreHandling: false, 		//标志 加载 是否已经在处理中
	},

	onLoad() {
    },
    start() {
    },
    onDestroy(){
        this._clear();
    },
    lateUpdate(dt) {
        if(this._needUpdateForce){
            this._dirty = true;
            this.forceUpdate();
        }
        else{
            this.onUpdate(dt);
        }
	},
    /**
     * 分帧刷新可见区域 item
     * @param {*} dt 
     * @returns 
     */
	onUpdate(dt){
		this._super(dt);
		
        // if (this._busying) return;
        if (!this._dirty) return;
        
        this._updateContent();
    },
    /**
     * 强制一次性刷新可见区域 item 
     */
    forceUpdate(){
        this._needUpdateForce = false;
        while(this._dirty){
            this._updateContent();
            this._updateScrollViewSize();
        }
    },
    onScrollChildren(deltaMove){
		// this._updateContent();
	},
    onMoveContent(deltaMove){
        let length = deltaMove.mag();
        const {width, height} = this.scroll._view;
        // 当一次移动距离超过列表视口一定百分比时，需要在下一帧强制渲染可见区域节点
        const percent = this._needUpdatePercent;
        if(this.vertical){
            if(length >= height * percent){
                this._needUpdateForce = true;
            }
        }
        else if(this.horizontal){
            if(length >= width * percent){
                this._needUpdateForce = true;
            }
        }
    },
    onAutoScrolling(deltaMove){
        let length = deltaMove.mag();
        
        let head = this._getFirstItem();
        let tail = this._getLastItem();
        if(!head || !tail){
            return;
        }

        let target = null;
        let rectResult = {};
        let needUpdate = false;
        
        if(this.vertical){
            // 上滑
            if(deltaMove.y > 0){
                target = tail;
                if(length < target.height){
                    return;
                }
    
                let hit = this._containsItem(target, rectResult);
                if(hit){
                    needUpdate = true;
                }
                else{
                    const {rectView, rectItem} = rectResult;
                    //最后一个节点被滑出顶部，需要即时更新
                    if(rectItem.yMax < rectView.yMax){
                        needUpdate = true;
                    }
                }
            }
            // 下滑
            else if(deltaMove.y < 0){
                target = head;
                if(length < target.height){
                    return;
                }
    
                let hit = this._containsItem(target, rectResult);
                if(hit){
                    needUpdate = true;
                }
                else{
                    const {rectView, rectItem} = rectResult;
                    //第一个节点被滑出底部，需要即时更新
                    if(rectItem.yMax > rectView.yMax){
                        needUpdate = true;
                    }
                }
            }
        }
        else if(this.horizontal){
            // 右滑
            if(deltaMove.x > 0){
                target = head;
                if(length < target.width){
                    return;
                }
                
                let hit = this._containsItem(target, rectResult);
                if(hit){
                    needUpdate = true;
                }
                else{
                    const {rectView, rectItem} = rectResult;
                    //第一个节点被滑出右部，需要即时更新
                    if(rectItem.xMax > rectView.xMax){
                        needUpdate = true;
                    }
                }
            }
            // 左滑
            else if(deltaMove.x < 0){
                target = tail;
                if(length < target.width){
                    return;
                }
                
                let hit = this._containsItem(target, rectResult);
                if(hit){
                    needUpdate = true;
                }
                else{
                    const {rectView, rectItem} = rectResult;
                    //最后一个节点被滑出左部，需要即时更新
                    if(rectItem.xMax < rectView.xMax){
                        needUpdate = true;
                    }
                }
            }
        }
        
        if(needUpdate){
            while (this._dirty) {
                this._updateContent();
            }    
        }
    },

	/**
	 * 
	 * @param {UIListAdapter} adapter 
	 * @param {Array<any>} data 
	 * @param {ListOption} option 
	 * @returns 
	 */
    init(adapter, data = [], option = DefaultOption) {
        this._initOption(option);
        this._delegate = new UIListDelegate(adapter);
        this._uiPool = new UIListPool(UIListCell);
        
        if(this.template){
            this._sizeTemplate = this._uiPool.init(this.template, option.poolSize);
            if(this._sizeTemplate.equals(cc.Size.ZERO)){
                dev.error("节点池创建预制体失败");
                return;
            }
        }
        this._initScrollView();
        
        if(data && data.length>0){
            this.resetData(data);
        }

        return;
    },
	
	/**
	 * 重置数据
	 * @param {Array<any>} data 
	 * @returns 
	 */
	resetData(data){
		this._data.length = 0;
        this.appendData(data);

        this._initContent();
        
        this._dirty = true;
        let option = this._option;
        if(option.initImmediate){
            this._needUpdateForce = true;
            // while(this._dirty){
            //     this._updateContent();
            //     this._updateScrollViewSize();
            // }
        }
	},
	/**
	 * 尾部追加数据
	 * @param {Array<any>} data 
	 */
    appendData(data){
        if(!(data instanceof Array)){
            data = [];
        }
        if(data.length > 0){
            this._data.push(...data);
            this._dirty = true;
        }
    },
	
    /**
	 * 头部追加数据
	 * @param {Array<any>} data 
	 */
    frontData(data){
        if(!(data instanceof Array)){
            data = [];
        }
        if(data.length > 0){
            this._data.unshift(...data);
            for (let i = 0; i < data.length; i++) {
                this._addCellAtHead();
            }      
        }
    },

    /**
     * 中间插入数据
     * @param {*} data 
     * @param {*} index 插入到原始数据的哪个索引位置
     */
    insertData(data, index){
        if(typeof index != "number"){
            dev.error("insertData: 插入数据需要指定 index，表示插入到哪个索引位置");
            return;
        }

        if(!(data instanceof Array)){
            data = [];
        }
        if(data.length == 0){
            return;
        }

        if(index==0){
            this.frontData(data);
        }
        else if(index<0||index>=this._data.length){
            this.appendData(data);
        }
        else{
            for (let i = 0; i < data.length; i++) {
                this._data.splice(index, 0, data[i]);
                this._doInsertCell(index);
                index++;
            }
        }
        this._dirty = true;
    },

    /**
     * 删除原始数据中指定索引的数据
     * @param {number} index 原始数据位置索引
     */
    removeData(index){
        if(index < 0 || index >= this._data.length){
            return;
        }

        this._dirty = true;
        let target = this.queryCell((cell)=>{
            return cell.getIndex() == index;
        })
        if(target){
            this.removeCell(target);
        }
        else{
            if(index<this._indexHead){
                // dev.log("head");
                let indexTarget = index;
                let indexSelected = this.getSelectIndex();
                
                //更新索引
                this.foreachCell(e=>{
                    let index = e.getIndex();
                    if(index>=indexTarget){
                        e.setIndex(index-1);
                        e.onRefresh();
                        return false;
                    }
                    else{
                        return true;
                    }
                })

                let infos = [];
                //更新信息
                this._deleteHeadInfo(indexTarget);

                this._infoHead.forEach(info => {
                    if(info.index>indexTarget){
                        info.index--;
                    }
                    infos.push(info);
                });
                this._infoHead.clear();
                infos.forEach(info=>{
                    this._infoHead.set(info.index, info);
                })

                infos = [];
                //更新信息
                this._infoTail.forEach(info => {
                    if(info.index>indexTarget){
                        info.index--;
                    }
                    infos.push(info);
                });
                this._infoTail.clear();
                infos.forEach(info=>{
                    this._infoTail.set(info.index, info);
                })

                // 如果已选中的节点在要删除的目标节点之后
                if(indexSelected>indexTarget){
                    this._curCellIndex -= 1;
                }
                else if(indexSelected == indexTarget){
                    this._curCellIndex = -1;
                }

                this._indexHead--;
                this._indexTail--;
                this._data.splice(indexTarget, 1);
            }
            else if(index>this._indexTail){
                // dev.log("tail");
                let indexTarget = index;
                let indexSelected = this.getSelectIndex();
                
                //更新索引
                this.foreachCell(e=>{
                    let index = e.getIndex();
                    if(index>=indexTarget){
                        e.setIndex(index-1);
                        e.onRefresh();
                        return false;
                    }
                    else{
                        return true;
                    }
                })

                let infos = [];
                //更新信息
                this._deleteTailInfo(indexTarget);
                
                this._infoTail.forEach(info => {
                    if(info.index>indexTarget){
                        info.index--;
                    }
                    infos.push(info);
                });
                this._infoTail.clear();
                infos.forEach(info=>{
                    this._infoTail.set(info.index, info);
                })

                // 如果已选中的节点在要删除的目标节点之后
                if(indexSelected>indexTarget){
                    this._curCellIndex -= 1;
                }
                else if(indexSelected == indexTarget){
                    this._curCellIndex = -1;
                }
                
                this._data.splice(indexTarget, 1);
            }
            else{
                dev.error("代码逻辑出错，请检查");
            }
        }
    },

    /**
     * 根据条件删除原始数据
     * @param {Function} callback (data, index)=>boolean 返回 true 时删除原始数据
     */
    removeDataByCondition(callback){
        if(typeof callback != 'function'){
            return;
        }

        let array = this._data;
        for (let index = array.length-1; index >= 0; index--) {
            const data = array[index];
            if(callback && callback(data, index)){
                this.removeData(index);
                break;
            }
        }
    },
	
	/**
	 * 获取列表所有数据
	 * @returns 
	 */
	getAllData(){
		return this._data;
	},
	/**
	 * 获取列表所有节点
	 * @returns 
	 */
	getAllCell(){
		if(!this.layoutContainer){
			return [];
		}
		return this.layoutContainer.node.children;
	},
	/**
	 * 查询列表内的节点
	 * @param {*} callback：(cell: UIListCell)=>boolean 
	 * @returns 
	 */
	queryCell(callback){
		let target = null;
		this.foreachCell((cell)=>{
			if(callback(cell)){
				target = cell;
				return true;
			}
			return false;
		})
		return target;
	},
	/**
	 * 删除一个节点
	 * @param {UIListCell} cell 
	 */
	removeCell(target){
        if (!target){
            return;
        }

		this._doDestroyCell(target);
	},

    // /**
	//  * 删除一个数据
	//  * @param {*} callback：(cell: UIListCell)=>boolean 
	//  */
	// removeData(callback){
    //     for (let i = 0; i < this._data.length; i++) {
    //         if(callback(this._data[i])){
    //             this._data.splice(i, 1);
	// 			break;
	// 		}
            
    //     }
	// },

	/**
	  * 遍历列表内的所有节点（索引从后往前遍历）
	 * @param {*} callback：(cell: UIListCell)=>boolean 
	 * @returns 
	 */
	foreachCell(callback){
		let handled = false;
		let array = this.getAllCell();
		for (let index = array.length-1; index >= 0 ; index--) {
			const child = array[index];
			let cell = child.getComponent(UIListCell);
			handled = callback(cell);
			if(handled){
				return;
			}
		}
	},
	/**
	 * 下拉刷新完成时回调
	 * @param {Array | null} data 
	 */
	onRefreshFinish(data){
		if(!data){
			//TODO
			dev.warn("暂无刷新数据");
		}
		else{
			this.resetData(data);
		}
		this._refreshFinish(true);
	},
	/**
	 * 上拉加载完成时回调
	 * @param {Array | null} data 
	 */
	 onLoadMoreFinish(data, isFront){
		if(!data || data.length==0){
			//没有更多数据了
			dev.warn("暂无更多数据");
		}
		else{
            if (isFront){
                this.frontData(data);
            }else{
                this.appendData(data);
            }
			
		}
		this._loadMoreFinish(true);
	},
	
    setDirty(){
        this._dirty = true;
    },

    /**
	 * 在头部添加一个节点
	 * @param {UIListCell} cell 
	 */
	_addCellAtHead(){
        let indexTarget = 0;
		let indexSelected = this.getSelectIndex();

        //更新索引
        this.foreachCell(e=>{
            let index = e.getIndex();
            e.setIndex(index+1);
            e.onRefresh();
        })

        let infos = [];
        //更新信息
        this._infoHead.forEach(info => {
            info.index++;
            infos.push(info);
        });
        this._infoHead.clear();
        infos.forEach(info=>{
            this._infoHead.set(info.index, info);
        })
		this._indexHead++;

        infos = [];
        this._infoTail.forEach(info => {
            info.index++;
            infos.push(info);
        });
        this._infoTail.clear();
        infos.forEach(info=>{
            this._infoTail.set(info.index, info);
        })
        this._indexTail++;

        // 如果已选中的节点在要增加的目标节点之后，插入目标节点后需要将已选节点索引增加1位
		if(indexSelected>=indexTarget){
			this._curCellIndex += 1;
		}

		this._dirty = true;
    },

    _clear(){
        this._delegate = null;
        this._clearContent();
        if(this._uiPool){
            this._uiPool.clear();
            this._uiPool = null;
        }
    },
    _updateContent() {
        if(!this.layoutContainer){
            return;
        }

        let processed = false;
        
        if(this._addHead()){
            processed = true;
            //在头部增加节点时，判断一次尾部是否可删除。避免快速长距离划动时，头部一直在增加。
            this._removeTail();
        } 
        if(!processed && this._removeHead()){
            processed = true;
            this._addTail();
        }
        if(!processed && this._addTail()){
            processed = true;
            this._removeHead();
        }
        if(!processed && this._removeTail()){
            processed = true;
        }
        if(!processed){
            this._dirty = false;
        }
    },
    
	/**
	 * 
	 * @param {boolean} isHead 
	 * @param {number} index 
	 * @param {Object} info : {state: any, width: any, height: any, spacing: any}
	 */
    _setInfo(isHead, index, info){
        let target = isHead ? this._infoHead : this._infoTail;
        target.set(index, {
            index: index,
            ...info
        })
    },
	_deleteInfo(isHead, index){
		let target = isHead ? this._infoHead : this._infoTail;
		if(target.has(index)){
			target.delete(index);
		}
	},

    _doInsertCell(index){
        let indexTarget = index;
		let indexSelected = this.getSelectIndex();
		
        //更新索引
        this.foreachCell(e=>{
            let index = e.getIndex();
            if(index>=indexTarget){
                e.setIndex(index+1);
                e.onRefresh();
                return false;
            }
            else{
                return true;
            }
        })

        let infos = [];
        //更新信息
        this._infoHead.forEach(info => {
            if(info.index>=indexTarget){
                info.index++;
            }
            infos.push(info);
        });
        this._infoHead.clear();
        infos.forEach(info=>{
            this._infoHead.set(info.index, info);
        })

        infos = [];
        //更新信息
        this._infoTail.forEach(info => {
            if(info.index>=indexTarget){
                info.index++;
            }
            infos.push(info);
        });
        this._infoTail.clear();
        infos.forEach(info=>{
            this._infoTail.set(info.index, info);
        })

		// 如果已选中的节点在要插入的目标节点之后，插入目标节点后需要将已选节点索引增加1位
		if(indexSelected>=indexTarget){
			this._curCellIndex += 1;
		}

		// 从中间插入的
		if(indexTarget > this._indexHead && indexTarget <= this._indexTail){
            this._addCell(indexTarget);
            this._indexTail++;
        }	
    },

	/**
	 * 
	 * @param {number} index 
	 * @param {boolean} isHead 
	 * @returns 
	 */
    _addCell(index, isHead){
        if(index>=this._data.length) return null;

        let data = this._data[index];
        
        let cell = this._delegate.doInstantiateCell(index, data);
        if(!cell){
            let node = this._uiPool.reuse();
            cell = node.getComponent(UIListCell);
        }
        
        let node = cell.node;
		node.active = true;
        let info = null;
        if(index<this._indexHead){
            info = this._infoHead.get(index)
        }
        else if(index>this._indexTail){
            info = this._infoTail.get(index)
        }
        // info = isHead ? this._infoHead.get(index) : this._infoTail.get(index);
        cell.onCreate(this, data, index, info);
        this._delegate.onCreateCell(cell);
        node.parent = this.layoutContainer.node;

        if(index<this._indexHead){
            node.setSiblingIndex(0);
        }
        else if(index>this._indexTail){

        }
        else{
            let SiblingIndex = index - this._indexHead;
            node.setSiblingIndex(SiblingIndex);
        }
        // if(isHead){
        //     node.setSiblingIndex(0);
        // }
        cell.onAttach();
        this._delegate.onAttachCell(cell);

        //如果该节点之前已被选中
        if(cell.getIndex()==this.getSelectIndex()){
            this._onSelectCell(cell);
        }
        
        this._updateLayoutContainerSize();
        
        return cell;
    },
	
	/**
	 * 
	 * @param {UIListCell} cell 
	 */
    _removeCell(cell){
        //如果该节点之前已被选中
        if(cell.getIndex()==this.getSelectIndex()){
            this._unSelectCell(cell);
        }
        let handled = this._delegate.doRemoveCell(cell);
        if(!handled){
            this._uiPool.unuse(cell.node);
        }
        this._updateLayoutContainerSize();
    },
    _needAddHead(){
        if(this._indexHead<=0){
            return false;
        }

        let heads = this._getHeadItems();
        if(!heads.cell0){
            return true;
        }

        let result = {};
        if(this._containsItem(heads.cell0, result)){
            return true;
        }
        else{
            const {rectView, rectItem} = result;
            if(this.vertical){
                //如果节点被瞬间拖动超出列表底部，此时需要增加
                if(rectItem.yMax < rectView.yMax){
                    return true;
                }
            }
            else if(this.horizontal){
                //如果节点被瞬间拖动超出列表右侧，此时需要增加
                if(rectItem.xMax < rectView.xMax){
                    return true;
                }
            }
        }
        return false;
    },
    _deleteHeadInfo(index){
        let info = this._infoHead.get(index);
        if(info){
            if(this.vertical){
                if(!this._isGrid){
                    this.layoutHead.height -= (info.height + info.spacing);
                }
                else{
                    if(this._indexHead%this._gridColumn==(this._gridColumn-1)){
                        this.layoutHead.height -= (info.height + info.spacing);
                    }
                }

                this.layoutHead.height = Math.max(this.layoutHead.height, 0);
            }
            else{
                if(!this._isGrid){
                    this.layoutHead.width -= (info.width + info.spacing);
                }
                else{
                    if(this._indexHead%this._gridColumn==(this._gridColumn-1)){
                        this.layoutHead.width -= (info.width + info.spacing);
                    }
                }
                
                this.layoutHead.width = Math.max(this.layoutHead.width, 0);
            }
            
            this._deleteInfo(true, index);
        }
    },
    _deleteTailInfo(index){
        let info = this._infoTail.get(index);
        if(info){
            if(this.vertical){
                if(!this._isGrid){
                    this.layoutTail.height -= (info.height + info.spacing);
                }
                else{
                    if(index%this._gridColumn==0){
                        this.layoutTail.height -= (info.height + info.spacing);
                    }
                }
                
                this.layoutTail.height = Math.max(this.layoutTail.height, 0);
            }
            else{
                if(!this._isGrid){
                    this.layoutTail.width -= (info.width + info.spacing);
                }
                else{
                    if(index%this._gridColumn==0){
                        this.layoutTail.width -= (info.width + info.spacing);
                    }
                }

                this.layoutTail.width = Math.max(this.layoutTail.width, 0);
            }
            this._deleteInfo(false, index);
        }
    },
    _addHead(){
        let modify = this._needAddHead();
        if(!modify){
            if(this._canShowRefresh()){
                this._showRefreshItem(this.layoutRefresh);
            }
            
            return false;
        }

        let _add = () => {
            let index = this._indexHead - 1;
            let item = this._addCell(index, true);
            let handled = false;
            if(item){
                handled = true;
                this._deleteHeadInfo(index);

                this._indexHead = index;
                if(this._indexTail<this._indexHead){
                    this._indexTail = this._indexHead;
                    handled = false;
                }
            }
            return handled;
        };

        let column = this._gridColumn;
        while (column>0 && modify) {
            modify = _add();
            column--;
        }
        this._updateScrollViewSize();
        return modify;
    },
    _canRemoveHead(){
        let heads = this._getHeadItems();
        if(!heads.cell0 || !heads.cell1){
            return false;
        }
            
        let result0 = {};
        let result1 = {};
        let hit0 = this._containsItem(heads.cell0, result0);
        let hit1 = this._containsItem(heads.cell1, result1);

        if(!hit0 && !hit1){
            const {rectView, rectItem} = result0;
            
            if(this.vertical){
                //如果节点被瞬间拖动超出列表底部，此时不可删除
                if(rectItem.yMax < rectView.yMax){
                    return false;
                }
                return true;
            }
            else if(this.horizontal){
                //如果节点被瞬间拖动超出列表右侧，此时不可删除
                if(rectItem.xMax < rectView.xMax){
                    return false;
                }
                return true;
            }
        }

        return false;
    },
    _removeHead(){
        let modify = this._canRemoveHead();
        if(!modify) return false;

        let _remove = () => {
            let children = this.layoutContainer.node.children;
            if(children.length<=0){
                return false;
            }

            let node = children[0];
            let height = node.height;
            let width = node.width;
            let spacing = 0;
            if(this.vertical){
                if(children.length>1){
                    spacing = this.layoutContainer.spacingY;
                }
                if(!this._isGrid){
                    this.layoutHead.height += (height + spacing);
                }
                else{
                    if(this._indexHead%this._gridColumn==(this._gridColumn-1)){
                        this.layoutHead.height += (height + spacing);
                    }
                }
            }
            else if(this.horizontal){
                if(children.length>1){
                    spacing = this.layoutContainer.spacingX;
                }
                if(!this._isGrid){
                    this.layoutHead.width += (width + spacing);
                }
                else{
                    if(this._indexHead%this._gridColumn==(this._gridColumn-1)){
                        this.layoutHead.width += (width + spacing);
                    }
                }
            }
            
            let cell = node.getComponent(UIListCell);
            this._setInfo(true, this._indexHead, {
                state: cell.getState(),
                height,
                width,
                spacing,
            });
            this._removeCell(cell);
            this._indexHead++;
            if(this._indexHead>this._indexTail){
                this._indexTail = this._indexHead;
                return false;
            }
            return true;
        };
        
        let column = this._gridColumn;
        while (column>0 && modify) {
            modify = _remove();
            column--;
        }
        this._updateScrollViewSize();

        return true;
    },
    _needAddTail(){
        if(this._indexTail>=this._data.length-1){
            return false;
        }

        let tails = this._getTailItems();

        if(!tails.cell0){
            return true;
        }

        let result = {};
        if(this._containsItem(tails.cell0, result)){
            return true;
        }
        else{
            const {rectView, rectItem} = result;
            if(this.vertical){
                //如果节点被瞬间拖动超出列表顶部，此时需要增加
                if(rectItem.yMin > rectView.yMin){
                    return true;
                }
            }
            else if(this.horizontal){
                //如果节点被瞬间拖动超出列表左侧，此时需要增加
                if(rectItem.xMin < rectView.xMin){
                    return true;
                }
            }
        }

        return false;
    },
    _addTail(){
        let modify = this._needAddTail();
        if(!modify){
            if(this._canShowLoadMore()){
                this._showRefreshItem(this.layoutLoadMore, true);
            }
            return false;
        } 
        let _add = () => {
            let index = this._indexTail + 1;
            let item = this._addCell(index, false);
            let handled = false;
            if(item){
                handled = true;
                this._deleteTailInfo(index);
                this._indexTail = index;
                if(this._indexHead<0){
                    //head初始化
                    this._indexHead = 0;
                }
            }
            return handled;
        };

        let column = this._gridColumn;
        if(this._isGrid){
            let count = this.layoutContainer.node.children.length;
            column = count%this._gridColumn;
            if(column==0){
                column = this._gridColumn;
            }
            else{
                column = this._gridColumn - column;
            }
        }

        while (column>0 && modify) {
            modify = _add();
            column--;
        }
        this._updateScrollViewSize();
        return modify;
    },
    _canRemoveTail(){
        let tails = this._getTailItems();
        if(!tails.cell0 || !tails.cell1){
            return false;
        }

          
        let result0 = {};
        let result1 = {};
        let hit0 = this._containsItem(tails.cell0, result0);
        let hit1 = this._containsItem(tails.cell1, result1);

        if(!hit0 && !hit1){
            const {rectView, rectItem} = result0;
            
            if(this.vertical){
                //如果节点被瞬间拖动超出列表顶部，此时不可删除
                if(rectItem.yMin > rectView.yMin){
                    return false;
                }
                return true;
            }
            else if(this.horizontal){
                //如果节点被瞬间拖动超出列表左侧，此时不可删除
                if(rectItem.xMin < rectView.xMin){
                    return false;
                }
                return true;
            }
        }

        return false;
    },
    _removeTail(){
        if(!this._canRemoveTail()) return false;

        this._doRemoveTail();
        return true;
    },
	_doRemoveTail(){
		let _remove = () => {

            let children = this.layoutContainer.node.children;
            if(children.length<=0){
                return false;
            }
            
            let node = children[children.length-1];
            
            let cell = node.getComponent(UIListCell);
            if(true){
                let width = node.width;
                let height = node.height;
                let spacing = 0;
				
				if(this.vertical){
					if(children.length>1){
						spacing = this.layoutContainer.spacingY;
					}
					if(!this._isGrid){
						this.layoutTail.height += (height + spacing);
					}
					else{
						if(this._indexTail%this._gridColumn==0){
							this.layoutTail.height += (height + spacing);
						}
					}
				}
				else if(this.horizontal){
					if(children.length>1){
						spacing = this.layoutContainer.spacingX;
					}
					if(!this._isGrid){
						this.layoutTail.width += (width + spacing);
					}
					else{
						if(this._indexTail%this._gridColumn==0){
							this.layoutTail.width += (width + spacing);
						}
					}
				}
				this._setInfo(false, this._indexTail, {
					state: cell.getState(),
					height,
					width,
					spacing,
				});
            }
            this._removeCell(cell);
            this._indexTail--;
            if(this._indexHead>this._indexTail){
                this._indexHead = this._indexTail;
            }
            return true;
        };

        let column = this._gridColumn;
        if(this._isGrid){
            let count = this.layoutContainer.node.children.length;
            column = count%this._gridColumn;
            if(column==0){
                column = this._gridColumn;
            }
        }

		let modify = true;
        while (column>0 && modify) {
            modify = _remove();
            column--;
        }
        this._updateScrollViewSize();
	},

	/**
	 * 销毁一个节点(删除一个节点，并将 _data 中的数据一起删除)
	 * @param {*} cell 
	 */
	_doDestroyCell(cell){
		let indexTarget = cell.getIndex();
		let indexSelected = this.getSelectIndex();
		
		//从中间删除的
		if(indexTarget != this._indexTail){
			//更新索引
			this.foreachCell(e=>{
				let index = e.getIndex();
				if(index>indexTarget){
					e.setIndex(index-1);
					e.onRefresh();
					return false;
				}
				else{
					return true;
				}
			})

			let infos = [];
			//更新信息
			this._infoTail.forEach(info => {
				if(info.index>=indexTarget){
					info.index--;
					infos.push(info);
				}
			});
			this._infoTail.clear();
			infos.forEach(info=>{
				this._infoTail.set(info.index, info);
			})
		}
		
		this._removeCell(cell);
		this._indexTail--;
		
		// 如果已选中的节点在要删除的目标节点之后，删除目标节点后需要将已选节点索引提前1位
		if(indexSelected>indexTarget){
			this._curCellIndex -= 1;
		}
		else if(indexSelected == indexTarget){
			this._curCellIndex = -1;
		}
		
		//删除1条数据
		this._data.splice(indexTarget, 1);
		this._dirty = true;
	},
    
    _canShowRefresh(){
        if(this._indexHead>0){
            return false;
        }
		if(this.scroll.isAutoScrolling()){
			return false;
		}
		
        let flag = false;
        let offset = this.scroll.getScrollOffset();
        if(this.vertical){
            if(offset.y < 0 - this._sizeRefresh.height){
                flag = true;
            }
        }
        else if(this.horizontal){
            if(offset.x > 0 + this._sizeRefresh.width){
                flag = true;
            }
        }

        return flag;
    },
    _canHideRefresh(){
        if(!this._refreshing || this._refreshHandling){
            return false;
        }
        if(this.layoutRefresh){
			if(this.layoutRefresh.isScaling() || this.layoutRefresh.isHandling()){
				return false;
			}
        }

        let flag = false;
        let offset = this.scroll.getScrollOffset();
        if(this.vertical){
            if(offset.y > 0+this._option.minOffset){
                flag = true;
            }
        }
        else if(this.horizontal){
            if(offset.x < 0+this._option.minOffset){
                flag = true;
            }
        }

        return flag;
    },
    _canShowLoadMore(){
        if(this._indexTail<this._data.length-1){
            return false;
        }
		if(this.scroll.isAutoScrolling()){
			return false;
		}
		
        let flag = false;

        let offsetMax = this.scroll.getMaxScrollOffset();
        let offset = this.scroll.getScrollOffset();
        if(this.vertical){
            if(offset.y > offsetMax.y + this._sizeLoadMore.height){
                flag = true;
            }
        }
        else if(this.horizontal){
            if(offset.x < -(offsetMax.x + this._sizeLoadMore.width)){
                flag = true;
            }
        }
        
        return flag;
    },
    _canHideLoadMore(){
        if(!this._loading || this._loadMoreHandling){
            return false;
        }
        if(this.layoutLoadMore){
			if(this.layoutLoadMore.isScaling() || this.layoutLoadMore.isHandling()){
				return false;
			}
        }

        let flag = false;

        let offsetMax = this.scroll.getMaxScrollOffset();
        let offset = this.scroll.getScrollOffset();
        if(this.vertical){
            if(offset.y < offsetMax.y - this._option.minOffset){
                flag = true;
            }
        }
        else if(this.horizontal){
            if(offset.x > -(offsetMax.x - this._option.minOffset)){
                flag = true;
            }
        }
        return flag;
    },
    _refreshStart(){
		// dev.log("_refreshStart", this._refreshHandling);
        if(this.layoutRefresh){
			if(!this.layoutRefresh.isHandling()){
				this.layoutRefresh.handling(()=>{
					this._delegate.onRefreshStart();
				});
			}
		}
		else if(this.needDownRefresh){
			if(this._refreshHandling){
				return;
			}
			this._refreshHandling = true;
			this._delegate.onRefreshStart();
		}
    },
    _refreshFinish(handled=false){
		// dev.log("_refreshFinish");
        this._refreshHandling = false;
        this._refreshing = false;
        this._hideRefreshItem(this.layoutRefresh, handled);
    },
    _loadMoreStart(){
		// dev.log("_loadMoreStart");
		if(this.layoutLoadMore){
			if(!this.layoutLoadMore.isHandling()){
				this.layoutLoadMore.handling(()=>{
					this._delegate.onLoadMoreStart();
				});
			}
		}
		else if(this.needLoadMore){
			if(this._loadMoreHandling){
				return;
			}
			this._loadMoreHandling = true;
			this._delegate.onLoadMoreStart();
		}
    },
    _loadMoreFinish(handled=false){
		// dev.log("_loadMoreFinish");
        this._loadMoreHandling = false;
        this._loading = false;
        this._hideRefreshItem(this.layoutLoadMore, handled, true);
    },
	/**
	 * 
	 * @param {UIListRefresh} target 
	 * @param {boolean} isLoadMore 
	 */
    _showRefreshItem(target, isLoadMore = false){
		// dev.log("_showRefreshItem", isLoadMore, this._loading, this._refreshing);
		if(isLoadMore){
			// if(this._loading){
			// 	return;
			// }
            this._loading = true;
        }
        else{
			// if(this._refreshing){
			// 	return;
			// }
            this._refreshing = true;
        }
		
		if(target && !target.isShowing()){
			target.show();
		}
    },
	/**
	 * 
	 * @param {UIListRefresh} target 
	 * @param {boolean} handled 
	 * @param {boolean} isLoadMore 
	 */
    _hideRefreshItem(target, handled = true, isLoadMore = false){
		// dev.log("_hideRefreshItem", handled, isLoadMore);
        if(!isLoadMore){
            this.scroll.scrollToOffset(cc.Vec2.ZERO, 0.2);
        }
		if(target){
			if(handled){
				target.handled();
			}
			else{
				target.cancel();
			}
		}
    },
    /**
	 * 滑动过程中触发
	 * @param {ScrollView} target 
	 */
    _onScrolling(target){
		this._super(target);
        if(this._canHideRefresh()){
            this._refreshFinish();
        }
        else if(this._canHideLoadMore()){
            this._loadMoreFinish();
        }

        this._dirty = true;
    },
	/**
	 * 回弹结束时触发
	 * @param {ScrollView} target 
	 */
    _onScrollEnded(target){
		if(!this._super(target)){
			return;
		}

		// let offset = this.scroll.getScrollOffset();
		// let offsetMax = this.scroll.getMaxScrollOffset();
		// dev.log("end offset: ", offset.toString(), offsetMax.toString())

        if(this._refreshing){
			// dev.log("_refreshing", this._refreshing, this._refreshHandling);
			if(this.layoutRefresh){
				if(!this.layoutRefresh.isHandling()){
					this._refreshFinish(false);
				}
			}
			else if(!this._refreshHandling){
                this._refreshFinish(false);
            }
        }
        else if(this._loading){
			// dev.log("_loading", this._loading, this._loadMoreHandling);
			if(this.layoutLoadMore){
				if(!this.layoutLoadMore.isHandling()){
					this._loadMoreFinish(false);
				}
			}
            else if(!this._loadMoreHandling){
                this._loadMoreFinish(false);
            }
        }
    },
    _onBounceMin(){
		if(!this._super()){
			return;
		}

        if(this._refreshing){
            this._refreshStart();
        }
    },
    _onBounceMax(){
		if(!this._super()){
			return;
		}
		
        if(this._loading){
            this._loadMoreStart();
        }
    },
})
