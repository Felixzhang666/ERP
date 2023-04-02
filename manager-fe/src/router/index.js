//import { componentSizeMap } from "element-plus";
import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../components/Home.vue";

import User from "../views/User.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    redirect:"/welcome",
    meta:{
      title:"Home"
    },
    children: [
      {
        path: "/welcome",
        name: "welcome",
        component: () => import("../components/Welcome.vue") ,
        meta:{
          title:"Welcome"
        },
      },
      {
        path: "/system/user",
        name: "user",
        meta:{
          title:"User Management"
        },
        component: User,
      },
      {
        path: "/system/menu",
        name: "menu",
        meta:{
          title:"Menu Management"
        },
        component: () => import("../views/Menu.vue"),
      }, 
      {
        path: "/system/role",
        name: "role",
        meta:{
          title:"Role Management"
        },
        component: () => import("../views/Role.vue"),
      }, 
      {
        path: "/system/dept",
        name: "dept",
        meta:{
          title:"Department Management"
        },
        component: () => import("../views/Department.vue"),
      },
      {
        path: "/approval/application",
        name: "application",
        meta:{
          title:"Vacation Application"
        },
        component: () => import("../views/Application.vue"),
      }
    ],
  },

  {
    path:"/login",
    name:"login",
    component:() => import("../views/login.vue"),


  }
];
// implement a router
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
