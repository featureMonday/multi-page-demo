<template>
  <div class="view-frame">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive == true"></router-view>
    </keep-alive>
    <router-view v-if="$route.meta.keepAlive != true"></router-view>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>
