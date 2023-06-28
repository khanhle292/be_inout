import type { ColumnDefinition, IOperation } from "./mysql";
import mysql, { Connection } from "mysql2";

class Mysql {
  private connection: Connection = mysql.createConnection({
    host: "127.0.0.1", // Replace with your MySQL host
    user: "root", // Replace with your MySQL username
    password: "admin", // Replace with your MySQL password
    database: "MOMO_INOUT", // Replace with your MySQL database name
    port: 3306,
    connectionLimit: 10,
  });

  getAll(tableName: string): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      try {
        const sql = `SELECT * FROM ${tableName}`;

        this.connection.query(sql, (error, results: any[]) => {
          if (error) {
            console.error("Error fetching data:", error.message);
            reject([]);
            return;
          } else {
            console.log("Data retrieved successfully:");
            resolve(results);
          }

          this.connection.end(); // Close the MySQL connection
        });
      } catch (error: any) {
        console.log("[MYSQL]", error?.message);
        resolve([]);
      }
    });
  }

  rawQuery(query: string) {
    return new Promise((resolve, reject) => {
      this.connection.connect((error) => {
        if (error) {
          console.error("Error connecting to MySQL database:", error.message);
          reject(error.message);
          return;
        } else {
          this.connection.query(query, (error, results) => {
            this.connection.end();
            if (error) {
              console.error("Error query to MySQL database:", error.message);
              reject(error.message);
              return;
            }

            resolve(results);
          });
        }
      });
    });
  }

  queryWithCondition({
    field,
    operator,
    value,
    table,
  }: {
    field: string;
    operator: IOperation;
    value: string;
    table: string;
  }): Promise<any | null> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM ${table} WHERE ${field} ${operator} "${value}"`;

      this.connection.connect((error) => {
        if (error) {
          console.error("Error connecting to MySQL database:", error.message);
          reject(error.message);
          return;
        } else {
          this.connection.query(sql, (error, results) => {
            this.connection.end();
            if (error) {
              console.error("Error query to MySQL database:", error.message);
              reject(error.message);
              return;
            }

            resolve(results);
          });
        }
      });
    });
  }

  queryWithConditions(
    conditions: Array<{
      field: string;
      operator: IOperation;
      value: string;
    }>,
    table: string
  ): Promise<any | null> {
    return new Promise((resolve, reject) => {
      let whereClause = "";
      const conditionStrings = conditions.map((condition) => {
        return `${condition.field} ${condition.operator} "${condition.value}"`;
      });
      if (conditionStrings.length > 0) {
        whereClause = `WHERE ${conditionStrings.join(" AND ")}`;
      }

      const sql = `SELECT * FROM ${table} ${whereClause}`;

      console.log("@@", sql);
      this.connection.connect((error) => {
        if (error) {
          console.error("Error connecting to MySQL database:", error.message);
          reject(error.message);
          return;
        } else {
          this.connection.query(sql, (error, results) => {
            this.connection.end();
            if (error) {
              console.error("Error querying MySQL database:", error.message);
              reject(error.message);
              return;
            }
            resolve(results);
          });
        }
      });
    });
  }

  createTable(
    tableName: string,
    columns: ColumnDefinition[]
  ): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      let columnDefinitions = "";

      columns.forEach((column, index) => {
        columnDefinitions += `${column?.name} ${column?.type}`;

        if (column?.length) {
          columnDefinitions += `(${column.length})`;
        }

        if (column?.notNull) {
          columnDefinitions += " NOT NULL";
        }

        if (column?.defaultValue !== undefined) {
          columnDefinitions += ` DEFAULT ${column?.defaultValue}`;
        }

        if (column?.autoIncrement) {
          columnDefinitions += " AUTO_INCREMENT";
        }

        if (column?.primary) {
          columnDefinitions += " PRIMARY KEY";
        }

        if (column?.unique) {
          columnDefinitions += " UNIQUE";
        }

        if (column?.foreignKey) {
          const { table, column: foreignKeyColumn } = column?.foreignKey;
          columnDefinitions += ` REFERENCES ${table}(${foreignKeyColumn})`;
        }

        if (index < columns.length - 1) {
          columnDefinitions += ", ";
        }
      });

      const sqlDrop = `DROP TABLE IF EXISTS ${tableName};`;
      const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions})`;

      this.connection.connect((error) => {
        if (error) {
          console.error("Error connecting to MySQL database:", error);
        } else {
          console.log("Connected to MySQL database!");
          this.connection?.query(sqlDrop, (error) => {
            if (error) {
              console.error("Error dropping table:", error.message);
              resolve(false);
            } else {
              this.connection?.query(sql, (error) => {
                this.connection?.end(); // Close the MySQL connection
                if (error) {
                  console.error("Error creating table:", error.message);
                  resolve(false);
                } else {
                  console.log("Table created successfully!");
                  resolve(true);
                }
              });
            }
          });
        }
      });
    });
  }

  getLatestRecord(tableName: string) {
    return new Promise<any>((resolve) => {
      const sql = `SELECT * FROM ${tableName} ORDER BY id DESC LIMIT 1`;
      this.connection.connect((error) => {
        if (error) {
          console.error("Error connecting to MySQL database:", error.message);
          resolve(false);
          return;
        }

        this.connection.query(sql, (error, results) => {
          if (error) {
            console.error("Error store to MySQL database:", error.message);
            resolve(false);
            return;
          }

          if (Array.isArray(results) && results?.length > 0) {
            resolve(results[0]);
          }
          resolve(false);
          this.connection.end();
        });
      });
    });
  }

  updateRecordById(id: number, data: any, table: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const updateSql = `UPDATE ${table} SET ? WHERE id = ?`;

      this.connection.query(updateSql, [data, id], (error, results) => {
        if (error) {
          console.error("Error updating record:", error);
          reject(error);
          return;
        }

        console.log("Record updated successfully!");
        resolve(true);
      });
    });
  }

  store(tableName: string, data: any, getNew: boolean = false) {
    return new Promise(async (resolve) => {
      this.connection.connect((error) => {
        if (error) {
          console.error("Error connecting to MySQL database:", error.message);
          resolve(false);
          return;
        }

        const sql = `INSERT INTO ${tableName} SET ?`;

        this.connection.query(sql, data, async (error, results) => {
          if (error) {
            console.error("Error store to MySQL database:", error.message);
            resolve(false);
            return;
          }

          if (getNew) {
            const data = await this.getLatestRecord(tableName);
            if (data) {
              resolve(data);
              return;
            }
          }

          resolve(true);
          this.connection.end();
        });
      });
    });
  }

  dropTable(tableName: string): void {
    const sql = `DROP TABLE IF EXISTS ${tableName}`;

    this.connection.connect((error) => {
      if (error) {
        console.error("Error connecting to MySQL database:", error.message);
      } else {
        console.log("Connected to MySQL database!");
        this.connection.query(sql, (error) => {
          if (error) {
            console.error("Error dropping table:", error.message);
          } else {
            console.log("Table dropped successfully!");
          }

          this.connection.end(); // Close the MySQL connection
        });
      }
    });
  }
}

export default Mysql;
