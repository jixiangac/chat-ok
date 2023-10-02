// @ts-nocheck
import { LoremIpsum } from 'lorem-ipsum';

export const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
})

import {
    Tabs,
    CapsuleTabs,
    Collapse,
    Card,
    Steps,
    Image,
    List
} from 'antd-mobile';

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

const { Step } = Steps;

import { useEffect, useState } from 'react';

const prefix = location.href.indexOf('localhost') !== -1 ? '' : 'https://api.jixiang.chat';

const mockContents = Array(5)
  .fill(null)
  .map(() => lorem.generateParagraphs(1))

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

const IntroList = (props)=>{


   const TabList = [{
      title: '量化策略',
      content: ()=>{
        return <CapsuleTabs defaultActiveKey={"0"}>
                    <CapsuleTabs.Tab title="前言" key="0" destroyOnClose>
                        <p>策略的实盘效果可以在币COIN APP中搜索『冲鸭卡卡』</p>
                        <Card title='实盘效果'>
                           <Image 
                             src={"https://img.alicdn.com/imgextra/i1/O1CN01KnAEFw1PP6TYiMitu_!!6000000001832-0-tps-500-1082.jpg"} 
                             width={"100%"} 
                             height={"100%"} 
                             fit='cover'
                             lazy
                             style={{ 
                                border: '1px solid #eee',
                                borderRadius: 8 
                              }}
                            />
                        </Card>
                    </CapsuleTabs.Tab>
                    <CapsuleTabs.Tab title="当前监控的币种" key="1" destroyOnClose>
                        <p>主要选取了相对市值比较高，流动性比较好的币种，会根据具体情况经常更新</p>
                        <List mode='card' header='监控币种列表'>
                            {
                                "BTC /  ETH / AXS / DOT / DOGE / PEPE / XRP / MANA / SAND / UNI / NEAR / ADA / GMT / APE / SOL / ETC / PEOPLE / ATOM / AVAX / DYDX".split('/').map(item=>{
                                    console.log(item,'dd')
                                    let us = imagelist[`${item.replace(/^\s*|\s*$/g,"")}-USDT-SWAP`];
                                    return <List.Item extra={
                                            <Image
                                                src={us?.img}
                                                style={{ borderRadius: 20 }}
                                                fit='cover'
                                                width={40}
                                                height={40}
                                                lazy
                                                />
                                        } >
                                        {us?.alias}
                                    </List.Item>
                                })
                            }
                        </List>
                    </CapsuleTabs.Tab>
                    <CapsuleTabs.Tab title="开仓策略" key="2" destroyOnClose>
                        <p>机器人的开仓，主要根据 MACD指标  的金叉/死叉+裸K形态的布尔中轨作为基础依据进行入场</p>
                        <p>指标并不是百分百的，所以开仓很重要的是仓位的管理</p>
                        <p>根据当前账户的可用资金的0.5%，分成10份进行挂单，根据趋势情况进行设置比例挂单。</p>
                        <p>🌰：</p>
                        <Image 
                             src={"https://img.alicdn.com/imgextra/i3/O1CN01LaVlcC21pcoJObVM5_!!6000000007034-2-tps-798-1668.png"} 
                             width={"100%"} 
                             height={"100%"} 
                             fit='cover'
                             lazy
                             style={{ 
                                border: '1px solid #eee',
                                borderRadius: 8 
                              }}
                            />
                    </CapsuleTabs.Tab>
                    <CapsuleTabs.Tab title="持仓策略" key="3" destroyOnClose>
                        <p>持仓过程中，如果没有完成盈利，仍然处于持仓状态的时候</p>
                        <p>每个小时根据具体趋势情况，进行重新设置挂单，以进行再次进行平衡均价</p>
                        <p>如果做多，主要会在布林带下轨位置进行设置，如果做空主要会在布林带上轨以上进行设置挂单，这种情况多可以吃针</p>
                    </CapsuleTabs.Tab>
                    <CapsuleTabs.Tab title="盈利策略" key="4" destroyOnClose>
                        <p>盈利策略主要为以下两种模式：</p>
                        <Card title='第一种'>
                            <p>仓位会在0.5%，0.8%盈利位置进行挂单20%，其余的进行1%以上的止盈止损，止损一般根据当前保证金率和杠杆设置在5 ~ 10% 范围，会动态调整。</p>
                            <p>举个🌰：当前ETH价格1000，当前总共有10张</p>
                            <p>则会在1010，1020进行短线挂单分别挂单止盈1张，其余8张仍旧在1050进行设置止盈950设置止损</p>
                        </Card>
                        <Card title='第二种'>
                            <p>如果盈利了0.5% 以上的仓位，会进行自动设置移动止损模式，也就是仓位的止损会设置在盈利点之上，根据行情的变化，会不停上移止损，这样这个仓位是肯定盈利的，只是盈利多少的问题。</p>
                            <p>举个🌰：当前ETH价格1080，成本1000，当前总共有10张，已经盈利1%</p>
                            <p>则会把10张都会设置止损1050，止盈1200，根据行情变化不停进行止损上移动，直到被打到止损结束平仓</p>
                        </Card>
                    </CapsuleTabs.Tab>
                    <CapsuleTabs.Tab title="止损策略" key="5" destroyOnClose>
                      <p>蚂蚁仓位的时候一般设置止损15%(也就是一般不会止损，设置15%防止异常波动)</p>
                      <p>当仓位大小达到5%的比例的仓位时，并且亏损达到了4%以上，就会开启止损模式</p>
                      <p>为防止被意外精准止损而造成的情况，会进行计算当前小时的ATR波动值，在波动低谷高谷进行止损</p>
                    </CapsuleTabs.Tab>
                    <CapsuleTabs.Tab title="停用策略" key="6" destroyOnClose>
                       <p>在OKX删除API即可或者可用资金为0</p>
                    </CapsuleTabs.Tab>
                </CapsuleTabs>
      }
   },{
    title: '如何使用机器人',
    content: ()=>{
      return <CapsuleTabs defaultActiveKey={"0"}>
                  <CapsuleTabs.Tab title="前言" key="0" destroyOnClose>
                      <p>只支持OKX交易所，其他交易所暂不支持。</p>
                  </CapsuleTabs.Tab>
                  <CapsuleTabs.Tab title="合作模式" key="1" destroyOnClose>
                     <Card title='邀请模式'>
                        <Steps direction='vertical'>
                            <Step title='注册一个OKX账号：' description={<p><a href="https://www.cnouyi.expert/cn/join/meihao" target="_blank">https://www.cnouyi.expert/cn/join/meihao</a></p>} status='process' />
                            <Step title='录入OKX API' status='wait' />
                            <Step title='等待自动进行' status='wait' />
                        </Steps>
                     </Card>
                     <Card title='付费模式'>
                        <Steps direction='vertical'>
                            <Step title='转账充值' description={<p>按日收费：1U / 日 收费，前7天免费，直接充到指定账户(OKX账户：1251223923@qq.com)</p>} status='process' />
                            <Step title='录入OKX API' status='wait' />
                            <Step title='校验充值USDT' status='wait' />
                            <Step title='等待自动进行' status='wait' />
                        </Steps>
                     </Card>

                     <Card title='抽佣模式'>
                        <Steps direction='vertical'>
                            <Step title='录入OKX API' status='process' />
                            <Step title='等待自动进行' status='wait' />
                            <Step title='费用结算' status='wait' description={<div><p>每周根据当前账户的盈利情况进行付</p><ul className='question'><li>当周盈利部分的30%进行付费，如果总盈利 &lt; 当周盈利30%，则不需要付费。</li><li>      每周六进行结算，如果不结算会自动停用API，并进行拉黑。</li></ul></div>}/>
                        </Steps>
                     </Card>
                  </CapsuleTabs.Tab>
                  <CapsuleTabs.Tab title="录入API" key="5" destroyOnClose>
                     <Card title='录入API'>
                        <Image 
                            src={"https://img.alicdn.com/imgextra/i2/O1CN016IuRfp1iAQTyPDOXv_!!6000000004372-2-tps-776-1688.png"} 
                            width={"100%"} 
                            height={"100%"} 
                            fit='cover'
                            lazy
                            style={{ 
                            border: '1px solid #eee',
                            borderRadius: 8 
                            }}
                        />
                    </Card>
                  </CapsuleTabs.Tab>
                  <CapsuleTabs.Tab title="查看账户" key="6" destroyOnClose>
                    <Card title='查看账户'>
                    <Image 
                            src={"https://img.alicdn.com/imgextra/i2/O1CN01bAYk7x1j3O0ZF0B9y_!!6000000004492-2-tps-782-1674.png"} 
                            width={"100%"} 
                            height={"100%"} 
                            fit='cover'
                            lazy
                            style={{ 
                            border: '1px solid #eee',
                            borderRadius: 8 
                            }}
                        />
                        </Card>
                  </CapsuleTabs.Tab>
              </CapsuleTabs>
     }
   },{
    title: '常见问题',
    content: ()=>{
      return <Collapse defaultActiveKey={"1"} accordion>
                <Collapse.Panel key='1' title='账户如果也想自己操作怎么弄'>
                    <p>账户接了机器人后，最好当前账户不要再进行操作。</p>
                    <p>可以开个专门的子账户进行隔离，OKX支持新建子账户，子账户也有独立的API。</p>
                </Collapse.Panel>
                <Collapse.Panel key='2' title='免费指标提醒在哪里？'>
                    <ol className='question'>
                      <li>DC群地址：<a href="https://discord.gg/8UPC9Hj5Mr" target="_blank">https://discord.gg/8UPC9Hj5Mr</a></li>
                      <li>所有免费指标都在Discrod群组中，需要翻墙使用。</li>
                      <li>钉钉群提醒：30U / 月，如果不需要不用联系，（不需要翻墙，联系管理员）</li>
                      <li>基础指标Discord频道都有，钉钉群还会提供额外的特殊精选指标。</li>
                    </ol>
                </Collapse.Panel>
                <Collapse.Panel key='3' title='不想要机器人操作，只想要监控自己账户持仓，并获得独家提醒定'>
                   <ol className='question'>
                     <li>同样提供OKX API(只需要只读权限)，3U/天，最少订购30天，长期合作可以2U/天(至少三个月)</li>
                     <li>提醒只支持discord提醒 / 钉钉提醒。</li>
                   </ol>
                </Collapse.Panel>
                <Collapse.Panel key='4' title='机器人的策略和整体运作机制是怎么样的？'>
                    查看『量化策略』
                </Collapse.Panel>
                <Collapse.Panel key='5' title='得我的指标不错，自己管理了社群(钉钉群/Discord)，也想定制，如何合作'>
                   <ol className='question'>
                     <li>1U/天，最少订购30天，后续可以按天付费。</li>
                     <li>深度定制，2U/天，最少订购90天，后续可以按天付费。</li>
                   </ol>
                </Collapse.Panel>
             </Collapse>
    }
  },{
      title: '交流相关',
      content: ()=>{
        return <div className='contact'>
                 <List mode='card'>
                  <List.Item prefix={
                        <Image
                            src={"https://img.alicdn.com/imgextra/i1/O1CN01Cj4JhA1ocGFR6zMR2_!!6000000005245-0-tps-1300-952.jpg"}
                            style={{ borderRadius: 20 }}
                            fit='cover'
                            width={40}
                            height={40}
                            lazy
                            />
                    } >
                    <a href="https://discord.gg/8UPC9Hj5Mr" target="_blank">https://discord.gg/8UPC9Hj5Mr</a>
                 </List.Item>
                 <List.Item prefix={
                        <Image
                            src={"https://img.alicdn.com/imgextra/i4/O1CN019bR9Ls1iF0RYj2Aqs_!!6000000004382-0-tps-512-512.jpg"}
                            style={{ borderRadius: 20 }}
                            fit='cover'
                            width={40}
                            height={40}
                            lazy
                            />
                    } >
                    amuye1993
                 </List.Item>
               </List>
             </div>
      }
   }];


   


    return <Tabs defaultActiveKey='tab_0'>
             {
                TabList.map((item, index)=>{
                    return <Tabs.Tab title={item.title} key={`tab_${index}`}>
                              {item.content()}
                           </Tabs.Tab>
                 })
              }
           </Tabs>
};


export default IntroList;