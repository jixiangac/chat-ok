import React, { useEffect } from 'react';
import { useRive, useStateMachineInput } from '@rive-app/react-canvas';

export interface RiveCuteingProps {
  /** 进度百分比 (0-100) */
  progress: number;
}

/**
 * Rive 浇水动画组件
 * 使用 watering.riv 文件，通过 percentage 状态机控制进度
 */
export default function RiveCuteing({ progress }: RiveCuteingProps) {

  const { rive, RiveComponent } = useRive({
    src: 'https://g.alicdn.com/ai-code/fjre/0.0.2/cute.riv',
    stateMachines: 'water bottle',
    autoplay: true,
  });
  
  const percentageInput = useStateMachineInput(rive, 'water bottle', 'level');

  // 同步进度到 Rive 动画
  useEffect(() => {
    if (percentageInput) {
      percentageInput.value = Math.max(0, Math.min(100, progress));
    }
  }, [percentageInput, progress]);

  return <RiveComponent />;
}

export { RiveCuteing };
