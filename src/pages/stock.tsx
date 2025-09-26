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
    CapsuleTabs
} from 'antd-mobile';

import { SmileOutline, RedoOutline } from 'antd-mobile-icons';

import localforage from 'localforage';

import styles from './index.module.css';

import { useEffect, useState } from 'react';

let clickIns = 0;

const StockList = (props) => {
    const [app, setApp] = useState({
        isLoading: true,
        loaded: false,
        time: '',
        data: [],
    });

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
            const cachedData: any = await localforage.getItem('stock_data');
            if (cachedData) {
                try {
                    const datas = JSON.parse(cachedData);
                    const beforeTime = new Date(datas.time).getTime();
                    const nowTime = new Date().getTime();
                    const diffTime = nowTime - beforeTime;
                    const compareTime = 30 * 60 * 1000; // 30分钟缓存
                    
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
            const res = await axios('https://newdemo.jixiang.chat/proxyhttp?apitag=MEIJINGAC&apitype=aistock', {
                method: 'get'
            });

            if (res?.data?.success) {
                const stockData = res?.data?.data;
                
                // 缓存数据
                await localforage.setItem('stock_data', JSON.stringify(stockData));
                
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

    cons.push(
        <div className={styles.wraptime}>
            最近更新时间：{app.time}
            <span onClick={() => {
                if (clickIns === 0) {
                    clickIns = new Date().getTime();
                    fetchStockData(true);
                } else {
                    const now = new Date().getTime();
                    const dif = now - clickIns;
                    if (dif < 900000) {
                        Toast.show({
                            icon: 'fail',
                            content: '刷新过于频繁，5分钟后再试试'
                        });
                    } else {
                        fetchStockData(true);
                    }
                }
            }}>
                <RedoOutline style={{ marginLeft: 20 }} />
                <span style={{ fontSize: 10 }}>刷新</span>
            </span>
        </div>
    );

    // 按市场分类数据
    const usStocks = app.data.filter(item => item.name && !item.name.toLowerCase().startsWith('hk'));
    const hkStocks = app.data.filter(item => item.name && item.name.toLowerCase().startsWith('hk'));

    const tabList = [{
        title: '全部',
        taglist: []
    }, {
        title: '美股',
        taglist: ['non-hk']
    }, {
        title: '港股',
        taglist: ['hk']
    }, {
        title: '看多',
        taglist: ['long']
    }, {
        title: '看空',
        taglist: ['short']
    }];

    let long = 0, short = 0;

    (app?.data || []).forEach(item => {
        if (item.pos_side === 'long') {
            long++;
        }
        if (item.pos_side === 'short') {
            short++;
        }
    });

    let xcon = [];

    if (long > 0 || short > 0) {
        xcon.push(
            <p>
                <span style={{ marginLeft: '20px' }}>多：{long}</span>
                <span style={{ marginLeft: '10px' }}>空：{short}</span>
                <span style={{ marginLeft: '20px' }}>{
                    long > short ? '当前看多的股票较多' : '当前看空的股票较多'
                }</span>
            </p>
        );
    }

    let xindex = 0; // 默认激活"全部"标签页
    const x_tabList = tabList.map((item, index) => {
        const targetList = (app?.data || []).filter(it => {
            if (item.title === '全部') {
                return true;
            }
            if (item.title === '美股' && it.name && !it.name.toLowerCase().startsWith('hk')) {
                return true;
            }
            if (item.title === '港股' && it.name && it.name.toLowerCase().startsWith('hk')) {
                return true;
            }
            if (item.title === '看多' && it.pos_side === 'long') {
                return true;
            }
            if (item.title === '看空' && it.pos_side === 'short') {
                return true;
            }
            return false;
        })
        // 按照持续天数从少到多排序
        item.list = targetList.sort((a, b) => {
            const daysA = calculateDays(a.gmt_modified);
            const daysB = calculateDays(b.gmt_modified);
            return daysA - daysB;
        });
        return item;
    });

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
                (app?.data || []).length ?
                    <CapsuleTabs defaultActiveKey={`${xindex}`}>
                        {
                            x_tabList.map((item, index) => {
                                return <CapsuleTabs.Tab title={item.title} key={index} destroyOnClose>
                                    <div>
                                        {
                                            !item.list.length ?
                                                <Result
                                                    icon={<SmileOutline />}
                                                    status='success'
                                                    title='暂无数据'
                                                    description={<p>还没有命中的指标，再等等吧</p>}
                                                /> : null
                                        }
                                        {item.list.map((stock: any, index) => {
                                            const days = calculateDays(stock.gmt_modified);
                                            const hours = calculateHours(stock.gmt_modified);
                                            const imageUrl = getStockImageUrl(stock.name);
                                            const { klineInfo, atrInfo } = parseTipsInfo(stock.tips || '[]');
                                            
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
                                                                style={{ borderRadius: 20 }}
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
                                                            {days === 0 ? `${hours}小时` : `${days}天`}
                                                        </div>
                                                    </div>

                                                    {/* 描述信息 */}
                                                    <div className={styles.defs}>
                                                        <p>
                                                            <label>方向：</label>
                                                            <Tag color={stock.pos_side === 'long' ? 'danger' : '#87d068'} fill='outline'>
                                                                {stock.pos_side === 'long' ? '做多' : '做空'}
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
                                        })}
                                    </div>
                                </CapsuleTabs.Tab>
                            })
                        }
                    </CapsuleTabs> : null
            }
        </div>
    );

    // cons.push(
    //     <div className={styles.wrapdiscord}>
    //         <p style={{ color: '#999' }}>
    //             总计：<b style={{ fontSize: 14, margin: '0 5px' }}>{app.data.length}</b> 个策略
    //         </p>
    //         <p style={{ color: '#999' }}>
    //             做多：<b style={{ fontSize: 14, margin: '0 5px' }}>{long}</b> 个
    //         </p>
    //         <p style={{ color: '#999' }}>
    //             做空：<b style={{ fontSize: 14, margin: '0 5px' }}>{short}</b> 个
    //         </p>
    //     </div>
    // );

    return <>
        {cons}
    </>
};

export default StockList;





