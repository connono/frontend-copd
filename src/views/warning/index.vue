<template>
  <div class="warning-container">
    <div class="info">
		<span>共&nbsp;{{this.patientTotal}}&nbsp;</span>位预警患者，&nbsp;{{this.warningTotal}}&nbsp;条预警信息</span>
		<span>&nbsp;</span>
		<el-button type="primary" :loading="isLoading" @click="load()">{{LoadingText}}</el-button>
	</div>
	<div class="body" v-loading="isSearching">
		<div v-if="warningPatientList.length === 0">
			<span v-if="isError" class="error">
			  <i class="el-icon-error"></i>
			  <div style="color:red">{{errSummary}}</div>
			  <div style="color:red">{{errDetail}}</div>
			</span>
			<span v-else>暂无内容显示</span>
		</div>
		<div v-else>
			<div class="card" v-for="item,index in warningPatientList" :id="item.patientID">
			    <el-card>
				    <div slot="header" class="clearfix">
						<svg-icon v-show="item.sex==1" icon-class="man" style="font-size:30px;color:blue"></svg-icon>
						<svg-icon v-show="item.sex==2" icon-class="woman" style="font-size:30px;color:deeppink"></svg-icon>
						<span class="nameSexAge">{{item.patientName}}</span>
						<span class="nameSexAge">{{item.sexText}}</span>
						<span class="nameSexAge">{{item.age}}岁</span>
						<span>{{item.tag}}</span>
					</div>
					<div class="WarningInfoContainer">
						<div class="left">
							<span class="blueblock"></span>
							预警信息：
						</div>
						<div class="right">
							<div v-if="item.alertItems.length>0">
								<div class="alertItem" v-for="alertItem in item.alertItems">
									<span class="el-icon-warning warningIcon"/>
									<span class="alertNameReason">{{alertItem.alertName}}</span>
									<span class="alertNameReason">{{alertItem.alertReason}}</span>
									<span class="alertDateTime">{{alertItem.alertDateTime}}</span>
								</div>
							</div>
						</div>
					</div>
					<div class="MedicationInfoContainer">
						<div class="left">
							<span class="blueblock"></span>
							用药情况：
						</div>
						<div class="right">
							<div v-if="item.medication.length>0">
								<div class="drugItem" v-for="drug in item.medication">
									<span class="lbl">{{drug.drugName}}</span>
									<span class="content">{{drug.dosage}}</span>
									<span v-if="drug.freq" class="content">{{drug.freq}}</span>
									<span class="content">
										<span v-if="drug.usedDays>0">
											<span>已用</span>
											<span v-if="drug.usedDays<30">{{drug.usedDays}}天</span>
											<span v-else>{{Math.floor(drug.usedDays/30)}}个月</span>
										</span>
										<span v-else>刚开始使用</span>
									</span>
								</div>
							</div>
							<div v-else>
								<span class="content">最近暂无用药记录</span>
							</div>
						</div>
					</div>
					<div class="ManageSituationContainer">
						<div class="left">
							<span class="blueblock"></span>
							管理情况：
						</div>
						<div class="right">
							<div v-if="item.manage!=null" class="row">
								<div v-if="item.manage.manageStatus==0">
									<div style="display: flex; align-items: center;">
										<div v-if="item.manage.manageClass.includes('高血压')">
											<div>
												<span class="row">高血压管理等级：</span>
												<span v-if="item.manage.manageLevel==0">新患者</span>
												<span v-else-if="item.manage.manageLevel==1">一级</span>
												<div v-else-if="item.manage.manageLevel==2" style="display: inline-block; align-items: center;">
													<span>二级&nbsp;</span>
													<el-tooltip effect="light">
														<div slot="content">
															<span>二级管理第</span>
															<span>{{toWeeks(item.manage.manageLevelStartDateTime.replace(/-/g,'/'))}}</span>
															<span>周（第</span>
															
															<span>{{toDays(item.manage.manageLevelStartDateTime.replace(/-/g,'/'), new Date())}}</span>
															<span>天）</span>
														</div>
														<img :src="imgMLM4" v-if="toWeeks(item.manage.manageLevelStartDateTime.replace(/-/g,'/'))>3" />
														<img :src="imgMLM3" v-else-if="toWeeks(item.manage.manageLevelStartDateTime.replace(/-/g,'/'))>2" />
														<img :src="imgMLM2" v-else-if="toWeeks(item.manage.manageLevelStartDateTime.replace(/-/g,'/'))>1" />
														<img :src="imgMLW1" v-else/>
													</el-tooltip>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div v-else>
									<span>终止管理</span>
								</div>
							</div>
							<div v-else class="row">暂无管理情况</div>
							<div class="row">
								<span class="row">依从度</span>
								<span class="row">
									<star :on="item.manage.complianceRate" :off="5-item.manage.complianceRate" ></star>
								</span>
							</div>
							<div style="padding-top: 10px;">
								<span>{{"已管理"+item.manage.manageDays+"天，共随访"+item.manage.followupTimes+"次"}}</span>
								<span v-if="item.manage.lastFollowupDate!=null">{{"，上次随访："+toDateText(item.manage.lastFollowupDate.replace(/-/g,"/"))+getDaysText(item.manage.lastFollowupDays)}}</span>
								<span v-if="item.manage.followupDate!=null">{{"，计划随访："+toDateText(item.manage.followupDate.replace(/-/g,"/"))+getDaysText(item.manage.followupDays)}}</span>
							</div>
							<div class="btn">
								<el-button size="medium" type="primary" @click="showPatientDlg(item.patientID)">立即干预</el-button>
								<el-popover
									trigger="click"
									width="210"
									placement="botoom-start"
									v-model="item.visible"
									:popper-class="'p'+item.patientID"
									@hide="ignoreReason='重复预警'">
									<p>忽略预警的原因：</p>
									<el-select v-model="ignoreReason" style="width: 190px" size="mini">
										<el-option label="重复预警" value="重复预警"></el-option>
										<el-option label="最近已随访" value="最近已随访"></el-option>
									</el-select>
									<div style="text-align: center; margin-top: 15px">
										<el-button class="btn-ignore" size="mini" @click="closeCard(item.patientID)">忽略预警</el-button>
										<el-button class="btn-ignore" size="mini" @click="doClose(item,index)">取消</el-button>
									</div>
									<el-button style="margin-left: 12px" size="medium" slot="reference">忽略预警</el-button>
								</el-popover>
							</div>
						</div>
					</div>
				</el-card>
			</div>
		</div>
	</div>
	<div class="footer">
	  Copyright © 2019 浙江大学
	</div>
  </div>
</template>

<script>
	import Component from 'vue-class-component'
	import BaseComponent from '../../components/BaseComponent'
    import ImgMLW1 from '../../images/data/mlw1.png'
    import ImgMLW2 from '../../images/data/mlw2.png'
    import ImgMLW3 from '../../images/data/mlw3.png'
    import ImgMLW4 from '../../images/data/mlw4.png'
	import Star from '../../components/graphic/Star'
	import {getWarningPatientList,deleteWarningPatient} from '../../api/warningPatientList'
	@Component({
		components: {
			star: Star
		}
	})
	export default class Warning extends BaseComponent {
	  patientTotal = 0
	  warningTotal = 0
	  patientID = 0
	  isSearching = false
	  isError = false
	  errSummary = ""
	  errDetail = ""
	  isLoading = false
	  LoadingText = "刷新"
	  ignoreReason = "重复预警"
	  warningPatientList=[]
	  imgMLM1= ImgMLW1
	  imgMLM2= ImgMLW2
	  imgMLM3= ImgMLW3
	  imgMLM4= ImgMLW4
	  
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
	  doClose(item, index) {
		item.visible = false;
		this.$set(this.warningPatientList, index, item);
	  }
	  closeCard(patientID){
	    deleteWarningPatient({patientID: patientID})
		.then((response)=>{
		  console.log(response);
		  this.success('操作成功')
		}).catch((error)=>{
		  this.error('操作失败')
		});
		this.doList();
	  }
	  showPatientDlg(patientID){
	    this.alert('即将跳转'+patientID+'所在的页面')
	  }
	  
	  doList(){
		this.isError = false;
		this.isSearching = true;
		this.warningTotal = 0;
		this.patientTotal = 0;
		getWarningPatientList().then(response=>{
			console.log(response);
			this.isSearching = false;
			this.isError = false;
			this.warningPatientList = response.data;
			this.getTotal(response.data);
		}).catch(error=>{
			this.isError = true;
		})
		this.isSearching = false;
	  }
	
		getTotal(data){
			this.patientTotal = data.length;
			for(let i = 0; i < data.length; i++){
				this.warningTotal += data[i].alertItems.length;
			}
		}
		
		load(){
			this.isLoading=true;
			this.LoadingText="加载中";
			this.doList();
			this.isLoading=false;
			this.LoadingText="刷新";
		}
		
		mounted(){
		  this.$emit("activeChanged",0)
		  this.doList();
		}
	}
</script>

<style lang="scss" scoped>
.warning {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.nameSexAge{
  font-family: '微软雅黑 Bold', '微软雅黑';
  font-weight: 700;
  font-style: normal;
  font-size: 18px;
  margin-left: 10px;
  margin-right: 40px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.WarningInfoContainer{
  display:flex;
}
.MedicationInfoContainer{
  display: flex;
}
.ManageSituationContainer{
  display: flex;
}
.blueblock{
  background-color: lightblue;
  width: 18px;
  height: 24px;
  margin-bottom: -6px;
  display: inline-block
}
.left{
  display: inline-block;
  flex:1;
  font-size: 18px;
  line-height: 40px;
}
.right{
  display: inline-block;
  flex:3;
  font-size: 18px;
  line-height: 38px;
}
.row{
  display: inline-block;
}
.alertItem{
  display: flex;
  
  .warningIcon{
    color: red;
	font-size: 20px;
	line-height: 38px;
	margin-right: 10px;
  }
  .alertNameReason{
    color: red;
	flex:1
  }
  .alertDateTime{
    color: grey;
	flex:1
  }
}
.drugItem{
  display: flex;
  .lbl{
    flex:1;
  }
  .content{
    color: grey;
	flex:1;
  }
}
.btn-ignore{
  min-width: 85px;
}
.card{
  margin:20px;
}
.footer{
  margin-top: 40px;
  text-align: center;
}
</style>
