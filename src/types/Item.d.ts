export interface IItem {
  itemId: number;
  merchantId: number;
  agentId: string;
  entryTime: string;
  exitTime: string;
  status: IItemStatus;
  componentId: number;
  componentType: number;
}

export type IItemStatus = "CHECKED_IN" | "CHECKED_OUT";
