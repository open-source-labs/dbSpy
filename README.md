<div align="center">
<<<<<<< HEAD

<a href="https://makeapullrequest.com">![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)</a>
<a href="https://opensource.org/licenses/MIT">![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)</a>
<a href="https://img.shields.io/badge/version-1.0.1-blue">![Version](https://img.shields.io/badge/version-1.0.1-blue)</a>

=======
<a href="https://makeapullrequest.com">![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)</a>
<a href="https://img.shields.io/badge/version-1.0.1-blue">![Version](https://img.shields.io/badge/version-1.0.1-blue)</a>
![GitHub Stars](https://img.shields.io/github/stars/oslabs-beta/JAKT?color=%23fb7182)
![MIT License](https://img.shields.io/badge/license-MIT-yellow)

> > > > > > > dev

</div>

<div align="center">
  
![logo 5](https://user-images.githubusercontent.com/11093217/179366043-624ba23a-408d-499a-a1aa-162acf56d247.jpg)

</div>

<h1 align="center">Visualize and Modify your database with dbSpy!</h1>
<p>dbSpy is an open-source database visualization tool to facilitate relational database model development using entity relationship diagrams and homogeneous database migration.</p>

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

7. **Screenshot:** Take a screenshot of the canvas with all your tables (BETA)

8. **Time Travel:** Provides a history of edits for easier backtracking

### How to Use

Connecting to an existing database

1. Locate the Feature bar on the left side of the page and click on "Connect database". This will open a sidebar on the right side of the page.
2. Input the database information to your Postgres database and click on "Connect". It may take a couple of seconds to connect to your database.
3. Once the connection to your database is established, you will see the page populate with the tables in your database and the relationships between your tables.
4. You will then be able to make changes to the schema of your database. Updated the field names, the values,
5. Instructions on how to upload sql file.
6. Instructions on how to start design from scratch

### How to contribute

Below is a list of features and improvements to which you can contribute. If you have any additional ideas, please raise the issue or implement them as well!

- Screenshot feature - The screenshot feature does presently does not capture the tables with the arrows. It would be best if the features captures everything as it is rendered on the canvas.
- SQL File Export feature (for new databases) - After a user creates a database from scratch on dbSpy, this feature would create a SQL file with a list of executable queries for them to create that new database on their own.
- SQL File Export feature (for existing databases) - After a user makes changes to their databases's schema, this feature would create a SQL file with a list of executable queries for them to execute those changes on their existing database.

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

### Request a feature

- Submit an appropriately tagged GitHub issue
- Submit your request <a href="https://docs.google.com/forms/d/e/1FAIpQLSdaPeCzo41VsJWHbbPzYwvu5Jd-FrXfJZnx23mtFdRVWDWCyg/viewform">here</a>

### Credits/Contributors

- Angel Giron • [LinkedIn](https://www.linkedin.com/in/acgiron/) • [Github](https://github.com/g94angel)
- John Paul Adigwu • [LinkedIn](https://www.linkedin.com/in/johnpaul-adigwu/) • [Github](https://github.com/engineerous)
- Kevin Park-Lee • [LinkedIn](https://www.linkedin.com/in/kevin38424/) • [Github](https://github.com/kevin38424)
- Tarik Mokhtech • [LinkedIn](http://linkedin.com/in/tarik-mokhtech) • [Github](https://github.com/MockTech)

### License

- dbSpy is developed under the MIT license.
