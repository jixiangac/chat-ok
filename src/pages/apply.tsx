
import { useEffect, useState } from 'react';

import axios from 'axios';

import localforage from 'localforage';

import dayjs from 'dayjs';

import { 
  RedoOutline,
} from 'antd-mobile-icons';


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
  FloatingBubble
} from 'antd-mobile';

import styles from './index.module.css';

let clickIns = 0;

const ApplyForm = (props)=>{


    const [list, setList] = useState(props.list || []);

    const [subloading, setSubLoading] = useState(false);

    const [updateLoading, setUpdateLoading] = useState(false);

    const [force, setForce] = useState(false);

    const [hadAccount, setAccount] = useState(false);

    const [form] = Form.useForm();

    const now = dayjs().format('YYYY-MM-DD');

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
        const ax = await axios(`https://api.jixiang.chat/api/btc/list?apitype=getAccountListByKey`, {
          params: {
            accesskey: axx.accesskey,
            secret_key: axx.secret_key
          },
          method: 'get'
        });
   
        if ( ax?.data?.success ) {
          const pdatas = ax?.data?.data;
          newlist.push(
            pdatas.list[0]
          );
        }
      }

      await localforage.setItem('robot_accout_list', JSON.stringify({
        time: new Date().getTime(),
        list: newlist,
      }));
      setList(newlist || []);
      setUpdateLoading(false);
    }

    const onSubmit = async ()=>{
      setSubLoading(true);
      const error = await checkErros(true);
      if ( error ) {
        setSubLoading(false);
        return;
      }
    
      const values = form.getFieldsValue();
      const res = await axios(`https://api.jixiang.chat/api/btc/list?apitype=getAccountListByKey`, {
        params: values,
        method: 'get'
      });

      if ( res?.data?.success ) {
        const pdatas = res?.data?.data;

        let oldlist = list.slice();

        oldlist = oldlist.concat(pdatas?.list || []);

        await localforage.setItem('robot_accout_list', JSON.stringify({
          time: new Date().getTime(),
          list: oldlist
        }));
        setList(oldlist);
      } else {
        Toast.show({
          icon: 'fail',
          content: res?.data?.errMsg || '报错了，请稍后再试'
        });
      }
      setForce(false);
      setSubLoading(false);
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
                maxHeight: document.documentElement.clientHeight - 270,
                overflowY: 'auto',
                margin: '10px 20px'
            }}>
          <List>
                {(list||[]).map((user: any, index) => {

                  if ( !user ) {
                    return null;
                  }
                  const target = JSON.parse(user.danger_list);
                  let profit_color = (user.profit - 0)  > 0 ? '#87d068' : '#c30959';

                  let r_time_last = '';

                  if ( user.is_init.length > 3 ) {
                    r_time_last = `${dayjs(now).diff(user.is_init, 'day', true)}`;
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
                                      <span>{target.not_do_upl}</span>
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
                                        (target.posList.long || []).map(item=>{
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
                                        (target.posList.short || []).map(item=>{
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
                      <Button loading={subloading} onClick={onSubmit} block type='submit' color='primary' size='large'>
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
      cons.push(
        <div className={styles.applywrap}>
              <Form
                  name='form'
                  form={form}
                  footer={
                    <div>
                      <Button 
                         loading={subloading}
                         onClick={onSubmit} block type='submit' color='primary' size='large'>
                          提交
                      </Button>
                      <p><a onClick={()=>{
                        setAccount(true);
                      }}>已有账号，进行账号录入</a></p>
                    </div>
                  }
              >
                  <Form.Item 
                    name='name' 
                    label='名称'
                    rules={[{ required: true }]}>
                      <Input placeholder='请输入名称' />
                  </Form.Item>
                  <Form.Item 
                    name='passphrase' 
                    label='密码短语'
                    rules={[{ required: true }]}>
                      <Input placeholder='请输入密码短语' />
                  </Form.Item>
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
                  <Form.Item 
                    name='type' 
                    label='申请类型'
                    rules={[{ required: true }]}>
                      <Selector
                          columns={3}
                          multiple={false}
                          options={[
                          { label: '邀请', value: '1' },
                          { label: '付费', value: '2' },
                          { label: '合作', value: '3' },
                          ]}
                      />
                  </Form.Item>
              </Form>
        </div>
      );
    }


    return cons;
  
};


export default ApplyForm;