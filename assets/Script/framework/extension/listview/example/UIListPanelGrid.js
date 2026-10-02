/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2023-01-05 16:09:37
 * @LastEditors: OreoWang
 * @LastEditTime: 2023-01-11 10:57:03
 * @Description: 
 */

const UIListCell = require("UIListCell");

cc.Class({
	extends: UIListCell,

	properties: {
		label: {
			default: null,
			type: cc.Label,
		},
		select: {
			default: null,
			type: cc.Node,
		}
	},
	
	onInit(data){
		this.select.active = false;
		this._updateText();
	},

	onRefresh(){
		this._updateText();
	},
	
	_updateText(){
		let data = this.getData();
		this.label.string = this.getIndex()+": cell-"+data.index;
	},

	onSelect(){
		this.select.active = true;
	},
	unSelect(){
		this.select.active = false;
	},
})