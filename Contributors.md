### How to contribute

Below is a list of features and improvements to which you can contribute. If you have any additional ideas, please raise an issue or implement them as well!

- Testing library is VERY outdated; would need a lot of work to bring tests up to speed with most recent version(s).
- Adding the ability to better export queries when not connected to a live database
- Adding the ability to idenitfy the current user, and give feedback when an opperation is not allowed by a user when connected to a database
- Logging needs a default settings list and direct reimport into live database.
- The SQL code to import has been placed into the DB_Schemas folder along with SQL Schema dumps. Also, log setting functionality is currently limited to Postgres databases and the code needs to be expanded to query and display log setting info from MySQL databases.
- Increasing compatibility with other SQL-based databases: Although PostgreSQL and MySQL databases are perfectly compatible, dbSpy is currently not optimized to work with other SQL databases like Oracle SQL and Microsoft SQL.
- Add additional themes and graphical options to canvas and tables
- Live query feedback so users can see what their changes to the canvas look like as queries.
- As the ability to manipulate data has been recently added, there are not as many safe guards to prevent users from performing actions that are not allowed for some databases.
- Limiting the data types to only those possible for the database the user is currently working on.
- TypeORM has been implemented to connect to multiple databases but can be modified to further universal database functions
  -UI element to indicate connection status to database incase anything happens to connection.

--- Known bugs/issues ---

- Adding data to a newly created table will not display changes until refresh (Show Schema and then back to Show Data again). Data is successfully added, likely just a state-display bug
- Adding data to a table is not restricted by table's schema input-type (integer fields can accept strings, etc). Type-checking for inputs should be implemented (also numbers input as data are being input as strings).
- Loading in a database through user profile (not connecting through sql string) and then adding data to tables causes the Save and Load database buttons to lock up and be un-usable.
- Current database won't display when you Connect Database, only when you Load Database.
- Large Data Entries don't render in the data windows. A good example is loading in dbSpys Schema data column, and seeing it bug out.
- Certain cases of adding data have the ability to crash React-Flow (rare edge cases).
- Clearing canvas after connecting a database and attempting to create a new table without refreshing causes the website to crash (blank screen).
  --> Above bug no longer crashes dbySpy, but the Show Data portion of the program is not up to date with changes (Show Data will still show data from connected database and not the newly created table)
  --> Likely due to schemaStore and dataStore not being fully connected (??)
- Undo function will not revert the state of the canvas to the point where it is empty.
- When creating a new foreign key on a column, if you click submit while there is no table selected, the display area will shrink to a very small square in the top left corner of the page.
- Exporting your query has been affected in the course of adding additional databases and needs to be reorganized
- The webpage reverts back to dark mode when it is refreshed even when if it is already in light mode
