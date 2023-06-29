import Model from "./Model";
import Mysql from "./../connections/mysql";
import MYSQL_CONSTANTS from "./../connections/mysql/constants";

import type { IModel } from "./interfaces/Model";
import type { ColumnDefinition } from "../connections/mysql/mysql";
import type { IItem, IItemStatus } from "./../types/Item";
import { removeUndefinedObjects } from "./../utils/merchant";

class Items extends Model implements IModel {
  private name: string = "Items";

  async migrate() {
    const column: ColumnDefinition[] = [
      {
        name: "id",
        type: MYSQL_CONSTANTS.TYPE.INT,
        unique: true,
        autoIncrement: true,
        notNull: true,
        primary: true,
        unsigned: true,
      },
      {
        name: "merchantId",
        type: MYSQL_CONSTANTS.TYPE.INT,
        foreignKey: { table: "Merchants", column: "id" },
      },
      {
        name: "secretKey",
        type: MYSQL_CONSTANTS.TYPE.TEXT,
      },
      {
        name: "entryTime",
        type: MYSQL_CONSTANTS.TYPE.BIGINT,
      },
      {
        name: "exitTime",
        type: MYSQL_CONSTANTS.TYPE.BIGINT,
      },
      {
        name: "status",
        type: MYSQL_CONSTANTS.TYPE.VARCHAR20,
      },
      {
        name: "componentId",
        type: MYSQL_CONSTANTS.TYPE.INT,
      },
      {
        name: "componentType",
        type: MYSQL_CONSTANTS.TYPE.VARCHAR50,
      },
    ];

    await this.createTable(this.name, column);
  }

  async getAll(name: string): Promise<any[]> {
    const array = [
      {
        field: "merchantId",
        operator: "=",
        value: name,
      },
      {
        field: "status",
        operator: "=",
        value: "CHECKED_IN",
      },
    ];
    const list = await new Mysql().queryWithConditions(array as any, "Items");
    return list;
  }

  async getAllByUser(secretKey: string): Promise<any[]> {
    const sql = `SELECT * 
    FROM Items 
    JOIN Vehicles ON Vehicles.id = Items.componentId
    JOIN VehiclePrices ON VehiclePrices.id = Vehicles.vehiclePriceId
    JOIN VehicleTypes ON VehicleTypes.id = VehiclePrices.vehicleTypeId
    WHERE Items.secretKey = '${secretKey}' AND Items.status = 'CHECKED_IN'`;
    const list: any = await new Mysql().rawQuery(sql);
    return list;
  }

  async getAllDetail(id: string): Promise<any[]> {
    const sql = `SELECT * 
    FROM Items 
    JOIN Vehicles ON Vehicles.id = Items.componentId
    JOIN VehiclePrices ON VehiclePrices.id = Vehicles.vehiclePriceId
    JOIN VehicleTypes ON VehicleTypes.id = VehiclePrices.vehicleTypeId
    WHERE Items.merchantId = ${id} AND Items.status = 'CHECKED_IN'`;
    const list: any = await new Mysql().rawQuery(sql);
    return list;
  }

  async store(
    {
      merchantId,
      entryTime,
      secretKey,
      status = "CHECKED_IN",
      componentId,
      componentType,
    }: IItem,
    getNew = false
  ) {
    const result = await new Mysql().store(
      this.name,
      {
        componentType,
        componentId,
        merchantId,
        entryTime,
        secretKey,
        status,
      },
      getNew
    );

    return result;
  }

  async update(id: number, data: any) {
    const payload = removeUndefinedObjects(data);
    console.log("@@", payload);
    const result = await new Mysql().updateRecordById(id, payload, "Items");

    return result;
  }
}

export default Items;
