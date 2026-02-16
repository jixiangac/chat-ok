// @ts-nocheck
import axios from 'axios';

import dayjs from 'dayjs';

import {
    Space,
    SpinLoading,
    List,
    Image,
    Tag,
    Result,
    Toast,
    ImageViewer,
    Form,
    Input,
    Button,
    CapsuleTabs,
    Selector
} from 'antd-mobile';

import { SmileOutline, RedoOutline, MailOpenOutline } from 'antd-mobile-icons';

import localforage from 'localforage';

import styles from './index.module.css';

import { useEffect, useState } from 'react';
import { saveUuid, setPageInfo, getPageInfo } from '@/utils';

import { imagelist } from './image';

import AITrend from './aitrend';

// const prefix = location.href.indexOf('localhost') !== -1 ? '' : 'https://api.jixiang.chat';
const prefix = 'https://api.jixiang.chat';

// zScore 筛选阈值常量
const ZSCORE_THRESHOLD = 2.31;
// t234

const copyToClip = (url?: string) => {
  if ( !url ) {
    return false;
  }
  // 复制地址栏链接到剪贴板
  const share = document.createElement('input');
  share.setAttribute('value', url || '');
  document.body.appendChild(share);
  share.select();
  document.execCommand('copy');
  document.body.removeChild(share);
  return true;
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const timeMap = {
  '1H': '1小时K线',
  '30m': '30分钟K线'
};


const demoImages = [
  'https://gw.alicdn.com/imgextra/i4/O1CN01AVuksB1Iz6H9dux5y_!!6000000000963-0-tps-592-1280.jpg',
  'https://gw.alicdn.com/imgextra/i4/O1CN01m3GgVl1aa3hiq3Gei_!!6000000003345-0-tps-592-1280.jpg'
];

const ALGO_INTRO = {
    'dea-cross-upper-diff-long': 'MACD DEA线指标『金叉』，并且币价处于布林带『上轨』位置，可大概率做多',
    'dea-cross-upper-diff-short': 'MACD DEA线指标『死叉』，但整体币价仍处于『上轨』区间，有一定概率可做空',
    'dea-cross-lower-diff-long': 'MACD DEA线指标『金叉』，但整体币价仍处于『下轨』区间，有一定概率做多',
    'dea-cross-lower-diff-short': 'MACD DEA线指标『死叉』，并且币价处于布林带『下轨』位置，可大概率做空',
    'macd-sticks-1-beili': 'MACD指标进入背离，处于第一个反转信号',
    'macd-sticks-2-beili': 'MACD指标进入背离，处于第二个反转信号',
    'macd-sticks-3-beili': 'MACD指标进入背离，处于第三个反转信号',
    'macd-cross-diff-long': '12日EMA均线『金叉』, 有一定概率可做多',
    'macd-cross-diff-short': '12日EMA均线『死叉』,有一定概率可做空',
    'td13': '当前处于迪马克指标13的位置，迪马克指标13意味着行情有较大可能反转',
    'td9': '当前处于迪马克指标9的位置，迪马克指标9意味着行情有一定可能反转',
    'boll': '处于布林带的上下轨位置，趋势有一定趋势延续性',
    'DEA': '处于DEA线的上下位置，趋势有一定趋势延续性',
    'trend_reverse_short': 'reverse_short，摸顶指标，大概率要下跌',
    'trend_reverse_long': 'reverse_long，摸底指标，大概率要上涨'
  };


let clickIns = 0;
let payClickIns = 0;

let PAY_COUNTS = 0;

const AlgoList = (props)=>{


    const today = dayjs();
    const now_today = today.format('YYYY/MM/DD');
    
    const [count, setCount] = useState(0);

    const [paycount, setPayCount] = useState(0);
    
    const [enableZScoreFilter, setEnableZScoreFilter] = useState(false);

    const [starFilter, setStarFilter] = useState([]);

    const [bollFilter, setBollFilter] = useState([]);

    const [searchKeyword, setSearchKeyword] = useState('');

    const [show, setShow] = useState(false);

    const [operationMode, setOperationMode] = useState(false);

    const [payLoading, setPayLoading] = useState(false);

    const [form] = Form.useForm();

    const [app, setApp] = useState({
        isLoading: true,
        loaded: false,
        time: '',
        data: [],
        needPay: false,
    });

    const {
      info
    } = props;

    // 计算策略持续小时数
    const calculateHours = (gmt_modified) => {
        const now = dayjs();
        const modifiedTime = dayjs(gmt_modified);
        return now.diff(modifiedTime, 'hour');
    };

    // 根据 z_score 获取等级和标签
    const getZScoreLevel = (zScore) => {
        const score = Math.abs(Number(zScore));
        if (score >= 3.0) return { level: 10, label: '5星', color: '#722ed1' };
        if (score >= 2.7) return { level: 9, label: '4星', color: '#9254de' };
        if (score >= 2.5) return { level: 8, label: '3星', color: '#b37feb' };
        if (score >= 2.3) return { level: 7, label: '2星', color: '#d3adf7' };
        if (score >= 2.2) return { level: 6, label: '1星', color: '#efdbff' };
        return { level: 0, label: '0星', color: '#1677ff' };
    };

    // Z分数星级选项
    const starOptions = [
        { label: '5星', value: '5' },
        { label: '4星', value: '4' },
        { label: '3星', value: '3' },
        { label: '2星', value: '2' },
        { label: '1星', value: '1' },
    ];

    // 布林带星级选项
    const bollOptions = [
        { label: '5星', value: '5' },
        { label: '4星', value: '4' },
        { label: '2星', value: '2' },
        { label: '1星', value: '1' },
        { label: '0星', value: '0' },
    ];


    const onAddAITrend = async (ifo) => {
        const post_values = {
          name: `${ifo.inst_id}`,
          pos_side: `${ifo.pos_side}`,
          // lastprice: ifo.pos_side === 'long' ? ifo.lastprice
        }

        try{
           let price = JSON.parse(ifo.last_price);
           post_values.lastprice = post_values.pos_side === 'long' ? price * (1+0.1) : price * (1-0.1);
        }catch(e){
          Toast.show({
            icon: 'fail',
            content: '出错了',
          });
          return;
        }
        // if ( post_values.pos_side === 'long' ) {
        //   post_values.lastprice
        // }
        // const res = await axios(`https://newdemo.jixiang.chat/proxyhttp?apitype=aitrend&apitag=CHATGPT`, {
        //     method: 'get',
        //     params: {
        //         type: 'add',
        //         ins_id,
        //         trend: '1'
        //     },
        // });
        // if (res.data.success) {
        //     Toast.show({
        //         icon: 'success',
        //         content: `已加入AI趋势: ${alias}`
        //     });
        // }
    }

    const initPayCounts = async ()=>{
      if ( !getPageInfo('left_usdt') ) {
        setPageInfo('left_usdt', 1);
        if ( info.left_usdt !== undefined ) {
          setPayCount(info.left_usdt || 0);
          PAY_COUNTS = info.left_usdt || 0;
          await localforage.setItem('pay_counts', JSON.stringify({
            count: PAY_COUNTS
          }));
        }
      } else {
        const onedatas: any = await localforage.getItem('pay_counts');
        if ( onedatas ) {
          const datas = JSON.parse(onedatas);
          setPayCount(datas.count || 0);
          PAY_COUNTS = datas.count || 0;
        } 
      }
    };

    const initCounts = async ()=>{
      const onedatas: any = await localforage.getItem('rtime_counts');

      const initDefaultCounts = async (refresh: boolean)=>{
        let default_counts = refresh ? 11 : (info.today_usdt || 0);

        if ( location.href.indexOf('jiyang') !==-1 ) {
          default_counts = 10000;
        }

        if ( info.gmt_update ) {
          await saveUuid({
            gmt_update: 'null'
          });
        }

        if ( default_counts <= 0 && PAY_COUNTS <= 0 ) {
          setApp({
            isLoading: false,
            loaded: true,
            time: '',
            data: [],
            needPay: true
           });
          return;
        }

        await localforage.setItem('rtime_counts', JSON.stringify({
          count: default_counts,
          date: now_today
        }));
        if ( refresh ) {
          await saveUuid({
            today_usdt: default_counts
          });
        }
        setCount(default_counts);
        fetchData(false, default_counts);
      }

      if ( onedatas ) {
        const datas = JSON.parse(onedatas);

        if ( datas.date !== now_today ) {
          await initDefaultCounts(true);
        } else if ( info.gmt_update ) {
          await initDefaultCounts(false);
        } else {
          if ( !getPageInfo('today_usdt') ) {
            setPageInfo('today_usdt', 1);
            setCount(info.today_usdt || datas.count);
            fetchData(false, info.today_usdt || datas.count);
          } else {
            setCount(datas.count);
            fetchData(false, datas.count);
          }
        }
      } else {
        await initDefaultCounts(false);
      }
    };

    const fetchData = async (flag?: boolean, counts?: number)=>{

        const adatas: any = await localforage.getItem('rtime');

        const dconfirm = counts !== undefined ? counts === 0 && PAY_COUNTS === 0 : count === 0 && paycount === 0;

        if ( dconfirm ) {
          setApp({
            isLoading: false,
            loaded: true,
            time: '',
            data: [],
            needPay: true
           });
          return;
        }

        if ( flag ) {
          setApp({
            isLoading: true,
            loaded: false,
            time: '',
            data: [],
            needPay: false
          });
        }

        if ( !flag && adatas ) {
           try{
             const datas = JSON.parse(adatas);
             const beforeTime = new Date(datas.time).getTime();
             const nowTime = new Date().getTime();
             const diffTime = nowTime - beforeTime;
             const compareTime = 30*60*1000;
            //  const compareTime = 10;
             if ( diffTime < compareTime ) {
               setApp({
                isLoading: false,
                loaded: true,
                time: datas.time,
                data: datas.onelist.concat(datas.twolist),
                needPay: false
               });
               return;
             }

           }catch(e){}
        }

        const res = await axios(`https://newdemo.jixiang.chat/proxyhttp?apitype=recent-algo&apitag=CHATGPT`, {
            method: 'get'
        });

        // tis

        if ( res?.data?.success ) {
           const pdatas = res?.data?.data;

           // 获取pdatas.xlist里的，以逗号分隔 ins_id（去重），然后请求batch-algo-settings API
           const instIds = [...new Set(pdatas.xlist.map((item: any) => item.ins_id))].join(',');
           console.log(instIds,'instIds')
           let algoSettingsMap: Record<string, any> = {};

           // 缓存键名和过期时间（30分钟）
           const ALGO_CACHE_KEY = 'algo_settings_cache';
           const CACHE_EXPIRY_MS = 30 * 60 * 1000;

           try {
             // 尝试从缓存获取
             const cachedData: any = await localforage.getItem(ALGO_CACHE_KEY);
             if (cachedData) {
               const { data, timestamp } = JSON.parse(cachedData);
               const isExpired = Date.now() - timestamp > CACHE_EXPIRY_MS;
               if (!isExpired && data) {
                 console.log('Using cached algo settings');
                 algoSettingsMap = data;
               } else {
                 // 缓存过期，重新请求
                 const algoRes = await axios(`https://newdemo.jixiang.chat/proxyhttp?apitag=CHATGPT&apitype=batch-algo-settings&instIds=${encodeURIComponent(instIds)}`, {
                   method: 'get'
                 });
                 if (algoRes?.data?.success) {
                   algoSettingsMap = algoRes.data.data || {};
                   // 存入缓存
                   await localforage.setItem(ALGO_CACHE_KEY, JSON.stringify({
                     data: algoSettingsMap,
                     timestamp: Date.now()
                   }));
                 }
               }
             } else {
               // 无缓存，请求 API
               const algoRes = await axios(`https://newdemo.jixiang.chat/proxyhttp?apitag=CHATGPT&apitype=batch-algo-settings&instIds=${encodeURIComponent(instIds)}`, {
                 method: 'get'
               });
               if (algoRes?.data?.success) {
                 algoSettingsMap = algoRes.data.data || {};
                 // 存入缓存
                 await localforage.setItem(ALGO_CACHE_KEY, JSON.stringify({
                   data: algoSettingsMap,
                   timestamp: Date.now()
                 }));
               }
             }
           } catch (e) {
             console.error('Failed to fetch algo settings:', e);
           }

           // 计算布林带强弱星级
           // 逻辑:
           // 1. 1H/4H/1D 标记的方向和 pos_side 一样（全部一致），则是 5星
           // 2. 如果 1H/4H 一致，标记 4星
           // 3. 如果和 4H 不一致，和 1D 一致，2星
           // 4. 如果只和 1H 一致，标记 1星
           // 5. 否则 0星
           const calcBollStrength = (posSide: string, algoSettings: any): number => {
             if (!algoSettings) return 0;

             const side1H = algoSettings['1H']?.side;
             const side4H = algoSettings['4H']?.side;
             const side1D = algoSettings['1D']?.side;

             const match1H = side1H === posSide;
             const match4H = side4H === posSide;
             const match1D = side1D === posSide;

             // 全部一致：5星
             if (match1H && match4H && match1D) return 5;
             // 1H和4H一致：4星
             if (match1H && match4H) return 4;
             // 和4H不一致，和1D一致：2星
             if (!match4H && match1D) return 2;
             // 只和1H一致：1星
             if (match1H && !match4H && !match1D) return 1;
             // 否则0星
             return 0;
           };

           // 将布林带强弱数据合并到 xlist
           const enrichedXlist = pdatas.xlist.map((item: any) => {
             const algoData = algoSettingsMap[item.ins_id];
             const bollStrength = calcBollStrength(item.pos_side, algoData?.algo_settings);
             return {
               ...item,
               boll_strength: bollStrength,
               algo_data: algoData
             };
           });

           await localforage.setItem('rtime', JSON.stringify({ ...pdatas, xlist: enrichedXlist }));
           setApp({
            isLoading: false,
            loaded: true,
            time: pdatas.time,
            data: enrichedXlist,
            needPay: false
           });
           if ( counts !== undefined && counts !== 0 || count !== 0 ) {
             const left_counts = counts !== undefined ? (counts - 1) : (count - 1);
             await localforage.setItem('rtime_counts', JSON.stringify({
               date: now_today,
               count: left_counts
             }));
             await saveUuid({
               today_usdt: left_counts
             });
             setCount(left_counts);
           } else if ( PAY_COUNTS !== -1 && PAY_COUNTS > 0 || paycount !== 0 ) {
             const left_pay_counts = PAY_COUNTS !== -1 ? PAY_COUNTS - 1 : paycount - 1;
             await localforage.setItem('pay_counts', JSON.stringify({
              count: left_pay_counts
             }));
             await saveUuid({
              left_usdt: left_pay_counts
             });
             PAY_COUNTS = -1;
             setPayCount(left_pay_counts);
           }
           
        } else {
          setApp({
            isLoading: false,
            loaded: true,
            time: '',
            data: [],
            needPay: false
           });
        }
    }

    const checkErros = async (flag?: boolean)=>{

      let errTititle = '';
      try{
        await form.validateFields();
      }catch(e) {
        if ( e?.errorFields.length ) {
          for ( let i = 0, len = e?.errorFields.length; i < len ; i ++ ) {
            const target = e?.errorFields[i];
            if ( target.errors.length ) {
              errTititle = target.errors[0];
              break;
            }
          }
        }
      }
      
      if ( flag && errTititle ) {
        Toast.show({
          icon: 'fail',
          content: errTititle,
        });
      }
      return errTititle;
    }

    const onPay = async ()=>{

      if ( payClickIns === 0 ) {
          payClickIns = new Date().getTime();
      } else {
          const now = new Date().getTime();
          const dif = now - payClickIns;
          if ( dif < 10*1000 ) {
            Toast.show({
              icon: 'fail',
              content: `提交过于频繁, ${Math.ceil(dif/1000)}S后再试试`
            });
            return;
          }
      }

      setPayLoading(true);
      const error = await checkErros(true);
      if ( error ) {
        setPayLoading(false);
        return;
      }
      const values = form.getFieldsValue();
      const res = await axios(`${prefix}/api/btc/list?apitype=getDepositHistory&apitag=CHATGPT`, {
          method: 'get',
          params: {
            from: values.account,
            removeOld: true
          },
      });

      if ( res?.data?.success && res?.data?.data?.length ) {

        let usdts = 0;
        let caches_hash = [];

        const dep_list = res?.data?.data || [];

        for ( let i = 0, len = dep_list.length; i < len; i ++ ) {
          usdts += (dep_list[i].amt - 0);
          caches_hash.push(
            `${dep_list[i].txId}`
          );
        }

        try{
          if ( caches_hash.length ) {
            await axios(`${prefix}/api/btc/list?apitype=saveDepositHash`, {
              method: 'get',
              params: {
                datas: caches_hash.join(',')
              },
            });
          }
        }catch(e){}
      
        let xcounts = Math.ceil(usdts/0.1);
        await localforage.setItem('pay_counts', JSON.stringify({
          caches_hash: caches_hash,
          count: xcounts
        }));
        await saveUuid({
          left_usdt: xcounts
        });
        PAY_COUNTS = xcounts;
        clickIns = 0;
        setPayCount(xcounts);
        props.onChange && props.onChange({
          left_usdt: xcounts,
          today_usdt: 0
        });
        setApp({
          ...app || {},
          needPay: false,
        });
      } else {
        Toast.show({
          icon: 'fail',
          content: `没有收到${values.account}的转账信息`
        });
      }
      setPayLoading(false);
    };

    useEffect(()=>{
      const init = async ()=>{
        await initPayCounts();
        await initCounts();
      };
      init();
    }, []);


    if ( app.isLoading ) {
      return <>
                <div style={{marginTop: 140}} />
                <Space justify='center' block>
                <SpinLoading color='primary' />
                </Space>
            </>
    }


    const cons: any = [];

    if ( !app.needPay ) {
      cons.push(
        <div className={styles.wraptime}>
            最近更新时间：{app.time ? dayjs(app.time).format('YYYY-MM-DD HH:mm:ss') : ''}
            <span onClick={()=>{
              if ( clickIns === 0 ) {
                  clickIns = new Date().getTime();
                  fetchData(true);
              } else {
                  const now = new Date().getTime();
                  const dif = now - clickIns;
                  if ( dif < 900000 ) {
                    Toast.show({
                      icon: 'fail',
                      content: '刷新过于频繁，5分钟后再试试'
                    });
                  } else {
                    fetchData(true);
                  }
              }
            }}><RedoOutline style={{marginLeft: 20}}/><span style={{fontSize: 10}}>刷新</span></span>
        </div>
      );

      const tabList = [{
        title: '全部',
        taglist: []
      },{
        title: '主流币',
        taglist: ['BTC-USDT-SWAP', 'ETH-USDT-SWAP', 'ADA-USDT-SWAP', 'SOL-USDT-SWAP']
      },
      // ,{
      //   title: '大概率下跌',
      //   taglist: ['reverse_short', 'reverse_start_short']
      // },{
      //   title: '大概率上涨',
      //   taglist: ['reverse_long', 'reverse_start_long']
      // },
      {
        title: '看多',
        taglist: ['long']
      },{
        title: '看空',
        taglist: ['short']
      }];

      if ( location.href.indexOf('jiyang') !==-1 ) {
         tabList.push({
            title: 'AI趋势',
            taglist: []
         });
      }

      let long = 0, short = 0;
      
      (app?.data||[]).forEach(item=>{
         // 如果开启了 zScore 筛选，先检查 zScore 条件
         if (enableZScoreFilter && item.z_score) {
           const zScoreValue = Math.abs(Number(item.z_score));
           if (zScoreValue <= ZSCORE_THRESHOLD) {
             return; // 跳过 zScore 绝对值小于等于 2.31 的数据
           }
         }
         
         // 如果开启了星级筛选，检查星级条件
         if (starFilter.length > 0 && item.z_score) {
           const zScoreInfo = getZScoreLevel(item.z_score);
           const starLevel = zScoreInfo.label;
           if (!starFilter.includes(starLevel.replace('星', ''))) {
             return; // 跳过不符合星级筛选条件的数据
           }
         }
         
         if ( item.pos_side === 'long' ) {
           long ++;
         }
         if ( item.pos_side === 'short' ) {
           short ++;
         }
      });

      let xcon = [];

      if ( long > 0 || short > 0 || enableZScoreFilter || starFilter.length > 0 ) {
         xcon.push(
            <p>
              <span style={{marginLeft: '20px'}}>多：{long}</span>
              <span style={{marginLeft: '10px'}}>空：{short}</span>
              <span style={{marginLeft: '20px'}}>{
                long > short ? '当前上涨的币种较多' : '当前下跌的币种较多'
              }</span>
              {/* {enableZScoreFilter && (
                <span style={{marginLeft: '20px', color: '#1677ff', fontSize: 12}}>
                  (已筛选 |zScore| &gt; {ZSCORE_THRESHOLD})
                  </span>
              )} */}
              <span style={{marginLeft: '20px'}}>
                <Button 
                  size='mini' 
                  color={enableZScoreFilter ? 'primary' : 'default'}
                  onClick={() => setEnableZScoreFilter(!enableZScoreFilter)}>
                  {enableZScoreFilter ? '关闭筛选' : '开启筛选'}
                </Button>
              </span>
            </p>
         );

         xcon.push(
          <p style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginLeft: '20px'}}>
            {/* 搜索框 */}
            <span style={{display: 'inline-flex', alignItems: 'center', gap: '5px'}}>
              <Input
                placeholder="搜索币种"
                value={searchKeyword}
                onChange={(val) => setSearchKeyword(val)}
                style={{width: '120px', fontSize: '12px'}}
                clearable
              />
            </span>
            {/* Z星级下拉 */}
            <span style={{display: 'inline-flex', alignItems: 'center', gap: '5px'}}>
              <select
                value={starFilter[0] || ''}
                onChange={(e) => {
                  setStarFilter(e.target.value ? [e.target.value] : []);
                }}
                style={{
                  padding: '4px 8px',
                  fontSize: '12px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  background: '#fff'
                }}
              >
                <option value="">Z星级</option>
                {starOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </span>
            {/* 布林带下拉 */}
            <span style={{display: 'inline-flex', alignItems: 'center', gap: '5px'}}>
              <select
                value={bollFilter[0] || ''}
                onChange={(e) => {
                  setBollFilter(e.target.value ? [e.target.value] : []);
                }}
                style={{
                  padding: '4px 8px',
                  fontSize: '12px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  background: '#fff'
                }}
              >
                <option value="">布林带</option>
                {bollOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </span>
            {/* 清空按钮 */}
            {(starFilter.length > 0 || bollFilter.length > 0 || searchKeyword) && (
              <Button
                size='mini'
                color='default'
                onClick={() => {
                  setStarFilter([]);
                  setBollFilter([]);
                  setSearchKeyword('');
                }}>
                清空
              </Button>
            )}
            {location.href.indexOf('jiyang') !==-1 ? <span style={{marginLeft: '8px'}}>
                <Button
                    size='mini'
                    color={operationMode ? 'danger' : 'default'}
                    onClick={() => setOperationMode(!operationMode)}>
                    {operationMode ? '退出操作' : '操作模式'}
                </Button>
            </span> : null}
          </p>
         )
      }

      let xindex = 0;
      const x_tabList = tabList.map((item, index)=>{
        const targetList = (app?.data||[]).filter(it=>{
          // 模糊搜索 ins_id
          if (searchKeyword) {
            const keyword = searchKeyword.toLowerCase();
            const insId = (it.inst_id || it.ins_id || '').toLowerCase();
            if (!insId.includes(keyword)) {
              return false; // 过滤掉不匹配搜索关键词的数据
            }
          }

          // 如果开启了 zScore 筛选，先检查 zScore 条件
          if (enableZScoreFilter && it.z_score) {
            const zScoreValue = Math.abs(Number(it.z_score));
            if (zScoreValue <= ZSCORE_THRESHOLD) {
              return false; // 过滤掉 zScore 绝对值小于等于 2.31 的数据
            }
          }

          // 如果开启了星级筛选，检查星级条件
          if (starFilter.length > 0 && it.z_score) {
            const zScoreInfo = getZScoreLevel(it.z_score);
            const starLevel = zScoreInfo.label;
            if (!starFilter.includes(starLevel.replace('星', ''))) {
              return false; // 过滤掉不符合星级筛选条件的数据
            }
          }

          // 如果开启了布林带星级筛选，检查布林带条件
          if (bollFilter.length > 0) {
            const bollStrength = it.boll_strength ?? 0;
            if (!bollFilter.includes(String(bollStrength))) {
              return false; // 过滤掉不符合布林带星级筛选条件的数据
            }
          }

          if ( item.title === '全部' ) {
            return true;
          }
          if ( item.title === '主流币'&& item.taglist.indexOf(it.ins_id) !== -1 ) {
              return true;
          }
          if ( item.title === '大概率下跌' && (it.algo.indexOf(item.taglist[0]) !== -1 || it.algo.indexOf(item.taglist[1]) !== -1) ) {
            return true;
          }
          if ( item.title === '大概率下跌' && (it.algo.indexOf(item.taglist[0]) !== -1 || it.algo.indexOf(item.taglist[1]) !== -1) ) {
            return true;
          }
          if ( item.title === '看多' && it.pos_side === 'long' ) {
            return true;
          }
          if ( item.title === '看空' && it.pos_side === 'short' ) {
            return true;
          }
          return false;
        })
        // 按照持续时间从少到多排序
        item.list = targetList.sort((a, b) => {
          const hoursA = calculateHours(a.gmt_modified);
          const hoursB = calculateHours(b.gmt_modified);
          return hoursA - hoursB;
        });
        if ( xindex === 0 && targetList.length ) {
           xindex = index;
        }
        return item;
      });

      cons.push(
         <div 
            className={styles.wraplist}
            style={{
                // maxHeight: document.documentElement.clientHeight - 350,
                overflowY: 'auto',
                margin: '10px 20px'
            }}>
              {xcon}
              {
                !(app?.data||[]).length ? <Result
                icon={<SmileOutline />}
                status='success'
                title='充值成功'
                description='刷新一下试试吧'
              /> : null
              }
              <CapsuleTabs defaultActiveKey={`${xindex}`}>
                {
                  x_tabList.map((item, index)=>{
                    return <CapsuleTabs.Tab title={item.title} key={index} destroyOnClose>
                              <div>
                                  {
                                    item.title !== 'AI趋势' && !item.list.length ? 
                                    <Result
                                        icon={<SmileOutline />}
                                        status='success'
                                        title='暂无数据'
                                        description={<p>还没有命中的指标，再等等吧</p>}
                                      />: null
                                  }
                                  {
                                    item.title === 'AI趋势' ? 
                                    <AITrend />
                                    : null
                                  }
                                  {item.list.map((user: any, index) => {
                                      const hours = calculateHours(user.gmt_modified);

                                      let zScoreList = [];
                                      
                                      try{
                                        zScoreList = JSON.parse(user?.z_score_history || '{}').list
                                      }catch(e){}
                                      
                                      return (
                                          <div key={index} style={{
                                              backgroundColor: '#fff',
                                              padding: '12px 16px',
                                              borderBottom: '1px solid #f0f0f0',
                                              position: 'relative'
                                          }}>
                                              {/* 头像、币种名称和持续小时数在同一行 */}
                                              <div style={{
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  marginBottom: 8
                                              }}>
                                                  {/* 左侧头像 */}
                                                  <div className={styles.listicon} style={{ marginRight: 12 }}>
                                                      <Image
                                                          src={imagelist[user.ins_id]?.img}
                                                          style={{ borderRadius: 20 }}
                                                          fit='cover'
                                                          width={32}
                                                          height={32}
                                                      />
                                                  </div>

                                                  {/* 中间币种名称 */}
                                                  <div style={{
                                                      flex: 1,
                                                      fontSize: 14,
                                                    //   fontWeight: 'bold',
                                                      color: '#333'
                                                  }}>
                                                      {user.ins_id.replace('-USDT-SWAP', '')}<span className={styles.desx}>( {imagelist[user.ins_id]?.alias} )</span>
                                                  </div>

                                                  {/* 右侧持续小时数 */}
                                                  <div style={{
                                                      fontSize: 11,
                                                      color: '#999',
                                                      display: 'flex',
                                                      alignItems: 'center'
                                                  }}>
                                                      {operationMode ? (
                                                          <Button 
                                                              size='mini' 
                                                              color='primary'
                                                              onClick={() => {
                                                                  onAddAITrend(user)
                                                              }}>
                                                              加入AI趋势
                                                          </Button>
                                                      ) : (
                                                          <span>{hours}小时</span>
                                                      )}
                                                  </div>
                                              </div>

                                              {/* 描述信息 */}
                                              <div className={styles.defs}>
                                                  <p>
                                                      {user?.z_score && (() => {
                                                          // 根据 pos_side 调整 z_score 的正负号
                                                          const adjustedZScore = user.pos_side === 'long' ? 
                                                              Number(user.z_score) : -Number(user.z_score);
                                                          // 使用调整后的 z_score 计算等级
                                                          const zScoreInfo = getZScoreLevel(adjustedZScore);
                                                          // 检查是否为测试版（绝对值小于阈值）
                                                          const isTestVersion = Math.abs(Number(user.z_score)) <= ZSCORE_THRESHOLD;
                                                          return (
                                                          <>
                                                              <label>Z分数：</label>
                                                              <span style={{color: '#666', fontSize: 12, marginRight: 8}}>
                                                                  {adjustedZScore.toFixed(4)}
                                                              </span>
                                                              <Tag color={zScoreInfo.color} fill='outline'>
                                                                  {zScoreInfo.label}
                                                              </Tag>
                                                              {isTestVersion && (
                                                                  <Tag color='#faad14' fill='outline' style={{marginLeft: 4}}>
                                                                      测试版
                                                                  </Tag>
                                                              )}
                                                          </>
                                                          );
                                                      })()}
                                                  </p>
                                                  <p>
                                                      <label>方向：</label>
                                                      <Tag color={user.pos_side === 'long' ? 'danger' : '#87d068'} fill='outline'>
                                                        {user.pos_side === 'long' ? '做多' : '做空'}
                                                      </Tag>
                                                  </p>
                                                  <p>
                                                      <label>布林带：</label>
                                                      {(() => {
                                                          const strength = user.boll_strength ?? 0;
                                                          const starColors = {
                                                              5: '#ff4d4f', // 红色 - 最强
                                                              4: '#fa8c16', // 橙色
                                                              3: '#fadb14', // 黄色
                                                              2: '#52c41a', // 绿色
                                                              1: '#1890ff', // 蓝色
                                                              0: '#d9d9d9'  // 灰色 - 最弱
                                                          };
                                                          const algoSettings = user.algo_data?.algo_settings;
                                                          const side1H = algoSettings?.['1H']?.side;
                                                          const side4H = algoSettings?.['4H']?.side;
                                                          const side1D = algoSettings?.['1D']?.side;
                                                          const getSideSpan = (side: string, label: string) => {
                                                              const hasDirection = side === 'long' || side === 'short';
                                                              const text = side === 'long' ? '多' : side === 'short' ? '空' : '无';
                                                              return (
                                                                  <span style={hasDirection ? {borderBottom: '1px dashed #999'} : {}}>
                                                                      {label}:{text}
                                                                  </span>
                                                              );
                                                          };
                                                          return (
                                                              <>
                                                                  <Tag color={starColors[strength]} fill='outline'>
                                                                      {strength}星
                                                                  </Tag>
                                                                  {strength > 0 && (
                                                                      <span style={{marginLeft: 8, fontSize: 11, color: '#999'}}>
                                                                          {getSideSpan(side1H, '1H')} / {getSideSpan(side4H, '4H')} / {getSideSpan(side1D, '1D')}
                                                                      </span>
                                                                  )}
                                                              </>
                                                          );
                                                      })()}
                                                  </p>
                                                  <p>
                                                      <label>次数：</label>
                                                      <span style={{fontWeight: 'normal', color: '#999'}}>{user?.count || '0'}</span>
                                                  </p>
                                                  {zScoreList && zScoreList.length > 1 && (
                                                      <p>
                                                          <label>Z历史：</label>
                                                          <span style={{fontWeight: 'normal', color: '#999'}}>
                                                              {zScoreList.map((score, idx) => (
                                                                  <span key={idx} style={{marginRight: '8px', display: 'inline-flex', alignItems: 'center'}}>
                                                                      <span>{Number(score).toFixed(4)}</span>
                                                                      {idx > 0 && (() => {
                                                                          const current = Number(score);
                                                                          const previous = Number(zScoreList[idx - 1]);
                                                                          const diff = current - previous;
                                                                          if (Math.abs(diff) < 0.0001) return null; // 变化太小不显示
                                                                          return (
                                                                              <span style={{
                                                                                  marginLeft: '2px',
                                                                                  color: diff > 0 ? '#f5222d' : '#52c41a',
                                                                                  fontSize: '10px'
                                                                              }}>
                                                                                  {diff > 0 ? '▲' : '▼'}
                                                                              </span>
                                                                          );
                                                                      })()}
                                                                      {idx < zScoreList.length - 1 && <span style={{marginLeft: '2px'}}>, </span>}
                                                                  </span>
                                                              ))}
                                                          </span>
                                                      </p>
                                                  )}
                                              </div>
                                          </div>
                                      );
                                  })}
                              </div>
                          </CapsuleTabs.Tab>
                  })
                }
              </CapsuleTabs>
            </div>
      );
      cons.push(
        <div className={styles.wrapdiscord}>
              <p style={{color: '#999'}}>本日免费使用次数剩余：<b style={{fontSize: 14, margin: '0 5px'}}>{count > 0 ? count : 0}</b> 次</p>
              {
                paycount ?
                <p style={{color: '#999'}}>充值次数剩余：<b style={{fontSize: 14, margin: '0 5px'}}>{paycount}</b> 次</p> : null
              }
              <p>加入Discord频道：<a onClick={()=>{
                   ImageViewer.Multi.show({ images: demoImages })
              }}>(频道示例点此查看)</a></p>
              <p><a href="https://discord.gg/8UPC9Hj5Mr" target="_blank">https://discord.gg/8UPC9Hj5Mr</a>，免费实时策略提醒</p>
            </div>
      );
    } else {

      if ( !show ) {
        cons.push(
          <Result
            icon={<SmileOutline />}
            status='success'
            title='今日免费次数已用尽，明天再来吧'
            description={<p>付费增加永久使用次数，0.1U = 1次，<a onClick={()=>{setShow(true)}}>点此充值</a></p>}
          />
        );
        cons.push(
          <div className={styles.wrapdiscord}>
            <p style={{color: '#999'}}>本日免费使用次数剩余：<b style={{fontSize: 14, margin: '0 5px'}}>0</b> 次</p>
      
            <p>加入Discord频道：<a onClick={()=>{
                  ImageViewer.Multi.show({ images: demoImages })
            }}>(频道示例点此查看)</a></p>
            <p><a href="https://discord.gg/8UPC9Hj5Mr" target="_blank">https://discord.gg/8UPC9Hj5Mr</a>，推送实时策略提醒</p>
          </div>
        );
      } else {
        cons.push(
          <div 
              className={styles.wraplidst}
              style={{
                  // maxHeight: document.documentElement.clientHeight - 300,
                  overflowY: 'auto',
                  margin: '10px 20px'
              }}>
            <Form
                name='form'
                form={form}
                  footer={
                  <Button 
                    onClick={onPay}
                    loading={payLoading}
                    block 
                    type='submit' 
                    color='primary' 
                    size='large'>
                      我已转账，进行验证
                  </Button>
                  }>
              <Form.Item label='转入账号'>
                <p>1251223923@qq.com（<span onClick={()=>{
                  if ( copyToClip('1251223923@qq.com') ) {
                    Toast.show({
                      icon: 'success',
                      content: '复制成功'
                    });
                  }
                }}><MailOpenOutline />复制</span>）</p>
              </Form.Item>
              <Form.Item name="account" label='OKX转出账号' rules={[{ required: true }]}>
                <Input placeholder='请输入转账的OKX账号，手机或邮箱' />
              </Form.Item>
            </Form>
          </div>
        )
        cons.push(
          <div className={styles.wrapdiscord}>
            <h5>支付流程</h5>
            <p style={{lineHeight:1.8}}>注：避免白嫖按使用次数收费，0.1U = 1次，每日免费10次 ^_^，不想付费可以明日再来哦</p>
            <ol className={styles.wrapol}>
              <li>前往OKX，登陆需要转账的OKX账号</li>
              <li>OKX『资产』页 → 提币 → 币种选择『USDT』→ 提现方式选择『内部转账』</li>
              <li>填写收款账号1251223923@qq.com → 填写需要转账的数量</li>
              <li>等待2 ~ 10分钟后，回到界面进行验证即可</li>
            </ol>
            </div>
        );
      }
    }

    return <>
            {cons}
          </>
};


export default AlgoList;











