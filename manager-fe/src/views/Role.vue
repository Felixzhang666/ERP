<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form
        :inline="true"
        :model="roleForm"
        class="demo-form-inline"
        ref="role"
      >
        <el-form-item label="Role Name" prop="roleName">
          <el-input
            v-model="role.roleName"
            placeholder="Please Input Role Name"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery">Search</el-button>
          <el-button type="primary" @click="handleReset(ruleFormRef)"
            >Reset</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button
          link
          type="primary"
          size="small"
          @click="handleAdd(dialogFormRef)"
        >
          Create
        </el-button>
      </div>

      <el-table :data="tableData" style="width: 100%">
        <el-table-column
          v-for="item in colums"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
          :width="item.width"
        />
        <el-table-column fixed="right" label="Operations" width="220">
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
              >Edit</el-button
            >
            <el-button
              link
              type="warning"
              size="small"
              @click="handlePermission(scope.row)"
              >Set Permission</el-button
            >
            <el-button
              link
              type="danger"
              size="small"
              @click="handleDelete(scope.row)"
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :page-size="pager.pageSize"
        :total="pager.total"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog v-model="centerDialogVisible" :title="title" align-center>
      <el-form
        ref="dialogFormRef"
        :model="roleForm"
        label-width="100px"
        :rules="rules"
        status-icon
      >
        <el-form-item label="Role Name" prop="roleName">
          <el-input
            v-model="roleForm.roleName"
            placeholder="Please Input Role Name"
          ></el-input>
        </el-form-item>

        <el-form-item label="Remark" prop="remark">
          <el-input
            type="textarea"
            :rows="4"
            v-model="roleForm.remark"
            placeholder="Please Input Remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose(dialogFormRef)">Cancel</el-button>
          <el-button type="primary" @click="handleSubmit(dialogFormRef)"
            >Conform</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 权限设置对话框 -->
    <el-dialog
      v-model="permissionDialogVisible"
      title="Permission Set"
      align-center
    >
      <el-form ref="PermissionFormRef" :model="roleForm" label-width="100px">
        <el-form-item label="Role Name"> [{{ currentRoleName }}] </el-form-item>

        <el-form-item label="Select Permission">
          <el-tree
            :data="menuData"
            ref="permissionFormRef"
            show-checkbox
            node-key="_id"
            default-expand-all
            :props="{ label: 'menuName' }"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="permissionDialogVisible = false">Cancel</el-button>
          <el-button
            type="primary"
            @click="handlePermissionSubmit(dialogFormRef)"
            >Conform</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, toRaw, nextTick } from "vue";

//import axios from "axios";
import {
  permissionList,
  roleOperate,
  menuList,
  updataPermission,
} from "../api/index";
import { ElMessage } from "element-plus";
import { get } from "lodash";
//初始化角色表单对象
let menuMap = reactive({});
const role = reactive({
  roleName: "",
});

//初始化分页对象
const pager = reactive({
  pageNum: 1,
  total: 8,
  pageSize: 10,
});

const rules = reactive({
  roleName: [
    { required: true, message: "Role Name cannot be empty", trigger: "blur" }, // 失去光标
    {
      min: 2,
      max: 6,
      message: "RoleName' length should be between 2-6 character",
      trigger: "blur",
    },
  ],
});
let roleForm = reactive({});
let tableData = ref();
let menuData = ref();
async function getRoleList() {
  let params = { ...role, ...pager };
  const res = await permissionList(params);
  const list = res.data.data.list;

  tableData.value = list;
  pager.total = res.data.data.page.total;
}

async function getMenuList() {
  const res = await menuList();
  const list = res.data.data;
  menuData.value = list;
  menuMap = transformMap(list);
  console.log(menuMap);

}

function transformMap(source) {
  const map = {};
  const deep = (data) => {
    while (data.length) {
      let node = data.pop();
      //find level 1 menu.
      if (node.children.length && node.parentId[0] == null) {
        deep(node.children);
        continue;
      }
      // level 2
      if(node.menuType == 1){
        map[node._id] = node.menuName;
      }     
    }
  }

   //序列化 
  deep(JSON.parse(JSON.stringify(source))); // 浅， 共享引用 深copy， 解绑引用
  //menuMap = map;
  return map;
  //console.log(map);
}
const options = [];

const dialogFormRef = ref();

const userForm = reactive({
  state: 3,
});

const ruleFormRef = ref();
const permissionFormRef = ref();
const currentRoleName = ref();
const centerDialogVisible = ref(false);
const permissionDialogVisible = ref(false);
const currentRoleId = ref();
const action = ref(" ");
const title = ref("Add a New User");
const colums = reactive([
  { label: "Role", prop: "roleName" },
  { label: "Remark", prop: "remark" },
  { 
    label: "Permission List", 
    prop: "permissionList",
    formatter(row, column, value) {
      const target = [];
      value.halfCheckedKeys.map(key => {
    //  console.log(key);
       if(menuMap[key]) {
          target.push(menuMap[key]);
      }   
      })
     //  console.log(target)
      return target.join(",");
    },
  },
  {
    label: "Create Time",
    prop: "createTime",
    formatter(row, column, value) {
      let time = new Date(value);
      return time.toLocaleString();
    },
  },
]);

function handleQuery() {}

function handleReset(formEl) {
  if (!formEl) return;
  formEl.resetFields();
}

async function handleDelete(row) {
  await roleOperate({
    _id: [row._id],
    action: "delete",
  });
  ElMessage.success("Delete Successfully");
  getRoleList();
}

function handleClose(formEle) {
  centerDialogVisible.value = false;
  handleReset(formEle);
}

function handleSubmit(formEle) {
  // handleReset(formEle);
  if (!formEle) return;
  formEle.validate(async (valid) => {
    console.log(valid);
    if (valid) {
      let params = toRaw(roleForm);
      params.action = action.value;
      //接口需要变更
      const res = await roleOperate(params);
      if (res.status === 200 && res.data.code == 200) {
        centerDialogVisible.value = false;
        const message =
          action.value === "edit"
            ? "Modify Successfully"
            : "Add Role Successfully";
        ElMessage.success(message);
        handleReset(formEle);
        getRoleList();
      }
    }
  });
}

async function handlePermissionSubmit() {
  permissionDialogVisible.value = false;

  //let node  =  permissionFormRef.value.getCheckedNodes();
  let nodes = permissionFormRef.value.getCheckedNodes();
  let halfKeys = permissionFormRef.value.getHalfCheckedKeys();
  let checkedKeys = [];
  let halfCheckedKeys = [];

  nodes.map((node) => {
    // button
    if (!node.children.length) {
      checkedKeys.push(node._id);
      // menu
    } else {
      halfCheckedKeys.push(node._id);
    }
  });
  //  console.log(nodes);
  let params = {
    _id: currentRoleId.value,
    permissionList: {
      halfCheckedKeys: halfCheckedKeys.concat(halfKeys),
      checkedKeys,
    },
  };
  console.log(params);
  await updataPermission(params);
  permissionDialogVisible.value = false;
  ElMessage.success("Permission update Successfully");
    getRoleList();
}

function handleEdit(row) {
  action.value = "edit"; //add
  title.value = "Edite Role's Information";
  centerDialogVisible.value = true;
  nextTick(() => {
    Object.assign(roleForm, row); //扩展
  });
}

function handleAdd(formEl, row) {
  //console.log(row); // undefined
  action.value = "add"; //add
  title.value = "New Role";
  centerDialogVisible.value = true;
}

function handleCurrentChange(val) {
  pager.pageNum = val;
  getRoleList();
}
function handlePermission(row) {
  permissionDialogVisible.value = true;
  currentRoleId.value = row._id;
  currentRoleName.value = row.roleName;
  //渲染以选中的权限节点
  const { checkedKeys } = row.permissionList;
  setTimeout(() => {
    permissionFormRef.value.setCheckedKeys(checkedKeys);
  });
}
getRoleList();
getMenuList();
</script>
<style scoped>
.query-form {
  background-color: #fff;
  padding: 22px 20px 0;
  border-radius: 5px;
}

.base-table {
  border-radius: 5px;
  background-color: #fff;
  margin: 20px 0 20px 0;
}
.action {
  border-radius: 5px 5px 0 0;
  padding: 20px;
  border-bottom: 1px solid #ece8e8;
}

.tips {
  padding-left: 20px;
}

.pagination {
  justify-content: flex-end;
  padding: 14px;
}
</style>
