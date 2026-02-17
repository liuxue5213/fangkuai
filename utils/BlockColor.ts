export const BLOCK_COLORS = [
  '#FF4757',  // 红色 - 鲜艳的红色
  '#00D9A5',  // 青色 - 鲜艳的青绿色
  '#2E86DE',  // 蓝色 - 鲜艳的蓝色
  '#2ECC71',  // 绿色 - 鲜艳的绿色
  '#FFD700',  // 黄色 - 金黄色
  '#E84393',  // 粉色 - 偏紫的粉色
  '#9B59B6'   // 紫色 - 紫色
] as const;

export type BlockColorIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const getRandomColorIndex = (): BlockColorIndex => {
  return Math.floor(Math.random() * 7) as BlockColorIndex;
};

export const getColorByIndex = (index: number): string => {
  return BLOCK_COLORS[index % 7];
};
