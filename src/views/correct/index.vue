<template>
  <div class="information-container">
    <div class="information-text">
		<span>共&nbsp;{{totalPatient}}&nbsp;位患者。</span>
	</div>
	<el-table
	  :data="tableData"
	  stripe
	  cell-style="font-size:16px; text-align: center;"
	  header-cell-style="font-size: 18px; text-align: center;"
	>
	  <el-table-column
	    fixed
		prop="patientID"
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
		prop="referralReason"
		label="转入原因"
		width="100">
	  </el-table-column>
	  <el-table-column
		prop="manageLevel"
		label="管理等级"
		width="100">
	  </el-table-column>
	  <el-table-column
		prop="linkedDoctorName"
		label="管理医生"
		width="100">
	  </el-table-column>
	  <el-table-column
		prop="linkedOrgName"
		label="管理医院"
		width="100">
	  </el-table-column>
	  <el-table-column
		prop="startDateTime"
		label="申请时间"
		width="100">
	  </el-table-column>
	  <el-table-column
	    fixed="right"
		label="操作"
		width="150">
		<template slot-scope="scope">
		  <el-button @click="handleClick(scope.row, 'look')" type="text" size="medium">查看</el-button>
		  <el-popover
			placement="bottom-start"
			width="200"
			trigger="click"
			>
			<div>
				<p>请选择转诊医生：</p>
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
			<el-button type="text" size="medium" slot="reference">确认</el-button>
		  </el-popover>
		  <el-popover
			placement="bottom-start"
			width="200"
			trigger="click"
			>
			<div>
				<p>拒绝原因：</p>
				<div style="display: flex">
					<el-input type="textarea" autosize v-model="refuseReason" placeholder="请输入内容"></el-input>
					<el-button @click="handleClick(scope.row, 'refuse')" size="medium">确认</el-button>
				</div>
			</div>
			<el-button type="text" size="medium" slot="reference">拒绝</el-button>
		  </el-popover>
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
	import Star from '../../components/graphic/Star'
	import {getCorrectPatientList,approve,refuse} from '../../api/correctPatient'
	import {getDoctorInfo} from '../../api/doctorInfo'
	
	@Component({
		components:{
			star: Star
		}
	})
	export default class Information extends BaseComponent {
		tableData = [];
		currentPage = 1;
		pageSize = 15;
		totalPatient = 0;
		doctorList=[];
		selectedDoctor='';
		refuseReason='';
		
		handleClick(row, type){
			console.log(row);
			if(type==='look'){
				this.$router.push("/patientInfo/"+row.patientID)
			}
			if(type==='check'&&this.selectedDoctor!=''){
				approve({doctorID: this.selectedDoctor, reviewerID: this.$store.state.user.token, serialNo: row.serialNo}).then(response=>{
					if(response.message=='success')
						this.success('成功转入!')
					this.doList();
				}).catch(err=>{
					console.log(err);
				})
			}
			if(type==='refuse'){
				refuse({doctorID: this.selectedDoctor, reviewerID: this.$store.state.user.token,refuseReason:this.refuseReason, serialNo: row.serialNo})
				  .then(response=>{
				    if(response.message=='success')
						this.success('成功拒绝!')
					this.doList();
				  })
				  .catch(err=>{
				    console.log(err);
				  })
			}
		}
		
		getDoctorList(){
			getDoctorInfo({hospitalID: this.$store.state.user.token})
			  .then(response=>{
				//console.log(response);
				this.doctorList = response.data;
				//console.log(this.doctorList);
				
			  })
			  .catch(err=>{
			    console.log(err);
			  })
		}
		
		handleSizeChange(val){
			this.pageSize = val;
			this.doList();
		}
		
		handleCurrentChange(val){
			this.currentPage = val;
			this.doList();
		}
		
		dateToAge(str){
			var date = new Date(str);
			var now = new Date();
			return now.getYear()-date.getYear()+1;
	    }
		
		doList(){
			getCorrectPatientList({viewerID: this.$store.state.user.token, pageIndex: this.currentPage, pageOffset: this.pageSize})
				.then(response=>{
					//console.log(response)
					this.totalPatient = response.data.totalElements;
					this.tableData = response.data.content;
			    })
				.catch(err=>{
					this.error('获取失败')
				})
		}
		
		mounted(){
			this.$emit("activeChanged",0)
			this.getDoctorList()
			this.doList();
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
