<template>
  <div class="auto-container">
    <div>
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="基本信息" name="first">
				<el-row style="margin-bottom:20px;">
					<el-button type="primary" icon="el-icon-edit" @click="centerDialogVisiblePlan = true">新建随访计划</el-button>
					<el-button type="primary" @click="centerDialogVisibleRecord = true">随访</el-button>
					<el-button v-if="information_form.manageStatus=='管理中'" type="primary" @click="centerDialogVisibleReferralOut = true">转出</el-button>
					<el-button v-if="information_form.manageStatus=='向上转诊'||information_form.manageStatus=='向下转诊'" type="primary" @click="centerDialogVisibleReferralBack = true">转回</el-button>
				</el-row>
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
								<el-input v-model="information_form.dateOfBirth" readonly></el-input>
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
								<el-input v-model="information_form.manageStatus" readonly></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="4">
							<el-form-item label="管理等级">
								<el-input v-model="information_form.manageLevel" readonly></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="4">
							<el-form-item label="负责医生">
								<el-input v-model="information_form.doctorName" readonly></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="所属机构">
								<el-input v-model="information_form.orgName" readonly></el-input>
							</el-form-item>
						</el-col>
						<!--<el-col :span="4">
							<el-form-item label="管理历史">
								<el-input v-model="information_form.history" readonly></el-input>
							</el-form-item>
						</el-col>-->
						<el-col :span="4">
							<el-form-item label="依从度">
								<el-input v-model="information_form.complianceRate" readonly></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="8">
							<el-form-item label="转诊医院">
								<el-input v-model="information_form.targetOrgName" readonly></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="4">
							<el-form-item label="转诊医生">
								<el-input v-model="information_form.targetDoctorName" readonly></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="4">
							<el-form-item label="转诊状态">
								<el-input v-model="$dict.referralStatus[information_form.status]" readonly></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="20">
							<el-form-item label="转诊目的">
								<el-input v-model="$dict.referralPurpose[information_form.referralPurpose]" readonly></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="20">
							<el-form-item label="转诊原因">
								<el-input v-model="information_form.referralReason" readonly></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="管理计划" name="second">
				<div class="container">
					<div class="manage-title">
						<span class="bold-text">COPD一级管理计划</span>
						（计划制定时间：2020-3-20 00:00:58，指定人：AI，调整计划）
					</div>
					<div class="manage-drug">
						<el-col :span="4">用药指导：</el-col>
						<el-col :span="20"><span class="bold-text">无</span></el-col>
					</div>
					<div class="manage-diet">
						<el-col :span="4">饮食处方：</el-col>
						<el-col :span="20">
							<ul class="no-dot-container">
								<li class="no-dot"><span class="bold-text">低盐低脂饮食，食盐摄入量<6g</span></li>
							</ul>
						</el-col>
					</div>
					<div class="manage-sports">
						<el-col :span="4">运动处方：</el-col>
						<el-col :span="20">
							<ul class="no-dot-container">
								<li class="no-dot"><span class="bold-text">每日步行15min</span></li>
							</ul>
						</el-col>
					</div>
					<div class="manage-test">
						<el-col :span="4">自我检测：</el-col>
						<el-col :span="20">
							<ul class="no-dot-container">
								<li class="no-dot"><span class="bold-text">每周测量一次PEF</span></li>
								<li class="no-dot"><span class="bold-text">每两周填写一次HAD量表</span></li>
								<li class="no-dot"><span class="bold-text">每周填写一次CAT量表</span></li>
							</ul>
						</el-col>
					</div>
					<div class="manage-target">
						<el-col :span="4">控制目标：</el-col>
						<el-col :span="20">
							<ul class="no-dot-container">
								<li class="no-dot"><span class="bold-text">PEF/PEF预计值≥80%</span></li>
								<li class="no-dot"><span class="bold-text">CAT评分≤10</span></li>
								<li class="no-dot"><span class="bold-text">HAD焦虑得分/抑郁得分≤7</span></li>
							</ul>
						</el-col>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="监测数据" name="third">
				<div id="CAT" class="echarts-data"></div>
				<div id="HAD_Anxiety" class="echarts-data"></div>
				<div id="HAD_Depression" class="echarts-data"></div>
				<div id="PEF" class="echarts-data"></div>
				<div id="WEI" class="echarts-data"></div>
				<div id="SMW" class="echarts-data"></div>
			</el-tab-pane>
			<el-tab-pane label="预警历史" name="fourth">
				<el-table
					:data="warning_tableData"
					stripe
					style="width: 100%">
					<el-table-column
						label="预警时间"
						width="180">
						<template slot-scope="scope">
							<div style="display: inline-block">
								{{transform(scope.row.alertTime)}}
							</div>
						</template>
					</el-table-column>
					<el-table-column
						prop="alertReason"
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
					<!--<el-table-column
						prop="action"
						label="操作"
						width="180">
					</el-table-column>-->
				</el-table>
				<el-pagination
					@size-change="handleSizeChangeWarning"
					@current-change="handleCurrentChangeWarning"
					:current-page="currentPageWarning"
					:page-sizes="[15,30,45,60]"
					:page-size="pageSizeWarning"
					layout="total, sizes, prev, pager, next, jumper"
					:total="WarningCount">
				</el-pagination>
			</el-tab-pane>
			<el-tab-pane label="随访记录" name="fifth">
				<el-table
					:data="following_tableData"
					stripe
					style="width: 100%">
					<el-table-column
						label="随访时间"
						width="180">
						<template slot-scope="scope">
							<div style="display: inline-block">
								{{transform(scope.row.planDate)}}
							</div>
						</template>
					</el-table-column>
					<el-table-column
						prop="followingType"
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
						prop="summary"
						label="记录摘要">
					</el-table-column>
					<!--<el-table-column
						prop="action"
						label="操作"
						width="180">
					</el-table-column>-->
				</el-table>
				<el-pagination
					@size-change="handleSizeChangeFollowing"
					@current-change="handleCurrentChangeFollowing"
					:current-page="currentPageFollowing"
					:page-sizes="[15,30,45,60]"
					:page-size="pageSizeFollowing"
					layout="total, sizes, prev, pager, next, jumper"
					:total="followingCount">
				</el-pagination>
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
			<el-tab-pane label="用药记录" name="eighth">
				<div>
					<div style="display: inline-block; float: right">
						<span>请选择日期</span>
						<el-date-picker
						  style="margin-left: 20px"
						  v-model="selectDate"
						  type="daterange"
						  range-separator="至"
						  start-placeholder="开始日期"
						  end-placeholder="结束日期"
						  value-format="yyyy/MM/dd"
						  @blur="handleDateChange">
						</el-date-picker>
					</div>
				</div>
				<el-table
					:data="drug_tableData"
					stripe
					style="width: 100%">
					<el-table-column
						label="药物名称"
						prop="drugName"
						width="180">
					</el-table-column>
					<el-table-column
						prop="dosage"
						label="剂量"
						width="180">
					</el-table-column>
					<el-table-column
						prop="timePoint"
						label="时间点"
						width="180">
					</el-table-column>
					<el-table-column
						prop="recordTime"
						label="用药时间"
						width="180">
					</el-table-column>
					<el-table-column
						prop="memo"
						label="备注">
					</el-table-column>
				</el-table>
				<el-pagination
					:current-page="1"
					:page-sizes="[15,30,45,60]"
					:page-size="15"
					layout="total, sizes, prev, pager, next, jumper"
					:total="drug_tableData.length">
				</el-pagination>
			</el-tab-pane>
		</el-tabs>
	</div>
	<el-dialog
	  title="新建随访计划"
	  :visible.sync="centerDialogVisiblePlan"
	  width="60%"
	  center>
	    <el-form ref="formPlan" :model="formPlan" label-width="80px">
			<el-form-item label="随访人员">
				<el-input
				  v-model="information_form.name"
				  :disabled="true">
				</el-input>
			</el-form-item>
			<el-form-item label="随访类型">
				<el-radio v-model="formPlan.followupType" label="常规随访">常规随访</el-radio>
				<el-radio v-model="formPlan.followupType" label="预警干预">预警干预</el-radio>
				<el-radio v-model="formPlan.followupType" :label="formPlan.otherFollowupType">其他</el-radio>
				<el-input
				  v-model="formPlan.otherFollowupType"
				  size="medium"
				  placeholder="请输入其他类型"></el-input>
			</el-form-item>
			<el-form-item label="随访时间">
				<el-date-picker
				  v-model="formPlan.planDate"
				  type="datetime"
				  placeholder="选择日期时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="备注">
				<el-input
				  type="textarea"
				  autosize
				  placeholder="请输入内容"
				  v-model="formPlan.memo">
				</el-input>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="centerDialogVisiblePlan = false">取 消</el-button>
			<el-button type="primary" @click="submitCreateFollowPlan">确 定</el-button>
		</span>
	</el-dialog>
	<el-dialog
	  title="新建随访记录"
	  :visible.sync="centerDialogVisibleRecord"
	  width="60%"
	  center>
		<el-form ref="formRecord" :model="formRecord" label-width="80px">
			<el-form-item label="随访方式">
				<el-radio v-model="formRecord.followupMethod" label="门诊">门诊</el-radio>
				<el-radio v-model="formRecord.followupMethod" label="家访">家访</el-radio>
				<el-radio v-model="formRecord.followupMethod" label="电话">电话</el-radio>
			</el-form-item>
			<el-form-item label="随访结果">
				<el-radio v-model="formRecord.status" label="0">失访</el-radio>
				<el-radio v-model="formRecord.status" label="1" @change="form.failureReason=''">进行中</el-radio>
				<el-radio v-model="formRecord.status" label="2" @change="form.failureReason=''">有效</el-radio>
			</el-form-item>
			<el-form-item label="随访类型">
				<el-radio v-model="formRecord.followupType" label="常规随访">常规随访</el-radio>
				<el-radio v-model="formRecord.followupType" label="预警干预">预警干预</el-radio>
				<el-radio v-model="formRecord.followupType" :label="formRecord.otherFailureReason">其他</el-radio>
				<el-input
				  v-model="formRecord.otherFailureReason"
				  size="medium"
				  placeholder="请输入其他类型"
				  :disabled="formRecord.followupType=='常规随访'||formRecord.followupType=='预警干预'"></el-input>
			</el-form-item>
			<el-form-item label="失访原因">
				<el-input
				  v-model="formRecord.failureReason"
				  placeholder="请输入内容"
				  :disabled="formRecord.status!=0"></el-input>
			</el-form-item>
			<el-form-item label="是否死亡">
				<el-radio v-model="formRecord.death" :label="true">是</el-radio>
				<el-radio v-model="formRecord.death" :label="false" @change="formRecord.deathTime=''">否</el-radio>
			</el-form-item>
			<el-form-item label="死亡时间">
				<el-date-picker
				  :disabled="!formRecord.death"
				  v-model="formRecord.deathTime"
				  type="datetime"
				  placeholder="选择日期时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="生活质量">
				<el-radio v-model="formRecord.content.liveQuality" label="良好" checked>良好</el-radio>
				<el-radio v-model="formRecord.content.liveQuality" label="一般">一般</el-radio>
				<el-radio v-model="formRecord.content.liveQuality" label="不佳">不佳</el-radio>
			</el-form-item>
			<el-form-item label="身体状况">
				<el-radio v-model="formRecord.content.physicalCondition" label="良好" checked>良好</el-radio>
				<el-radio v-model="formRecord.content.physicalCondition" label="一般">一般</el-radio>
				<el-radio v-model="formRecord.content.physicalCondition" label="不佳">不佳</el-radio>
			</el-form-item>
			<el-form-item label="心理状况">
				<el-radio v-model="formRecord.content.mentalCondition" label="良好" checked>良好</el-radio>
				<el-radio v-model="formRecord.content.mentalCondition" label="一般">一般</el-radio>
				<el-radio v-model="formRecord.content.mentalCondition" label="不佳">不佳</el-radio>
			</el-form-item>
			<el-form-item label="服药状况">
				<el-radio v-model="formRecord.content.drugCondition" label="良好" checked>良好</el-radio>
				<el-radio v-model="formRecord.content.drugCondition" label="一般">一般</el-radio>
				<el-radio v-model="formRecord.content.drugCondition" label="不佳">不佳</el-radio>
			</el-form-item>
			<el-form-item label="有无急症">
				<el-radio v-model="formRecord.content.hasAcuteSymptoms" :label='false' checked>无</el-radio>
				<el-radio v-model="formRecord.content.hasAcuteSymptoms" :label='true'>有</el-radio>
			</el-form-item>
			<el-form-item label="急性症状">
				<el-input
					v-model="formRecord.content.acuteSypmtoms"
					placeholder="请填写患者新增急性症状"
					:disabled="formRecord.content.hasAcuteSymptoms===false"></el-input>
			</el-form-item>
			<el-form-item label="有无不适">
				<el-radio v-model="formRecord.content.hasNewDiscomfort" :label='false' checked>无</el-radio>
				<el-radio v-model="formRecord.content.hasNewDiscomfort" :label='true'>有</el-radio>
			</el-form-item>
			<el-form-item label="新增不适">
				<el-input
					v-model="formRecord.content.newDiscomfort"
					placeholder="请填写患者新增不适症状"
					:disabled="formRecord.content.hasNewDiscomfort===false"></el-input>
			</el-form-item>
			<el-form-item label="摘要记录">
				<el-input
				  type="textarea"
				  autosize
				  placeholder="请输入内容"
				  v-model="formRecord.summary">
				</el-input>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="centerDialogVisibleRecord = false">取 消</el-button>
			<el-button type="primary" @click="submitCreateFollows">确 定</el-button>
		</span>
	</el-dialog>
	<el-dialog
	  title="申请转诊"
	  :visible.sync="centerDialogVisibleReferralOut"
	  width="60%"
	  center>
	    <el-form ref="formReferralOut" :model="formReferralOut" label-width="80px">
			<el-form-item label="转诊目的">
				<el-select v-model="formReferralOut.referralPurpose" placeholder="请选择">
					<el-option
					  v-for="(val, key, i) in $dict.referralPurpose"
					  :key="i"
					  :label="val"
					  :value="key">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="转诊类型">
				<el-select v-model="formReferralOut.referralType" placeholder="请选择">
					<el-option
					  v-for="(val, key, i) in $dict.referralType"
					  :key="i"
					  :label="val"
					  :value="key">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="转诊原因">
				<el-input
				  v-model="formReferralOut.referralReason"
				  size="medium"
				  placeholder="请输入转诊原因"></el-input>
			</el-form-item>
			<el-form-item label="转诊机构">
				<el-cascader
					v-model="selectedDivison"
					:options="divisionTree"
					:props="{ expandTrigger: 'hover' }"
					@change="getHospitalList"></el-cascader>
				<el-select v-model="formReferralOut.orgCode" placeholder="请选择" @change="getDoctorList">
					<el-option
					  v-for="(hospital,index) in hospitalList"
					  :key="index"
					  :label="hospital.orgName"
					  :value="hospital.orgCode">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="转诊医生">
				<el-select v-model="formReferralOut.doctorID" placeholder="请选择">
					<el-option
					  v-for="(doctor,index) in doctorList"
					  :key="index"
					  :label="doctor.name"
					  :value="doctor.userID">
					</el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="centerDialogVisibleReferralOut = false">取 消</el-button>
			<el-button type="primary" @click="submitCreateReferralApply">确 定</el-button>
		</span>
	</el-dialog>
	<el-dialog
	  title="申请转回"
	  :visible.sync="centerDialogVisibleReferralBack"
	  width="60%"
	  center>
	    <el-form ref="formReferralBack" :model="formReferralBack" label-width="80px">
			<el-form-item label="转诊备注">
				<el-input
				  v-model="formReferralBack.receipt"
				  autosize
				  size="medium"
				  placeholder="请输入内容"></el-input>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="centerDialogVisibleReferralBack = false">取 消</el-button>
			<el-button type="primary" @click="submitCreateReferralBack">确 定</el-button>
		</span>
	</el-dialog>
	<div class="footer">
	  Copyright © 2019 浙江大学
	</div>
  </div>
</template>

<script>
	import Component from 'vue-class-component'
	import BaseComponent from '../../components/BaseComponent'
	import {getPatientBaseInfo,getPatientManageInfo,getPatientReferralInfo,getPatientWarningInfo,getPatientFollowingInfo,getPatientData,createReferralApply,createReferralBack} from '../../api/patientInfo'
	import {createFollowPlan,createFollowRecord} from '../../api/followingPatientList'
	import {fetchDivisionTree,fetchOrgList} from '../../api/orgDict'
	import {getDoctorListOfAnyHos} from '../../api/doctorInfo'
	import moment from 'moment';
	@Component
	export default class Warning extends BaseComponent {
		activeName= 'first';
		information_form={}
		centerDialogVisiblePlan=false;
		centerDialogVisibleRecord=false;
		centerDialogVisibleReferralOut=false;
		centerDialogVisibleReferralBack=false;

		selectedDivison='';
		divisionTree=[];
		hospitalList=[];
		doctorList=[];

		tr_tableData = [];

		formPlan={
		  memo: '',
		  followupType: '',
		  planDate: ''
		}
		formRecord={
		  followupMethod: '',
		  status: '1',
		  followupType: '',
		  failureReason: '',
		  death: false,
		  deathTime: '',
		  content: {
			liveQuality: '良好',
			physicalCondition: '良好',
			mentalCondition: '良好',
			drugCondition: '良好',
			hasAcuteSymptoms: false,
			acuteSymptoms: null,
			hasNewDiscomfort: false,
			newDiscomfort: null
		  },
		  otherFailureReason: '',
		  summary: ''
		}
		formReferralOut={
		  alertSerialNo: 0,
		  doctorID: '',
		  orgCode: '',
		  referralPurpose: '',
		  referralReason: '',
		  referralType: ''
		}
		formReferralBack={
			receipt: ''
		}
		
		warning_tableData=[];
		currentPageWarning=1;
		pageSizeWarning=15;
		WarningCount=0;
		
		following_tableData=[];
		currentPageFollowing=1;
		pageSizeFollowing=15;
		followingCount=0;
		
		patientData = {
		  CAT: [],
		  HAD_Anxiety: [],
		  HAD_Depression: [],
		  PEF: [],
		  WEI: [],
		  SMW: []
		}
		
		eChartsData=[];
		
		drug_tableData = []
		selectDate=[];
		
		
		handleClick(tab, event){
			//console.log(tab.label);
			if(tab.label === '监测数据'){
				Object.keys(this.patientData).forEach(key=>{
					let eCharts = this.$echarts.init(document.getElementById(key))
					eCharts.setOption({
						title: {
						  left: 'center',
						  text: key
						},
						tooltip: {
						  trigger: 'axis',
						  position: function (pt){
						    return [pt[0], '10%'];
						  }
						},
						toolbox: {
						  feature: {
						    dataZoom: {
							  yAxisIndex: 'none'
							},
							restore: {},
							saveAsImage: {}
						  }
						},
						xAxis: {
						  type: 'category',
						  boundaryGap: false,
						  data: this.patientData[key].map(item=>{return moment(item.recordTime).format('YYYY-MM-DD')})
						},
						yAxis: {
						  type: 'value',
						  boundaryGap: [0, '100%']
						},
						dataZoom: [{
						  type: 'inside',
						  start: 0,
						  end: 10
						}, {
						  start: 0,
						  end: 10,
						  handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
						  handleSize: '80%',
						  handleStyle: {
						  color: '#fff',
						  shadowBlur: 3,
						  shadowColor: 'rgba(0, 0, 0, 0.6)',
						  shadowOffsetX: 2,
						  shadowOffsetY: 2
						}
						}],
						series: [{
						  data: this.patientData[key].map(item=>{return item.value}),
						  type: 'line'
						}]
					})
					window.addEventListener("resize", function () {
						eCharts.resize();
					});
				})
			} 
		}

		getDivisonTree() {
			fetchDivisionTree()
			.then(res=>{
				var stack = [].concat(res.data)
				while(stack.length!=0){
					var node = stack.pop()
					node.value = node.divisionCode
					node.label = node.divisionName
					if(node.children){
						stack.push(...node.children)
						node.children.unshift({value: node.divisionCode, label: node.divisionName})
					}
				}
				this.divisionTree=res.data
			})
			.catch(err=>{
				this.err(err)
			})
		}

		getHospitalList() {
			if(this.selectedDivison==''){
				this.error('请选择地区')
				return
			}
			this.formReferralOut.orgCode=''
			this.formReferralOut.doctorID=''
			this.doctorList=[]
			var divisionCode = this.selectedDivison[this.selectedDivison.length-1]
			fetchOrgList({divisionCode: divisionCode})
			.then(res=>{
				this.hospitalList = res.data
			})
			.catch(err=>{
				this.err(err)
			})
		}

		getDoctorList() {
			this.formReferralOut.doctorID=''
			getDoctorListOfAnyHos({orgCode: this.formReferralOut.orgCode})
			.then(res=>{
				this.doctorList = res.data
			})
			.catch(err=>{
				this.err(err)
			})
		}
		
		transform(date){
			return moment(date).format('YYYY-MM-DD');
		}
		
		handleSizeChangeFollowing(val){
			console.log(val)
			this.pageSizeFollowing=val;
			this.getFollowing();
		}
		
		handleCurrentChangeFollowing(val){
			this.currentPageFollowing=val;
			this.getFollowing();
		}
		
		getFollowing(){
			getPatientFollowingInfo({patientID: this.$route.params.patientID, pageIndex: this.currentPageWarning, pageOffset: this.pageSizeWarning})
			  .then(response=>{
			    console.log(response)
				this.following_tableData = response.data.content;
				this.followingCount = response.data.totalElements;
			  })
			  .catch(err=>{
				console.log(err);
			  })
		}
		
		handleSizeChangeWarning(val){
			this.pageSizeWarning=val;
			this.getWarning();
		}
		
		handleCurrentChangeWarning(val){
			this.currentPageWarning=val;
			this.getWarning();
		}
		
		getWarning(){
			getPatientWarningInfo({patientID: this.$route.params.patientID, pageIndex: this.currentPageWarning, pageOffset: this.pageSizeWarning})
			  .then(response=>{
				this.warning_tableData = response.data.content;
				this.warningCount = response.data.totalElements;
			  })
			  .catch(err=>{
				console.log(err);
			  })
		}
		
		P_getInfo = function(func,data){
			return new Promise((resolve, reject)=>{
				func(data)
				  .then(response=>{
					resolve(response.data);
			      })
			      .catch(err=>{
					reject(err);
			      })
			    })
		}
		
		getInformation(){
			var P_getPatientBaseInfo = this.P_getInfo(getPatientBaseInfo,{patientID: this.$route.params.patientID});
			var P_getPatientManageInfo = this.P_getInfo(getPatientManageInfo,{patientID: this.$route.params.patientID});
			var P_getPatientReferralInfo = this.P_getInfo(getPatientReferralInfo,{patientID: this.$route.params.patientID});
			Promise.all([P_getPatientBaseInfo,P_getPatientManageInfo,P_getPatientReferralInfo])
			  .then(result=>{
			    var new_information = {};
				result.map(obj=>{
					new_information = {...new_information, ...obj}
				})
				if(result[2]&&result[2].serialNo)
					new_information.referralSerialNo = result[2].serialNo;
				if(new_information.sex){
					new_information.sex=this.$dict.sex[new_information.sex];
					new_information.manageStatus=this.$dict.manageStatus[new_information.manageStatus];
					new_information.manageLevel=this.$dict.manageLevel[new_information.manageLevel];
				}
				this.information_form = new_information;
				// console.log(new_information);
				return new_information;
			  })
			  .catch(err=>{
			    console.log(err)
			  })
		}

		submitCreateFollows(){
	  		//console.log(this.formRecord,this.selectedPatientID,this.selectedPlanDate,this.selectedSerialNo);
			createFollowRecord({
			alertSerialNo: null,
			content: JSON.stringify(this.formRecord.content),
			deathTime: this.formRecord.deathTime,
			executeDoctorID: this.$store.state.user.token,
			failureReason: this.formRecord.failureReason,
			followupMethod: this.formRecord.followupMethod,
			followupType: this.formRecord.followupType,
			patientID: this.information_form.userID,
			planDate: null,
			planSerialNo: null,
			status: this.formRecord.status,
			summary: this.formRecord.summary,
			templateCode: 0})
			.then(res=>{
				this.success('提交成功')
				this.centerDialogVisibleRecord = false;
				this.getCount();
				this.getAllList();
			})
			.catch(err=>{
				this.error('提交失败')
			})
	    }
		
		submitCreateFollowPlan(){
			createFollowPlan({
			  followupType: this.formPlan.followupType,
			  memo: this.formPlan.memo,
			  patientID: this.$route.params.patientID,
			  planDate: this.formPlan.planDate})
			  .then(res=>{
				this.success('提交成功')
				this.centerDialogVisiblePlan = false;
				this.$router.go(0)
			  })
		      .catch(err=>{
				this.error('提交失败')
			})
	    }
		
		submitCreateReferralApply(){
			createReferralApply({
			  alertSerialNo: 0,
			  doctorID: this.formReferralOut.doctorID,
			  initiator: this.$store.state.user.token,
			  orgCode: this.formReferralOut.orgCode,
			  patientID: this.$route.params.patientID,
			  referralPurpose: this.formReferralOut.referralPurpose,
			  referralReason: this.formReferralOut.referralReason,
			  referralType: this.formReferralOut.referralType,
			})
			.then(res=>{
			  this.success('提交成功')
			  this.centerDialogVisibleReferralOut = false;
			  this.$router.go(0)
			})
			.catch(err=>{
			  this.error('提交失败')
			})
		}
		
		submitCreateReferralBack(){
			createReferralBack({
				receipt: this.formReferralBack.receipt,
				serialNo: this.information_form.referralSerialNo
			})
			.then(res=>{
			  this.success('提交成功')
			  this.centerDialogVisibleReferralBack = false;
			})
			.catch(err=>{
			  this.error('提交失败')
			})
		}
		
		getData(){
			var P_getPatientData = [];
			for(var i=1; i<=8; i++){
				var now = new Date();
				var endDate = now.getFullYear()+'/'+(now.getMonth()+1)+'/'+now.getDate();
				var startDate = (now.getFullYear()-1)+'/'+(now.getMonth()+1)+'/'+now.getDate();
				P_getPatientData.push(this.P_getInfo(getPatientData,{patientID: this.$route.params.patientID, startDate: startDate, endDate: endDate, type: i}));
			}
			Promise.all(P_getPatientData)
			  .then(result=>{
				console.log(result);
			    this.patientData.CAT = result[0];
			    this.patientData.HAD_Anxiety = result[1].map((item)=>{item.value=item.anxiety;return item;});
			    this.patientData.HAD_Depression = result[1].map((item)=>{item.value=item.depression;return item;});
			    this.patientData.PEF = result[2];
			    this.patientData.WEI = result[6];
			    this.patientData.SMW = result[7];
			  })
			  .catch(err=>{
			    console.log(err);
			  })
		}
		
		handleDateChange(){
			getPatientData({endDate: this.selectDate[1], patientID: this.$route.params.patientID, startDate: this.selectDate[0], type: 4})
			  .then(res=>{
				this.drug_tableData = res.data;
			  })
			  .catch(err=>{
				console.log(err);
			  })
		}
		
		mounted(){
			
			//console.log(this.$route.params.patientID);
			this.getInformation()
			this.getWarning();
			this.getFollowing();
			this.getData();
			this.getDivisonTree();
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
.el-pagination{
  float: right;
  margin-top: 10px;
}

.echarts-data{
	height: 300px;
	width: 800px;
	margin: 20px auto;
}
</style>
