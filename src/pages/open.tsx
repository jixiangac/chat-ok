// 根据pageschmea进行，表单渲染&&提交
import React, { useEffect, useState } from 'react';
// import {
//   Form,
//   Button,
//   Space,
//   Toast,
//   NoticeBar,
// } from 'antd-mobile';

import { render, unmountComponentAtNode } from 'react-dom';

import Popup from './pop';


function getAppendContainer() {
    const container = document.getElementById('open_schema_drawer_container');
    if (container) return container;
    const newContainer = document.createElement('div');
    newContainer.id = 'open_schema_drawer_container';
    document.body.appendChild(newContainer);
    return newContainer;
}

const popForm = (props)=>{

  const {
    timeid,
    title,
  } = props;
  
  const [visibleForm, setVisibleForm] = useState(false);

  useEffect(()=>{
    setVisibleForm(true);
  }, [timeid])

  const mainHeight = document.documentElement.clientHeight - 50;

  let overHeight = false;

  return <Popup
            visible={visibleForm}
            showCloseButton
            closeOnMaskClick
            position={props.position || 'bottom'}
            bodyStyle={{
              height: '100%',
              overflowY: 'auto'
            }}
            onClose={() => {
                props.onClose && props.onClose();
                setVisibleForm(false);
            }}
            destroyOnClose
            >
              <>
                {title ? <h3 style={{textAlign: 'center', borderBottom: '1px solid #eee', paddingBottom: 15}}>{title}</h3> : null}
                {visibleForm ? props.children : null}
              </>
            </Popup>
};

let cls: any = null;

function openFormDrawer(props: {
  children: any;
  title: string;
  onClose?: any;
  position?: string;
  beforeSubmit?: (formValue?: any) => Promise<boolean | void>;
}) {
    if ( cls ) {
      clearTimeout(cls);
    }
    return new Promise((resolve) => {
        const portalElement = React.createElement(popForm, {
          ...props,
          timeid: new Date().getTime(),
          onClose: (v) => {
            props.onClose && props.onClose(v);
            cls = setTimeout(function() {
                resolve(false);
                unmountComponentAtNode(getAppendContainer());
            }, 300);
          },
        });
        render(portalElement, getAppendContainer());
    });
}


export default openFormDrawer;