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

2. **Compatible SQL Database:** Current dbSpy is compatible with PostgreSQL and MySQL database

3. **Database File Upload:** Upload a database's SQL file

4. **ER Diagrams:** Visualize the entity relationship diagram of a database

5. **Visualizing Individual Table Connections** Relationships of individual tables are now easily identified when clicking on a table.

6. **Schema Modification:** Modify a database's schema

7. **Database Building:** Create a new database from scratch using entity relationship diagrams

8. **Screenshot:** Take a screenshot of the canvas with all your tables

9. **Dark Mode** Additional visual setting to provide a more comfortable viewing experience in low-light environements

## Future Enhancements

1. **SQL Query Generator:** Generate an executable SQL query with every modification to your schema

2. **Time Travel:** Provides a history of edits for easier backtracking

3. **Exporting Queries:** Allows updated changes of queries to be saved as a SQL file for client imports to their database

4. **Log Modeling:** Provides a tool for admins to pull, view, modify, and export log settings from an existing database

5. **Database Integrity Assurance** Database Logic Check is performed as the client edits the database to ensure the integrity of the database

---

### Use Cases

- Connecting to an existing database
  - Renders an ER diagram of the existing database and provides an interface for users to both modify existing tables and create new tables. A log of changes is stored, and at any point, the user can execute a transaction containing the changes, such that they are reflected in the existing database.
- Uploading your database's SQL file
  - Renders an ER diagram for the provided SQL file (db dump) and provides an interface for a user to both modify existing tables and create new tables. Changes are converted into the corresponding queries, which the user can view and execute on their own database outside of dbSpy.
- Seamlessly visualize relational database
  - After connecting database tables with one another, users are able to render the relationship connections of individual tables by clicking on the tables.
- Starting an ER diagram from scratch
  - Provides a canvas for users to create a database by using ER diagrams, thus creating a blueprint for engineering database structures.

---

### Getting started

- Fork and clone this repo
- Add a .env file to the root directory
- Go to the Google Cloud Platform Console
- Set up OAuth 2.0 credentials as laid out in <a href="https://support.google.com/cloud/answer/6158849?hl=en">here</a>
- Populate the .env file with the newly created code below:

```bash
CLIENT_ID = [client id]
CLIENT_SECRET = [client secret]
GOOGLE_AUTH_CALLBACK = 'http://localhost:3000/api/oauth/google'
DATABASE_URL = [mysql url for storing user data]
SERVER_ENDPOINT = 'http://localhost:3000'
GOOGLE_AUTH_CLIENT_ID = [google auth client id]
GOOGLE_AUTH_CLIENT_SECRET = [google auth client secret]
REDIS_URL = [redis url]
REDIS_PORT = [redis port]
REDIS_PASSWORD = [redis password]
REDIS_SECRET = [redis secret]
ENVIRONMENT = "development"
TOKEN_KEY = [any string]
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

### How to Use

How To Start

1. Sign up or login with Google Auth to begin.
2. You will be redirected to the display page where you can connect, upload, or build a mySQL or Postgres database.

Connecting to an existing database

1. Click on the "Connect Database" button under the Action section on the left side of the page. This will open a sidebar on the right side of the page.
2. Select the database type from the dropdown.
3. Input your database URI information OR database connection credentials and click on "Connect".
4. Once the connection to your database is established, the canvas will render and generate the tables and their relationships.

![dbSpy_connectToDB](https://user-images.githubusercontent.com/83368864/179806428-f73b2b18-b82b-4b19-8ea1-5af72ddd23d3.gif)

![dbSpy_makeAndExecuteChanges](https://user-images.githubusercontent.com/83368864/179806700-4f67386b-d66d-469b-a92d-856d7bacc677.gif)

Uploading your database's SQL file

1. Locate and click on the "Upload SQL File" button under the Action section on the left side of the page. This will open a dialog box for you to select the SQL file you wish to upload.
2. Once the file uploads, the canvas will render and generate the tables and their relationships.

![dbSpy_uploadSQLFile](https://user-images.githubusercontent.com/83368864/179806547-52b4ffd3-bb15-4d13-b9d6-27fd1e777da3.gif)

Starting an ER diagram from scratch

1. Locate and click on the "Build Database" button under the Action section on the left side of the page. This will render the canvas for you to create your database schema.
2. Click on "Add Table" to name the first table and start building your database.

![dbSpy_buildDatabase](https://user-images.githubusercontent.com/83368864/179806594-fa665842-43a4-4cd0-9da2-abbb05d76d89.gif)

Adding a new row to a table

1. To add a new row in a table, click on the add icon on the top right of the table node. This will render a new row in the table in edit mode.

Editing an existing row in a table

1. Click on the edit icon of the specific row that you want to edit.
2. You can make changes to row fields based on the selections provided.
3. Click on the save icon to keep your changes.
4. Click on the cancel icon to cancel your changes.

Adding a foreign key reference to a row

1. While editing a row, if setting Foreign Key (FK) to "true", the Foreign Key Reference sidebar will appear on the right side of the screen.
2. In the Foreign Key Reference sidebar, enter the following:
   - Primary Key Name - the name of the Primary Key of the table that the Foreign Key is referencing
   - Reference Key Name - the name of this Foreign Key
   - Primary Table Name - the name of the Primary Key's table
   - Reference Table Name - the name of this Foreign Key's table
   - IsDestination - should be set to "false"
   - Constraint Name - enter constraint information OR null
3. Click save or cancel to proceed.
4. Click on the save icon to keep your changes or click on the cancel icon to cancel your changes.
5. If changes are saved, an alert will appear that reads "click EDIT then SAVE on the target table row."
6. Following the alert prompt will render the connection and connection label between the two tables.

Deleting an existing row in a table

1. Click on the delete icon of the specific row that you want to delete.
2. Click on the confirm icon to delete the row.
3. Click on the cancel icon to cancel the deletion.

Navigating the canvas

1. Located on the bottom left corner of the canvas, you will find the canvas control panel.
   - Zoom On [+] - this button zooms into the canvas.
   - Zoom Out [-] - this button zooms out of the canvas.
   - Fit View [[]] - this button zooms to fit all the tables in focus.
   - Toggle Interactivity [lock] - this button toggles on and off all table and row interactivity.
   - Screenshot [camera] - this button saves a .png file of the current canvas view.

---

### Request a feature

- Submit an appropriately tagged GitHub issue

---

### How to contribute

- Click on [Contributions](Contributors.md) for more details.

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
- Adrian Reczek • [LinkedIn](https://www.linkedin.com/in/adrian-reczek/) • [Github](https://github.com/adziu1234)
- Anthony Al-Rifai • [LinkedIn](https://www.linkedin.com/in/anthony-al-rifai-31677a100/) • [Github](https://github.com/AnthonyAl-Rifai)
- Kevin Wang • [LinkedIn](https://www.linkedin.com/in/kevin-w-b841b13/) • [Github](https://github.com/kwang929)
- Kris Magat • [LinkedIn](https://www.linkedin.com/in/kmag/) • [Github](https://github.com/KrisMagat)
- Santiago Gil Maya • [LinkedIn](https://www.linkedin.com/in/santiago-gil-929721121/) • [Github](https://github.com/santiago-gil)

---

### License

- dbSpy is developed under the MIT license.
