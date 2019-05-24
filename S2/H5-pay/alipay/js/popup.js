var cls = "<style>.popup-mask{position: fixed;z-index: -1;opacity: 0;top: 0;right: 0;bottom: 0;left: 0;background-color: rgba(0,0,0,.5);}"
          + ".popup-content{background: #fff;width: 70%;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);border-radius: 2px;}"
          + ".popup-title{text-align: center;font-size: 0.36rem;padding-top: 0.4rem;color:#4a4a4a}"
          + ".popup-body{padding: 0.4rem;font-size: 0.3rem;color: #989a9c;}"
          + ".popup-foot{color: #0d8ee9;border-top: 1px solid #eee;text-align: center;height: 1rem;line-height: 1rem;font-size: 0.39rem;}"
          + ".popup-foot span{text-align: center; display: inline-block;width: 50%;}"
          + "</style>"
var html = '<div class="popup-mask"><div class="popup-content"><div class="popup-title"></div><div class="popup-body"></div><div class="popup-foot"><span class="foot-cancel">取消</span><span class="foot-sure">确定</span></div></div></div>'
var body = document.getElementsByTagName('body')[0];
var popupDiv = document.createElement('div');
popupDiv.innerHTML = html+cls;
body.appendChild(popupDiv);

var popupMask = document.querySelector('.popup-mask');
var popupTitle = document.querySelector('.popup-title');
var popupBody = document.querySelector('.popup-body');
var popupFootCancel = document.querySelector('.popup-foot .foot-cancel');
var popupFootSure = document.querySelector('.popup-foot .foot-sure');
var popup = {
  open: function (obj, sureFunc, cancalFunc) {
    obj = obj ? obj : {};
    popupTitle.display = obj.title ? 'block' : 'none' 
    popupMask.style.opacity = '1';
    popupMask.style.zIndex = '999';
    popupTitle.innerHTML = obj.title;
    popupBody.innerHTML = obj.cont;
    popupFootSure.innerHTML = obj.sureTxt || '确定';
    popupFootCancel.innerHTML = obj.cancelTxt || '取消';


    this.hideBtn(obj.hideSure, popupFootSure);
    this.hideBtn(obj.hideCancel, popupFootCancel);
    this.gethandler(sureFunc, popupFootSure);
    this.gethandler(cancalFunc, popupFootCancel);
  },
  // 关闭事件
  close: function () {
    popupMask.style.opacity = '0';
    popupMask.style.zIndex = '-1';
  },
  // 按钮的点击回调
  gethandler: function (callback, event) {
    event.removeEventListener('click', null);
    event.addEventListener('click', function () {
      callback ? callback() : '';
      popup.close();
    });
  },
  // 控制按钮是否显示
  hideBtn: function(value, event) {
    if (value) {
      event.style.display = 'none';
    } else {
      event.style.display = 'inline-block';
    }
  },
  beforeClose: function (callback) {
    this.close();
  }
}