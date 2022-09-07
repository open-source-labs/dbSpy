/*
For MySQL
*/
// constraints-checked MySQL
const objConstraints = {
    UNIQUE: true,
    'PRIMARY KEY': true,
    'FOREIGN KEY': true,
    CHECK: true,
    EXCLUSION: true,
    'NOT NULL': true,
  };
  
  // restricted col names-checked MySQL
  const mySQLrestrictedColNames = {
  ACCESSIBLE: true,
  ADD: true,
  ALL: true,
  ALTER: true,
  ANALYZE: true,
  AND: true,
  AS: true,
  ASC: true,
  ASENSITIVE: true,
  BEFORE: true,
  BETWEEN: true,
  BIGINT: true,
  BINARY: true,
  BLOB: true,
  BOTH: true,
  BY: true,
  CALL: true,
  CASCADE: true,
  CASE: true,
  CHANGE: true,
  CHAR: true,
  CHARACTER: true,
  CHECK: true,
  COLLATE: true,
  COLUMN: true,
  CONDITION: true,
  CONSTRAINT: true,
  CONTINUE: true,
  CONVERT: true,
  CREATE: true,
  CROSS: true,
  CUBE: true,
  CUME_DIST: true,
  CURRENT_DATE: true,
  CURRENT_TIME: true,
  CURRENT_TIMESTAMP: true,
  CURRENT_USER: true,
  CURSOR: true,
  DATABASE: true,
  DATABASES: true,
  DAY_HOUR: true,
  DAY_MICROSECOND: true,
  DAY_MINUTE: true,
  DAY_SECOND: true,
  DEC: true,
  DECIMAL: true,
  DECLARE: true,
  DEFAULT: true,
  DELAYED: true,
  DELETE: true,
  DENSE_RANK: true,
  DESC: true,
  DESCRIBE: true,
  DETERMINISTIC: true,
  DISTINCT: true,
  DISTINCTROW: true,
  DIV: true,
  DOUBLE: true,
  DROP: true,
  DUAL: true,
  EACH: true,
  ELSE: true,
  ELSEIF: true,
  EMPTY: true,
  ENCLOSED: true,
  ESCAPED: true,
  EXCEPT: true,
  EXISTS: true,
  EXIT: true,
  EXPLAIN: true,
  FALSE: true,
  FETCH: true,
  FIRST_VALUE: true,
  FLOAT: true,
  FLOAT4: true,
  FLOAT8: true,
  FOR: true,
  FORCE: true,
  FOREIGN: true,
  FROM: true,
  FULLTEXT: true,
  FUNCTION: true,
  GENERATED: true,
  GET: true,
  GRANT: true,
  GROUP: true,
  GROUPING: true,
  GROUPS: true,
  HAVING: true,
  HIGH_PRIORITY: true,
  HOUR_MICROSECOND: true,
  HOUR_MINUTE: true,
  HOUR_SECOND: true,
  IF: true,
  IGNORE: true,
  IN: true,
  INDEX: true,
  INFILE: true,
  INNER: true,
  INOUT: true,
  INSENSITIVE: true,
  INSERT: true,
  INT: true,
  INT1: true,
  INT2: true,
  INT3: true,
  INT4: true,
  INT8: true,
  INTEGER: true,
  INTERSECT: true,
  INTERVAL: true,
  INTO: true,
  IO_AFTER_GTIDS: true,
  IO_BEFORE_GTIDS: true,
  IS: true,
  ITERATE: true,
  JOIN: true,
  JSON_TABLE: true,
  KEY: true,
  KEYS: true,
  KILL: true,
  LAG: true,
  LAST_VALUE : true,
  LATERAL : true,
  LEAD : true,
  LEADING : true,
  LEAVE : true,
  LEFT : true,
  LIKE : true,
  LIMIT : true,
  LINEAR : true,
  LINES : true,
  LOAD : true,
  LOCALTIME : true,
  LOCALTIMESTAMP : true,
  LOCK : true,
  LONG : true,
  LONGBLOB : true,
  LONGTEXT : true,
  LOOP : true,
  LOW_PRIORITY : true,
  MASTER_BIND : true,
  MASTER_SSL_VERIFY_SERVER_CERT : true,
  MATCH : true,
  MAXVALUE : true,
  MEDIUMBLOB : true,
  MEDIUMINT : true,
  MEDIUMTEXT : true,
  MIDDLEINT : true,
  MINUTE_MICROSECOND : true,
  MINUTE_SECOND : true,
  MOD : true,
  MODIFIES : true,
  NATURAL : true,
  NOT : true,
  NO_WRITE_TO_BINLOG : true,
  NTH_VALUE : true,
  NTILE : true,
  NULL : true,
  NUMERIC : true,
  OF : true,
  ON : true,
  OPTIMIZE : true,
  OPTIMIZER_COSTS : true,
  OPTION : true,
  OPTIONALLY : true,
  OR : true,
  ORDER : true,
  OUT : true,
  OUTER : true,
  OUTFILE : true,
  OVER : true,
  PARTITION : true,
  PERCENT_RANK : true,
  PRECISION : true,
  PRIMARY : true,
  PROCEDURE : true,
  PURGE : true,
  RANGE : true,
  RANK : true,
  READ : true,
  READS : true,
  READ_WRITE : true,
  REAL : true,
  RECURSIVE : true,
  REFERENCES : true,
  REGEXP : true,
  RELEASE : true,
  RENAME : true,
  REPEAT : true,
  REPLACE : true,
  REQUIRE : true,
  RESIGNAL : true,
  RESTRICT : true,
  RETURN : true,
  REVOKE : true,
  RIGHT : true,
  RLIKE : true,
  ROW : true,
  ROWS : true,
  ROW_NUMBER : true,
  SCHEMA : true,
  SCHEMAS : true,
  SECOND_MICROSECOND : true,
  SELECT : true,
  SENSITIVE : true,
  SEPARATOR : true,
  SET : true,
  SHOW : true,
  SIGNAL : true,
  SMALLINT : true,
  SPATIAL : true,
  SPECIFIC : true,
  SQL : true,
  SQLEXCEPTION : true,
  SQLSTATE : true,
  SQLWARNING : true,
  SQL_BIG_RESULT : true,
  SQL_CALC_FOUND_ROWS : true,
  SQL_SMALL_RESULT : true,
  SSL : true,
  STARTING : true,
  STORED : true,
  STRAIGHT_JOIN : true,
  SYSTEM : true,
  TABLE : true,
  TERMINATED : true,
  THEN : true,
  TINYBLOB : true,
  TINYINT : true,
  TINYTEXT : true,
  TO : true,
  TRAILING : true,
  TRIGGER : true,
  TRUE : true,
  UNDO : true,
  UNION : true,
  UNIQUE : true,
  UNLOCK : true,
  UNSIGNED : true,
  UPDATE : true,
  USAGE : true,
  USE : true,
  USING : true,
  UTC_DATE : true,
  UTC_TIME : true,
  UTC_TIMESTAMP : true,
  VALUES : true,
  VARBINARY : true,
  VARCHAR : true,
  VARCHARACTER : true,
  VARYING : true,
  VIRTUAL : true,
  WHEN : true,
  WHERE : true,
  WHILE : true,
  WINDOW : true,
  WITH : true,
  WRITE : true,
  XOR : true,
  YEAR_MONTH : true,
  ZEROFILL : true,
  };
  
  export default function mySqlPermissiveColumnCheck(
    ColBeforeChange,
    ColAfterChange,
    tableName,
    TableBeforeChange
  ) {
  
    //get current table involved with change.-checked MySQL
    const impactedTable = TableBeforeChange[tableName];
  
    const querySet = [];
    const objChangeSet = {}; //ObjectSet is Set of changes to Column-checked MySQL
  
    const err = {}; //error response handler-checked MySQL
  
    //check Col Name Change Before vs. After-*****May double with create new Table
    
    if (ColAfterChange.isNew) {
      const UQueryNewCol =
        'ALTER TABLE ' +
        tableName +
        ' ADD ' +
        ColAfterChange.column +
        ' ' +
        ColAfterChange.type +
        ';';
      querySet.push({ type: 'single', query: UQueryNewCol });
    } else if (ColAfterChange.column !== ColBeforeChange.column) {
      
      //trim column name for whitespaces-checked MySQL
      ColAfterChange.column = ColAfterChange.column.trim();
  
      // first check if the column name is empty-checked MySQL
      if (ColAfterChange.column == null || ColAfterChange == undefined)
        return [
          { status: 'failed', errorMsg: 'Must not have empty column name' },
        ];
  
      //validate Name against restricted Column Names-checked MySQL
      if (mySQLrestrictedColNames[ColAfterChange.column.toUpperCase()]) {
        return [
          {
            status: 'failed',
            errorMsg: 'Restricted Column Name Violation to Table',
          },
        ];
      }
  
      //check valid Column Length against MySQL ruleset --checked MySQL
      const maxLength = 64;
      const columnLength = ColAfterChange.column.length;
  
      if(columnLength > maxLength){
        return [
          {
            status: 'failed',
            errorMsg: 'MySQL restricted column length violation: Max. 64 chars',
          },
        ];
      }
      
      //regex check valid Column Name against MySQL ruleset and other naming concern.-checked MySQL
      const regex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
      const found = ColAfterChange.column.match(regex);
      if (found === null) {
        return [
          {
            status: 'failed',
            errorMsg: 'MySQL restricted column name violation',
          },
        ];
      }
  
      objChangeSet.column = {
        status: true,
        newValue: ColAfterChange.column,
        oldValue: ColBeforeChange.column,
      };
      // Following block is executed if changes are permitted and changes exist on existing column-checked MySQL
      const nameQuery = `ALTER TABLE ${tableName} CHANGE ${ColBeforeChange.column} ${ColAfterChange.column} ${ColAfterChange.type};`;
      querySet.push({ type: 'single', query: nameQuery });
    }
  
    //check constraint col for changes. This should be an obj of objs, so we will code both-checked MySQL
    //type for now
    if (typeof ColAfterChange.constraint == 'string') {
      if (ColAfterChange.constraint !== ColBeforeChange.constraint) {
        const oldConstObj = {};
        for (const constraints in objConstraints) {
          if (
            ColBeforeChange.constraint.toUpperCase().indexOf(constraints) !== -1
          )
            oldConstObj[constraints] = true;
        }
  
        //logs only the new or removed constraints for query-checked MySQL
        const newConstObj = {};
        newConstObj.constraint = {};
  
        for (const constraints in objConstraints) {
          if (
            ColAfterChange.constraint.toUpperCase().indexOf(constraints) !== -1
          ) {
            if (oldConstObj[constraints] !== true)
              newConstObj.constraint[constraints] = { action: 'add' };
          }
        }
  
        for (const prev in oldConstObj) {
          if (ColAfterChange.constraint.toUpperCase().indexOf(prev) == -1)
            newConstObj.constraint[prev] = { action: 'remove' };
        }
  
        for (const constr in newConstObj.constraint) {
  
          if (newConstObj.constraint[constr]) {
            if (newConstObj.constraint[constr].action == 'add') {
              if (constr.toUpperCase() == 'UNIQUE') {
                const Query1 =
                  'ALTER TABLE \'' +
                  tableName +
                  '\' ADD UNIQUE (\'' +
                  ColAfterChange.column +
                  '\' );';
  
                querySet.push({ type: 'single', query: Query1 });
              }
  
              if (constr.toUpperCase() == 'NOT NULL') {
                const Query1 =
                  'ALTER TABLE ' +
                  tableName +
                  ' MODIFY ' +
                  ColAfterChange.column +
                  ' NOT NULL;';

                querySet.push({ type: 'single', query: Query1 });
              }
            }
  
            if (newConstObj.constraint[constr].action == 'remove') {
              if (constr.toUpperCase() == 'UNIQUE') {
                const UQuery1 =
                  'DO $$ DECLARE row record; BEGIN FOR row IN SELECT table_constraints.constraint_name, table_constraints.table_name FROM information_schema.table_constraints INNER JOIN information_schema.key_column_usage ON key_column_usage.table_name = information_schema.table_constraints.table_name WHERE table_constraints.table_schema =   \'' +
                  tableName.split('.')[0] +
                  '\' AND table_constraints.table_name=\'' +
                  tableName.split('.')[1] +
                  '\' AND constraint_type=\'' +
                  'UNIQUE' +
                  '\' AND key_column_usage.column_name= \'' +
                  ColAfterChange.column +
                  '\' LOOP EXECUTE \'ALTER TABLE \' || row.table_name || \' DROP CONSTRAINT \' || row.constraint_name; END LOOP; END;$$';
                
                  querySet.push({ type: 'single', query: UQuery1 });
              }
  
              if (constr.toUpperCase() == 'NOT NULL') {
                const UQuery1 =
                  'ALTER TABLE ' +
                  tableName +
                  ' MODIFY ' +
                  ColAfterChange.column +
                  ` ${ColAfterChange.type};`;
                querySet.push({ type: 'single', query: UQuery1 });
              }
            }
          }
        }
      }
    }

    //BeforeChange is boolean, AfterChange is string-checked MySQL
    if (ColAfterChange.pk !== ColBeforeChange.pk.toString()) {
      // check if another pk exist in table-checked MySQL
      if (ColAfterChange.pk === 'true') {
        for (const columns in impactedTable) {
          if (impactedTable[columns].IsPrimaryKey == 'true') {
            return [
              {
                status: 'failed',
                errorMsg: 'MySQL restriction. Duplicate primary key',
              },
            ];
          }
        }
  
        /*Add primary key to tables - checked MySQL
  
                ALTER TABLE table_name
                ADD CONSTRAINT [ constraint_name ]
                PRIMARY KEY (index_col1, index_col2, ... index_col_n)
  
              */
  
        objChangeSet.pk = {
          action: 'add',
          type: 'PRIMARY KEY',
          constraint_name: 'pk_'.concat(tableName.split('.')[1].toLowerCase()),
          column: ColAfterChange.column,
        };
  
        const queryPrimary =
          'ALTER TABLE ' +
          tableName.split('.')[1] +
          ' ADD CONSTRAINT pk_' +
          tableName.split('.')[1] +
          ' PRIMARY KEY (' +
          ColAfterChange.column +
          ');';
        querySet.push({ type: 'single', query: queryPrimary });
  
      } else if (ColAfterChange.pk === 'false' && ColBeforeChange.pk === true) {
        for (let i = 0; i < ColBeforeChange.reference.length; i++) {
          if (ColBeforeChange.reference[i].IsDestination == true) {          
            return [
              {
                status: 'failed',
                errorMsg:
                  'MySQL restriction. Primary Key cannot be dropped due to dependencies',
              },
            ];
          }
        }
        objChangeSet.pk = { action: 'remove' };
  
        const UQuery1 =
          'DO $$ DECLARE row record; BEGIN FOR row IN SELECT table_constraints.constraint_name, table_constraints.table_name FROM information_schema.table_constraints INNER JOIN information_schema.key_column_usage ON key_column_usage.table_name = information_schema.table_constraints.table_name WHERE table_constraints.table_schema =   \'' +
          tableName.split('.')[0] +
          '\' AND table_constraints.table_name=\'' +
          tableName.split('.')[1] +
          '\' AND constraint_type=\'PRIMARY KEY\' AND key_column_usage.column_name= \'' +
          ColAfterChange.column +
          '\' LOOP EXECUTE \'ALTER TABLE \' || row.table_name || \' DROP CONSTRAINT \' || row.constraint_name; END LOOP; END;$$';
        
        querySet.push({ type: 'single', query: UQuery1 });
      }
    }

    if (ColAfterChange.fk !== ColBeforeChange.fk.toString()) {
      if (ColAfterChange.fk == 'true' ) {
        
        const queryForeign =
          'ALTER TABLE ' +
          ColAfterChange.references.ReferencesTableName +
          ' ADD CONSTRAINT ' +
          tableName.split('.')[1] +
          '_' +
          ColAfterChange.column +
          '_fkey  FOREIGN KEY (' +
          ColAfterChange.column +
          ') REFERENCES ' +
          ColAfterChange.references.PrimaryKeyTableName +
          '(' +
          ColAfterChange.references.PrimaryKeyName.split(' ')[0] +
          ');';
  
        querySet.push({ type: 'single', query: queryForeign });
      } else if (ColAfterChange.fk === 'false' && ColBeforeChange.fk === true) {
        objChangeSet.fk = { action: 'remove' };
  
        const UQuery1 =
          'DO $$ DECLARE row record; BEGIN FOR row IN SELECT table_constraints.constraint_name, table_constraints.table_name FROM information_schema.table_constraints INNER JOIN information_schema.key_column_usage ON key_column_usage.table_name = information_schema.table_constraints.table_name WHERE table_constraints.table_schema =   \'' +
          tableName.split('.')[0] +
          '\' AND table_constraints.table_name=\'' +
          tableName.split('.')[1] +
          '\' AND constraint_type=\'FOREIGN KEY\' AND key_column_usage.column_name= \'' +
          ColAfterChange.column +
          '\' LOOP EXECUTE \'ALTER TABLE \' || row.table_name || \' DROP CONSTRAINT \' || row.constraint_name; END LOOP; END;$$';
       
        querySet.push({ type: 'single', query: UQuery1 });
      }
    }
  
    return querySet;
  }
  
  export function permissiveTableCheck(
    tableName,
    TableBeforeChange,
    TableAfterChange
  ) {
    //trim column name for whitespaces-MySQL checked
    tableName = tableName.trim();

    // first check if the column name is empty-MySQL checked
    if (tableName == null || tableName == undefined) {
      return [{ status: 'failed', errorMsg: 'Must not have empty table name' }];
    }
  
    //validate Name against restricted Column Names-MySQL checked
    if (mySQLrestrictedColNames[tableName.toUpperCase()]) {
      return [
        {
          status: 'failed',
          errorMsg: 'Restricted Column Name Violation to Table',
        },
      ];
    }
  
    //regex
    const regex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    const found = tableName.match(regex);
    if (found === null) {
      return [
        {
          status: 'failed',
          errorMsg: 'Postgres restricted column name violation',
        },
      ];
    }
  
    //check if table name is already existing-mySQL updated
   
    for (let i = 0; i < Object.keys(TableBeforeChange).length; i++) {
      const name = Object.keys(TableBeforeChange)[i];
      if ('public.' + tableName === name) {
        return [
          { status: 'failed', errorMsg: 'Cannot have duplicate table name' },
        ];
      }
    }
    // a table must have at least one visible column-mySQL updated
    const querySet = [];
    const QueryNewTable = 'CREATE TABLE ' + tableName + 
    ` (${TableAfterChange.column} ${TableAfterChange.type});`;
    querySet.push({ type: 'single', query: QueryNewTable });
  
    return querySet;
  }
  
  //delete a column-mySQL updated
  export function mySqlPermissiveColumnDropCheck(
    ColToDrop,
    tableName
  ) {
  
    const querySet = [];
  
    if (ColToDrop.reference.length > 0 && ColToDrop.reference[0].IsDestination === true) {
      querySet.push(({status: 'failed', errorMsg: `MySQL restriction. Column "${ColToDrop.column}" cannot be dropped due to dependencies`}));
      return querySet;
    }
  
    const QueryDropColumn = 'alter table ' + tableName + ' drop column ' + ColToDrop.column + ';';
    querySet.push({ type: 'single', query: QueryDropColumn });
  
    if (ColToDrop.pk === true && ColToDrop.fk === true) {
      querySet.push({ status: 'failed', errorMsg: `You are about to drop a primary key & foreign key column, in "${tableName}".\nIt may lose the relationship with other tables.` });
    } else if (ColToDrop.pk === true) {
      querySet.push({ status: 'failed', errorMsg: `You are about to drop a primary key column, in "${tableName}".\nIt may lose the relationship with other tables.` });
    } else if (ColToDrop.fk === true) {
      querySet.push({ status: 'failed', errorMsg: `You are about to drop a foreign key column, in "${tableName}".\nIt may lose the relationship with other tables.` });
    }
  
    return querySet;
  }
  
  
  //Note
  //Delete unique from table - alter table [table name] drop index [colmn name];
  
  //For furture features
  //Delete table - 	drop table [table name];
  //Make a column bigger - alter table [table name] modify [column name] VARCHAR(3);