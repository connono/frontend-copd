<template>
  <div class="information-container">
    <div class="information-text">
		<span>共&nbsp;{{totalPatient}}&nbsp;人注册待审核。</span>
		<span>&nbsp;</span>
		<el-button type="primary" :loading="isLoading" @click="load()">{{LoadingText}}</el-button>
		<el-button type="primary" @click="centerDialogVisible = true">新增患者</el-button>
		<el-dialog
		  title="新增患者"
		  :visible.sync="centerDialogVisible"
		  width="60%"
		  center>
		  <el-form ref="form" :model="form" label-width="80px">
		    <el-form-item label="姓名">
			  <el-input v-model="form.name"></el-input>
			</el-form-item>
			<el-form-item label="身份证">
			  <el-input v-model="form.identityCardNumber"></el-input>
			</el-form-item>
			<el-form-item label="性别">
			  <el-radio-group v-model="form.sex">
			    <el-radio label="1">男</el-radio>
			    <el-radio label="2">女</el-radio>
			  </el-radio-group>
			</el-form-item>
			<el-form-item label="电话">
			  <el-input v-model="form.phone"></el-input>
			</el-form-item>
			<el-form-item label="出生日期">
			  <el-date-picker
				v-model="form.dateOfBirth"
				type="date"
				placeholder="选择日期">
			  </el-date-picker>
			</el-form-item>
			<el-form-item label="学历">
			  <el-select v-model="form.education" placeholder="选择学历">
				<el-option label="文盲或半文盲" value="文盲或半文盲"></el-option>
				<el-option label="小学毕业" value="小学毕业"></el-option>
				<el-option label="初中毕业" value="初中毕业"></el-option>
				<el-option label="高中毕业" value="高中毕业"></el-option>
				<el-option label="大学毕业" value="大学毕业"></el-option>
				<el-option label="研究生毕业" value="研究生毕业"></el-option>
			  </el-select>
			</el-form-item>
			<el-form-item label="职业">
			  <el-input v-model="form.profession"></el-input>
			</el-form-item>
			<el-form-item label="关联机构">
			  <el-input :value="orgName" disabled></el-input>
			</el-form-item>
			<el-form-item label="管理医生">
				<el-select v-model="form.doctorID" placeholder="请选择">
					<el-option
						v-for="doctor in doctorList"
						:key="doctor.userID"
						:label="doctor.name"
						:value="doctor.userID"></el-option>
			  	</el-select>
			</el-form-item>
			<el-form-item label="账号">
			  <el-input v-model="form.userName"></el-input>
			</el-form-item>
			<el-form-item label="密码">
			  <el-input type="password" v-model="form.password"></el-input>
			</el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
			<el-button @click="centerDialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="submitCreatePatient">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
	<el-table
	  :data="tableData"
	  stripe
	  cell-style="font-size:16px; text-align: center;"
	  header-cell-style="font-size: 18px; text-align: center;">
		<el-table-column
			fixed
			prop="name"
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
			prop="education"
			label="学历"
			width="100">
		</el-table-column>
		<el-table-column
			prop="profession"
			label="职业"
			width="80">
		</el-table-column>
		<el-table-column
			prop="height"
			label="身高(cm)"
			width="100">
		</el-table-column>
		<el-table-column
			prop="weight"
			label="体重(kg)"
			width="100">
		</el-table-column>
		<el-table-column
			prop="phone"
			label="手机"
			width="180">
		</el-table-column>
		<el-table-column
			prop="registerDateTime"
			label="注册时间"
			width="180">
		</el-table-column>
		<el-table-column
			fixed="right"
			label="操作"
			width="150">
			<template slot-scope="scope">
			<el-popover
				placement="bottom-start"
				width="200"
				trigger="click"
				>
				<div>
					<p>请选择接收医生：</p>
					<div style="display: flex">
						<el-select v-model="selectedDoctor" placeholder="请选择">
							<el-option
								v-for="doctor in doctorList"
								:key="doctor.userID"
								:label="doctor.name"
								:value="doctor.userID">
							</el-option>
						</el-select>
						<el-button @click="handleClick(scope.row, 'check')" size="medium">确认</el-button>
					</div>
				</div>
				<el-button type="text" size="medium" slot="reference">接收</el-button>
			</el-popover>
			<el-button @click="handleClick(scope.row, 'refuse')" type="text" size="medium">拒绝</el-button>
			<el-button @click="handleClick(scope.row, 'ignore')" type="text" size="medium">忽略</el-button>
			</template>
		</el-table-column>
	</el-table>
	<el-pagination
		@size-change="handleSizeChange"
		@current-change="handleCurrentChange"
		:current-page="currentPage"
		:page-sizes="[15,30,45,60]"
		:page-size="pageSize"
		layout="total, sizes, prev, pager, next, jumper"
		:total="totalPatient">
	</el-pagination>
  </div>
</template>

<script>
	import Component from 'vue-class-component'
	import BaseComponent from '../../components/BaseComponent'
	import {getCreatePatient, createPatient, checkPatient} from '../../api/createPatient'
	import {getDoctorInfo,getDoctorName} from '../../api/doctorInfo'
	import {getOrgName} from '../../api/orgDict'
	
	@Component
	export default class Information extends BaseComponent {
		tableData = [];
		currentPage = 1;
		pageSize=15;
		isLoading = false;
		totalPatient = 0;
	    LoadingText = "刷新";
		centerDialogVisible = false;
		orgName = '';
		doctorList = [{
			userID: this.$store.state.user.token,
			name: ''
		}];
		selectedDoctor='';
		form = {
			address: null,
  			dateOfBirth: "",
  			doctorID: '',
  			education: null,
  			email: null,
  			height: 0,
  			identityCardNumber: null,
  			mobilePhone: null,
  			name: "",
  			orgCode: this.$store.state.user.orgCode,
  			password: "",
  			patientFeature: null,
  			profession: null,
  			sex: 0,
  			userName: "",
  			weChat: null,
  			weight: 0
		}

		handleSizeChange(val) {
			this.pageSize = val;
			this.doList();
		}

		handleCurrentChange(val) {
			this.currentPage = val;
			this.doList();
		}
		
		submitCreatePatient(){
			createPatient(this.form)
				.then(response=>{
					console.log(response);
				})
				.catch(err=>{
					console.log(err)
				})
			this.centerDialogVisible = false
			this.success('创建成功')
		}
		
		load(){
			this.isLoading=true;
			this.LoadingText="加载中";
			this.doList();
			this.isLoading=false;
			this.LoadingText="刷新";
		}
		
		dateToAge(str){
			var date = new Date(str);
			var now = new Date();
			return now.getYear()-date.getYear()+1;
	    }
		
		handleClick(row, type){
			console.log(row, type);
			if(type==="check"&&this.selectedDoctor!=''){
				checkPatient({doctorID: this.selectedDoctor, refuseReason: '',reviewerID: this.$store.state.user.token,serialNo: row.serialNo, status: 1}).then(response=>{
					if(response.message==="success")
						this.success('接收成功！')
					this.doList();
				}).catch(err=>{
					console.log(err);
				})
			}else if(type==="refuse"){
				checkPatient({doctorID: null, refuseReason: '', reviewerID: this.$store.state.user.token, serialNo: row.serialNo, status: 2}).then(response=>{
					if(response.message==="success")
						this.success('拒绝成功！')
					this.doList();
				}).catch(err=>{
					console.log(err);
				})
			}else if(type==="ignore"){
				checkPatient({doctorID: null, refuseReason: '', reviewerID: this.$store.state.user.token, serialNo: row.serialNo, status: 3}).then(response=>{
					if(response.message==="success")
						this.success('忽略成功！')
					this.doList();
				}).catch(err=>{
					console.log(err);
				})
			}
		}
		
		getDoctorList(){
			if(this.$store.state.user.auth==1){
				getDoctorInfo({hospitalID: this.$store.state.user.token})
			  .then(response=>{
				//console.log(response);
				this.doctorList = response.data;
				//console.log(this.doctorList);
				
			  })
			  .catch(err=>{
			    console.log(err);
			  })
			} else {
				getDoctorName({doctorID: this.$store.state.user.token})
				.then(response=>{
					this.doctorList[0].name = response.data
				})
				.catch(err=>{
					console.log(err)
				})
			}
		}
		
		doList(){
			getCreatePatient({viewerID: this.$store.state.user.token, pageIndex: this.currentPage, pageOffset: this.pageSize})
				.then(response=>{
					console.log(response)
					this.totalPatient = response.data.totalElements;
					this.tableData = response.data.content;
			    })
				.catch(err=>{
					this.error('获取失败')
				})
		}

		getThisOrgName(){
			getOrgName({orgCode: this.$store.state.user.orgCode})
			.then(res=>{
				this.orgName = res.data
			})
			.catch(err=>{
				this.error('获取失败')
			})
		}
		
		mounted(){
			this.$emit("activeChanged",0);
			this.getDoctorList();
			this.doList();
			this.getThisOrgName();
		}
	}
</script>

<style lang="scss" scoped>
.information {
  &-container {
    margin: 30px;
  }
  &-text {
    margin-bottom: 20px;
  }
}
.el-pagination{
  float: right;
  margin-top: 10px;
}
</style>
