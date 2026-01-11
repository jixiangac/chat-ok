/**
 * 图标配置 - 蜡笔风格
 */

import {
  Cake,
  Heart,
  Baby,
  GraduationCap,
  Plane,
  Home,
  Briefcase,
  Star,
  Gift,
  Calendar,
  Trophy,
  Music,
  Camera,
  Book,
  Coffee,
  Sun,
  Moon,
  Sparkles,
  Flag,
  MapPin,
  Flower2,
  Cat,
  Dog,
  Car,
  Bike,
  type LucideIcon,
} from 'lucide-react';

export interface IconConfig {
  name: string;
  component: LucideIcon;
  defaultColor: string;
}

// 蜡笔风格颜色 - 柔和、低饱和度
export const CRAYON_COLORS = [
  '#E8B4B8', // 蜡笔粉
  '#A8D8EA', // 蜡笔蓝
  '#B8E0D2', // 蜡笔绿
  '#EAD2AC', // 蜡笔黄
  '#D4B8E0', // 蜡笔紫
  '#F5C6AA', // 蜡笔橙
  '#C9E4CA', // 蜡笔薄荷
  '#F0E6EF', // 蜡笔淡紫
  '#E0D4C8', // 蜡笔米色
  '#B8C9E0', // 蜡笔灰蓝
];

// 预设图标列表
export const PRESET_ICONS: IconConfig[] = [
  { name: 'Cake', component: Cake, defaultColor: '#E8B4B8' },
  { name: 'Heart', component: Heart, defaultColor: '#E8B4B8' },
  { name: 'Baby', component: Baby, defaultColor: '#A8D8EA' },
  { name: 'GraduationCap', component: GraduationCap, defaultColor: '#D4B8E0' },
  { name: 'Plane', component: Plane, defaultColor: '#A8D8EA' },
  { name: 'Home', component: Home, defaultColor: '#EAD2AC' },
  { name: 'Briefcase', component: Briefcase, defaultColor: '#B8C9E0' },
  { name: 'Star', component: Star, defaultColor: '#EAD2AC' },
  { name: 'Gift', component: Gift, defaultColor: '#F5C6AA' },
  { name: 'Calendar', component: Calendar, defaultColor: '#B8E0D2' },
  { name: 'Trophy', component: Trophy, defaultColor: '#EAD2AC' },
  { name: 'Music', component: Music, defaultColor: '#D4B8E0' },
  { name: 'Camera', component: Camera, defaultColor: '#B8C9E0' },
  { name: 'Book', component: Book, defaultColor: '#E0D4C8' },
  { name: 'Coffee', component: Coffee, defaultColor: '#E0D4C8' },
  { name: 'Sun', component: Sun, defaultColor: '#EAD2AC' },
  { name: 'Moon', component: Moon, defaultColor: '#D4B8E0' },
  { name: 'Sparkles', component: Sparkles, defaultColor: '#EAD2AC' },
  { name: 'Flag', component: Flag, defaultColor: '#E8B4B8' },
  { name: 'MapPin', component: MapPin, defaultColor: '#F5C6AA' },
  { name: 'Flower2', component: Flower2, defaultColor: '#E8B4B8' },
  { name: 'Cat', component: Cat, defaultColor: '#F5C6AA' },
  { name: 'Dog', component: Dog, defaultColor: '#E0D4C8' },
  { name: 'Car', component: Car, defaultColor: '#B8C9E0' },
  { name: 'Bike', component: Bike, defaultColor: '#B8E0D2' },
];

// 根据图标名称获取图标配置
export function getIconConfig(iconName: string): IconConfig | undefined {
  return PRESET_ICONS.find((icon) => icon.name === iconName);
}

// 获取默认图标
export function getDefaultIcon(): IconConfig {
  return PRESET_ICONS[0];
}

// 获取默认颜色
export function getDefaultColor(): string {
  return CRAYON_COLORS[0];
}
