import Model from "./Model";
import MYSQL_CONSTANTS from "./../connections/mysql/constants";
import Mysql from "./../connections/mysql";

import type { IModel } from "./interfaces/Model";
import type { ColumnDefinition } from "../connections/mysql/mysql";

class Transactions extends Model implements IModel {
  private name: string = "Transactions";

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
        name: "itemId",
        type: MYSQL_CONSTANTS.TYPE.INT,
        foreignKey: { table: "Items", column: "id" },
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

  get(id: string): Promise<any[]> {
    return new Promise<any[]>(async (resolve) => {
      try {
        const result = await new Mysql().rawQuery(`
        SELECT t.*
        FROM transaction AS t
        JOIN items AS i ON t.itemId = i.id
        WHERE i.merchantId = ${id};`);

        if (result && Array.isArray(result)) {
          resolve(result);
        } else {
          resolve([]);
        }
      } catch (error) {
        resolve([]);
      }
    });
  }

  async store(data: any) {
    const payload = {
      itemId: data?.id,
      entryTime: data?.entryTime,
      exitTime: data?.exitTime,
      status: data?.status,
      prepaidAmount: data?.prepaidAmount,
      prepaidPaymentMethod: data?.prepaidPaymentMethod,
      extraPaymentMethod: data?.extraPaymentMethod,
      extraAmount: data?.extraAmount,
      licensePlate: data?.licensePlate,
      totalAmount: data?.totalAmount,
      vehicleType: data?.typeName,
      secretKey: data?.secretKey,
    };
    const result = await new Mysql().store(this.name, {
      ...payload,
    });

    return result;
  }
}

export default Transactions;
