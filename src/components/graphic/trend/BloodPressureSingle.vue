<template>
    <div :class="containerStyle"  element-loading-text="加载中...">
        <div class="head">
            <span class="title">单次血压记录（单位：mmHg）</span>
            <div class="ctrl" v-show="ctrlVisible">
                <el-checkbox size="mini"
                             v-model="heartRateVisible"
                             v-on:change="drawContent">
                    <span>心率</span>
                </el-checkbox>
                <el-checkbox size="mini"
                             v-model="bloodPressureCtrlVisible"
                             v-on:change="drawContent">
                    <span>血压控制目标线</span>
                </el-checkbox>
            </div>
        </div>
        <div ref="body" class="body">
            <canvas ref="canvas" class="canvas" @mousemove="onMousemove"/>
            <Tooltip
                    :targetPoint="targetPoint"
                    :ctrlVisible="ctrlVisible"
                    :visible="visible">
            </Tooltip>
        </div>


    </div>
</template>

<script>
    import Component from 'vue-class-component'
    import Base from '../Base'
    import Tooltip from'./Tooltip'

    @Component({
        props: {
            uri: {
                type: String,
                default: function () {
                    return this.uris.bloodTrendSingleRange;
                }
            },
            patientID: {
                type: Number,
                default: 0,
                request: true
            },
            measureDateTime: {
                type: String,
                default: function () {
                    let now = new Date();
                    return now.format("yyyy-MM-dd hh:mm:ss");
                }
            },
            maxCount: {
                type: Number,
                default: 15,
            },
            measureStartDate: {
                type: String,
                default: null
            },
            measureEndDate: {
                type: String,
                default: null
            },
            borderVisible: {
                type: Boolean,
                default: false
            },
            ctrlVisible: {
                type: Boolean,
                default: true
            },
            systolicAlarm: {
                type: Number,
                default: 140
            },
            systolicWarn: {
                type: Number,
                default: 130
            },
            diastolicAlarm: {
                type: Number,
                default: 90
            },
            diastolicWarn: {
                type: Number,
                default: 80
            },
            maskCurrent: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            "measureDateTime": {
                handler: "measureDateTimeChanged"
            },
            "measureStartDate": {
                handler: "measureDateTimeChanged"
            },
            "measureEndDate": {
                handler: "measureDateTimeChanged"
            }
        },
        components:{
          Tooltip:Tooltip
        }
    })
    export default class BloodPressureSingle extends Base {
        rangeMonth = 1
        errSummary = ""
        errDetail = ""
        isLoading = false
        heartRateVisible = true
        bloodPressureCtrlVisible = true
        data = null
        currentIndex = -1
        targetPoints = []
        targetPoint = {}
        visible = false
        maxValue = 0
        minValue = 0

        get containerStyle() {
            if(this.borderVisible) {
                return "container border";
            }

            return "container";
        }
        get isHeartRateVisible() {
            if(!this.ctrlVisible) {
                return false;
            }

            return this.heartRateVisible;
        }
        get isBloodPressureCtrlVisible() {
            return this.bloodPressureCtrlVisible;
        }

        measureDateTimeChanged(){
            this.getData();
        }

        drawBlood(ctx, items, pixelPerTime, pixelPerData, startTime, startX, startY, oy) {
            this.targetPoints = []
            let count = items.length;
            if(count < 1) {
                return;
            }
            let drawHeartRate = this.isHeartRateVisible;

            ctx.textAlign="center";
            ctx.textBaseline="top";
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#969696";
            ctx.beginPath();
            // 收缩压
            for (let i = 0; i < count; i++) {
                let item = items[i];
                let time = new Date(item.measureDateTime.replace(/-/g,"/"));
                let x = startX + (time.getTime() - startTime) * pixelPerTime;
                let y = startY - item.systolicPressure * pixelPerData;
                if(i == 0) {
                    this.moveTo(ctx, x, y);
                }
                else {
                    this.lineTo(ctx, x, y);
                }

            }
            // 舒张压
            for (let i = 0; i < count; i++) {
                let item = items[i];
                let time = new Date(item.measureDateTime.replace(/-/g,"/"));
                let x = startX + (time.getTime() - startTime) * pixelPerTime;
                let y = startY - item.diastolicPressure * pixelPerData;
                if(i == 0) {
                    this.moveTo(ctx, x, y);
                }
                else {
                    this.lineTo(ctx, x, y);
                }

            }
            // 心率
            if(drawHeartRate) {
                let index = 0;
                for (let i = 0; i < count; i++) {
                    let item = items[i];
                    if(!item.heartRate) {
                        continue;
                    }
                    let time = new Date(item.measureDateTime.replace(/-/g,"/"));
                    let x = startX + (time.getTime() - startTime) * pixelPerTime;
                    let y = startY - item.heartRate * pixelPerData;
                    if(index == 0) {
                        this.moveTo(ctx, x, y);
                    }
                    else {
                        this.lineTo(ctx, x, y);
                    }
                    index++;
                }
            }
            ctx.stroke();
            ctx.closePath();

            let mask = this.maskCurrent;
            let fontSize = 11 * window.devicePixelRatio;
            ctx.font = fontSize + "px Arial";
            ctx.textAlign="center";
            ctx.textBaseline="top";
            let txtLeft = startX;
            let txtTop = 3;
            let dateTxtWidth = ctx.measureText("12月28日").width;
            let timeTxtWidth = ctx.measureText("09:30").width;
            let currentDay = 0;
            let colorAlarm = "#ff0000";
            let colorWarn = "#FF6100";
            let colorNormal = "#006600";
            let triangleR = 6;
            let color = colorNormal;
            for (let i = 0; i < count; i++) {
                let item = items[i];
                let time = new Date(item.measureDateTime.replace(/-/g,"/"));
                let x = startX + (time.getTime() - startTime) * pixelPerTime;
                let data = {
                    time:item.measureDateTime.replace(/-/g,"/"),
                    x:x/ window.devicePixelRatio,
                    systolicPressure:{
                      value:0,
                      y:0,
                      color:""
                    },
                    diastolicPressure:{
                      value:0,
                      y:0,
                      color:""
                    },
                    heartRate:{
                      value:0,
                      y:0,
                      color:""
                    },
                }
                // 收缩压
                let y = startY - item.systolicPressure * pixelPerData;
                if(item.systolicPressure > this.systolicAlarm) {
                    color= colorAlarm;
                }
                else if(item.systolicPressure > this.systolicWarn) {
                    color = colorWarn;
                }
                else {
                    color = colorNormal;
                }
                if(mask && i === this.currentIndex) {
                    this.fillTriangleDown(ctx, x, y, triangleR ,color);
                    this.fillTriangleDown(ctx, x, y - triangleR / 2, triangleR / 2, "#ffffff");
                }
                else {
                    this.fillTriangleDown(ctx, x, y, triangleR, color);
                }
                data.systolicPressure.y = y/ window.devicePixelRatio;
                data.systolicPressure.color = color;
                data.systolicPressure.value = item.systolicPressure;

                // 舒张压
                y = startY - item.diastolicPressure * pixelPerData;
                if(item.diastolicPressure > this.diastolicAlarm) {
                    color = colorAlarm;
                }
                else if(item.diastolicPressure > this.diastolicWarn) {
                    color = colorWarn;
                }
                else {
                    color = colorNormal;
                }
                if(mask && i === this.currentIndex) {
                    this.fillTriangleUp(ctx, x, y, triangleR, color);
                    this.fillTriangleUp(ctx, x, y + triangleR / 2, triangleR / 2, "#ffffff");
                }
                else {
                    this.fillTriangleUp(ctx, x, y, triangleR,color);
                }
                data.diastolicPressure.y = y / window.devicePixelRatio;
                data.diastolicPressure.color = color;
                data.diastolicPressure.value = item.diastolicPressure;
                // 心率
                color = colorAlarm
                if(item.heartRate && drawHeartRate) {
                  y = startY - item.heartRate * pixelPerData;
                  this.fillCircle(ctx, x, y, triangleR,"#ffffff", color);
                  data.heartRate.y = y / window.devicePixelRatio;
                  data.heartRate.color = color;
                  data.heartRate.value = item.heartRate;
                }
                this.targetPoints.push(data);
                ctx.fillStyle = "#0f0f0f";
                let txtTime = time.format("hh:mm");
                let txtDate = time.format("M月d日");
                if(i === 0) {
				    ctx.textAlign = 'left';
                    ctx.fillText(txtTime, x - dateTxtWidth / 2, oy + txtTop);
                    ctx.fillText(txtDate, x - dateTxtWidth / 2, oy + txtTop + fontSize);
                    currentDay = time.getDay();
                    txtLeft = x + dateTxtWidth;
                }
                else if(x > txtLeft) {
                    ctx.fillText(txtTime, x - dateTxtWidth / 2, oy + txtTop);
                    if(currentDay === time.getDay()) {
                        txtLeft = x + timeTxtWidth;
                    }
                    else {
                        ctx.fillText(txtDate, x - dateTxtWidth / 2, oy + txtTop + fontSize);
                        currentDay = time.getDay();
                        txtLeft = x + dateTxtWidth;
                    }
                }

            }

        }

        drawTrend(ctx, width, height, offsetLeft, offsetRight, offsetTop, offsetBottom) {
            if(!ctx) {
                return;
            }

            let trendWidth = width - offsetLeft - offsetRight;
            if(trendWidth < 1) {
                return;
            }
            let trendHeight = height - offsetTop - offsetBottom;
            if(trendHeight < 1) {
                return;
            }
            let ox = offsetLeft
            let oy = height - offsetBottom;

            ctx.strokeStyle = "#121212";
            ctx.beginPath();
            this.moveTo(ctx, ox, oy - trendHeight);
            this.lineTo(ctx, ox, oy);
            this.lineTo(ctx, ox + trendWidth, oy);
            ctx.stroke();
            ctx.closePath();

            this.getMaxAndMinValue();


		    let yScaleWidth = 5;
		    let yMax = 220;
		    if(yMax < this.maxValue ){
		      yMax = this.maxValue;
            }
		    let yMin = 40;
		    if(yMin > this.minValue && this.minValue >= 0){
			  yMin = this.minValue;
            }
		    let yInterval = this.getYInterval(yMax - yMin);
		    let yOffset = yMin - yInterval;
            let yTotalValue = yMax + yInterval / 2
		    let pixelPerY = (trendHeight + yOffset) / yTotalValue;
		    let yVal = yOffset + yInterval;
		    let yIndex = 1;
		    let txtPaddingX = 5;


		    let fontSize = 11 * window.devicePixelRatio;
            ctx.font = fontSize + "px Arial";
            ctx.textAlign="right";
            ctx.textBaseline="middle";
            ctx.lineWidth = 1;
            ctx.beginPath();
            while (yVal < yTotalValue) {
                let y = oy - pixelPerY * yVal + pixelPerY * yOffset;
                this.moveTo(ctx, ox, y );
                this.lineTo(ctx, ox + yScaleWidth, y );
                if((yIndex % 2) === 0) {
                    ctx.fillText(yVal, ox - txtPaddingX, y);
                }

                yIndex++;
                yVal += yInterval;
            }
            ctx.stroke();
            ctx.closePath();

            // 血压控制目标线
            if(this.isBloodPressureCtrlVisible) {
                let lineDash = ctx.getLineDash();

                ctx.setLineDash([5]);
                ctx.strokeStyle = "#ff0000";
                ctx.beginPath();
                let y = oy - pixelPerY * this.diastolicAlarm + pixelPerY * yOffset;
                this.moveTo(ctx, ox, y );
                this.lineTo(ctx, ox + trendWidth, y );

                y = oy - pixelPerY * this.systolicAlarm + pixelPerY * yOffset;
                this.moveTo(ctx, ox, y );
                this.lineTo(ctx, ox + trendWidth, y );

                ctx.stroke();
                ctx.closePath();
                ctx.setLineDash(lineDash);
            }

            if(this.data === null) {
                return;
            }
            let xOffset = yScaleWidth + 20;
            let pixelPerTime = 0;
            let timeStart = new Date(this.data.timeStart.replace(/-/g,"/"));
            let timeEnd = new Date(this.data.timeEnd.replace(/-/g,"/"));
            let timeSpan = timeEnd.getTime() - timeStart.getTime();
            if(timeSpan > 0) {
                pixelPerTime = (trendWidth - 2 * xOffset) / timeSpan;
            }
            let yStart = oy + pixelPerY * yOffset;
            let xStart = ox + xOffset;

            if(this.data.records.length > 0) {
                this.drawBlood(ctx, this.data.records, pixelPerTime, pixelPerY, timeStart.getTime(), xStart, yStart, oy);
            }
            else {
			  ctx.textAlign="left";
              ctx.fillText("无血压记录",ox ,oy + fontSize)
            }
        }
        getYInterval(data){
          let intervalCount = 18;
          return Math.ceil(data / intervalCount / 10 ) * 10;
        }

        onMousemove(e){
          let options = this.targetPoints;
          for(let k in options){
            if( this.inPath(e.offsetX,e.offsetY,options[k].x,options[k].systolicPressure.y )){
              this.target(options[k].systolicPressure.y,options[k])
              this.visible = true;
              break;
            }
            else if( this.inPath(e.offsetX,e.offsetY,options[k].x,options[k].diastolicPressure.y )){
              this.target(options[k].diastolicPressure.y,options[k])
              this.visible = true;
              break;
            }
            else if( this.inPath(e.offsetX,e.offsetY,options[k].x,options[k].heartRate.y )){
              this.target(options[k].heartRate.y,options[k])
              this.visible = true;
              break;
            }
            else {
              this.visible = false;
            }
          }
        }

        target(y,data){
          let canvas = this.$refs['canvas'];
          this.targetPoint = {
            x:data.x,
            y:y-canvas.offsetHeight,
            time:data.time,
            systolicPressure:{
              color: data.systolicPressure.color,
              value:data.systolicPressure.value
            },
            diastolicPressure:{
              color: data.diastolicPressure.color,
              value:data.diastolicPressure.value
            },
            heartRate:{
              color: data.heartRate.color,
              value:data.heartRate.value
            },
          }
        }

        inPath(x,y,targetX,targetY){
          let r = 6;
          if(x >= targetX - r && x <= targetX + r && y >= targetY -r && y <= targetY +r){
            return true;
          }
          else return false;
        }

        drawContent() {
            let canvas = this.$refs['canvas'];
            if(canvas) {
                let width = canvas.width;
                let height = canvas.height;
                let ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, width, height);

                let fillStyle = ctx.fillStyle;
                let strokeStyle = ctx.strokeStyle;
                let lineWidth = ctx.lineWidth;
                let font = ctx.font;
                let textAlign = ctx.textAlign;
                let textBaseline = ctx.textBaseline;
                //////////////////////////////////////////////
                let left = 30 * window.devicePixelRatio;
                let right = 30 * window.devicePixelRatio;
                let top = 15 * window.devicePixelRatio;
                let bottom = 40 * window.devicePixelRatio;
                this.drawTrend(ctx, width, height, left, right, top, bottom)
                //////////////////////////////////////////////
                ctx.textBaseline = textBaseline;
                ctx.textAlign = textAlign;
                ctx.font = font;
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = strokeStyle;
                ctx.fillStyle = fillStyle;
            }
        }

        changeSize(width, height) {
            let canvas = this.$refs['canvas'];
            if(!canvas) {
                return;
            }

            canvas.width = width * window.devicePixelRatio;
            canvas.height =height * window.devicePixelRatio;

            this.drawContent();
        }

        onSizeChanged() {
            let body = this.$refs['body'];
            if(!body) {
                return;
            }
            let width = body.offsetWidth;
            let height = body.offsetHeight;
            if(width === this.oldWidth && height === this.oldHeight) {
                return;
            }
            this.oldWidth = width;
            this.oldHeight = height;

            this.changeSize(width, height);
        }

        getMaxAndMinValue(){
          let max = 0;
          let min = 0;
          if(this.data){
            max = this.data.systolicPressureMax;
            min = this.data.diastolicPressureMin;
            if(max < this.data.diastolicPressureMax){
              max = this.data.diastolicPressureMax;
            }
            if(min > this.data.systolicPressureMin){
              min = this.data.systolicPressureMin;
            }
            if(this.isHeartRateVisible){
              if(max < this.data.heartRateMax && this.data.heartRateMax > 0){
                max = this.data.heartRateMax;
              }
              if(min > this.data.heartRateMin && this.data.heartRateMin > 0){
                min = this.data.heartRateMin;
              }
            }
          }

          this.minValue = Math.floor(min / 10) * 10;
		  this.maxValue = Math.ceil(max / 10) * 10;
		  if(max === 0 && min === 0){
			this.minValue = 40;
          }
        }

        onGetData(code, err, data) {
            this.isLoading = false;
            if (code === 0) {
                this.data = data;
                this.currentIndex = data.currentIndex;
            }
            else if (code !== 20001) {
                this.errSummary = err.summary;
                this.errDetail = err.detail;
                this.data = null;
                this.currentIndex = -1;
                console.log("error: " + err.summary + "-" + err.detail);
            }
            this.drawContent();
        }
        getData() {
            if(!this.measureDateTime) {
                return;
            }

            let uri = this.uri;
            if(this.isNullOrEmpty(uri)) {
                return;
            }
            let argument = {
                patientID: this.patientID,
                measureDateTime: this.measureDateTime,
                maxCount: this.maxCount,
                measureStartDate: this.measureStartDate,
                measureEndDate: this.measureEndDate,
            };


            this.isLoading = true;
            this.post(uri, argument, this.onGetData);
        }

        onSocketNotify(msg) {
            if(!msg) {
                return;
            }

            if(msg.businessID !== 2) {
                return;
            }

            if(msg.notifyID === 4) {
                if(this.patientID === msg.data) {
                    this.getData();
                }
            }
        }

        mounted() {
            this.evtbus.on("socket-notify-msg", this.onSocketNotify);
            let that = this
            this.$nextTick(function () {
			  that.getData();
			})

        }
        beforeDestroy() {
            this.evtbus.off("socket-notify-msg", this.onSocketNotify);
        }
    }
</script>

<style scoped lang="scss">
    .container {
        padding: 0px;
        margin: 0px;
        font-size: 12px;
    }
    .border {
        border: 1px solid lightgray;
    }
    .head {
        height: 25px;
        padding: 0px 30px;
        display: flex;
        align-items: center;
        //background-color: lightgray;

        .title {
            flex: 1;
        }

        .ctrl {
            margin-left: 10px;
            display: flex;
            align-items: center;
        }
    }
    .body {
        padding: 0;
        width: 100%;
        height: calc(100% - 25px);
    }
    .canvas {
        position: relative;
        display: inline-block;
        width: 100%;
        height: 100%;
        padding: 0;
        left: 0;
        top: 0;
    }
    .btn {
        color: black;
    }
    .btn-selected {
        color: orange;
    }
</style>
