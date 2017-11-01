<template>
	<div id="app">
		<el-container class="l-h100">
	    <el-header class="l-header">
	    	<div class="l-flex-hc">
	    		<div class="l-logo">
	    			<span>传创金融管理系统</span>
	    			<i class="el-icon-menu" title="菜单-展开/闭合" @click="collapse = !collapse"></i>
	    		</div>
	    		<div class="l-rest l-header-nav">
	    			<el-menu class="l-menu" :default-active="$route.path" mode="horizontal" 
	    				background-color="#373d41" text-color="#fff" active-text-color="#ffd04b">
						  <el-menu-item index="/">首页</el-menu-item>
						</el-menu>
	    		</div>
	    		<div class="l-rest l-text-right l-padding-lr">
	    			<el-dropdown size="medium" trigger="click">
						  <span class="el-dropdown-link">
						    admin <i class="el-icon-setting"></i>
						  </span>
						  <el-dropdown-menu slot="dropdown">
						    <el-dropdown-item @click.native="pwdForm.visible = true">修改密码</el-dropdown-item>
						    <el-dropdown-item @click.native="logout">退出系统</el-dropdown-item>
						  </el-dropdown-menu>
						</el-dropdown>
	    		</div>
	    	</div>
	    </el-header>
	    <el-container>
	      <el-aside class="l-aside" width="auto">
	        <el-menu class="l-menu" :default-active="$route.path" :collapse="collapse" :unique-opened="true" 
	        	background-color="#38415f" text-color="#fff" active-text-color="#ffd04b">
	          <el-submenu index="1">
					    <template slot="title">
					      <i class="el-icon-caret-right"></i>
					      <span slot="title">基础设置</span>
					    </template>
				      <el-menu-item index="1-1">
				      	<template slot="title">
						      <i class="el-icon-arrow-right"></i>
						      <span slot="title">菜单设置</span>
						    </template>
				      </el-menu-item>
				      <el-menu-item index="1-2">
				      	<template slot="title">
						      <i class="el-icon-arrow-right"></i>
						      <span slot="title">供应商管理</span>
						    </template>
				      </el-menu-item>
				      <el-menu-item index="1-3">
				      	<template slot="title">
						      <i class="el-icon-arrow-right"></i>
						      <span slot="title">车辆资料</span>
						    </template>
				      </el-menu-item>
				      <el-menu-item index="1-4">
				      	<template slot="title">
						      <i class="el-icon-arrow-right"></i>
						      <span slot="title">权限管理</span>
						    </template>
				      </el-menu-item>
				      <el-menu-item index="1-5">
				      	<template slot="title">
						      <i class="el-icon-arrow-right"></i>
						      <span slot="title">用户管理</span>
						    </template>
				      </el-menu-item>
				      <el-menu-item index="1-6">
				      	<template slot="title">
						      <i class="el-icon-arrow-right"></i>
						      <span slot="title">机构设置</span>
						    </template>
				      </el-menu-item>
					  </el-submenu>
					  <el-submenu index="2">
					    <template slot="title">
					      <i class="el-icon-caret-right"></i>
					      <span slot="title">库存管理</span>
					    </template>
				      <el-menu-item index="2-1">
				      	<template slot="title">
						      <i class="el-icon-arrow-right"></i>
						      <span slot="title">订车需求</span>
						    </template>
				      </el-menu-item>
				      <el-menu-item index="2-2">
				      	<template slot="title">
						      <i class="el-icon-arrow-right"></i>
						      <span slot="title">车辆库存</span>
						    </template>
				      </el-menu-item>
				      <el-menu-item index="2-3">
				      	<template slot="title">
						      <i class="el-icon-arrow-right"></i>
						      <span slot="title">车辆入库</span>
						    </template>
				      </el-menu-item>
				      <el-menu-item index="2-4">
				      	<template slot="title">
						      <i class="el-icon-arrow-right"></i>
						      <span slot="title">出库记录</span>
						    </template>
				      </el-menu-item>
					  </el-submenu>
	        </el-menu>
	      </el-aside>
	      <el-main class="l-main">
	      	<div class="l-breadcrumb" v-show="$route.path !== '/'">
		      	<el-breadcrumb separator-class="el-icon-arrow-right">
						  <el-breadcrumb-item v-if="item.path" v-for="item in $route.matched" :key="item.path">{{ item.meta.title }}</el-breadcrumb-item>
						</el-breadcrumb>	
	      	</div>
	        <transition name="fade" mode="out-in">
	          <router-view></router-view>
	        </transition>
	      </el-main>
	    </el-container>
	  </el-container>
		<el-dialog title="修改密码" :visible.sync="pwdForm.visible" width="500px">
  		<el-form :model="pwdForm.data" :rules="pwdForm.rules" ref="pwdForm" label-width="100px" style="width: 400px;">
			  <el-form-item label="旧密码" prop="passwordOld">
			    <el-input type="password" v-model="pwdForm.data.passwordOld" auto-complete="off"></el-input>
			  </el-form-item>
			  <el-form-item label="新密码" prop="password">
			    <el-input type="password" v-model="pwdForm.data.password" auto-complete="off"></el-input>
			  </el-form-item>
			  <el-form-item>
			    <el-button type="primary" :loading="pwdForm.submiting" @click="submitPwdForm">确定修改</el-button>
			    <el-button >取消</el-button>
			  </el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>
<script>
export default {
	name: 'frame',
  data() {
    return {
    	collapse: false,
    	pwdForm: {
    		visible: false,
				submiting: false,
				data: {
					passwordOld: '',
					password: '',
				},
				rules: {
					passwordOld: [
						{required: true, message: '请输入旧密码', trigger: 'blur'}
					],
					password: [
						{required: true, message: '请输入新密码', trigger: 'blur'}
					]
				}
    	}
    }
  },
  methods: {
  	logout() {
  		this.$router.replace('/login')
  	},
  	submitPwdForm() {

  	}
  },
  mounted() {
  }
}
</script>
