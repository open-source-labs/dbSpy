import React from 'react';
import { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import TableNode from './TableNode';
// import CustomTableNode from './CustomTableNode';
// import CharacterTableNode from './CharacterTableNode';

const departmentSchema = {
  departments: {
    dept_no: {
      Name: 'dept_no',
      Value: null,
      data_type: 'char',
      TableName: 'departments',
      References: [],
      IsPrimaryKey: true,
      IsForeignKey: false,
      additional_constraints: 'PRIMARY KEY',
      field_name: 'dept_no',
    },
    dept_name: {
      Name: 'dept_name',
      Value: null,
      data_type: 'varchar',
      TableName: 'departments',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'dept_name',
    },
  },
  dept_emp: {
    emp_no: {
      Name: 'emp_no',
      Value: null,
      data_type: 'int',
      TableName: 'dept_emp',
      References: [
        {
          PrimaryKeyName: 'emp_no',
          PrimaryKeyTableName: 'employees',
          ReferencesPropertyName: 'emp_no',
          ReferencesTableName: 'dept_emp',
          IsDestination: false,
          constrainName: 'dept_emp_ibfk_1',
        },
      ],
      IsPrimaryKey: true,
      IsForeignKey: true,
      additional_constraints: 'PRIMARY KEY',
      field_name: 'emp_no',
    },
    dept_no: {
      Name: 'dept_no',
      Value: null,
      data_type: 'char',
      TableName: 'dept_emp',
      References: [
        {
          PrimaryKeyName: 'dept_no',
          PrimaryKeyTableName: 'departments',
          ReferencesPropertyName: 'dept_no',
          ReferencesTableName: 'dept_emp',
          IsDestination: false,
          constrainName: 'dept_emp_ibfk_2',
        },
      ],
      IsPrimaryKey: true,
      IsForeignKey: true,
      additional_constraints: 'PRIMARY KEY',
      field_name: 'dept_no',
    },
    from_date: {
      Name: 'from_date',
      Value: null,
      data_type: 'date',
      TableName: 'dept_emp',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'from_date',
    },
    to_date: {
      Name: 'to_date',
      Value: null,
      data_type: 'date',
      TableName: 'dept_emp',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'to_date',
    },
  },
  dept_manager: {
    emp_no: {
      Name: 'emp_no',
      Value: null,
      data_type: 'int',
      TableName: 'dept_manager',
      References: [
        {
          PrimaryKeyName: 'emp_no',
          PrimaryKeyTableName: 'employees',
          ReferencesPropertyName: 'emp_no',
          ReferencesTableName: 'dept_manager',
          IsDestination: false,
          constrainName: 'dept_manager_ibfk_1',
        },
      ],
      IsPrimaryKey: true,
      IsForeignKey: true,
      additional_constraints: 'PRIMARY KEY',
      field_name: 'emp_no',
    },
    dept_no: {
      Name: 'dept_no',
      Value: null,
      data_type: 'char',
      TableName: 'dept_manager',
      References: [
        {
          PrimaryKeyName: 'dept_no',
          PrimaryKeyTableName: 'departments',
          ReferencesPropertyName: 'dept_no',
          ReferencesTableName: 'dept_manager',
          IsDestination: false,
          constrainName: 'dept_manager_ibfk_2',
        },
      ],
      IsPrimaryKey: true,
      IsForeignKey: true,
      additional_constraints: 'PRIMARY KEY',
      field_name: 'dept_no',
    },
    from_date: {
      Name: 'from_date',
      Value: null,
      data_type: 'date',
      TableName: 'dept_manager',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'from_date',
    },
    to_date: {
      Name: 'to_date',
      Value: null,
      data_type: 'date',
      TableName: 'dept_manager',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'to_date',
    },
  },
  employees: {
    emp_no: {
      Name: 'emp_no',
      Value: null,
      data_type: 'int',
      TableName: 'employees',
      References: [],
      IsPrimaryKey: true,
      IsForeignKey: false,
      additional_constraints: 'PRIMARY KEY',
      field_name: 'emp_no',
    },
    birth_date: {
      Name: 'birth_date',
      Value: null,
      data_type: 'date',
      TableName: 'employees',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'birth_date',
    },
    first_name: {
      Name: 'first_name',
      Value: null,
      data_type: 'varchar',
      TableName: 'employees',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'first_name',
    },
    last_name: {
      Name: 'last_name',
      Value: null,
      data_type: 'varchar',
      TableName: 'employees',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'last_name',
    },
    gender: {
      Name: 'gender',
      Value: null,
      data_type: 'enum',
      TableName: 'employees',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'gender',
    },
    hire_date: {
      Name: 'hire_date',
      Value: null,
      data_type: 'date',
      TableName: 'employees',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'hire_date',
    },
  },
  salaries: {
    emp_no: {
      Name: 'emp_no',
      Value: null,
      data_type: 'int',
      TableName: 'salaries',
      References: [
        {
          PrimaryKeyName: 'emp_no',
          PrimaryKeyTableName: 'employees',
          ReferencesPropertyName: 'emp_no',
          ReferencesTableName: 'salaries',
          IsDestination: false,
          constrainName: 'salaries_ibfk_1',
        },
      ],
      IsPrimaryKey: true,
      IsForeignKey: true,
      additional_constraints: 'PRIMARY KEY',
      field_name: 'emp_no',
    },
    salary: {
      Name: 'salary',
      Value: null,
      data_type: 'int',
      TableName: 'salaries',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'salary',
    },
    from_date: {
      Name: 'from_date',
      Value: null,
      data_type: 'date',
      TableName: 'salaries',
      References: [],
      IsPrimaryKey: true,
      IsForeignKey: false,
      additional_constraints: 'PRIMARY KEY',
      field_name: 'from_date',
    },
    to_date: {
      Name: 'to_date',
      Value: null,
      data_type: 'date',
      TableName: 'salaries',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'to_date',
    },
  },
  titles: {
    emp_no: {
      Name: 'emp_no',
      Value: null,
      data_type: 'int',
      TableName: 'titles',
      References: [
        {
          PrimaryKeyName: 'emp_no',
          PrimaryKeyTableName: 'employees',
          ReferencesPropertyName: 'emp_no',
          ReferencesTableName: 'titles',
          IsDestination: false,
          constrainName: 'titles_ibfk_1',
        },
      ],
      IsPrimaryKey: true,
      IsForeignKey: true,
      additional_constraints: 'PRIMARY KEY',
      field_name: 'emp_no',
    },
    title: {
      Name: 'title',
      Value: null,
      data_type: 'varchar',
      TableName: 'titles',
      References: [],
      IsPrimaryKey: true,
      IsForeignKey: false,
      additional_constraints: 'PRIMARY KEY',
      field_name: 'title',
    },
    from_date: {
      Name: 'from_date',
      Value: null,
      data_type: 'date',
      TableName: 'titles',
      References: [],
      IsPrimaryKey: true,
      IsForeignKey: false,
      additional_constraints: 'PRIMARY KEY',
      field_name: 'from_date',
    },
    to_date: {
      Name: 'to_date',
      Value: null,
      data_type: 'date',
      TableName: 'titles',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NA',
      field_name: 'to_date',
    },
  },
};

const bookstoreSchema = {
  'bookstore.authors': {
    id: {
      Name: 'id integer NOT NULL',
      Value: null,
      TableName: 'bookstore.authors',
      References: [
        {
          PrimaryKeyName: 'id integer NOT NULL',
          ReferencesPropertyName: 'author_id integer NOT NULL',
          PrimaryKeyTableName: 'bookstore.authors',
          ReferencesTableName: 'bookstore.books_authors',
          IsDestination: true,
          constrainName: 'books_authors_author_id_fkey',
        },
      ],
      IsPrimaryKey: true,
      IsForeignKey: false,
      field_name: 'id',
      data_type: 'integer',
      additional_constraints: 'NOT NULL',
    },
    name: {
      Name: 'name character varying(255) NOT NULL',
      Value: null,
      TableName: 'bookstore.authors',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      field_name: 'name',
      data_type: 'character varying(255)',
      additional_constraints: 'NOT NULL',
    },
    bio: {
      Name: 'bio character varying(500) NOT NULL',
      Value: null,
      TableName: 'bookstore.authors',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      field_name: 'bio',
      data_type: 'character varying(500)',
      additional_constraints: 'NOT NULL',
    },
  },
  'bookstore.books': {
    id: {
      Name: 'id integer NOT NULL',
      Value: null,
      TableName: 'bookstore.books',
      References: [
        {
          PrimaryKeyName: 'id integer NOT NULL',
          ReferencesPropertyName: 'book_id integer NOT NULL',
          PrimaryKeyTableName: 'bookstore.books',
          ReferencesTableName: 'bookstore.books_authors',
          IsDestination: true,
          constrainName: 'books_authors_book_id_fkey',
        },
      ],
      IsPrimaryKey: true,
      IsForeignKey: false,
      field_name: 'id',
      data_type: 'integer',
      additional_constraints: 'NOT NULL',
    },
    title: {
      Name: 'title character varying(255) NOT NULL',
      Value: null,
      TableName: 'bookstore.books',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      field_name: 'title',
      data_type: 'character varying(255)',
      additional_constraints: 'NOT NULL',
    },
    description: {
      Name: 'description character varying(255) NOT NULL',
      Value: null,
      TableName: 'bookstore.books',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      field_name: 'description',
      data_type: 'character varying(255)',
      additional_constraints: 'NOT NULL',
    },
    isbn: {
      Name: 'isbn character(13) NOT NULL',
      Value: null,
      TableName: 'bookstore.books',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      field_name: 'isbn',
      data_type: 'character(13)',
      additional_constraints: 'NOT NULL',
    },
    genre_id: {
      Name: 'genre_id integer NOT NULL',
      Value: null,
      TableName: 'bookstore.books',
      References: [
        {
          PrimaryKeyName: 'id integer NOT NULL',
          ReferencesPropertyName: 'genre_id integer NOT NULL',
          PrimaryKeyTableName: 'bookstore.genres',
          ReferencesTableName: 'bookstore.books',
          IsDestination: false,
          constrainName: 'fk_genre',
        },
      ],
      IsPrimaryKey: false,
      IsForeignKey: true,
      field_name: 'genre_id',
      data_type: 'integer',
      additional_constraints: 'NOT NULL',
    },
  },
  'bookstore.books_authors': {
    book_id: {
      Name: 'book_id integer NOT NULL',
      Value: null,
      TableName: 'bookstore.books_authors',
      References: [
        {
          PrimaryKeyName: 'id integer NOT NULL',
          ReferencesPropertyName: 'book_id integer NOT NULL',
          PrimaryKeyTableName: 'bookstore.books',
          ReferencesTableName: 'bookstore.books_authors',
          IsDestination: false,
          constrainName: 'books_authors_book_id_fkey',
        },
      ],
      IsPrimaryKey: false,
      IsForeignKey: true,
      field_name: 'book_id',
      data_type: 'integer',
      additional_constraints: 'NOT NULL',
    },
    author_id: {
      Name: 'author_id integer NOT NULL',
      Value: null,
      TableName: 'bookstore.books_authors',
      References: [
        {
          PrimaryKeyName: 'id integer NOT NULL',
          ReferencesPropertyName: 'author_id integer NOT NULL',
          PrimaryKeyTableName: 'bookstore.authors',
          ReferencesTableName: 'bookstore.books_authors',
          IsDestination: false,
          constrainName: 'books_authors_author_id_fkey',
        },
      ],
      IsPrimaryKey: false,
      IsForeignKey: true,
      field_name: 'author_id',
      data_type: 'integer',
      additional_constraints: 'NOT NULL',
    },
    is_main_author: {
      Name: 'is_main_author boolean DEFAULT false NOT NULL',
      Value: null,
      TableName: 'bookstore.books_authors',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      field_name: 'is_main_author',
      data_type: 'boolean DEFAULT false',
      additional_constraints: 'NOT NULL',
    },
  },
  'bookstore.genres': {
    id: {
      Name: 'id integer NOT NULL',
      Value: null,
      TableName: 'bookstore.genres',
      References: [
        {
          PrimaryKeyName: 'id integer NOT NULL',
          ReferencesPropertyName: 'genre_id integer NOT NULL',
          PrimaryKeyTableName: 'bookstore.genres',
          ReferencesTableName: 'bookstore.books',
          IsDestination: true,
          constrainName: 'fk_genre',
        },
      ],
      IsPrimaryKey: true,
      IsForeignKey: false,
      field_name: 'id',
      data_type: 'integer',
      additional_constraints: 'NOT NULL',
    },
    name: {
      Name: 'name character varying(255) NOT NULL',
      Value: null,
      TableName: 'bookstore.genres',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      field_name: 'name',
      data_type: 'character varying(255)',
      additional_constraints: 'NOT NULL',
    },
    description: {
      Name: 'description character varying(255) NOT NULL',
      Value: null,
      TableName: 'bookstore.genres',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      field_name: 'description',
      data_type: 'character varying(255)',
      additional_constraints: 'NOT NULL',
    },
  },
};

// manually add initial edges
const createInitialEdges = (schemaObject) => {
  const edges = [];
  const allRows = [];
  const schemaVals = Object.values(schemaObject);
  for (const table of schemaVals) {
    allRows.push(...Object.values(table));
  }
  allRows.forEach((row) => {
    if (row.IsForeignKey) {
      edges.push({
        id: `${row.References[0].ReferencesTableName}-to-${row.References[0].PrimaryKeyTableName}`,
        source: row.References[0].ReferencesTableName,
        sourceHandle: row.References[0].ReferencesPropertyName,
        target: row.References[0].PrimaryKeyTableName,
        targetHandle: row.References[0].PrimaryKeyName,
        animated: true,
        type: 'smoothstep',
        style: {
          stroke: '#4a7187',
          strokeWidth: 8,
        },
        markerEnd: {
          type: 'arrowclosed',
          orient: 'auto',
          height: 6,
          width: 6,
          color: '#4a7187',
        },
        smoothstep: {
          borderRadius: 10,
        },
      });
    }
  });
  return edges;
};

const initialEdges = createInitialEdges(departmentSchema);
console.log(initialEdges);

// generates table nodes based on Schema Object
// i would like to figure out a way to visually differentiate join tables
const initialNodes = Object.entries(departmentSchema).map((table, index) => {
  return {
    id: table[0],
    type: 'table',
    position: { x: 100 * index + 50, y: 100 }, // got to figure out how to lay out the positions better
    data: { table, initialEdges },
  };
});

const nodeTypes = {
  table: TableNode,
};

function Flow() {
  // set up states for nodes and edges
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  // when a node is dragged or selected, onNodesChange (noNodeChange doesn't work) handler gets called. With the help of applyNodeChanges function, you can then apply those changes to your current node state.
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  // when an edge is dragged or selected, onEdgesChange handler gets called. With the help of applyEdgeChanges function, you can then apply those changes to your current edge state.
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // in order to connect nodes manually, we have to implement this onConnect handler and pass it to the <reactFlow /> component as well
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <div className="flow" style={{ height: '85%', width: '95%' }}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        // fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Flow;
