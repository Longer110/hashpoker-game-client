cc.Class({
    extends: cc.Component,

    properties: {
     
    },

    onLoad () {
       
    },

    onDestroy(){
        
    },

    onStart() {

    },

    onEnable(){
        App.setAppSlideable(false);
    },
    onDisable(){
        App.setAppSlideable(true);   
    },

});
