import type { IVehicleTypes } from "./../../types/VehicleTypes";

export interface IModel {
  migrate(): void;
}

export interface IRootModel {
  getAll(name: string): Promise<any[]>;
  createTable(name: string, column: ColumnDefinition[]): void;
}
