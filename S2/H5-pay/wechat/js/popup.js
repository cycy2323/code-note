var cls = "<style>.popup-mask{position: fixed;z-index: -1;opacity: 0;top: 0;right: 0;bottom: 0;left: 0;background-color: rgba(0,0,0,.5);}"
          + ".popup-content{background: #fff;width: 70%;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);border-radius: 2px;}"
          + ".popup-title{text-align: center;font-size: 0.36rem;padding-top: 0.4rem;color:#4a4a4a}"
          + ".popup-body{padding: 0.4rem;font-size: 0.3rem;color: #989a9c;}"
          + ".popup-foot{color: #08c160;border-top: 1px solid #eee;text-align: center;height: 1rem;line-height: 1rem;font-size: 0.39rem;}"
          + "</style>"
var html = '<div class="popup-mask"><div class="popup-content"><div class="popup-title"></div><div class="popup-body"></div><div class="popup-foot">确定</div></div></div>'
var body = document.getElementsByTagName('body')[0];
var popupDiv = document.createElement('div');
popupDiv.innerHTML = html+cls;
body.appendChild(popupDiv);

var popupMask = document.querySelector('.popup-mask');
var popupTitle = document.querySelector('.popup-title');
var popupBody = document.querySelector('.popup-body');
var popupFoot = document.querySelector('.popup-foot');
var popup = {
  open: function (title, cont, foot) {
    popupTitle.display = title ? 'block' : 'none' 
    popupMask.style.opacity = '1';
    popupMask.style.zIndex = '999';
    popupTitle.innerHTML = title;
    popupBody.innerHTML = cont;
    popupFoot.innerHTML = foot || '确定';
  },
  close: function () {
    popupMask.style.opacity = '0';
    popupMask.style.zIndex = '-1';
  },
  beforeClose: function () {

  }
}
popupFoot.addEventListener('click', function () {
  popup.close()
});
