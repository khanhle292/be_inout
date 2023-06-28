export interface IItem {
  id: number;
  merchantId: number;
  secretKey: string;
  entryTime: number;
  exitTime: number;
  status: IItemStatus;
  componentId: number;
  componentType: string;
}

export type IItemStatus = "CHECKED_IN" | "CHECKED_OUT";
