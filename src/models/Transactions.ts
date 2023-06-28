import Model from "./Model";
import MYSQL_CONSTANTS from "./../connections/mysql/constants";

import type { IModel } from "./interfaces/Model";
import type { ColumnDefinition } from "../connections/mysql/mysql";

class Transactions extends Model implements IModel {
  private name: string = "Transactions";

  async migrate() {
    const column: ColumnDefinition[] = [
      {
        name: "transactionId",
        type: MYSQL_CONSTANTS.TYPE.INT,
        unique: true,
        autoIncrement: true,
        notNull: true,
        primary: true,
        unsigned: true,
      },
      {
        name: "itemId",
        type: MYSQL_CONSTANTS.TYPE.INT,
        foreignKey: { table: "Items", column: "itemId" },
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
        name: "licensePlate",
        type: MYSQL_CONSTANTS.TYPE.VARCHAR100,
      },
      {
        name: "totalAmount",
        type: MYSQL_CONSTANTS.TYPE.DOUBLE,
      },
      {
        name: "vehicleType",
        type: MYSQL_CONSTANTS.TYPE.VARCHAR100,
      },
    ];

    await this.createTable(this.name, column);
  }
}

export default Transactions;
