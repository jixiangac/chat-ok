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
    Radio,
} from 'antd-mobile';

import { SmileOutline, RedoOutline, MailOpenOutline } from 'antd-mobile-icons';

import localforage from 'localforage';

import styles from './index.module.css';

import { useEffect, useState } from 'react';
import { saveUuid, setPageInfo, getPageInfo } from '@/utils';

import { imagelist } from './image';

// const prefix = location.href.indexOf('localhost') !== -1 ? '' : 'https://api.jixiang.chat';
const prefix = 'https://api.jixiang.chat';
const prefix_new_api = 'https://newdemo.jixiang.chat/proxyhttp';


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

const AlgoTrendList = (props)=>{


    const today = dayjs();
    const now_today = today.format('YYYY/MM/DD');
    
    const [count, setCount] = useState(0);

    const [paycount, setPayCount] = useState(0);

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

    const onRemove = async (name)=>{
        const res = await axios(`${prefix_new_api}?apitype=aitrend&apitag=CHATGPT`, {
          method: 'get',
          params: {
            type: 'delete',
            name
          },
       });
       if ( res.data.success ) {
          setShow(false);
          fetchData(true);
       }
    }

    const onPay = async ()=>{
      const error = await checkErros(true);
      if ( error ) {
        setPayLoading(false);
        return;
      }
      const values = form.getFieldsValue();
     
      const post_values = {
        name: `${values.name.toUpperCase()}-USDT-SWAP`,
        pos_side: values.pos_side,
        lastprice: values.lastprice
      }
       const res = await axios(`${prefix_new_api}?apitype=aitrend&apitag=CHATGPT`, {
          method: 'get',
          params: {
            type: 'post',
            ...post_values,
          },
       });
       if ( res.data.success ) {
          setShow(false);
          fetchData(true);
       }
    }

    const {
      info
    } = props;

    // 计算策略持续小时数
    const calculateHours = (gmt_modified) => {
        const now = dayjs();
        const modifiedTime = dayjs(gmt_modified);
        return now.diff(modifiedTime, 'hour');
    };

    const initCounts = async ()=>{
      fetchData(false);
    };

    const fetchData = async (flag?: boolean, counts?: number)=>{

        const adatas: any = await localforage.getItem('ai_rtime');

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

        const ajaxurl = `${prefix_new_api}?apitype=aitrend&apitag=CHATGPT&type=get`;
        const res = await axios(ajaxurl, {
            method: 'get'
        });

        // const res = {
        //     data: testdata
        // };

        if ( res?.data?.success ) {
           const pdatas = res?.data?.data;
           await localforage.setItem('ai_rtime', JSON.stringify(pdatas));
           setApp({
            isLoading: false,
            loaded: true,
            time: pdatas.time,
            data: pdatas.xlist,
            needPay: false
           });
           
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

    useEffect(()=>{
      const init = async ()=>{
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
            最近更新时间：{app.time}
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
      }];

      let long = 0, short = 0;

      (app?.data||[]).forEach(item=>{
         if ( item.pos_side === 'long' ) {
           long ++;
         }
         if ( item.pos_side === 'short' ) {
           short ++;
         }
      });

      let xcon = [];

      let xindex = 0;
      const x_tabList = tabList.map((item, index)=>{
        const targetList = (app?.data||[]).filter(it=>{
          if ( item.title === '全部' ) {
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

      console.log(x_tabList,'x_tabList')

      const cur_list = x_tabList[0]?.list || [];

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
                title='当前没有数据'
                description='当前没有数据'
              /> : null
              }
              <div>
                                  {
                                    !cur_list.length ? 
                                    <Result
                                        icon={<SmileOutline />}
                                        status='success'
                                        title='暂无数据'
                                        description={<p>还没有命中的指标，再等等吧</p>}
                                      />: null
                                  }
                                  {cur_list.map((user: any, index) => {
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
                                                          src={imagelist[user.name]?.img}
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
                                                      {user.name.replace('-USDT-SWAP', '')}<span className={styles.desx}>( {imagelist[user.name]?.alias} )</span>
                                                  </div>

                                                  {/* 右侧持续小时数 */}
                                                  <div style={{
                                                      fontSize: 11,
                                                      color: '#999'
                                                  }}>
                                                      {hours}小时
                                                  </div>
                                                  {show ? <a onClick={()=>{
                                                    onRemove(user.name);
                                                  }}>删除</a> : null}
                                              </div>

                                              {/* 描述信息 */}
                                              <div className={styles.defs}>
                                                  <p>
                                                      <label>方向：</label>
                                                      <Tag color={user.algo === 'long' ? 'danger' : '#87d068'} fill='outline'>
                                                        {user.algo === 'long' ? '做多' : '做空'}
                                                      </Tag>
                                                      <span style={{marginLeft: 10, color: '#999'}}>目标价格：{user.lastprice}</span>
                                                  </p>
                                              </div>
                                          </div>
                                      );
                                  })}
                              </div>
            </div>
      );
    } 

    if ( !show ) {
        cons.push(
          <div className={styles.wrapdiscord}>
            <p><a onClick={()=>{
                  setShow(true)
            }}>添加趋势</a></p>
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
                      提交设置
                  </Button>
                  }>
              <Form.Item name="name" label='币种' rules={[{ required: true }]}>
                <Input placeholder='请输入币种' />
              </Form.Item>
              <Form.Item 
                    name='pos_side' 
                    label='方向'
                    rules={[{ required: true }]}>
                    <Radio.Group defaultValue='long'>
                        <Space>
                        <Radio value='long'>多</Radio>
                        <Radio value='short'>空</Radio>
                        </Space>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="lastprice" label='价格' rules={[{ required: true }]}>
                  <Input placeholder='请输入价格' />
                </Form.Item>
            </Form>
          </div>
        )
    }

    return <>
            {cons}
          </>
};


export default AlgoTrendList;

