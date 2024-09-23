import * as SQLite from 'expo-sqlite';

class DatabaseManager {
  constructor() {
    this.db = null; // Initialisez votre base de données ici
    DatabaseManager.instance = this;
    this.initPromise = this._init(); // Appeler _init() et stocker la promesse
  }

  async _init() {
    try {
      console.log("Initialising database");
      this.db = await SQLite.openDatabaseAsync('DebtTracker');

      if (!this.db)
        throw new Error("Database not initialised");


      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS DebtTracker ( 
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        debt_buddy TEXT, 
        destination TEXT DEFAULT NULL, 
        amount INTEGER, 
        note TEXT DEFAULT NULL, 
        date DATE DEFAULT CURRENT_DATE, 
        duration INTEGER DEFAULT NULL);
      `);

      console.log(`Database initialised successfully`); 
    } catch (e) {
      console.log("Error while initialising database", e);
    }
  }

  static getInstance() {
    if (DatabaseManager.instance) {
      return DatabaseManager.instance;
    }

    return new DatabaseManager();
  }

  async getDebtList() {
    try {
      await this.initPromise; // Attendre que l'initialisation soit terminée

      if (!this.db)
        throw new Error("Database not initialised");
      
      const allRows = await this.db.getAllAsync(`SELECT * FROM DebtTracker`);
      console.log("Debt list acquired");
      return allRows;

    } catch (e) {
      console.log("Error while getting debt list", e);
      return [];
    }
  }

  async addDebt(debt) {
    try {
      await this.initPromise; // Attendre que l'initialisation soit terminée

      if (!this.db)
        throw new Error("Database not initialised");

      const { debt_buddy, destination, amount, note, date, duration } = debt;

      await this.db.execAsync(`
        INSERT INTO DebtTracker (debt_buddy, destination, amount, note, date, duration) VALUES ('${debt_buddy}', '${destination}', ${amount}, '${note}', '${date}', ${duration});
      `);

      console.log(`Debt with ${debt_buddy} for amount ${amount} added`);

    } catch (e) {
      console.log("Error while adding debt", e);
    }
  }

  async deleteDebt({id}) {
    try {
      await this.initPromise; // Attendre que l'initialisation soit terminée

      if (!this.db)
        throw new Error("Database not initialised");

      await this.db.execAsync(`
        DELETE FROM DebtTracker WHERE id = ${id};
      `);

      console.log(`Debt ${id} deleted`);
    } catch (e) {
      console.log("Error while deleting debt", e);
    }
  }
}

export default DatabaseManager;
