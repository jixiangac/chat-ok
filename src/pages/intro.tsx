// @ts-nocheck
import axios from 'axios';

import dayjs from 'dayjs';

import {
    Tabs,
    CapsuleTabs
} from 'antd-mobile';

import { useEffect, useState } from 'react';

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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const IntroList = (props)=>{


   const TabList = [{
      title: '机器人策略',
      content: ()=>{
        return <CapsuleTabs defaultActiveKey={"0"}>
                    <CapsuleTabs.Tab title="交易策略" key="0" destroyOnClose>
                        加加加
                    </CapsuleTabs.Tab>
                    <CapsuleTabs.Tab title="机器人策略" key="1" destroyOnClose>
                        222
                    </CapsuleTabs.Tab>
                    <CapsuleTabs.Tab title="机器人策略" key="2" destroyOnClose>
                        222
                    </CapsuleTabs.Tab>
                    <CapsuleTabs.Tab title="机器人策略" key="3" destroyOnClose>
                        222
                    </CapsuleTabs.Tab>
                    <CapsuleTabs.Tab title="机器人策略" key="4" destroyOnClose>
                        222
                    </CapsuleTabs.Tab>
                    <CapsuleTabs.Tab title="机器人策略" key="5" destroyOnClose>
                        222
                    </CapsuleTabs.Tab>
                    <CapsuleTabs.Tab title="机器人策略" key="6" destroyOnClose>
                        222
                    </CapsuleTabs.Tab>
                    <CapsuleTabs.Tab title="机器人策略" key="7" destroyOnClose>
                        222
                    </CapsuleTabs.Tab>
                </CapsuleTabs>
      }
   },{
      title: '交流相关',
      content: ()=>{
        return <p>fdfdf</p>
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