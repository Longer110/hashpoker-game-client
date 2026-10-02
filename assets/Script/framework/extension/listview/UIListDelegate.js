const dev = console;

const SHOW_LOG = false && CC_DEV;
const DELAY_CALLBACK = 2000;    //延迟回调时间

export default class UIListDelegate {
    _adapter = null;

    constructor(adapter) {
        this._adapter = adapter;
    }

    /**
     * 实例化 Cell 时调用
     * @param cell UIListCell 
     */
    doInstantiateCell(cellIndex, data){
        SHOW_LOG && dev.log(" ---------------- " + cellIndex + " ---------------- ");
        SHOW_LOG && dev.log("UIListDelegate.doInstantiateCell ", cellIndex);
        if(typeof this._adapter.doInstantiateCell != 'function'){
            return null;
        }
        else{
            return this._adapter.doInstantiateCell(cellIndex, data);
        }
    }

    /**
     * 移除 Cell 时调用
     * @param cell UIListCell 
     */
    doRemoveCell(cell){
        SHOW_LOG && dev.log("UIListDelegate.doRemoveCell ", cell.getIndex());
        if(typeof this._adapter.doRemoveCell != 'function'){
            return false;
        }
        else{
            return this._adapter.doRemoveCell(cell); 
        }
    }

    /**
     * 创建 Cell 后回调（此时cell刚创建，cell父节点为空）
     * @param cell UIListCell 
     */
    onCreateCell(cell) {
        SHOW_LOG && dev.log("UIListDelegate.onCreateCell ", cell.getIndex());
        this._adapter.onCreateCell?.(cell);
    }

    /**
     * 挂载 Cell 后回调（此时cell父节点已存在）
     * @param cell UIListCell 
     */
    onAttachCell(cell) {
        SHOW_LOG && dev.log("UIListDelegate.onAttachCell ", cell.getIndex());
        this._adapter.onAttachCell?.(cell);
    }

    /**
     * 点击 Cell 时回调
     * @param cell UIListCell 
     */
    onClickCell (cell) {
        SHOW_LOG && dev.log("UIListDelegate.onClickCell ", cell.getIndex());
        this._adapter.onClickCell?.(cell);
    }

    /**
     * 选中 Cell 时回调
     * @param cell UIListCell 
     */
    onSelectCell(cell) {
        SHOW_LOG && dev.log("UIListDelegate.onSelectCell ", cell.getIndex());
        this._adapter.onSelectCell?.(cell);
    }

    /**
     * 取消选中 Cell 时回调
     * @param cell UIListCell
     */
    unSelectCell(cell) {
        SHOW_LOG && dev.log("UIListDelegate.unSelectCell ", cell.getIndex());
        this._adapter.unSelectCell?.(cell);
    }
    
    /**
     * 改变 Cell 大小时回调
     * @param cell UIListCell
     * @param size cc.Size
     * @param oldSize cc.Size
     */
    onSizeChange(cell, size, oldSize){
        SHOW_LOG && dev.log("UIListDelegate.onSizeChange ", cell.getIndex());
        this._adapter.onSizeChange?.(cell, size, oldSize);
    }

    /**
     * 开始 下拉刷新 时回调
     */
    onRefreshStart(){
        SHOW_LOG && dev.log("UIListDelegate.onRefreshStart ");
        if(typeof this._adapter.onRefreshStart != 'function'){
            dev.warn("UIListDelegate.onRefreshStart ")
        }
        else{
            this._adapter.onRefreshStart();
        }
    }

    /**
     * 开始 上拉加载更多 时回调
     */
    onLoadMoreStart(){
        SHOW_LOG && dev.log("UIListDelegate.onLoadMoreStart ");
        if(typeof this._adapter.onLoadMoreStart != 'function'){
            dev.warn("UIListDelegate.onLoadMoreStart ")
        }
        else{
            this._adapter.onLoadMoreStart();
        }
    }
}