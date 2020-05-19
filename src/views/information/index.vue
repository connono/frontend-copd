<template>
  <div class="information-container">
    <div class="information-text">
		<span>共&nbsp;{{this.patientCount}}&nbsp;位患者。</span>
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
		prop="manageStartDateTime"
		label="开始管理时间"
		width="180">
	  </el-table-column>
	  <el-table-column
		prop="terminationDateTime"
		label="中止管理时间"
		width="180">
	  </el-table-column>
	  <el-table-column
		prop="doctorName"
		label="医生"
		width="100">
	  </el-table-column>
	  <el-table-column
	    fixed="right"
		label="操作"
		width="150">
		<template slot-scope="scope">
		  <el-button @click="handleClick(scope.row)" type="text" size="medium">查看</el-button>
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
		:total="patientCount">
	</el-pagination>
  </div>
</template>

<script>
	import Component from 'vue-class-component'
	import BaseComponent from '../../components/BaseComponent'
	import Star from '../../components/graphic/Star'
	import {getPatientList, getPatientCount} from '../../api/patientList'
	
	@Component({
		components:{
			star: Star
		}
	})
	export default class Information extends BaseComponent {
		tableData = [];
		currentPage = 1;
		patientCount = 0;
		pageSize = 15;
		
		handleSizeChange(val){
			this.pageSize = val;
			this.doList();
		}
		
		handleCurrentChange(val){
			this.currentPage = val;
			this.doList();
		}
		
		handleClick(row){
			//console.log(row);
			this.$router.push("/patientInfo/"+row.patientID)
		}
		
		dateToAge(str){
			var date = new Date(str);
			var now = new Date();
			return now.getYear()-date.getYear()+1;
	    }
		
		doList(){
			getPatientCount({orgCode: this.$store.state.user.orgCode})
			  .then(response=>{
			    this.patientCount = response.data.totalCount;
				getPatientList({orgCode: this.$store.state.user.orgCode, pageIndex: this.currentPage, pageOffset: this.pageSize, type: 0})
				  .then(response=>{
					this.tableData = response.data.content;
					console.log(this.tableData);
			      })
				  .catch(err=>{
					this.error('获取失败')
				})
			  })
			
		}
		
		mounted(){
			this.$emit("activeChanged",0)
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
