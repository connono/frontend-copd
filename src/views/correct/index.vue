<template>
  <div class="information-container">
    <div class="information-text">
		<span>共&nbsp;{{tableData.length}}&nbsp;位患者。</span>
	</div>
	<el-table
	  :data="tableData"
	  stripe
	  cell-style="font-size:16px; text-align: center;"
	  header-cell-style="font-size: 18px; text-align: center;"
	>
	  <el-table-column
	    fixed
		prop="patientId"
		label="ID"
		width="80">
	  </el-table-column>
	  <el-table-column
	    fixed
		prop="name"
		label="姓名"
		width="90">
	  </el-table-column>
	  <el-table-column
		prop="sex"
		label="性别"
		width="70">
	  </el-table-column>
	  <el-table-column
		prop="age"
		label="年龄"
		width="70">
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
		prop="manageStartTime"
		label="开始管理时间"
		width="180">
	  </el-table-column>
	  <el-table-column
		prop="manageEndTime"
		label="中止管理时间"
		width="180">
	  </el-table-column>
	  <el-table-column
		prop="doctor"
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
		:page-size="15"
		layout="total, sizes, prev, pager, next, jumper"
		:total="tableData.length">
	</el-pagination>
  </div>
</template>

<script>
	import Component from 'vue-class-component'
	import BaseComponent from '../../components/BaseComponent'
	import Star from '../../components/graphic/Star'
	import {getPatientList} from '../../api/patientList'
	
	@Component({
		components:{
			star: Star
		}
	})
	export default class Information extends BaseComponent {
		tableData = [];
		currentPage = 1;
		
		handleClick(row){
			console.log(row);
		}
		
		doList(){
			getPatientList()
			  .then(response=>{
				this.tableData = response.data;
			  })
			  .catch(err=>{
				this.error('获取失败')
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
