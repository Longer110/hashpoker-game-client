const UIListEasing = require("./UIListEasing");

/*
 * @Author: OreoWang
 * @Email: ihc523@163.com
 * @Date: 2023-01-11 15:12:11
 * @LastEditors: OreoWang
 * @LastEditTime: 2023-01-13 13:59:04
 * @Description: 
 */
const dev = console;

const UIListUtils = {
	/**
	 * 覆盖引擎内 cc.ScrollView 方法
	 * @param {UIListView} listView 
	 * @param {cc.ScrollView} scrollView 
	 */
	overrideScrollView(listView, scrollView){
		const NUMBER_OF_GATHERED_TOUCHES_FOR_MOVE_SPEED = 5;
		const OUT_OF_BOUNDARY_BREAKING_FACTOR = 0.05;	
		const EPSILON = 1e-4;	

		const getTimeInMilliseconds = function() {
			let currentTime = new Date();
			return currentTime.getMilliseconds();
		};

		let prototype = cc.ScrollView.prototype;

		// scrollView._handlePressLogic = function () {
		// 	dev.warn(this)
		// 	dev.warn("_handlePressLogic", this._autoScrolling)
		// 	return prototype._handlePressLogic.call(this);
		// }
		// scrollView._handleMoveLogic = function (touch) {
		// 	dev.log("_handleMoveLogic", this._autoScrolling)
		// 	return prototype._handleMoveLogic.call(this, touch);
		// }
		// scrollView._handleReleaseLogic = function (touch) {
		// 	dev.warn("_handleReleaseLogic", this._autoScrolling, this._scrolling)
		// 	return prototype._handleReleaseLogic.call(this, touch);
		// }
		// scrollView._processInertiaScroll = function () {
		// 	let res = prototype._processInertiaScroll.call(this);
		// 	dev.log("_processInertiaScroll", res);
		// 	return res;
		// }
		// scrollView._startBounceBackIfNeeded = function () {
		// 	let res = prototype._startBounceBackIfNeeded.call(this);
		// 	dev.log("_startBounceBackIfNeeded", res);
		// 	return res;
		// }
		// scrollView._calculateTouchMoveVelocity = function () {
		// 	let res = prototype._calculateTouchMoveVelocity.call(this);
		// 	dev.log("_calculateTouchMoveVelocity", res.toString());
		// 	return res;
		// }

		// scrollView._startInertiaScroll = function (touchMoveVelocity) {
		// 	let res = prototype._startInertiaScroll.call(this, touchMoveVelocity);
		// 	dev.log("_startInertiaScroll", res);
		// 	return res;
		// }

	
		scrollView.setContentPosition = function (position) {

			if (position.fuzzyEquals(this.getContentPosition(), EPSILON)) {
				return;
			}
			let worldPos = this.content.parent.convertToWorldSpaceAR(position);
			if(this.horizontal){
				worldPos.x = Math.floor(worldPos.x)
			}
			if(this.vertical){
				worldPos.y = Math.floor(worldPos.y)
			}
			let pos = this.content.parent.convertToNodeSpaceAR(worldPos);
			if (pos.fuzzyEquals(this.getContentPosition(), EPSILON)) {
				return;
			}
			this.content.setPosition(pos);
			this._outOfBoundaryAmountDirty = true;
		}

		scrollView._moveContent = function (deltaMove, canStartBounceBack) {
			prototype._moveContent.call(this, deltaMove, canStartBounceBack);

			listView.onMoveContent(deltaMove);
		}
		scrollView._scrollChildren = function (deltaMove) {
			prototype._scrollChildren.call(this, deltaMove);

			listView.onScrollChildren(deltaMove);
		}
		scrollView._gatherTouchMove = function (delta) {
			delta = this._clampDelta(delta);

			while (this._touchMoveDisplacements.length >= NUMBER_OF_GATHERED_TOUCHES_FOR_MOVE_SPEED) {
				this._touchMoveDisplacements.shift();
				this._touchMoveTimeDeltas.shift();
			}

			this._touchMoveDisplacements.push(delta);

			let timeStamp = getTimeInMilliseconds();
			let temp = (timeStamp - this._touchMovePreviousTimestamp) / 1000;
			if(temp<0){
				temp += 1;
			}
			else{
			}
			this._touchMoveTimeDeltas.push(temp);
			this._touchMovePreviousTimestamp = timeStamp;
		}
		scrollView._calculateTouchMoveVelocity = function () {
			let totalTime = 0;
			totalTime = this._touchMoveTimeDeltas.reduce(function(a, b) {
				return a + b;
			}, totalTime);
	
	// dev.log("totalTime: ", totalTime);
			if (totalTime <= 0 || totalTime >= 0.5) {
				return cc.v2(0, 0);
			}
	
			let totalMovement = cc.v2(0, 0);
			totalMovement = this._touchMoveDisplacements.reduce(function(a, b) {
				return a.add(b);
			}, totalMovement);

	// dev.log("totalMovement: ", totalMovement.toString());
			
			let brake = listView.getBrakeDefault();
			const velocity = totalMovement.mag();
			
			const brakeMax = 1.0;
			const velMax = 200;
			const velMin = 16;
			const velLength = velMax - velMin;
			if(velocity < velMin){
				brake = brakeMax; 
			}
			else if(velocity<velMax){
				brake = brake + (velMax - velocity)/velLength * (brakeMax - brake);
				brake = Math.floor(brake * 100)/100;
				if(brake >= 0.98){
					brake = brakeMax;
				}
			}
			
			if(this._onInitialVelocity){
				this._onInitialVelocity(velocity, brake);
			}
			this.brake = brake;
	

			totalMovement = cc.v2(totalMovement.x * (1 - this.brake) / totalTime,
						totalMovement.y * (1 - this.brake) / totalTime);

			return totalMovement;
		},
		
		// scrollView._startAttenuatingAutoScroll = function (deltaMove, initialVelocity) {
		// 	let time = this._calculateAutoScrollTimeByInitalSpeed(initialVelocity.mag());
	
		// 	let targetDelta = deltaMove.normalize();
		// 	let contentSize = this.content.getContentSize();
		// 	let scrollviewSize = this._view.getContentSize();
	
		// 	let totalMoveWidth = (contentSize.width - scrollviewSize.width);
		// 	let totalMoveHeight = (contentSize.height - scrollviewSize.height);
	
		// 	let attenuatedFactorX = this._calculateAttenuatedFactor(totalMoveWidth);
		// 	let attenuatedFactorY = this._calculateAttenuatedFactor(totalMoveHeight);
	
		// 	targetDelta = cc.v2(targetDelta.x * totalMoveWidth * (1 - this.brake) * attenuatedFactorX, targetDelta.y * totalMoveHeight * attenuatedFactorY * (1 - this.brake));
	
		// 	let originalMoveLength = deltaMove.mag();
		// 	let factor = targetDelta.mag() / originalMoveLength;
		// 	targetDelta = targetDelta.add(deltaMove);
	
		// 	if (this.brake > 0 && factor > 7) {
		// 		factor = Math.sqrt(factor);
		// 		targetDelta = deltaMove.mul(factor).add(deltaMove);
		// 	}
	
		// 	if (this.brake > 0 && factor > 3) {
		// 		factor = 3;
		// 		time = time * factor;
		// 	}
	
		// 	if (this.brake === 0 && factor > 1) {
		// 		time = time * factor;
		// 	}
	
		// 	this._startAutoScroll(targetDelta, time, true);
		// }

		// scrollView._startAttenuatingAutoScroll = function (deltaMove, initialVelocity) {
		// 	this.brake = 0.25;
		// 	let scale = 1;
		// 	let velocity = initialVelocity.mag();
		// 	let velMax = 600;
		// 	let velMin = 200;
		// 	if(velocity < velMin){
		// 		scale = 0.9; //1.2 + 0.5*(velocity/velMin);
		// 	}
		// 	else if(velocity<velMax){
		// 		scale = 0.8; //1.2 + 0.5*((velocity-velMin)/(velMax-velMin));
		// 	}
		// 	else if(velocity<velMin*3){
		// 		scale = 1.8;
		// 	}
			
		// 	// listView.setAttenuationScale(scale);

		// 	prototype._startAttenuatingAutoScroll.call(this, deltaMove, initialVelocity);
		// }
		scrollView._processAutoScrolling = function(dt) {
	 		//dev.log("_processAutoScrolling")

			let isAutoScrollBrake = this._isNecessaryAutoScrollBrake();
			let brakingFactor = isAutoScrollBrake ? OUT_OF_BOUNDARY_BREAKING_FACTOR : 1;
			this._autoScrollAccumulatedTime += dt*listView.getSpeedScale() * (1 / brakingFactor);
	
			let percentage = Math.min(1, this._autoScrollAccumulatedTime / this._autoScrollTotalTime);
			if (this._autoScrollAttenuate) {
				let handler = listView.getEasingHandler();
				// handler = UIListEasing.easeInExpo;
				// percentage = 1 - handler(percentage);
				percentage = handler(percentage) * listView.getEasingScale();
				percentage = Math.min(1, percentage);
			}
	// dev.log("percentage: ", percentage);

			let newPosition = this._autoScrollStartPosition.add(this._autoScrollTargetDelta.mul(percentage));
			let reachedEnd = Math.abs(percentage - 1) <= EPSILON;
	
			let fireEvent = Math.abs(percentage - 1) <= this.getScrollEndedEventTiming();
			if (fireEvent && !this._isScrollEndedWithThresholdEventFired) {
				this._dispatchEvent('scroll-ended-with-threshold');
				this._isScrollEndedWithThresholdEventFired = true;
			}
	
			if (this.elastic) {
				let brakeOffsetPosition = newPosition.sub(this._autoScrollBrakingStartPosition);
				if (isAutoScrollBrake) {
					brakeOffsetPosition = brakeOffsetPosition.mul(brakingFactor);
				}
				newPosition = this._autoScrollBrakingStartPosition.add(brakeOffsetPosition);
			} else {
				let moveDelta = newPosition.sub(this.getContentPosition());
				let outOfBoundary = this._getHowMuchOutOfBoundary(moveDelta);
				if (!outOfBoundary.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
					newPosition = newPosition.add(outOfBoundary);
					reachedEnd = true;
				}
			}

			let deltaMove = newPosition.sub(this.getContentPosition());
			// if(this.vertical){
			// 	deltaMove.y = Math.floor(deltaMove.y);
			// }
			// else if(this.horizontal){
			// 	deltaMove.x = Math.floor(deltaMove.x);
			// }

			if(!this._isBouncing){
				if (reachedEnd) {
					this._autoScrolling = false;
				}
			}else{
				if (reachedEnd) {
					reachedEnd = false
					this._autoScrolling = false;
				}
			}

			
			this._moveContent(this._clampDelta(deltaMove), reachedEnd);
			
			this._dispatchEvent('scrolling');
			
			listView.onAutoScrolling(deltaMove);
			
			// dev.log("_autoScrollTargetDelta", deltaMove.toString(), this._autoScrollTargetDelta.toString(), this._autoScrollTargetDelta)
			
			// scollTo API controll move
			if (!this._autoScrolling) {
				this._isBouncing = false;
				this._scrolling = false;
				this._dispatchEvent('scroll-ended');
			}
		}
	},
}

module.exports = UIListUtils;