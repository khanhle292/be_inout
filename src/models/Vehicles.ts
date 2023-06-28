import Model from "./Model";
import MYSQL_CONSTANTS from "./../connections/mysql/constants";

import type { IModel } from "./interfaces/Model";
import type { ColumnDefinition } from "../connections/mysql/mysql";
import Mysql from "./../connections/mysql";
import { IVehicle } from "./../types/Vehicle.d";

class Vehicles extends Model implements IModel {
  private name: string = "Vehicles";

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
        name: "licensePlate",
        type: MYSQL_CONSTANTS.TYPE.TEXT,
      },
      {
        name: "vehiclePriceId",
        type: MYSQL_CONSTANTS.TYPE.INT,
        foreignKey: { table: "VehiclePrices", column: "id" },
      },
      {
        name: "prepaidAmount",
        type: MYSQL_CONSTANTS.TYPE.DOUBLE,
      },
      {
        name: "prepaidPaymentMethod",
        type: MYSQL_CONSTANTS.TYPE.VARCHAR100,
      },
      {
        name: "extraAmount",
        type: MYSQL_CONSTANTS.TYPE.DOUBLE,
      },
      {
        name: "extraPaymentMethod",
        type: MYSQL_CONSTANTS.TYPE.VARCHAR100,
      },
      {
        name: "totalAmount",
        type: MYSQL_CONSTANTS.TYPE.DOUBLE,
      },
      {
        name: "lastUpdated",
        type: MYSQL_CONSTANTS.TYPE.BIGINT,
      },
    ];

    return await this.createTable(this.name, column);
  }

  getAll(name: string): Promise<any[]> {
    const list = new Mysql().getAll(name);
    return list;
  }

  async store(
    {
      extraAmount = 0,
      totalAmount = 0,
      licensePlate,
      prepaidAmount = 0,
      vehiclePriceId,
    }: IVehicle,
    getNew = false
  ) {
    const result = await new Mysql().store(
      this.name,
      {
        extraAmount,
        totalAmount,
        licensePlate,
        prepaidAmount,
        vehiclePriceId,
      },
      getNew
    );

    return result;
  }

  async update(id: number, data: any) {
    const result = await new Mysql().updateRecordById(id, data, this.name);
    return result;
  }
}

export default Vehicles;
