<template>
  <div class="hello">
    <img src="../../../assets/vortex.jpeg">
    <div class="text">{{ msg }}</div>
  </div>
</template>

<script>
export default {
  name: 'HelloMobileTemplate',
  data() {
    return {
      msg: 'Welcome to vortex',
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  text-align: center;
}
img {
  width: 200px;
  text-align: center;
  padding-top: 100px;
}
.text {
  margin-top: 100px;
  text-align: center;
  font-size: 32px;
}
</style>
