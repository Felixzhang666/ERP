<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form
        :inline="true"
        :model="menu"
        class="demo-form-inline"
        ref="ruleFormRef"
      >
        <el-form-item label="Menu Name" prop="menuName">
          <el-input
            v-model="menu.menuName"
            placeholder="Please Input Menu Name"
          />
        </el-form-item>

        <el-form-item label="Menu State" prop="menuState">
          <el-select v-model="menu.menuState" placeholder="Menu State">
            <el-option label="Normal" :value="1" />
            <el-option label="Disable" :value="2" />
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
          @click="handleAddMenu(dialogFormRef)"
        >
          Create
        </el-button>
      </div>

      <el-table :data="tableData" row-key="_id" style="width: 100%">
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
              @click="handleAddMenu(dialogFormRef,scope.row)"
              >Add</el-button
            >
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
        :model="menuForm"
        label-width="100px"
        :rules="rules"
        status-icon
      >
        <el-form-item label="Parent Menu" prop="parentId">
          <el-cascader
            placeholder="Selection"
            v-model="menuForm.parentId"
            :options="tableData"
            :props="{ checkStrictly: true, value: '_id', label: 'menuName' }"
            clearable
          />
          <span class="tips"
            >If no selection, create a level 1 menu directly</span
          >
        </el-form-item>

        <el-form-item label="Menu Type" prop="menuType">
          <el-radio-group v-model="menuForm.menuType" >
            <el-radio :label="1" >Menu</el-radio>
            <el-radio :label="2" >Button</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Menu Name" prop="menuName">
           <el-input v-model="menuForm.menuName" placeholder="Please Input Menu Name"></el-input>       
        </el-form-item>

        <el-form-item label="Menu Icon" prop="icon" v-show="menuForm.menuType == 1">
           <el-input v-model="menuForm.icon" placeholder="Please Input Menu Icon Path"></el-input>
        </el-form-item>

        <el-form-item label="Router Path" prop="path" v-show="menuForm.menuType == 1">
           <el-input v-model="menuForm.path" placeholder="Please Input Router Path"></el-input>
        </el-form-item>

        <el-form-item label="Menu Code" prop="menuCode" v-show="menuForm.menuType == 2">
           <el-input v-model="menuForm.menuCode" placeholder="Please Input Permission identifier"></el-input>
        </el-form-item>

        <el-form-item label="Menu State" prop="menuState">
          <el-radio-group v-model="menuForm.menuState" >
            <el-radio :label="1" >Normal</el-radio>
            <el-radio :label="2" >Disable</el-radio>
          </el-radio-group>
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
import { menuList, menuOperate} from "../api/index";
import { ElMessage } from "element-plus";
const menu = reactive({
  menuState: "",
  menuName: "",
  state: 1,
});

let menuForm = reactive({
  parentId:[null], 
  menuType:1,
  menuState:1,
  menuCode:""
});
 
const rules = reactive({
  menuName:[
    {required:true, message:"MenuName cannot be empty", trigger:"blur"},// 失去光标
    {min:2, max:6, message:"MenuName' length should be between 2-6 character", trigger:"blur" }
  ]
})
let tableData = ref();

// Get Menu Data
async function getMenuList() {
  let params = { ...menu };
  const res = await menuList(params);
  console.log(res);
  const list = res.data.data;
  tableData.value = list;
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
  { label: "Menu Name", prop: "menuName" },
  { label: "Icon", prop: "icon" },
  {
    label: "Menu Type",
    prop: "menuType",
    formatter(row, column, value) {
      return {
        1: "Menu",
        2: "Button",
      }[value];
    },
  },
  { label: "Menu Code", prop: "menuCode" },
  { label: "Router Path", prop: "path" },
  {
    label: "Menu State",
    prop: "menuState",
    formatter(row, column, value) {
      return {
        1: "Normal",
        2: "Disable",
      }[value];
    },
  },
]);

function handleQuery() {}

function handleReset(formEl) {
  if (!formEl) return;
  formEl.resetFields();
}

async function handleDelete(row) {
  await menuOperate({
    _id:[row._id],
    action:"delete"
  });
  ElMessage.success("Delete Successfully");
  getMenuList();
}

function handleClose(formEle) {
  centerDialogVisible.value = false;
  handleReset(formEle);
}

function handleSubmit(formEle) {
  if (!formEle) return;
  formEle.validate(async (valid) => {
    if (valid) {
      let params = toRaw(menuForm); // normal object
      params.userEmail += "@mashibing.com";
      params.action = action.value;
      const res = await menuOperate(params);
      if (res.status === 200 && res.data.code == 200) {
        centerDialogVisible.value = false;
        const message =
          action.value === "edit"
            ? "Modify Successfully"
            : "Add Menu Successfully";
        ElMessage.success(message);
        handleReset(formEle);
        getMenuList();
      }
    }
  });
}

function handleEdit(row) {
  action.value = "edit"; //add
  title.value = "Edite Menu's/Button's Information";
  centerDialogVisible.value = true;
  nextTick(() => {
    Object.assign(menuForm, row); //扩展
  });
}

function handleAddMenu(formEl, row) {
  //console.log(row); // undefined  
  action.value = "add"; //add
  title.value = "New Menu/Button";
  centerDialogVisible.value = true;
  // console.log(row.parentId);
  // console.log(row);
  if(row){
    menuForm.parentId = [...row.parentId, row._id].filter((item)=>item);
  }
 
}

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
</style>
