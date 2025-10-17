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
    CapsuleTabs,
    Button
} from 'antd-mobile';

import { SmileOutline, RedoOutline } from 'antd-mobile-icons';

import localforage from 'localforage';

import styles from './index.module.css';

import SelfStock from './stock_self';

import { useEffect, useState } from 'react';

// zScore 筛选阈值常量
const ZSCORE_THRESHOLD = 2.31;

let clickIns = 0;

const StockList = (props) => {
    const [app, setApp] = useState({
        isLoading: true,
        loaded: false,
        time: '',
        data: [],
    });
    
    const [enableZScoreFilter, setEnableZScoreFilter] = useState(false);
    const [showUSOnly, setShowUSOnly] = useState(false);
    const [showHKOnly, setShowHKOnly] = useState(false);
    const [operationMode, setOperationMode] = useState(false);

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

    const onAddSelf = async (name, cname)=>{
     
       const res = await axios(`https://newdemo.jixiang.chat/proxyhttp?apitag=MEIJINGAC&apitype=aistock_manager`, {
          method: 'get',
          params: {
            type: 'hold',
            name,
            hold: '1'
          },
       });
       if ( res.data.success ) {
          // 这里可以添加加入持有的逻辑
            Toast.show({
                icon: 'success',
                content: `已加入持有: ${cname}`
            });
       }
    }

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
            最近更新时间：{app.time ? dayjs(app.time).format('YYYY-MM-DD HH:mm:ss') : ''}
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

    if ( location.href.indexOf('jiyang') !==-1 ) {
        tabList.push({
            title: '持有',
            taglist: []
        });
    }

    let long = 0, short = 0;

    (app?.data || []).forEach(item => {
        // 如果开启了 zScore 筛选，先检查 zScore 条件
        if (enableZScoreFilter && item.z_score) {
            const zScoreValue = Math.abs(Number(item.z_score));
            if (zScoreValue <= ZSCORE_THRESHOLD) {
                return; // 跳过 zScore 绝对值小于等于 2.31 的数据
            }
        }
        
        // 如果开启了美股筛选，只显示美股
        if (showUSOnly && item.name && item.name.toLowerCase().startsWith('hk')) {
            return;
        }
        
        // 如果开启了港股筛选，只显示港股
        if (showHKOnly && item.name && !item.name.toLowerCase().startsWith('hk')) {
            return;
        }
        
        if (item.pos_side === 'long') {
            long++;
        }
        if (item.pos_side === 'short') {
            short++;
        }
    });

    let xcon = [];

    if (long > 0 || short > 0 || enableZScoreFilter) {
        xcon.push(
            <p>
                <span style={{ marginLeft: '20px' }}>多：{long}</span>
                <span style={{ marginLeft: '10px' }}>空：{short}</span>
                <span style={{ marginLeft: '20px' }}>{
                    long > short ? '当前看多的股票较多' : '当前看空的股票较多'
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
            <span style={{marginLeft: '10px'}}>
                    <Button 
                        size='mini' 
                        color={showUSOnly ? 'success' : 'default'}
                        onClick={() => {
                            setShowUSOnly(!showUSOnly);
                            if (!showUSOnly) setShowHKOnly(false); // 互斥选择
                        }}>
                        {showUSOnly ? '取消美股' : '只看美股'}
                    </Button>
                </span>
                <span style={{marginLeft: '10px'}}>
                    <Button 
                        size='mini' 
                        color={showHKOnly ? 'warning' : 'default'}
                        onClick={() => {
                            setShowHKOnly(!showHKOnly);
                            if (!showHKOnly) setShowUSOnly(false); // 互斥选择
                        }}>
                        {showHKOnly ? '取消港股' : '只看港股'}
                    </Button>
                </span>
                {location.href.indexOf('jiyang') !==-1 ? <span style={{marginLeft: '10px'}}>
                    <Button 
                        size='mini' 
                        color={operationMode ? 'danger' : 'default'}
                        onClick={() => setOperationMode(!operationMode)}>
                        {operationMode ? '退出操作' : '操作模式'}
                    </Button>
                </span> : null}
          </p>
        )
    }

    let xindex = 0; // 默认激活"全部"标签页
    const x_tabList = tabList.map((item, index) => {
        const targetList = (app?.data || []).filter(it => {
            // 如果开启了 zScore 筛选，先检查 zScore 条件
            if (enableZScoreFilter && it.z_score) {
                const zScoreValue = Math.abs(Number(it.z_score));
                if (zScoreValue <= ZSCORE_THRESHOLD) {
                    return false; // 过滤掉 zScore 绝对值小于等于 2.31 的数据
                }
            }
            
            // 如果开启了美股筛选，只显示美股
            if (showUSOnly && it.name && it.name.toLowerCase().startsWith('hk')) {
                return false;
            }
            
            // 如果开启了港股筛选，只显示港股
            if (showHKOnly && it.name && !it.name.toLowerCase().startsWith('hk')) {
                return false;
            }
            
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

    if ( location.href.indexOf('jiyang') !==-1 ) {
      xindex = x_tabList.length - 1;
    }

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
                                          item.title !== '持有' && !item.list.length ?
                                                <Result
                                                    icon={<SmileOutline />}
                                                    status='success'
                                                    title='暂无数据'
                                                    description={<p>还没有命中的指标，再等等吧</p>}
                                                /> : null
                                        }
                                        {
                                          item.title === '持有' ? <SelfStock showUSOnly={showUSOnly} showHKOnly={showHKOnly} operationMode={operationMode}/> : null
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

                                                        {/* 右侧持续天数或操作按钮 */}
                                                        <div style={{
                                                            fontSize: 11,
                                                            color: '#999',
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }}>
                                                            {operationMode ? (
                                                                <Button 
                                                                    size='mini' 
                                                                    color='primary'
                                                                    onClick={() => {
                                                                        onAddSelf(stock.name, stock.cname)
                                                                    }}>
                                                                    加入持有
                                                                </Button>
                                                            ) : (
                                                                <span>{days === 0 ? `${hours}小时` : `${days}天`}</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* 描述信息 */}
                                                    <div className={styles.defs}>
                                                        {stock?.z_score && (() => {
                                                            // 根据 pos_side 调整 z_score 的正负号
                                                            const adjustedZScore = stock.pos_side === 'long' ? 
                                                                Math.abs(Number(stock.z_score)) : -Math.abs(Number(stock.z_score));
                                                            // 使用调整后的 z_score 计算等级
                                                            const zScoreInfo = getZScoreLevel(adjustedZScore);
                                                            // 检查是否为测试版（绝对值小于阈值）
                                                            const isTestVersion = Math.abs(Number(stock.z_score)) <= ZSCORE_THRESHOLD;
                                                            return (
                                                            <p>
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
                                                            </p>
                                                            );
                                                        })()}
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
                                                        {stock?.last_price && (() => {
                                                            try {
                                                                const priceData = JSON.parse(stock.last_price);
                                                                const currentPrice = priceData.c;
                                                                // 根据股票代码判断是否为港股
                                                                const isHKStock = stock.name && stock.name.toLowerCase().startsWith('hk');
                                                                const currencySymbol = isHKStock ? 'HK$' : '$';
                                                                
                                                                // 计算建议入仓价格
                                                                const isLong = stock.pos_side === 'long';
                                                                let firstLevel, secondLevel, firstLabel, secondLabel;
                                                                let quickLevel;
                                                                
                                                                if (isLong) {
                                                                    // 做多：计算支撑位
                                                                    quickLevel = (currentPrice * 0.98).toFixed(2);
                                                                    firstLevel = (currentPrice * 0.95).toFixed(2);
                                                                    secondLevel = (currentPrice * 0.92).toFixed(2);
                                                                    firstLabel = '第一支撑';
                                                                    secondLabel = '第二支撑';
                                                                } else {
                                                                    // 做空：计算阻力位
                                                                    quickLevel = (currentPrice * 1.02).toFixed(2);
                                                                    firstLevel = (currentPrice * 1.05).toFixed(2);
                                                                    secondLevel = (currentPrice * 1.08).toFixed(2);
                                                                    firstLabel = '第一阻力';
                                                                    secondLabel = '第二阻力';
                                                                }
                                                                
                                                                return (
                                                                    <div style={{marginTop: 8, padding: '8px 12px', backgroundColor: '#f8f8f8', borderRadius: 6, border: '1px dashed #d9d9d9'}}>
                                                                        <p style={{margin: '4px 0'}}>
                                                                            <label style={{fontWeight: 'bold', color: '#495057'}}>策略时价格：</label>
                                                                            <span style={{color: '#28a745', fontSize: 13, fontWeight: 'bold', marginLeft: 8}}>
                                                                                {currencySymbol}{currentPrice}
                                                                            </span>
                                                                        </p>
                                                                        <p style={{margin: '4px 0'}}>
                                                                            <label style={{fontWeight: 'bold', color: '#495057'}}>建议入仓：<span style={{fontWeight: 'normal', color: '#999'}}>( {currencySymbol}{quickLevel} )</span></label>
                                                                        </p>
                                                                        <p style={{margin: '4px 0', paddingLeft: 16}}>
                                                                            <span style={{color: '#007bff', fontSize: 12}}>
                                                                                {firstLabel}: {currencySymbol}{firstLevel}
                                                                            </span>
                                                                            <span style={{color: '#6f42c1', fontSize: 12, marginLeft: 10}}>
                                                                                {secondLabel}: {currencySymbol}{secondLevel}
                                                                            </span>
                                                                        </p>
                                                                    </div>
                                                                );
                                                            } catch (e) {
                                                                return null;
                                                            }
                                                        })()}
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

    return <>
        {cons}
    </>
};

export default StockList;






