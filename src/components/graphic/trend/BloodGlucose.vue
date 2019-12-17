<template>
    <div ref="trend" v-if="dataExist">
        <ve-histogram :width="chartWidth"
        :height="chartHeight"
        :data="chartData"
        :grid="chartGrid"
        :colors="chartColors"
        :settings="chartSettings"
        :legend-visible="false"
        :loading="loading"
        :extend="chartExtend"
        :tooltip="tooltip"
        >
        </ve-histogram>
    </div>
    <div v-else>
        <div  class="chartEmpty"></div>
        <div class="empty">无血糖记录</div>
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
            bloodType: {
                type: String,
                default: null,
            },
            timePoints: {
                type: Array,
                default: null,
            },
            measureDateStart: {
                type: String,
                default: null,
            },
            measureDateEnd: {
                type: String,
                default: null,
            },
		   bloodGlucosesTime:{
              type: String,
              default: null
           }
        },
        watch: {
            "bloodType": {
                handler: "getData"
            },
            "timePoints": {
                handler: "getData"
            },
            "measureDateStart": {
                handler: "getData"
            },
            "measureDateEnd": {
                handler: "getData"
            },
		    "patientID": {
			    handler: "getData"
		    },
        }
    })
    export default class BloodGlucose extends BaseComponent {
        loading = false
	    dataExist = true
        errSummary = ""
        errDetail = ""
        chartWidth = "400px"
        chartHeight = "350px"
        beforeRange = ['晨起空腹','午餐前','晚餐前']
        afterRange = ['早餐后','午餐后','晚餐后']
        timeArray = new Array()
        newData = null
        undefinedRange = ['睡前','凌晨']
        //低血糖范围
        lowRange = [3.9]
        //餐前血糖值偏低范围
        partialLowRange = [3.9, 4.4]
        //餐前血糖正常范围
        beforeNormalRange = [4.4, 7]
        //餐前血糖偏高范围
        beforePartialHighRange = [7, 16.7]
        //血糖过高范围
        highRange = [16.7]
        //餐后血糖正常范围
        afterNormalRange = [4.4, 10]
        //餐后血糖正常范围
        afterPartialHighRange = [10, 16.7]
        chartSettings = {
            labelMap: {
                bloodGlucose: '血糖值',
                normal:'正常',
                abnormal:'异常',
                emptyBloodGlucose:'空腹血糖值',
                partial:'偏'
            },
            stack:{'bloodGlucose':['bloodGlucose','emptyBloodGlucose','normal','partial','abnormal'] }
        }
        chartData = {
            columns: ['measureDateTime', 'bloodGlucose','emptyBloodGlucose','normal','partial','abnormal'],
            rows: []
        }
        chartGrid = {
            show: false,
            top: 15,
            bottom:20
        }
        chartColors = [
            "#999999",
            "#F8F8FF",
			"#008000",
            "#FF6100",
			"#FF0000",
        ]
        tooltip = {
            enterable:true,
            trigger: 'axis',
            formatter:function(params){
                let val = 0;
                params.forEach(function (item) {
                if(item.value){
			        val += item.value;
                }
		        })
                val = parseFloat(val.toPrecision(12));//去除浮点数误差
                for(let i in params){
                    if(params[i].value){
                    let relVal = params[i].name.substring(0,19) + '<br/>'
                    relVal += '血糖值'+ ' : ' + val + " " +"(" + params[i].name.substring(19) + ")";
                    return relVal;
                    }
                }
            }
        }
        chartExtend = {
            series (v) {
                v.forEach(i => {
				  i.itemStyle={
					borderColor:"#0F0F0F",
					borderWidth:0.2
				  }
				  i.barWidth = 25;
                })
                return v
            },
            xAxis : {
                axisLabel : {
				  textStyle: {
				  },
				  formatter: function(value, index){
					  let dateMemo = value.substring(0,19)
					  let memo = value.substring(19)
					  let date = new  Date(dateMemo.replace(/-/g,'/'));
					  return date.format("hh:mm") + "\r\n" + date.format("M月d日")+"\r\n"+memo;
				  },
                  align:'left',
                  padding:[0, 0, 0, -12]
                },
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

        onGetData(code, err, data) {
            this.loading = false;
            if (code === 0) {
                if(data.length > 0){
                  this.dataExist = true;
                }
                else {
				  this.dataExist = false;
                }
			    this.timeArray = data.map(function (data) {
				    return data.measureDateTime;
			    })
                this.handle(data)
                this.chartData.rows = data;
			    this.newData =  JSON.parse(JSON.stringify(data));
                this.$emit("showTable")
            }
            else if (code !== 20001) {
                this.errSummary = err.summary;
                this.errDetail = err.detail;
                this.chartData.rows = [];
            }
        }
        handle(data){
            let dataArray = data.map(function (data) {
                return data.bloodGlucose
            })
            let max = Math.max.apply(null, dataArray)
            let height = max * 0.025
            for (let i in  data) {
                //区别餐前、餐后,正常、异常,      晨起空腹
                // 低血糖范围 lowRange  血糖值偏低范围 partialLowRange  餐前血糖正常范围  beforeNormalRange 餐前血糖偏高范围 beforePartialHighRange 血糖过高范围 highRange 餐后血糖正常范围 afterNormalRange 餐后血糖偏高范围 afterPartialHighRange
                if (data[i].timePoint) {
                    data[i].measureDateTime = data[i].measureDateTime + data[i].timePoint
                    let glu = data[i].bloodGlucose
                    if (this.beforeRange.indexOf(data[i].timePoint) !== -1) {
                       if(glu <= this.lowRange[0] || glu >= this.highRange[0]){
                           data[i]['abnormal'] = height
                       }
                       else if((glu > this.partialLowRange[0] && glu < this.partialLowRange[1]) || (glu > this.beforePartialHighRange[0] && glu < this.beforePartialHighRange[1])){
                           data[i]['partial'] = height
                       }
                       else if (glu >= this.beforeNormalRange[0] && glu <= this.beforeNormalRange[1]){
                           data[i]['normal'] = height
                       }
                        data[i]['emptyBloodGlucose'] = glu
                        delete data[i].bloodGlucose
                    } else  {
                        if(glu <= this.lowRange[0] || glu >= this.highRange[0]){
                            data[i]['abnormal'] = height
                        }
                        else if(glu > this.partialLowRange[0] && glu < this.partialLowRange[1] || (glu >= this.afterPartialHighRange[0] && glu < this.afterPartialHighRange[1])){
                            data[i]['partial'] = height
                        }
                        else if (glu >= this.afterNormalRange[0] && glu <= this.afterNormalRange[1]){
                            data[i]['normal'] = height
                        }
                    }
                }
                data[i].bloodGlucose = data[i].bloodGlucose - height;
                data[i].emptyBloodGlucose = data[i].emptyBloodGlucose - height;
            }
        }
        getData() {
            let argument = {
                patientID: this.patientID,
                bloodType: this.bloodType,
                timePoints: this.timePoints,
                measureDateStart: this.measureDateStart,
                measureDateEnd: this.measureDateEnd
            }
            this.loading = true;
            this.post(this.uris.bloodGlucoseRecordTrendList, argument, this.onGetData);
        }

        onSocketNotify(msg) {

            if(!msg) {
                return;
            }

            if(msg.businessID !== 2) {
                return;
            }

            if(msg.notifyID === 5) {
                if(this.patientID === msg.data) {
                    this.getData();
                }
            }
        }
	    onChangeBloodGlucosesTime(v){
          if(this.chartData.rows.length > 0){
			let array = this.timeArray
			let length = array.length
			let index = array.indexOf(v)
            let showLength = 15
            if(length > showLength){
			  if (length - index > 15){
				this.chartData.rows = this.newData.slice(index,index + showLength + 1);
			  }
			  else {
				this.chartData.rows = this.newData.slice(length - showLength,length + 1);
              }
            }
          }
		  this.chartExtend.xAxis.axisLabel={
			textStyle:{
			  color : function (value,index) {
				return value.indexOf(v)<0 ? 'black' : 'red';
			  },
			},
			formatter: function(value, index){
			  let dateMemo = value.substring(0,19)
			  let memo = value.substring(19)
			  let date = new  Date(dateMemo.replace(/-/g,"/"));
			  return date.format("hh:mm") + "\r\n" + date.format("M月d日")+"\r\n"+memo;
			},
			interval:0,
			align:'left',
			padding:[0, 0, 0, -12]
          }
        }

        mounted() {
            let that = this
            this.$nextTick(function () {
                that.getData();
            })
            window.addEventListener("resize", this.onSizeChanged);
            this.onSizeChanged();
            this.evtbus.on("socket-notify-msg", this.onSocketNotify);
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
        height: 283px;
        /*border-top:1px green solid ;*/
        border-bottom: 1px 	#D3D3D3 solid;
    }
    .empty{
        margin-top: 2px;
        margin-bottom: 48px;
    }
</style>
