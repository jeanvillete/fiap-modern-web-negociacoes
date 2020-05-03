class IndexedDBService {

  static DATABASE_NAME = () => "negociacoesdb";
  static DEFAULT_VERSION = () => 1;
  static DEFAULT_KEY_GENERATOR = () => { return { autoIncrement: true }; };

  constructor(objectStoreDefinitions = [], dataBaseVersion = IndexedDBService.DEFAULT_VERSION()) {
    this._objectStoreDefinitions = objectStoreDefinitions;

    this._getConnection(
      window.indexedDB.open(
        IndexedDBService.DATABASE_NAME(), 
        dataBaseVersion
      )
    )
    .then(connection => this._connection = connection)
    .catch(error => {
      console.error("Erro ao tentar carregar banco IndexedDB; ", error);
      throw new Error("Não foi possível obter conexão com a base do IndexedDB.")
    });
  }

  _getConnection(requestOpenDB) {
    return new Promise( (resolve, reject) => {

      // ON UPGRADE NEEDED
      requestOpenDB.onupgradeneeded = event => {
        console.log("OnUpgradeNeeded; Necessário criar um novo banco ou atualizar um antigo por conta de upgrade de versão.");

        const connection = event.target.result;

        for (let objectStoreDefinition in this._objectStoreDefinitions) {
          if (connection.objectStoreNames.contains(objectStoreDefinition.objectStoreName)) {
            connection.deleteObjectStore(objectStoreDefinition.objectStoreName);
          }

          connection.createObjectStore(
            objectStoreDefinition.objectStoreName, 
            objectStoreDefinition.keyGenerator || IndexedDBService.DEFAULT_KEY_GENERATOR()
          );
        }
      };

      // ON CONNECTION SUCCESS
      requestOpenDB.onsuccess = event => {
        let connection = event.target.result;

        console.log("Conexão obtida com sucesso", connection);

        resolve( connection );
      };

      // ON CONNECTION ERROR
      requestOpenDB.onerror = event => {
        const error = event.target.error;

        console.error("Erro ao tentar obter conexão com a base de dados", error);

        reject(error);
      };
    });
  }

  overObjectStore(objectStoreName) {
    const defaultAccessMode = {read: false, write: false};
    return {
      accessMode: (accessMode = defaultAccessMode) => this._getAccessMode(accessMode, objectStoreName),
      doInsert: (objectInstance) => this._insert(objectInstance, defaultAccessMode, objectStoreName),
      retrieveAll: () => this._iterateOverCursor(defaultAccessMode, objectStoreName)
    };
  }

  _iterateOverCursor(accessMode, objectStoreName) {
    return new Promise( (resolve, reject) => {
      let transaction = this._getTransaction(accessMode, objectStoreName);

      let store = transaction.objectStore(objectStoreName);

      let cursor = store.openCursor();

      let elements = [];

      cursor.onsuccess = event => {
        let current = event.target.result;

        if (current) {
          elements.push(current.value);

          current.continue();
        } else {
          resolve(elements);
        }
      };

      cursor.onerror = event => {
        reject(event.target.error.name);
      };
    });
  }

  _getAccessMode(accessMode, objectStoreName) {
    return {
      doInsert: (objectInstance) => this._insert(objectInstance, accessMode, objectStoreName),
      retrieveAll: () => this._iterateOverCursor(accessMode, objectStoreName)
    };
  }

  _getTransaction(accessMode, objectStoreName) {
    const parsedAccessMode = `${ accessMode.read ? "read" : "" }${ accessMode.write ? "write" : accessMode.read ? "only" : "invalidmode" }`;
    console.log("access mode; ", parsedAccessMode);

    return this._connection.transaction(
      [objectStoreName],
      parsedAccessMode
    );
  }

  _insert(objectInstance, accessMode, objectStoreName) {
    return new Promise( (resolve, reject) => {
      let transaction = this._getTransaction(accessMode, objectStoreName);

      let objectStore = transaction.objectStore(objectStoreName);

      let addRequest = objectStore.add(objectInstance);

      addRequest.onsuccess = event => {
        resolve(
          event.target.result
        );
      };

      addRequest.onerror = event => {
        reject(
          event.target.result
        );
      };
    });
  }
}
