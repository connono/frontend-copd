<template>
  <div class="auto-container">
    <div>
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="基本信息" name="first">
				<el-form ref="information_form" :model="information_form" label-width="80px">
					<el-row>
						<el-col :span="4">
							<el-form-item label="姓名">
								<el-input v-model="information_form.name" readonly></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="3">
							<el-form-item label="性别">
								<el-input v-model="information_form.sex" readonly></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="出生日期">
								<el-input v-model="information_form.date" readonly></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="职业">
								<el-input v-model="information_form.profession" readonly></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="学历">
								<el-input v-model="information_form.education" readonly></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="4">
							<el-form-item label="联系电话">
								<el-input v-model="information_form.phone" readonly></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="3">
							<el-form-item label="身高(cm)">
								<el-input v-model="information_form.height" readonly></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="3">
							<el-form-item label="体重(kg)">
								<el-input v-model="information_form.weight" readonly></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="6">
							<el-form-item label="诊断">
								<el-input v-model="information_form.diagnose" readonly></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="4">
							<el-form-item label="管理状态">
								<el-input v-model="information_form.manage" readonly></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="4">
							<el-form-item label="负责医生">
								<el-input v-model="information_form.doctor" readonly></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="所属机构">
								<el-input v-model="information_form.ass_institution" readonly></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="4">
							<el-form-item label="管理历史">
								<el-input v-model="information_form.history" readonly></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="4">
							<el-form-item label="依从度">
								<el-input v-model="information_form.adherence" readonly></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="8">
							<el-form-item label="转诊医院">
								<el-input v-model="information_form.tr_hospital" readonly></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="4">
							<el-form-item label="转诊医生">
								<el-input v-model="information_form.tr_doctor" readonly></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="20">
							<el-form-item label="转诊目的">
								<el-input v-model="information_form.tr_target" readonly></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="20">
							<el-form-item label="转诊原因">
								<el-input v-model="information_form.tr_reason" readonly></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="管理计划" name="second">
				<div class="container">
					<div class="manage-title">
						<span class="bold-text">高血压一级管理计划</span>
						（计划制定时间：2020-3-20 00:00:58，指定人：AI，调整计划）
					</div>
					<div class="manage-drug">
						<el-col :span="4">用药指导：</el-col>
						<el-col :span="20"><span class="bold-text">ACEI和ARB.......</span></el-col>
					</div>
					<div class="manage-diet">
						<el-col :span="4">饮食处方：</el-col>
						<el-col :span="20">
							<ul class="no-dot-container">
								<li class="no-dot"><span class="bold-text">低盐低脂饮食，食盐摄入量<6g，.....</span></li>
								<li class="no-dot"><span class="bold-text">低盐低脂饮食，食盐摄入量<6g，.....</span></li>
								<li class="no-dot"><span class="bold-text">低盐低脂饮食，食盐摄入量<6g，.....</span></li>
							</ul>
						</el-col>
					</div>
					<div class="manage-sports">
						<el-col :span="4">运动处方：</el-col>
						<el-col :span="20">
							<ul class="no-dot-container">
								<li class="no-dot"><span class="bold-text">低盐低脂饮食，食盐摄入量<6g，.....</span></li>
								<li class="no-dot"><span class="bold-text">低盐低脂饮食，食盐摄入量<6g，.....</span></li>
								<li class="no-dot"><span class="bold-text">低盐低脂饮食，食盐摄入量<6g，.....</span></li>
							</ul>
						</el-col>
					</div>
					<div class="manage-test">
						<el-col :span="4">自我检测：</el-col>
						<el-col :span="20">
							<ul class="no-dot-container">
								<li class="no-dot"><span class="bold-text">低盐低脂饮食，食盐摄入量<6g，.....</span></li>
								<li class="no-dot"><span class="bold-text">低盐低脂饮食，食盐摄入量<6g，.....</span></li>
								<li class="no-dot"><span class="bold-text">低盐低脂饮食，食盐摄入量<6g，.....</span></li>
							</ul>
						</el-col>
					</div>
					<div class="manage-target">
						<el-col :span="4">控制目标：</el-col>
						<el-col :span="20">
							<ul class="no-dot-container">
								<li class="no-dot"><span class="bold-text">低盐低脂饮食，食盐摄入量<6g，.....</span></li>
								<li class="no-dot"><span class="bold-text">低盐低脂饮食，食盐摄入量<6g，.....</span></li>
								<li class="no-dot"><span class="bold-text">低盐低脂饮食，食盐摄入量<6g，.....</span></li>
							</ul>
						</el-col>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="监测数据" name="third">监测数据</el-tab-pane>
			<el-tab-pane label="预警历史" name="fourth">
				<el-table
					:data="warning_tableData"
					stripe
					style="width: 100%">
					<el-table-column
						prop="date"
						label="预警日期"
						width="180">
					</el-table-column>
					<el-table-column
						prop="reason"
						label="预警原因"
						width="180">
					</el-table-column>
					<el-table-column
						prop="state"
						label="处理状态"
						width="180">
					</el-table-column>
					<el-table-column
						prop="result"
						label="处理结果"
						width="180">
					</el-table-column>
					<el-table-column
						prop="action"
						label="操作"
						width="180">
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="随访记录" name="fifth">
				<el-table
					:data="following_tableData"
					stripe
					style="width: 100%">
					<el-table-column
						prop="date"
						label="随访时间"
						width="180">
					</el-table-column>
					<el-table-column
						prop="type"
						label="类型"
						width="180">
					</el-table-column>
					<el-table-column
						prop="way"
						label="方式"
						width="180">
					</el-table-column>
					<el-table-column
						prop="result"
						label="结果"
						width="180">
					</el-table-column>
					<el-table-column
						prop="record"
						label="记录摘要"
						width="180">
					</el-table-column>
					<el-table-column
						prop="action"
						label="操作"
						width="180">
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane label="评估记录" name="sixth">评估记录</el-tab-pane>
			<el-tab-pane label="转诊历史" name="seventh">
				<el-table
					:data="tr_tableData"
					stripe
					style="width: 100%">
					<el-table-column
						prop="start_date"
						label="开始时间"
						width="180">
					</el-table-column>
					<el-table-column
						prop="end_date"
						label="结束时间"
						width="180">
					</el-table-column>
					<el-table-column
						prop="state"
						label="转诊状态"
						width="180">
					</el-table-column>
					<el-table-column
						prop="target"
						label="转诊目的"
						width="180">
					</el-table-column>
					<el-table-column
						prop="reason"
						label="转诊原因"
						width="180">
					</el-table-column>
					<el-table-column
						prop="action"
						label="操作"
						width="180">
					</el-table-column>
				</el-table>
			</el-tab-pane>
		</el-tabs>
	</div>
	<div class="footer">
	  Copyright © 2019 浙江大学
	</div>
  </div>
</template>

<script>
	import Component from 'vue-class-component'
	import BaseComponent from '../../components/BaseComponent'
	@Component
	export default class Warning extends BaseComponent {
		activeName= 'first';
		information_form={
		   name:"我换个",
		   sex:"男",
		   date:'2018-8-8',
		   profession:'收缩',
		   education:'收缩',
		   phone:'13888888888',
		   height:188,
		   weight:88,
		   diagnose: 'COPD',
		   manage: '上转',
		   doctor: '张三',
		   ass_institution: '西湖区人民医院',
		   history: '',
		   adherence: '',
		   tr_hospital: '邵逸夫医院',
		   tr_doctor: '李四',
		   tr_target: '住院',
		   tr_reason: '监测数据严重不佳'
		}
		warning_tableData=[];
		following_tableData=[];
		handleClick(tab, event){
			console.log(tab, event);
		}
	}
</script>

<style lang="scss" scoped>
.auto {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.container{
	margin: 50px;
	div{
		margin-top: 10px;
		margin-bottom: 10px;
	}
}

.no-dot{
	list-style-type: none;
}

.bold-text{
	font-weight: bold;
}

.footer{
  margin-top: 40px;
  text-align: center;
}

.no-dot-container{
  margin-top: -3px;
  margin-left: -40px;
}
</style>
