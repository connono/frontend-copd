<template>
    <div>
        <div ref="trend" v-if="dataExist">
            <ve-line ref="chart"
                     :width="chartWidth"
                     :height="chartHeight"
                     :data="chartData"
                     :grid="chartGrid"
                     :settings="chartSettings"
                     :legend-visible="false"
                     :loading="loading"
                     :extend="chartExtend"
                     :mark-line="chartMarkLine"
                     :toolbox="chartToolbox">
            </ve-line>
        </div>
        <div v-else>
            <div  class="chartEmpty"></div>
            <div class="empty">无体重记录</div>
        </div>
    </div>

</template>

<script>
    import Component from 'vue-class-component'
    import BaseComponent from '../../BaseComponent'

    @Component({
        props: {
            patientID: {
                type: Number,
                default: 0,
            },
            measureDateStart: {
                type: String,
                default: null,
            },
            measureDateEnd: {
                type: String,
                default: null,
            },
            ctrlVisible: {
                type: Boolean,
                default: true
            },
            ctrlWeight: {
                type: Number,
                default: 55
            }
        },
        watch: {
            "measureDateStart": {
                handler: "getData"
            },
            "measureDateEnd": {
                handler: "getData"
            },
            "ctrlVisible": {
                handler: "setCtrlLine"
            },
        }
    })
    export default class BloodGlucose extends BaseComponent {
        loading = false
        errSummary = ""
        errDetail = ""
        chartWidth = "400px"
        chartHeight = "300px"
	    dataExist   = true
        chartSettings = {
            labelMap: {
                weight: '体重',
            }
        }
        chartData = {
            columns: ['measureDateTime', 'weight'],
            rows: []
        }
        chartGrid = {
            show: false,
            top: 25,
            bottom:20,
            right: 60
        }
        chartExtend = {
            series (v) {
                v.forEach(i => {
                    i.barWidth = 30;
                })
                return v
            },
            xAxis : {
                axisLabel : {
                    formatter: function(value, index){
                        if(value) {
                            let date = new  Date(value.replace(/-/g,'/'));
                            return date.format("MM月dd日");
                        }
                        return value;
                    }
                }
            }
        }
        chartMarkLine = {
            lineStyle: {
                color: "#f00",
            },
            data: [
                {
                    symbol: "none",
                    yAxis: this.ctrlWeight
                }
            ]
        }
        chartToolbox = {
            feature: {
                magicType: {type: ['line', 'bar']},
                //saveAsImage: {}
            }
        }

        onSizeChanged(){

            let trend = this.$refs.trend;
            if(trend) {
                let trendWidth = trend.offsetWidth;
                let trendHeight = trend.offsetHeight;
                if(trendWidth > 0) {
                    this.chartWidth = trendWidth + "px";
                }
                if(trendHeight > 0) {
                    this.chartHeight = trendHeight + "px";
                }
            }
        }

        setCtrlLine() {
            if(this.ctrlVisible) {
                this.chartMarkLine.data = [
                    {
                        symbol: "none",
                        yAxis: this.ctrlWeight
                    }
                ];
            }
            else {
                this.chartMarkLine.data = [];
            }
        }

        onGetData(code, err, data) {
            this.loading = false;
            if (code === 0) {
                this.chartData.rows = data;
			    if(data.length > 0){
				    this.dataExist = true;
			    }
			    else {
				    this.dataExist = false;
			    }
            }
            else if (code !== 20001) {
                this.errSummary = err.summary;
                this.errDetail = err.detail;
                this.chartData.rows = [];
            }
        }
        getData() {
            let argument = {
                patientID: this.patientID,
                measureStartDate: this.measureDateStart,
                measureEndDate: this.measureDateEnd
            }

            this.loading = true;
            this.post(this.uris.patientWeightRecordList, argument, this.onGetData);
        }

        onSocketNotify(msg) {
            if(!msg) {
                return;
            }

            if(msg.businessID !== 2) {
                return;
            }

            if(msg.notifyID === 6) {
                if(this.patientID === msg.data) {
                    this.getData();
                }
            }
        }

        mounted() {
            window.addEventListener("resize", this.onSizeChanged);
            this.onSizeChanged();
            this.evtbus.on("socket-notify-msg", this.onSocketNotify);
            this.setCtrlLine();
        }
        beforeDestroy() {
            window.removeEventListener("resize", this.onSizeChanged);
            this.evtbus.off("socket-notify-msg", this.onSocketNotify);
        }
    }
</script>

<style scoped lang="scss">
    .chartEmpty{
        width: 100%;
        height: 345px;
        /*border-top:1px green solid ;*/
        border-bottom: 1px 	#D3D3D3 solid;
    }
    .empty{
        margin-top: 2px;
    }
</style>
