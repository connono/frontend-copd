<template>
  <div class="information-container">
    <div class="information-text">
		<span>共405位患者。</span>
	</div>
  </div>
</template>

<script>
export default {
  name: 'Information'
}
</script>

<style lang="scss" scoped>
.information {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
