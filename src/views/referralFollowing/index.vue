<template>
  <div class="following-container">
    <div class="patientRow">
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
			<span class="patientText">计划随访&nbsp;<span style="color:orange">{{patientTotal[0]+patientTotal[1]+patientTotal[2]}}</span>&nbsp;位患者， 其中待随访&nbsp;<span style="color:blue">{{patientTotal[0]}}</span>&nbsp;位， 已随访&nbsp;<span style="color:blue">{{patientTotal[1]}}</span>&nbsp;位， 已忽略&nbsp;<span style="color:blue">{{patientTotal[2]}}</span>&nbsp;位。</span>
			<el-button type="primary" icon="el-icon-edit" @click="centerDialogVisiblePlan = true">新建随访计划</el-button>
		<!--<span class="patientText">今天计划随访&nbsp;<span style="color:orange">{{patientTotal.willFollow+patientTotal.followed+patientTotal.ignore}}</span>&nbsp;位患者， 其中待随访&nbsp;<span style="color:blue">{{patientTotal.willFollow}}</span>&nbsp;位， 已随访&nbsp;<span style="color:blue">{{patientTotal.followed}}</span>&nbsp;位， 已忽略&nbsp;<span style="color:blue">{{patientTotal.ignore}}</span>&nbsp;位。</span>
		<span class="patientText" v-else>查找"{{searchedName}}"：共{{searchedTotal}}条记录。</span>
		<el-button type="primary" :loading="isLoading" @click="load()">{{LoadingText}}</el-button>
		<el-input v-model="searchName" placeholder="输入患者姓名查找" class="nameInput">
			<el-button slot="append" icon="el-icon-search" @click="handleSearchName(searchName)"></el-button>
		</el-input>-->
	</div>
	<el-tabs 
	  type="border-card"
	  v-model="selectedTab"
	  >
		<el-tab-pane v-for="(item, index) in list" :label="item">
		    <el-table
			  :data="tableData[selectedTab]"
			  stripe>
				<el-table-column
				  fixed
				  prop="serialNo"
				  label="ID"
				  width="80">
				  </el-table-column>
				<el-table-column
				  fixed
				  prop="patientName"
				  label="姓名"
				  width="90">
				</el-table-column>
				<el-table-column
				  label="性别"
				  width="70">
					<template slot-scope="scope">
						<div style="display: inline-block">
							{{scope.row.sex==1?'男':'女'}}
						</div>
					</template>
				</el-table-column>
				<el-table-column
				  label="年龄"
				  width="70">
					<template slot-scope="scope">
						<div style="display: inline-block">
							{{dateToAge(scope.row.dateOfBirth)}}
						</div>
					</template>
				</el-table-column>
				<el-table-column
				  prop="tag"
				  label="人员标签"
				  width="100">
				</el-table-column>
				<el-table-column
				  label="依从度"
				  width="150">
				    <template slot-scope="scope">
						<div style="display: inline-block">
							<star :on="scope.row.complianceRate" :off="5-scope.row.complianceRate" ></star>
						</div>
					</template>
				</el-table-column>
				<el-table-column
				  label="管理等级"
				  width="110">
					<template slot-scope="scope">
						<div style="display: inline-block">
							<span v-if="scope.row.manageLevel==0">新患者</span>
							<span v-if="scope.row.manageLevel==1">一级</span>
							<div v-if="scope.row.manageLevel==2">
								<span>二级&nbsp;</span>
								<!--<el-tooltip effect="light">
									<div slot="content">
										<span>二级管理第</span>
										<span>{{toWeeks(scope.row.manageLevelStartDateTime.replace(/-/g,'/'))}}</span>
										<span>周（第</span>
										<span>{{toDays(scope.row.manageLevelStartDateTime.replace(/-/g,'/'), new Date())}}</span>
										<span>天）</span>
									</div>
									<img :src="imgMLM4" v-if="toWeeks(scope.row.manageLevelStartDateTime.replace(/-/g,'/'))>3" />
									<img :src="imgMLM3" v-else-if="toWeeks(scope.row.manageLevelStartDateTime.replace(/-/g,'/'))>2" />
									<img :src="imgMLM2" v-else-if="toWeeks(scope.row.manageLevelStartDateTime.replace(/-/g,'/'))>1" />
									<img :src="imgMLW1" v-else/>
								</el-tooltip>-->
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column
				  prop="followupTimes"
				  label="已随访次数"
				  width="120">
				</el-table-column>
				<el-table-column
				  prop="lastFollowupDate"
				  label="上次随访日期"
				  width="180">
				</el-table-column>
				<el-table-column
				  label="计划随访日期"
				  prop="planDate"
				  width="180">
				</el-table-column>
				<el-table-column
				  prop="doctorName"
				  label="医生"
				  width="100">
				</el-table-column>
				<!--<el-table-column
				  prop="type"
				  label="类型"
				  width="150">
				</el-table-column>
				<el-table-column
				  prop="position"
				  label="状态"
				  width="100">-->
				</el-table-column>
				<el-table-column
				  fixed="right"
				  label="操作"
				  width="150">
					<template slot-scope="scope">
						<div v-if="scope.row.status==0">
							<el-button @click="openCreateFollowRecord(scope.row)" type="text" size="medium">立即随访</el-button>
							<el-button @click="handleIgnore(scope.row.serialNo)" type="text" size="medium">忽略</el-button>
							<!--<el-popover
							  trigger="click"
							  width="210"
							  style="z-index: 10000"
							  placement="bottom-start"
							  v-model="scope.row.visible"
							  :popper-class="'p'+scope.row.Id"
							  @hide="ignoreReason=''">
								<p>忽略随访的原因：</p>
								<el-input v-model="ignoreReason" style="width: 180px" size="mini">
								</el-input>
								<div style="text-align: center; margin-top: 15px">
									<el-button class="btn-ignore" size="mini" @click="handleIgnore(scope.row.serialNo)">忽略</el-button>
									<el-button class="btn-ignore" size="mini" @click="doClose(item,index)">取消</el-button>
								</div>
								<el-button type="text" size="medium" slot="reference">忽略</el-button>
							</el-popover>-->
						</div>
						<div v-else-if="scope.row.status==1">
							<el-button @click="handleLook(scope.row)" type="text" size="medium">查看</el-button>
						</div>
						<div v-else>
							<el-button @click="handleClick(scope.row)" type="text" size="medium">撤销操作</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
			  @size-change="handleSizeChange"
			  @current-change="handleCurrentChange"
			  :current-page="currentPage[selectedTab]"
			  :page-sizes="[15,30,45,60]"
			  :page-size="pageSize"
			  layout="total, sizes, prev, pager, next, jumper"
			  :total="patientTotal[selectedTab]">
			</el-pagination>
		</el-tab-pane>
	</el-tabs>
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
				  placeholder="请输入其他类型"></el-input>
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
			<el-form-item label="摘要记录">
				<el-input
				  type="textarea"
				  autosize
				  placeholder="请输入内容"
				  v-model="formRecord.content">
				</el-input>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button @click="centerDialogVisibleRecord = false">取 消</el-button>
			<el-button type="primary" @click="submitCreateFollows">确 定</el-button>
		</span>
	</el-dialog>
	<el-dialog
	  title="新建随访计划"
	  :visible.sync="centerDialogVisiblePlan"
	  width="60%"
	  center>
	    <el-form ref="formPlan" :model="formPlan" label-width="80px">
			<el-form-item label="随访人员">
				<el-select v-model="formPlan.patientID" placeholder="请选择">
					<el-option
					  v-for="item in patientList"
					  :key="item.patientID"
					  :label="item.name"
					  :value="item.patientID">
					</el-option>
				</el-select>
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
  </div>
</template>

<script>
  	import Component from 'vue-class-component'
	import BaseComponent from '../../components/BaseComponent'
	import Star from '../../components/graphic/Star'
	import ImgMLW1 from '../../images/data/mlw1.png'
    import ImgMLW2 from '../../images/data/mlw2.png'
    import ImgMLW3 from '../../images/data/mlw3.png'
    import ImgMLW4 from '../../images/data/mlw4.png'
	import {getFollowingPatientListReferral,ignoreFollowingPatient,getFollowingPatientCountReferral,createFollowRecord,createFollowPlan} from '../../api/followingPatientList'
	import moment from 'moment'
	@Component({
	  components: {
	    star: Star
	  }
	})
	export default class Following extends BaseComponent {
		selectDate=[moment().format('YYYY/MM/DD'),moment().format('YYYY/MM/DD')]
		selectedTab=0
		list=['待随访','已随访','已忽略']
		currentPage=[1,1,1]
		pageSize=15;
		centerDialogVisibleRecord=false;
		centerDialogVisiblePlan=false;
		isLoading=false
		LoadingText="刷新"
		searchName=""
		searchedName=""
		searchedTotal=0
		patientTotal=[0,0,0];
		tableData=[]
		imgMLM1= ImgMLW1
		imgMLM2= ImgMLW2
		imgMLM3= ImgMLW3
		imgMLM4= ImgMLW4
		patientList=[]
		
		formRecord={
		  followupMethod: '',
		  status: '1',
		  followupType: '',
		  failureReason: '',
		  death: false,
		  deathTime: '',
		  content: '',
		  otherFailureReason: '',
		}
		
		formSelected={}
		
		selectedPatientID=''
	    selectedSerialNo=''
		selectedPlanDate=''

		formPlan={
		  memo: '',
		  followupType: '',
		  patientID: '',
		  planDate: ''
		}
		
		dateToAge(str){
			var date = new Date(str);
			var now = new Date();
			return now.getYear()-date.getYear()+1;
	    }
		
		P_getList = function(func,data){
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
		
		getAllList(){
			var P_getListToFollowup = this.P_getList(getFollowingPatientListReferral, {startDate: this.selectDate[0],endDate: this.selectDate[1],pageIndex:1,pageOffset:this.pageSize,status:0,viewerID:this.$store.state.user.token});
			var P_getListFollowedup = this.P_getList(getFollowingPatientListReferral, {startDate: this.selectDate[0],endDate: this.selectDate[1],pageIndex:1,pageOffset:this.pageSize,status:1,viewerID:this.$store.state.user.token});
			var P_getListAbolishedCount = this.P_getList(getFollowingPatientListReferral, {startDate: this.selectDate[0],endDate: this.selectDate[1],pageIndex:1,pageOffset:this.pageSize,status:2,viewerID:this.$store.state.user.token});
			Promise.all([P_getListToFollowup,P_getListFollowedup,P_getListAbolishedCount])
			  .then(res=>{
				this.tableData = res.map(item=>{
					return item.content;
				})
				this.currentPage = [1,1,1];
				console.log(this.tableData)
			  })
			  .catch(err=>{
				console.log(err);
			  })
		}
		
		getList(){
			getFollowingPatientListReferral({startDate: this.selectDate[0],endDate: this.selectDate[1],pageIndex:this.currentPage,pageOffset:this.pageSize,status:this.selectedTab,viewerID:this.$store.state.user.token})
			  .then(res=>{
				this.$set(tableData, this.selectedTab, res.content);
			  })
			  .catch(err=>{
				console.log(err);
			  })
		}
		
		getCount(){
			getFollowingPatientCountReferral({startDate: this.selectDate[0],endDate: this.selectDate[1],viewerID:this.$store.state.user.token}).then(response=>{
				var data = response.data;
				this.patientTotal=[data.toFollowupCount,data.followedupCount,data.abolishedCount];
				console.log(this.patientTotal)
			}).catch(err=>{
				console.log(err);
			})
		}
		
		
		
		handleDateChange(){
			this.getCount();
			this.getAllList();
		}
		
		handleClick(row){
			console.log(row);
		}
		
		handleIgnore(serialNo){
			ignoreFollowingPatient({serialNo: serialNo})
				.then(response=>{
					//console.log(response)
					this.success('忽略成功')
					this.getAllList();
				})
				.catch(err=>{
					this.error('操作失败')
				})
		}
		
		handleSizeChange(val){
			//console.log(`每页${val}条`);
			this.getList();
		}
		
		handleCurrentChange(val){
			//console.log(`当前页:${val}`);
			this.getList();
		}
		
		
		handleLook(row){
			this.$router.push("/patientInfo/"+row.patientID)
		}
		
	
	  openCreateFollowRecord(row){
		this.centerDialogVisibleRecord = true;
		this.selectedPatientID = row.patientID;
		this.selectedPlanDate = row.planDate;
		this.selectedSerialNo = row.serialNo;
	  }
	  
	  
	  submitCreateFollows(){
	  //console.log(this.formRecord,this.selectedPatientID,this.selectedPlanDate,this.selectedSerialNo);
		var planDate = this.selectedPlanDate.replace(' ','T');
		planDate += 'Z';
		createFollowRecord({
		  alertSerialNo: '',
		  content: this.formRecord.content,
		  deathTime: this.formRecord.deathTime,
		  executeDoctorID: this.$store.state.user.token,
		  failureReason: this.formRecord.failureReason,
		  followupMethod: this.formRecord.followupMethod,
		  followupType: this.formRecord.followupType,
		  patientID: this.selectedPatientID,
		  planDate: planDate,
		  planSerialNo: this.selectedSerialNo,
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
		  patientID: this.formPlan.patientID,
		  planDate: this.formPlan.planDate})
		  .then(res=>{
			this.success('提交成功')
			this.centerDialogVisiblePlan = false;
			this.getCount();
			this.getAllList();
		  })
		  .catch(err=>{
			this.error('提交失败')
		  })
	    }
		
		/*handleSearchName(searchName){
			this.tableData=this.tableData.filter((item)=>{return item.name==searchName});
			this.searchedName = this.searchName;
			this.searchedTotal = this.tableData.length;
		}*/
		
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
		
		load(){
			this.isLoading=true;
			this.LoadingText="加载中";
			this.doList();
			this.isLoading=false;
			this.LoadingText="刷新";
		}
		
		mounted(){
			var patientList = JSON.parse(localStorage.getItem('patientList'));
			this.patientList = [].concat(patientList[2]);
			console.log("patientList:", patientList)
			this.$emit("activeChanged",0)
			this.getCount();
			this.getAllList();
		}
	}
</script>

<style lang="scss" scoped>
.following {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.patientRow{
	overflow: true;
	margin-bottom: 10px;
	.patientText{
		line-height: 40px;
	}
}
.el-pagination{
	margin-top: 10px;
	float: right;
}
</style>
