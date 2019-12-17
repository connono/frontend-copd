<template>
    <div class="main">
        <div class="head">
            <span class="title">
                <span class="date">{{titleText}}</span>
            </span>
            <span class="ctrl">
                <span class="today">今</span>
            </span>
        </div>
        <div class="week">
            <span class="day">日</span>
            <span class="day">一</span>
            <span class="day">二</span>
            <span class="day">三</span>
            <span class="day">四</span>
            <span class="day">五</span>
            <span class="day">六</span>
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
            year: {
                type: Number,
                default: 0
            },
            month: {
                type: Number,
                default: 0
            },
            drugs: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            visible: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            "visible": {
                handler: "onVisibleChanged"
            }
        }
    })
    export default class DrugCalendar extends Base {
        days = new Array();
        dayOffset = 0

        get titleText() {
            if(this.year > 0) {
                let dt = new Date(this.year, this.month, 1);

                return dt.format("yyyy/MM");
            }
            else {
                return "";
            }
        }

        getDay(date) {
            let count = this.days.length;
            if(count < 1) {
                return null;
            }
            let index = this.dayOffset + date;
            if(index < 0 || index >= count) {
                return null;
            }

            return this.days[index];
        }

        onVisibleChanged(val) {
            if(val) {
                this.$nextTick(function () {
                    this.onSizeChanged();
                })
            }
        }

        drawCalendar(ctx, width, height, offsetLeft, offsetRight, offsetTop, offsetBottom) {
            if(!ctx) {
                return;
            }
            let dayCount = this.days.length;
            if(dayCount < 1) {
                return;
            }
            let weeks = dayCount / 7;
            if(weeks < 1) {
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
            let dayWidth = trendWidth / 7;
            if(dayWidth < 1) {
                return;
            }
            let dayHeight = trendHeight / 6;
            if(dayHeight < 1) {
                return;
            }

            let ox = offsetLeft
            let oy = offsetTop;

            // grid
            // ctx.beginPath();
            // this.moveTo(ctx, ox, oy);
            // this.lineTo(ctx, ox + trendWidth, oy);
            // this.lineTo(ctx, ox + trendWidth, oy + trendHeight);
            // this.lineTo(ctx, ox, oy + trendHeight);
            // this.lineTo(ctx, ox, oy);
            // ctx.stroke();
            // ctx.closePath();
            //
            // ctx.beginPath();
            // for (let row = 1; row <= weeks; row++) {
            //     let y =  oy + row * dayHeight
            //     this.moveTo(ctx, ox,y);
            //     this.lineTo(ctx, ox + trendWidth, y);
            // }
            // for (let col = 1; col < 7; col++) {
            //     let x =  ox + col * dayWidth
            //     this.moveTo(ctx, x, oy);
            //     this.lineTo(ctx, x, oy + trendHeight);
            // }
            // ctx.stroke();
            // ctx.closePath();

            let colorDisable = "#999999";
            let colorNothing = "#000000";
            let colorFore = "#ffffff";
            let colorBack = "#3464cf";
            let colorToday = "#fd8495";
            let fontSize = 11 * window.devicePixelRatio;
            ctx.font = fontSize + "px Arial";
            ctx.textAlign="center";
            ctx.textBaseline="middle";
            let index = 0;
            let y = oy + dayHeight / 2;
            for (let row = 0; row <= weeks; row++) {
                let x = ox + dayWidth / 2;
                for (let col = 0; col < 7; col++) {
                    let item = this.days[index];
                    if(!item) {
                        continue;
                    }

                    if(item.disable) {
                        ctx.fillStyle = colorDisable;
                    }
                    else {
                        if(item.drugs.length > 0) {
                            if(item.today) {
                                this.fillCircle(ctx, x, y, dayWidth * 0.35, colorToday, colorToday);
                            }
                            else {
                                this.fillCircle(ctx, x, y, dayWidth * 0.35, colorBack, colorBack);
                            }
                            ctx.fillStyle = colorFore;
                        }
                        else {
                            ctx.fillStyle = colorNothing;
                        }
                    }
                    ctx.fillText(item.date, x, y);

                    x += dayWidth;
                    index++;
                }
                y += dayHeight;
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
                let left = 5 * window.devicePixelRatio;
                let right = 5 * window.devicePixelRatio;
                let top = 5 * window.devicePixelRatio;
                let bottom = 5 * window.devicePixelRatio;
                this.drawCalendar(ctx, width, height, left, right, top, bottom)
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
            if(this.year < 1) {
                return;
            }
            let now = new Date();
            let start = new Date(this.year, this.month, 1);
            let end = new Date(this.year, this.month + 1, 0);

            let dayStart = start.getDay();
            if(dayStart > 0) {
                let dt = new Date(this.year, this.month - 1, 0);
                let date = dt.getDate();
                for (let i = dayStart - 1; i >= 0; i--) {
                    this.days.push({
                        disable: true,
                        today: false,
                        date: date,
                        drugs: new Array()
                    });
                    date--;
                    this.dayOffset++
                }
                this.days.reverse();
            }

            for (let i = start.getDate(); i <= end.getDate(); i++) {
                let item = {
                    disable: false,
                    today: false,
                    date: i,
                    drugs: new Array()
                }
                if(start.getFullYear() === now.getFullYear()) {
                    if(start.getMonth() === now.getMonth()) {
                        if(i === now.getDate()) {
                            item.today = true;
                        }
                    }
                }
                this.days.push(item);
            }

            let dayEnd = end.getDay()
            if(dayEnd < 6) {
                let dt = new Date(this.year, this.month + 1, 1);
                let date = dt.getDate();
                for (let i = dayEnd + 1; i <= 6; i++) {
                    this.days.push({
                        disable: true,
                        today: false,
                        date: date,
                        drugs: new Array()
                    });
                    date++;
                }
            }

            let drugCount = this.drugs.length;
            for (let i = 0; i < drugCount; i++) {
                let drug = this.drugs[i];
                if(!drug) {
                    continue;
                }
                let dt = new Date(drug.useDateTime.replace(/-/g,'/'));
                let date = dt.getDate();
                let day = this.getDay(date - 1);
                if(day) {
                    day.drugs.push(drug);
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .main {
        padding: 0px;
        margin: 0px;
        background-color: #fafafa;
    }
    .head {
        height: 25px;
        padding: 0px 5px;
        margin: 0px;
        display: flex;
        align-items: center;

        .title {
            flex: 1;

            .date {
                color: #4781b8;
                font-weight: bold;
            }
        }

        .ctrl {
            margin-left: 10px;
            display: flex;
            align-items: center;

            .today {
                color: #FFFFFF;
                background-color: #fd8495;
                padding: 0px 5px;
                border-radius: 50%;
            }
        }
    }
    .week {
        height: 25px;
        padding: 0px;
        margin: 0px 5px 5px 5px;
        display: flex;
        align-items: center;
        border-bottom: 2px solid #e8c4d3;

        .day {
            width: 14.3%;
            display: block;
            text-align: center;
        }
    }

    .body {
        padding: 0px;
        width: 100%;
        height: calc(100% - 55px);
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
