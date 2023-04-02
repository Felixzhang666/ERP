<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">Welcome to</div>
      <div class="title">Background Management System</div>
      <div class="description">
        --Vue3+koa2+mongodb+node create a universal management system.
      </div>
    </div>
    <div class="img"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import storage from "../utils/storage";

onMounted(() => {
  //manager : {}
  storage.setItem("user", { id: 1, desc: "000", age: 31 });
  console.log(storage.getItem("user"));
});
</script>
<style scoped>
.welcome {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f5faff;
}
.welcome .sub-title {
  font-size: 60px;
  line-height: 42px;
  color: #333;
  text-align: right;
}
.welcome .title {
  font-size: 40px;
  line-height: 62px;
  color: #0075ff;
}

.welcome .description {
  font-size: 14px;
  line-height: 14px;
  color: #999;
  text-align: left;
}

.welcome .img {
  background-image: url(./../assets/images/welcome.png);
  background-size: cover;
  width: 50%;
  height: 50%;
}
</style>
