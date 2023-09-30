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

    try{
        if ( deviceId === '' ) {
            if (navigator.userAgent.match(/Android/i)) {
                // Android设备可以使用IMEI作为唯一识别码
                deviceId = device.getIMEI(); // 请根据具体情况替换device.getIMEI()为获取IMEI的方法
            } else if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                // iOS设备可以使用UUID作为唯一识别码
                deviceId = device.getUUID(); // 请根据具体情况替换device.getUUID()为获取UUID的方法
            }
        }
    }catch(e){}

    return deviceId;
}
  