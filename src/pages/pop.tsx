// AntMobile 组件 使用了useDrag作为默认手势，导致会让跟手滑动冲突有一些BUG，做一个兼容组件
// 禁止掉onClose使用
// 已提交issuse: https://github.com/ant-design/ant-design-mobile/issues/6174

import { 
    Popup, 
} from 'antd-mobile';

import { CloseOutline } from 'antd-mobile-icons';
import classNames from 'classnames';

const NewPopUp = (props)=>{


    const newProps = Object.assign({}, props);

    const {
      visible,
      children,
      onMaskClick,
      closeOnMaskClick,
    } = newProps;

    const showCloseButton = newProps.showCloseButton !== undefined ? newProps.showCloseButton : false;

    delete newProps.showCloseButton;

    const customCloseEvent = newProps.onClose;

    delete newProps.onClose;

    const closePop = ()=>{
      customCloseEvent && customCloseEvent();
    };

    const config = {
      ...newProps,
      visible,
      onMaskClick: ()=>{
        onMaskClick && onMaskClick();
        if ( closeOnMaskClick ) {
          closePop();
        }
      },
    };

    return <Popup {...config}>
             <>
                {showCloseButton ? <a
                    className={classNames(
                        `adm-popup-close-icon`,
                        'adm-plain-anchor'
                    )}
                    onClick={() => {
                        closePop();
                    }}
                    role='button'
                    >
                    <CloseOutline />
                    </a> : null
                }
                {children}
            </>
          </Popup>
  
};


export default NewPopUp;