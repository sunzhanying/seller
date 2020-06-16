/**
 * 
 * 数据层
 * 专注提供数据到view层
 * 上册 => api层 服务端接口请求，接口状态管理
 * 下层 => view层 业务逻辑
 * 
 */
const wxRequest = require('../api/wxRequest.js');
const config = require('../utils/config.js');



// 登录
function Login(data) {
  var url = config.DOMAIN + '/api/auth/login';
  return wxRequest.postRequest(url, data);
}

// 获取所有类型
function allType(data) {
  var url = config.DOMAIN + '/api/qyq/getSpTypeAll';
  return wxRequest.getRequest(url, data);
}
// 获取所有商品 
function getSpAll(data) {
  var url = config.DOMAIN + '/api/qyq/getSpAll';
  return wxRequest.getRequest(url, data);
}
// 获取商品详情
function getSpDetail(data) {
  var url = config.DOMAIN + '/api/qyq/getSpDetails';
  return wxRequest.getRequest(url, data);
}
// 保存用户头像和昵称
function saveUserInfo(data){
  var url = config.DOMAIN + '/api/khxx/saveAvatarAndNickname';
  return wxRequest.postRequest(url, data);
}
// 添加权益券
function addCard(data) {
  var url = config.DOMAIN + '/api/qyq/addQy';
  return wxRequest.postJson(url, data);
}
// 上传图片
function getUserInfo(data) {
  var url = config.DOMAIN + '/api/khxx/userInfo';
  return wxRequest.getRequest(url, data);
}
// 获取详情数据
function getTypeDetail(data) {
  var url = config.DOMAIN + '/api/qyq/getQyType';
  return wxRequest.getRequest(url, data);
}
// 保存手机号姓名
function saveTelAndName(data) {
  var url = config.DOMAIN + '/api/khxx/saveNamePhone';
  return wxRequest.postRequest(url, data);
}
// 发送短信
function sendInfo(data) {
  var url = config.DOMAIN + '/api/khxx/send-register-sms';
  return wxRequest.postRequest(url, data);
}

// 卖家版个人中心
function centerInfo(data) {
  var url = config.DOMAIN + '/api/khxx/qyqZt';
  return wxRequest.getRequest(url, data);
}
// 提现列表
function extractMoneyList(data){
  var url = config.DOMAIN + '/api/khxx/txshList';
  return wxRequest.getRequest(url, data)
}
// 请求提现
function extractMoney(data) {
  var url = config.DOMAIN + '/api/khxx/tx';
  return wxRequest.getRequest(url, data)
}
// 收藏
function collect(data) {
  var url = config.DOMAIN + '/api/khxx/collect';
  return wxRequest.getRequest(url, data)
}
// 收藏列表
function collectList(data) {
  var url = config.DOMAIN + '/api/khxx/myCollect';
  return wxRequest.getRequest(url, data)
}
//可提现金额
function extractMoneys(data) {
  var url = config.DOMAIN + '/api/khxx/ktxje';
  return wxRequest.getRequest(url, data)
}
// 
//首页banner
function getBanner(data) {
  var url = config.DOMAIN + '/api/auth/banner';
  return wxRequest.getRequest(url, data)
}
module.exports = {
  Login,
  allType,
  getSpAll,
  getSpDetail,
  saveUserInfo,
  addCard,
  getUserInfo,
  getTypeDetail,
  saveTelAndName,
  sendInfo,
  centerInfo,
  extractMoneyList,
  extractMoney,
  collect,
  collectList,
  extractMoneys,
  getBanner
}