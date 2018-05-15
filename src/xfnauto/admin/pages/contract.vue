<template>
	<div class="l-contract">
    <div class="l-flex-h">
      <div class="l-rest">
        <h3>{{info.orgName}}新车定购合同</h3>
        <p>联系电话：{{info.telePhone}}</p>
        <p>联系地址：{{info.orgAddress}}</p>
      </div>
      <div class="l-text-right">
        <el-button class="l-no-print" type="primary" @click="print">打印</el-button>
        <p style="margin-top: 8px;">NO.{{info.customerOrderCode}}</p>
      </div>
    </div>
    <div class="l-table-print">
      <table>
        <tr>
          <td>定购人姓名</td>
          <td>{{info.customerName}}</td>
          <td>身份证号</td>
          <td>{{info.customerUserCard}}</td>
        </tr>
        <tr>
          <td>联系电话</td>
          <td>{{info.customerPhoneNumber}}</td>
          <td>联系地址</td>
          <td style="font-size:12px;">{{info.address}}</td>
        </tr>
        <tr>
          <td colspan="4">定购车辆</td>
        </tr>
        <tr>
          <td>车型</td>
          <td style="font-size:12px;">{{info.carsName}}</td>
          <td>官方指导价</td>
          <td>¥ {{info.guidingPrice || info.guidancePrice}}</td>
        </tr>
        <tr>
          <td>车身颜色</td>
          <td>{{info.colourName}}</td>
          <td>内饰颜色</td>
          <td>{{info.interiorName}}</td>
        </tr>
        <tr>
          <td colspan="4">应付费用</td>
        </tr>
        <tr>
          <td>合计应付费用</td>
          <td>¥ {{info.amount}}</td>
          <td colspan="2">{{info.amountMoney}}</td>
        </tr>
        <tr>
          <td>应付定金</td>
          <td>¥ {{info.depositPrice}}</td>
          <td colspan="2">{{info.depositPriceMoney}}</td>
        </tr>
        <tr>
          <td colspan="4">费用组成</td>
        </tr>
        <tr>
          <td>车辆最终成交价</td>
          <td>¥ {{info.carUnitPrice}}</td>
          <td><span :class="{'l-hidden': !info.purchaseTaxPriace}">车辆购置税</span></td>
          <td><span :class="{'l-hidden': !info.purchaseTaxPriace}">¥ {{info.purchaseTaxPriace}}</span></td>
        </tr>
        <tr>
          <td><span :class="{'l-hidden': !info.licensePlatePriace}">上牌费</span></td>
          <td><span :class="{'l-hidden': !info.licensePlatePriace}">¥ {{info.licensePlatePriace}}</span></td>
          <td><span :class="{'l-hidden': !info.insurancePriace}">商业保险费用</span></td>
          <td><span :class="{'l-hidden': !info.insurancePriace}">¥ {{info.insurancePriace}}</span></td>
        </tr>
        <tr>
          <td><span :class="{'l-hidden': !info.mortgagePriace}">按揭费用</span></td>
          <td><span :class="{'l-hidden': !info.mortgagePriace}">¥ {{info.mortgagePriace}}</span></td>
          <td><span :class="{'l-hidden': !info.boutiquePriace}">精品选装费</span></td>
          <td><span :class="{'l-hidden': !info.boutiquePriace}">¥ {{info.boutiquePriace}}</span></td>
        </tr>
        <tr>
          <td><span :class="{'l-hidden': !info.vehicleAndVesselTax}">车船税</span></td>
          <td><span :class="{'l-hidden': !info.vehicleAndVesselTax}">¥ {{info.vehicleAndVesselTax}}</span></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td colspan="4">赠送／加装精品</td>
        </tr>
        <tr>
          <td colspan="4" style="background:#fff;height:10mm;">{{info.followInformation && info.followInformation.replace(/\,/g, '，')}}</td>
        </tr>
        <tr>
          <td colspan="4">按揭方案（此为预估方案，具体以银行／金融机构审批为准）</td>
        </tr>
        <tr>
          <td>贷款机构</td>
          <td>{{getBankName(info.loanBank)}}</td>
          <td>贷款金额</td>
          <td>¥ {{info.loan}}</td>
        </tr>
        <tr>
          <td>分期期数</td>
          <td>{{info.loanPayBackStages}}期</td>
          <td>首付</td>
          <td>¥ {{info.downPayments}}</td>
        </tr>
        <tr>
          <td style="font-size: 16px; font-weight: 700; text-align:center;">约定<br/>事项</td>
          <td colspan="3" class="l-text-justify">
            <ul>
              <li>车辆验收：提车时按车辆出厂标准由乙方或乙方委托的代表验收，如有异议应当场提出，如当场未提出异议，则视为乙方认可甲方代购的车辆符合出厂标准，车辆交接完毕后所产生的全部损失由乙方自行承担；</li>
              <li>在定车过程中如遇到不可抗力之因素和政策推迟交货的，交车时间应同时向后推移，同时甲方应及时通知乙方新的交车时间，甲方不负连带责任；</li>
              <li>违约责任：乙方单方面解除合同或无故退车，乙方所支付定金不予退还，所造成的损失由乙方承担；乙方在接到甲方车辆到店通知三日内，须及时到店验车并交清全部余款，否则甲方将有权收回车辆及没收乙方所支付的定金；</li>
              <li>乙方对提供办理所购车辆登记注册资料的真实性负责，如需更改须于甲方向车商定购车辆前提出，否则产生的损失全部由乙方承担；</li>
              <li>合同中金额为初步确认金额，如过程过发生金额变更：如银行贷款方案变化及车船税补交等，甲方应及时通知乙方新的费用方案，甲方不负连带责任；</li>
            </ul>
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>(甲方)销售签名</td>
          <td></td>
          <td>(甲方)复核签名</td>
          <td></td>
          <td rowspan="2" style="color:#ccc; text-align:center; width: 24mm; height: 24mm;">盖章处</td>
        </tr>
        <tr>
          <td>(乙方)客户签名</td>
          <td></td>
          <td>签订日期</td>
          <td></td>
        </tr>
      </table>
    </div>
	</div>
</template>
<script>
export default {
  name: "contract",
  data() {
    return {
      bank: [
        { id: 1, name: '奇瑞金融' },
        { id: 2, name: '瑞福德金融' },
        { id: 3, name: '建设银行' },
        { id: 4, name: '农业银行' },
        { id: 5, name: '工商银行' },
        { id: 6, name: '广州银行' },
        { id: 7, name: '鹤山珠江村镇银行' },
        { id: 8, name: '鹤山农村信用合作社' },
        { id: 9, name: '锐诚金融' }
      ],
      info: {}
    };
  },
  methods: {
    getInfo() {
      const loading = this.$loading();
      this.$$api.customer
        .getContractInfo(this.$route.query.id)
        .then(({ data }) => {
          this.info = data
        })
        .finally(_ => {
          loading.close()
        })
    },
    getBankName(id) {
      return ((this.bank.filter(item => item.id === id)[0] || {}).name || '')
    },
    print() {
      window.print()
    }
  },
  mounted() {
    this.getInfo()
  }
};
</script>
<style scoped lang="less">
.l-hidden{visibility: hidden;}
.l-contract {
  -webkit-print-color-adjust: exact;
  width: 210mm;
  padding: 3mm 5mm;
  margin: 0 auto;
  background-color: #fff;
  box-sizing: border-box;
}
.l-table-print {
  border: 2px solid #979797;
  box-sizing: border-box;
  overflow: hidden;
  table {
    border-collapse: collapse;
    width: 101%;
    box-sizing: border-box;
    margin: -1px;
  }
  td {
    border: 1px solid #979797;
    padding: 1.5mm 3mm;
    height: 5mm;
  }
  td:nth-of-type(odd) {
    width: 30mm;
  }
  td:nth-of-type(even) {
    max-width: 50mm;
  }
  td[colspan="4"] {
    background: #f5f5f5;
  }
  ul {
    margin: 2mm;
    padding-left: 4mm;
    font-size: 12px;
  }
  li {
    list-style: decimal; margin-top: 1mm;
  }
}
</style>