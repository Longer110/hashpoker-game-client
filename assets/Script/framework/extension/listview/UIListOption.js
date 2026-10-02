/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2023-01-05 10:10:57
 * @LastEditors: OreoWang
 * @LastEditTime: 2023-01-13 11:08:38
 * @Description: 
 */

const POOL_SIZE = 5;        //template 节点缓存池大小 (取值大于等于1)
const EXTEND_SIZE = 2;      //扩展加载 EXTEND_SIZE 个 item (取值大于等于0)
const MIN_OFFSET = 10;      //最小偏移值 (取值大于等于0)
const INIT_IMMEDIATE = true; //是否立即初始化
const AUTO_SET_CONTENT = true; //是否自动初始化设置 ScrollView.content 的锚点、宽高等属性


let DefaultOption = {
    poolSize: POOL_SIZE,
    extendSize: EXTEND_SIZE,
    minOffset: MIN_OFFSET,
    initImmediate: INIT_IMMEDIATE,
    autoSetContent: AUTO_SET_CONTENT,
    statusRefresh: {
        normal: "下拉刷新",
        handling: "正在刷新",
        handled: "刷新完成",
        cancel: "取消刷新"
    },
    statusLoadMore: {
        normal: "上拉加载",
        handling: "正在加载",
        handled: "加载完成",
        cancel: "取消加载"
    }
}


module.exports = {
	DefaultOption,
}