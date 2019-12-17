<template>
    <div ref="container" class="container">
        <canvas ref="canvas" class="canvas" />
    </div>
</template>

<script>
    import Component from 'vue-class-component'
    import Base from './Base'

    @Component({
        props: {
            fillColor: {
                type: String,
                default: "#00ccff"
            },
            fillValue: {
                type: Number,
                default: 0
            },
            fillTotal: {
                type: Number,
                default: 0
            }
        },
        watch: {
            "fillValue": {
                handler: "drawContent"
            },
            "fillTotal": {
                handler: "drawContent"
            }
        }
    })
    export default class Rectangle extends Base {

        drawRectangle(ctx, width, height, left, right, top, bottom) {
            if(!ctx) {
                return;
            }
            if(width < 1 || height < 1) {
                return;
            }

            let total = this.fillTotal;
            let value = this.fillValue;
            if(total <= 0 || value <= 0) {
                return;
            }
            let pixelPerValue = width / total;
            let w = value * pixelPerValue;

            ctx.beginPath();
            ctx.rect(left, top, w, height);
            ctx.fillStyle = this.fillColor;
            ctx.fill();
            ctx.closePath();
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
                let left = 0;
                let right = 0;
                let top = 0;
                let bottom = 0;
                this.drawRectangle(ctx, width, height, left, right, top, bottom)
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
            let container = this.$refs['container'];
            if(!container) {
                return;
            }

            let width = container.offsetWidth;
            let height = container.offsetHeight;
            if(width === this.oldWidth && height === this.oldHeight) {
                return;
            }
            this.oldWidth = width;
            this.oldHeight = height;

            this.changeSize(width, height);
        }
    }
</script>

<style scoped lang="scss">
    .container {
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