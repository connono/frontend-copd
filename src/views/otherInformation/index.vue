<template>
  <div class="information-container">
    <div>
		<span>请选择医院：</span>
		<el-cascader
		  v-model="selectedHospital"
		  :options="subhospitalTree"
		  :props="{ expandTrigger: 'hover' }"
		  @change="doList"></el-cascader>
	</div>
    <div class="information-text">
		<span>共&nbsp;{{this.patientCount.totalCount}}&nbsp;位患者，{{this.patientCount.managingCount}}&nbsp;位管理中的患者，&nbsp;{{this.patientCount.referralInCount}}&nbsp;位转入患者，{{this.patientCount.referralOutCount}}&nbsp;位转出患者。</span>
		<div style="display: inline-block; float: right">
			<span>管理状态：</span>
			<el-select v-model="selectedType" placeholder="全部" @change="doList">
				<el-option label="全部" value="0"></el-option>
				<el-option label="管理中" value="1"></el-option>
				<el-option label="转出" value="2"></el-option>
				<el-option label="转入" value="3"></el-option>
				</el-option>
			</el-select>
		</div>
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
	import {getPatientList, getPatientCount, getSubhospital} from '../../api/patientList'
	
	@Component({
		components:{
			star: Star
		}
	})
	export default class Information extends BaseComponent {
		tableData = [];
		currentPage = 1;
		patientCount = {
		  totalCount: 0,
		  managingCount: 0,
		  referralOutCount: 0,
		  referralInCount: 0,
		};
		pageSize = 15;
		selectedType='';
		selectedHospital='';
		
		subhospitalTree=[]
		
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
			if(this.selectedHospital==''){
				this.error('请选择医院');
				return;
			}
			var orgCode = this.selectedHospital[this.selectedHospital.length-1];
			var selectedType = (this.selectedType=='')?0:this.selectedType;
			getPatientCount({orgCode: orgCode})
			  .then(response=>{
			    this.patientCount = response.data;
				getPatientList({orgCode: orgCode, pageIndex: this.currentPage, pageOffset: this.pageSize, type: selectedType})
				  .then(response=>{
					this.tableData = response.data.content;
					console.log(this.tableData);
			      })
				  .catch(err=>{
					this.error('获取失败')
				})
			  })
			
		}
		
		getSubhospitalTree(){
			getSubhospital({orgCode: this.$store.state.user.orgCode})
			  .then(response=>{
			    var stack = [].concat(response.data.children);
				while(stack.length!=0){
					var node = stack.pop();
					node.value = node.orgCode;
					node.label = node.orgName;
					if(node.children){
						stack.push(...node.children);
						node.children.unshift({value: node.orgCode, label: node.orgName});
					}
				}
				this.subhospitalTree = response.data.children;
				//console.log(response.data);
			  })
			  .catch(err=>{
				this.error(err);
			  })
		}
		
		mounted(){
			this.$emit("activeChanged",0)
			this.getSubhospitalTree();
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
