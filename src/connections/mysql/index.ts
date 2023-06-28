import type { ColumnDefinition, ICondition } from "./mysql";
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

  queryWithCondition({
    field,
    condition,
    value,
    table,
  }: {
    field: string;
    condition: ICondition;
    value: string;
    table: string;
  }): Promise<any | null> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM ${table} WHERE ${field} ${condition} "${value}"`;

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

      console.log("[MYSQL] Create Table: ", sql);

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

  store(tableName: string, data: any) {
    return new Promise((resolve, reject) => {
      this.connection.connect((error) => {
        if (error) {
          console.error("Error connecting to MySQL database:", error.message);
          resolve(false);
          return;
        }

        const sql = `INSERT INTO ${tableName} SET ?`;

        this.connection.query(sql, data, (error, results) => {
          this.connection.end();

          if (error) {
            console.error("Error store to MySQL database:", error.message);
            resolve(false);
            return;
          }

          resolve(true);
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
