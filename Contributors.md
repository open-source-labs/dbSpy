### How to contribute

Below is a list of features and improvements to which you can contribute. If you have any additional ideas, please raise an issue or implement them as well!

- When a user clicks "Show Data" in build database after creating a table, it will immediately crash the display page if the table does not have a primary and foreign key connected to another table. This is due to it not have its "nodes and edges" not being rendered in the "Flow.tsx" file. A future iteration team should consider making a conditional statement that will alert the user that they currently have no Entity Relationship establish within their schema. (see first bug in known bugs/issue)
- Logging needs a default settings list and direct reimport into live database.
- The SQL code to import has been placed into the DB_Schemas folder along with SQL Schema dumps. Also, log setting functionality is currently limited to Postgres databases and the code needs to be expanded to query and display log setting info from MySQL databases.
- Increasing compatibility with other SQL-based databases: Although PostgreSQL and MySQL databases are perfectly compatible, dbSpy is currently not optimized to work with other SQL databases like Oracle SQL and Microsoft SQL.
- Saving multiple databases per user: dbSpy allows users to save and load one database per account, but allowing users to store multiple databases would make the application more functional.
- Allow users to delete one or more of their saved databases
- Add additional themes and graphical options to canvas and tables
- Live query feedback so users can see what their changes to the canvas look like as queries.
- As the ability to manipulate data has been recently added, there are not as many safe guards to prevent users from performing actions that are not allowed for some databases.
- Limiting the data types to only those possible for the database the user is currently working on.
- TypeORM has been implemented to connect to multiple databases but can be modified to further universal database functions

Known bugs/issues

- Clicking show data after building a database by adding tables causes the app to crash. *-Urgent Fix Needed*
- Clearing canvas after connecting a database and attempting to create a new table without refreshing causes the website to crash (blank screen).
- Undo function will not revert the state of the canvas to the point where it is empty.
- When creating a new foreign key on a column, if you click submit while there is no table selected, the display area will shrink to a very small square in the top left  corner of the page.
- Exporting your query has been affected in the course of adding additional databases and needs to be reorganized
- The webpage reverts back to dark mode when it is refreshed even when if it is already in light mode
  