<template>
  <div class="auto-container">
    <div>
		<el-form ref="form" :model="form">
			<el-form-item label="自动审核转入设置">
				<el-radio-group v-model="form.auto_settings">
					<el-radio label="关"></el-radio>
					<el-radio label="自动通过"></el-radio>
					<el-radio label="自动不通过"></el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onSubmit">确定</el-button>
				<el-button>取消</el-button>
			</el-form-item>
		</el-form>
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
		form = {
			auto_settings:''
		}
		onSubmit(){
			console.log('submit!');
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
.footer{
  margin-top: 40px;
  text-align: center;
}
</style>
