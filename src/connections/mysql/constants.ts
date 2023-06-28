import { ITypeMysql } from "./mysql";

interface IMysqlConstant {
  TYPE: Record<string, ITypeMysql>;
}

const MYSQL_CONSTANTS: IMysqlConstant = {
  TYPE: {
    INT: "INT",
    TEXT: "TEXT",
    DATE: "DATE",
    FLOAT: "FLOAT",
    DOUBLE: "DOUBLE",
    DECIMAL: "DECIMAL",
    VARCHAR20: "VARCHAR(20)",
    VARCHAR50: "VARCHAR(50)",
    VARCHAR100: "VARCHAR(100)",
    BOOLEAN: "BOOLEAN",
    DATETIME: "DATETIME",
    TIMESTAMP: "TIMESTAMP",
  },
};

export default MYSQL_CONSTANTS;
