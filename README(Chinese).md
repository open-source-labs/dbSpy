<div align="center">

<a href="https://makeapullrequest.com">![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)</a>
<a href="https://img.shields.io/badge/version-1.0.1-blue">![Version](https://img.shields.io/badge/version-6.0.0-blue)</a>
![GitHub Stars](https://img.shields.io/github/stars/oslabs-beta/JAKT?color=%23fb7182)
![MIT License](https://img.shields.io/badge/license-MIT-yellow)

</div>

<div align="center">
  
![logo](https://user-images.githubusercontent.com/101940529/198836631-31a657f7-feaa-4247-8abc-cedb86540e21.png)

</div>

<h1 align="center">使用 <i>dbSpy</i> 可视化、修改和构建您的数据库！</h1>
<p align="center">使关联式数据库开发更便利的开源数据建模工具</p>
<!-- <p align="center">dbSpy是一个促进关系数据库开发的开源数据建模工具。</p> -->

### 7.0 版本的新功能

- UI 现在是全宽屏，带有下拉式选单，可提供更多显示与操作空间。
- 「储存」、「载入」和「删除」功能现在采用档案名，并且可以储存资料库结构和数据。
- 删除表当中的某些元素现在可以定位，并且还可以正确删除连接到其他表上的元素。
- 实现了一种演算法来显示连接到当前所选表格所有连接的线。
- 修正了无法从连接的资料库中删除某些元素的几个问题。
- 修正了显示数据按钮会导致网页崩溃的几个问题。
- 修正了连接线重复渲染导致拖影且未成功删除的几个问题。

### 实例

- 连接到现有的远程 PostgreSQL、MySQL、MicroSoftSQL、OracleSQL 数据库
- 为现有数据库的架構和數據生成 ER 图，并为用户提供一个界面，既可以修改现有表格，也可以创建新表格。更改的日志被存储起来，用户随时可以生成包含这些更改的查询，以便这些更改反映在现有数据库中。
- 上传您的数据库 SQL 文件
- 上傳的 SQL 文件（数据库转储）生成 ER 图，并为用户提供一个界面，既可以修改现有表格，也可以创建新表格。更改被转换为相应的查询，用户可以在 dbSpy 外部的自己的数据库上查看并执行这些查询。
- 无缝可视化关系数据库（包括架構和數據）
- 在相互连接数据库表之后，用户可以通过点击表格来渲染个别表的关系连接。
- 从头开始创建数据库+ER 图
- 提供一个画布，用户可以使用 ER 图创建数据库，从而为工程数据库结构创建蓝图。

---

### 主要功能

1. **数据库上传：** 连接远程 SQL 数据库或上传本地 SQL 文件

2. **ER 图视觉效果：** 通过动态句柄放置来可视化数据库的实体关系图

3. **表格关系视觉效果** 单击表格时可以轻松识别各个表格的关系

4. **架构修改：** 单击按钮即可轻松在架构和数据之间切换

5. **数据/架构修改：** 通过简单的 UI 轻松修改数据库的架构或数据

6. **引导数据库构建：** 使用实体关系图从头开始创建新数据库，以确保数据库的完整性

7. **数据库撤消/重做：** 提供编辑历史记录，以便于回溯（尚未修復幾個 Bug）

8. **查询生成器：** 查询生成器生成可执行的 SQL 查询

9. **用户会话：** 使用 Google/Github OAuth 或 JWT/Bcrypt 安全地注册/登录

10. **保存/加载：** 通过您的用户帐户存储和重新加载过去的数据库会话

11. **深色模式：** 视觉设置，在弱光环境下提供更舒适的观看体验

## <img src="images/ConnectedToDB.png">

### Getting started

You will need your own MySQL database for backend functions.

- Fork and clone this repo
- Add a db_schemas folder in server directory
- Add a .env file to the root directory with the information below:

```bash
# production environment variables
USER_DB_URL = <MySQL url for storing user data>
USER_DB_USER = <user string from USER_DB_URL>
USER_DB_PW = <password string from USER_DB_URL>
TOKEN_KEY = <any string>

# testing environment variables
## encoded SSL data required for GitHub Actions
SSL_KEY = <base64 encoded SSL key (see SSL Configuration)>
SSL_CERT = <base64 encoded SSL cert>
## MySQL and Postgres databases to test remote connection functionality
MYSQL_TEST_URL = <MySQL url for a test database>
MYSQL_TEST_USERNAME = <user string from MYSQL_TEST_URL>
MYSQL_TEST_PW = <password string from MYSQL_TEST_URL>
PG_TEST_URL = <PostgreSQL url for a test database>
PG_TEST_USERNAME = <user string from PG_TEST_URL>
PG_TEST_PW = <password string from PG_TEST_URL>
## test user with saved schema to test save/load functionality
TEST_USER_EMAIL = <email string>
TEST_USER_PW = <password string>

GOOGLE_OAUTH_CLIENT_ID = <Google Oauth client id>
GOOGLE_OAUTH_CLIENT_SECRET= <Google Oauth client id>
GOOGLE_OAUTH_REDIRECT_URI = 'http://localhost:8080/display'

GITHUB_OAUTH_CLIENT_ID = <Github Oauth client id>
GITHUB_OAUTH_CLIENT_SECRET= <Github Oauth client id>
GITHUB_OAUTH_REDIRECT_URI = 'http://localhost:8080/display'

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

### SSL Configuration

To connect with the SQL database, we must create and configure SSL certificates.

### Mac

1. Install mkcert; you can learn more about mkcert [here](https://github.com/FiloSottile/mkcert)

```bash
npm install -g mkcert
```

2. Run the following script

```bash
npm run cert
```

### Linux

1. Check mkcert is up to date (v1.5.1 as of publishing)

```bash
mkcert --version
```

2. Run the following script

```bash
npm run cert:linux
```

---

# How to Use

### Connecting to an existing database

1. Click on the "Connect Database" button under the Action section on the left side of the page. This will open a sidebar on the right side of the page.
2. Select the database type from the dropdown.
3. Input your database URI information OR database connection credentials and click on "Connect".
4. Once the connection to your database is established, the canvas will render and generate the tables and their relationships.
   - OracleSQL requires the download of the OCI - [here](https://www.oracle.com/cloud/free/)

### Uploading your database's SQL file

1. Locate and click on the "Upload SQL File" button under the Action section on the left side of the page. This will open a dialog box for you to select the SQL file you wish to upload.
2. Once the file uploads, the canvas will render and generate the tables and their relationships.

### Starting an ER diagram from scratch

1. Locate and click on the "Build Database" button under the Action section on the left side of the page. This will render the canvas for you to create your database schema.
2. Click on "Add Table" to name the first table and start building your database.

## Adding column(s) to a SCHEMA table or row(s) to a DATA table

1. To add a new column/row in a table, click on the add/plus icon on the top right of the table node.
2. This will render a new column/row in the table in edit mode.
3. Add in the data you would like in each column/row.
4. Click on the confirm icon to save the column/row.
5. The changes made in DATA table will be updated in your database.
6. Click on the cancel icon to cancel the addition.

   <img src="images/zuckOverWaz.png">

   <img src="images/zuckTables.png">

### Editing an existing row of a DATA table

1. Click on the edit icon of the specific column that you want to edit.
2. You can make changes to column fields based on the selections provided.
3. Click on the save icon to keep your changes.
4. Click on the cancel icon to cancel your changes.

### Deleting a column to a SCHEMA table or row of a DATA table

1. Click on the delete icon of the specific column that you want to delete.
2. Click on the confirm icon to delete the column.
3. Click on the cancel icon to cancel the deletion.

## <img src="images/DbSpy Gif.gif">

### Adding a foreign key reference to a column

1. While editing a column, if setting Foreign Key (FK) to "true", the Foreign Key Reference sidebar will appear on the right side of the screen.
2. In the Foreign Key Reference sidebar, use the displayed dropdowns to create references between tables.
3. Click save or cancel to proceed.
4. Click on the save icon to keep your changes or click on the cancel icon to cancel your changes.

### Adding a table to a database

1. When on the display page, click the 'Add Table' icon after you have either connected to a database or clicked 'Build Database'.
2. Fill in the required information about the first column of your table along with a name.
3. If you would like to include additional columns, click the 'Add Column' button in the top right corner.
4. Click confirm to create your table.

### Deleting a table from a database

1. After you have either connected to a database or started a new database, the 'Delete Table' icon will appear on the left side of the display page
2. This will open a pop out with a list of tables from the database.
3. Select which table that you would like to have removed, and confirm to have it deleted.

### Navigating the canvas

1. Located on the bottom left corner of the canvas, you will find the canvas control panel.
   - Zoom On [+] - this button zooms into the canvas.
   - Zoom Out [-] - this button zooms out of the canvas.
   - Fit View [[]] - this button zooms to fit all the tables in focus.
   - Toggle Interactivity [lock] - this button toggles on and off all table and column interactivity.
   - Screenshot [camera] - this button saves a .png file of the current canvas view.

---

### Future contributions and requests

- If you'd like to contribute, please find a list of possible contributions [here](Contributors.md)
- If you have any requests, please submit an appropriately tagged GitHub issue
- PRs are welcome otherwise

---

### Credits/Contributors

- David Jones • [LinkedIn](http://www.linkedin.com/in/davidjonesswe/) • [Github](https://github.com/david-jones-git)
- John Ruiz • [LinkedIn](https://www.linkedin.com/in/john-ruiz-profile/) • [Github](https://github.com/johnruiz17)
- Minh Chang • [LinkedIn](https://www.linkedin.com/in/minh-chang/) • [Github](https://github.com/miha-cha)
- Darius Okafor • [LinkedIn](https://www.linkedin.com/in/dariusokafor/) • [Github](https://github.com/DE7741)
- Parwinder Singh • [LinkedIn](http://www.linkedin.com/in/singh-parwinder/) • [Github](https://github.com/PintaAE86)
- Yichung Chiu • [LinkedIn](https://www.linkedin.com/in/yichung-chiu-b14a94272/) • [Github](https://github.com/ychiu5896)
- Joseph Tejeda • [LinkedIn](https://www.linkedin.com/in/atxjtejeda/) • [Github](https://github.com/JosephTejeda)
- Stephen Havig • [LinkedIn](https://www.linkedin.com/in/stephen-havig-199340145/) • [Github](https://github.com/Stephen-Havig)
- Das Kang • [LinkedIn](https://www.linkedin.com/in/das-kang/) • [Github](https://github.com/dahae0309)
- Alexander Tu • [LinkedIn](https://www.linkedin.com/in/atu816/) • [Github](http://github.com/atu816)
- Michael Costello • [LinkedIn](https://www.linkedin.com/in/mcostello-swe/) • [Github](https://github.com/neighbor-peace)
- Steven Geiger • [LinkedIn](https://www.linkedin.com/in/sgeiger9/) • [Github](https://github.com/geistnine)
- Yufa Li • [LinkedIn](https://www.linkedin.com/in/yufa-li/) • [Github](https://github.com/01001101CK)
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
  test

---

### License

dbSpy is developed under the MIT license.
