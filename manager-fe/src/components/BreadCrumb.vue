<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item
      v-for="(item, index) in breadCrumbList"
      :key="item.path"
    >
      <router-link to="/" v-if="index === 0">
        {{ item.meta.title }}</router-link
      >
      <span v-else>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { computed } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";

const route = useRoute();
const breadCrumbList = computed(() => route.matched);
</script>
<style scoped></style>
