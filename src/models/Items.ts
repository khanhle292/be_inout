import Model from "./Model";
import Mysql from "./../connections/mysql";
import MYSQL_CONSTANTS from "./../connections/mysql/constants";

import type { IModel } from "./interfaces/Model";
import type { ColumnDefinition } from "../connections/mysql/mysql";
import type { IItemStatus } from "@/types/Item";

class Items extends Model implements IModel {
  private name: string = "Items";

  async migrate() {
    const column: ColumnDefinition[] = [
      {
        name: "itemId",
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
        foreignKey: { table: "Merchants", column: "merchantId" },
      },
      {
        name: "agentId",
        type: MYSQL_CONSTANTS.TYPE.VARCHAR100,
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
    const list = await new Mysql().queryWithCondition({
      field: "merchantId",
      condition: "=",
      value: name,
      table: "Items",
    });
    return list;
  }

  async store({
    merchantId,
    entryTime,
    agentId,
    status,
  }: {
    merchantId: number;
    entryTime: number;
    agentId: string;
    status: IItemStatus;
  }) {
    const result = await new Mysql().store(this.name, {
      merchantId,
      entryTime,
      agentId,
      status,
    });

    return result;
  }
}

export default Items;
