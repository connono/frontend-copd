<template>
  <div class="following-container">
    <div class="patientRow">
		<span class="patientText" v-if="!searchedName">今天计划随访&nbsp;<span style="color:orange">{{patientTotal.willFollow+patientTotal.followed+patientTotal.ignore}}</span>&nbsp;位患者， 其中待随访&nbsp;<span style="color:blue">{{patientTotal.willFollow}}</span>&nbsp;位， 已随访&nbsp;<span style="color:blue">{{patientTotal.followed}}</span>&nbsp;位， 已忽略&nbsp;<span style="color:blue">{{patientTotal.ignore}}</span>&nbsp;位。</span>
		<span class="patientText" v-else>查找"{{searchedName}}"：共{{searchedTotal}}条记录。</span>
		<el-button type="primary" :loading="isLoading" @click="load()">{{LoadingText}}</el-button>
		<el-input v-model="searchName" placeholder="输入患者姓名查找" class="nameInput">
			<el-button slot="append" icon="el-icon-search" @click="handleSearchName(searchName)"></el-button>
		</el-input>
	</div>
    <el-table
	  :data="tableData"
	  stripe
	  cell-style="font-size:16px; text-align: center;"
	  header-cell-style="font-size: 18px; text-align: center;"
	>
	  <el-table-column
	    fixed
		prop="Id"
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
		label="管理等级"
		width="110">
		<template slot-scope="scope">
			<div style="display: inline-block">
				<span v-if="scope.row.manageLevel==0">新患者</span>
				<span v-if="scope.row.manageLevel==1">一级</span>
				<div v-if="scope.row.manageLevel==2">
					<span>二级&nbsp;</span>
					<el-tooltip effect="light">
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
					</el-tooltip>
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
		label="上次随访日期"
		width="180">
		<template slot-scope="scope">
			<span v-if="scope.row.lastFollowupDate!=null">{{toDateText(scope.row.lastFollowupDate.replace(/-/g,"/"))+getDaysText(scope.row.lastFollowupDays)}}</span>
			<span v-else>无</span>
		</template>
	  </el-table-column>
	  <el-table-column
		label="计划随访日期"
		width="180">
		<template slot-scope="scope">
			<span v-if="scope.row.followupDate!=null">{{toDateText(scope.row.followupDate.replace(/-/g,"/"))+getDaysText(scope.row.followupDays)}}</span>
			<span v-else>无</span>
		</template>
	  </el-table-column>
	  <el-table-column
		prop="doctor"
		label="医生"
		width="100">
	  </el-table-column>
	  <el-table-column
		prop="type"
		label="类型"
		width="150">
	  </el-table-column>
	  <el-table-column
		prop="position"
		label="状态"
		width="100">
	  </el-table-column>
	  <el-table-column
	    fixed="right"
		label="操作"
		width="150">
		<template slot-scope="scope">
		  <div v-if="scope.row.position=='待随访'">
			<el-button @click="handleClick(scope.row)" type="text" size="medium">立即随访</el-button>
			<el-popover
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
					<el-button class="btn-ignore" size="mini" @click="handleIgnore(scope.row.Id)">忽略</el-button>
					<el-button class="btn-ignore" size="mini" @click="doClose(item,index)">取消</el-button>
				</div>
				<el-button type="text" size="medium" slot="reference">忽略</el-button>
			</el-popover>
		  </div>
		  <div v-else-if="scope.row.position=='已随访'">
		    <el-button @click="handleClick(scope.row)" type="text" size="medium">查看</el-button>
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
		:current-page="currentPage"
		:page-sizes="[15,30,45,60]"
		:page-size="15"
		layout="total, sizes, prev, pager, next, jumper"
		:total="patientTotal.willFollow+patientTotal.followed+patientTotal.ignore">
	</el-pagination>
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
	import {getFollowingPatientList,ignoreFollowingPatient} from '../../api/followingPatientList'
	@Component({
	  components: {
	    star: Star
	  }
	})
	export default class Following extends BaseComponent {
		currentPage=1
		isLoading=false
		LoadingText="刷新"
		searchName=""
		searchedName=""
		searchedTotal=0
		patientTotal={
			willFollow: 0,
			followed: 0,
			ignore: 0,
		}
		tableData=[]
		imgMLM1= ImgMLW1
		imgMLM2= ImgMLW2
		imgMLM3= ImgMLW3
		imgMLM4= ImgMLW4
		
		handleClick(row){
			console.log(row);
		}
		
		handleIgnore(Id){
			ignoreFollowingPatient({Id:Id})
				.then(response=>{
					console.log(response)
					this.doList();
				})
				.catch(err=>{
					this.error('操作失败')
				})
		}
		
		handleSizeChange(val){
			console.log(`每页${val}条`);
		}
		
		handleCurrentChange(val){
			console.log(`当前页:${val}`);
		}
		
		handleSearchName(searchName){
			this.tableData=this.tableData.filter((item)=>{return item.name==searchName});
			this.searchedName = this.searchName;
			this.searchedTotal = this.tableData.length;
		}
		
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
		
		doList(){
			getFollowingPatientList()
			  .then(response=>{
			    this.tableData = response.data;
				this.patientTotal={
					willFollow: 0,
					followed: 0,
					ignore: 0
				}
				this.tableData.map((item)=>{
					if(item.position=="待随访"){
						this.patientTotal.willFollow += 1;
					}else if(item.position=="已随访"){
						this.patientTotal.followed += 1;
					}else if(item.position=="已忽略"){
						this.patientTotal.ignore += 1;
					}
				})
			  })
			  .catch(err=>{
			     this.error('获取失败');
			  })
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
			this.doList()
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
	.nameInput{
		width: 260px;
		float: right
	}
}
.el-pagination{
	margin-top: 10px;
	float: right;
}
</style>
