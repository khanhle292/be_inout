import Model from "./Model";
import MYSQL_CONSTANTS from "./../connections/mysql/constants";

import type { IModel } from "./interfaces/Model";
import type { ColumnDefinition } from "../connections/mysql/mysql";

import Mysql from "../connections/mysql";
import { IMerchantInfo } from "./../types/Response.d";

class Merchants extends Model implements IModel {
  private name: string = "Merchants";

  async migrate() {
    const column: ColumnDefinition[] = [
      {
        name: "merchantId",
        type: MYSQL_CONSTANTS.TYPE.INT,
        unique: true,
        autoIncrement: true,
        notNull: true,
        primary: true,
        unsigned: true,
      },
      {
        name: "merchantUsername",
        type: MYSQL_CONSTANTS.TYPE.VARCHAR100,
        notNull: true,
        unique: true,
      },
      {
        name: "merchantPasswordHash",
        type: MYSQL_CONSTANTS.TYPE.VARCHAR100,
        notNull: true,
      },
      {
        name: "merchantName",
        type: MYSQL_CONSTANTS.TYPE.VARCHAR100,
      },
      {
        name: "merchantAddress",
        type: MYSQL_CONSTANTS.TYPE.TEXT,
      },
      {
        name: "merchantConfig",
        type: MYSQL_CONSTANTS.TYPE.TEXT,
      },
    ];

    await this.createTable(this.name, column);
  }

  login(username: string, password: string) {
    return new Promise<IMerchantInfo | null>((resolve) => {
      try {
        new Mysql()
          .queryWithCondition({
            field: "merchantUsername",
            condition: "=",
            value: username,
            table: this.name,
          })
          .then((value: IMerchantInfo[]) => {
            if (Array.isArray(value) && value.length > 0) {
              if (value[0]?.merchantPasswordHash === password) {
                resolve(value[0]);
              }
            }
          });
      } catch (error) {
        console.log("[ERROR][MERCHANT][LOGIN]", error);
        resolve(null);
      }
    });
  }
}

export default Merchants;
