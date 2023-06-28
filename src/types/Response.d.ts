export interface IMerchantInfo {
  id: number;
  merchantAgentId: number;
  merchantName: string;
  merchantUsername: string;
  merchantPasswordHash: string;
  merchantAddress: string;
  merchantConfig: string; //object string
}

export interface IErrorCode {}
