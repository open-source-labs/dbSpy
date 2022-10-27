### How to contribute

Below is a list of features and improvements to which you can contribute. If you have any additional ideas, please raise an issue or implement them as well!

- Exporting executable SQL query with every modification to your schema
  - After modifying/editing the database schemas, users should be able to generate executable queries isolated from their database which decreases security concerns. Users should be able to append all the query changes at the end of the new file and save this in their local machines. The codebase for query generation is in place, however not yet implemented into the current state management and front-end rendering.
- Logging modeling
  - After connnection to the database is made the user should be able to view, modify and save the current log settings. This will assist database administrators in keeping efficient log setup in mind during the early stages of DB modeling. The codebase is in place however not yet implemented into the current state management and front-end rendering.
- Add ability to log out from application, as currently log-in status will persist until app close 
- Save button 
  - Allow the user to save ER diagrams into projects that can be retrieved and reloaded for future use.
- Undo / Redo buttons
  - Allow the user to undo or redo changes made.
- History
  - Display history of the schema state after each change.
- Delete Table 
  - Add a command to delete a table from the canvas, making sure to implement checks to maintain data integrity
- Investigate React Flow additional functionality (there are tons!)
  - Take advantage of React Flow for a more dynamic interaction of the ER diagram.
- Refactoring TypeScript
  - There are some components that are not fully typed in TypeScript.
- Testing
  - Implementation of testing suite
- Logging needs a default settings list and direct reimport into live database.
  - The SQL code to import has been placed into the DB_Schemas folder along with SQL Schema dumps. Also, log setting functionality is currently limited to Postgres databases and the code needs to be expanded to query and display log setting info from MySQL databases.
- Security setting models need to be put in place for database tables as well as log files.
- Db-schemas
  - The schemas are saved under db_schemas and is saved in the server. Have a way to delete the schemas on the server from the front end. It would also be convenient to add these schemas to a list of existing schemas and be able to pull these schemas to display for the user to avoid having to make a new connection to the same database multiple times.
- Expand compatibility with other SQL database such as Oracle SQL, Microsoft SQL, IBM Db2, etc.
- Add additional themes and graphical options to canvas and tables
- Clean up unused dependencies from pre-3.0
- Connecting to PostgreSQL database
  - When connecting to PostgreSQL to grab the data from the database, it takes a really long time to load (approximately 2 minutes); further investigate pg_dump  alternatives for faster loading.

Known bugs/issues

- Table connection does not automatically render after a foreign key is added and the row data is saved. Currently, there is a popup message instructing the user to perform additional steps as a workaround.
- Generate a cleaner initial table position that takes into account the dimensions of the generated tables.
- Generate handle positions at primary key and foreign key row that the connection references.
- Create logic for only primary keys (rows) to be a target for foreign keys.
- The PrimaryKeyName in the References array within the database schema object is incorrect. It is pointing to the ReferencesPropertyName causing connection label to be incorrect. Review and update the SQL parser to correct this issue.
- One part of the main page updates dark/light theme visibly later than the rest upon toggle
