import Model from "./Model";
import MYSQL_CONSTANTS from "./../connections/mysql/constants";

import type { IModel } from "./interfaces/Model";
import type { ColumnDefinition } from "../connections/mysql/mysql";
import Mysql from "./../connections/mysql";

class Vehicles extends Model implements IModel {
  private name: string = "Vehicles";

  async migrate() {
    const column: ColumnDefinition[] = [
      {
        name: "VehicleId",
        type: MYSQL_CONSTANTS.TYPE.INT,
        unique: true,
        autoIncrement: true,
        notNull: true,
        primary: true,
        unsigned: true,
      },
      {
        name: "type",
        type: MYSQL_CONSTANTS.TYPE.VARCHAR50,
      },
      {
        name: "licensePlate",
        type: MYSQL_CONSTANTS.TYPE.TEXT,
      },
      {
        name: "vehiclePriceId",
        type: MYSQL_CONSTANTS.TYPE.INT,
        foreignKey: { table: "VehiclePrices", column: "vehiclePriceId" },
      },
      {
        name: "secretKey",
        type: MYSQL_CONSTANTS.TYPE.TEXT,
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
    ];

    return await this.createTable(this.name, column);
  }

  getAll(name: string): Promise<any[]> {
    const list = new Mysql().getAll(name);
    return list;
  }
}

export default Vehicles;
