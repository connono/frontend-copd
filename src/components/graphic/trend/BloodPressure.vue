<template>
    <div class="container">
        <div class="head">
            <span class="title">单次血压记录（单位：mmHg）</span>
            <el-checkbox class="ctrl" size="mini"
                         v-show="heartRateCtrlVisible"
                         v-model="heartRateVisible"
                         v-on:change="drawContent">心率</el-checkbox>
            <el-checkbox class="ctrl" size="mini"
                         v-show="bloodPressureCtrlVisible"
                         v-model="bloodPressureVisible"
                         v-on:change="drawContent">血压控制目标线</el-checkbox>
        </div>
        <div ref="body" class="body">
            <canvas ref="canvas" class="canvas" />
        </div>
    </div>
</template>

<script>
    import Component from 'vue-class-component'
    import Base from '../Base'

    @Component({
        props: {
            uri: {
                type: String,
                default: function () {
                    return this.uris.getBloodPressureDataStat;
                }
            },
            patientID: {
                type: Number,
                default: 0,
                request: true
            },
            measureStartDate: {
                type: String,
                default: null
            },
            measureEndDate: {
                type: String,
                default: null
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
            heartRateCtrlVisible: {
                type: Boolean,
                default: true
            },
            bloodPressureCtrlVisible: {
                type: Boolean,
                default: true
            }
        },
        watch: {
            "patientID" : {
                handler: "onFilterChanged"
            },
            "measureStartDate" : {
                handler: "onFilterChanged"
            },
            "measureEndDate" : {
                handler: "onFilterChanged"
            }
        }
    })
    export default class BloodPressure extends Base {
        errSummary = ""
        errDetail = ""
        isError = false
        isLoading = false
        heartRateVisible = true
        bloodPressureVisible = true
        items = []
        dataMax = 200
        dataMin = 60
        timeMax = 0
        timeMin = 0

        onFilterChanged(newVal, oldVal) {
            this.getData();
        }
        onGetData(code, err, data) {
            this.isLoading = false;

            if (code === 0) {
                this.items = data.items;

                if(data.min) {
                    this.dataMin = data.min.systolicPressure;
                    if(this.dataMin > data.min.diastolicPressure) {
                        this.dataMin = data.min.diastolicPressure
                    }
                    if(data.min.heartRate) {
                        if(this.dataMin > data.min.heartRate) {
                            this.dataMin = data.min.heartRate
                        }
                    }
                    let measureDateTime = new Date(data.min.measureDateTime);
                    this.timeMin = measureDateTime.getTime();
                }

                if(data.max) {
                    this.dataMax = data.max.systolicPressure;
                    if(this.dataMax < data.max.diastolicPressure) {
                        this.dataMax = data.max.diastolicPressure
                    }
                    if(data.max.heartRate) {
                        if(this.dataMax < data.max.heartRate) {
                            this.dataMax = data.max.heartRate
                        }
                    }
                    let measureDateTime = new Date(data.max.measureDateTime);
                    this.timeMax = measureDateTime.getTime();
                }
            }
            else if (code !== 20001) {
                this.isError = true;
                this.errSummary = err.summary;
                this.errDetail = err.detail;
                this.items =[];
            }

            this.drawContent();
        }
        getData() {
            if(this.isNullOrEmpty(this.uri)) {
                return;
            }

            let argument = {
                patientID: this.patientID,
                measureStartDate: this.measureStartDate,
                measureEndDate: this.measureEndDate,
            };

            this.isError = false;
            this.isLoading = true;
            this.post(this.uri, argument, this.onGetData);
        }

        drawTrend(ctx, width, height, offsetX) {
            if(!ctx) {
                return;
            }
            let trendWidth = width - 1.5 * offsetX;
            if(trendWidth < 1) {
                return;
            }
            let top = 20;
            let bottom = 50;
            let ox = offsetX;
            let oy = height - bottom;
            let trendHeight = oy - top;
            if(trendHeight < 1) {
                return;
            }

            ctx.strokeStyle = "#666666";
            ctx.beginPath();
            this.moveTo(ctx, ox, top);
            this.lineTo(ctx, ox, oy);
            this.lineTo(ctx, ox + trendWidth, oy);
            ctx.stroke();
            ctx.closePath();
            let padding = 20;
            let dataHeight = trendHeight - 2 *padding;
            if(dataHeight < 0) {
                return;
            }

            let minVal = this.dataMin;
            let maxVal = this.dataMax;
            let pixelPerVal = 0;
            if(maxVal > minVal) {
                pixelPerVal = dataHeight / (maxVal - minVal);
            }

            let fontSize = 10 * window.devicePixelRatio;
            let scaleCount = Math.floor(dataHeight  / (1.6* fontSize));
            if(scaleCount < 1) {
                return;
            }

            ctx.font = fontSize + "px Arial";
            ctx.textAlign="right";
            ctx.textBaseline="middle";
            ctx.beginPath();
            let scaleVal = (maxVal - minVal) / scaleCount;
            scaleVal = Math.ceil(scaleVal / 5) * 5;
            let startVal = Math.ceil(minVal / 5) * 5;
            while (startVal <= maxVal) {
                let y = oy - (startVal - minVal) * pixelPerVal - padding;
                this.moveTo(ctx, ox, y);
                this.lineTo(ctx, ox + 5, y);

                ctx.fillText(startVal.toFixed(0), ox - 5, y);

                startVal += scaleVal;
            }
            ctx.stroke();
            ctx.closePath();

            let dataWidth = trendWidth - 2 * padding;
            if(dataWidth < 0) {
                return;
            }


            let itemCount = this.items.length;
            if(itemCount < 1) {
                return;
            }
            let timeMax = this.timeMax;
            let timeMin = this.timeMin;
            let pixelPerTime = 0;
            if(timeMax > timeMin) {
                pixelPerTime = dataWidth / (timeMax - timeMin);
            }

            // 血压控制目标线
            if(this.bloodPressureVisible) {
                ctx.beginPath();
                let y = oy - (this.diastolicAlarm - minVal) * pixelPerVal - padding;
                this.moveTo(ctx, ox, y);
                this.lineTo(ctx, ox + trendWidth, y);

                y = oy - (this.systolicAlarm - minVal) * pixelPerVal - padding;
                this.moveTo(ctx, ox, y);
                this.lineTo(ctx, ox + trendWidth, y);
                ctx.closePath();

                let lineDash = ctx.getLineDash();
                ctx.setLineDash([5]);
                ctx.strokeStyle = "#ff0000";
                ctx.stroke();
                ctx.setLineDash(lineDash);
            }

            ctx.textAlign="center";
            ctx.textBaseline="top";
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#969696";
            ctx.beginPath();
            let lastTimeLabelX = 0;
            // 标题-舒张压曲线
            for (let i = 0; i < itemCount; i++) {
                let item = this.items[i];
                let mdt = new Date(item.measureDateTime);
                let mdLabel = mdt.format("MM月dd日");
                let mdWidth = ctx.measureText(mdLabel).width;

                let x = ox + padding + (mdt.getTime() - timeMin) * pixelPerTime;
                if(lastTimeLabelX + mdWidth / 2 < x) {
                    lastTimeLabelX = x + mdWidth / 2;
                    ctx.fillText(mdt.format("hh:mm"), x, oy + 5);
                    ctx.fillText(mdLabel, x, oy + fontSize + 10);
                }

                let y = oy - (item.systolicPressure - minVal) * pixelPerVal - padding;
                if(i === 0) {
                    this.moveTo(ctx, x, y);
                }
                else {
                    this.lineTo(ctx, x, y);
                }

                if(itemCount === 1) {
                    this.lineTo(ctx, x, y);
                }
            }

            // 收缩压曲线
            for (let i = 0; i < itemCount; i++) {
                let item = this.items[i];
                let mdt = new Date(item.measureDateTime);

                let x = ox + padding + (mdt.getTime() - timeMin) * pixelPerTime;
                let y = oy - (item.diastolicPressure - minVal) * pixelPerVal - padding;
                if(i === 0) {
                    this.moveTo(ctx, x, y);
                }
                else {
                    this.lineTo(ctx, x, y);
                }

                if(itemCount === 1) {
                    this.lineTo(ctx, x, y);
                }
            }

            // 心率曲线
            if(this.heartRateVisible) {
                for (let i = 0; i < itemCount; i++) {
                    let item = this.items[i];
                    if(!item.heartRate) {
                        continue;
                    }
                    let mdt = new Date(item.measureDateTime);

                    let x = ox + padding + (mdt.getTime() - timeMin) * pixelPerTime;
                    let y = oy - (item.heartRate  - minVal) * pixelPerVal - padding;
                    if(i === 0) {
                        this.moveTo(ctx, x, y);
                    }
                    else {
                        this.lineTo(ctx, x, y);
                    }

                    if(itemCount === 1) {
                        this.lineTo(ctx, x, y);
                    }
                }
            }
            ctx.stroke();
            ctx.closePath();

            let colorAlarm = "#ff0000";
            let colorWarn = "#ffff00";
            let colorNormal = "#006600";
            let triangleR = 6;
            let color = colorNormal;
            for (let i = 0; i < itemCount; i++) {
                let item = this.items[i];
                let mdt = new Date(item.measureDateTime);

                let x = ox + padding + (mdt.getTime() - timeMin) * pixelPerTime;

                let y = oy - (item.diastolicPressure - minVal) * pixelPerVal - padding;
                if(item.diastolicPressure > this.diastolicAlarm) {
                    color = colorAlarm;
                }
                else if(item.diastolicPressure > this.diastolicWarn) {
                    color = colorWarn;
                }
                else {
                    color = colorNormal;
                }
                this.fillTriangleUp(ctx, x, y, triangleR, color)

                y = oy - (item.systolicPressure - minVal) * pixelPerVal - padding;
                if(item.systolicPressure > this.systolicAlarm) {
                    color = colorAlarm;
                }
                else if(item.systolicPressure > this.systolicWarn) {
                    color = colorWarn;
                }
                else {
                    color = colorNormal;
                }
                this.fillTriangleDown(ctx, x, y, triangleR, color)

                if(this.heartRateVisible) {
                    y = oy - (item.heartRate  - minVal) * pixelPerVal - padding;
                    this.fillCircle(ctx, x, y, triangleR, "#ffffff", colorAlarm)
                }
            }

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
                let offsetX = 30 * window.devicePixelRatio;
                this.drawTrend(ctx, width, height, offsetX)
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

        mounted() {
            this.getData();
        }
    }
</script>

<style scoped lang="scss">
    .container {
        font-size: 10px;
    }
    .head {
        padding: 2px 30px;
        display: flex;
        align-items: center;

        .title {
            flex: 1;
        }

        .ctrl {
            margin-left: 15px;
        }
    }
    .body {
        padding: 0;
        width: 100%;
        height: 100%;
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