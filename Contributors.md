### How to contribute

Below is a list of features and improvements to which you can contribute. If you have any additional ideas, please raise an issue or implement them as well!

- Delete Table 
  - Add a command to delete a table from the canvas, making sure to implement checks to maintain data integrity
- Logging needs a default settings list and direct reimport into live database.
  - The SQL code to import has been placed into the DB_Schemas folder along with SQL Schema dumps. Also, log setting functionality is currently limited to Postgres databases and the code needs to be expanded to query and display log setting info from MySQL databases.
- Db-schemas
  - The schemas are saved under db_schemas and is saved in the server. Have a way to delete the schemas on the server from the front end. It would also be convenient to add these schemas to a list of existing schemas and be able to pull these schemas to display for the user to avoid having to make a new connection to the same database multiple times.
- Expand compatibility with other SQL database such as Oracle SQL, Microsoft SQL, IBM Db2, etc.
- Add additional themes and graphical options to canvas and tables
- Clean up unused dependencies from pre-4.0
- Connecting to PostgreSQL database
  - When connecting to PostgreSQL to grab the data from the database, it takes a really long time to load (approximately 2 minutes); further investigate pg_dump  alternatives for faster loading.

Known bugs/issues

- Table connection (hanle) does not automatically render after a foreign key is added and the column data is saved. 

