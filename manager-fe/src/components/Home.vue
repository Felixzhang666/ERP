<template>
  <div class="container">
    <div :class="['side', isCollapse ? 'collapse' : 'expand']">
      <!-- logo -->
      <div class="logo">
        <div class="image-wrapper">
          <img src="./../assets/images/1.jpg" />
        </div>

        <div class="text-wrapper">
          <span v-if="!isCollapse">manager</span>
        </div>
      </div>

      <!-- navigator -->
      <el-menu
        default-active="2"
        class="el-menu-vertical"
        background-color="#001529"
        text-color="#fff"
        :collapse="isCollapse"
        router
      >
        <tree-menu :userMenu="userMenu"></tree-menu>
      </el-menu>
    </div>

    <div :class="['content-right', isCollapse ? 'collapse' : 'expand']">
      <div class="nav-top">
        <div class="menu" >
          <el-icon @click="toggle"><Fold /></el-icon>
          <BreadCrumb/>
        </div>
        <div class="user-info">
          <el-badge :is-dot="notifyCount > 0 ? true : false" class="notify"
            ><el-icon><Bell /></el-icon
          ></el-badge>
          <!-- el-dropdown-menu -->
          <el-dropdown @command="handleLogout">
            <span class="el-dropdown-link">
              {{ user.userName }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email"
                  >Email: {{ user.userEmail }}</el-dropdown-item
                >
                <el-dropdown-item command="logout">Logout</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
       
          <router-view></router-view>
        
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { notify, menuList, permissionMenu } from "../api/index";
import TreeMenu from "./TreeMenu.vue";
import BreadCrumb from "./BreadCrumb.vue";

let isCollapse = ref(false);

const route = useRouter();
const store = useStore();
const user = computed(() => store.state.userInfo.data); //require use inform
const notifyCount = ref(0);
const userMenu = reactive([]);

function handleLogout(command) {
  if (command === "logout") {
    store.commit("saveUserInfo", "");
    route.push("/login");
  }
}

function toggle() {
  isCollapse.value = !isCollapse.value;
}

async function getNotifyCount() {
  const res = await notify();
  notifyCount.value = res.data.count;
}

async function getMenuList() {
  //const res = await menuList();
  const res = await permissionMenu();
  //console.log(res);
 const {menuList, marks} = res.data.data;
 //userMenu.push(...res.data.data.menuList);
 userMenu.push(...menuList);
 store.commit("saveUserMarks", marks);
  //userMenu.push(...res.data.data.menuList);
  // notifyCount.value = res.data.count;
}

getNotifyCount();
getMenuList();
</script>
<style scoped>
.container {
  position: relative;
  /* height: 100%;*/
  width: 100%;
}

.side {
  position: fixed;
  width: 215px;
  height: 100%;
  color: #fff;
  background-color: #001529;
  transition: width 0.5s;
}

.side.collapse {
  width: 80px;
}

.side.expand {
  width: 215px;
}
.el-menu {
  border-right: none;
}

.l-menu-vertical {
  height: calc(100vh - 80 px);
}
.content-right {
  margin-left: 220px;
}

.content-right.collapse {
  margin-left: 80px;
}

.content-right.expand {
  margin-left: 220px;
}

.nav-top {
  height: 50px;
  line-height: 50px;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid #999;
}

.wrapper {
  background-color: #eef0f3;
  height: calc(100vh - 50px);
  padding: 20px;
}

.user-info {
  margin-right: 20px;
}
.menu,
.user-info {
  display: flex;
  align-items: center;
}
.menu span,
.user-info span {
  padding-left: 10px;
  font-size: 16px;
}

.user-info .notify {
  line-height: 16px;
}
.main-page {
  background-color: #fff;
  height: 100%;
  padding: 20px;
}

.logo {
  margin-top: 10px;
  height: 60px;
  /* padding-bottom: 30px; */
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}
.image-wrapper {
  align-self: center;
}
.logo img {
  width: 60px;
  height: 60px;
  margin-left: 15px;
}
.text-wrapper {
  display: flex;
  align-items: center;
}
.logo span {
  font-size: 18px;
  padding-left: 20px;
}
</style>
