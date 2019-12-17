<template>
    
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '../BaseComponent'

    @Component
    export default class Base extends BaseComponent {
        oldWidth = 0
        oldHeight = 0

        moveTo(ctx, x, y) {
            ctx.moveTo(this.round(x), this.round(y));
        }

        lineTo(ctx, x, y) {
            ctx.lineTo(this.round(x), this.round(y));
        }

        fillTriangleUp(ctx, x, y, r, color) {
            ctx.beginPath();
            ctx.moveTo(this.round(x), this.round(y));
            ctx.lineTo(this.round(x - r), this.round(y + 1.5 * r));
            ctx.lineTo(this.round(x + r), this.round(y + 1.5 * r));
            ctx.lineTo(this.round(x), this.round(y));
            ctx.closePath();

            ctx.fillStyle = color;
            ctx.fill();
        }
        fillTriangleDown(ctx, x, y, r, color) {
            ctx.beginPath();
            ctx.moveTo(this.round(x), this.round(y));
            ctx.lineTo(this.round(x - r), this.round(y - 1.5 * r));
            ctx.lineTo(this.round(x + r), this.round(y - 1.5 * r));
            ctx.lineTo(this.round(x), this.round(y));
            ctx.closePath();

            ctx.fillStyle = color;
            ctx.fill();
        }
        fillCircle(ctx, x, y, r, fillColor, strokeColor) {
            ctx.beginPath();
            ctx.arc(this.round(x), this.round(y), r, 0, 2*Math.PI);
            ctx.closePath();

            ctx.fillStyle = fillColor;
            ctx.fill();
            ctx.strokeStyle = strokeColor;
            ctx.stroke();
        }

        round(val) {
            return Math.round(val) - 0.5;
        }

        onSizeChanged() {
        }

        mounted() {
            window.addEventListener("resize", this.onSizeChanged);
            this.onSizeChanged();
        }
        beforeDestroy() {
            window.removeEventListener("resize", this.onSizeChanged);
        }
    }
</script>

<style scoped lang="scss">

</style>