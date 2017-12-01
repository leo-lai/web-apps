
let config = {
  router: {
    base: Object.is(process.env.NODE_ENV, 'production') ? '/' : '/admin'
  },
  api: {
    baseURL: 'http://111.230.170.36/tauto/management/admin'
  },
  pay: {
    url: 'http://ceshi.allinpay.com/gateway/index.do',
    prod: 'https://service.allinpay.com/gateway/index.do'
  },
  baseData: {
    carSource: ['资源采购', '4S店出货', '订车入库'],
    carTime: ['随车', '3天内', '7天内'],
    buyWay: ['全款', '分期'],
    carSpec: ['合格证', '一致证书', '环保清单', '主钥匙', '备用钥匙', '用户手册', '保养手册', '首保', '三包', '车架号拓印纸', '天线', '点烟器'],
    orgLevel: ['公司', '分公司', '门店']
  },
  editorOption: {
    placeholder: '请在这里输入内容...',
    modules: {
      toolbar: [
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'font': [] }],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        // [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['link', 'image']
      ],
      history: {
        delay: 1000,
        maxStack: 50,
        userOnly: false
      },
      imageDrop: true,
      imageResize: {
        displayStyles: {
          backgroundColor: 'black',
          border: 'none',
          color: 'white'
        },
        modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
      }
    }
  }
}

// 正式
// if (['admin.ushiyihao.com'].indexOf(window.location.host) > -1) {
//   config.api.baseURL = 'https://api.ushiyihao.com/useeproject02/management/admin'
// }
export default config