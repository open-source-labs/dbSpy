module.exports = {
    users: `CREATE TABLE users (
        id INT NOT NULL AUTO_INCREMENT,
        PRIMARY KEY (id),
        full_name VARCHAR(240),
        sub VARCHAR(40),
        email VARCHAR(240),
        picture VARCHAR(240)
    )`,
    projects:  `CREATE TABLE projects (
        id INT NOT NULL AUTO_INCREMENT,
        PRIMARY KEY (id),
        name VARCHAR(50),
        link VARCHAR(255),
        schema LONGBLOB
    )`
}