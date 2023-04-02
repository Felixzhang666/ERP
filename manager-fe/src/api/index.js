// API Management
import request from "../utils/request";

//http://127.0.0.1:3000/api/user/login
export function login(data) {
  return request.post("/user/login", data);
}

export function notify() {
  return request.get("/notify/count", true);
}

export function menuList(params) {
  return request.get("/menu/list", params); // prarm reload
}

//根据权限
export function permissionMenu() {
  return request.get("/menu/permission/list"); // prarm reload
}

export function usersList(params) {
  return request.get("/user/list", params); // prarm reload
}
 
export function usersDelete(params) {
  return request.post("/user/delete", params); // prarm reload
}

//获取系统角色列表
export function rolesList() {
  return request.get("/roles/system");  
}

export function permissionList(params) {
  return request.get("/roles/list", params);  
}

export function deptList() {
  return request.get("/dept/list");  
}

export function operate(params) {
  return request.post("/user/operate", params);  
}

export function menuOperate(params) {
  return request.post("/menu/operate", params);  
}

export function roleOperate(params) {
  return request.post("/roles/operate", params);  
}

export function updataPermission(params) {
  return request.post("/roles/updata/permission", params);  
}

export function departmentOperate(params) {
  return request.post("/dept/operate", params);  
}

/// vacation history
export function getLeaveApplicationList(params) {
  return request.get("/leave/list", params); // prarm reload
}

export function leaveOperate(params) {
  return request.post("/leave/operate", params);  
}


