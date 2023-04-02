<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form
        :inline="true"
        :model="user"
        class="demo-form-inline"
        ref="ruleFormRef"
      >
        <el-form-item label="User ID" prop="userId">
          <el-input v-model="user.userId" placeholder="User ID" />
        </el-form-item>

        <el-form-item label="User Name" prop="userName">
          <el-input v-model="user.userName" placeholder="User Name" />
        </el-form-item>

        <el-form-item label="User State" prop="state">
          <el-select v-model="user.state" placeholder="User State">
            <el-option label="ALL" :value="0" />
            <el-option label="On the job" :value="1" />
            <el-option label="Leave" :value="2" />
            <el-option label="Probationary period" :value="3" />
          </el-select>
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
          @click="handleAdduser(dialogFormRef)"
        >
          Add
        </el-button>
        <el-button link type="danger" size="small" @click="handleBatchDelete" v-permission="'user-all-delete'"
          >Batch delete</el-button
        >
      </div>

      <el-table
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item in colums"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
          :width="item.width"
        />
        <el-table-column fixed="right" label="Operations" width="140">
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
              type="danger"
              size="small"
              @click="handleDelete(scope.row)" v-permission="'user-all-delete'" 
              >Delete</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog v-model="centerDialogVisible" :title="title" align-center>
      <el-form
        ref="dialogFormRef"
        :model="userForm"
        label-width="100px"
        :rules="rules"
        status-icon
      >
        <el-form-item label="User Name" prop="userName">
          <el-input
            v-model="userForm.userName"
            placeholder="User Name"
            :disabled="action == 'edit'"
          />
        </el-form-item>

        <el-form-item label="Email" prop="userEmail">
          <el-input
            v-model="userForm.userEmail"
            placeholder="Email Address"
            :disabled="action == 'edit'"
          >
            <template #append> @mail.com </template>
          </el-input>
        </el-form-item>

        <el-form-item label="Mobile" prop="mobile">
          <el-input v-model="userForm.mobile" placeholder="Phone Number" />
        </el-form-item>

        <el-form-item label="Role" prop="role">
          <el-select v-model="userForm.role">
            <el-option :value="1" label="Admin" />
            <el-option :value="2" label="User" />
     
          </el-select>
        </el-form-item>

        <el-form-item label="State" prop="state">
          <el-select v-model="userForm.state">
            <el-option :value="1" label="On the Job" />
            <el-option :value="2" label="Leave" />
            <el-option :value="3" label="Probationary Period" />
          </el-select>
        </el-form-item>

        <el-form-item label="RoleList" prop="roleList">
          <el-select
            v-model="userForm.roleList"
            placeholder="Please choose a roleList"
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="role in allRoleList"
              :key="role._id"
              :label="role.roleName"
              :value="role._id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Department" prop="deptId">
          <el-cascader
            placeholder="Choose a Department"
            v-model="userForm.deptId"
            :options="allDeptList"
            :props="{ value: '_id', label: 'deptName' }"
            @change="handleChange"
            style="width: 90%"
          />
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
  </div>
</template>

<script setup>
import { reactive, ref, toRaw, nextTick } from "vue";

//import axios from "axios";
import {
  usersList,
  usersDelete,
  rolesList,
  deptList,
  operate
} from "../api/index";
import { ElMessage } from "element-plus";
const user = reactive({
  userId: "",
  userName: "",
  state: 1,
});

let tableData = ref();
const chooseUserIds = reactive([]);
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
});
// cascader 级联选择器
//const value = ref([]);

const handleChange = (value) => {
  console.log(value);
};

const options = [];

const dialogFormRef = ref();

const userForm = reactive({
  role: 2,
  state: 3
});

const allRoleList = reactive([]);
const allDeptList = reactive([]);

const rules = reactive({
  userName: [
    { required: true, message: "UserName Can't be Empty", trigger: "blur" },
  ],
  userEmail: [
    { required: true, message: "UserEmail Can't be Empty", trigger: "blur" },
  ],
  mobile: [
    { required: true, message: "Phone Number Can't be Empty", trigger: "blur" },
    {
      parttern: /1\d{10}/,
      message: "Please Input legal Phone Numer",
      trigger: "blur",
    },
  ],
  roleList: [
    { required: true, message: "Rolelist Can't be Empty", trigger: "blur" },
  ],
  DepId: [{ required: true, message: "DepId Can't be Empty", trigger: "blur" }],
});

const ruleFormRef = ref();
const centerDialogVisible = ref(false);
// const allRoleList = reactive({});
// const allDeptList = reactive({});

const action = ref(" ");
const title = ref("Add a New User");
const colums = reactive([
  { label: "User ID", prop: "userId", width: 90 },
  { label: "Name", prop: "userName", width: 80 },
  { label: "Email", prop: "userEmail" },
  {
    label: "Role",
    prop: "role",
    formatter(row, column, value) {
      return {
        1: "admin",
        2: "user",
      }[value];
    },
    width: 80,
  },
  {
    label: "State",
    prop: "state",
    formatter(row, column, value) {
      return {
        1: "On the job",
        2: "Leave",
        3: "Probation--period",
      }[value];
    },
    width: 90,
  },
  {
    label: "Create Time",
    prop: "createTime",
    formatter(row, column, value) {
      let time = new Date(value);
      return time.toLocaleString();
    },
  },
  {
    label: "Last Login",
    prop: "lastLoginTime",
    formatter(row, column, value) {
      let time = new Date(value);
      return time.toLocaleString();
    },
  },
]);

async function getUserList() {
  let params = { ...user, ...pager };
  const res = await usersList(params);
  const { list, page } = res.data.data;
  tableData.value = list; // push +++ => instead
  pager.total = page.total;
}

function handleQuery() {
  getUserList();
}

function handleReset(formEl) {
  if (!formEl) return;
  formEl.resetFields();
}

function handleCurrentChange(val) {
  //console.log(val);
  pager.pageNum = val;
  getUserList();
}
async function handleDelete(row) {
  await usersDelete({
    userIds: [row.userId],
  });
  ElMessage.success("Delete Successfully");
  getUserList();
}

async function handleBatchDelete() {
  if (chooseUserIds.length === 0) {
    ElMessage.error("Numbers of delete item cannot be 0");
    return;
  }
  await usersDelete({
    userIds: chooseUserIds,
  });

  ElMessage.success("Batch Delete Successfully");
  getUserList();
}
let res = new Map();
function handleSelectionChange(list) {
  list.filter((item) => {
    if (!res.has(item["userId"])) {
      res.set(item["userId"], 1);
      chooseUserIds.push(item.userId);
    }
  });
}

async function getRolesList() {
  const res = await rolesList();
  allRoleList.push(...res.data.data);
}

async function getDeptList() {
  const res = await deptList();
  allDeptList.push(...res.data.data);
}

function handleClose(formEle) {
  centerDialogVisible.value = false;
  handleReset(formEle);
}

function handleSubmit(formEle) {
  if (!formEle) return;
  formEle.validate(async (valid) => {
    if (valid) {
      let params = toRaw(userForm); // normal object
      params.userEmail += "@mashibing.com";
      params.action = action.value;
      const res = await operate(params);
      if (res.status === 200 && res.data.code == 200) {
        centerDialogVisible.value = false;
        const message = action.value === "edit" ? "Modify Successfully" : "Add User Successfully"
        ElMessage.success(message);
        handleReset(formEle);
        getUserList();
      }
    }
  });
}

function handleEdit(row) {
  action.value = "edit"; //add
  title.value = "Edite User's Information";
  centerDialogVisible.value = true;
  nextTick(() => {
    Object.assign(userForm, row); //扩展
  });
}

function handleAdduser(formEl) {
  action.value = "add"; //add
  title.value = "Add a New User";
  centerDialogVisible.value = true;
  handleReset(formEl);
}
getUserList();
getRolesList();
getDeptList();
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

.pagination {
  justify-content: flex-end;
  padding: 14px;
}
</style>
