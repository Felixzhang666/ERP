<template>
  <div class="login-wrapper">
    <div class="modal-content">
      <el-form ref="formRef" :model="ruleForm" :rules="rules" status-icon>
        <div class="title">Background Management System of ERP</div>
        <el-form-item prop="userName">
          <el-input
            type="text"
            placeholder="User Name"
            prefix-icon="UserFilled"
            v-model="ruleForm.userName"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="Your Password"
            prefix-icon="view"
            v-model="ruleForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="btn-primary"
            @click="submitForm(formRef)"
            >Login</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { login } from "../api";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const ruleForm = reactive({
  userName: "",
  password: "",
});
// Get original form's handle
const formRef = ref("");
const route = useRouter();
const store = useStore();
const rules = reactive({
  userName: [
    { required: true, message: "User name can't be empty!", trigger: "blur" },
    {
      min: 3,
      max: 6,
      message: "User names are three to six characters long.",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "Password can't be empty!", trigger: "blur" },
    {
      min: 6,
      max: 12,
      message: "Password are 6 to 12 characters long.",
      trigger: "blur",
    },
  ],
});

const submitForm = (elem) => {
  if (!elem) return;
  elem.validate((valid) => {
    if (valid) {
      login(ruleForm)
        .then((response) => {
          const{code} = response.data;
          if(code === 200 && response.status === 200){
            store.commit("saveUserInfo", response.data);
            route.push("/welcome");
          }
        
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("valid fail");
      return false;
    }
  });
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #eee;
}

.modal-content {
  width: 450px;
  padding: 50px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 0 10px 3px #999;
}

.title {
  font-size: 25px;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 20px;
}

.btn-primary {
  width: 100%;
  height: 40px;
}
</style>
