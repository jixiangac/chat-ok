import React, { useEffect } from 'react';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';

export interface DieCatProps {
  /** 进度百分比 (0-100) */
  progress: number;
}

/**
 * Rive 浇水动画组件
 * 使用 watering.riv 文件，通过 percentage 状态机控制进度
 */
export default function DieCat({ progress }: DieCatProps) {
  
  const { rive, RiveComponent } = useRive({
    src: '/cat.riv',
    stateMachines: 'State Machine 1',
    autoplay: true,
  });

  return <RiveComponent />;
}

export { DieCat };
