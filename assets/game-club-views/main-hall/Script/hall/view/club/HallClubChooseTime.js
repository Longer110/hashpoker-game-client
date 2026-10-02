
let Base64 = require("base64");
let i18n = require("i18n");
let Utils = require("Utils");
let clubGameConfig = require("clubGameConfig");
const UIListCell = require("UIListCell");
let MSG = require("Msg_club");
let UIFrame = require("UIFrame");

cc.Class({
    extends: cc.Component,

    properties: {
        label_start:  cc.Label,
        label_end:  cc.Label,
        pfbDatePicker: cc.Prefab,
        pfbDatePickerNode: cc.Node,
        wheelTimePickerNode:cc.Node,
        year: 0,
        month: 0,
        day: 0,
    },

    onLoad () {
        app.util.addClickSoundToNode(this.node);
    },

    start () {

    },

    // update (dt) {},
    
    init(startTimeStr, endTimeStr) {
        // 解析开始时间，如果没有传入则使用当天
        let startDate;
        if (startTimeStr) {
            let timeArray = startTimeStr.split(" ");
            let startPartsOne =  timeArray[0].split('-');
            let startPartsTwo = timeArray[1].split(":");

            startDate = {
                year: parseInt(startPartsOne[0]),
                month: parseInt(startPartsOne[1]) - 1, // 月份需要减1
                day: parseInt(startPartsOne[2]),
                hour: parseInt(startPartsTwo[0]),
                minute: parseInt(startPartsTwo[1])
            };
        } else {
            let date = new Date();
            startDate = {
                year: date.getFullYear(),
                month: date.getMonth(),
                day: date.getDate(),
                hour: date.getHours(),
                minute: date.getMinutes()
            };
        }

        // 解析结束时间，如果没有传入则使用当天
        let endDate;
        if (endTimeStr) {
            let timeArray = endTimeStr.split(" ");
            let endPartsOne =  timeArray[0].split('-');
            let endPartsTwo = timeArray[1].split(":");
            endDate = {
                year: parseInt(endPartsOne[0]),
                month: parseInt(endPartsOne[1]) - 1, // 月份需要减1
                day: parseInt(endPartsOne[2]),
                hour: parseInt(endPartsTwo[0]),
                minute: parseInt(endPartsTwo[1])
            };
        } else {
            let date = new Date();
            endDate = {
                year: date.getFullYear(),
                month: date.getMonth(),
                day: date.getDate(),
                hour: 23,
                minute: 59
            };
        }

        // 格式化显示字符串
        let startMonthStr = (startDate.month + 1) < 10 ? "0" + (startDate.month + 1) : (startDate.month + 1);
        let startDayStr = startDate.day < 10 ? "0" + startDate.day : startDate.day;
        let startDateStr = startDate.year + "-" + startMonthStr + "-" + startDayStr + " " +
                           (startDate.hour <10 ? "0" + startDate.hour : startDate.hour) + ":" +
                           (startDate.minute <10 ? "0" + startDate.minute : startDate.minute);

        let endMonthStr = (endDate.month + 1) < 10 ? "0" + (endDate.month + 1) : (endDate.month + 1);
        let endDayStr = endDate.day < 10 ? "0" + endDate.day : endDate.day;
        let endDateStr = endDate.year + "-" + endMonthStr + "-" + endDayStr + " " +
                         (endDate.hour <10 ? "0" + endDate.hour : endDate.hour) + ":" +
                         (endDate.minute <10 ? "0" + endDate.minute : endDate.minute);

        // 设置界面显示
        this.label_start.string = startDateStr;
        this.label_end.string = endDateStr;
        
        // 存储开始和结束时间的数据
        this.startTime = {
            year: startDate.year,
            month: startDate.month,
            day: startDate.day,
            hour: startDate.hour,
            minute: startDate.minute,
            dateStr: startDateStr
        };

        this.initStartTime = Utils.clone(this.startTime);

        this.endTime = {
            year: endDate.year,
            month: endDate.month,
            day: endDate.day,
            hour: endDate.hour,
            minute: endDate.minute,
            dateStr: endDateStr
        };

        this.initEndTime = Utils.clone(this.endTime);

        this.OnClickTime(this,1)
    },

    OnClickTime(event, data) {
        // data: 1=开始时间, 2=结束时间
        this.currentPickerType = parseInt(data);
        self = this
        this.currentPicker =  this.pfbDatePickerNode  //cc.instantiate(this.pfbDatePicker);
        // this.node.addChild(this.currentPicker);
        let datePicker = this.currentPicker.getComponent("UIDatePicker");
        let wheelTimePicker = this.wheelTimePickerNode.getComponent("UIWheelTimePicker");
        // 根据选择类型设置当前日期
        if (this.currentPickerType === 1) {
            // 开始时间 - 使用开始时间的当前值
            datePicker.setDate(this.startTime.year, this.startTime.month, this.startTime.day);
            wheelTimePicker.init(this.startTime.hour,this.startTime.minute);
            this.showSelectLabelTime(this.startTime.year, this.startTime.month, this.startTime.day, this.startTime.hour, this.startTime.minute);

            self.label_start.node.color = new cc.Color(0,255,134,255);
            self.label_end.node.color = new cc.Color(231,222,209,255);
        } else if (this.currentPickerType === 2) {
            // 结束时间 - 使用结束时间的当前值
            datePicker.setDate(this.endTime.year, this.endTime.month, this.endTime.day);
            wheelTimePicker.init(this.endTime.hour,this.endTime.minute);
            this.showSelectLabelTime(this.endTime.year, this.endTime.month, this.endTime.day, this.endTime.hour, this.endTime.minute);

             self.label_end.node.color = new cc.Color(0,255,134,255);
            self.label_start.node.color = new cc.Color(231,222,209,255);
        }
        
          
        
        datePicker.setPickDateCallback((year, month, day) => {
          if (self.currentPickerType === 1) {
                this.showSelectLabelTime(year, month, day, this.startTime.hour, this.startTime.minute);
            }
            else if (this.currentPickerType === 2) 
            {
                this.showSelectLabelTime(year, month, day, this.endTime.hour, this.endTime.minute);
            } 
        });

        wheelTimePicker.setConfirmCallback((hour, minute) => {
            if (self.currentPickerType === 1) {
                this.startTime.hour = hour;
                this.startTime.minute = minute;
                this.showSelectLabelTime(this.startTime.year, this.startTime.month, this.startTime.day, hour, minute);
            }
            else if (this.currentPickerType === 2) 
            {
                this.endTime.hour = hour;
                this.endTime.minute = minute;
                this.showSelectLabelTime(this.endTime.year, this.endTime.month, this.endTime.day, hour, minute);   
            } 
        });
        
    },

    showSelectLabelTime(year, month, day, hour, minute)
    {
        
        let monthStr = (month + 1) < 10 ? "0" + (month + 1) : (month + 1);
        let dayStr = day < 10 ? "0" + day : day;
        let dateStr = year + "-" + monthStr + "-" + dayStr + " " +
                        (hour <10 ? "0" + hour : hour) + ":" +
                        (minute <10 ? "0" + minute : minute);
        
        if (self.currentPickerType === 1) {
            // 更新开始时间
            self.label_start.string = dateStr;

            
            self.startTime = {
                year: year,
                month: month,
                day: day,
                hour: hour,
                minute: minute,
                dateStr: dateStr
            };
        } else if (self.currentPickerType === 2) {
            // 更新结束时间
            self.label_end.string = dateStr;
            self.endTime = {
                year: year,
                month: month,
                day: day,
                hour: hour,
                minute: minute,
                dateStr: dateStr
            };
        }
    },

    // 设置时间范围确认回调（可选，用于同时处理开始和结束时间）
    setTimeRangeConfirmCallback(callback) {
        this.onTimeRangeConfirmed = callback;
    },

    OnClickReset() {
        let datePicker = this.currentPicker.getComponent("UIDatePicker");
        let wheelTimePicker = this.wheelTimePickerNode.getComponent("UIWheelTimePicker");

        this.resetDateTime();
        // 当前页签是开始时间，重置回初始开始时间
        if (this.currentPickerType === 1) {
            //初始开始时间
            let monthStartStr = this.initStartTime.month < 10 ? "0" + this.initStartTime.month : this.initStartTime.month;
            let dayStartStr = this.initStartTime.day < 10 ? "0" + this.initStartTime.day : this.initStartTime.day;
            let dateStartStr = this.initStartTime.year + "-" + monthStartStr + "-" + dayStartStr;
            this.initStartTime.hour = 0
            this.initStartTime.minute = 0
             // 重置开始时间 - 使用初始开始时间的值
            this.startTime = {
                year: this.initStartTime.year,
                month: this.initStartTime.month,
                day: this.initStartTime.day,
                hour: this.initStartTime.hour,
                minute: this.initStartTime.minute,
                dateStr: this.initStartTime.dateStr
            };
            this.label_start.string = dateStartStr;
            datePicker.setDate(this.initStartTime.year, this.initStartTime.month, this.initStartTime.day);
            wheelTimePicker.init(this.initStartTime.hour, this.initStartTime.minute);
        } else if (this.currentPickerType === 2) { // 当前页签是结束时间，重置回初始结束时间
            //初始结束时间
            let monthEndStr = this.initEndTime.month < 10 ? "0" + this.initEndTime.month : this.initEndTime.month;
            let dayEndStr = this.initEndTime.day < 10 ? "0" + this.initEndTime.day : this.initEndTime.day;
            let dateEndStr = this.initEndTime.year + "-" + monthEndStr + "-" + dayEndStr;
            this.initEndTime.hour = 23
            this.initEndTime.minute = 59
            // 重置结束时间 - 使用初始结束时间的值
            this.endTime = {
                year: this.initEndTime.year,
                month: this.initEndTime.month,
                day: this.initEndTime.day,
                hour: this.initEndTime.hour,
                minute: this.initEndTime.minute,
                dateStr: dateEndStr
            };
            this.label_end.string = dateEndStr;
            datePicker.setDate(this.initEndTime.year, this.initEndTime.month, this.initEndTime.day);
            wheelTimePicker.init(this.initEndTime.hour, this.initEndTime.minute);
        }
    },

    resetDateTime() {
        // 当前页签是开始时间，重置回初始开始时间
        if (this.currentPickerType === 1) {
            //初始赋值查询时间段，结束时间段为当天，开始时间段为当前时间往前120天的时间
            let startDate = new Date();
            startDate.setDate(startDate.getDate() - 120);
            this.initStartTime = {
                year: startDate.getFullYear(),
                month: String(startDate.getMonth()).padStart(2, '0'),
                day: String(startDate.getDate()).padStart(2, '0'),
            };
        }
        else if (this.currentPickerType === 2) {
            // 结束时间为当天
            let endDate = new Date();
            this.initEndTime = {
                year: endDate.getFullYear(),
                month: String(endDate.getMonth()).padStart(2, '0'),
                day: String(endDate.getDate()).padStart(2, '0'),
            };
        }
    },

    // 获取当前选择的时间范围
    getSelectedTimeRange() {
        return {
            startTime: this.startTime,
            endTime: this.endTime
        };
    },

    OnClickSure() {
        // 检查结束日期是否早于开始日期
        if (this.isEndDateBeforeStartDate()) {
            UIFrame.showTips("结束日期只能大于等于开始日期，请重新选择");
            return;
        }
        
        if (this.onTimeRangeConfirmed) {
            this.onTimeRangeConfirmed(this.startTime, this.endTime);
        }
        
        this.node.destroy();
    },

    // 检查结束日期是否早于开始日期
    isEndDateBeforeStartDate() {
        let startDate = new Date(this.startTime.year, this.startTime.month, this.startTime.day);
        let endDate = new Date(this.endTime.year, this.endTime.month, this.endTime.day);
        
        return endDate < startDate;
    },

    OnClickClose(){
        this.node.destroy();
    },
});
