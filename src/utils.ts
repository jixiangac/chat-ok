// @ts-nocheck
export function getDeviceId() {
    var deviceId = '';
    try{
        // 如果是安卓设备
        if (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1) {
            deviceId = window.AndroidWebView.getIMEI();
        }
        // 如果是ios设备
        if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
            deviceId = window.webkit.messageHandlers.getIMEI.postMessage(null);
        }
    }catch(e){}
    return deviceId;
}