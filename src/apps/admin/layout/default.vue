<template>
	<div id="app">
		<el-container direction="horizontal " class="l-h100" :class="{'l-fullscreen': fullscreen}">
			<el-aside class="l-aside" :class="{'l-aside-collapse': collapse}">
				<div class="l-logo">
    			<span>传创金融管理系统</span>
    			<i class="el-icon-menu" title="菜单-展开/闭合" @click="doCollapse"></i>
    		</div>
        <el-menu class="l-menu" :default-active="$route.path" :collapse="collapse" :router="true" :unique-opened="false" 
        	background-color="#38415f" text-color="#fff" active-text-color="#ffd04b">
          <template v-for="menu in userMenus" v-if="!menu.hidden">
          	<el-submenu v-if="menu.children.length > 1" :index="menu.path" :key="menu.path">
			        <template slot="title">
			          <i class="el-icon-caret-right"></i>
			          <span>{{menu.meta.title}}</span>
			        </template>
			        <el-menu-item v-for="submenu in menu.children" :key="submenu.path" :index="menu.path +'/'+ submenu.path">
				      	<template slot="title">
						      <i class="el-icon-arrow-right"></i>
						      <span slot="title">{{submenu.meta.title}}</span>
						    </template>
				      </el-menu-item>
			      </el-submenu>
			      <el-menu-item v-else :index="menu.path" :key="menu.path">
			      	<template slot="title">
					      <i class="el-icon-caret-right"></i>
					      <span slot="title">{{menu.meta.title}}</span>
					    </template>
			      </el-menu-item>
          </template>
        </el-menu>
      </el-aside>
	    <el-container direction="vertical">
		    <el-header class="l-header l-flex-hc">
	    		<div class="l-rest l-header-nav">
	    			<el-menu class="l-menu" :default-active="$route.path" mode="horizontal" 
	    				background-color="#373d41" text-color="#fff" active-text-color="#ffd04b">
						  <el-menu-item index="/">首页</el-menu-item>
						</el-menu>
	    		</div>
	    		<div class="l-rest l-text-right l-padding-lr">
	    			<el-dropdown size="medium" trigger="click">
						  <span class="el-dropdown-link">
						    admin<i class="el-icon-setting l-fs-m l-margin-l-s" title="个人设置"></i>
						  </span>
						  <el-dropdown-menu slot="dropdown">
						    <el-dropdown-item @click.native="pwdForm.visible = true">修改密码</el-dropdown-item>
						    <el-dropdown-item @click.native="logout">退出系统</el-dropdown-item>
						  </el-dropdown-menu>
						</el-dropdown>
						<span class="l-margin-l-s" @click="fullScreen">
							<i class="el-icon-rank l-fs-m" title="切换全屏"></i>
						</span>
	    		</div>
		    </el-header>
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
import { mapGetters } from 'vuex'
import screenfull from 'screenfull'

export default {
	name: 'frame',
  data() {
    return {
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
  computed: {
  	...mapGetters([
  		'userMenus',
  		'fullscreen',
      'collapse'
    ])
  },
  methods: {
  	doCollapse() {
  		this.$store.dispatch('toggleCollapse')
  	},
  	initSomething() {
  		// 全屏设置
	  	if (screenfull.enabled) {
				screenfull.on('change', () => {
					this.$store.dispatch('toggleFullscreen', screenfull.isFullscreen)
				})
			}
			document.addEventListener('keyup', e => {
				e = e || window.event
				if (e && e.keyCode === 122){
					this.fullScreen()
				}
			})

			// window.onbeforeunload = function (e) {
			// 	return '确定离开此页吗？' 
			// }
  	},
  	fullScreen() {
  		if (!screenfull.enabled) {
        this.$message({
          message: 'sorry, you browser can not work!',
          type: 'warning'
        })
        this.$store.dispatch('toggleFullscreen')
        return false
      }
      screenfull.toggle()
  	},
  	logout() {
  		this.$store.dispatch('logout')
  	},
  	submitPwdForm() {

  	}
  },
  mounted() {
  	this.initSomething()
  }
}
</script>
