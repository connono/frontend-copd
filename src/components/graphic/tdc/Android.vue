<template>
    <div class="android">
        <img :src="twoDimensionCodeImage" alt="加载二维码失败"/>
    </div>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '../../BaseComponent'

    @Component
    export default class Android extends BaseComponent {
        twoDimensionCodeImage = ""

        onGetAndroidInfo(code, err, data) {
            if (code === 0) {
                this.twoDimensionCodeImage = data.urlCode;
            }
            else if (code !== 20001) {
            }
        }
        getAndroidInfo() {
            this.post(this.uris.appAndroidInstallInfo, null, this.onGetAndroidInfo);
        }

        mounted() {
            this.getAndroidInfo();
        }
    }
</script>

<style scoped lang="scss">
    .android {

        img {
            width: 100%;
            height: 100%;

            font-size: small;
            color: red;
        }
    }
</style>