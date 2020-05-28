<template>
</template>

<script>
	import Component from 'vue-class-component'
	import BaseComponent from '../../components/BaseComponent'
	@Component
	export default class Manage extends BaseComponent{
	  mounted(){
		if(this.$store.state.user.auth==0)
			this.$router.push('/list/doctor');
		else(this.$store.state.user.auth==1)
			this.$router.push('/list/benyuan');
	  }
	}
</script>

<style lang="scss" scoped>
</style>
