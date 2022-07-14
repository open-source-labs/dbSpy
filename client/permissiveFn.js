/*
1. Discuss addition of references array for fk insertion
2. DIscuss how we might want to handle request to change datatype

*/
// constraints
const objConstraints = {
  UNIQUE: true,
  "PRIMARY KEY": true,
  "FOREIGN KEY": true,
  CHECK: true,
  EXCLUSION: true,
  "NOT NULL": true,
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

/*
let TableBeforeChange = {
    "public.accounts": {
        "user_id": {
            "Name": "user_id integer NOT NULL",
            "Value": null,
            "TableName": "public.accounts",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "user_id",
            "data_type": "integer",
            "additional_constraints": "NOT NULL"
        },
        "username": {
            "Name": "username character varying(50) NOT NULL",
            "Value": null,
            "TableName": "public.accounts",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "username",
            "data_type": "character varying(50)",
            "additional_constraints": "NOT NULL"
        },
        "password": {
            "Name": "password character varying(50) NOT NULL",
            "Value": null,
            "TableName": "public.accounts",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "password",
            "data_type": "character varying(50)",
            "additional_constraints": "NOT NULL"
        },
        "email": {
            "Name": "email character varying(255) NOT NULL",
            "Value": null,
            "TableName": "public.accounts",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "email",
            "data_type": "character varying(255)",
            "additional_constraints": "NOT NULL"
        },
        "created_on": {
            "Name": "created_on timestamp without time zone NOT NULL",
            "Value": null,
            "TableName": "public.accounts",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "created_on",
            "data_type": "timestamp without time zone",
            "additional_constraints": "NOT NULL"
        },
        "last_login": {
            "Name": "last_login timestamp without time zone",
            "Value": null,
            "TableName": "public.accounts",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "last_login",
            "data_type": "timestamp without time zone",
            "additional_constraints": null
        }
    },
    "public.conditions": {
        "id": {
            "Name": "id integer NOT NULL",
            "Value": null,
            "TableName": "public.conditions",
            "References": [
                {
                    "PrimaryKeyName": "id integer NOT NULL",
                    "ReferencesPropertyName": "id integer NOT NULL",
                    "PrimaryKeyTableName": "public.user_accounts",
                    "ReferencesTableName": "public.conditions",
                    "IsDestination": false,
                    "constrainName": "user_id"
                }
            ],
            "IsPrimaryKey": true,
            "IsForeignKey": true,
            "field_name": "id",
            "data_type": "integer",
            "additional_constraints": "NOT NULL"
        },
        "hypertension": {
            "Name": "hypertension boolean",
            "Value": null,
            "TableName": "public.conditions",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "hypertension",
            "data_type": "boolean",
            "additional_constraints": null
        },
        "diabetes": {
            "Name": "diabetes boolean",
            "Value": null,
            "TableName": "public.conditions",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "diabetes",
            "data_type": "boolean",
            "additional_constraints": null
        },
        "cancer": {
            "Name": "cancer boolean",
            "Value": null,
            "TableName": "public.conditions",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "cancer",
            "data_type": "boolean",
            "additional_constraints": null
        },
        "alzheimers": {
            "Name": "alzheimers boolean",
            "Value": null,
            "TableName": "public.conditions",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "alzheimers",
            "data_type": "boolean",
            "additional_constraints": null
        },
        "dementia": {
            "Name": "dementia boolean",
            "Value": null,
            "TableName": "public.conditions",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "dementia",
            "data_type": "boolean",
            "additional_constraints": null
        },
        "smoking": {
            "Name": "smoking boolean",
            "Value": null,
            "TableName": "public.conditions",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "smoking",
            "data_type": "boolean",
            "additional_constraints": null
        },
        "parkinsons": {
            "Name": "parkinsons boolean",
            "Value": null,
            "TableName": "public.conditions",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "parkinsons",
            "data_type": "boolean",
            "additional_constraints": null
        },
        "arthritis": {
            "Name": "arthritis boolean",
            "Value": null,
            "TableName": "public.conditions",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "arthritis",
            "data_type": "boolean",
            "additional_constraints": null
        },
        "ckd": {
            "Name": "ckd boolean",
            "Value": null,
            "TableName": "public.conditions",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "ckd",
            "data_type": "boolean",
            "additional_constraints": null
        },
        "stroke": {
            "Name": "stroke boolean",
            "Value": null,
            "TableName": "public.conditions",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "stroke",
            "data_type": "boolean",
            "additional_constraints": null
        },
        "copd": {
            "Name": "copd boolean",
            "Value": null,
            "TableName": "public.conditions",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "copd",
            "data_type": "boolean",
            "additional_constraints": null
        },
        "osteoporosis": {
            "Name": "osteoporosis boolean",
            "Value": null,
            "TableName": "public.conditions",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "osteoporosis",
            "data_type": "boolean",
            "additional_constraints": null
        },
        "user_id": {
            "Name": "user_id integer",
            "Value": null,
            "TableName": "public.conditions",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "user_id",
            "data_type": "integer",
            "additional_constraints": null
        }
    },
    "public.location": {
        "id": {
            "Name": "id integer NOT NULL",
            "Value": null,
            "TableName": "public.location",
            "References": [
                {
                    "PrimaryKeyName": "location_id integer",
                    "ReferencesPropertyName": "id integer NOT NULL",
                    "PrimaryKeyTableName": "public.profile",
                    "ReferencesTableName": "public.location",
                    "IsDestination": true,
                    "constrainName": "profile_location_id_fkey"
                }
            ],
            "IsPrimaryKey": true,
            "IsForeignKey": true,
            "field_name": "id",
            "data_type": "integer",
            "additional_constraints": "NOT NULL"
        },
        "zipcode": {
            "Name": "zipcode character varying(15)",
            "Value": null,
            "TableName": "public.location",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "zipcode",
            "data_type": "character varying(15)",
            "additional_constraints": null
        },
        "state": {
            "Name": "state character varying(20)",
            "Value": null,
            "TableName": "public.location",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "state",
            "data_type": "character varying(20)",
            "additional_constraints": null
        },
        "city": {
            "Name": "city character varying(30)",
            "Value": null,
            "TableName": "public.location",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "city",
            "data_type": "character varying(30)",
            "additional_constraints": null
        }
    },
    "public.profile": {
        "id": {
            "Name": "id integer NOT NULL",
            "Value": null,
            "TableName": "public.profile",
            "References": [],
            "IsPrimaryKey": true,
            "IsForeignKey": false,
            "field_name": "id",
            "data_type": "integer",
            "additional_constraints": "NOT NULL"
        },
        "age": {
            "Name": "age integer",
            "Value": null,
            "TableName": "public.profile",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "age",
            "data_type": "integer",
            "additional_constraints": null
        },
        "weight": {
            "Name": "weight integer",
            "Value": null,
            "TableName": "public.profile",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "weight",
            "data_type": "integer",
            "additional_constraints": null
        },
        "address": {
            "Name": "address character varying(50)",
            "Value": null,
            "TableName": "public.profile",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "address",
            "data_type": "character varying(50)",
            "additional_constraints": null
        },
        "role": {
            "Name": "role character varying(10)",
            "Value": null,
            "TableName": "public.profile",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "role",
            "data_type": "character varying(10)",
            "additional_constraints": null
        },
        "phone": {
            "Name": "phone character varying(20)",
            "Value": null,
            "TableName": "public.profile",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "phone",
            "data_type": "character varying(20)",
            "additional_constraints": null
        },
        "language": {
            "Name": "language character varying(15)",
            "Value": null,
            "TableName": "public.profile",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "language",
            "data_type": "character varying(15)",
            "additional_constraints": null
        },
        "firstname": {
            "Name": "firstname character varying(20)",
            "Value": null,
            "TableName": "public.profile",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "firstname",
            "data_type": "character varying(20)",
            "additional_constraints": null
        },
        "lastname": {
            "Name": "lastname character varying(20)",
            "Value": null,
            "TableName": "public.profile",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "lastname",
            "data_type": "character varying(20)",
            "additional_constraints": null
        },
        "location_id": {
            "Name": "location_id integer",
            "Value": null,
            "TableName": "public.profile",
            "References": [
                {
                    "PrimaryKeyName": "id integer NOT NULL",
                    "ReferencesPropertyName": "location_id integer",
                    "PrimaryKeyTableName": "public.location",
                    "ReferencesTableName": "public.profile",
                    "IsDestination": false,
                    "constrainName": "profile_location_id_fkey"
                }
            ],
            "IsPrimaryKey": false,
            "IsForeignKey": true,
            "field_name": "location_id",
            "data_type": "integer",
            "additional_constraints": null
        },
        "user_id": {
            "Name": "user_id integer",
            "Value": null,
            "TableName": "public.profile",
            "References": [
                {
                    "PrimaryKeyName": "id integer NOT NULL",
                    "ReferencesPropertyName": "user_id integer",
                    "PrimaryKeyTableName": "public.user_accounts",
                    "ReferencesTableName": "public.profile",
                    "IsDestination": false,
                    "constrainName": "profile_user_id_fkey"
                }
            ],
            "IsPrimaryKey": false,
            "IsForeignKey": true,
            "field_name": "user_id",
            "data_type": "integer",
            "additional_constraints": null
        },
        "email": {
            "Name": "email character varying(40)",
            "Value": null,
            "TableName": "public.profile",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "email",
            "data_type": "character varying(40)",
            "additional_constraints": null
        }
    },
    "public.request": {
        "id": {
            "Name": "id integer NOT NULL",
            "Value": null,
            "TableName": "public.request",
            "References": [],
            "IsPrimaryKey": true,
            "IsForeignKey": false,
            "field_name": "id",
            "data_type": "integer",
            "additional_constraints": "NOT NULL"
        },
        "starttime": {
            "Name": "starttime character varying(20)",
            "Value": null,
            "TableName": "public.request",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "starttime",
            "data_type": "character varying(20)",
            "additional_constraints": null
        },
        "endtime": {
            "Name": "endtime character varying(20)",
            "Value": null,
            "TableName": "public.request",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "endtime",
            "data_type": "character varying(20)",
            "additional_constraints": null
        },
        "startdate": {
            "Name": "startdate character varying(20)",
            "Value": null,
            "TableName": "public.request",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "startdate",
            "data_type": "character varying(20)",
            "additional_constraints": null
        },
        "enddate": {
            "Name": "enddate character varying(20)",
            "Value": null,
            "TableName": "public.request",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "enddate",
            "data_type": "character varying(20)",
            "additional_constraints": null
        },
        "message": {
            "Name": "message text",
            "Value": null,
            "TableName": "public.request",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "message",
            "data_type": "text",
            "additional_constraints": null
        },
        "status": {
            "Name": "status character varying(20)",
            "Value": null,
            "TableName": "public.request",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "status",
            "data_type": "character varying(20)",
            "additional_constraints": null
        },
        "m": {
            "Name": "m boolean",
            "Value": null,
            "TableName": "public.request",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "m",
            "data_type": "boolean",
            "additional_constraints": null
        },
        "t": {
            "Name": "t boolean",
            "Value": null,
            "TableName": "public.request",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "t",
            "data_type": "boolean",
            "additional_constraints": null
        },
        "w": {
            "Name": "w boolean",
            "Value": null,
            "TableName": "public.request",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "w",
            "data_type": "boolean",
            "additional_constraints": null
        },
        "th": {
            "Name": "th boolean",
            "Value": null,
            "TableName": "public.request",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "th",
            "data_type": "boolean",
            "additional_constraints": null
        },
        "f": {
            "Name": "f boolean",
            "Value": null,
            "TableName": "public.request",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "f",
            "data_type": "boolean",
            "additional_constraints": null
        },
        "sat": {
            "Name": "sat boolean",
            "Value": null,
            "TableName": "public.request",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "sat",
            "data_type": "boolean",
            "additional_constraints": null
        },
        "sun": {
            "Name": "sun boolean",
            "Value": null,
            "TableName": "public.request",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "sun",
            "data_type": "boolean",
            "additional_constraints": null
        },
        "provider_id": {
            "Name": "provider_id integer",
            "Value": null,
            "TableName": "public.request",
            "References": [
                {
                    "PrimaryKeyName": "id integer NOT NULL",
                    "ReferencesPropertyName": "provider_id integer",
                    "PrimaryKeyTableName": "public.user_accounts",
                    "ReferencesTableName": "public.request",
                    "IsDestination": false,
                    "constrainName": "request_provider_id_fkey"
                }
            ],
            "IsPrimaryKey": false,
            "IsForeignKey": true,
            "field_name": "provider_id",
            "data_type": "integer",
            "additional_constraints": null
        },
        "patient_id": {
            "Name": "patient_id integer",
            "Value": null,
            "TableName": "public.request",
            "References": [
                {
                    "PrimaryKeyName": "id integer NOT NULL",
                    "ReferencesPropertyName": "patient_id integer",
                    "PrimaryKeyTableName": "public.user_accounts",
                    "ReferencesTableName": "public.request",
                    "IsDestination": false,
                    "constrainName": "request_patient_id_fkey"
                }
            ],
            "IsPrimaryKey": false,
            "IsForeignKey": true,
            "field_name": "patient_id",
            "data_type": "integer",
            "additional_constraints": null
        }
    },
    "public.user_accounts": {
        "id": {
            "Name": "id integer NOT NULL",
            "Value": null,
            "TableName": "public.user_accounts",
            "References": [
                {
                    "PrimaryKeyName": "user_id integer",
                    "ReferencesPropertyName": "id integer NOT NULL",
                    "PrimaryKeyTableName": "public.profile",
                    "ReferencesTableName": "public.user_accounts",
                    "IsDestination": true,
                    "constrainName": "profile_user_id_fkey"
                },
                {
                    "PrimaryKeyName": "patient_id integer",
                    "ReferencesPropertyName": "id integer NOT NULL",
                    "PrimaryKeyTableName": "public.request",
                    "ReferencesTableName": "public.user_accounts",
                    "IsDestination": true,
                    "constrainName": "request_patient_id_fkey"
                },
                {
                    "PrimaryKeyName": "provider_id integer",
                    "ReferencesPropertyName": "id integer NOT NULL",
                    "PrimaryKeyTableName": "public.request",
                    "ReferencesTableName": "public.user_accounts",
                    "IsDestination": true,
                    "constrainName": "request_provider_id_fkey"
                },
                {
                    "PrimaryKeyName": "id integer NOT NULL",
                    "ReferencesPropertyName": "id integer NOT NULL",
                    "PrimaryKeyTableName": "public.conditions",
                    "ReferencesTableName": "public.user_accounts",
                    "IsDestination": true,
                    "constrainName": "user_id"
                }
            ],
            "IsPrimaryKey": true,
            "IsForeignKey": true,
            "field_name": "id",
            "data_type": "integer",
            "additional_constraints": "NOT NULL"
        },
        "username": {
            "Name": "username character varying(20)",
            "Value": null,
            "TableName": "public.user_accounts",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "username",
            "data_type": "character varying(20)",
            "additional_constraints": null
        },
        "password": {
            "Name": "password character varying(20)",
            "Value": null,
            "TableName": "public.user_accounts",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "password",
            "data_type": "character varying(20)",
            "additional_constraints": null
        },
        "role": {
            "Name": "role character varying(10)",
            "Value": null,
            "TableName": "public.user_accounts",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "role",
            "data_type": "character varying(10)",
            "additional_constraints": null
        }
    },
    "public.userb": {
        "id": {
            "Name": "id integer NOT NULL",
            "Value": null,
            "TableName": "public.userb",
            "References": [],
            "IsPrimaryKey": true,
            "IsForeignKey": false,
            "field_name": "id",
            "data_type": "integer",
            "additional_constraints": "NOT NULL"
        },
        "username": {
            "Name": "username character varying(20)",
            "Value": null,
            "TableName": "public.userb",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "username",
            "data_type": "character varying(20)",
            "additional_constraints": null
        },
        "password": {
            "Name": "password character varying(20)",
            "Value": null,
            "TableName": "public.userb",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "password",
            "data_type": "character varying(20)",
            "additional_constraints": null
        },
        "role": {
            "Name": "role character varying(10)",
            "Value": null,
            "TableName": "public.userb",
            "References": [],
            "IsPrimaryKey": false,
            "IsForeignKey": false,
            "field_name": "role",
            "data_type": "character varying(10)",
            "additional_constraints": null
        }
    },
    "public.usert": {
        "id": {
            "Name": "id integer NOT NULL",
            "Value": null,
            "TableName": "public.usert",
            "References": [],
            "IsPrimaryKey": true,
            "IsForeignKey": false,
            "field_name": "id",
            "data_type": "integer",
            "additional_constraints": "NOT NULL"
        }
    }
}

let ColBeforeChange = { 
    "column": "user_id",
    "constraint": "NOT NULL UNIQUE",
    "fk": false,
    "id": "user_id",
    "isNew": false,
    "pk": false,
    "type": "integer",

    "References": [
        {
            "PrimaryKeyName": "user_id integer",
            "ReferencesPropertyName": "id integer NOT NULL",
            "PrimaryKeyTableName": "public.profile",
            "ReferencesTableName": "public.user_accounts",
            "IsDestination": true
        },
        {
            "PrimaryKeyName": "patient_id integer",
            "ReferencesPropertyName": "id integer NOT NULL",
            "PrimaryKeyTableName": "public.request",
            "ReferencesTableName": "public.user_accounts",
            "IsDestination": true
        },
        {
            "PrimaryKeyName": "provider_id integer",
            "ReferencesPropertyName": "id integer NOT NULL",
            "PrimaryKeyTableName": "public.request",
            "ReferencesTableName": "public.user_accounts",
            "IsDestination": true
        },
        {
            "PrimaryKeyName": "id integer NOT NULL",
            "ReferencesPropertyName": "id integer NOT NULL",
            "PrimaryKeyTableName": "public.conditions",
            "ReferencesTableName": "public.user_accounts",
            "IsDestination": true
        }
    ]
   
}

let ColAfterChange = { 
    "column": "kevin",
    "constraint": " CHECK",
    "fk": false,
    "id": "user_id",
    "isNew": false,
    "pk": true,
    "type": "integer",
    
         "References": 
                {
                    "PrimaryKeyName": "user_id integer",
                    "ReferencesPropertyName": "id integer NOT NULL",
                    "PrimaryKeyTableName": "public.profile",
                    "ReferencesTableName": "public.user_accounts",
                    "IsDestination": true
                }
            
    
}

let tableName = "public.accounts"

*/

export default function permissiveColumnCheck(
  ColBeforeChange,
  ColAfterChange,
  tableName,
  TableBeforeChange
) {
  // console.log('---------->',ColAfterChange);
  // console.log('---------->',ColBeforeChange);
  // console.log('---------->',tableName);
  // console.log('---------->',TableBeforeChange);

  //get current table involved with change.
  const impactedTable = TableBeforeChange[tableName];

  const querySet = [];
  const objChangeSet = {}; //ObjectSet is Set of changes to Column

  const err = {}; //error response handler

  //check Col Name Change Before vs. After

  if (ColAfterChange.isNew) {
    const UQueryNewCol =
      "ALTER TABLE " +
      tableName +
      " ADD " +
      ColAfterChange.column +
      " " +
      ColAfterChange.type;
    querySet.push(UQueryNewCol);
  } else ColAfterChange.column !== ColBeforeChange.column;
  {
    console.log("hey", ColAfterChange);
    console.log("ho", ColBeforeChange);
    //trim column name for whitespaces
    ColAfterChange.column = ColAfterChange.column.trim();

    // first check if the column name is empty
    if (ColAfterChange.column == null || ColAfterChange == undefined)
      return [
        { status: "failed", errorMsg: "Must not have empty column name" },
      ];

    //validate Name against restricted Column Names
    if (restrictedColNames[ColAfterChange.column.toUpperCase()]) {
      // console.log("restricted Column Name Violation to Table");
      return [
        {
          status: "failed",
          errorMsg: "Restricted Column Name Violation to Table",
        },
      ];
    }


    //regex check valid Column Name against Postgres ruleset.

    const regex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    //    console.log(ColAfterChange.column.match(regex));
    //    console.log(ColAfterChange.column);
    //    if (ColAfterChange.column.match(regex) == null )
    //    { console.log("failed")
    //     return ({status: "failed", errorMsg:"Postgres restricted column name violation"});
    //    }

    //check Column name against all other columns in table. If name already exist
    //in table, flag as error in fn response
    //    for (let colNames in impactedTable)
    //    {

    //     console.log("this is colNames", colNames)
    // if (impactedTable[colNames].Name.toUpperCase().indexOf(ColAfterChange.column.toUpperCase())!== -1)
    //    {
    //     console.log(impactedTable[colNames].Name)
    //     console.log(ColAfterChange.column)
    //     return ({status: "failed", errorMsg:"Postgres restriction. Duplicate column name"});
    //    }
    //    }

    objChangeSet.column = {
      status: true,
      newValue: ColAfterChange.column,
      oldValue: ColBeforeChange.column,
    };
    const nameQuery = "ALTER TABLE "
      .concat(tableName)
      .concat(" RENAME COLUMN ")
      .concat(ColBeforeChange.column)
      .concat(" TO ")
      .concat(ColAfterChange.column)
      .concat(";");
    querySet.push({ type: "single", query: nameQuery });

    console.log(querySet);
  }
  console.log("after the column is done", querySet);
  //check constraint col for changes. This should be an obj of objs, so we will code both
  //type for now
  if (typeof ColAfterChange.constraint == "string") {
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
            newConstObj.constraint[constraints] = { action: "add" };
        }
      }

      for (const prev in oldConstObj) {
        if (ColAfterChange.constraint.toUpperCase().indexOf(prev) == -1)
          newConstObj.constraint[prev] = { action: "remove" };
      }

      console.log(newConstObj.constraint);

      for (const constr in newConstObj.constraint) {
        console.log(constr, newConstObj.constraint[constr]);

        if (newConstObj.constraint[constr]) {
          if (newConstObj.constraint[constr].action == "add") {
            if (constr.toUpperCase() == "UNIQUE") {
                const Query1 =
                "ALTER TABLE '" +
                tableName +
                "' ADD UNIQUE ('" +
                ColAfterChange.column +
                "' );";

              querySet.push({ type: "single", query: Query1 });
            }

            if (constr.toUpperCase() == "NOT NULL") {
                const Query1 =
                "alter table " +
                tableName +
                " alter column " +
                ColAfterChange.column +
                " set not null;";

              querySet.push({ type: "single", query: Query1 });
            }
          }

          if (newConstObj.constraint[constr].action == "remove") {
            if (constr.toUpperCase() == "UNIQUE") {
                const UQuery1 =
                "DO $$ DECLARE row record; BEGIN FOR row IN SELECT table_constraints.constraint_name, table_constraints.table_name FROM information_schema.table_constraints INNER JOIN information_schema.key_column_usage ON key_column_usage.table_name = information_schema.table_constraints.table_name WHERE table_constraints.table_schema =   '" +
                tableName.split(".")[0] +
                "' AND table_constraints.table_name='" +
                tableName.split(".")[1] +
                "' AND constraint_type='" +
                "UNIQUE" +
                "' AND key_column_usage.column_name= '" +
                ColAfterChange.column +
                "' LOOP EXECUTE 'ALTER TABLE ' || row.table_name || ' DROP CONSTRAINT ' || row.constraint_name; END LOOP; END;$$";
              console.log(UQuery1);
              querySet.push({ type: "single", query: UQuery1 });
            }

            if (constr.toUpperCase() == "NOT NULL") {
                const UQuery1 =
                "ALTER TABLE " +
                tableName +
                " ALTER COLUMN " +
                ColAfterChange.column +
                " DROP NOT NULL;";
              querySet.push({ type: "single", query: UQuery1 });
            }
          }
        }
      }
    }
  }

  if (ColAfterChange.pk !== ColBeforeChange.pk) {
    // check if another pk exist in table
    if (ColAfterChange.pk == true) {
      for (const columns in impactedTable) {
        if (impactedTable[columns].IsPrimaryKey == true) {
          console.log(impactedTable[columns]);
          console.log("duplicate primary key detected");
          return [
            {
              status: "failed",
              errorMsg: "Postgres restriction. Duplicate primary key",
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
        action: "add",
        type: "PRIMARY KEY",
        constraint_name: "pk_".concat(tableName.split(".")[1].toLowerCase()),
        column: ColAfterChange.column,
      };

      const queryPrimary =
        "ALTER TABLE " +
        tableName.split(".")[1] +
        " ADD CONSTRAINT pk_" +
        tableName.split(".")[1] +
        " PRIMARY KEY (" +
        ColAfterChange.column +
        ");";
      //console.log(queryPrimary)
      querySet.push({ type: "single", query: queryPrimary });
    } else {
      for (let i = 0; i < ColBeforeChange.References.length; i++) {
        if (ColBeforeChange.References.IsDestination == true)
          return [
            {
              status: "failed",
              errorMsg:
                "Postgres restriction. Primary Key cannot be dropped due to dependences",
            },
          ];
      }
      objChangeSet.pk = { action: "remove" };

      const UQuery1 =
        "DO $$ DECLARE row record; BEGIN FOR row IN SELECT table_constraints.constraint_name, table_constraints.table_name FROM information_schema.table_constraints INNER JOIN information_schema.key_column_usage ON key_column_usage.table_name = information_schema.table_constraints.table_name WHERE table_constraints.table_schema =   '" +
        tableName.split(".")[0] +
        "' AND table_constraints.table_name='" +
        tableName.split(".")[1] +
        "' AND constraint_type='PRIMARY KEY' AND key_column_usage.column_name= '" +
        ColAfterChange.column +
        "' LOOP EXECUTE 'ALTER TABLE ' || row.table_name || ' DROP CONSTRAINT ' || row.constraint_name; END LOOP; END;$$";
      console.log(UQuery1);
      querySet.push({ type: "single", query: UQuery1 });
    }
  }
  if (ColAfterChange.fk !== ColBeforeChange.fk) {
    if (ColAfterChange.fk == true) {
      // Assume informaiton is in references object of ColAfterChange as follows:
      /*


        References
                {
                    "PrimaryKeyName": "user_id integer",
                    "ReferencesPropertyName": "id integer NOT NULL",
                    "PrimaryKeyTableName": "public.profile",
                    "ReferencesTableName": "public.user_accounts",
                    "IsDestination": true,
                    "constrainName": "profile_user_id_fkey"
                }

        */

      const queryForeign =
        "ALTER TABLE " +
        ColAfterChange.References.ReferencesTableName +
        " ADD CONSTRAINT " +
        tableName.split(".")[1] +
        "_" +
        ColAfterChange.column +
        "_fkey  FOREIGN KEY (" +
        ColAfterChange.References.ReferencesPropertyName.split(" ")[0] +
        ") REFERENCES " +
        ColAfterChange.References.PrimaryKeyTableName +
        "(" +
        ColAfterChange.References.PrimaryKeyName.split(" ")[0] +
        ");";

      querySet.push({ type: "single", query: queryForeign });
    } else {
      objChangeSet.fk = { action: "remove" };

      const UQuery1 =
        "DO $$ DECLARE row record; BEGIN FOR row IN SELECT table_constraints.constraint_name, table_constraints.table_name FROM information_schema.table_constraints INNER JOIN information_schema.key_column_usage ON key_column_usage.table_name = information_schema.table_constraints.table_name WHERE table_constraints.table_schema =   '" +
        tableName.split(".")[0] +
        "' AND table_constraints.table_name='" +
        tableName.split(".")[1] +
        "'AND constraint_type='FOREIGN KEY' AND key_column_usage.column_name= '" +
        ColAfterChange.column +
        "' LOOP EXECUTE 'ALTER TABLE ' || row.table_name || ' DROP CONSTRAINT ' || row.constraint_name; END LOOP; END;$$";
      console.log(UQuery1);
      querySet.push({ type: "single", query: UQuery1 });
    }
  }

  console.log(querySet);
  return querySet;
}

export function permissiveTableCheck(
  tableName,
  TableBeforeChange,
  TableAfterChange
) {
  //trim column name for whitespaces
  tableName = tableName.trim();
  console.log(
    "tableName: ",
    tableName,
    "TableBeforeChange: ",
    TableBeforeChange,
    "TableAfterChange: ",
    TableAfterChange
  );
  // first check if the column name is empty
  if (tableName == null || tableName == undefined) {
    return [{ status: "failed", errorMsg: "Must not have empty table name" }];
  }

  //validate Name against restricted Column Names
  if (restrictedColNames[tableName.toUpperCase()]) {
    return [
      {
        status: "failed",
        errorMsg: "Restricted Column Name Violation to Table",
      },
    ];
  }

  //regex
  const regex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  const found = tableName.match(regex);
  if (found === null) {
    return [{
      status: "failed",
      errorMsg: "Postgres restricted column name violation",
    }];
  }

  //check if table name is already existing
  for (let i = 0; i < Object.keys(TableBeforeChange).length; i++) {
    const name = Object.keys(TableBeforeChange)[i];
    if ("public." + tableName === name) {
      return [
        { status: "failed", errorMsg: "Cannot have duplicate table name" },
      ];
    }
  }

  const querySet = [];
  const QueryNewTable = "CREATE TABLE " + tableName + " ();";
  querySet.push({ type: "single", query: QueryNewTable });

  return querySet;
}
