<template>
    <span class="star">
        <i class="el-icon-star-on on" v-for="count in on"></i>
        <i class="el-icon-star-off" v-for="count in off"></i>
    </span>
</template>

<script>
    import Vue from 'vue'
    import Component from 'vue-class-component'

    @Component({
        props: {
            on: {
                type: Number,
                default: 0,
            },
            off: {
                type: Number,
                default: 0,
            }
        }
    })
    export default class Star extends Vue {

    }
</script>

<style scoped lang="scss">
    .on {
        color: orange;
    }
    .star {
        display: flex;
        align-items: center;
        font-size: 18px;
    }
</style>