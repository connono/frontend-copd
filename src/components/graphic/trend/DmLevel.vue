<template>
    <div class="container" v-loading="isLoading" element-loading-text="加载中...">
        <div class="head">
            <span class="title"></span>
            <div class="ctrl" size="mini">
                <i class="el-icon-date"></i>
                <span>范围：</span>
                <el-button size="mini" type="text" @click="changeRange(1)">
                    <span v-if="rangeMonth === 1" class="btn-selected" >1个月</span>
                    <span v-else class="btn">1个月</span>
                </el-button>
                <el-button size="mini" type="text" @click="changeRange(3)">
                    <span v-if="rangeMonth === 3" class="btn-selected" >3个月</span>
                    <span v-else class="btn">3个月</span>
                </el-button>

                <el-button size="mini" type="text" @click="changeRange(6)">
                    <span v-if="rangeMonth === 6" class="btn-selected" >半年</span>
                    <span v-else class="btn">半年</span>
                </el-button>
                <el-button size="mini" type="text" @click="changeRange(12)">
                    <span v-if="rangeMonth === 12" class="btn-selected" >1年</span>
                    <span v-else class="btn">1年</span>
                </el-button>
                <el-button size="mini" type="text" @click="changeRange(0)">
                    <span v-if="rangeMonth === 0" class="btn-selected">全部</span>
                    <span v-else class="btn">全部</span>
                </el-button>
            </div>
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
            patientID: {
                type: Number,
                default: 0,
                request: true
            },
            autoDateRange: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            "autoDateRange": {
                handler: "getData"
            }
        }
    })
    export default class DmLevel extends Base {
        rangeMonth = 1
        errSummary = ""
        errDetail = ""
        isLoading = false
        data = null

        changeRange(month) {
            if(this.rangeMonth === month) {
                return;
            }
            this.rangeMonth = month;
            this.getData();
        }

        drawFollowup(ctx, items, pixelPerTime, startTime, startX, startY) {
            let count = items.length;
            if(count < 1) {
                return;
            }

            ctx.lineWidth = 2;
            ctx.strokeStyle = "#33a5e0";
            ctx.fillStyle = "#1296db";
            let h = 10;
            let xInterval = 2;
            for (let i = 0; i < count; i++) {
                let item = items[i];
                let time = new Date(item.followupDateTime.replace(/-/g,'/'));
                let x = startX + (time.getTime() - startTime) * pixelPerTime;

                ctx.beginPath();
                this.moveTo(ctx, x, startY -1);
                this.lineTo(ctx, x, startY- 4 * h - 1);
                ctx.stroke();
                ctx.closePath();

                ctx.beginPath();
                this.moveTo(ctx, x + xInterval, startY - 4 * h);
                this.lineTo(ctx, x + xInterval + 2 * h, startY - 3 * h);
                this.lineTo(ctx, x + xInterval, startY - 2 * h);
                this.lineTo(ctx, x + xInterval, startY - 4 * h);
                ctx.fill();
                ctx.closePath();
            }
        }

        drawLevel(ctx, items, pixelPerTime, startTime, endTime, startX, endX, infos) {
            let count = items.length;
            if(count < 1) {
                return;
            }

            let getInfo = function (level) {
                let infoCount = infos.length;
                for (let i = 0; i < infoCount; i++) {
                    if(infos[i].level === level) {
                        return infos[i];
                    }
                }
                return null;
            }

            let fillItems = new Array();
            ctx.strokeStyle = "#666666";
            ctx.beginPath();
            let yInterval = 15;
            let lastX = endX;
            let lastY = null;
            let lastTime = endTime;
            for (let i = count-1; i >= 0; i--) {
                let item = items[i];
                let time = new Date(item.startDateTime.replace(/-/g,'/'));
                let w = (lastTime - time.getTime()) * pixelPerTime;
                let info = getInfo(item.level);
                let y = info.y;

                if(lastY !== null) {
                    this.moveTo(ctx, lastX, lastY - yInterval);
                    this.lineTo(ctx, lastX, y - yInterval);
                    this.lineTo(ctx, lastX - w, y - yInterval);

                    fillItems.push({
                        x: lastX - w,
                        y: y - yInterval,
                        w: w,
                        h: yInterval,
                        c: info.color
                    });
                }
                else {
                    this.moveTo(ctx, lastX, y - yInterval);
                    this.lineTo(ctx, lastX - w, y - yInterval);
                    fillItems.push({
                        x: lastX - w,
                        y: y - yInterval,
                        w: w,
                        h: yInterval,
                        c: info.color
                    });
                }
                if(i === 0) {
                    this.lineTo(ctx, startX, y - yInterval);
                    fillItems.push({
                        x: startX,
                        y: y - yInterval,
                        w: lastX - startX,
                        h: yInterval,
                        c: info.color
                    });
                }

                lastY = y;
                lastX -= w;
                lastTime = time.getTime();
            }
            ctx.stroke();
            ctx.closePath();

            count = fillItems.length;
            for (let i = 0; i < count; i++) {
                let item = fillItems[i];
                ctx.beginPath();
                ctx.rect(item.x, item.y, item.w, item.h);
                ctx.fillStyle = item.c;
                ctx.fill();
                ctx.closePath();
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

            let heightInterval = trendHeight / 5;
            let yTerminate = oy - heightInterval - heightInterval / 3;
            let yFirstLevel = yTerminate - heightInterval;
            let ySecondLevel = yFirstLevel - heightInterval;
            let yNewLevel = ySecondLevel - heightInterval;

            ctx.strokeStyle = "#888888";
            ctx.beginPath();
            this.moveTo(ctx, ox, yTerminate);
            this.lineTo(ctx, ox + trendWidth, yTerminate);
            this.moveTo(ctx, ox, yFirstLevel);
            this.lineTo(ctx, ox + trendWidth, yFirstLevel);
            this.moveTo(ctx, ox, ySecondLevel);
            this.lineTo(ctx, ox + trendWidth, ySecondLevel);
            this.moveTo(ctx, ox, yNewLevel);
            this.lineTo(ctx, ox + trendWidth, yNewLevel);
            ctx.stroke();
            ctx.closePath();

            let fontSize = 13 * window.devicePixelRatio;
            ctx.font = fontSize + "px Arial";
            ctx.textAlign="right";
            ctx.textBaseline="middle";
            let txtPaddingX = 10;
            ctx.fillText("终止管理", ox - txtPaddingX, yTerminate);
            ctx.fillText("常规管理", ox - txtPaddingX, yFirstLevel);
            ctx.fillText("强化管理", ox - txtPaddingX, ySecondLevel);
            ctx.fillText("新患者", ox - txtPaddingX, yNewLevel);
            ctx.textBaseline="bottom";
            ctx.fillText("随访记录", ox - txtPaddingX, oy);

            if(this.data === null) {
                return;
            }

            let timeStart = new Date(this.data.dateStart.replace(/-/g,'/'));
            let timeEnd = new Date(this.data.dateEnd.replace(/-/g,'/'));
            let timeSpan = timeEnd.getTime() - timeStart.getTime();
            if(timeSpan < 1) {
                return
            }
            let pixelPerTime = trendWidth / timeSpan;
            let timeTxtWidth = ctx.measureText("12月28日").width;
            ctx.textAlign="center";
            ctx.textBaseline="top";
            let txtPaddingY = 10;
            let timeStartX = timeTxtWidth / 2;
            let timeEndX = trendWidth - timeTxtWidth / 2;
            let time = new Date(timeStart.getTime() + timeStartX / pixelPerTime);
            ctx.fillText(time.format("M月d日"), ox + timeStartX, oy + txtPaddingY);
            time = new Date(timeStart.getTime() + timeEndX / pixelPerTime);
            //ctx.fillText(time.format("MM月dd日"), ox + timeEndX, oy + txtPaddingY);
            let timeCount = Math.round(trendWidth / (1.5 * timeTxtWidth));
            if (timeCount > 2) {
                let timeInterval = (timeEndX - timeStartX) / (timeCount - 2);
                for (let i = 0; i < timeCount - 2; i++) {
                    let timeX = timeStartX + timeInterval * (i + 1);
                    time = new Date(timeStart.getTime() + timeX / pixelPerTime);
                    ctx.fillText(time.format("M月d日"), ox + timeX, oy + txtPaddingY);
                }
            }

            if(this.data.levels.length > 0) {
                let infos = new Array();
                infos.push({
                    level: 9,
                    y: yTerminate,
                    color: "#999999",
                });
                infos.push({
                    level: 1,
                    y: yFirstLevel,
                    color: "#008000",
                });
                infos.push({
                    level: 2,
                    y: ySecondLevel,
                    color: "#ff0000",
                });
                infos.push({
                    level: 0,
                    y: yNewLevel,
                    color: "#3399ff",
                });

                this.drawLevel(ctx,
                    this.data.levels,
                    pixelPerTime,
                    timeStart.getTime(),
                    timeEnd.getTime(),
                    ox,
                    ox + trendWidth,
                    infos);
            }

            if(this.data.followups.length > 0) {
                this.drawFollowup(ctx,
                    this.data.followups,
                    pixelPerTime,
                    timeStart.getTime(),
                    ox,
                    oy);
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
                let left = 85 * window.devicePixelRatio;
                let right = 30 * window.devicePixelRatio;
                let top = 5 * window.devicePixelRatio;
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

        onGetData(code, err, data) {
            this.isLoading = false;

            if (code === 0) {
                this.data = data;
                let levels = data.levels;
                let newLevels = []
                let followups = data.followups;
                let newFollowups = [];
                if (this.rangeMonth > 0) {
                    for (let i = levels.length - 1; i >= 0; i--) {
                        let startTime = new Date(levels[i].startDateTime.replace(/-/g, '/'));
                        if (this.toDays(startTime, new Date()) > 30 * this.rangeMonth) {
                            levels[i].startDateTime = new Date(new Date().setDate(new Date().getDate() - 30 * this.rangeMonth)).format("yyyy-MM-dd hh:mm:ss");
                            newLevels.push(levels[i]);
                            break;
                        } else {
                            newLevels.push(levels[i]);
                        }
                    }
                    data.levels = newLevels.reverse();
                }
                if (data.dateStart < data.levels[0].startDateTime) {
                    data.dateStart = data.levels[0].startDateTime
                }
                if (new Date(data.dateEnd).format("yyyy-MM-dd") <= new Date(data.dateStart).format("yyyy-MM-dd")) {
                    data.dateEnd = new Date().format("yyyy-MM-dd hh:mm:ss");
                }
                for (let i = followups.length - 1; i >= 0; i--) {
                    if (followups[i].followupDateTime >= data.dateStart) {
                        newFollowups.push(followups[i]);
                    }
                }
                data.followups = newFollowups;


            }
            else if (code !== 20001) {
                this.errSummary = err.summary;
                this.errDetail = err.detail;
                this.data = null;
                console.log("error: " + err.summary + "-" + err.detail)
            }

            this.drawContent();
        }
        getData() {
            let argument = {
                patientID: this.patientID,
                monthAgo: 0,
                autoDateRange: this.autoDateRange
            };
            this.isLoading = true;
            this.post(this.uris.manageDmLevelTrend, argument, this.onGetData);
        }

        mounted() {
            this.getData();
            this.evtbus.on("local-followup-create", this.getData);
        }
        beforeDestroy() {
            this.evtbus.off("local-followup-create", this.getData);
        }
    }
</script>

<style scoped lang="scss">
    .container {
        font-size: 12px;
        border: 1px solid lightgray;
    }
    .head {
        height: 25px;
        padding: 0px 30px;
        display: flex;
        align-items: center;
        //background-color: #409eff;

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
