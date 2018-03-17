<template>
	<div class="l-contract">
    <div class="l-margin-b l-text-center">
      <h3>购车电子合同</h3>
    </div>
    <div class='l-margin'>
      <div>甲方（供车方）：{{info.partyA}}</div>
      <div>乙方（购车方）：<span>{{info.orgName}}</span></div>
      <div class='l-margin-t l-indent'>经甲乙双方共同协商一致，乙方愿意全权委托甲方代购指定车辆，双方特立此合同<span>{{info.orderCode}}</span>，以兹共同遵守：</div>
      <div class='l-h4'>一、委托代购事项</div>
      <div style='padding-left: 2em;'>
        <div class='l-table l-margin-b-m' v-for='item in info.customers' :key='item.id'>
          <div class='_tr'>
            <span>客户姓名：{{item.userName || ''}}</span>
            <span>手机号码：{{item.userPhone || ''}}</span>
          </div>
          <div v-for='carItem in item.infos' :key='carItem.id'>
            <div class='_tr'>
              <span>车型：{{carItem.carsName}}</span>
            </div>
            <div class='_tr'>
              <span>车身颜色：{{carItem.colorName}}</span>
              <span>内饰颜色：{{carItem.interiorName || ''}}</span>
            </div>
            <div class='_tr'>
              <span>购买数量：{{carItem.carNum}}辆</span>
              <span>官方指导价：{{carItem.guidePrice}}元</span>
            </div>
            <div class='_tr'>
              <span>裸车价：{{carItem.nakedPrice}}元</span>
              <span>交强险：{{carItem.trafficCompulsoryInsurancePrice || 0}}元</span>
            </div>
            <div class='_tr'>
              <span>商业险：{{carItem.commercialInsurancePrice || 0}}元</span>
              <span>{{carItem.changePrice > 0 ? '加价' : '优惠'}}：{{carItem.changePrice > 0 ? carItem.changePrice : 0 - carItem.changePrice}}元</span>
            </div>
            <div class='_tr'>
              <div>备注：{{carItem.remark || '无'}}</div>
            </div>
          </div>
        </div>
        <div class='l-table'>
          <div class='_tr'>
            <div>提车地点：{{info.pickCarAddr || '无'}}</div>
            <div>提车时间：{{info.pickCarDate || '无'}}</div>
          </div>
          <div class='_tr'>
            <div>物流方式：{{wuliu[info.logisticsType - 1]}}</div>
            <div>物流费用：{{info.freight || 0}}元</div>
          </div>
          <div class='_tr'>
            <div>定金总额：{{info.totalDepositPrice || 0}}元</div>
            <div>尾款总额：{{info.totalRestPrice || 0}}元</div>
          </div>
        </div>
      </div>
      <div class='l-h4'>二、款项及支付方式</div>
      <div class='l-indent'>1、本合同签订时则代表乙方完全同意合同<span>{{info.orderCode}}</span>中的所有订单信息，并且乙方根据订购单<span>{{info.orderCode}}</span>中的定金要向甲方支付代购定金总额￥<span>{{info.totalDepositPrice}}</span>；尾款总额￥<span>{{info.totalRestPrice}}</span>；</div>
      <div class='l-indent'>2、乙方必须在甲方通知提车当天内付清订购单{{info.orderCode}}的全款，如乙方未能在规定期限内付清全款，逾期7天未付甲方有权单方面解除合同，乙方所付定金不予退还，同时甲方有权处置乙方所定车辆；</div>
      <div class='l-indent'>3、上述所有款项，甲方指定收款账号为：</div>
      <div class='l-indent'>户名：{{info.bankAccountName}}</div>
      <div class='l-indent'>账号：{{info.bankCardNum}}</div>
      <div class='l-indent'>开户行：{{info.bankBranch}}</div>
      <div class='l-h4'>三、车辆机动车销售发票、合格证及相关资料由相应品牌专营开具并按约定时间交付；</div>
      <div class='l-h4'>四、乙方须提供准确真实客户信息，如发现作假资料不符合品牌区域销售管控的，本合约自动作废并没收定金；</div>
      <div class='l-h4'>五、车辆验收：提车时按车辆出厂标准由乙方或乙方委托的代表验收，如有异议应当场提出，如当场未提出异议，则视为乙方认可甲方代购的车辆符合出厂标准，车辆交接完毕后所产生的全部损失由乙方自行承担；</div>
      <div class='l-h4'>六、乙方购车客户须符合上牌资格，如因乙方客户自身原因导致不能上牌的责任由乙方负责，甲方不予退车或退款；</div>
      <div class='l-h4'>七、免责条款：协议生效后，因不可抗力的情况下（如因生产商停车，4S店发车时间、价格变动、4S店交通运输延误）而导致甲方无法履行合同，甲方有权解除本合约并退还所收定金；</div>
      <div class='l-h4'>八、本合同一式两份，于甲方收到购车定金即时生效，同时甲方保留本合约一切解释权</div>
      <div class='l-text-gray l-rel' style='padding: 30px 0;'>
        盖章处：<img mode='aspectFit' style='position:absolute; width: 100px; height: 80px; top: 5px; ' src='https://res.xfnauto.com/zang.png'></img>
      </div>
      <div>客户经理签名：{{info.creator}}</div>
      <div>日期：{{info.createTimeStr}}</div>
    </div>
    <div class="l-text-center">
      <el-button class="l-no-print" type="primary" @click="print">打印</el-button>
    </div>
	</div>
</template>
<script>
export default {
  name: "contract",
  data() {
    return {
      wuliu: ['自提', '其他', '送车'],
      info: {}
    };
  },
  methods: {
    getInfo() {
      const loading = this.$loading();
      this.$$api.order
        .getContractInfo(this.$route.query.id)
        .then(({ data }) => {
          data.createTimeStr = this.$$utils.str2date(data.createTime).format('yyyy年MM月dd日')
          this.info = data;
        })
        .finally(_ => {
          loading.close();
        });
    },
    getBankName(id) {
      return (this.bank.filter(item => item.id === id)[0] || {}).name || "";
    },
    print() {
      window.print();
    }
  },
  mounted() {
    this.getInfo();
  }
};
</script>
<style scoped lang="less">
.l-hidden {
  visibility: hidden;
}
.l-contract {
  -webkit-print-color-adjust: exact;
  width: 210mm;
  padding: 3mm 5mm;
  margin: 0 auto;
  background-color: #fff;
  box-sizing: border-box;
}
div{word-break: break-all; text-align:justify; text-justify: inter-word;}
.l-h4{margin-top: 10px; font-weight: 700;}
.l-indent{text-indent: 2em; margin: 3px 0;}
.l-table text{display: inline-block; min-width: 40%; margin-right: 2%; white-space: nowrap;}
</style>