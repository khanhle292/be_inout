import Model from "./Model";
import MYSQL_CONSTANTS from "./../connections/mysql/constants";

import type { IModel } from "./interfaces/Model";
import type { ColumnDefinition } from "../connections/mysql/mysql";

class VehiclePrices extends Model implements IModel {
  private name: string = "VehiclePrices";

  async migrate() {
    const column: ColumnDefinition[] = [
      {
        name: "vehiclePriceId",
        type: MYSQL_CONSTANTS.TYPE.INT,
        unique: true,
        autoIncrement: true,
        notNull: true,
        primary: true,
        unsigned: true,
      },
      {
        name: "vehicleTypeId",
        type: MYSQL_CONSTANTS.TYPE.INT,
        foreignKey: { table: "VehicleTypes", column: "vehicleTypeId" },
      },
      {
        name: "startDateTime",
        type: MYSQL_CONSTANTS.TYPE.TIMESTAMP,
      },
      {
        name: "endDateTime",
        type: MYSQL_CONSTANTS.TYPE.TIMESTAMP,
      },
      {
        name: "fixedPrice",
        type: MYSQL_CONSTANTS.TYPE.DOUBLE,
      },
      {
        name: "hourlyRate",
        type: MYSQL_CONSTANTS.TYPE.DOUBLE,
      },
      {
        name: "dailyRate",
        type: MYSQL_CONSTANTS.TYPE.DOUBLE,
      },
      {
        name: "monthlyRate",
        type: MYSQL_CONSTANTS.TYPE.DOUBLE,
      },
    ];

    await this.createTable(this.name, column);
  }
}

export default VehiclePrices;
