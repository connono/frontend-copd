<template>
  <div class="information-container">
    <div class="information-text">
		<span>共&nbsp;{{tableData.length}}&nbsp;人注册待审核。</span>
		<span>&nbsp;</span>
		<el-button type="primary" :loading="isLoading" @click="load()">{{LoadingText}}</el-button>
		<el-button type="primary" @click="centerDialogVisible = true">新增患者</el-button>
		<el-dialog
		  title="新增患者"
		  :visible.sync="centerDialogVisible"
		  width="30%"
		  center>
		  <el-form ref="form" :model="form" label-width="80px">
		    <el-form-item label="姓名">
			  <el-input v-model="form.name"></el-input>
			</el-form-item>
			<el-form-item label="身份证">
			  <el-input v-model="form.id"></el-input>
			</el-form-item>
			<el-form-item label="性别">
			  <el-radio-group v-model="form.sex">
			    <el-radio label="男"></el-radio>
			    <el-radio label="女"></el-radio>
			  </el-radio-group>
			</el-form-item>
			<el-form-item label="电话">
			  <el-input v-model="form.phone"></el-input>
			</el-form-item>
			<el-form-item label="出生日期">
			  <el-date-picker
				v-model="bornDate"
				type="date"
				placeholder="选择日期">
			  </el-date-picker>
			</el-form-item>
			<el-form-item label="电话">
			  <el-input v-model="form.phone"></el-input>
			</el-form-item>
			<el-form-item label="学历">
			  <el-select v-model="form.education" placeholder="选择学历">
				<el-option label="文盲或半文盲" value="80"></el-option>
				<el-option label="小学毕业" value="71"></el-option>
				<el-option label="初中毕业" value="61"></el-option>
				<el-option label="高中毕业" value="51"></el-option>
				<el-option label="大学毕业" value="11"></el-option>
				<el-option label="研究生毕业" value="1"></el-option>
			  </el-select>
			</el-form-item>
			<el-form-item label="职业">
			  <el-input v-model="form.profession"></el-input>
			</el-form-item>
			<el-form-item label="关联机构">
			  <el-input v-model="form.ass_institution"></el-input>
			</el-form-item>
			<el-form-item label="管理医生">
			  <el-input v-model="form.ass_institution"></el-input>
			</el-form-item>
			<el-form-item label="账号">
			  <el-input v-model="form.account"></el-input>
			</el-form-item>
			<el-form-item label="密码">
			  <el-input type="password" v-model="form.password"></el-input>
			</el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
			<el-button @click="centerDialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
		  </span>
		</el-dialog>
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
		prop="createTime"
		label="注册时间"
		width="180">
	  </el-table-column>
	  <el-table-column
	    fixed="right"
		label="操作"
		width="150">
		<template slot-scope="scope">
		  <el-button @click="handleClick(scope.row)" type="text" size="medium">接收</el-button>
		  <el-button @click="handleClick(scope.row)" type="text" size="medium">忽略</el-button>
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
	import {getCreatePatient} from '../../api/createPatient'
	
	@Component
	export default class Information extends BaseComponent {
		tableData = [];
		currentPage = 1;
		isLoading = false;
	    LoadingText = "刷新";
		centerDialogVisible = false;
		form = {
		  name: '',
		  id: '',
		  sex: '',
		  phone: '',
		  bornDate: '',
		}
		
		load(){
			this.isLoading=true;
			this.LoadingText="加载中";
			this.doList();
			this.isLoading=false;
			this.LoadingText="刷新";
		}
		
		handleClick(row){
			console.log(row);
		}
		
		doList(){
			getCreatePatient()
			  .then(response=>{
			    console.log(response.data)
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
