// @ts-nocheck
import { useEffect, useState } from 'react';

import axios from 'axios';

import localforage from 'localforage';

import dayjs from 'dayjs';

import { 
  RedoOutline,
  MailOpenOutline,
  DeleteOutline,
  ExclamationCircleFill
} from 'antd-mobile-icons';

import { Dialog } from 'antd-mobile';

import { saveUuid } from '../utils';

const prefix = location.href.indexOf('localhost') !== -1 ? '' : 'https://api.jixiang.chat';


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


const CopyDiv = (props)=>{
  return <><span style={{
    textDecoration: 'underline',
    margin: '0 5px',
    color: 'green'
  }}>{props.url}</span>（<span onClick={()=>{
        if ( copyToClip(props.url) ) {
          Toast.show({
            icon: 'success',
            content: '复制成功'
          });
        }
      }}><MailOpenOutline />复制</span>)
      </>
}

function strSplit(str){
  const strArr = String(str).split('.');
  let t = [
    strArr[0]
  ];

  if ( strArr[1] ) {
    t.push(
      strArr[1].substring(0, 2)
    );
  }

  return t.join('.');
}

import {
  Form,
  Input,
  Button,
  Selector,
  Toast,
  List,
  Tag,
  Grid,
  SpinLoading,
  Space,
  Radio,
  FloatingBubble
} from 'antd-mobile';

import styles from './index.module.css';

let clickIns = 0;
let submitClickIns = 0;
let clickSubmitCount = 0;

const ApplyForm = (props)=>{


    const [list, setList] = useState(props.list || []);

    const [subloading, setSubLoading] = useState(false);

    const [updateLoading, setUpdateLoading] = useState(false);

    const [force, setForce] = useState(false);

    const [hadAccount, setAccount] = useState(false);

    const [categroy, setCategory] = useState('');

    const [subtype, setSubtype] = useState('1');

    const [error, setError] = useState('');

    const [form] = Form.useForm();

    const now = dayjs().format('YYYY-MM-DD');



    const onChange = (datas)=>{
      setList(datas.list);
      props.onChange && props.onChange(datas);
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


    const updateList = async ()=>{
      setUpdateLoading(true);
      let newlist: any = [];
 
      for ( let i = 0, len = list.length; i < len; i ++ ) {
        const axx = list[i];
        const ax = await axios(`${prefix}/api/btc/list?apitype=getAccountListByKey`, {
          params: {
            accesskey: axx.accesskey,
            secret_key: axx.secret_key
          },
          method: 'get'
        });
   
        if ( ax?.data?.success ) {
          const pdatas = ax?.data?.data;
          if ( pdatas.list.length ) {
            newlist.push(
              pdatas.list[0]
            );
          }
        }
      }

      await localforage.setItem('robot_accout_list', JSON.stringify({
        time: new Date().getTime(),
        list: newlist,
      }));
      // setList(newlist || []);
      onChange({
        list: newlist || []
      });
      setUpdateLoading(false);
    }

    

    const onSubmit = async (type)=>{

     if ( type !== 'old-create' ) {
        if ( submitClickIns === 0 ) {
            submitClickIns = new Date().getTime();
        } else {
            const now = new Date().getTime();
            const dif = now - submitClickIns;
            const limit = clickSubmitCount < 10 ? 10000 : Math.ceil(clickSubmitCount/5)*1000;
            if ( dif < limit ) {
              Toast.show({
                icon: 'fail',
                content: `提交过于频繁，${Math.ceil(limit/1000)}S后再试试`
              });
              return;
            }
        }
     }


     if ( type !== 'old-create' ) {
       setSubLoading(true);
       clickSubmitCount ++;
     }

    //  if ( type === 'old-create' ) {
    //   debugger
    //  }

      const error = await checkErros(true);
      if ( error ) {
        setSubLoading(false);
        return;
      }

      let values = form.getFieldsValue();

      if ( type === 'old' || type === 'old-create' ) {

        // const ajaxurl = '/api/btc/list?apitype=getAccountListByKey';
        const ajaxurl = 'https://api.jixiang.chat/api/btc/list?apitype=getAccountListByKey';

        const res = await axios(ajaxurl, {
          params: values,
          method: 'get'
        });

        if ( res?.data?.success && res?.data?.data?.list?.length ) {
          const pdatas = res?.data?.data;

          let oldlist = list.slice();

          oldlist = oldlist.concat(pdatas?.list || []);

          await localforage.setItem('robot_accout_list', JSON.stringify({
            time: new Date().getTime(),
            list: oldlist
          }));
          
          // if ( type === 'old-create' ) {
            await saveUuid({
              names: oldlist.map(item=>item.name).join(',')
            });
          // }

          // setList(oldlist);
          onChange({
            list: oldlist
          });
          setError('');
          setForce(false);
          setSubLoading(false);
          return;
        } else {
          if ( type !== 'old-create' ) {
            Toast.show({
              icon: 'fail',
              content: res?.data?.errMsg || '没有找到账号'
            });
            setSubLoading(false);
            return;
          }
        }
      }

      if ( type === 'create' ) {

        values.category = categroy;

        const res2 = await axios(`${prefix}/api/btc/list?apitype=submitNewRobotMan`, {
          params: values,
          method: 'get'
        });

        if ( !res2.data.success ) {
          if ( res2?.data?.errMsg ){
            setError(res2?.data?.errMsg);
          }
          setSubLoading(false);
          Toast.show({
            icon: 'fail',
            content: res2?.data?.errMsg || '报错了，请稍后再试'
          });
          return;
        } else {
          await onSubmit('old-create');
          setError('');
          return;
        }
      }
    
     
      setForce(false);
      setSubLoading(false);
    }

    const onDelete = async (name)=>{
      Dialog.confirm({
        header: (
          <ExclamationCircleFill
            style={{
              fontSize: 64,
              color: 'var(--adm-color-warning)',
            }}
          />
        ),
        title: `确定删除账号『${name}』吗`,
        content: `注：删除只删除展示，机器人仍会进行`,
        onConfirm: async () => {
          let newlist = list.filter(item=>{
            return !(item.name === name);
          })
          
          await localforage.setItem('robot_accout_list', JSON.stringify({
            time: new Date().getTime(),
            list: newlist,
          }));
          
          await saveUuid({
            names: newlist.map(item=>item.name).join(',')
          });
          onChange({
            list: newlist || []
          });
          // setList(newlist || []);
        },
      })
    }


    // useEffect(()=>{
    //   if ( props.list?.length ) {
    //     setAccount(true);
    //   }
    // }, []);

    if ( updateLoading ) {
      return <>
                <div style={{marginTop: 140}} />
                <Space justify='center' block>
                  <SpinLoading color='primary' />
                </Space>
            </>
    }

    const cons: any = [];


    if ( !force && list.length ){

      cons.push(
        <div className={styles.wraptime}>
            最近更新时间：{list[0].gmt_times}
            <span onClick={async ()=>{
              if ( clickIns === 0 ) {
                  clickIns = new Date().getTime();
                  await updateList();
              } else {
                  const now = new Date().getTime();
                  const dif = now - clickIns;
                  if ( dif < 900000 ) {
                    Toast.show({
                      icon: 'fail',
                      content: '刷新过于频繁，5分钟后再试试'
                    });
                  } else {
                    await updateList();
                  }
              }
            }}><RedoOutline style={{marginLeft: 20}}/><span style={{fontSize: 10}}>刷新</span></span>
        </div>
      );

      cons.push(
        <div className={styles.wraplist} 
              style={{
                height: document.documentElement.clientHeight - 270,
                overflowY: 'auto',
                margin: '10px 20px'
            }}>
          <List>
                {(list||[]).map((user: any, index) => {

                  if ( !user ) {
                    return null;
                  }
                  const target = JSON.parse(user.danger_list || '{}');

                  const isNewAccount = !user.danger_list;

                  let profit_color = (user.profit - 0)  > 0 ? '#87d068' : '#c30959';

                  let r_time_last = '';

                  if ( user.is_init.length > 3 ) {
                    r_time_last = `${dayjs(now).diff(user.is_init, 'day', true)}`;
                  }

                  if ( isNewAccount ) {
                    return <List.Item
                              key={index}
                              description={
                                <div className={styles.listitem}>
                                  <div>账号已完成录入</div>
                                  <div>暂无数据，数据将在10分钟后同步完成</div>
                                  <DeleteOutline onClick={async ()=>{
                                     await onDelete(user.name);
                                  }}/>
                                </div>
                              }
                          >
                            <b style={{fontSize: 14}}>{user.name}</b>
                          </List.Item>
                  }

                  return <List.Item
                            key={index}
                            description={
                                <div className={styles.defs} style={{marginTop: 20}}>
                                  <Grid columns={2} gap={8}>
                                    <Grid.Item>
                                      <label>当前资金：</label>
                                      <span>{user.cur_usdt}</span>
                                    </Grid.Item>
                                    <Grid.Item>
                                      <label>累计收益：</label>
                                      <span>{user.total_profit}</span>
                                    </Grid.Item>
                                    <Grid.Item>
                                      <label>本周盈利：</label>
                                      <span>{user.week_profit}</span>
                                    </Grid.Item>
                                    <Grid.Item>
                                      <label>本月盈利：</label>
                                      <span>{user.month_profit}</span>
                                    </Grid.Item>
                                    
                                    <Grid.Item>
                                      <label>未实现盈亏：</label>
                                      <span>{target?.not_do_upl}</span>
                                    </Grid.Item>

                                    <Grid.Item>
                                      <label>今日盈亏：</label>
                                      <span style={{color: profit_color}}>{user.profit}</span>
                                    </Grid.Item>
                                  </Grid>
                                  <div className={styles.pos_list}>
                                    <p>
                                      <em className={styles.pos_list_label}>多：</em>
                                      <span className={styles.pos_list_block}>
                                      {
                                        (target.posList?.long || []).map(item=>{
                                          let rcolor = item.nPer > 0 ? '#87d068' : '#c30959';
                                          return <Tag color={rcolor} fill='outline'>{item.instId.replace('-USDT-SWAP', '')} {strSplit(item.nPer*100)}%</Tag>
                                        })
                                      }
                                      </span>
                                    </p>
                                    <p>
                                      <em className={styles.pos_list_label}>空：</em>
                                      <span className={styles.pos_list_block}>
                                      {
                                        (target.posList?.short || []).map(item=>{
                                          let rcolor = item.nPer > 0 ? '#87d068' : '#c30959';
                                          return <Tag color={rcolor} fill='outline'>{item.instId.replace('-USDT-SWAP', '')} {strSplit(item.nPer*100)}%</Tag>
                                        })
                                      }
                                      </span>
                                    </p>
                                  </div>
                            </div>
                            }
                        >
                            <b style={{fontSize: 14}}>{user.name}</b><span className={styles.desx}>( 杠杆：{user.notional_lever
} )</span>
                            {r_time_last ? <span className={styles.rtimes}>运行时长： {r_time_last}天</span> : null}
                        </List.Item>
                })}
            </List>
            {/* <FloatingBubble
              axis='x'
              magnetic='x'
              style={{
                '--initial-position-bottom': '24px',
                '--initial-position-right': '24px',
                '--edge-distance': '24px',
              }}
            >
              <Button>新增账号</Button>
              <ChatAddOutline onClick={()=>{
                setForce(true);
                setAccount(true);
              }} fontSize={32}/>
            </FloatingBubble> */}
          </div>
      );

      cons.push(
        <Space justify='center' block style={{marginTop: '20px'}}>
          <Button onClick={()=>{
            setForce(true);
            setAccount(false);
          }} size='small' color='primary' fill='outline'>申请新账号</Button>
          <Button onClick={()=>{
                setForce(true);
                setAccount(true);
          }} style={{marginLeft: '10px'}} size='small' color='primary' fill='none'>添加已有账号</Button>
        </Space>
      );

    } else if ( hadAccount ) {
      cons.push(
        <div className={styles.applywrap}>
              <Form
                  name='form'
                  form={form}
                  footer={
                    <div>
                      <Button loading={subloading} onClick={()=>{
                        onSubmit('old');
                      }} block type='submit' color='primary' size='large'>
                          提交
                      </Button>
                      <p><a onClick={()=>{
                        setAccount(false);
                      }}>没有账号，申请录入</a></p>
                    </div>
                  }
              >
                  <Form.Item 
                    name='accesskey' 
                    label='Api Key'
                    rules={[{ required: true }]}>
                      <Input placeholder='请输入Api Key' />
                  </Form.Item>
                  <Form.Item 
                    name='secret_key' 
                    label='Secret Key'
                    rules={[{ required: true }]}>
                      <Input placeholder='请输入Screct Key' />
                  </Form.Item>
              </Form>
        </div>
      );
    } else {
      form.setFieldValue('name', '乐乐')
      form.setFieldValue('accesskey', 'ab755572-a574-4614-8040-df4ed60b6391')
      // form.setFieldValue('parentKey', 'ab755572-a574-4614-8040-df4ed60b6391')
      // form.setFieldValue('accesskey', '1d95f874-5b3a-4df1-be82-b8c5af871dfc')
      form.setFieldValue('secret_key', '69F2062F5ACABAD01EE5864F03808F0A')
      // form.setFieldValue('secret_key', '29225DFEBCF21EC32E24C00F45378C11')
      form.setFieldValue('passphrase', 'Jixiang656@')
      form.setFieldValue('fromAccount', 'leleac656@163.com');

      if ( categroy === '1' ) {
        form.setFieldValue('subtype', subtype)
      }

      cons.push(
        <div className={styles.applywrap}>
              <div style={{margin: '12px 20px', wordBreak: 'all'}}>
                <p>{categroy === '1' ? <div>
                    <h4>[邀请模式]</h4> 
                    <ol>
                      <li>需要录入的账号为通过<CopyDiv url="https://ouxyi.club/join/meihao"/>或邀请码填写<CopyDiv url="meihao"/></li>
                      <li>如果当前为邀请账号的子账号，需要填写主账号的appkey进行验证</li>
                      <li>操作步骤可以点此查看</li>
                    </ol>
                  </div> : ''}</p>
                <p>{categroy === '4' ? <div><h4>[体验模式]</h4> <ol><li>需要录入的账号转到到OKX账号<CopyDiv url="1251223923@qq.com"/> <span style={{
                  textDecoration: 'underline',
                  color: 'red'
                }}>1USDT</span></li><li>录入成功自动获得至少7天的自动化机器交易体验</li><li>交易账户至少<span style={{
                  textDecoration: 'underline',
                  color: 'red'
                }}>200U</span>可用资金</li><li>操作步骤可以点此查看</li></ol></div> : ''}</p>
                <p>{categroy === '2' ? <div><h4>[付费模式] </h4><ol><li>通过支付每天1U的使用费进行合作，前7天免费使用，需要录入的账号转到到OKX账号<CopyDiv url="1251223923@qq.com"/> <span style={{
                  textDecoration: 'underline',
                  color: 'red'
                }}>5USDT</span></li><li>录入成功自动获得至少7天的自动化机器交易体验</li><li>交易账户至少<span style={{
                  textDecoration: 'underline',
                  color: 'red'
                }}>500U</span>可用资金</li><li>操作步骤可以点此查看</li></ol></div> : ''}</p>
                <p>{categroy === '3' ? <div><h4>[合作模式]</h4><ol><li>分成合作模式，合作咨询可加vx:<CopyDiv url="amuye1993"/>，如想直接体验，可以按下面步骤进行</li><li>需要录入的账号转到到OKX账号<CopyDiv url="1251223923@qq.com"/> <span style={{
                  textDecoration: 'underline',
                  color: 'red'
                }}>15USDT</span></li><li>录入成功自动获得至少30天的自动化机器交易体验</li><li>交易账户至少<span style={{
                  textDecoration: 'underline',
                  color: 'red'
                }}>1000U</span>可用资金</li><li>操作步骤可以点此查看</li></ol></div> : ''}</p>
                {
                  error ? <p style={{color: 'red', marginTop: 10}}>{error}</p> : null
                }
              </div>
              <Form
                  name='form'
                  form={form}
                  footer={
                    <div>
                      <Button 
                         loading={subloading}
                         onClick={()=>{
                           onSubmit('create')
                         }} block type='submit' color='primary' size='large'>
                          提交
                      </Button>
                      <p><a onClick={()=>{
                        setAccount(true);
                      }}>已有账号，进行账号录入</a></p>
                    </div>
                  }
              >
                <Form.Item 
                    name='type' 
                    label='申请类型'
                    rules={[{ required: true }]}>
                      <Selector
                          columns={4}
                          multiple={false}
                          onChange={(v)=>{
                             setCategory(v[0]);
                          }}
                          options={[
                          { label: '体验', value: '4' },
                          { label: '邀请', value: '1' },
                          { label: '付费', value: '2' },
                          { label: '合作', value: '3' },
                          ]}
                      />
                  </Form.Item>
                  <Form.Item 
                    name='name' 
                    label='名称'
                    rules={[{ required: true }]}>
                      <Input placeholder='请输入名称' clearable/>
                  </Form.Item>
                  {
                    categroy === '1' ? 
                    <Form.Item 
                      name='subtype' 
                      label='是否子账号'
                      rules={[{ required: true }]}>
                        <Radio.Group defaultValue='1' onChange={(v)=>{
                             setSubtype(String(v));
                          }}>
                          <Space>
                            <Radio value='1'>主账号</Radio>
                            <Radio value='2'>子账号</Radio>
                          </Space>
                        </Radio.Group>
                    </Form.Item> : null
                  }
                  {
                    subtype === '2' ? 
                    <Form.Item 
                      name='parentKey' 
                      label='主账号的accesskey'
                      rules={[{ required: true }]}>
                        <Input placeholder='请输入主账号的accesskey' clearable/>
                    </Form.Item> : null
                  }
                  <Form.Item 
                    name='passphrase' 
                    label='密码短语'
                    rules={[{ required: true }]}>
                      <Input placeholder='请输入密码短语' clearable/>
                  </Form.Item>
                  <Form.Item 
                    name='accesskey' 
                    label='Api Key'
                    rules={[{ required: true }]}>
                      <Input placeholder='请输入Api Key' clearable/>
                  </Form.Item>
                  <Form.Item 
                    name='secret_key' 
                    label='Secret Key'
                    rules={[{ required: true }]}>
                      <Input placeholder='请输入Screct Key' clearable/>
                  </Form.Item>
                  {
                    categroy !== '1' ? 
                    <Form.Item 
                    name='fromAccount' 
                    label='OKX账户'
                    rules={[{ required: true }]}>
                      <Input placeholder='请输入充值了1U的OKX账户(邮箱/手机号)' clearable/>
                    </Form.Item> : null
                  }
                  
              </Form>
        </div>
      );
    }


    return cons;
  
};


export default ApplyForm;