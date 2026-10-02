'use strict';

var path = require('path');
var fs = require('fs');
let builder = require("./src/builder");
let utils = require("./src/utils");

function formatTimestamp(timestamp) {
  var year = timestamp.getFullYear();
  var date = ('0' + timestamp.getDate()).slice(-2);
  var month = ('0' + (timestamp.getMonth() + 1)).slice(-2);
  var hrs = ('0' + timestamp.getHours()).slice(-2);
  var mins = ('0' + timestamp.getMinutes()).slice(-2);
  var secs = ('0' + timestamp.getSeconds()).slice(-2);
  var prefix = year - 2000;
  return prefix + '' + month + '' + date + '' + hrs + '' + mins + '';
}

let timestamp = "";
function onBeforeBuildFinish(options, callback) {
  if (options.actualPlatform === 'web-mobile') {
    let ChessSetConfigPath = path.join(options.dest, "/public/ChessSetConfig.js");
    timestamp = formatTimestamp(new Date());
    utils.setTimestamp(timestamp);
    if(fs.existsSync(ChessSetConfigPath)){
        var script = fs.readFileSync(ChessSetConfigPath, 'utf8');
        script += '\n' + 'ChessSetConfig.BUILDVERSION = "' + timestamp + '"';
        fs.writeFileSync(ChessSetConfigPath, script);
        Editor.log('更新ChessSet配置，文件路径：' + ChessSetConfigPath);
    }
    else{
        Editor.warn('配置文件不存在：'+ChessSetConfigPath);
    }

    let versionPath = path.join(options.dest, "/public/config.json");
    if(fs.existsSync(versionPath)){
        var script = fs.readFileSync(versionPath, 'utf8');
        var json = JSON.parse(script);
        json.version = timestamp;
        script = JSON.stringify(json);
        fs.writeFileSync(versionPath, script);
        Editor.log('更新ChessSet版本号配置，文件路径：' + versionPath);
    }

    let envPath = path.join(options.dest, "/src/ChessSetEnv.js");
    if(fs.existsSync(envPath)){
      var script = fs.readFileSync(envPath, 'utf8');
      var is_live_only = utils.getIsLiveOnly();
      if(is_live_only){
        script = script.replace(/IS_LIVE_ONLY: false/g, 'IS_LIVE_ONLY: true');
        fs.writeFileSync(envPath, script);
      }
    }
  }

  callback();
}

function onBuildFinished(options, cb) {
  utils.resetTask();
  utils.setOptions(options);
  let setting = utils.getSetting();
  
  let callback = function (error) {
    // 直播live服务器端口
    // 50042 50043
    // 合集home服务器端口（ISLIVE=true）
    // 50042 50043

    // 合集skina服务器端口
    // 11008 11009

    let msg = `
    合集的项目配置了两套端口，由ConfigGame.ISLIVE区分，默认为false; 
    部署到home目录的，是跟直播项目配套的，打包后在src/ChessSetConfig.js里要把ISLIVE改为true。
    `

    let is_live_only = utils.getIsLiveOnly();
    let project_name = is_live_only ? "直播" : "合集";
    Editor.warn(`构建版本: ${timestamp}`);
    Editor.warn(`当前为 【${project_name}】 项目。注意：` + msg);
    
    cb(error);
  }

  if (options.actualPlatform === 'web-mobile') {
    //更新game.html
    let files = fs.readdirSync(options.dest);
    for(let i = 0; i < files.length; i++){
        let filename = files[i];
        if(filename.indexOf('game.')>=0&&filename.indexOf('.html')>=0){
            fs.renameSync(path.join(options.dest, filename), path.join(options.dest, "game.html"));
            break;
        }
    }
  }

  let strPathTarget = utils.getPathTarget();
  if(!fs.existsSync(strPathTarget)){
    Editor.warn("汇总目录不存在，自动创建：" + strPathTarget);
    utils.mkdirs(strPathTarget);
    if(!fs.existsSync(strPathTarget)){
      Editor.error("汇总目录创建失败：" + strPathTarget);
      let error = "扩展包构建汇总目录创建失败，请手动创建：菜单->packages->package-copy-assets"
      Editor.error(error);
      callback(error);
      return;
    }
  }

  //构建后都需要复制子包资源
  if(true || setting.isAutoCopy){
    builder.runTaskAll().then(function (params) {
      callback(null);
    })
    .catch(function (error) {
      callback(error);
    })
  }
  else{
    if(setting.strPathTarget==""){
      Editor.error("请先配置扩展包：菜单->packages->package-copy-assets");
    }
    callback();
  }
}

module.exports = {
  load () {
    // execute when package loaded
    Editor.Builder.on('before-change-files', onBeforeBuildFinish);
    Editor.Builder.on('build-finished', onBuildFinished);
  },

  unload () {
    // execute when package unloaded
    Editor.Builder.removeListener('before-change-files', onBeforeBuildFinish);
    Editor.Builder.removeListener('build-finished', onBuildFinished);
  },

  // register your ipc messages here
  messages: {
    'open' () {
      // open entry panel registered in package.json
      Editor.Panel.open('package-copy-assets');
    },
    'say-hello' () {
      Editor.log('Hello World!');
      // send ipc message to panel
      Editor.Ipc.sendToPanel('package-copy-assets', 'package-copy-assets:hello');
    },
    'clicked' () {
      Editor.log('Button clicked!');
    },
    'copy-assets'(event, ...args){
      Editor.log("copy-assets start: ");
      let callback = function (error) {
        Editor.log("copy-asset finished: ");
        if (event.reply) {
          event.reply(error);
        }
      }
      builder.runTaskAll().then(function (params) {
        callback(null);
      })
      .catch(function (error) {
        callback(error);
      })
    }
  },
};