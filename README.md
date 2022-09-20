<div align="center">

<a href="https://makeapullrequest.com">![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)</a>
<a href="https://img.shields.io/badge/version-1.0.1-blue">![Version](https://img.shields.io/badge/version-1.0.1-blue)</a>
![GitHub Stars](https://img.shields.io/github/stars/oslabs-beta/JAKT?color=%23fb7182)
![MIT License](https://img.shields.io/badge/license-MIT-yellow)

</div>

<div align="center">
  
![logo 5](https://user-images.githubusercontent.com/11093217/179366043-624ba23a-408d-499a-a1aa-162acf56d247.jpg)

</div>

<h1 align="center">Visualize, modify, and build your database with dbSpy!</h1>
<p>dbSpy is an open-source data modeling tool to facilitate relational database development.</p>

<!-- dbSpy is an open-source visualization tool to facilitate relational database model development using entity relationship diagrams and homogeneous database migration -->

---

### Key Features

1. **Database Connection:** Connect to a SQL database

2. **Database File Upload:** Upload a database's SQL file

3. **ER Diagrams:** Visualize the entity relationship diagram of a database

4. **Schema Modification:** Modify a database's schema

5. **Database Building:** Create a new database from scratch using entity relationship diagrams

6. **SQL Query Generator:** Generate an executable SQL query with every modification to your schema

7. **Screenshot:** Take a screenshot of the canvas with all your tables (BETA)

8. **Time Travel:** Provides a history of edits for easier backtracking

9. **Exporting Queries:** Allows updated changes of queries to be saved as a SQL file for client imports to their database

10. **Log Modeling:** Provides a tool for admins to pull, view, modify, and export log settings from an existing database

11. **Compatible SQL Database:** Current dbSpy is compatible with PostgreSQL and MySQL database

12. **Dark Mode** Additional visual setting to provide a more comfortable viewing experience in low-light environements

13. **Database Integrity Assurance** Database Logic Check is performed as the client edits the database to ensure the integrity of the database

14. **Visualizing Individual Table Connections** Relationships of individual tables are now easily identified when clicking on a table. 
---

### Use Cases

<details><summary>Connecting to an existing database</summary>
<ul>
Renders an ER diagram of the existing database and provides an interface for users to both modify existing tables and create new tables. A log of changes is stored, and at any point, the user can execute a transaction containing the changes, such that they are reflected in the existing database.
</ul>
</details>
<details><summary>Uploading your database's SQL file</summary>
<ul>
Renders an ER diagram for the provided SQL file (db dump) and provides an interface for a user to both modify existing tables and create new tables. Changes are converted into the corresponding queries, which the user can view and execute on their own database outside of dbSpy.
</ul>
</details>
<details><summary>Exporting executable SQL query with every modification to your schema</summary>
<ul>
After modifying/editing the database schemas, users are now able to generate executable queries isolated from their database which decreases security concerns. Users are able to append all the query changes at the end of the new file and save this in their local machines.
</ul>
</details>
<details><summary>Logging modeling</summary>
<ul>
After connnection to the database is made the user can view, modify and save the current log settings. This will assist database administrators in keeping efficient log setup in mind during the early stages of DB modeling
</ul>
</details>
<details><summary>Seamlessly visualize relational database</summary>
<ul>
After connecting database tables with one another, users are able to render the relationship connections of individual tables by clicking on the tables.
</ul>
</details>
<details><summary>Starting an ER diagram from scratch</summary>
<ul>
Provides a canvas for users to create a database by using ER diagrams, thus creating a blueprint for engineering database structures.
</ul>
</details>

---

### How to Use

Connecting to an existing database

1. Locate and click on the "Connect Database" button under the Action section on the left side of the page. This will open a sidebar on the right side of the page.
2. Input your Postgres database URI information and click on "Connect". It may take a couple of seconds to connect to your database.
3. Once the connection to your database is established, the page will populate with the tables in your database and the relationships between your tables.
4. Each table is editable. Editing the tables does not automatically change the schema of your database.
5. Every change you make will generate an executable SQL query. After you are done making all your changes, click on the "Execute changes" button to make those changes to your database.

![dbSpy_connectToDB](https://user-images.githubusercontent.com/83368864/179806428-f73b2b18-b82b-4b19-8ea1-5af72ddd23d3.gif)

![dbSpy_makeAndExecuteChanges](https://user-images.githubusercontent.com/83368864/179806700-4f67386b-d66d-469b-a92d-856d7bacc677.gif)

Uploading your database's SQL file

1. Locate and click on the "Upload SQL File" button under the Action section on the left side of the page. This will open a window for you to select the SQL file you wish to upload. It may take a couple of seconds to upload the file.
2. Once the file uploads, the page will populate with the tables in your database and the relationships between your tables.
3. Each table is editable. Editing the tables does not automatically change the schema of your database.
4. You'll notice that after making a change to a table, a SQL query will be generated in the SQL Queries section of the page. These queries are generated for you to be able to execute the changes on your own database.

![dbSpy_uploadSQLFile](https://user-images.githubusercontent.com/83368864/179806547-52b4ffd3-bb15-4d13-b9d6-27fd1e777da3.gif)

Starting an ER diagram from scratch

1. Locate and click on the "Build Database" button under the Action section on the left side of the page. This will open a window for you to create and name a table.
2. The table will then be rendered on the page. You will then be able to edit the table and add the columns that you wish to this table.
3. You'll notice that after making a change to the table, a SQL query will be generated in the SQL Queries section of the page. These queries are generated for you to be able to create the database that you just designed.

![dbSpy_buildDatabase](https://user-images.githubusercontent.com/83368864/179806594-fa665842-43a4-4cd0-9da2-abbb05d76d89.gif)

---

### How to contribute

Below is a list of features and improvements to which you can contribute. If you have any additional ideas, please raise the issue or implement them as well!

- Screenshot feature - The screenshot feature does presently capture the tables but the arrows do not align correctly in the screenshot. It would be best if the features captures everything as it is rendered on the canvas.
- Front-End Optimization - Sprite sheet does not render in browser. 
- Connecting to elephant SQL database - When connecting to elephant SQL to grab the data from the database, it takes a really long time to load (approximately 2 minutes), optimize the backend so pulling and parsing data doesn't take as long.
- Logging needs a default settings list and direct reimport into live database. The SQL code to import has been placed into the DB_Schemas folder along with SQL Schema dumps. Also, log setting functionality is currently limited to Postgres databases and the code needs to be expanded to query and display log setting info from MySQL databases
- Security setting models need to be put in place for database tables as well as log files.
- Db-schemas - the schemas are saved under db_schemas and is saved in the server. Have a way to delete the schemas on the server from the front end. It would also be convenient to add these schemas to a list of existing schemas and be able to pull these schemas to display for the user to avoid having to make a new connection to the same database multiple times.
- MySQL database connection - the connection feature currently is not compatible with MySQL database. During development phase, a MySQL database stored at the Google Cloud is used for testing. An authorization issue with Google is met when performing data dump. Suggests to try other MySQL server for development testing.  
- Expand compatibility with other SQL database such as Oracle SQL, Microsoft SQL, IBM Db2, etc
-Scrollable Canvas - Able to edit tables and scroll on the right side of the canvas, scrolling does not work on the left side of the canvas. If tables are populated or pushed outside of the canvas on the left side, that table disappears, need to enable scrolling on left side. 
- Testing - The current result of the supertest could vary based on which mode it is tested on, development or production. When tested in development mode (commented out line 83-84 in server.js), the supertest result would pass with the expected content-type "text, html" returned from the server. However, when the supertest is tested in the production mode, it would fail with 404 Error. 
    - The current unit test will fail due to ES module error. Have tried to reconfigure webpack by declaring "module: type", rebuild jest configure file...
- Refactoring - We need help refactoring the codebase according to the Airbnb style guide.
- Refactoring typescript - Right now, there are an abundance of any's in the types. 

---

### Getting started

- Fork and clone this repo
- Add a .env file to the root directory
- Go to the Google Cloud Platform Console
- Set up OAuth 2.0 credentials as laid out  <a href="https://support.google.com/cloud/answer/6158849?hl=en">here</a> 
- Populate the .env file with the newly created:
```bash
CLIENT_ID = "client-id-goes-here"
CLIENT_SECRET = "client-secret-goes-here"
CALLBACK= http://localhost:8080/google/callback
TEAM_SECRET = "team-secret-goes-here"
```
- Install the dependencies:

```bash
$ npm install
```

- Run the project in development mode:

```bash
$ npm run dev
```

- Make changes with comments
- Add appropriate tests and ensure they pass
- Commit your changes and make a pull request

---

### Request a feature

- Submit an appropriately tagged GitHub issue
- Submit your request <a href="https://docs.google.com/forms/d/e/1FAIpQLSdaPeCzo41VsJWHbbPzYwvu5Jd-FrXfJZnx23mtFdRVWDWCyg/viewform">here</a>

---

### Credits/Contributors

- Angel Giron • [LinkedIn](https://www.linkedin.com/in/acgiron/) • [Github](https://github.com/g94angel)
- John Paul Adigwu • [LinkedIn](https://www.linkedin.com/in/johnpaul-adigwu/) • [Github](https://github.com/engineerous)
- Kevin Park-Lee • [LinkedIn](https://www.linkedin.com/in/kevin38424/) • [Github](https://github.com/kevin38424)
- Tarik Mokhtech • [LinkedIn](http://linkedin.com/in/tarik-mokhtech) • [Github](https://github.com/MockTech)
- Brett Guidry • [LinkedIn](https://www.linkedin.com/in/brett-guidry504/) • [Github](https://github.com/BrettGuidryDev)
- Emil Mebasser• [LinkedIn](https://www.linkedin.com/in/emil-mebasser-a1a2a815/) • [Github](https://github.com/ejmebasser)
- Mimi Le • [LinkedIn](https://www.linkedin.com/in/my-le-a94575226/) • [Github](https://github.com/kawaiiyummy14)
- Samson Lam • [LinkedIn](https://www.linkedin.com/in/samson-lam-455846219/) • [Github](https://github.com/sflam2013)

---

### License

- dbSpy is developed under the MIT license.
