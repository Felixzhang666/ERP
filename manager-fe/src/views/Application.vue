<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form
        :inline="true"
        :model="approval"
        class="demo-form-inline"
        ref="ruleFormRef"
      >
        <el-form-item label="Approvel State" prop="approveState">
          <el-select v-model="approval.approveState">
            <!-- <el-option label="All" :value="0"></el-option> -->
            <el-option label="Discard" :value="1"></el-option>
            <el-option label="Reject" :value="2"></el-option>
            <el-option label="Waiting" :value="3"></el-option>
            <el-option label="Success" :value="4"></el-option>
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
          @click="handleLeaveApplication(dialogFormRef)"
        >
          Vacation Application
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
        <el-table-column fixed="right" label="Operations" width="180">
          <template #default="scope">
            <el-button link type="warning" @click="handleCheck(scope.row)"
              >Check</el-button
            >
            <el-button link type="danger" @click="handleDelete(scope.row)"
             v-if="[1].indexOf(scope.row.approveState)" >Discard</el-button
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
        :model="leaveForm"
        label-width="100px"
        :rules="rules"
        status-icon
      >
        <el-form-item label="Leave Type" prop="type">
          <el-select v-model="leaveForm.type">
            <el-option label="Leave" :value="1"></el-option>
            <el-option label="Sick" :value="2"></el-option>
            <el-option label="Annual" :value="3"></el-option>
            <el-option label="Transfer" :value="4"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Leave Time" required>
          <el-row>
            <el-col :span="10">
              <el-form-item prop="startDate">
                <el-date-picker
                  v-model="leaveForm.startDate"
                  type="date"
                  placeholder="Start Time"
                  @change="HandleDateChange"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="2" style="text-align: center"> <b> - </b></el-col>
            <el-col :span="10">
              <el-form-item prop="endDate">
                <el-date-picker
                  v-model="leaveForm.endDate"
                  type="date"
                  placeholder="End Time"
                  @change="HandleDateChange"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="Length of leave">
          {{ leaveForm.leaveTime }}
        </el-form-item>

        <el-form-item label="Reason" prop="reasons">
          <el-input
            type="textarea"
            :row="5"
            v-model="leaveForm.reasons"
            placeholder="Please Input Reasons Of Leave"
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
  </div>
</template>

<script setup>
import { reactive, ref, toRaw, nextTick } from "vue";

//import axios from "axios";
import { getLeaveApplicationList, menuOperate,leaveOperate } from "../api/index";
import { ElMessage } from "element-plus";
const approval = reactive({
    approveState: 3,
});

let leaveForm = reactive({
  type: 1,
  startDate: "",
  endDate: "",
  reasons: "",
  leaveTime: "0 天",
});

const pager = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 1,
});
const rules = reactive({
  startDate: {
    required: true,
    message: "Leave Start Time cannot be Empty",
    trigger: "blur",
  }, // 失去光标
  endDate: {
    required: true,
    message: "Leave End Time cannot be Empty",
    trigger: "blur",
  }, // 失去光标
  reasons: {
    required: true,
    message: "Leave Reason cannot be Empty",
    trigger: "blur",
  },
});
let tableData = ref();

// Get Leave Data
async function leaveApplicationList() {
  let params = { ...approval, ...pager};
  const res = await getLeaveApplicationList(params);
  console.log(res);
  const { list } = res.data.data;
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
  { label: "Order ID", prop: "order", width: 220 },
  {
    label: "Apply Time",
    prop: "startDate",
    formatter(row, column, value) {
      let time = new Date(value);
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return time.toLocaleDateString(options);
    },
  },
  { label: "Leave Time", prop: "leaveTime" },
  {
    label: "Leave Type",
    prop: "type",
    formatter(row, column, value) {
      return {
        1: "Leave",
        2: "Sick",
        3: "Annual",
        4: "Transfer",
      }[value];
    },
  },
  { label: "Leave Reason", prop: "reasons", width: 110 },
  { label: "Approvers", prop: "approvers" },
  { label: "Current Approver", prop: "currentApprover", width: 135 },
  {
    label: "Approve State",
    prop: "approveState",
    width: 150,
    formatter(row, column, value) {
      return {
        1: "Discard",
        2: "Reject",
        3: "Waiting",
        4: "Pass",
      }[value];
    },
  },
]);

function handleQuery() {
    leaveApplicationList();
}

function handleReset(formEl) {
  if (!formEl) return;
  formEl.resetFields();
}
function HandleDateChange() {
  let { startDate, endDate } = leaveForm;
  if (startDate && endDate) {
    if (startDate > endDate) {
      ElMessage.error(" startDate cannot be later than endDate");
      leaveForm.startDate = "";
      return;
    }
    //ms 1971.1.1
    leaveForm.leaveTime =
      (endDate - startDate) / (24 * 60 * 60 * 1000) + " day";
  }
}
async function handleDelete(row) {
  await leaveOperate({
    _id: [row._id],
    action: "delete",
  });
  ElMessage.success("Discard Successfully");
  leaveApplicationList();
}

function handleClose(formEle) {
  centerDialogVisible.value = false;
  handleReset(formEle);
}

function handleSubmit(formEle) {
  if (!formEle) return;
  formEle.validate(async (valid) => {
    if (valid) {
      let params = toRaw(leaveForm); // normal object
      params.userEmail += "@gmail.com";
      params.action = action.value;
      const res = await leaveOperate(params);
      if (res.status === 200 && res.data.code == 200) {
        centerDialogVisible.value = false;
        const message =
          action.value === "edit"
            ? "Modify Successfully"
            : "Add Menu Successfully";
        ElMessage.success(message);
        handleReset(formEle);
        leaveApplicationList();
      }
    }
  });
}

function handleCheck(row) {
  action.value = "check"; //add
  title.value = "Leave Information";
  centerDialogVisible.value = true;
  nextTick(() => {
    Object.assign(leaveForm, row); //扩展
  });
}

function handleLeaveApplication(formEl, row) {
  //console.log(row); // undefined
  action.value = "create"; //add
  title.value = "Apply Leave";
  centerDialogVisible.value = true;
}
leaveApplicationList();
//getMenuList();
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
