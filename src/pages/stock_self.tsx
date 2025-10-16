// @ts-nocheck
import axios from 'axios';

import dayjs from 'dayjs';

import {
    Space,
    SpinLoading,
    List,
    Image,
    Tag,
    Form,
    Result,
    Input,
    Toast,
    CapsuleTabs,
    Button,
    Radio,
} from 'antd-mobile';

import { SmileOutline, RedoOutline } from 'antd-mobile-icons';

import localforage from 'localforage';

import styles from './index.module.css';

import { useEffect, useState } from 'react';

// zScore 筛选阈值常量
const ZSCORE_THRESHOLD = 2.31;

let clickIns = 0;

const SelfStockList = (props) => {
    const [app, setApp] = useState({
        isLoading: true,
        loaded: false,
        time: '',
        data: [],
    });

    const [form] = Form.useForm();
    
    const [enableZScoreFilter, setEnableZScoreFilter] = useState(false);
    const [payLoading, setPayLoading] = useState(false);

    // 计算策略持续天数
    const calculateDays = (gmt_modified) => {
        const now = dayjs();
        const modifiedTime = dayjs(gmt_modified);
        return now.diff(modifiedTime, 'day');
    };

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

    // 处理股票代码生成图片URL
    const getStockImageUrl = (code: string) => {
        if (code.toLowerCase().startsWith("hk")) {
            // 去掉hk前缀
            const withoutHK = code.substring(2);
            // 去掉前导零，转换为数字再转回字符串
            const number = parseInt(withoutHK, 10) || 0;
            // 格式化为4位数，不足补0
            const formattedNumber = String(number).padStart(4, '0');
            return `https://images.financialmodelingprep.com/symbol/${formattedNumber}.HK.png`;
        }
        return `https://images.financialmodelingprep.com/symbol/${code}.png`;
    };

    // 解析tips信息，提取K线特征和ATR信息
    const parseTipsInfo = (tips: string) => {
        try {
            const tipsArray = JSON.parse(tips);
            let klineInfo = '';
            let atrInfo = '';
            
            tipsArray.forEach((tip: string) => {
                if (tip.includes('K线特征')) {
                    klineInfo = tip.replace('- [K线特征]：', '');
                } else if (tip.includes('ATR信息')) {
                    atrInfo = tip.replace('- [ATR信息]：', '');
                }
            });
            
            return { klineInfo, atrInfo };
        } catch (e) {
            return { klineInfo: '', atrInfo: '' };
        }
    };

    // 获取股票数据
    const fetchStockData = async (flag?: boolean) => {
        if (flag) {
            setApp({
                isLoading: true,
                loaded: false,
                time: '',
                data: [],
            });
        }

        // 检查缓存
        if (!flag) {
            const cachedData: any = await localforage.getItem('self_stock_data');
            if (cachedData) {
                try {
                    const datas = JSON.parse(cachedData);
                    const beforeTime = new Date(datas.time).getTime();
                    const nowTime = new Date().getTime();
                    const diffTime = nowTime - beforeTime;
                    const compareTime = 30 * 60 * 1000; // 30分钟缓存
                    console.log(datas.xlist,'datas.xlist')
                    if (diffTime < compareTime) {
                        setApp({
                            isLoading: false,
                            loaded: true,
                            time: datas.time,
                            data: datas.xlist || [],
                        });
                        return;
                    }
                } catch (e) {}
            }
        }

        try {
            const res = await axios('https://newdemo.jixiang.chat/proxyhttp?apitag=MEIJINGAC&apitype=aistock_manager&type=get', {
                method: 'get'
            });

            if (res?.data?.success) {
                const stockData = res?.data?.data;
                
                // 缓存数据
                await localforage.setItem('self_stock_data', JSON.stringify(stockData));
                
                setApp({
                    isLoading: false,
                    loaded: true,
                    time: stockData.time,
                    data: stockData.xlist || [],
                });
            } else {
                setApp({
                    isLoading: false,
                    loaded: true,
                    time: '',
                    data: [],
                });
            }
        } catch (error) {
            console.error('获取股票数据失败:', error);
            setApp({
                isLoading: false,
                loaded: true,
                time: '',
                data: [],
            });
            Toast.show({
                icon: 'fail',
                content: '获取数据失败，请稍后重试',
            });
        }
    };

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

    const onAddSelf = async (name, cname)=>{
     
       const res = await axios(`https://newdemo.jixiang.chat/proxyhttp?apitag=MEIJINGAC&apitype=aistock_manager`, {
          method: 'get',
          params: {
            type: 'hold',
            name,
            hold: '0'
          },
       });
       if ( res.data.success ) {
            fetchStockData(true);
          // 这里可以添加加入持有的逻辑
            Toast.show({
                icon: 'success',
                content: `已取消持有: ${cname}`
            });
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
        name: values.name,
        cname: values.cname,
      }

      if ( values.type === 'hold' ) {
        post_values.hold = '1';
      }

      if ( values.type === 'post' ) {
        if ( !values.cname ) {
            Toast.show({
              icon: 'fail',
              content: `cname必须有`
            });
            return;
        }
      }

       const res = await axios(`https://newdemo.jixiang.chat/proxyhttp?apitag=MEIJINGAC&apitype=aistock_manager`, {
          method: 'get',
          params: {
            type: values.type,
            ...post_values,
          },
       });
       if ( res.data.success ) {
          Toast.show({
            icon: 'success',
            content: values.type === 'hold' ? `已添加持有` : '已添加监控'
          });
          if ( values.type === 'hold' ) {
            fetchStockData(true);
          }
       }
    }

    useEffect(() => {
        fetchStockData();
    }, []);

    if (app.isLoading) {
        return (
            <>
                <div style={{ marginTop: 140 }} />
                <Space justify='center' block>
                    <SpinLoading color='primary' />
                </Space>
            </>
        );
    }

    const cons: any = [];

    // cons.push(
    //     <div className={styles.wraptime}>
    //         最近更新时间：{app.time ? dayjs(app.time).format('YYYY-MM-DD HH:mm:ss') : ''}
    //         <span onClick={() => {
    //             if (clickIns === 0) {
    //                 clickIns = new Date().getTime();
    //                 fetchStockData(true);
    //             } else {
    //                 const now = new Date().getTime();
    //                 const dif = now - clickIns;
    //                 if (dif < 900000) {
    //                     Toast.show({
    //                         icon: 'fail',
    //                         content: '刷新过于频繁，5分钟后再试试'
    //                     });
    //                 } else {
    //                     fetchStockData(true);
    //                 }
    //             }
    //         }}>
    //             <RedoOutline style={{ marginLeft: 20 }} />
    //             <span style={{ fontSize: 10 }}>刷新</span>
    //         </span>
    //     </div>
    // );

    // 按市场分类数据
    const usStocks = app.data.filter(item => item.name && !item.name.toLowerCase().startsWith('hk'));
    const hkStocks = app.data.filter(item => item.name && item.name.toLowerCase().startsWith('hk'));

    const tabList = [{
        title: '全部',
        taglist: []
    }];

    let long = 0, short = 0;

    let xcon = [];

    let xindex = 0; // 默认激活"全部"标签页

    const x_tabList = tabList.map((item, index) => {
        const targetList = (app?.data || []).filter(it => {    
            // 如果开启了美股筛选，只显示美股
            if (props.showUSOnly && it.name && it.name.toLowerCase().startsWith('hk')) {
                return false;
            }
            
            // 如果开启了港股筛选，只显示港股
            if (props.showHKOnly && it.name && !it.name.toLowerCase().startsWith('hk')) {
                return false;
            }
            return true;
        })
        // 按照持续天数从少到多排序
        item.list = targetList.sort((a, b) => {
            const daysA = calculateDays(a.gmt_modify);
            const daysB = calculateDays(b.gmt_modify);
            return daysA - daysB;
        });
        return item;
    });

    const cur_list = x_tabList[0]?.list || [];

    cons.push(
        <div
            className={styles.wraplist}
            style={{
                overflowY: 'auto',
                margin: '10px 20px'
            }}>
            {xcon}
            {
                !(app?.data || []).length ? <Result
                    icon={<SmileOutline />}
                    status='success'
                    title='暂无数据'
                    description='当前没有股票策略数据'
                /> : null
            }
            {
                cur_list.length ?
                   cur_list.map((stock: any, index) => {
                    const days = calculateDays(stock.gmt_modified || stock.gmt_modify);
                    const hours = calculateHours(stock.gmt_modified || stock.gmt_modify);
                    const imageUrl = getStockImageUrl(stock.name);
                    const { klineInfo, atrInfo } = parseTipsInfo(stock.ai_tips || '[]');
                    
                    return (
                        <div key={index} style={{
                            backgroundColor: '#fff',
                            padding: '12px 16px',
                            borderBottom: '1px solid #f0f0f0',
                            position: 'relative'
                        }}>
                            {/* 头像、股票名称和持续天数在同一行 */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: 8
                            }}>
                                {/* 左侧头像 */}
                                <div className={styles.listicon} style={{ marginRight: 12 }}>
                                    <Image
                                        src={imageUrl}
                                        style={{ borderRadius: 20, border: '1px solid #97b1ca6b'}}
                                        fit='cover'
                                        width={32}
                                        height={32}
                                        fallback={
                                            <div style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: 16,
                                                backgroundColor: stock.pos_side === 'long' ? '#ff4d4f' : '#52c41a',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: 12,
                                                fontWeight: 'bold'
                                            }}>
                                                {stock.pos_side === 'long' ? '多' : '空'}
                                            </div>
                                        }
                                    />
                                </div>

                                {/* 中间股票名称 */}
                                <div style={{
                                    flex: 1,
                                    fontSize: 14,
                                    // fontWeight: 'bold',
                                    color: '#333'
                                }}>
                                    {stock.cname || stock.name}<span className={styles.desx}>( {stock.name} )</span>
                                </div>

                                {/* 右侧持续天数 */}
                                <div style={{
                                    fontSize: 11,
                                    color: '#999'
                                }}>
                                    {props.operationMode ? (
                                        <Button 
                                            size='mini' 
                                            color='primary'
                                            onClick={() => {
                                                onAddSelf(stock.name, stock.cname)
                                            }}>
                                            取消持有
                                        </Button>
                                    ) : (
                                        <span>{days === 0 ? `${hours}小时` : `${days}天`}</span>
                                    )}
                                </div>
                            </div>

                            {/* 描述信息 */}
                            <div className={styles.defs}>
                                {stock?.ai_z_score && (() => {
                                    // 根据 pos_side 调整 z_score 的正负号
                                    const adjustedZScore = stock.pos_side === 'long' ? 
                                        Math.abs(Number(stock.ai_z_score)) : -Math.abs(Number(stock.ai_z_score));
                                    // 使用调整后的 z_score 计算等级
                                    const zScoreInfo = getZScoreLevel(adjustedZScore);
                                    // 检查是否为测试版（绝对值小于阈值）
                                    const isTestVersion = Math.abs(Number(stock.ai_z_score)) <= ZSCORE_THRESHOLD;
                                    return (
                                        <p>
                                            <label>Z分数：</label>
                                            <span style={{color: '#666', fontSize: 12, marginRight: 8}}>
                                                {adjustedZScore.toFixed(4)}
                                            </span>
                                            <Tag color={zScoreInfo.color} fill='outline'>
                                                {zScoreInfo.label}
                                            </Tag>
                                        </p>
                                    
                                    );
                                })()}
                                <p>
                                    <label>方向：</label>
                                    <Tag color={!stock.pos_side ? '#999' : (stock.pos_side === 'long' ? 'danger' : '#87d068')} fill='outline'>
                                        {!stock.pos_side ? '暂无' : (stock.pos_side === 'long' ? '继续持有' : '建议卖出')}
                                    </Tag>
                                </p>
                                {klineInfo && (
                                    <p>
                                        <label>K线特征：</label>
                                        <span style={{ color: '#666', fontSize: 12 }}>{klineInfo}</span>
                                    </p>
                                )}
                                {atrInfo && (
                                    <p>
                                        <label>ATR信息：</label>
                                        <span style={{ color: '#666', fontSize: 12 }}>{atrInfo}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                }) : null
            }
        </div>
    );

    if ( props.operationMode ) {
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
                    block 
                    type='submit' 
                    color='primary' 
                    size='large'>
                      提交设置
                  </Button>
                  }>
              <Form.Item name="cname" label='标的名称' rules={[{ required: false }]}>
                <Input placeholder='cname' />
              </Form.Item>
              <Form.Item name="name" label='标的编号' rules={[{ required: true }]}>
                <Input placeholder='nmae' />
              </Form.Item>
                <Form.Item 
                    name='type' 
                    label='模式'
                    rules={[{ required: true }]}>
                    <Radio.Group>
                        <Space>
                        <Radio value='hold'>新增持有</Radio>
                        <Radio value='post'>新增币种</Radio>
                        </Space>
                    </Radio.Group>
                </Form.Item>
            </Form>
          </div>
     )
    }

    return <>
        {cons}
    </>
};

export default SelfStockList;

