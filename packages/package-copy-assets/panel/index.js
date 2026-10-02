// panel/index.js, this filename needs to match the one registered in package.json

var firefs = require("fire-fs");
var fsextra = require("fs-extra");
var fs = require("fs");
var path = require("path");
var utils = Editor.require("packages://package-copy-assets/src/utils");

Editor.Panel.extend({
  // css style for panel
  style: firefs.readFileSync(Editor.url("packages://package-copy-assets/panel/less.css", "utf8")),

  template: firefs.readFileSync(Editor.url("packages://package-copy-assets/panel/index.html", "utf8")),

  // // html template for panel
  // template: `
  //   <h2>package-copy-assets</h2>
  //   <hr />
  //   <div>State: <span id="label">--</span></div>
  //   <hr />
  //   <ui-button id="btn">Send To Main</ui-button>
  // `,

  // element and variable binding
  $: {
    // btn: '#btn',
    // label: '#label',
  },

  // method executed when template and styles are successfully loaded and initialized
  ready() {
    // this.$btn.addEventListener('confirm', () => {
    //   Editor.Ipc.sendToMain('package-copy-assets:clicked');
    // });
    
    let setting = utils.getSetting();
    let isLiveOnly = utils.getIsLiveOnly();

    let setting_file = Editor.url("packages://package-copy-assets/panel/setting.json", "utf8");

    let _updateSetting = function () {
      firefs.writeFileSync(setting_file, JSON.stringify(setting, null, 4));
      Editor.log("配置已保存："+setting_file);
      Editor.log("setting = ", JSON.stringify(setting, null, 4));
    }
    
    if(firefs.existsSync(setting_file)){
      // let content = firefs.readFileSync(setting_file, "utf8");
      // setting = JSON.parse(content);
    }
    else{
      _updateSetting();
    }
    
    // Editor.log("setting", Editor.Project.path, setting);
    new window.Vue({
      el: this.shadowRoot,
      data: {
        options: setting,
        message: 'Hello World',
        strProjectVersion: utils.getProjectVersion(),
        curBuildTarget: setting.curBuildTarget,
      },
      computed:{
        strFullPath:function(){
          let input_path = this.options.strPathTarget;
          let full_path = input_path;
          if(input_path.startsWith(".")){
            full_path = path.join(Editor.Project.path, input_path);
          }
          else{
            
          }
          return full_path;
        },
        // strProjectVersion: function (params) {
        //   return utils.getProjectVersion();
        // },
        strProjectVersionTitle: function (params) {
          let project_main = isLiveOnly ? "project-live" : "project-sets";
          let title = setting.isMainBundle ? `主包 ( ${project_main} ) 版本号` : `子游戏 ( ${setting.name} ) 版本号`;
          let file_version = utils.getProjectVersionFile();
          title += ` ( 自动同步 ${file_version} )`
          return title;
        },
        strSvnVersion: function (params) {
          let svn_version = utils.getSvnVersion();
          // let title = "当前项目 svn 版本号: ( " + svn_version + " )";
          return svn_version;
        }
      },
      methods: {
        onAutoCopy(event) {
          // event.stopPropagation();
          setting.isAutoCopy = !setting.isAutoCopy;
          this.updateSetting();
        },
        onCheckMainBundle(event) {
          // event.stopPropagation();
          setting.isMainBundle = !setting.isMainBundle;
          this.updateSetting();
        },
        onChangeTarget(event){
          setting.curBuildTarget = event.detail.value;
          this.updateSetting();
        },
        onPathTarget(event) {
          setting.strPathTarget = setting.strPathTarget.trim();
          if(!this.isExistPath()){
            Editor.error("目标路径不存在: path="+this.strFullPath);
            return;
          }
          this.updateSetting();
        },
        updateSetting() {
          _updateSetting();
        },
        isExistPath(){
          return firefs.existsSync(this.strFullPath);
        },
        onChangeVersion(event){
          utils.setProjectVersion(this.strProjectVersion);
        },
        onCopyAssets(event){
          Editor.log("copy");
          Editor.Ipc.sendToMain('package-copy-assets:copy-assets', function (error, answer) {
            if ( error) { //check the error code to confirm a timeout
              if(error.code === 'ETIMEOUT'){
                Editor.error('Timeout for ipc message foobar:greeting');
              }
              else{
                Editor.error(error);
              }
              return;
            }
            if(answer){
              Editor.log("资源复制完成 ", answer);
            }
            Editor.log("资源复制完成: ", this.strFullPath);
          }.bind(this));
        },
      },
    });
  },

  // register your ipc messages here
  messages: {
    'package-copy-assets:hello'(event) {
      // this.$label.innerText = 'Hello!';
    }
  }
});