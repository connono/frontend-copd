<template>
    <div class="container">
        <div class="left">
            <span class="el-icon-changfangxing" style="color: rgba(102, 204, 255, 1)"></span>
            管理情况：
        </div>
        <div class="right">
            <div v-if="data !== null">
                <div style="display: flex; align-items: center;">
                    <div v-if="data.manageClass.includes('高血压')">
                        <div class="row">
                            <span class="item-label">高血压管理等级：</span>
                            <span >
                                <div v-if="data.manageStatus === 0">
                                    <div v-if="data.ext">
                                        <div v-if="data.ext.htn">
                                            <span v-if="data.ext.htn.manageLevel == 0">新患者</span>
                                            <span v-else-if="data.ext.htn.manageLevel == 1">一级</span>
                                            <div v-else-if="data.ext.htn.manageLevel == 2" style="display: flex; align-items: center;">
                                                <span>二级&nbsp;</span>
                                                <el-tooltip effect="light">
                                                    <div slot="content">
                                                        <span>二级管理第</span>
                                                        <span>{{toWeeks(data.ext.htn.manageLevelStartDateTime.replace(/-/g,'/'))}}</span>
                                                        <span>周（第</span>
                                                        <span>{{toDays(data.ext.htn.manageLevelStartDateTime.replace(/-/g,'/'), new Date())}}</span>
                                                        <span>天）</span>
                                                    </div>
                                                    <img :src="imgMLW4" v-if="toWeeks(data.ext.htn.manageLevelStartDateTime.replace(/-/g,'/')) > 3"/>
                                                    <img :src="imgMLW3" v-else-if="toWeeks(data.ext.htn.manageLevelStartDateTime.replace(/-/g,'/')) > 2"/>
                                                    <img :src="imgMLW2" v-else-if="toWeeks(data.ext.htn.manageLevelStartDateTime.replace(/-/g,'/')) > 1"/>
                                                    <img :src="imgMLW1" v-else/>
                                                </el-tooltip>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-else>
                                    <span>终止管理</span>
                                </div>
                            </span>
                            <span>&nbsp;&nbsp;</span>
                        </div>
                    </div>

                    <div class="row">
                        <span class="item-label">依从度：</span>
                            <span class="item-content">
                            <star :on="data.complianceRate" :off="5 - data.complianceRate" ></star>
                        </span>
                    </div>
                </div>
                <div style="padding-top: 10px;">
                    <span >{{manageHistory}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from "../BaseComponent"
    import Star from "../graphic/Star"

    import ImgMLW1 from '../../images/data/mlw1.png'
    import ImgMLW2 from '../../images/data/mlw2.png'
    import ImgMLW3 from '../../images/data/mlw3.png'
    import ImgMLW4 from '../../images/data/mlw4.png'

    @Component({
        components: {
            star: Star
        },
        props: {
            patientID: {
                type: Number,
                default: 0
            },
        }
    })
    export default class ManagementSituation extends BaseComponent {
        data = null

        imgMLW1 = ImgMLW1
        imgMLW2 = ImgMLW2
        imgMLW3 = ImgMLW3
        imgMLW4 = ImgMLW4


        get manageHistory() {
            if(this.data === null) {
                return ""
            }

            let result = "已管理";
            result += this.data.manageDays;
            result += "天，共随访";
            result += this.data.followupTimes;
            result += "次";

            if(this.data.lastFollowupDate) {
                result += "，上次随访：";
                result += this.toDateText(this.data.lastFollowupDate.replace(/-/g,"/"));
                result += this.getDaysText(this.data.lastFollowupDays);
            }

            if(this.data.followupDate) {
                result += "，计划随访：";
                result += this.toDateText(this.data.followupDate.replace(/-/g,"/"));
                result += this.getDaysText(this.data.followupDays);
            }

            return result;
        }

        toWeeks(date) {
            let now = new Date();
            let days = this.toDays(date, now);

            let weeks = 1;
            if(days > 21) {
                weeks = 4;
            }
            else if(days > 14) {
                weeks = 3;
            }
            else if(days > 7) {
                weeks = 2;
            }

            return weeks;
        }

        onGetBasicInfo(code, err, data) {
            if (code === 0) {
                this.data = data;
            }
            else if (code !== 20001) {
                this.data == null;
            }
        }
        getBasicInfo() {
            let argument = {
                patientID: this.patientID
            };

            this.post(this.uris.patientBasicInfo, argument, this.onGetBasicInfo);
        }

        mounted() {
            this.getBasicInfo();
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
        padding: 0px 1px;
    }
    .item-label {

    }
    .item-content {
        font-weight: bolder;
        display: block;
    }
</style>
