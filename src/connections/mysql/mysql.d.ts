export interface ColumnDefinition {
  name: string;
  type: ITypeMysql;
  length?: number;
  precision?: number;
  scale?: number;
  primary?: boolean;
  notNull?: boolean;
  defaultValue?: any;
  autoIncrement?: boolean;
  unique?: boolean;
  unsigned?: boolean;
  zerofill?: boolean;
  foreignKey?: { table: string; column: string };
}

export type ITypeMysql =
  | "INT"
  | "BIGINT"
  | "TEXT"
  | "DATE"
  | "FLOAT"
  | "DOUBLE"
  | "DECIMAL"
  | "VARCHAR(20)"
  | "VARCHAR(50)"
  | "VARCHAR(100)"
  | "BOOLEAN"
  | "DATETIME"
  | "TIMESTAMP";

export type IOperation =
  | "="
  | ">"
  | "<"
  | ">="
  | "<="
  | "<>"
  | "BETWEEN"
  | "LIKE"
  | "IN";
