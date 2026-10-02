// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let qrcode = require('qrcode')

cc.Class({
	extends: cc.Component,
	properties: {
		target: cc.Node,
	},
	// use this for initialization
	onLoad() {
		
	},

	init(url){
		//注意 最好把qrImage与qrcode的节点长宽设置为2的倍数。不然可能会出现无法识别二维码
		var ctx = this.target.getComponent(cc.Graphics)
		if (!ctx)
		{
			ctx = this.target.addComponent(cc.Graphics); //添加绘画组件
		}
		ctx.enabled = true;
		 
		if (typeof (url) !== 'string') {
			 //console.log('url is not string',url);
			return;
		}
		this.QRCreate(ctx, url);
	},

	QRCreate(ctx, url) {
		qrcode.addData(url);
		qrcode.make();

		ctx.fillColor = cc.Color.BLACK;
		//块宽高
		var tileW = this.target.width / qrcode.getModuleCount();
		var tileH = this.target.height / qrcode.getModuleCount();
		
		// draw in the Graphics
		for (var row = 0; row < qrcode.getModuleCount(); row++) {
			for (var col = 0; col < qrcode.getModuleCount(); col++) {
				if (qrcode.isDark(row, col)) {
					// ctx.fillColor = cc.Color.BLACK;
					var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
					var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
					ctx.rect(Math.round(col * tileW), Math.round(row * tileH), w, h);
					ctx.fill();
				}
			}
		}
	},

});