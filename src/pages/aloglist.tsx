
import axios from 'axios';
import * as qs from 'qs';

import {
    Space,
    SpinLoading,
    List,
    Image,
    Tag,
    Result,
    Toast
} from 'antd-mobile';

import { SmileOutline, RedoOutline } from 'antd-mobile-icons';

import localforage from 'localforage';

import styles from './index.module.css';

import { useEffect, useState } from 'react';

const timeMap = {
  '1H': '1小时K线',
  '30m': '30分钟K线'
};

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
    'boll': '处于布林带的上下轨位置，有一定趋势延续性',
    'DEA': 'DEA线的金叉死叉位置，有一定趋势延续性'
  };

const imagelist = {
  'BTC-USDT-SWAP': {
    'img': 'https://static.coinall.ltd/cdn/oksupport/asset/currency/icon/btc.png',
    'alias': 'Bitcoin'
  },
  'PEOPLE-USDT-SWAP': {
    'img': 'https://static.coinall.ltd/cdn/oksupport/asset/currency/icon/people.png',
    'alias': 'ConstitutionDAO'
  },
  'ETH-USDT-SWAP': {
    'img': 'https://static.coinall.ltd/cdn/oksupport/asset/currency/icon/eth.png',
    'alias': 'Ethereum'
  },
  'XRP-USDT-SWAP': {
    'img': 'https://static.coinall.ltd/cdn/oksupport/asset/currency/icon/xrp.png',
    'alias': 'XRP'
  },
  'DOGE-USDT-SWAP': {
    'img': 'https://static.coinall.ltd/cdn/oksupport/asset/currency/icon/doge.png',
    'alias': 'Dogecoin'
  },
  'ADA-USDT-SWAP': {
    'img': 'https://static.coinall.ltd/cdn/oksupport/asset/currency/icon/ada.png',
    'alias': 'Cardano'
  },
  'SOL-USDT-SWAP': {
    'img': 'https://static.coinall.ltd/cdn/oksupport/asset/currency/icon/sol.png',
    'alias': 'Solana'
  },
  'DOT-USDT-SWAP': {
    'img': 'https://static.coinall.ltd/cdn/oksupport/asset/currency/icon/dot.png',
    'alias': 'Polkadot'
  },
  'UNI-USDT-SWAP': {
    'img': 'https://static.coinall.ltd/cdn/oksupport/asset/currency/icon/uni.png',
    'alias': 'Uniswap'
  },
  'AVAX-USDT-SWAP': {
    'img': 'https://static.coinall.ltd/cdn/oksupport/asset/currency/icon/avax.png',
    'alias': 'Avalanche'
  },
  'ETC-USDT-SWAP': {
    'img': 'https://static.coinall.ltd/cdn/oksupport/asset/currency/icon/etc.png',
    'alias': '以太经典'
  },
  'ATOM-USDT-SWAP': {
    'img': 'https://static.coinall.ltd/cdn/oksupport/asset/currency/icon/atom.png',
    'alias': '阿童木'
  },
  'NEAR-USDT-SWAP': {
    'img': 'https://static.coinall.ltd/cdn/oksupport/asset/currency/icon/near.png',
    'alias': 'Near Protocol'
  },
  'SAND-USDT-SWAP': {
    'img': 'https://static.coinall.ltd/cdn/oksupport/asset/currency/icon/sand.png',
    'alias': 'Sandbox'
  },
  'MANA-USDT-SWAP': {
    'img': 'https://static.coinall.ltd/cdn/oksupport/asset/currency/icon/mana.png',
    'alias': 'Decentraland'
  },
  'APE-USDT-SWAP': {
    'img': 'https://static.coinall.ltd/cdn/oksupport/asset/currency/icon/ape.png',
    'alias': 'ApeCoin'
  },
  'PEPE-USDT-SWAP': {
    'img': 'https://static.coinall.ltd/cdn/oksupport/asset/currency/icon/pepe.png',
    'alias': 'Pepe'
  },
  'GMT-USDT-SWAP': {
    'img': 'https://static.coinall.ltd/cdn/oksupport/asset/currency/icon/gmt.png',
    'alias': 'STEPN'
  },
  'AXS-USDT-SWAP': {
    'img': 'https://static.coinall.ltd/cdn/oksupport/asset/currency/icon/axs.png',
    'alias': 'Axie Infinity'
  }
};


let clickIns = 0;

const AlgoList = (props)=>{


    const [app, setApp] = useState({
        isLoading: true,
        loaded: false,
        time: '',
        data: []
    });

    const fetchData = async (flag)=>{

        const adatas: any = await localforage.getItem('rtime');
        
        if ( flag ) {
          setApp({
            isLoading: true,
            loaded: false,
            time: '',
            data: []
          });
        }

        if ( !flag && adatas ) {
           try{
             const datas = JSON.parse(adatas);
             const beforeTime = new Date(datas.time).getTime();
             const nowTime = new Date().getTime();
             const diffTime = nowTime - beforeTime;
             if ( diffTime < 1800000 ) {
               setApp({
                isLoading: false,
                loaded: true,
                time: datas.time,
                data: datas.onelist.concat(datas.twolist),
               });
             }

           }catch(e){}
        }

        const res = await axios(`https://api.jixiang.chat/api/btc/list?apitype=recent-algo`, {
            method: 'get'
        });

        if ( res?.data?.success ) {
          const pdatas = res?.data?.data;
          await localforage.setItem('rtime', JSON.stringify(pdatas));
        
          setApp({
            isLoading: false,
            loaded: true,
            time: pdatas.time,
            data: pdatas.onelist.concat(pdatas.twolist),
           });
        } else {
          setApp({
            isLoading: false,
            loaded: true,
            time: '',
            data: []
           });
        }
    }

    useEffect(()=>{
      fetchData(false);
    }, []);


    if ( app.isLoading ) {
      return <>
                <div style={{marginTop: 140}} />
                <Space justify='center' block>
                <SpinLoading color='primary' />
                </Space>
            </>
    }


    return <>
           <div className={styles.wraptime}>
              最近更新时间：{app.time}
              <RedoOutline style={{marginLeft: 20}} onClick={()=>{
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
              }}/>
           </div>
           <div 
            className={styles.wraplist}
            style={{
                maxHeight: document.documentElement.clientHeight - 220,
                overflowY: 'auto',
                margin: '10px 20px'
            }}>
            {
              !(app?.data||[]).length ? <Result
              icon={<SmileOutline />}
              status='success'
              title='Well done'
              description='暂无策略'
            /> : null
            }
             <List>
                {(app?.data||[]).map((user: any, index) => (
                    <List.Item
                        key={index}
                        prefix={
                            <div className={styles.listicon}>
                                <Image
                                    src={imagelist[user.inst_id]?.img}
                                    style={{ borderRadius: 20 }}
                                    fit='cover'
                                    width={32}
                                    height={32}
                                />
                            </div>
                        }
                        description={
                            <div className={styles.defs}>
                            <p>
                                <label>方向：</label>
                                <Tag color={user.pos_side === 'long' ? 'danger' : '#87d068'} fill='outline'>
                                  {user.pos_side === 'long' ? '做多' : '做空'}
                                </Tag>
                            </p>
                            <p>
                                <label>周期：</label>
                                <Tag color='primary' fill='outline'>
                                  {timeMap[user.type]}
                                </Tag>
                            </p>
                            <p>
                                <label>策略：</label>
                                <Tag color='primary' fill='outline'>
                                  {user.algo}
                                </Tag>
                            </p>
                            <p>{ALGO_INTRO[user.algo] ? ALGO_INTRO[user.algo] : user.algo}</p>
                        </div>
                        }
                    >
                        {user.inst_id.replace('-USDT-SWAP', '')}<span className={styles.desx}>( {imagelist[user.inst_id]?.alias} )</span>
                    </List.Item>
                ))}
            </List>
            </div>
            </>
};


export default AlgoList;