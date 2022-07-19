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
<p>dbSpy is an open-source visualization tool to facilitate relational database development.</p>

<!-- dbSpy is an open-source visualization tool to facilitate relational database model development using entity relationship diagrams and homogeneous database migration -->

---

### Key Features

1. **Connect:** Connect to a PostgreSQL database

2. **Upload:** Upload a database's SQL file

3. **ER Diagram:** Visualize the entity relationship diagram of a database

4. **Modify:** Modify a database's schema

5. **Build Database:** Create a new database from scratch using entity relationship diagrams

6. **Query Generator:** Generate an executable SQL query with every modification to your schema

7. **Screenshot:** Take a screenshot of the canvas with all your tables (BETA)

8. **Time Travel:** Provides a history of edits for easier backtracking

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

Uploading your database's SQL file

1. Locate and click on the "Upload SQL File" button under the Action section on the left side of the page. This will open a window for you to select the SQL file you wish to upload. It may take a couple of seconds to upload the file.
2. Once the file uploads, the page will populate with the tables in your database and the relationships between your tables.
3. Each table is editable. Editing the tables does not automatically change the schema of your database.
4. You'll notice that after making a change to a table, a SQL query will be generated in the SQL Queries section of the page. These queries are generated for you to be able to execute the changes on your own database.

![dbSpy_uploadSQLFile](https://user-images.githubusercontent.com/83368864/179806547-52b4ffd3-bb15-4d13-b9d6-27fd1e777da3.gif)
![dbSpy_makeAndExecuteChanges](https://user-images.githubusercontent.com/83368864/179806700-4f67386b-d66d-469b-a92d-856d7bacc677.gif)


Starting an ER diagram from scratch

1. Locate and click on the "Build Database" button under the Action section on the left side of the page. This will open a window for you to create and name a table.
2. The table will then be rendered on the page. You will then be able to edit the table and add the columns that you wish to this table.
3. You'll notice that after making a change to the table, a SQL query will be generated in the SQL Queries section of the page. These queries are generated for you to be able to create the database that you just designed.

![dbSpy_buildDatabase](https://user-images.githubusercontent.com/83368864/179806594-fa665842-43a4-4cd0-9da2-abbb05d76d89.gif)

---

### How to contribute

Below is a list of features and improvements to which you can contribute. If you have any additional ideas, please raise the issue or implement them as well!

- Screenshot feature - The screenshot feature does presently does not capture the tables with the arrows. It would be best if the features captures everything as it is rendered on the canvas.
- SQL File Export feature (for new databases) - After a user creates a database from scratch on dbSpy, this feature would create a SQL file with a list of executable queries for them to create that new database on their own.
- SQL File Export feature (for existing databases) - After a user makes changes to their database's schema, this feature would create a SQL file with a list of executable queries for them to execute those changes on their existing database.
- Refactoring - We need help refactoring the codebase according to the Airbnb style guide.

---

### Getting started

- Fork and clone this repo
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

---

### License

- dbSpy is developed under the MIT license.
