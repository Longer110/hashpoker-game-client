/*
 * @Author: ihc523@163.com
 * @Date: 2021-04-14 15:15:56
 * @LastEditors: ihc523@163.com
 * @LastEditTime: 2022-03-17 16:31:53
 * @Description: 
 */
let utils = require("./utils");
let builder = require("./builder");
let bundler = require("./bundler");
let shelljs = require("shelljs");

let task = new Promise(function(resolve, reject) {
  setTimeout(() => {
      return resolve();
  }, 0);  
});
task
// .then(function (params) {
//     //生成所有bundle、所有多语言的最终关联信息
//     return bundler.asyncGenerateAllBundleLangAssets()
// })
.then(function (params) {
    return builder.buildBunleLangAssets();
})
// .then(function (params) {
//     return builder.runTaskAll();
// })
.then(function (params) {
    utils.log("任务执行结束");
})
.catch(function (reason) {
    utils.error("error: ", reason);
})

// function getSvnVersion() {
//   // var name = shelljs.exec("svn info").split('\n')[6].match(/\d+/ig)[0];
//   var name = utils.getSvnVersion();
//   return name
// }

// console.log("version: ", getSvnVersion());