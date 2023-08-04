import { useState } from 'react';
import styles from './index.module.css';
import logo from '@/assets/a.jpeg';
import { Avatar, List, Space, Image } from 'antd-mobile';



import openFormDrawer from './open';

import ApplyForm from './apply';
import AlgoList from './aloglist';

const demoAvatarImages = [
  'https://gw.alicdn.com/imgextra/i2/O1CN01fPz7p81auD8ECFNjZ_!!6000000003389-0-tps-886-1919.jpg',
]

export default function IndexPage() {

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
      <div className={styles.container}>

      <a className={styles.card} onClick={()=>{
            openFormDrawer({
              title: '实时策略',
              children: <AlgoList />
            });
        }}>
          <div className={styles.content}>
            <h3>实时策略信息(beta)</h3>
            <span>最近1小时/30分钟的币种有策略</span>
            <div style={{flex:1}}></div>
          </div>
        </a>

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
        </a>
        <a className={styles.card} onClick={()=>{
            openFormDrawer({
              title: '加入群聊',
              children: <div style={{
                maxHeight: document.documentElement.clientHeight - 300,
                overflowY: 'auto',
                margin: '10px 20px'
              }}>
                <Image src={logo} />
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
