import Model from "./Model";
import Mysql from "./../connections/mysql";
import MYSQL_CONSTANTS from "./../connections/mysql/constants";

import type { IModel } from "./interfaces/Model";
import type { ColumnDefinition } from "../connections/mysql/mysql";

class Images extends Model implements IModel {
  private name: string = "Images";

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
        name: "componentId",
        type: MYSQL_CONSTANTS.TYPE.INT,
      },
      {
        name: "componentType",
        type: MYSQL_CONSTANTS.TYPE.VARCHAR100,
      },
      {
        name: "url",
        type: "LONGTEXT" as any,
      },
      {
        name: "createdDate",
        type: MYSQL_CONSTANTS.TYPE.BIGINT,
      },
    ];

    await this.createTable(this.name, column);
  }

  async store({
    url,
    createdDate = Date.now(),
  }: {
    url: string;
    createdDate: number;
  }) {
    const result = await new Mysql().store(this.name, {
      url,
      createdDate,
    });

    return result;
  }
}

export default Images;
