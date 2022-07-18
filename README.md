<div align="center">

  <a href="https://makeapullrequest.com">![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)</a>
  <a href="https://img.shields.io/badge/version-1.0.1-blue">![Version](https://img.shields.io/badge/version-1.0.1-blue)</a>
  ![GitHub Stars](https://img.shields.io/github/stars/oslabs-beta/JAKT?color=%23fb7182)
  ![MIT License](https://img.shields.io/badge/license-MIT-yellow)
</div>

<div align="center">
  
![logo 5](https://user-images.githubusercontent.com/11093217/179366043-624ba23a-408d-499a-a1aa-162acf56d247.jpg)

</div>

<h1 align="center">Visualize and Modify your database with dbSpy!</h1>
<p>dbSpy is an open-source database visualization tool to facilitate relational database model development using entity relationship diagrams and homogeneous database migration.</p>
<br></br>

### Use Cases
<details><summary>Connecting to an existing database</summary>
<ul>
Renders an ER diagram of the existing database and provides an interface for users to both modify existing tables and create new tables. A log of changes is stored, and at any point, the user can execute a transaction containing the changes, such that they are reflected in the existing database.
</ul>
</details>
<details><summary>Uploading your databases's SQL file</summary>
<ul>
Renders an ER diagram for the provided SQL file (db dump) and provides an interface for a user to both modify existing tables and create new tables. Changes are converted into the corresponding queries, which the user can view and execute on their own database outside of dbSpy.
</ul>
</details>
<details><summary>Starting an ER diagram from scratch</summary>
<ul>
Provides a canvas for users to create a database by using ER diagrams, thus creating a blueprint for engineering database structures.
</ul>
</details>

### Key Features
1. **Connect:** Connect to a PostgreSQL database

2. **Upload:** Upload a databases's SQL file

3. **ER Diagram:** Visualize the entity relationship diagram of a database

4. **Modify:** Modify a databases's schema

5. **Blueprint:** Create a new database from scratch using entity relationship diagrams

6. **Query Generator:** Generate an executable SQL query with every modification to your schema

7. **Screeshot:** Take a screenshot of the canvas (BETA)

7. **Time Travel:** Provides a history of edits for easier backtracking

### How to Use
1. Instructions on how to connect to DB
2. Instructions on how to upload sql file
3. Instructions on how to start design from scratch


### How to contribute
The following is a list of features and improvements for which you can contribute. If you have any additional ideas, please raise the issue or implement them as well!
- Screenshot feature - The screenshot feature does presently does not capture the tables with the arrows. 
- SQL file export feature - After a user creates a database from scratch on dbSpy, this feature would create a list of executable queries for them to actually create that database.
- Save feature - Saves queries made into a SQL file and allowing user to execute queries on their own.
- query box when design from scratch

---
### If you'd like to contribute to our project
- Fork the project
```bash
$ npm install
```
- Run the project in development mode: $ npm run dev
- Make changes with comments
- Add appropriate tests and make sure they pass
- Commit and PR

### Credits/Contributors
- Contributor • [LinkedIn](link) • [Github](link)
- Contributor • [LinkedIn](link) • [Github](link)
- Contributor • [LinkedIn](link) • [Github](link)
- Contributor • [LinkedIn](link) • [Github](link)

### License
- dbSpy is developed under the MIT license.

### How to request a feature
- Submit an appropriately tagged github issue 