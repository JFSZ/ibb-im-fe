export function staticRoute(path, title) {
  let items = path.split('/')
  return {
    path: path + '/',
    component: require('./components/' + items[1] + '/' + items[2] + '.vue'),
    title: title,
    name: items[1] + '-' + items[2]
  }
}

export default [
  // 主页
  staticRoute('/home/index', '主页'),
  // 管理功能
  staticRoute('/manage/about', '关于'),
  staticRoute('/partyperson/list/:id','参与人列表'),
  staticRoute('/partyperson/add/:clueId','参与人'),
  staticRoute('/contribution/list/:id','贡献率评价列表'),
  staticRoute('/contribution/add/:id','贡献率评价'),
  staticRoute('/contribution/edit/:id','修改贡献率评价'),
  staticRoute('/contribution/edit/:clueId/:id','修改贡献率评价'),
  staticRoute('/contribution/detail/:id','贡献率评价详情'),
  staticRoute('/contribution/audit/:id/:clueId','贡献率提交审核'),
  staticRoute('/contribution/reward/','奖励统计列表'),
  staticRoute('/leads/add','录入销售线索'),
  staticRoute('/leads/list','销售线索列表'),
  staticRoute('/leads/in-list','参与人销售线索列表'),
  staticRoute('/leads/info/:id','销售线索详情'),
  staticRoute('/leads/approve/:id/:auditState','销售线索提交审核'),
  staticRoute('/contbtValue/contbtValuePsnAll','贡献列表'),
  staticRoute('/contbtValue/contbtValuePsnAllDtl/:contbtValueId','贡献列表'),
  staticRoute('/contbtValue/contbtValuePsnAllKMS/:contbtValueId','G-KMS积分结算'),
  staticRoute('/contbtValue/contbtValueDtlList','贡献明细列表'),
  staticRoute('/contbtValue/contbtValueDtlList/:contbtValueId','贡献明细详情'),
  staticRoute('/contbtValue/contbtValueSts','贡献值统计'),
  //审核模块
  staticRoute('/manage/my-apply/:state','审核列表'),
  staticRoute('/manage/audit-detail/:id','销售线索审核详情'),
  staticRoute('/manage/contribution-detail/:id','贡献率审核详情'),
  staticRoute('/manage/popup-audit/:id','销售线索审核详情同意'),
  staticRoute('/manage/copy-person/:id','选择人员'),
  //OA测试
  staticRoute('/public/audit','OA测试'),
  staticRoute('/public/myaudit','OA审批'),
  staticRoute('/public/copy-person/:applyId','抄送人'),
  staticRoute('/public/popup-audit/:applyId','驳回原因'),
]
