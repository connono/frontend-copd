<template>
    <div class="container">
        <div class="left">
            <span class="el-icon-changfangxing" style="color: rgba(102, 204, 255, 1)"></span>
            用药情况：
        </div>
        <div class="right">
            <div v-if="data.length > 0">
                <div class="row" v-for="(item, index) in data" :key="index">
                    <span class="lbl">{{item.drugName}}</span>
                    <span class="content">{{item.dosage}}</span>
                    <span class="content">{{item.freq}}</span>
                    <span class="content">
                        <span v-if="item.usedDays > 0">
                            <span>已用</span>
                            <span v-if="item.usedDays < 30">{{item.usedDays}}天</span>
                            <span v-else>{{Math.floor(item.usedDays / 30)}}个月</span>
                        </span>
                        <span v-else>刚开始使用</span>
                    </span>
                </div>
            </div>
            <div class="row" v-else>
                <span class="content">最近暂无用药记录</span>
            </div>
        </div>
    </div>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from "../BaseComponent";

    @Component({
        components: {BaseComponent},
        props: {
            patientID: {
                type: Number,
                default: 0
            },
        }
    })
    export default class Medication extends BaseComponent{
        data = new Array();

        onGetDrugRecordIndex(code, err, data) {
            if (code === 0) {
                this.data = data;
            }
            else if (code !== 20001) {
                this.data == new Array();
            }
        }
        getDrugRecordIndex() {
            let argument = {
                patientID: this.patientID,
                status: 0
            };

            this.post(this.uris.drugRecordIndexList, argument, this.onGetDrugRecordIndex);
        }

        onSocketNotify(msg) {
            if(!msg) {
                return;
            }

            if(msg.businessID !== 2) {
                return;
            }

            if(msg.notifyID === 7) {
                if(this.patientID === msg.data) {
                    this.getDrugRecordIndex();
                }
            }
        }

        mounted() {
            this.getDrugRecordIndex();
            this.evtbus.on("socket-notify-msg", this.onSocketNotify);
        }
        beforeDestroy() {
            this.evtbus.off("socket-notify-msg", this.onSocketNotify);
        }
    }
</script>

<style scoped lang="scss">
    .container {
        overflow: hidden;
    }
    .left {
        float: left;
    }
    .right {
        float: left;
        margin-left: 20px;
    }
    .row {
        display: flex;
        align-items: center;
    }
    .row:not(:first-child) {
        margin-top: 8px;
    }
    .lbl {
        margin-right: 10px;
        min-width: 135px;
    }
    .content {
        color: #999999;
        margin-right: 10px;
        min-width: 55px;
    }
</style>