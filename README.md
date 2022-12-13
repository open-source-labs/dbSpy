<div align="center">

<a href="https://makeapullrequest.com">![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)</a>
<a href="https://img.shields.io/badge/version-1.0.1-blue">![Version](https://img.shields.io/badge/version-4.0.0-blue)</a>
![GitHub Stars](https://img.shields.io/github/stars/oslabs-beta/JAKT?color=%23fb7182)
![MIT License](https://img.shields.io/badge/license-MIT-yellow)

</div>

<div align="center">
  
![logo](https://user-images.githubusercontent.com/101940529/198836631-31a657f7-feaa-4247-8abc-cedb86540e21.png)

</div>

<h1 align="center">Visualize, modify, and build your database with dbSpy!</h1>
<p align="center">An open-source data modeling tool to facilitate relational database development</p>

### Use Cases

- Connecting to an existing remote PostgreSQL and MySQL database
  - Renders an ER diagram of the existing database and provides an interface for users to both modify existing tables and create new tables. A log of changes is stored, and at any point, the user can execute a transaction containing the changes, such that they are reflected in the existing database.
- Uploading your database's SQL file
  - Renders an ER diagram for the provided SQL file (db dump) and provides an interface for a user to both modify existing tables and create new tables. Changes are converted into the corresponding queries, which the user can view and execute on their own database outside of dbSpy.
- Seamlessly visualize relational databases
  - After connecting database tables with one another, users are able to render the relationship connections of individual tables by clicking on the tables.
- Creating a database + ER diagram from scratch
  - Provides a canvas for users to create a database by using ER diagrams, thus creating a blueprint for engineering database structures.

---

### Key Features

1. **Database Uploads:** Connect to remote SQL database or upload local SQL files

2. **ER Diagram Visuals:** Visualize the entity relationship diagram of a database with dynamic handle placement 

3. **Table Relationship Visuals** Relationships of individual tables are easily identified when clicking on a table.

4. **Schema Modification:** Easily modify a database's schema through a simple UI

5. **Guided Database Building:** Create a new database from scratch using entity relationship diagrams to ensure the integrity of the database

6. **Database Undo/Redo:** Provides a history of edits for easier backtracking

7. **Query Generator:** Query generator generates executable SQL queries

8. **User Sessions:** Sign up/Log in securely with either Google OAuth or JWTs/Bcrypt

9. **Save/Load:** Store and reload recent database sessions through your user account

10. **Dark Mode:** Visual settings to provide a more comfortable viewing experience in low-light environements

![dbSpyTheme](https://user-images.githubusercontent.com/101940529/198836752-9727c0b4-4a8f-459b-be39-81922be15fd3.gif)

---

### Getting started

- Fork and clone this repo
- Add a .env file to the root directory
- Add a db_schemas folder in server directory
- Go to the Google Cloud Platform Console
- Set up OAuth 2.0 credentials as laid out in <a href="https://support.google.com/cloud/answer/6158849?hl=en">here</a>
- Populate the .env file with the newly created code below:

```bash
GOOGLE_AUTH_CALLBACK = ''
DATABASE_URL = [mysql url for storing user data]
DEV_SERVER_ENDPOINT = 'http://localhost:3000'
DEV_CLIENT_ENDPOINT = 'http://localhost:8080'
GOOGLE_AUTH_CALLBACK = 'http://localhost:3000/api/oauth/google'
GOOGLE_AUTH_CLIENT_ID = [google auth client id]
GOOGLE_AUTH_CLIENT_SECRET = [google auth client secret]
REDIS_URL = [redis url]
REDIS_PORT = [redis port]
REDIS_PASSWORD = [redis password]
REDIS_SECRET = [redis secret]
ENVIRONMENT = "development"
TOKEN_KEY = [any string]
```

- Run the following below:

```bash
$ npm install
```

- Execute the following command to populate your mySql database with a users table:
```bash
$ npm run seed
```

- Run the project in development mode:

```bash
$ npm run dev
```

---

### Connecting with remote MySQL

- To connect with the SQL database, we must create and configure SSL certificates. 

1. Install mkcert; you can learn more about mkcert [here](https://github.com/FiloSottile/mkcert)
```bash
npm install -g mkcert
```
  2. Run the following script
```bash
npm run cert
```

---

# How to Use

### Connecting to an existing database

![Screenshot 2022-10-29 093105](https://user-images.githubusercontent.com/101940529/198837154-072d2d90-3f81-4fed-ab17-8301f1387b5c.png)

1. Click on the "Connect Database" button under the Action section on the left side of the page. This will open a sidebar on the right side of the page.
2. Select the database type from the dropdown.
3. Input your database URI information OR database connection credentials and click on "Connect".
4. Once the connection to your database is established, the canvas will render and generate the tables and their relationships.

![dbSpy_connectToDB](https://github.com/open-source-labs/dbSpy/blob/main/src/assets/ScreenshotDemo.png?raw=true)

### Uploading your database's SQL file

1. Locate and click on the "Upload SQL File" button under the Action section on the left side of the page. This will open a dialog box for you to select the SQL file you wish to upload.
2. Once the file uploads, the canvas will render and generate the tables and their relationships.

### Starting an ER diagram from scratch

1. Locate and click on the "Build Database" button under the Action section on the left side of the page. This will render the canvas for you to create your database schema.
2. Click on "Add Table" to name the first table and start building your database.

## Adding row(s) to a table

1. To add a new row in a table, click on the add icon on the top right of the table node. This will render a new row in the table in edit mode.
![Screenshot 2022-10-29 093211](https://user-images.githubusercontent.com/101940529/198837146-e81a858a-a7aa-41d8-9396-e4db38776fa5.png)

### Editing an existing row in a table

1. Click on the edit icon of the specific row that you want to edit.
2. You can make changes to row fields based on the selections provided.
3. Click on the save icon to keep your changes.
4. Click on the cancel icon to cancel your changes.

### Adding a foreign key reference to a row

1. While editing a row, if setting Foreign Key (FK) to "true", the Foreign Key Reference sidebar will appear on the right side of the screen.
2. In the Foreign Key Reference sidebar, use the displayed dropdowns to create references between tables.
3. Click save or cancel to proceed.
4. Click on the save icon to keep your changes or click on the cancel icon to cancel your changes.

## Deleting an existing row in a table

1. Click on the delete icon of the specific row that you want to delete.
2. Click on the confirm icon to delete the row.
3. Click on the cancel icon to cancel the deletion.

### Navigating the canvas

1. Located on the bottom left corner of the canvas, you will find the canvas control panel.
   - Zoom On [+] - this button zooms into the canvas.
   - Zoom Out [-] - this button zooms out of the canvas.
   - Fit View [[]] - this button zooms to fit all the tables in focus.
   - Toggle Interactivity [lock] - this button toggles on and off all table and row interactivity.
   - Screenshot [camera] - this button saves a .png file of the current canvas view.

---

### Future contributions and requests

- If you'd like to contribute, please find a list of possible contributions [here](Contributors.md)
- If you have any requests, please submit an appropriately tagged GitHub issue
- PRs are welcome otherwise

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
- Alexander Tu  • [LinkedIn](https://www.linkedin.com/in/atu816/) • [Github](http://github.com/atu816)
- Michael Costello  • [LinkedIn](https://www.linkedin.com/in/mcostello-swe/) • [Github](https://github.com/neighbor-peace)
- Steven Geiger • [LinkedIn](https://www.linkedin.com/in/sgeiger9/) • [Github](https://github.com/geistnine)
- Yufa Li • [LinkedIn](https://www.linkedin.com/in/yufa-li/) • [Github](https://github.com/01001101CK)

---

### License

dbSpy is developed under the MIT license. See more un
