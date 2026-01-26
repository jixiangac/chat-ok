/**
 * 全国地级市经纬度数据（用于真太阳时校正）
 * 按省份分组，覆盖全国所有地级市
 */

export interface CityInfo {
  name: string;
  lng: number;
  lat: number;
}

export interface ProvinceData {
  name: string;
  cities: CityInfo[];
}

// 全国省份及其地级市数据
export const PROVINCE_CITY_DATA: ProvinceData[] = [
  // 直辖市
  {
    name: '北京市',
    cities: [
      { name: '北京', lng: 116.4074, lat: 39.9042 },
    ],
  },
  {
    name: '天津市',
    cities: [
      { name: '天津', lng: 117.1901, lat: 39.1256 },
    ],
  },
  {
    name: '上海市',
    cities: [
      { name: '上海', lng: 121.4737, lat: 31.2304 },
    ],
  },
  {
    name: '重庆市',
    cities: [
      { name: '重庆', lng: 106.5516, lat: 29.5630 },
    ],
  },
  // 河北省
  {
    name: '河北省',
    cities: [
      { name: '石家庄', lng: 114.5149, lat: 38.0428 },
      { name: '唐山', lng: 118.1802, lat: 39.6305 },
      { name: '秦皇岛', lng: 119.5860, lat: 39.9425 },
      { name: '邯郸', lng: 114.4896, lat: 36.6127 },
      { name: '邢台', lng: 114.5048, lat: 37.0682 },
      { name: '保定', lng: 115.4646, lat: 38.8737 },
      { name: '张家口', lng: 114.8849, lat: 40.8244 },
      { name: '承德', lng: 117.9396, lat: 40.9762 },
      { name: '沧州', lng: 116.8571, lat: 38.3106 },
      { name: '廊坊', lng: 116.6838, lat: 39.5380 },
      { name: '衡水', lng: 115.6700, lat: 37.7389 },
    ],
  },
  // 山西省
  {
    name: '山西省',
    cities: [
      { name: '太原', lng: 112.5489, lat: 37.8706 },
      { name: '大同', lng: 113.2951, lat: 40.0903 },
      { name: '阳泉', lng: 113.5805, lat: 37.8568 },
      { name: '长治', lng: 113.1163, lat: 36.1954 },
      { name: '晋城', lng: 112.8512, lat: 35.4908 },
      { name: '朔州', lng: 112.4329, lat: 39.3316 },
      { name: '晋中', lng: 112.7527, lat: 37.6872 },
      { name: '运城', lng: 111.0039, lat: 35.0228 },
      { name: '忻州', lng: 112.7341, lat: 38.4167 },
      { name: '临汾', lng: 111.5190, lat: 36.0880 },
      { name: '吕梁', lng: 111.1440, lat: 37.5183 },
    ],
  },
  // 内蒙古自治区
  {
    name: '内蒙古',
    cities: [
      { name: '呼和浩特', lng: 111.6708, lat: 40.8183 },
      { name: '包头', lng: 109.8403, lat: 40.6574 },
      { name: '乌海', lng: 106.7943, lat: 39.6553 },
      { name: '赤峰', lng: 118.8869, lat: 42.2571 },
      { name: '通辽', lng: 122.2438, lat: 43.6526 },
      { name: '鄂尔多斯', lng: 109.7813, lat: 39.6084 },
      { name: '呼伦贝尔', lng: 119.7657, lat: 49.2122 },
      { name: '巴彦淖尔', lng: 107.3878, lat: 40.7432 },
      { name: '乌兰察布', lng: 113.1325, lat: 41.0223 },
      { name: '兴安盟', lng: 122.0378, lat: 46.0821 },
      { name: '锡林郭勒盟', lng: 116.0477, lat: 43.9333 },
      { name: '阿拉善盟', lng: 105.7289, lat: 38.8510 },
    ],
  },
  // 辽宁省
  {
    name: '辽宁省',
    cities: [
      { name: '沈阳', lng: 123.4315, lat: 41.8057 },
      { name: '大连', lng: 121.6147, lat: 38.9140 },
      { name: '鞍山', lng: 122.9956, lat: 41.1106 },
      { name: '抚顺', lng: 123.9210, lat: 41.8660 },
      { name: '本溪', lng: 123.7662, lat: 41.2942 },
      { name: '丹东', lng: 124.3545, lat: 40.0005 },
      { name: '锦州', lng: 121.1270, lat: 41.0950 },
      { name: '营口', lng: 122.2350, lat: 40.6673 },
      { name: '阜新', lng: 121.6489, lat: 42.0118 },
      { name: '辽阳', lng: 123.1729, lat: 41.2733 },
      { name: '盘锦', lng: 122.0703, lat: 41.1240 },
      { name: '铁岭', lng: 123.8440, lat: 42.2861 },
      { name: '朝阳', lng: 120.4510, lat: 41.5768 },
      { name: '葫芦岛', lng: 120.8372, lat: 40.7110 },
    ],
  },
  // 吉林省
  {
    name: '吉林省',
    cities: [
      { name: '长春', lng: 125.3245, lat: 43.8868 },
      { name: '吉林', lng: 126.5496, lat: 43.8378 },
      { name: '四平', lng: 124.3504, lat: 43.1666 },
      { name: '辽源', lng: 125.1454, lat: 42.8879 },
      { name: '通化', lng: 125.9395, lat: 41.7285 },
      { name: '白山', lng: 126.4147, lat: 41.9425 },
      { name: '松原', lng: 124.8237, lat: 45.1418 },
      { name: '白城', lng: 122.8410, lat: 45.6190 },
      { name: '延边', lng: 129.5132, lat: 42.9048 },
    ],
  },
  // 黑龙江省
  {
    name: '黑龙江省',
    cities: [
      { name: '哈尔滨', lng: 126.5358, lat: 45.8038 },
      { name: '齐齐哈尔', lng: 123.9180, lat: 47.3542 },
      { name: '鸡西', lng: 130.9756, lat: 45.3004 },
      { name: '鹤岗', lng: 130.2977, lat: 47.3500 },
      { name: '双鸭山', lng: 131.1593, lat: 46.6465 },
      { name: '大庆', lng: 125.1037, lat: 46.5897 },
      { name: '伊春', lng: 128.8994, lat: 47.7277 },
      { name: '佳木斯', lng: 130.3617, lat: 46.8139 },
      { name: '七台河', lng: 131.0030, lat: 45.7710 },
      { name: '牡丹江', lng: 129.6333, lat: 44.5515 },
      { name: '黑河', lng: 127.5286, lat: 50.2456 },
      { name: '绥化', lng: 126.9688, lat: 46.6374 },
      { name: '大兴安岭', lng: 124.1116, lat: 50.4220 },
    ],
  },
  // 江苏省
  {
    name: '江苏省',
    cities: [
      { name: '南京', lng: 118.7969, lat: 32.0603 },
      { name: '无锡', lng: 120.3119, lat: 31.4912 },
      { name: '徐州', lng: 117.1848, lat: 34.2618 },
      { name: '常州', lng: 119.9741, lat: 31.8112 },
      { name: '苏州', lng: 120.5832, lat: 31.2989 },
      { name: '南通', lng: 120.8647, lat: 31.9807 },
      { name: '连云港', lng: 119.2216, lat: 34.5967 },
      { name: '淮安', lng: 119.0153, lat: 33.6104 },
      { name: '盐城', lng: 120.1397, lat: 33.3776 },
      { name: '扬州', lng: 119.4129, lat: 32.3942 },
      { name: '镇江', lng: 119.4528, lat: 32.2044 },
      { name: '泰州', lng: 119.9232, lat: 32.4559 },
      { name: '宿迁', lng: 118.2752, lat: 33.9631 },
    ],
  },
  // 浙江省
  {
    name: '浙江省',
    cities: [
      { name: '杭州', lng: 120.1551, lat: 30.2741 },
      { name: '宁波', lng: 121.5440, lat: 29.8683 },
      { name: '温州', lng: 120.6994, lat: 28.0003 },
      { name: '嘉兴', lng: 120.7555, lat: 30.7467 },
      { name: '湖州', lng: 120.0865, lat: 30.8940 },
      { name: '绍兴', lng: 120.5801, lat: 30.0302 },
      { name: '金华', lng: 119.6471, lat: 29.0895 },
      { name: '衢州', lng: 118.8593, lat: 28.9700 },
      { name: '舟山', lng: 122.1070, lat: 29.9853 },
      { name: '台州', lng: 121.4207, lat: 28.6561 },
      { name: '丽水', lng: 119.9229, lat: 28.4679 },
    ],
  },
  // 安徽省
  {
    name: '安徽省',
    cities: [
      { name: '合肥', lng: 117.2272, lat: 31.8206 },
      { name: '芜湖', lng: 118.4328, lat: 31.3524 },
      { name: '蚌埠', lng: 117.3893, lat: 32.9166 },
      { name: '淮南', lng: 117.0183, lat: 32.6264 },
      { name: '马鞍山', lng: 118.5078, lat: 31.6894 },
      { name: '淮北', lng: 116.7983, lat: 33.9716 },
      { name: '铜陵', lng: 117.8121, lat: 30.9454 },
      { name: '安庆', lng: 117.0633, lat: 30.5432 },
      { name: '黄山', lng: 118.3377, lat: 29.7147 },
      { name: '滁州', lng: 118.3170, lat: 32.3017 },
      { name: '阜阳', lng: 115.8142, lat: 32.8908 },
      { name: '宿州', lng: 116.9641, lat: 33.6468 },
      { name: '六安', lng: 116.5078, lat: 31.7529 },
      { name: '亳州', lng: 115.7785, lat: 33.8693 },
      { name: '池州', lng: 117.4912, lat: 30.6649 },
      { name: '宣城', lng: 118.7590, lat: 30.9457 },
    ],
  },
  // 福建省
  {
    name: '福建省',
    cities: [
      { name: '福州', lng: 119.2965, lat: 26.0745 },
      { name: '厦门', lng: 118.0894, lat: 24.4798 },
      { name: '莆田', lng: 119.0078, lat: 25.4540 },
      { name: '三明', lng: 117.6389, lat: 26.2631 },
      { name: '泉州', lng: 118.6758, lat: 24.8741 },
      { name: '漳州', lng: 117.6471, lat: 24.5128 },
      { name: '南平', lng: 118.1784, lat: 26.6419 },
      { name: '龙岩', lng: 117.0173, lat: 25.0918 },
      { name: '宁德', lng: 119.5477, lat: 26.6656 },
    ],
  },
  // 江西省
  {
    name: '江西省',
    cities: [
      { name: '南昌', lng: 115.8579, lat: 28.6829 },
      { name: '景德镇', lng: 117.1784, lat: 29.2688 },
      { name: '萍乡', lng: 113.8543, lat: 27.6229 },
      { name: '九江', lng: 116.0019, lat: 29.7051 },
      { name: '新余', lng: 114.9167, lat: 27.8179 },
      { name: '鹰潭', lng: 117.0694, lat: 28.2600 },
      { name: '赣州', lng: 114.9400, lat: 25.8508 },
      { name: '吉安', lng: 114.9927, lat: 27.1138 },
      { name: '宜春', lng: 114.4161, lat: 27.8136 },
      { name: '抚州', lng: 116.3582, lat: 27.9483 },
      { name: '上饶', lng: 117.9433, lat: 28.4551 },
    ],
  },
  // 山东省
  {
    name: '山东省',
    cities: [
      { name: '济南', lng: 117.1205, lat: 36.6512 },
      { name: '青岛', lng: 120.3826, lat: 36.0671 },
      { name: '淄博', lng: 118.0548, lat: 36.8133 },
      { name: '枣庄', lng: 117.3238, lat: 34.8108 },
      { name: '东营', lng: 118.6749, lat: 37.4346 },
      { name: '烟台', lng: 121.4479, lat: 37.4638 },
      { name: '潍坊', lng: 119.1619, lat: 36.7068 },
      { name: '济宁', lng: 116.5871, lat: 35.4154 },
      { name: '泰安', lng: 117.0876, lat: 36.2001 },
      { name: '威海', lng: 122.1163, lat: 37.5097 },
      { name: '日照', lng: 119.5269, lat: 35.4164 },
      { name: '临沂', lng: 118.3564, lat: 35.1041 },
      { name: '德州', lng: 116.3575, lat: 37.4356 },
      { name: '聊城', lng: 115.9853, lat: 36.4561 },
      { name: '滨州', lng: 117.9706, lat: 37.3821 },
      { name: '菏泽', lng: 115.4806, lat: 35.2339 },
    ],
  },
  // 河南省
  {
    name: '河南省',
    cities: [
      { name: '郑州', lng: 113.6254, lat: 34.7466 },
      { name: '开封', lng: 114.3076, lat: 34.7971 },
      { name: '洛阳', lng: 112.4540, lat: 34.6197 },
      { name: '平顶山', lng: 113.1927, lat: 33.7662 },
      { name: '安阳', lng: 114.3927, lat: 36.0978 },
      { name: '鹤壁', lng: 114.2975, lat: 35.7482 },
      { name: '新乡', lng: 113.9268, lat: 35.3030 },
      { name: '焦作', lng: 113.2418, lat: 35.2159 },
      { name: '濮阳', lng: 115.0296, lat: 35.7617 },
      { name: '许昌', lng: 113.8261, lat: 34.0350 },
      { name: '漯河', lng: 114.0166, lat: 33.5762 },
      { name: '三门峡', lng: 111.2003, lat: 34.7726 },
      { name: '南阳', lng: 112.5283, lat: 32.9908 },
      { name: '商丘', lng: 115.6506, lat: 34.4371 },
      { name: '信阳', lng: 114.0913, lat: 32.1470 },
      { name: '周口', lng: 114.6496, lat: 33.6204 },
      { name: '驻马店', lng: 114.0249, lat: 32.9802 },
      { name: '济源', lng: 112.5900, lat: 35.0670 },
    ],
  },
  // 湖北省
  {
    name: '湖北省',
    cities: [
      { name: '武汉', lng: 114.3055, lat: 30.5928 },
      { name: '黄石', lng: 115.0389, lat: 30.1996 },
      { name: '十堰', lng: 110.7990, lat: 32.6292 },
      { name: '宜昌', lng: 111.2864, lat: 30.6918 },
      { name: '襄阳', lng: 112.1223, lat: 32.0086 },
      { name: '鄂州', lng: 114.8948, lat: 30.3910 },
      { name: '荆门', lng: 112.1993, lat: 31.0354 },
      { name: '孝感', lng: 113.9572, lat: 30.9179 },
      { name: '荆州', lng: 112.2390, lat: 30.3269 },
      { name: '黄冈', lng: 114.8724, lat: 30.4536 },
      { name: '咸宁', lng: 114.3228, lat: 29.8413 },
      { name: '随州', lng: 113.3826, lat: 31.6903 },
      { name: '恩施', lng: 109.4869, lat: 30.2831 },
      { name: '仙桃', lng: 113.4537, lat: 30.3642 },
      { name: '潜江', lng: 112.8993, lat: 30.4019 },
      { name: '天门', lng: 113.1659, lat: 30.6531 },
      { name: '神农架', lng: 110.6758, lat: 31.7448 },
    ],
  },
  // 湖南省
  {
    name: '湖南省',
    cities: [
      { name: '长沙', lng: 112.9388, lat: 28.2282 },
      { name: '株洲', lng: 113.1338, lat: 27.8274 },
      { name: '湘潭', lng: 112.9445, lat: 27.8297 },
      { name: '衡阳', lng: 112.5720, lat: 26.8937 },
      { name: '邵阳', lng: 111.4679, lat: 27.2389 },
      { name: '岳阳', lng: 113.1285, lat: 29.3570 },
      { name: '常德', lng: 111.6986, lat: 29.0317 },
      { name: '张家界', lng: 110.4792, lat: 29.1172 },
      { name: '益阳', lng: 112.3553, lat: 28.5530 },
      { name: '郴州', lng: 113.0142, lat: 25.7704 },
      { name: '永州', lng: 111.6131, lat: 26.4345 },
      { name: '怀化', lng: 109.9985, lat: 27.5549 },
      { name: '娄底', lng: 111.9939, lat: 27.7002 },
      { name: '湘西', lng: 109.7389, lat: 28.3142 },
    ],
  },
  // 广东省
  {
    name: '广东省',
    cities: [
      { name: '广州', lng: 113.2644, lat: 23.1291 },
      { name: '韶关', lng: 113.5975, lat: 24.8108 },
      { name: '深圳', lng: 114.0579, lat: 22.5431 },
      { name: '珠海', lng: 113.5767, lat: 22.2707 },
      { name: '汕头', lng: 116.6822, lat: 23.3535 },
      { name: '佛山', lng: 113.1214, lat: 23.0218 },
      { name: '江门', lng: 113.0815, lat: 22.5789 },
      { name: '湛江', lng: 110.3594, lat: 21.2707 },
      { name: '茂名', lng: 110.9254, lat: 21.6629 },
      { name: '肇庆', lng: 112.4654, lat: 23.0471 },
      { name: '惠州', lng: 114.4161, lat: 23.1115 },
      { name: '梅州', lng: 116.1177, lat: 24.2991 },
      { name: '汕尾', lng: 115.3644, lat: 22.7744 },
      { name: '河源', lng: 114.7001, lat: 23.7434 },
      { name: '阳江', lng: 111.9822, lat: 21.8576 },
      { name: '清远', lng: 113.0560, lat: 23.6824 },
      { name: '东莞', lng: 113.7518, lat: 23.0205 },
      { name: '中山', lng: 113.3926, lat: 22.5176 },
      { name: '潮州', lng: 116.6223, lat: 23.6567 },
      { name: '揭阳', lng: 116.3728, lat: 23.5497 },
      { name: '云浮', lng: 112.0444, lat: 22.9298 },
    ],
  },
  // 广西壮族自治区
  {
    name: '广西',
    cities: [
      { name: '南宁', lng: 108.3200, lat: 22.8240 },
      { name: '柳州', lng: 109.4281, lat: 24.3264 },
      { name: '桂林', lng: 110.2903, lat: 25.2744 },
      { name: '梧州', lng: 111.2791, lat: 23.4769 },
      { name: '北海', lng: 109.1192, lat: 21.4819 },
      { name: '防城港', lng: 108.3544, lat: 21.6869 },
      { name: '钦州', lng: 108.6543, lat: 21.9671 },
      { name: '贵港', lng: 109.5989, lat: 23.1114 },
      { name: '玉林', lng: 110.1543, lat: 22.6314 },
      { name: '百色', lng: 106.6186, lat: 23.9020 },
      { name: '贺州', lng: 111.5522, lat: 24.4034 },
      { name: '河池', lng: 108.0853, lat: 24.6929 },
      { name: '来宾', lng: 109.2216, lat: 23.7503 },
      { name: '崇左', lng: 107.3649, lat: 22.3769 },
    ],
  },
  // 海南省
  {
    name: '海南省',
    cities: [
      { name: '海口', lng: 110.1999, lat: 20.0444 },
      { name: '三亚', lng: 109.5082, lat: 18.2479 },
      { name: '三沙', lng: 112.3489, lat: 16.8310 },
      { name: '儋州', lng: 109.5809, lat: 19.5175 },
      { name: '五指山', lng: 109.5168, lat: 18.7758 },
      { name: '琼海', lng: 110.4746, lat: 19.2461 },
      { name: '文昌', lng: 110.7539, lat: 19.6128 },
      { name: '万宁', lng: 110.3896, lat: 18.7962 },
      { name: '东方', lng: 108.6536, lat: 19.0958 },
    ],
  },
  // 四川省
  {
    name: '四川省',
    cities: [
      { name: '成都', lng: 104.0665, lat: 30.5723 },
      { name: '自贡', lng: 104.7734, lat: 29.3528 },
      { name: '攀枝花', lng: 101.7185, lat: 26.5821 },
      { name: '泸州', lng: 105.4432, lat: 28.8717 },
      { name: '德阳', lng: 104.3980, lat: 31.1270 },
      { name: '绵阳', lng: 104.6796, lat: 31.4678 },
      { name: '广元', lng: 105.8433, lat: 32.4352 },
      { name: '遂宁', lng: 105.5929, lat: 30.5327 },
      { name: '内江', lng: 105.0584, lat: 29.5801 },
      { name: '乐山', lng: 103.7656, lat: 29.5521 },
      { name: '南充', lng: 106.1106, lat: 30.8373 },
      { name: '眉山', lng: 103.8318, lat: 30.0483 },
      { name: '宜宾', lng: 104.6428, lat: 28.7523 },
      { name: '广安', lng: 106.6333, lat: 30.4564 },
      { name: '达州', lng: 107.4682, lat: 31.2094 },
      { name: '雅安', lng: 103.0421, lat: 29.9881 },
      { name: '巴中', lng: 106.7476, lat: 31.8672 },
      { name: '资阳', lng: 104.6278, lat: 30.1286 },
      { name: '阿坝', lng: 102.2214, lat: 31.8998 },
      { name: '甘孜', lng: 101.9638, lat: 30.0507 },
      { name: '凉山', lng: 102.2673, lat: 27.8816 },
    ],
  },
  // 贵州省
  {
    name: '贵州省',
    cities: [
      { name: '贵阳', lng: 106.6302, lat: 26.6477 },
      { name: '六盘水', lng: 104.8307, lat: 26.5934 },
      { name: '遵义', lng: 106.9273, lat: 27.7256 },
      { name: '安顺', lng: 105.9462, lat: 26.2533 },
      { name: '毕节', lng: 105.2851, lat: 27.3019 },
      { name: '铜仁', lng: 109.1896, lat: 27.7183 },
      { name: '黔西南', lng: 104.9063, lat: 25.0882 },
      { name: '黔东南', lng: 107.9829, lat: 26.5836 },
      { name: '黔南', lng: 107.5170, lat: 26.2582 },
    ],
  },
  // 云南省
  {
    name: '云南省',
    cities: [
      { name: '昆明', lng: 102.8329, lat: 24.8801 },
      { name: '曲靖', lng: 103.7961, lat: 25.4902 },
      { name: '玉溪', lng: 102.5277, lat: 24.3520 },
      { name: '保山', lng: 99.1671, lat: 25.1118 },
      { name: '昭通', lng: 103.7172, lat: 27.3380 },
      { name: '丽江', lng: 100.2330, lat: 26.8721 },
      { name: '普洱', lng: 100.9660, lat: 22.8254 },
      { name: '临沧', lng: 100.0892, lat: 23.8878 },
      { name: '楚雄', lng: 101.5461, lat: 25.0329 },
      { name: '红河', lng: 103.3756, lat: 23.3639 },
      { name: '文山', lng: 104.2165, lat: 23.3695 },
      { name: '西双版纳', lng: 100.7971, lat: 22.0017 },
      { name: '大理', lng: 100.2250, lat: 25.5894 },
      { name: '德宏', lng: 98.5784, lat: 24.4367 },
      { name: '怒江', lng: 98.8543, lat: 25.8509 },
      { name: '迪庆', lng: 99.7065, lat: 27.8269 },
    ],
  },
  // 西藏自治区
  {
    name: '西藏',
    cities: [
      { name: '拉萨', lng: 91.1409, lat: 29.6500 },
      { name: '日喀则', lng: 88.8849, lat: 29.2678 },
      { name: '昌都', lng: 97.1785, lat: 31.1369 },
      { name: '林芝', lng: 94.3624, lat: 29.6490 },
      { name: '山南', lng: 91.7665, lat: 29.2290 },
      { name: '那曲', lng: 92.0602, lat: 31.4760 },
      { name: '阿里', lng: 80.1055, lat: 32.5000 },
    ],
  },
  // 陕西省
  {
    name: '陕西省',
    cities: [
      { name: '西安', lng: 108.9402, lat: 34.3416 },
      { name: '铜川', lng: 108.9454, lat: 34.8966 },
      { name: '宝鸡', lng: 107.2378, lat: 34.3618 },
      { name: '咸阳', lng: 108.7089, lat: 34.3296 },
      { name: '渭南', lng: 109.5096, lat: 34.4994 },
      { name: '延安', lng: 109.4898, lat: 36.5853 },
      { name: '汉中', lng: 107.0230, lat: 33.0672 },
      { name: '榆林', lng: 109.7348, lat: 38.2852 },
      { name: '安康', lng: 109.0293, lat: 32.6903 },
      { name: '商洛', lng: 109.9180, lat: 33.8696 },
    ],
  },
  // 甘肃省
  {
    name: '甘肃省',
    cities: [
      { name: '兰州', lng: 103.8343, lat: 36.0611 },
      { name: '嘉峪关', lng: 98.2773, lat: 39.7865 },
      { name: '金昌', lng: 102.1877, lat: 38.5142 },
      { name: '白银', lng: 104.1389, lat: 36.5448 },
      { name: '天水', lng: 105.7249, lat: 34.5785 },
      { name: '武威', lng: 102.6378, lat: 37.9283 },
      { name: '张掖', lng: 100.4496, lat: 38.9259 },
      { name: '平凉', lng: 106.6849, lat: 35.5428 },
      { name: '酒泉', lng: 98.4941, lat: 39.7326 },
      { name: '庆阳', lng: 107.6433, lat: 35.7091 },
      { name: '定西', lng: 104.6260, lat: 35.5803 },
      { name: '陇南', lng: 104.9220, lat: 33.4003 },
      { name: '临夏', lng: 103.2108, lat: 35.5994 },
      { name: '甘南', lng: 102.9110, lat: 34.9864 },
    ],
  },
  // 青海省
  {
    name: '青海省',
    cities: [
      { name: '西宁', lng: 101.7782, lat: 36.6171 },
      { name: '海东', lng: 102.1028, lat: 36.5029 },
      { name: '海北', lng: 100.9010, lat: 36.9594 },
      { name: '黄南', lng: 102.0150, lat: 35.5177 },
      { name: '海南', lng: 100.6200, lat: 36.2863 },
      { name: '果洛', lng: 100.2420, lat: 34.4736 },
      { name: '玉树', lng: 97.0085, lat: 33.0040 },
      { name: '海西', lng: 97.3708, lat: 37.3771 },
    ],
  },
  // 宁夏回族自治区
  {
    name: '宁夏',
    cities: [
      { name: '银川', lng: 106.2309, lat: 38.4872 },
      { name: '石嘴山', lng: 106.3839, lat: 38.9842 },
      { name: '吴忠', lng: 106.1988, lat: 37.9976 },
      { name: '固原', lng: 106.2426, lat: 36.0160 },
      { name: '中卫', lng: 105.1965, lat: 37.5149 },
    ],
  },
  // 新疆维吾尔自治区
  {
    name: '新疆',
    cities: [
      { name: '乌鲁木齐', lng: 87.6168, lat: 43.8256 },
      { name: '克拉玛依', lng: 84.8739, lat: 45.5959 },
      { name: '吐鲁番', lng: 89.1841, lat: 42.9513 },
      { name: '哈密', lng: 93.5283, lat: 42.8333 },
      { name: '昌吉', lng: 87.3082, lat: 44.0114 },
      { name: '博尔塔拉', lng: 82.0748, lat: 44.9053 },
      { name: '巴音郭楞', lng: 86.1509, lat: 41.7641 },
      { name: '阿克苏', lng: 80.2651, lat: 41.1717 },
      { name: '克孜勒苏', lng: 76.1728, lat: 39.7134 },
      { name: '喀什', lng: 75.9891, lat: 39.4677 },
      { name: '和田', lng: 79.9253, lat: 37.1107 },
      { name: '伊犁', lng: 81.3179, lat: 43.9219 },
      { name: '塔城', lng: 82.9857, lat: 46.7463 },
      { name: '阿勒泰', lng: 88.1416, lat: 47.8484 },
      { name: '石河子', lng: 86.0411, lat: 44.3059 },
      { name: '阿拉尔', lng: 81.2859, lat: 40.5419 },
      { name: '图木舒克', lng: 79.0740, lat: 39.8673 },
      { name: '五家渠', lng: 87.5269, lat: 44.1674 },
      { name: '北屯', lng: 87.8083, lat: 47.3532 },
      { name: '铁门关', lng: 85.5014, lat: 41.8272 },
      { name: '双河', lng: 82.3535, lat: 44.8401 },
      { name: '可克达拉', lng: 80.9913, lat: 43.9448 },
      { name: '昆玉', lng: 79.2910, lat: 37.2094 },
      { name: '胡杨河', lng: 84.8275, lat: 44.6926 },
    ],
  },
  // 特别行政区
  {
    name: '港澳台',
    cities: [
      { name: '香港', lng: 114.1694, lat: 22.3193 },
      { name: '澳门', lng: 113.5439, lat: 22.1987 },
      { name: '台北', lng: 121.5654, lat: 25.0330 },
      { name: '高雄', lng: 120.3014, lat: 22.6273 },
      { name: '台中', lng: 120.6736, lat: 24.1477 },
      { name: '台南', lng: 120.2270, lat: 22.9998 },
      { name: '新北', lng: 121.4657, lat: 25.0120 },
      { name: '桃园', lng: 121.3010, lat: 24.9936 },
    ],
  },
];

// 生成扁平化的城市列表（用于搜索和下拉）
export const FLAT_CITY_LIST: Array<CityInfo & { province: string }> = PROVINCE_CITY_DATA.flatMap(
  (province) =>
    province.cities.map((city) => ({
      ...city,
      province: province.name,
    }))
);

// 生成城市名到城市信息的映射（用于快速查找）
export const CITY_MAP: Record<string, CityInfo & { province: string }> = FLAT_CITY_LIST.reduce(
  (acc, city) => {
    acc[city.name] = city;
    return acc;
  },
  {} as Record<string, CityInfo & { province: string }>
);

// 获取城市信息
export function getCityInfo(cityName: string): (CityInfo & { province: string }) | undefined {
  return CITY_MAP[cityName];
}

// 搜索城市（支持模糊匹配）
export function searchCities(keyword: string): Array<CityInfo & { province: string }> {
  if (!keyword) return [];
  return FLAT_CITY_LIST.filter(
    (city) => city.name.includes(keyword) || city.province.includes(keyword)
  );
}
