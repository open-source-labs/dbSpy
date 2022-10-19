module.exports = `CREATE TABLE user (
    id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    full_name VARCHAR(240),
    sub VARCHAR(40),
    email VARCHAR(240),
    picture VARCHAR(240)
)`;