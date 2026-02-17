export interface Position {
  row: number;
  col: number;
}

export interface Block {
  id: string;
  colorIndex: number;
  row: number;
  col: number;
}

export type BlockColorIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;
