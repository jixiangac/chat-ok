// @ts-nocheck
import QuantPage from './quant';
import DemoPage from './demo';

export default function IndexPage() {
  // 检查 URL 参数，根据 type 参数加载不同的组件
  const urlParams = new URLSearchParams(window.location.search);
  const type = urlParams.get('type');
  
  // 根据 type 参数返回对应的组件
  if (type === 'taskmode') {
    return <DemoPage />;
  }
  
  // 默认返回量化首页
  return <QuantPage />;
}
