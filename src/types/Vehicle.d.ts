export interface IVehicle {
  id: number;
  extraAmount?: number;
  totalAmount?: number;
  licensePlate: string;
  prepaidAmount?: number;
  vehiclePriceId: number;
  extraPaymentMethod?: IPaymentMethod;
  prepaidPaymentMethod?: IPaymentMethod;
}

export type IPaymentMethod = "CASH" | "MOMO";
