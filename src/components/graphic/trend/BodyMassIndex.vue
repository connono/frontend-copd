<template>
    <div :class="containerStyle" v-loading="isLoading" element-loading-text="加载中...">
        <div class="head">
            <span class="title">
                <span>当前BMI指数：</span>
                <span v-if="noHeightVisible">
                    <span>请补充身高以便计算</span>
                    <el-input ref="input" v-model="peopleHeight" size="mini" style="display: inline-block ;width: 60px"></el-input>
                    <span>cm</span>
                    <el-button size="mini" @click="doSave">保存</el-button>
                    <errorMessage style="display: inline-block" :summary="errSummary" :detail="errDetail"/>
                </span>
                <span v-else-if="noWeightVisible">录入体重后自动计算。</span>
                <span v-else-if="noAllVisible">录入体重、身高后自动计算。</span>
                <span v-else v-model="data" style="display: inline-block">
                </span>
                <span>{{levelValue}}</span>
                <span>{{levelText}}</span>
            </span>
        </div>
        <div ref="body" class="body">
            <canvas ref="canvas" class="canvas" />
        </div>
    </div>
</template>

<script>
    import Component from 'vue-class-component'
    import Base from '../Base'
    import ErrorMessage from '../../../components/ErrorMessage'

    @Component({
      components: {
        errorMessage: ErrorMessage,
      },
        props: {
            uri: {
                type: String,
                default: function () {
                    return this.uris.patientWeightBmi;
                }
            },
            patientID: {
                type: Number,
                default: 0,
                request: true
            }
        }
    })
    export default class BodyMassIndex extends Base {
	    noHeightVisible = false
	    noWeightVisible = false
	    noAllVisible = false
        rangeMonth = 1
        errSummary = ""
        errDetail = ""
        isLoading = false
        height = 0
	    weight = 0
        peopleHeight=""
        levels = [
            {
                value: 0,
                text: "偏瘦",
                backColor: "rgba(0,204,255,0.1)",
                textColor: "rgba(0,0,0,0.2)"
            },
            {
                value: 18.5,
                text: "正常",
                backColor: "rgba(51,153,0,0.2)",
                textColor: "rgba(0,0,0,0.2)"
            },
            {
                value: 24,
                text: "偏胖",
                backColor: "rgba(255,153,0,0.2)",
                textColor:  "rgba(0,0,0,0.2)"
            },
            {
                value: 27,
                text: "肥胖",
                backColor: "rgba(255,0,0,0.2)",
                textColor: "rgba(0,0,0,0.2)"
            },
            {
                value: 30,
                text: "重度肥胖",
                backColor: "rgba(0,0,0,0.2)",
                textColor: "rgba(255,255,255,0.2)"
            }
        ]
        data = null
        levelValue = null
        levelText = null
        fontColor = "rgba(0,0,0,0.2)"


        get containerStyle() {
            if(this.borderVisible) {
                return "container border";
            }

            return "container";
        }
        doSave(){

          if(this.isNullOrEmpty(this.peopleHeight)) {
            this.errSummary = "身高不能为空";
            this.$refs.input.focus();
            return false;
          }
          else if(isNaN(this.peopleHeight) || (Number(this.peopleHeight) <= 0)){
            this.errSummary = "请输入正确的身高";
            this.$refs['input'].focus();
            return false;
          }
          else {
            this.height=this.peopleHeight
            this.errSummary = "";
            let argument={
              height:parseInt(this.height),
              patientID:this.patientID
            }

            this.post(this.uris.patientHeight,argument,this.onSave)
          }


        }
        showData(){
          if(this.height > 0 && this.weight > 0){
			this.fontColor = "#000000";
			if(this.levels.length > 0){
			  let length = this.levels.length;
			  for (let i = 0; i < length; i++ ) {
				this.levels[i].textColor = "rgb(0,0,0)";
			  }
			  this.levels[4].textColor = "rgb(255,255,255)";
			}
			this.levels[0].backColor = "rgb(0,204,255)";
			this.levels[1].backColor = "rgb(51,153,0)";
			this.levels[2].backColor = "rgb(255,153,0)";
			this.levels[3].backColor = "rgb(255,0,0)";
			this.levels[4].backColor = "rgb(0,0,0)";
          }
          this.drawContent();
        }
        onSave(code, err, data){
          if (code===0){
            this.showData();
            this.getData();
			this.noHeightVisible = false
          }
		  else if (code !== 20001) {
			this.errSummary = err.summary;
			this.errDetail = err.detail;
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

            let levelCount = this.levels.length;
            if(levelCount < 1) {
                return;
            }

            let fontSize = 14 * window.devicePixelRatio;
            let txtYoffset = 2;
            ctx.font = fontSize + "px Arial";
            ctx.fillStyle = this.fontColor
            ctx.textAlign="left";
            ctx.textBaseline="top";
            ctx.fillText("BMI指数", ox, oy + txtYoffset);

            let levelWidth = trendWidth / levelCount;
            let levelHeight = trendHeight;
            let x = ox;
            let y = oy - levelHeight;

            let totalCount = 0;
            let totalWidth = 0;
            let totalValue = 0;
            let dataValue = this.data;
            let dataColor = "#000000"
            let currentIndex = 0;
            let currentStartX = ox;
            ctx.textAlign="center";
            for(let i = 0; i < levelCount; i++) {
                let item = this.levels[i];
                ctx.fillStyle = item.backColor;
                ctx.fillRect(x, y, levelWidth, levelHeight);
                ctx.fillStyle = item.textColor;
                ctx.textBaseline="middle";
                ctx.fillText(item.text, x + levelWidth / 2, y + levelHeight / 2);

                if(i > 0) {

                    ctx.fillStyle = this.fontColor;
                    ctx.textBaseline="top";
                    ctx.fillText(item.value, x, oy + txtYoffset);
                    totalCount++;
                    totalWidth += levelWidth;
                    if(totalValue < item.value) {
                        totalValue = item.value;
                    }
                }
                if(dataValue) {
                    if(this.levelText === null) {
                        this.levelText = "（" + item.text + "）";
                    }
                    if(dataValue > item.value) {
                        dataColor = item.backColor;
                        currentIndex = i;
                        currentStartX = x;
                        this.levelText = "（" + item.text + "）";
                    }
                }

                x += levelWidth;
            }

            if(!dataValue) {
                return;
            }
            let currentItem = this.levels[currentIndex];
            let currentValueStart = currentItem.value;
            let currentValueEnd = 50;
            if(currentIndex + 1 < levelCount) {
                currentValueEnd = this.levels[currentIndex + 1].value;
            }
            let currentValueRange = currentValueEnd - currentValueStart;
            if(currentValueRange <= 0) {
                return;
            }
            let pixelPerValue = levelWidth / currentValueRange;
            let currentX = currentStartX + pixelPerValue * (dataValue - currentValueStart);
            this.fillTriangleDown(ctx, currentX, y, 12, dataColor);
        }

        drawContent() {
            let canvas = this.$refs['canvas'];
            if(canvas) {
                let width = canvas.width * 0.7;
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
                let right = 60 * window.devicePixelRatio;
                let top = 15 * window.devicePixelRatio;
                let bottom = 45 * window.devicePixelRatio;
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

        onGetData(code, err, data) {
            this.isLoading = false;
            this.levelText = null;
            this.levelValue = null;
            if (code === 0) {
                this.data = data;
                if(this.data) {
                    this.levelValue = this.data.toFixed(1);
				    this.showData();
                }
            }
            else if (code !== 20001) {
                this.errSummary = err.summary;
                this.errDetail = err.detail;
                this.data = null;
                console.log("error: " + err.summary + "-" + err.detail)
            }

        }
        getData() {
            let uri = this.uri;
            if(this.isNullOrEmpty(uri)) {
                return;
            }

            let argument = {
                patientID: this.patientID
            };

            this.isLoading = true;
            this.post(uri, argument, this.onGetData);

        }
        getPatientHeight(){
          let argument = {
            patientID: this.patientID
          };
          this.post(this.uris.patientWeightHeightLast,argument,this. onGetPatientHeight)
        }

        onSocketNotify(msg) {
            if(!msg) {
                return;
            }

            if(msg.businessID !== 2) {
                return;
            }

            if(msg.notifyID === 6) {
                if(this.patientID === msg.data) {
                    this.getData();
                }
            }
        }
        onGetPatientHeight(code, err, data){

            if (code === 0) {
                if(data.height === null && data.weight === null){
                    this.noAllVisible = true
				    this.showData()
                }
                else if(data.height !== null && data.weight === null){
                  this.noWeightVisible = true;
				  this.height = data.height;
				  this.showData();
                }
                else if(data.height === null && data.weight !== null) {
                  this.noHeightVisible = true;
                  this.weight = data.weight;
				  this.showData()
                }
                else {
				    this.height = data.height;
				    this.weight = data.weight;
                    this.showData()
                }

                this.getData();

            }
            else if (code !== 20001) {
                this.errSummary = err.summary;
                this.errDetail = err.detail;
          }
        }

        mounted() {
            this.getPatientHeight();
            this.evtbus.on("socket-notify-msg", this.onSocketNotify);
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
    }
    .border {
        border: 1px solid lightgray;
    }
    .head {
        height: 25px;
        padding: 0px 0px;
        display: flex;
        align-items: center;

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

</style>