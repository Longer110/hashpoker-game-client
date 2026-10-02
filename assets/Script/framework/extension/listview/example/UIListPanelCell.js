/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2023-01-05 16:09:37
 * @LastEditors: OreoWang
 * @LastEditTime: 2023-01-05 16:12:42
 * @Description: 
 */

const UIListCell = require("UIListCell");

cc.Class({
	extends: UIListCell,
	
	onInit(data){
		let item = this;
        let node = item.node;
        let avatarNode = node.getChildByName('avatarNode');
        let avatar = avatarNode.getChildByName('sprite_avatar').getComponent(cc.Sprite);
        let timeNode = node.getChildByName('timeNode');
        let time = timeNode.getChildByName('label_time').getComponent(cc.Label);
        let chatBg = node.getChildByName('chatBg').getComponent(cc.Sprite);
        let chatBgLayout = chatBg.getComponent(cc.Layout);
        let richtext = chatBg.node.getChildByName('richtext_content').getComponent(cc.RichText);

        // let data = item.getData();

        avatarNode.active = chatBg.node.active = data.type != 3;
        timeNode.active = data.type == 3;

        let h = 0;
        let minH = 80;

        let posAvatarNode = avatarNode.getPosition();
        let posRichText = richtext.node.getPosition();
        let scaleAvatar = node.scale;
        switch (data.type) {
            case 1://对方
            posAvatarNode.x = -170;
            scaleAvatar.x = -1;
                avatar.spriteFrame = this.avatar1SF;
                chatBg.spriteFrame = this.bubble1SF;
                posRichText.x = -108;
                richtext.string = data.text;
                richtext._updateRichText();
                chatBgLayout.updateLayout();
                h = Math.abs(chatBg.node.position.y)*2 + chatBg.node.height;
                node.height = h < minH ? minH : h;
                break;
            case 2://我方
            posAvatarNode.x = 170;
            scaleAvatar.x = 1;
                avatar.spriteFrame = this.avatar2SF;
                chatBg.spriteFrame = this.bubble2SF;
                posRichText.x = -122;
                richtext.string = data.text;
                richtext._updateRichText();
                chatBgLayout.updateLayout();
                h = Math.abs(chatBg.node.position.y)*2 + chatBg.node.height;
                node.height = h < minH ? minH : h;
                break;
            case 3://时间 或 其他啥的
                time.string = data.text;
                node.height = 60;
                break;
        }
        avatarNode.setPosition(posAvatarNode);
        node.setScale(scaleAvatar);
        richtext.node.setPosition(posRichText);
	}
})