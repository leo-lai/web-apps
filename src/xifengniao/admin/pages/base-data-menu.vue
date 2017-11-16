<template>
  <div class="l-basedata-menu-box">
  	<div class="l-flex-hc _tit">
  		<b class="l-rest">菜单名称</b>
  		<el-button type="text">添加一级菜单</el-button>
  	</div>
    <el-tree class="l-basedata-menu" default-expand-all node-key="menuId" 
    	:data="menuList" :props="menuProps" :render-content="renderContent">
		</el-tree>
  </div>
</template>
<script>
function preventClick(e) {
	e.stopPropagation()
	return false
}
export default {
  name: 'base-data-menu',
  data() {
    return {
    	menuList: [{}],
      menuProps: {
        children: 'children',
        label: 'menuName'
      }
    }
  },
  methods: {
  	getList() {
			this.$$api.role.getMenuList().then(({data}) => {
				this.menuList = data
			})
  	},
    append(node, data) {
      // const newChild = { id: id++, label: 'testtest', children: [] };
      // if (!data.children) {
      //   this.$set(data, 'children', []);
      // }
      // data.children.push(newChild);
      return false
    },
    edit(node, data) {
    	console.log(node)
    	console.log(data)
    },
    remove(node, data) {
      // const parent = node.parent;
      // const children = parent.data.children || parent.data;
      // const index = children.findIndex(d => d.id === data.id);
      // children.splice(index, 1);
    },
    renderContent(h, { node, data, store }) {
      return (
        <div style="flex:1;" class="l-flex-hc">
          <span class="l-rest">
            <span>{data.menuName}</span>
          </span>
          <span class="l-padding-r" on-click={ preventClick }>
          	{ 
          		(data.children && data.children.length) > 0 ? 
          		<el-button class="l-text-ok" type="text" on-click={ _ => this.append(node, data) }>添加子菜单</el-button> : '' 
          	}
            <el-button class="l-text-link" type="text" on-click={ _ => this.edit(node, data) }>编辑</el-button>
            <el-button class="l-text-error" type="text" on-click={ _ => this.remove(node, data) }>删除</el-button>
          </span>
        </div>
      )
    }
  },
  mounted() {
		this.$$event.$on('base-data:tab', activeName => {
			if(activeName === 'menu' && this.menuList.length <= 1) {
				this.getList()
			}
		})
  }
}
</script>
<style scoped lang="less">
.l-basedata-menu-box{
	width: 700px;
	._tit{ background: #efeff4; padding: 0.25rem 0.75rem; }
}
</style>