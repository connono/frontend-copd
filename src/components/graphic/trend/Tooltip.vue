<template>
       <div :style="showData"  :class="getClass" ref="showData" class="showData" v-if="targetPoint && visible" >
            <div>&nbsp;{{targetPoint.time}}</div>
            <div>
                <span :style ="sysStyle">&#9660</span>
                <span>收缩压：</span>
                <span>{{targetPoint.systolicPressure.value}}</span>
                <span>mmHg</span>
            </div>
            <div >
                <span :style ="diaStyle">&#9650</span>
                <span>舒张压：</span>
                <span>{{targetPoint.diastolicPressure.value}}</span>
                <span>mmHg</span>
            </div>
            <div v-if="ctrlVisible && targetPoint.heartRate.value > 0">
                <span :style="heartStyle">&#9675</span>
                <span>心&nbsp;&nbsp;&nbsp;&nbsp;率：</span>
                <span>{{targetPoint.heartRate.value}}</span>
                <span>次/分钟</span>
            </div>
        </div>



</template>

<script>
  import Component from 'vue-class-component'
  import BaseComponent from '../../../components/BaseComponent'
  @Component({
    props:{
      targetPoint:{
        type: Object,
      },
      ctrlVisible:{
        type:Boolean
      },
      visible:{
        type:Boolean
      }
    }
  })
  export default class MouseMove extends BaseComponent{
    get sysStyle(){
      return {
        color : this.targetPoint.systolicPressure.color
      }
    }
    get diaStyle(){
      return {
        color : this.targetPoint.diastolicPressure.color
      }
    }
    get heartStyle(){
      return {
        fontSize: '20px',
        color : this.targetPoint.heartRate.color
      }
    }
    get getClass(){
      let offsetWidth = 200;
      if(window.devicePixelRatio < 1){
		offsetWidth = 150 / window.devicePixelRatio+ 50;
      }
      if(this.targetPoint.x < offsetWidth){
        return  'showData1';
      }
      else return 'showData';
    }
    get showData(){
      let offsetWidth = 200;
      let offsetHeight = 45;
      let lineHeight = 20;
      let height = 80;
      let width = 150;
      if(this.targetPoint.heartRate.value === 0){
        lineHeight = 25;
      }
      if(window.devicePixelRatio < 1){
        lineHeight /= window.devicePixelRatio;
        height /= window.devicePixelRatio;
        offsetWidth = 150 / window.devicePixelRatio+50;
        offsetHeight /= window.devicePixelRatio;
		width /=  window.devicePixelRatio;
      }
      if(this.targetPoint.x < offsetWidth){
        offsetWidth = -30;
      }
      return{
        alignCenter:'center',
        lineHeight:lineHeight +'px',
        left:this.targetPoint.x - offsetWidth+'px',
        top:this.targetPoint.y - offsetHeight+'px',
        width:width+'px',
        height:height+'px'
      }
    }

  }
</script>

<style scoped>
    .showData{
        background: rgba(0,0,0,.4);
        color:#fff ;
        border-radius: 5px;
        padding: 2px 5px;
        position: relative;
        z-index: 999;
        height: 80px;
        width: 150px;
        line-height: 20px;
        font-size:13px;
        white-space: nowrap
    }
    .showData1{
        background: rgba(0,0,0,.4);
        color:#fff ;
        border-radius: 5px;
        padding: 2px 5px;
        position: relative;
        z-index: 999;
        height: 80px;
        width: 150px;
        line-height: 20px;
        font-size:13px;
    }
    .showData:after{
        content: "\00a0";
        width: 0;
        height: 0;
    }
    .showData:after{
        position:absolute;
        z-index:-1;
        bottom:-30px;
        left:50px;
        display:block;
        border-style:solid;
        border-width:12px;
        border-color: transparent     transparent  transparent rgba(0,0,0,.4);
    }
    .showData:after{
        position:absolute;
        z-index:-1;
        bottom:50%;
        left:100%;
    }
    .showData1:after{
        position:absolute;
        z-index:-1;
        bottom:-30px;
        left:50px;
        display:block;
        border-style:solid;
        border-width:12px;
        border-color: transparent    rgba(0,0,0,.4) transparent  transparent ;
    }
    .showData1:after{
        position:absolute;
        z-index:-1;
        bottom:50%;
        left:-24px;
    }
</style>