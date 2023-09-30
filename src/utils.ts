// @ts-nocheck
import Fingerprint2 from 'fingerprintjs2';
import localforage from 'localforage';

export function createFingerprint() {
    return new Promise<void>((resolve, reject) => {
        // 浏览器指纹
        Fingerprint2.get((components) => { // 参数只有回调函数时，默认浏览器指纹依据所有配置信息进行生成
            const values = components.map(component => component.value); // 配置的值的数组
            const murmur = Fingerprint2.x64hash128(values.join(''), 31); // 生成浏览器指纹
            // console.log(components);
            // console.log(values);
            // console.log(murmur);
            resolve(murmur);
            // localStorage.setItem('browserId', murmur); // 存储浏览器指纹，在项目中用于校验用户身份和埋点
        });
    })
}

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
  