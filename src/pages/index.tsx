// @ts-nocheck
import { useEffect, useState } from 'react';
import styles from './index.module.css';
// import logo from '@/assets/a.jpeg';
import { Avatar, List, Space, Image } from 'antd-mobile';

import localforage from 'localforage';

import openFormDrawer from './open';

import ApplyForm from './apply';
import AlgoList from './aloglist';

import { createFingerprint, getDeviceId } from '../utils'

const demoAvatarImages = [
  'https://gw.alicdn.com/imgextra/i2/O1CN01fPz7p81auD8ECFNjZ_!!6000000003389-0-tps-886-1919.jpg',
]

const prefix = location.href.indexOf('localhost') !== '-1' ? '' : 'https://api.jixiang.chat';

export default function IndexPage() {

  const [datas, setData] = useState({
    isLoading: true,
    loaded: false, 
    list: [],
    uuid: ''
  });


  const fetchData = async ()=>{

    

    let uuid = await localforage.getItem('robot_accout_id');

    if ( !uuid ) {
      uuid = await createFingerprint();
      await localforage.setItem('robot_accout_id', uuid);
    }

    const onedatas: any = await localforage.getItem('robot_accout_list');

    if ( onedatas ) {
      const datas = JSON.parse(onedatas);
      setData({
        isLoading: false,
        loaded: true,
        list: datas?.list || [],
        uuid
      });
      return;
    } else {
      const namelist = await axios(`${prefix}/api/btc/list?apitype=getInfoByDeviceId`, {
        params: {
          uuid
        },
        method: 'get'
      });
      if ( namelist?.data?.success ) {
        const _name = (namelist?.data?.data || '').split(',');
        const accounts = await axios(`${prefix}/api/btc/list?apitype=getAccountByNames`, {
          params: {
            name: _name
          },
          method: 'get'
        });

        if ( accounts?.data?.success ) {
           let newlist = accounts?.data?.data;
           await localforage.setItem('robot_accout_list', JSON.stringify({
             time: new Date().getTime(),
             list: newlist,
           }));
           setData({
             isLoading: false,
             loaded: true,
             list: newlist,
             uuid
           });
        }
      }
    }

    setData({
      isLoading: false,
      loaded: true,
      list: [],
      uuid
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

  useEffect(()=>{
    initData();
  }, []);

  return (
    <div className={styles.app} style={{
      maxHeight: document.documentElement.clientHeight,
      overflow: 'hidden'
    }}>
      <List>
        <List.Item
          prefix={<Avatar src={demoAvatarImages[0]} />}
          description='一个量化交易者，欢迎一起交流学习合作~'
        >
          冲鸭卡卡
        </List.Item>
      </List>
      <p>uuid: {datas.uuid}</p>
      <div className={styles.container}>

      <a 
         className={styles.card} 
         style={{
          height: 230
         }}
         onClick={()=>{
            openFormDrawer({
              title: '实时策略',
              children: <AlgoList />
            });
        }}>
          <div className={styles.content}>
            <h3>实时策略信息(beta)</h3>
            <span>该频道主要通过监控K线的MACD形态，布林形态，EMA均线形态，裸K形态（十字星，看涨看跌等蜡烛图形态），迪马克指标（td），综合分析币价在周期内的可能趋势，仅做分析参考。</span>
            <span style={{color: 'rgb(178 121 121)', marginTop: 10}}>每半小时更新一次，每自然日可免费使用10次</span>
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
                  children: <ApplyForm list={datas.list}/>
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
                title: '申请使用机器人',
                children: <ApplyForm />
              });
          }}>
            <div className={styles.content}>
              <h3>申请使用机器人</h3>
              <span>量化交易机器人，全自动化交易，交易实盘请在币COIN中搜搜『冲鸭卡卡』</span>
              <div style={{flex:1}}></div>
            </div>
          </a>)
        }
        <a className={styles.card} onClick={()=>{
            openFormDrawer({
              title: '加入群聊',
              children: <div style={{
                maxHeight: document.documentElement.clientHeight - 300,
                overflowY: 'auto',
                margin: '10px 20px'
              }}>
                <div style={{marginBottom: 20}}>VX:  amuye1993</div>
                <Image src="https://okx.jixiang.chat/src/assets/a.jpeg" />
              </div>
            });
        }}>
          <div className={styles.content}>
            <h3>加入群聊</h3>
            <span>加入VX交流群，一起交流</span>
            <div style={{flex:1}}></div>
          </div>
        </a>
        
      </div>
    </div>
  );
}
