import { useState } from 'react';
import styles from './index.module.css';

import { Avatar, List, Space } from 'antd-mobile';

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
          description='量化机器人，嘻嘻'
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
            <h3>申请录入</h3>
            <span>录入api key / screct key / 密码短语，进行申请准入</span>
            <div style={{flex:1}}></div>
          </div>
        </a>
        <a className={styles.card} onClick={()=>{
            openFormDrawer({
              title: '查询',
              children: <div style={{ padding: '40px 20px 20px' }}>Sit commodo minim sit sint eu nulla. Commodo laboris eu deserunt nostrud officia ut incididunt laborum adipisicing. Ea nulla enim enim amet in. Non dolore sunt tempor qui do culpa labore ex consequat anim. Id deserunt proident laboris.</div>
            });
        }}>
          <div className={styles.content}>
            <h3>查询录入进展</h3>
            <span>通过api key查询进展</span>
            <div style={{flex:1}}></div>
          </div>
        </a>
        
      </div>
    </div>
  );
}
