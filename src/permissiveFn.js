/*
1. Discuss addition of references array for fk insertion
2. DIscuss how we might want to handle request to change datatype


For PostgreSQL

*/
// constraints
const objConstraints = {
  UNIQUE: true,
  'PRIMARY KEY': true,
  'FOREIGN KEY': true,
  CHECK: true,
  EXCLUSION: true,
  'NOT NULL': true,
};

// restricted col names
const restrictedColNames = {
  ALL: true,
  ANALYSE: true,
  ANALYZE: true,
  AND: true,
  ANY: true,
  ARRAY: true,
  AS: true,
  ASC: true,
  ASYMMETRIC: true,
  BOTH: true,
  CASE: true,
  CAST: true,
  CHECK: true,
  COLLATE: true,
  COLUMN: true,
  CONSTRAINT: true,
  CREATE: true,
  CURRENT_CATALOG: true,
  CURRENT_DATE: true,
  CURRENT_ROLE: true,
  CURRENT_TIME: true,
  CURRENT_TIMESTAMP: true,
  CURRENT_USER: true,
  DEFAULT: true,
  DEFERRABLE: true,
  DESC: true,
  DISTINCT: true,
  DO: true,
  ELSE: true,
  END: true,
  EXCEPT: true,
  FALSE: true,
  FETCH: true,
  FOR: true,
  FOREIGN: true,
  FROM: true,
  GRANT: true,
  GROUP: true,
  HAVING: true,
  IN: true,
  INITIALLY: true,
  INTERSECT: true,
  INTO: true,
  LATERAL: true,
  LEADING: true,
  LIMIT: true,
  LOCALTIME: true,
  LOCALTIMESTAMP: true,
  NOT: true,
  NULL: true,
  OFFSET: true,
  ON: true,
  ONLY: true,
  OR: true,
  ORDER: true,
  PLACING: true,
  PRIMARY: true,
  REFERENCES: true,
  RETURNING: true,
  SELECT: true,
  SESSION_USER: true,
  SOME: true,
  SYMMETRIC: true,
  TABLE: true,
  THEN: true,
  TO: true,
  TRAILING: true,
  true: true,
  UNION: true,
  UNIQUE: true,
  USER: true,
  USING: true,
  VARIADIC: true,
  WHEN: true,
  WHERE: true,
  WINDOW: true,
  WITH: true,
};

export default function permissiveColumnCheck(
  ColBeforeChange,
  ColAfterChange,
  tableName,
  TableBeforeChange
) {

  //get current table involved with change.
  const impactedTable = TableBeforeChange[tableName];

  const querySet = [];
  const objChangeSet = {}; //ObjectSet is Set of changes to Column

  const err = {}; //error response handler

  //check Col Name Change Before vs. After
  
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
    
    //trim column name for whitespaces
    ColAfterChange.column = ColAfterChange.column.trim();

    // first check if the column name is empty
    if (ColAfterChange.column == null || ColAfterChange == undefined)
      return [
        { status: 'failed', errorMsg: 'Must not have empty column name' },
      ];

    //validate Name against restricted Column Names
    if (restrictedColNames[ColAfterChange.column.toUpperCase()]) {
      return [
        {
          status: 'failed',
          errorMsg: 'Restricted Column Name Violation to Table',
        },
      ];
    }

    //regex check valid Column Name against Postgres ruleset.

    const regex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    const found = ColAfterChange.column.match(regex);
    if (found === null) {
      return [
        {
          status: 'failed',
          errorMsg: 'Postgres restricted column name violation',
        },
      ];
    }

    objChangeSet.column = {
      status: true,
      newValue: ColAfterChange.column,
      oldValue: ColBeforeChange.column,
    };
    // Following block is executed if changes are permitted and changes exist on existing column
    const nameQuery = 'ALTER TABLE '
      .concat(tableName)
      .concat(' RENAME COLUMN ')
      .concat(ColBeforeChange.column)
      .concat(' TO ')
      .concat(ColAfterChange.column)
      .concat(';');
    querySet.push({ type: 'single', query: nameQuery });
  }

  if (ColAfterChange.type !== ColBeforeChange.type && !ColAfterChange.isNew) {
    const typeQuery =
      'ALTER TABLE ' +
      tableName +
      ' ALTER COLUMN ' +
      ColAfterChange.column +
      ' ' + ColAfterChange.type;
      querySet.push({ type: 'single', query: typeQuery});
  }

  //check constraint col for changes. This should be an obj of objs, so we will code both
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

      //logs only the new or removed constraints for query
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
                ' ALTER COLUMN ' +
                ColAfterChange.column +
                ' SET NOT NULL;';

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
                ' ALTER COLUMN ' +
                ColAfterChange.column +
                ' DROP NOT NULL;';
              querySet.push({ type: 'single', query: UQuery1 });
            }
          }
        }
      }
    }
  }

  //BeforeChange is boolean, AfterChange is string
  if (ColAfterChange.pk !== ColBeforeChange.pk.toString()) {
    // check if another pk exist in table
    if (ColAfterChange.pk === 'true') {
      for (const columns in impactedTable) {
        if (impactedTable[columns].IsPrimaryKey == 'true') {

          return [
            {
              status: 'failed',
              errorMsg: 'Postgres restriction. Duplicate primary key',
            },
          ];
        }
      }

      /*

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
                'Postgres restriction. Primary Key cannot be dropped due to dependencies',
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
  //trim column name for whitespaces
  tableName = tableName.trim();
  // first check if the column name is empty
  if (tableName == null || tableName == undefined) {
    return [{ status: 'failed', errorMsg: 'Must not have empty table name' }];
  }

  //validate Name against restricted Column Names
  if (restrictedColNames[tableName.toUpperCase()]) {
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

  //check if table name is already existing
 
  for (let i = 0; i < Object.keys(TableBeforeChange).length; i++) {
    const name = Object.keys(TableBeforeChange)[i];
    if ('public.' + tableName === name) {
      return [
        { status: 'failed', errorMsg: 'Cannot have duplicate table name' },
      ];
    }
  }

  const querySet = [];
  const QueryNewTable = 'CREATE TABLE ' + tableName + ' ();';
  querySet.push({ type: 'single', query: QueryNewTable });

  return querySet;
}

export function permissiveColumnDropCheck(
  ColToDrop,
  tableName
) {

  const querySet = [];

  if (ColToDrop.reference.length > 0 && ColToDrop.reference[0].IsDestination === true) {
    querySet.push(({status: 'failed', errorMsg: `Postgres restriction. Column "${ColToDrop.column}" cannot be dropped due to dependencies`}));
    return querySet;
  }

  const QueryDropColumn = 'ALTER TABLE ' + tableName + ' DROP COLUMN ' + ColToDrop.column + ';';
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
