<template>
  <div class="department-manage">
    <div class="query-form">
      <el-form
        :inline="true"
        :model="dept"
        class="demo-form-inline"
        ref="ruleFormRef"
      >
        <el-form-item label="Dept Name" prop="dept.deptName">
          <el-input
            v-model="dept.deptName"
            placeholder="Please Input Department Name"
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
          @click="handleAddDept(dialogFormRef)"
        >
          Create
        </el-button>
      </div>

      <el-table :data="tableData" row-key="_id" style="width: 100%" default-expand-all>
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
              type="warning"
              size="small"
              @click="handleEdit(scope.row)"
              >Edit</el-button
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
    </div>
    <el-dialog v-model="centerDialogVisible" :title="title" align-center>
      <el-form
        ref="dialogFormRef"
        :model="deptForm"
        label-width="100px"
        :rules="rules"
        status-icon
      >
        <el-form-item label="Superior" prop="parentId">
          <el-cascader
            placeholder="Selection"
            v-model="deptForm.parentId"
            :options="tableData"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            clearable
          />
        </el-form-item>

        <el-form-item label="Dept Name" prop="deptName">
          <el-input
            v-model="deptForm.deptName"
            placeholder="Please Input Department Name"
          ></el-input>
        </el-form-item>
        <el-form-item label="Leader" prop="commander">
          <el-select v-model="deptForm.commander" @change="changeSelect">
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="`${item.userId}/${item.userName}/${item.userEmail}`"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Email" prop="userEmail">
          <el-input v-model="deptForm.userEmail" disabled />
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
  deptList,
  menuOperate,
  usersList,
  departmentOperate,
} from "../api/index";
import { ElMessage } from "element-plus";
const dept = reactive({
  deptName: "",
});

let deptForm = reactive({
    parentId:[null]
});
let userList = ref();

const rules = reactive({
  parentId: {
    required: true,
    message: "Please choose superior",
    trigger: "blur",
  }, // 失去光标

  deptName: {
    required: true,
    message: "Please Input Dept Name",
    trigger: "blur",
  },
  commander: {
    required: true,
    message: "Please choose commander",
    trigger: "blur",
  },
});
let tableData = ref();

// Get dept Data
async function getDepartmentList() {
  let params = { ...dept };
  const res = await deptList(params);
  console.log(res);
  const list = res.data.data;
  tableData.value = list;
}

async function getUserList() {
  const res = await usersList();
  const list = res.data.data.list;
  const source = list.filter((item) => {
    return item.state !== 2;
  });
  userList.value = source;
  // console.log(list);
}

const handleChange = (value) => {
  console.log(value);
};

const options = [];

const dialogFormRef = ref();

const userForm = reactive({
  state: 3,
});

const ruleFormRef = ref();
const centerDialogVisible = ref(false);

const action = ref(" ");
const title = ref("Add a New User");
const colums = reactive([
  { label: "Department Name", prop: "deptName", width:300 },
  { label: "Leader", prop: "userName" },
  {
    label: "Update Time",
    prop: "updateTime",
    formatter(row, column, value) {
      let time = new Date(value);
      return time.toLocaleString();
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

function changeSelect(value) {
  const [userId, userName, userEmail] = value.split("/");
  Object.assign(deptForm, { userId, userName, userEmail });
}
function handleQuery() {}

function handleReset(formEl) {
  if (!formEl) return;
  formEl.resetFields();
}

async function handleDelete(row) {
  await departmentOperate({
    _id: [row._id],
    action: "delete",
  });
  ElMessage.success("Delete Successfully");
  getDepartmentList();
}

function handleClose(formEle) {
  centerDialogVisible.value = false;
  handleReset(formEle);
}

function handleSubmit(formEle) {
  if (!formEle) return;
  formEle.validate(async (valid) => {
    if (valid) {
      let params = toRaw(deptForm); // normal object
      params.userEmail += "@mashibing.com";
      params.action = action.value;
      const res = await departmentOperate(params);
      if (res.status === 200 && res.data.code == 200) {
        centerDialogVisible.value = false;
        const message =
          action.value === "edit" ? "Modify Successfully" : "Add Successfully";
        ElMessage.success(message);
        handleReset(formEle);
        getDepartmentList();
      }
    }
  });
}

function handleEdit(row) {
  action.value = "edit"; //add
  title.value = "Edit Department's Information";
  centerDialogVisible.value = true;
  nextTick(() => {
    Object.assign(deptForm, row, {
      commander: row.userName,
    }); //扩展
  });
}

function handleAddDept(formEl) {
  //console.log(row); // undefined
  action.value = "add"; //add
  title.value = "New Department";
  centerDialogVisible.value = true;
}

getDepartmentList();
getUserList();
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
</style>
