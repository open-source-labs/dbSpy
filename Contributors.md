### How to contribute

Below is a list of features and improvements to which you can contribute. If you have any additional ideas, please raise an issue or implement them as well!

- Logging needs a default settings list and direct reimport into live database.
  - The SQL code to import has been placed into the DB_Schemas folder along with SQL Schema dumps. Also, log setting functionality is currently limited to    Postgres databases and the code needs to be expanded to query and display log setting info from MySQL databases.
- Db-schemas
  - The schemas are saved under db_schemas and is saved in the server. Have a way to delete the schemas on the server from the front end. It would also be convenient to add these schemas to a list of existing schemas and be able to pull these schemas to display for the user to avoid having to make a new connection to the same database multiple times.
- Complete the integration of SQLite as an optional database and expand compatibility with other SQL database such as IBM Db2, etc.
- Add additional themes and graphical options to canvas and tables
- Live query feedback so users can see what their changes to the canvas look like as queries.
<<<<<<< HEAD
- As the ability to manipulate data has been recently added, there are not as many safe guards to prevent users from performing actions that are not allowed for some databases.
- Limiting the data types to only those possible for the the database the user is currently working on.
- Adding Account specific functionality and the ability to save data to your account.
- TypeORM has been implemented to connect to multiple databases but can be modified to further universal database functions
=======
- Create login feature to save multiple databases to user account and be able to load multiple past databases.
>>>>>>> dev

Known bugs/issues

- Undo function will not revert the state of the canvas to the point where it is empty.
- Attempting to change the name of a column while adding a foreign key will result in the page crashing and going all white. Changing the column name is currently disabled.
- When creating a new foreign key on a column, if you click submit while there is no table selected, the display area will shrink to a very small square in the top left  corner of the page.
- Exporting your query has been affected in the course of adding additional databases and needs to be reorganized