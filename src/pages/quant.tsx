// @ts-nocheck
import { useEffect, useState, useRef } from 'react';
import styles from './index.module.css';
// import logo from '@/assets/a.jpeg';
import { 
  Avatar, 
  List, 
  FloatingPanel,
  Space, 
  Image, 
  SpinLoading 
} from 'antd-mobile';

import localforage from 'localforage';

import openFormDrawer from './open';

import ApplyForm from './apply';
import AlgoList from './aloglist';
import IntroList from './intro';
import StockList from './stock'

import { createFingerprint, saveUuid } from '../utils';

// const anchors = [100, window.innerHeight * 0.4, window.innerHeight * 0.8];
// const minHeight = anchors[0];
// const maxHeight = anchors[anchors.length - 1];

import axios from 'axios';

const demoAvatarImages = [
  'https://gw.alicdn.com/imgextra/i2/O1CN01fPz7p81auD8ECFNjZ_!!6000000003389-0-tps-886-1919.jpg',
]

// const prefix = location.href.indexOf('localhost') !== -1 ? '' : 'https://api.jixiang.chat';

const prefix = 'https://api.jixiang.chat';

export default function QuantPage() {

  // const targetRef = useRef<HTMLDivElement>(null)

  const [datas, setData] = useState({
    isLoading: true,
    loaded: false, 
    list: [],
    uuid: '',
    abc: {},
    left_usdt: 0,
    today_usdt: 0,
    gmt_update: ''
  });


  const fetchData = async ()=>{

    let uuid = await localforage.getItem('robot_accout_id');
    // let uuid = '';

    if ( !uuid ) {
      uuid = await createFingerprint();
      await localforage.setItem('robot_accout_id', uuid);
    }

    let abc = window.getABC();

    const namelist = await saveUuid();

    const onedatas: any = await localforage.getItem('robot_accout_list');

    if ( onedatas ) {
      const datas = JSON.parse(onedatas);
      setData({
        isLoading: false,
        loaded: true,
        list: datas?.list || [],
        uuid,
        abc,
        left_usdt: (namelist?.data?.data?.left_usdt - 0) || 0,
        today_usdt: (namelist?.data?.data?.today_usdt -0) || 0,
        gmt_update: namelist?.data?.data?.gmt_update || ''
      });
      return;
    } else {
      if ( namelist?.data?.success && namelist.data?.data?.names ) {
        const _name = (namelist?.data?.data?.names || '');
        const accounts = await axios(`${prefix}/api/btc/list?apitype=getAccountByNames&apitag=CHATGPT`, {
          params: {
            names: _name
          },
          method: 'get'
        });

        if ( accounts?.data?.success ) {
           let newlist = accounts?.data?.data?.list || [];
           await localforage.setItem('robot_accout_list', JSON.stringify({
             time: new Date().getTime(),
             list: newlist,
           }));
           setData({
             isLoading: false,
             loaded: true,
             list: newlist,
             uuid,
             abc,
             left_usdt: (namelist?.data?.data?.left_usdt - 0) || 0,
             today_usdt: (namelist?.data?.data?.today_usdt -0) || 0,
             gmt_update: namelist?.data?.data?.gmt_update || ''
           });
           return;
        }
      }
    }

    setData({
      isLoading: false,
      loaded: true,
      list: [],
      uuid,
      abc,
      left_usdt: (namelist?.data?.data?.left_usdt - 0) || 0,
      today_usdt: (namelist?.data?.data?.today_usdt -0) || 0,
      gmt_update: namelist?.data?.data?.gmt_update || ''
    });
  };


  const initData = async ()=>{
    if ( window.requestIdleCallback ) {
      requestIdleCallback(() => {
        fetchData();
      });
    } else {
      setTimeout(() => {
        fetchData();
      }, 500);
    }
  }


  const onChange = (xdatas)=>{
    // const uuid = await localforage.getItem('robot_accout_id');
    setData({
      ...datas || {},
      list: xdatas.list,
    });
  }

  const onAlgoChange = (app)=>{
    setData({
      ...datas || {},
      ...app || {}
    });
  }

  // const onHeightChange = (height: number) => {
  //   const ratio = height / maxHeight
  //   console.log(ratio)
  //   const target = targetRef.current
  //   if (!target) return
  //   target.style.height = '100%'
  //   // target.style.backgroundImage = `linear-gradient(rgba(185,147,214,${ratio}),rgba(140,166,219,${ratio}))`
  // }

  useEffect(()=>{
    initData();
    // onHeightChange(minHeight)
  }, []);


  if ( datas.isLoading ) {
    return <div className={styles.app}>
              <div className={styles.container}>
                
                <Space direction='horizontal' wrap block style={{ '--gap': '40px' }}>
                  <SpinLoading style={{
                    "--color": "#108ee9"
                  }}/>
                  <SpinLoading color='primary' />
                  <SpinLoading style={{
                    "--color": "#87d068"
                  }}/>
                  <SpinLoading style={{
                    "--color": "#ff6430"
                  }}/>
                  <SpinLoading style={{
                    "--color": "#2db7f5"
                  }} />
                </Space>
                <a className={styles.card}>
                  <div className={styles.content}>
                    <div style={{flex:1}}></div>
                    <div style={{flex:1}}>
                      数据初始化中...
                    </div>
                    <div style={{flex:1}}></div>
                  </div>
                </a>
              </div>
            </div>
  }

  return (
    <div className={styles.app}>
      {/* <pre>
        {JSON.stringify(datas.abc || {}, null, 4)}
      </pre> */}
      <List>
        <List.Item
          prefix={<Avatar src={demoAvatarImages[0]} />}
          description={
            <div className={styles.avatarWrap}>
              <p>一个量化交易者，欢迎一起交流学习合作~</p>
              <p> {datas.uuid}</p>
            </div>
          }
        >
          冲鸭卡卡
        </List.Item>
      </List>
  
      <div className={styles.container}>

      <a 
         className={styles.card} 
         style={{
          height: 230
         }}
         onClick={()=>{
            openFormDrawer({
              title: '实时策略',
              children: <AlgoList onChange={onAlgoChange} info={{
                uuid: datas.uuid,
                left_usdt: datas.left_usdt,
                today_usdt: datas.today_usdt,
                gmt_update: datas.gmt_update || ''
              }}/>
            });
        }}>
          <div className={styles.content}>
            <h3>加密货币</h3>
            <span>该频道主要通过监控K线的MACD形态，布林形态，EMA均线形态，裸K形态（十字星，看涨看跌等蜡烛图形态），迪马克指标（td），综合分析币价在周期内的可能趋势，仅做分析参考。</span>
            <span style={{color: 'rgb(178 121 121)', marginTop: 10}}>每半小时更新一次，每自然日可免费使用10次</span>
            <div style={{flex:1}}></div>
          </div>
        </a>

        <a 
         className={styles.card} 
         style={{
          height: 160
         }}
         onClick={()=>{
            openFormDrawer({
              title: '股票策略',
              children: <StockList info={{
                uuid: datas.uuid,
                left_usdt: datas.left_usdt,
                today_usdt: datas.today_usdt,
                gmt_update: datas.gmt_update || ''
              }}/>
            });
        }}>
          <div className={styles.content}>
            <h3>港美股市场</h3>
            <span>港美股股票策略，主要根据均值回归策略和AI捕获趋势</span>
            <div style={{flex:1}}></div>
          </div>
        </a>

        {
          datas.isLoading ? <a className={styles.card}>
                              <div className={styles.content}>
                                <div style={{flex:1}}></div>
                                <div style={{flex:1}}></div>
                                <div style={{flex:1}}></div>
                              </div>
                            </a> :
          (
          datas.list.length ? 
            <a className={styles.card} onClick={()=>{
                openFormDrawer({
                  title: '账号列表',
                  children: <ApplyForm list={datas.list} onChange={onChange}/>
                });
            }}>
              <div className={styles.content}>
                <h3>账号列表</h3>
                <span>管理查看已在进行运行的账号</span>
                <div style={{flex:1}}></div>
              </div>
            </a>
            :
            <a className={styles.card} onClick={()=>{
              openFormDrawer({
                title: 'OKX量化机器人',
                children: <ApplyForm onChange={onChange}/>
              });
          }}>
            <div className={styles.content}>
              <h3>OKX量化机器人</h3>
              <span>量化交易机器人，全自动化交易，交易实盘请在币COIN中搜搜『冲鸭卡卡』</span>
              <div style={{flex:1}}></div>
            </div>
          </a>)
        }
        <a className={styles.card} onClick={()=>{
            openFormDrawer({
              title: '帮助&介绍',
              children: <IntroList />
            });
        }}>
          <div className={styles.content}>
            <h3>策略介绍</h3>
            <span>了解整体策略，机器人的机制</span>
            <div style={{flex:1}}></div>
          </div>
        </a>
        {/* <FloatingPanel anchors={anchors} onHeightChange={onHeightChange}>
          <div ref={targetRef}>
            <div style={{
              'textAlign': 'center',
              'padding': '20px',
              // 'margin': '20px 0'
            }}>策略介绍</div>
            <IntroList />
          </div>
        </FloatingPanel> */}
      </div>
    </div>
  );
}
