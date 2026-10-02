
const { ccclass, inspector, property, disallowMultiple, menu } = cc._decorator;

let CenterHorizontalDirection = cc.Enum({
    LEFT_TO_RIGHT: 0,
    RIGHT_TO_LEFT: 1,
    CENTER_TO_SIDE: 2,
})

cc.Class({
    extends: cc.Layout,
    properties: {
        // type: {
        //     default: CenterHorizontalDirection.LEFT_TO_RIGHT, 
        //     type: cc.Enum(CenterHorizontalDirection),         
        // },

        centerHorizontalDirection: CenterHorizontalDirection.CENTER_TO_SIDE,
    },

    
    _doLayoutHorizontally(baseWidth, rowBreak, fnPositionY, applyChildren) {
        var layoutAnchor = this.node.getAnchorPoint();
        var children = this.node.children;

        var sign = 1;
        var paddingX = this.paddingLeft;
        var leftBoundaryOfLayout = -layoutAnchor.x * baseWidth;
        if (this.centerHorizontalDirection === CenterHorizontalDirection.RIGHT_TO_LEFT) {
            sign = -1;
            leftBoundaryOfLayout = (1 - layoutAnchor.x) * baseWidth;
            paddingX = this.paddingRight;
        }

        var nextX = leftBoundaryOfLayout + sign * paddingX - sign * this.spacingX;
        var rowMaxHeight = 0;
        var tempMaxHeight = 0;
        var secondMaxHeight = 0;
        var row = 0;
        var containerResizeBoundary = 0;

        var maxHeightChildAnchorY = 0;

        var activeChildCount = 0;
        for (var i = 0; i < children.length; ++i) {
            var child = children[i];
            if (child.activeInHierarchy) {
                activeChildCount++;
            }
        }

        var newChildWidth = this.cellSize.width;
        if (this.type !== cc.Layout.Type.GRID && this.resizeMode === cc.Layout.ResizeMode.CHILDREN) {
            newChildWidth = (baseWidth - (this.paddingLeft + this.paddingRight) - (activeChildCount - 1) * this.spacingX) / activeChildCount;
        }

        for (var i = 0; i < children.length; ++i) {
            var child = children[i];
            let childScaleX = this._getUsedScaleValue(child.scaleX);
            let childScaleY = this._getUsedScaleValue(child.scaleY);
            if (!child.activeInHierarchy) {
                continue;
            }
            //for resizing children
            if (this.resizeMode === cc.Layout.ResizeMode.CHILDREN) {
                child.width = newChildWidth / childScaleX;
                if (this.type === cc.Layout.Type.GRID) {
                    child.height = this.cellSize.height / childScaleY;
                }
            }

            var anchorX = child.anchorX;
            var childBoundingBoxWidth = child.width * childScaleX;
            var childBoundingBoxHeight = child.height * childScaleY;

            if (secondMaxHeight > tempMaxHeight) {
                tempMaxHeight = secondMaxHeight;
            }

            if (childBoundingBoxHeight >= tempMaxHeight) {
                secondMaxHeight = tempMaxHeight;
                tempMaxHeight = childBoundingBoxHeight;
                maxHeightChildAnchorY = child.getAnchorPoint().y;
            }

            if (this.centerHorizontalDirection === CenterHorizontalDirection.RIGHT_TO_LEFT) {
                anchorX = 1 - child.anchorX;
            }
            nextX = nextX + sign * anchorX * childBoundingBoxWidth + sign * this.spacingX;
            var rightBoundaryOfChild = sign * (1 - anchorX) * childBoundingBoxWidth;

            if (rowBreak) {
                var rowBreakBoundary = nextX + rightBoundaryOfChild + sign * (sign > 0 ? this.paddingRight : this.paddingLeft);
                var leftToRightRowBreak = this.centerHorizontalDirection !== CenterHorizontalDirection.RIGHT_TO_LEFT && rowBreakBoundary > (1 - layoutAnchor.x) * baseWidth;
                var rightToLeftRowBreak = this.centerHorizontalDirection === CenterHorizontalDirection.RIGHT_TO_LEFT && rowBreakBoundary < -layoutAnchor.x * baseWidth;

                if (leftToRightRowBreak || rightToLeftRowBreak) {

                    if (childBoundingBoxHeight >= tempMaxHeight) {
                        if (secondMaxHeight === 0) {
                            secondMaxHeight = tempMaxHeight;
                        }
                        rowMaxHeight += secondMaxHeight;
                        secondMaxHeight = tempMaxHeight;
                    }
                    else {
                        rowMaxHeight += tempMaxHeight;
                        secondMaxHeight = childBoundingBoxHeight;
                        tempMaxHeight = 0;
                    }
                    nextX = leftBoundaryOfLayout + sign * (paddingX + anchorX * childBoundingBoxWidth);
                    row++;
                }
            }

            var finalPositionY = fnPositionY(child, rowMaxHeight, row);
            if (baseWidth >= (childBoundingBoxWidth + this.paddingLeft + this.paddingRight)) {
                if (applyChildren) {
                    child.setPosition(cc.v2(nextX, finalPositionY));
                }
            }

            var signX = 1;
            var tempFinalPositionY;
            var topMarign = (tempMaxHeight === 0) ? childBoundingBoxHeight : tempMaxHeight;

            if (this.verticalDirection === cc.Layout.VerticalDirection.TOP_TO_BOTTOM) {
                containerResizeBoundary = containerResizeBoundary || this.node.height;
                signX = -1;
                tempFinalPositionY = finalPositionY + signX * (topMarign * maxHeightChildAnchorY + this.paddingBottom);
                if (tempFinalPositionY < containerResizeBoundary) {
                    containerResizeBoundary = tempFinalPositionY;
                }
            }
            else {
                containerResizeBoundary = containerResizeBoundary || -this.node.height;
                tempFinalPositionY = finalPositionY + signX * (topMarign * maxHeightChildAnchorY + this.paddingTop);
                if (tempFinalPositionY > containerResizeBoundary) {
                    containerResizeBoundary = tempFinalPositionY;
                }
            }

            nextX += rightBoundaryOfChild;
        }
        if(children.length > 0 && this.centerHorizontalDirection == CenterHorizontalDirection.CENTER_TO_SIDE) {
            let centerX = (0.5 - layoutAnchor.x) * baseWidth;
            let rowWidth = 0
            let nextRowX = -1
            let lastRowY = Number.MIN_SAFE_INTEGER
            sign = -1

            for(let i = children.length - 1; i >= 0; i--) {
                let child = children[i]
                let childScaleX = this._getUsedScaleValue(child.scaleX);
                var anchorX = child.anchorX;
                var childBoundingBoxWidth = child.width * childScaleX;
                if(Math.abs(child.y - lastRowY) > 1) {
                    lastRowY = child.y
                    rowWidth = child.x + (1 - anchorX) * childBoundingBoxWidth + this.paddingRight
                    rowWidth = baseWidth * layoutAnchor.x + rowWidth
                    let lastRowEndX = centerX + rowWidth * 0.5;
                    nextRowX = lastRowEndX + sign * paddingX - sign * this.spacingX;
                }
                if (!child.activeInHierarchy) {
                    continue;
                }
                nextRowX = nextRowX + sign * anchorX * childBoundingBoxWidth + sign * this.spacingX;
                child.x = nextRowX
                var rightBoundaryOfChild = sign * (1 - anchorX) * childBoundingBoxWidth;
                nextRowX += rightBoundaryOfChild;
            }            
        }
        return containerResizeBoundary;
    },
    _getUsedScaleValue (value) {
        return this.affectedByScale ? Math.abs(value) : 1;
    }
})