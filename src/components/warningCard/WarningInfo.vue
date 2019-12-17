<template>
    <div class="WarningInfoContainer">
        <div class="left">
            <span class="el-icon-changfangxing" style="color: rgba(102, 204, 255, 1)"></span>
            预警信息：
        </div>
        <div class="right">
            <div v-if="alertInfo.bloodPressures.length > 0">
                <div v-for="item in alertInfo.bloodPressures" style="margin-bottom: 5px">
                    <el-button type="text" class="btn-item" @click="changeBloodPressureTime(item.alertDateTime)">
                        <span class=" btn-item-selected" v-if="item.alertDateTime === bloodPressuresTime">
                            <span class="el-icon-warning warningIcon"/>
                            <span class="alertNameReason">{{item.alertName}}</span>
                            <span class="alertNameReason">{{item.alertReason}}</span>
                            <span class="alertDateTime">{{item.alertDateTime}}</span>
                        </span>
                        <span v-else>
                            <span class="el-icon-warning warningIcon"/>
                            <span class="alertNameReason">{{item.alertName}}</span>
                            <span class="alertNameReason">{{item.alertReason}}</span>
                            <span class="alertDateTime">{{item.alertDateTime}}</span>
                        </span>
                    </el-button>
                </div>
                <div class="trend" >
                    <bloodPressureSingle class="canvas"
                                         :uri="this.uris.bloodTrendSingleList"
                                         :patientID="patientID"
                                         :measureDateTime="bloodPressuresTime"
                                         :borderVisible="false"
                                         :ctrlVisible="false"
                                         :maskCurrent="true"/>
                </div>
            </div>

            <div v-if="alertInfo.bloodGlucoses.length > 0">
                <div v-for="item in alertInfo.bloodGlucoses" style="margin-bottom: 5px">
                    <el-button type="text" class="btn-item" @click="changeBloodGlucosesTime(item.alertDateTime)">
                        <span class=" btn-item-selected" v-if="item.alertDateTime === bloodGlucosesTime">
                            <span class="el-icon-warning warningIcon"/>
                            <span class="alertNameReason">{{item.alertName}}</span>
                            <span class="alertNameReason">{{item.alertReason}}</span>
                            <span class="alertDateTime">{{item.alertDateTime}}</span>
                        </span>
                        <span v-else>
                            <span class="el-icon-warning warningIcon"/>
                            <span class="alertNameReason">{{item.alertName}}</span>
                            <span class="alertNameReason">{{item.alertReason}}</span>
                            <span class="alertDateTime">{{item.alertDateTime}}</span>
                        </span>
                    </el-button>
                </div>
                <div class="trend" >
                    <bloodGlucose class="canvas" ref="bloodGlucose" :patientID="patientID" :bloodGlucosesTime="bloodGlucosesTime" @showTable="onShowTable"/>
                </div>
            </div>

            <div class="right-others" v-for="item in alertInfo.others">
                <span class="el-icon-warning warningIcon"/>
                <span class="alertNameReason">{{item.alertName}}</span>
                <span class="alertNameReason">{{item.alertReason}}</span>
                <span class="alertDateTime">{{item.alertDateTime}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from "../BaseComponent"
    import BloodPressureSingle from "../graphic/trend/BloodPressureSingle"
    import BloodGlucose from "../graphic/trend/BloodGlucose"

    @Component({
        components: {
            bloodPressureSingle: BloodPressureSingle,
            bloodGlucose: BloodGlucose
        },
        props: {
            alertInfo: {
                type: Object,
            },
            patientID: {
                type: Number,
                default: 0,
                required:true
            },
        },
        watch: {
            "alertInfo": {
                handler: "alertInfoChanged"
            }
        }
    })
    export default class WarningInfo extends BaseComponent{
        bloodPressuresTime = null
	    bloodGlucosesTime = null


        get isShow() {
            if (this.alertInfo.bloodPressures.length === 0) {
                return false;
            }
            return true;
        }

        alertInfoChanged(v) {
            if(!v) {
                return;
            }
            if(!v.bloodPressures && !v.bloodGlucoses) {
                return;
            }
            if(v.bloodPressures[0]){
			  this.bloodPressuresTime = v.bloodPressures[0].alertDateTime;
            }

            if(v.bloodGlucoses[0]){
			    this.bloodGlucosesTime = v.bloodGlucoses[0].alertDateTime;
			    if( this.$refs.bloodGlucose){
				  this.$refs.bloodGlucose.onChangeBloodGlucosesTime(this.bloodGlucosesTime )
                }

            }
        }

        changeBloodPressureTime(v) {
            this.bloodPressuresTime = v;
        }
	    changeBloodGlucosesTime(v) {
		    this.bloodGlucosesTime = v;
            this.$refs.bloodGlucose.onChangeBloodGlucosesTime(v)
	    }
	    onShowTable(){
		  this.alertInfoChanged(this.alertInfo);
        }


        mounted() {
            this.alertInfoChanged(this.alertInfo);
        }

    }
</script>

<style scoped lang="scss">
    .WarningInfoContainer {
        display: flex;
        align-items: start;
        overflow: hidden;
        min-width: 1100px;
    }
    .left {
    }
    .right {
        flex: 1;
        margin-left: 20px;

        .right-others:not(:first-child) {
            margin-top: 10px;
        }
    }
    .alertNameReason{
        color: red;
        font-size: 16px;
        margin-right: 30px;
    }
    .alertDateTime{
        color: #999999;
        font-size: 16px;
    }
    .trend{
        width: 900px;
        height: 220px;
        margin-left: 40px;
        border: 1px solid #c8c8c8;
        margin-top: 10px;
        padding: 0px;
    }
    .canvas {
        height: 100%;
    }
    .warningIcon {
        font-size: 20px;
        color: red;
        margin-right: 10px;
    }
    .btn-item {
        padding: 0px;
        margin: 0px;
    }
    .btn-item-selected {
        font-weight: bold;
    }
</style>