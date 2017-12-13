
let config = {
  regexp: {
    int: /^\d{1,10}$/,
    tel: /^1\d{10}$/,
    money: /^\d{1,9}(\.\d{1,2})?$/
  },
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
    buyTime: ['3天内', '7天内'],
    buyWay: ['全款', '分期'],
    carSpec: ['合格证', '一致证书', '环保清单', '主钥匙', '备用钥匙', '用户手册', '保养手册', '首保', '三包', '车架号拓印纸', '天线', '点烟器'],
    orgLevel: ['公司', '分公司', '门店'],
    edu: ['博士', '硕士', '本科', '大专', '高中', '其他'],
    carJP: ['汽车香水座','坐垫','脚垫','腰垫','地毯','座套','保温壶','太阳膜','方向盘套','车载吸尘器','工具箱','备胎','GPS导航','汽车音响','汽车加湿器']
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
  },
  qrcodeOption: {
    data: '',
    cellSize: 5,
    correctLevel: 'H',
    typeNumber: 5,
    logo: {
      fontFamily: 'Arial',
      size: 0.15,
      color: '#000',
      text: '',
      clearEdges: 2,
      margin: 10
    },
    effect: {
      key: 'round',
      value: 0.2  
    }
  }
}

// 正式
// if (['admin.ushiyihao.com'].indexOf(window.location.host) > -1) {
//   config.api.baseURL = 'https://api.ushiyihao.com/useeproject02/management/admin'
// }
export default config