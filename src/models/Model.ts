import DBService from "./../connections/mysql";

import type { IRootModel } from "./interfaces/Model.d";
import type { ColumnDefinition } from "../connections/mysql/mysql";

class Model implements IRootModel {
  private dbService = new DBService();

  async createTable(
    name: string,
    column: ColumnDefinition[]
  ): Promise<boolean> {
    return await this.dbService.createTable(name, column);
  }

  async getAll(name: string): Promise<any[]> {
    const data = await this.dbService.getAll(name);
    return data;
  }
}

export default Model;
