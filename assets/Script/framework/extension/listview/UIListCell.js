/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2023-01-05 09:58:40
 * @LastEditors: OreoWang
 * @LastEditTime: 2023-01-11 10:56:53
 * @Description: 
 */
cc.Class({
	extends: cc.Component,

	properties: {
		_listView: null, //列表控制器
		_cellData: null,  //外部传入的数据
		_cellState: null, //Cell当前状态数据，主要用于Cell重建时状态还原
		_cellIndex: -1,//当前控件在列表中的索引
		_cacheSize: null,//节点大小改变前的值缓存
		_originalSize: null, //节点原始大小（避免使用NodePool时大小被改变）
	},

	reuse(){
    },
    unuse(){
        this._reset();
    },
    onEnable(){
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
    },
    onDisable(){
        this.node.off(cc.Node.EventType.SIZE_CHANGED, this._onSizeChange, this);
    },
    _reset(){
        this._cellData = null;
        this.setIndex(-1);
    },
    _onSizeChange(){
        let s = cc.size(this.node.width, this.node.height);
        if(this._listView){
            this._listView.onSizeChange(this, s, this._cacheSize);
        }
        this._cacheSize = s;
    },
	
	/**
	 * 由UIlistView自动调用
	 * @param {*} listView 
	 * @param {*} data 
	 * @param {*} index 
	 * @param {*} info : {state?: any, width: number, height: number}
	 */
    onCreate(listView, data, index, info){
        this._originalSize = cc.size(this.node.width, this.node.height);
        this._listView = listView;
        this._cellData = data;
        this.setIndex(index);
        this._cellState = info?.state || {};
        let s = cc.Size.ZERO;
        if(!info){
            s = cc.size(this._originalSize.width, this._originalSize.height);
        }
        else{
            s = cc.size(info.width, info.height);
        }
        this.node.setContentSize(s);
        this._cacheSize = s;
        this.onInit(data);
    },
    //由UIListView调用，子类可重写，实现节点挂载到parent后的初始化逻辑
    onAttach(){
    },

    //由UIListView调用，子类可重写，实现当前控件选中后的逻辑(设置高亮等)
    onSelect(){
    },
    //由UIListView调用，子类可重写，实现当前控件取消选中后的逻辑(取消高亮等)
    unSelect(){
    },

    //Cell在ListView中的索引
    getIndex(){
        return this._cellIndex;
    },
    //更新索引
    setIndex(index){
        this._cellIndex = index;
    },
    //Cell在ListView中的数据
    getData(){
        return this._cellData;
    },
    //Cell当前状态数据，主要用于Cell重建时状态还原
    getState(){
        return this._cellState;
    },
   
    //Cell 内部初始化
    onInit(data){

    },
    /**
     * 刷新（前面的节点被移除后，后面的节点索引会更新）
     */
    onRefresh(){

    },
    //控件点击回调
    onClick(eventny, data){
        this._listView.onClickCell(this);
    },
    /**
     * 从列表中删除节点
     */
	onDelete(){
		this._listView.removeCell(this);
	},
})