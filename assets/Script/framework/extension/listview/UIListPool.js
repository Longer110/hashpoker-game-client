/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2023-01-05 10:05:46
 * @LastEditors: OreoWang
 * @LastEditTime: 2023-01-05 11:09:56
 * @Description: 
 */

const dev = console;

export default class UIListPool extends cc.NodePool {
    _template = null;

    _instantiate(){
        if(!this._template){
            dev.warn("预制体模板不能为空");
            return null;
        }
    
        let node = cc.instantiate(this._template);
        return node;
    }

    init(template, size){
        this._template = template;

        let node = null;
        for (let index = 0; index < size; index++) {
            node = this._instantiate();
            if(null==node){
                break;
            }
            this.put(node);
        }
        if(node!=null){
            return node.getContentSize();
        }
        return cc.Size.ZERO;
    }

    reuse(){
        let pool = this;
        if(pool.size()==0){
            let node = this._instantiate();
            if(null==node){
                return null;
            }
            pool.put(node);
        }
        
        return pool.get(arguments);
    }

    unuse(node){
        let pool = this;

        // //node.stopAllActions();
        // node.cleanup();// --> node.stopAllActions(), --> eventManager.removeListeners(node); --> child.cleanup();
        
        pool.put(node);//pool.put内部调用node.removeFromParent(false), 不会调用cleanup
    }
}