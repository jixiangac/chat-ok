---
trigger: always_on
---

编写demo.tsx 和  dc目录相关的代码的时候务必遵守


1.   样式分离，每个组件应该独立成一个文件夹，包含js/css文件
2.   store管理使用React的context，使用provider来包裹，所有状态管理在provider里
3.  存储使用localstorage进行
4.  风格：务必保持notion的黑白风格，简洁，简约
5. 不允许使用emoji图标