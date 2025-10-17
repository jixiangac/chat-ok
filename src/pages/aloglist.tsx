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

    const [show, setShow] = useState(false);

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

    // 星级选项
    const starOptions = [
        { label: '5星', value: '5' },
        { label: '4星', value: '4' },
        { label: '3星', value: '3' },
        { label: '2星', value: '2' },
        { label: '1星', value: '1' },
    ];



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
           await localforage.setItem('rtime', JSON.stringify(pdatas));
           setApp({
            isLoading: false,
            loaded: true,
            time: pdatas.time,
            data: pdatas.xlist,
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
          <p>
            <span style={{marginLeft: '20px'}}>
                <span style={{display: 'inline-flex', alignItems: 'center', gap: '5px'}}><Selector
                  options={starOptions}
                  value={starFilter}
                  onChange={(arr) => {
                    setStarFilter(arr);
                  }}
                  multiple={true}
                  style={{ '--border': 'none', '--padding': '4px 8px', fontSize: '12px' }}
                >
                  星级筛选
                </Selector>
                {starFilter.length > 0 && (
                  <Button 
                    size='mini' 
                    color='default'
                    onClick={() => setStarFilter([])}>
                    清空
                  </Button>
                )}</span>
              </span>
          </p>
         )
      }

      let xindex = 0;
      const x_tabList = tabList.map((item, index)=>{
        const targetList = (app?.data||[]).filter(it=>{
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
                                                      color: '#999'
                                                  }}>
                                                      {hours}小时
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
                                                      <label>次数：</label>
                                                      <span style={{fontWeight: 'normal', color: '#999'}}>{user?.count || '0'}</span>
                                                  </p>
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



