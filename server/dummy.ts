const dummydata = {
  "public.accounts": {
      "user_id": {
        IsForeignKey: false,
        IsPrimaryKey: false,
        Name: "user_id integer NOT NULL",
        References: [],
        TableName: "public.accounts",
        Value: null,
        additional_constraints: "NOT NULL",
        data_type: "integer",
        field_name: "user_id",
      },
      "username": {
        IsForeignKey: false,
        IsPrimaryKey: false,
        Name: "username character varying(50) NOT NULL",
        References: [],
        TableName: "public.accounts",
        Value: null,
        additional_constraints: "NOT NULL",
        data_type: "character varying(50)",
        field_name: "username",
      },
      "password": {
        IsForeignKey: false,
        IsPrimaryKey: false,
        Name: "password character varying(50) NOT NULL",
        References: [],
        TableName: "public.accounts",
        Value: null,
        additional_constraints: "NOT NULL",
        data_type: "character varying(50)",
        field_name: "password",
      },
      "email": {
        IsForeignKey: false,
        IsPrimaryKey: false,
        Name: "email character varying(255) NOT NULL",
        References: [],
        TableName: "public.accounts",
        Value: null,
        additional_constraints: "NOT NULL",
        data_type: "character varying(255)",
        field_name: "email",
      },
      "created_on": {
        IsForeignKey: false,
        IsPrimaryKey: false,
        Name: "created_on timestamp without time zone NOT NULL",
        References: [],
        TableName: "public.accounts",
        Value: null,
        additional_constraints: "NOT NULL",
        data_type: "timestamp without time zone",
        field_name: "created_on",
      },
      "last_login": {
        IsForeignKey: false,
        IsPrimaryKey: false,
        Name: "last_login timestamp without time zone",
        References: [],
        TableName: "public.accounts",
        Value: null,
        additional_constraints: null,
        data_type: "timestamp without time zone",
        field_name: "last_login",
      },
  },
  
    "public.location": {
      "id": {
        IsForeignKey: false,
        IsPrimaryKey: false,
        Name: "id integer NOT NULL",
        References: [],
        TableName: "public.location",
        Value: null,
        additional_constraints: "NOT NULL",
        data_type: "integer",
        field_name: "id",
      },
      "zipcode": {
        IsForeignKey: false,
        IsPrimaryKey: false,
        Name: "zipcode character varying(15)",
        References: [],
        TableName: "public.location",
        Value: null,
        additional_constraints: null,
        data_type: "character varying(15)",
        field_name: "zipcode",
      },
      "state": {
        IsForeignKey: false,
        IsPrimaryKey: false,
        Name: "state character varying(20)",
        References: [],
        TableName: "public.location",
        Value: null,
        additional_constraints: null,
        data_type: "character varying(20)",
        field_name: "state",
      },
      "city": {
        IsForeignKey: false,
        IsPrimaryKey: false,
        Name: "city character varying(30)",
        References: [],
        TableName: "public.location",
        Value: null,
        additional_constraints: null,
        data_type: "character varying(30)",
        field_name: "city",
      },
    },


  "public.usert": {
  "id": {
    IsForeignKey: false,
    IsPrimaryKey: false,
    Name: "id integer NOT NUL",
    References: [],
    TableName: "public.usert",
    Value: null,
    additional_constraints: "NOT NULL",
    data_type: "integer",
    field_name: "id",
    }
  },
  
  "public.user": {
    },
};




module.exports = {dummydata};


