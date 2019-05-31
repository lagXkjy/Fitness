// const host = 'fitnessapp.1-zhao.com';
// const host = 'newtest.1-zhao.cn'; //测试服务器


const host = 'www.onegroupsfit.com'
// const host = 'testfitnessapp.1-zhao.fun'//测试
const referer = `https://${host}`;
const phoneReg = /^(1[3456789]|9[28])\d{9}$/; // 正则手机号码
const teaSrc = `${referer}/Content/CoachImgs/`; //教练图片
const courseSrc = `${referer}/Content/CorImgs/`; //课程图片
const activitySrc = `${referer}/Content/AtyImgs/`; //活动图片
const shopSrc = `${referer}/Content/StoreImgs/`; //门店图片
const images = `${referer}/Content/Images/`; // my页面个人信息背景图
const bannerSrc = `${referer}/Content/BanImgs/`; //banner图片
const exemptionBanner = `${referer}/Content/CorBImgs/`; //两人同行一人免单banner图
const navSrc = `${referer}/Content/CorNavImgs/`; //课程导航
const contentSrc = `${referer}/Content/FmImgs/`; //会员图标
const InvitCodeSrc = `${referer}/Content/InvitationQrCode/`; //会员图标
module.exports = {
  images: images,
  phoneReg: phoneReg,
  teaSrc: teaSrc,
  courseSrc: courseSrc,
  activitySrc: activitySrc,
  shopSrc: shopSrc,
  bannerSrc: bannerSrc,
  exemptionBanner: exemptionBanner,
  navSrc: navSrc,
  contentSrc,
  InvitCodeSrc,
  /**
   * 首页
   */

  //● 教练首页，获取所属门店信息
  GetCoaStoreInfo: `${referer}/ltp/Store/GetCoaStoreInfo`,
  //● 教练首页，获取未来一周的课程表
  GetCoaCorInfos: `${referer}/ltp/Courses/GetCoaCorInfos`,
  //● 获取小程序首页banner图片
  GetBanInfos: `${referer}/ltp/LobBanner/GetBanInfos`,
  //● 门店详情获取
  GetStoreInfo: `${referer}/ltp/Store/GetStoreInfo`,
  //● 学生端首页--城市信息获取
  GetCityInfos: `${referer}/ltp/City/GetCityInfos`,
  //● 学生首页--获取某城市的门店列表
  GetStoreInfos: `${referer}/ltp/Store/GetStoreInfos`,
  //● 获取门店信息
  GetStoreAbsInfo: `${referer}/ltp/Store/GetStoreAbsInfo`,
  //● 学员--获取课程信息
  GetStrCourseInfo: `${referer}/ltp/Courses/GetStrCourseInfo`,
  //● 学员--获取门店私课信息
  GetStrPriCourseInfos: `${referer}/ltp/Courses/GetStrPriCourseInfos`,
  //● 支付--获取课程信息
  GetCourseAbsInfo: `${referer}/ltp/Courses/GetCourseAbsInfo`,
  //● 支付--获取学员信息
  GetStuMemberInfo: `${referer}/ltp/StuMember/GetStuMemberInfo`,
  //● 支付--统一下单（已废弃）
  // PostAnOrder: `${referer}/ltp/Order/PostAnOrder`,
  //● 支付--统一下单(新)
  PostAnOrderNew: `${referer}/ltp/Order/PostAnOrderNew`,
  //● 支付--取消下单或支付失败
  PlaceAnOrderFailed: `${referer}/ltp/Order/PlaceAnOrderFailed`,
  //● 支付--支付成功后调用
  PayMentSuccess: `${referer}/ltp/Order/PayMentSuccess`,
  //● 获取未来一周内某天中买二付一课程信息列表
  GetCbInfos: `${referer}/ltp/CorBstao/GetCbInfos`,
  //● 获取某买二付一课程详细信息
  GetCbInfo: `${referer}/ltp/CorBstao/GetCbInfo`,
  //● 买二付一下单页获取课程信息
  GetCbInfoInPo: `${referer}/ltp/CorBstao/GetCbInfoInPo`,
  //● 买二付一课程购买前统一下单
  PubCbAnOrder: `${referer}/ltp/CorBstao/PubCbAnOrder`,
  //● 买二付一取消支付或支付失败时调用
  exemptionPlaceAnOrderFailed: `${referer}/ltp/CorBstao/PlaceAnOrderFailed`,
  //● 买二付一支付成功时调用
  exemptionPayMentSuccess: `${referer}/ltp/CorBstao/PayMentSuccess`,
  //● 获取待支付金额（仅限团课，返回余额支付与在线支付总额）
  GetPayMoney: `${referer}/ltp/Order/GetPayMoney`,
  //● 获取课程导航信息接口
  GetNaviInfos: `${referer}/ltp/CorNavi/GetNaviInfos`,
  //● 邀请有礼，获取邀请文案
  GetShareActivityInfos: `${referer}/ltp/ShareActivity/GetShareActivityInfos`,
  //● 注册， 查看是否注册
  IsStuRegister: `${referer}/ltp/StuMember/IsStuRegister`,
  //● 注册， 用户注册
  PutStuRegister: `${referer}/ltp/StuMember/PutStuRegister`,
  //● 支付，获取学生当前可用积分数
  GetStuIntegral: `${referer}/ltp/StuMember/GetStuIntegral`,
  //● 支付，获取月卡信息
  GetCardIsPayCorOrder_new: `${referer}/ltp/MonthlyCard/GetCardIsPayCorOrder`,
  ceshi: `${referer}/ltp/MonthlyCard/GetCardIsPay`,
  /**
   * 活动
   */
  //● 获取活动信息列表
  GetAtyInfos: `${referer}/ltp/Activity/GetAtyInfos`,
  //● 获取活动详细信息
  GetAtyInfo: `${referer}/ltp/Activity/GetAtyInfo`,

  /**
   * 我的
   */
  //用户登录
  Login: `${referer}/ltp/Home/Login`,
  //获取用户openId
  GetUserOpenId: `${referer}/ltp/UserInfo/GetUserOpenId`,
  //● 修改用户的微信头像与昵称
  PutUserNiAv: `${referer}/ltp/UserInfo/PutUserNiAv`,
  //● 教练--绑定教练信息
  BindCoachInfo: `${referer}/ltp/Coach/BindCoachInfo`,
  //● 获取用户头像昵称
  GetHeadPAVA: `${referer}/ltp/Coach/GetHeadPAVA`,
  //● 获取教练个人信息
  GetCoachInfo: `${referer}/ltp/Coach/GetCoachInfo`,
  //● 获取教练团课信息
  GetGroupCorInfos: `${referer}/ltp/Courses/GetGroupCorInfos`,
  //● 获取团课详细信息
  GetGroupCorInfo: `${referer}/ltp/Courses/GetGroupCorInfo`,
  //● 根据openId获取某教练的私课信息
  GetPrivateCorInfos: `${referer}/ltp/Courses/GetPrivateCorInfos`,
  //● 获取私课详细信息
  GetPrivateCorInfo: `${referer}/ltp/Courses/GetPrivateCorInfo`,
  //● 获取某教练团课的所有订单
  GetCoaGroupOdrInfos: `${referer}/ltp/Order/GetCoaGroupOdrInfos`,
  //● 根据订单ID查询课程信息
  GetCorInfo: `${referer}/ltp/Courses/GetCorInfo`,
  //● 获取订单详情
  GetOrderInfo: `${referer}/ltp/Order/GetOrderInfo`,
  //● 获取某教练私课的所有成功的订单
  GetCoaPrivateOdrInfos: `${referer}/ltp/Order/GetCoaPrivateOdrInfos`,
  //● 根据订单ID获取私课课程信息
  GetPriCorInfo: `${referer}/ltp/Courses/GetPriCorInfo`,
  //● 获取某学生报名的私课的上课时间表
  GetPriCorCct: `${referer}/ltp/CorClaTime/GetPriCorCct`,
  //● 结束私课已经上完课的课程时间表
  FinishPriCorCct: `${referer}/ltp/CorClaTime/FinishPriCorCct`,
  //● 私课--修改未开始的上课时间
  AlterPriCorCct: `${referer}/ltp/CorClaTime/AlterPriCorCct`,
  //● 私课--新增一条上课时间
  PostPriCorCct: `${referer}/ltp/CorClaTime/PostPriCorCct`,
  //● 教练--我的收入--获取总收入
  GetCoaAllIncome: `${referer}/ltp/Order/GetCoaAllIncome`,
  //● 教练--我的收入--收入明细查看
  GetCoaIncomes: `${referer}/ltp/Order/GetCoaIncomes`,
  //● 学员--我的团课信息
  GetMyGroupCorInfos: `${referer}/ltp/Order/GetMyGroupCorInfos`,
  //● 学员--我的私课信息
  GetMyPrivateCorInfos: `${referer}/ltp/Order/GetMyPrivateCorInfos`,
  //● 学员--删除我的订单信息
  DeleteMyOrderInfo: `${referer}/ltp/Order/DeleteMyOrderInfo`,
  //● 学员--退款接口
  PutReFund: `${referer}/ltp/Order/PutReFund`,
  //● 学员--获取调查问卷信息
  GetQuesInfo: `${referer}/ltp/Questionnaire/GetQuesInfo`,
  //● 学员--学员回答调查问卷
  PutCorQuesAns: `${referer}/ltp/Questionnaire/PutCorQuesAns`,
  //● 学员--获取学员的余额
  GetMyBalance: `${referer}/ltp/StuBalance/GetMyBalance`,
  //● 学员--学员余额充值下单
  PostReChargeOdr: `${referer}/ltp/StuBalance/PostReChargeOdr`,
  //● 学员--学员余额充值付款成功后调用
  PayMentSuccessBlance: `${referer}/ltp/StuBalance/PayMentSuccess`,
  //● 学员--学员余额充值取消或付款失败后调用
  PlaceAnOrderFailedBlance: `${referer}/ltp/StuBalance/PlaceAnOrderFailed`,
  //● 学员--消费明细查看
  GetMyFineBal: `${referer}/ltp/StuBalance/GetMyFineBal`,
  //● 学员--获取可购买课程包信息
  GetPrePackageInfos: `${referer}/ltp/PrePockage/GetPrePackageInfos`,
  //● 学员--购买课程包时获取课程包信息
  GetPrePackageInfo: `${referer}/ltp/PrePockage/GetPrePackageInfo`,
  //● 学员--购买课程包--下单
  PostPrePocOrder: `${referer}/ltp/PrePockage/PostPrePocOrder`,
  //● 学员--购买课程包支付成功后调用（余额支付成功后调用）
  PayMentSuccessBalance: `${referer}/ltp/PrePockage/PayMentSuccess`,
  //● 学员--购买课程包支付失败或者取消支付后调用
  PlaceAnOrderFailedBalance: `${referer}/ltp/PrePockage/PlaceAnOrderFailed`,
  //● 学员--获取我的课程包信息
  GetMppInfos: `${referer}/ltp/PrePockage/GetMppInfos`,
  //● 学员--查看我的某个课程包信息
  GetMppInfo: `${referer}/ltp/PrePockage/GetMppInfo`,
  //● 学员--查看我的某个课程包使用情况
  GetMppUseHis: `${referer}/ltp/PrePockage/GetMppUseHis`,
  //● 学员--学员手机号绑定
  BindingUserPhone: `${referer}/ltp/UserInfo/BindingUserPhone`,
  //● 买二付一，我的订单列表
  GetCorBoInfos: `${referer}/ltp/CorBstao/GetCorBoInfos`,
  //● 买二付一订单退款
  exemptionPutReFund: `${referer}/ltp/CorBstao/PutReFund`,
  //● 买二付一，查看买二付一订单详细信息
  GetCorBoInfo: `${referer}/ltp/CorBstao/GetCorBoInfo`,
  //● 买二付一，删除订单信息
  DelCorBoInfo: `${referer}/ltp/CorBstao/DelCorBoInfo`,
  //● 获取学员会员类型（0 不是会员  1 钻石会员  2 白金会员  3 黄金会员）
  GetStuFmInfo: `${referer}/ltp/FitMember/GetStuFmInfo`,
  //● 会员信息获取（已开通 + 未开通）
  GetFmInfos: `${referer}/ltp/FitMember/GetFmInfos`,
  //● 开通或续费会员，订单页获取会员信息
  GetFmInfo: `${referer}/ltp/FitMember/GetFmInfo`,
  //● 会员开通或续费下单
  VipPlaceAnOrder: `${referer}/ltp/FitMember/PlaceAnOrder`,
  //● 会员开通或续费下单，取消支付或支付失败
  VipPlaceAnOrderFailed: `${referer}/ltp/FitMember/PlaceAnOrderFailed`,
  //● 会员开通或续费下单,支付成功时调用
  VipPayMentSuccess: `${referer}/ltp/FitMember/PayMentSuccess`,
  //● 获取学生的所有优惠券信息
  GetStuCpInfos: `${referer}/ltp/StuCoupon/GetStuCpInfos`,
  //● 邀请有礼，获取banner
  GetInvCouBanner: `${referer}/ltp/InvitationCourtesy/GetInvCouBanner`,
  //● 邀请有礼，获取二维码
  GetInvCouQrCode: `${referer}/ltp/InvitationCourtesy/GetInvCouQrCode`,
  //● 邀请有礼，获取我邀请的用户
  GetInvitationUser: `${referer}/ltp/InvitationCourtesy/GetInvitationUser`,
  //● 邀请有礼，添加受邀信息
  AddUserInvitation: `${referer}/ltp/InvitationCourtesy/AddUserInvitation`,
  //● 月卡，月卡规则
  GetMonthltCardRule: `${referer}/ltp/MonthlyCard/GetMonthltCardRule`,
  //● 月卡，判断用户是否购买了月卡
  GetIsPayMonthlyCard: `${referer}/ltp/MonthlyCard/GetIsPayMonthlyCard`,
  //● 月卡，获取月卡信息
  GetMonthlyCardInfo: `${referer}/ltp/MonthlyCard/GetMonthlyCardInfo`,
  //● 月卡，展示用月卡购买的课程订单
  GetMonthlyCardCorOrder: `${referer}/ltp/MonthlyCard/GetMonthlyCardCorOrder`,
  //● 月卡，发起支付
  MonthPayMonthlyCard: `${referer}/ltp/MonthlyCard/PayMonthlyCard`,
  //● 月卡，支付失败或取消
  MonthPlaceAnOrderFailed: `${referer}/ltp/MonthlyCard/PlaceAnOrderFailed`,
  //● 获取代金券
  GetUserCashList: `${referer}/ltp/CashCoupon/GetUserCashList`,
}