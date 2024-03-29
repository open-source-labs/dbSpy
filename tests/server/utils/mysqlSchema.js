export default {
  customers: {
    customerNumber: {
      Name: 'customerNumber',
      Value: null,
      data_type: 'int',
      TableName: 'customers',
      References: [],
      IsPrimaryKey: true,
      IsForeignKey: false,
      additional_constraints: 'PRIMARY KEY',
      field_name: 'customerNumber',
    },
    customerName: {
      Name: 'customerName',
      Value: null,
      data_type: 'varchar',
      TableName: 'customers',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'customerName',
    },
    contactLastName: {
      Name: 'contactLastName',
      Value: null,
      data_type: 'varchar',
      TableName: 'customers',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'contactLastName',
    },
    contactFirstName: {
      Name: 'contactFirstName',
      Value: null,
      data_type: 'varchar',
      TableName: 'customers',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'contactFirstName',
    },
    phone: {
      Name: 'phone',
      Value: null,
      data_type: 'varchar',
      TableName: 'customers',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'phone',
    },
    addressLine1: {
      Name: 'addressLine1',
      Value: null,
      data_type: 'varchar',
      TableName: 'customers',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'addressLine1',
    },
    addressLine2: {
      Name: 'addressLine2',
      Value: null,
      data_type: 'varchar',
      TableName: 'customers',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NA',
      field_name: 'addressLine2',
    },
    city: {
      Name: 'city',
      Value: null,
      data_type: 'varchar',
      TableName: 'customers',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'city',
    },
    state: {
      Name: 'state',
      Value: null,
      data_type: 'varchar',
      TableName: 'customers',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NA',
      field_name: 'state',
    },
    postalCode: {
      Name: 'postalCode',
      Value: null,
      data_type: 'varchar',
      TableName: 'customers',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NA',
      field_name: 'postalCode',
    },
    country: {
      Name: 'country',
      Value: null,
      data_type: 'varchar',
      TableName: 'customers',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'country',
    },
    salesRepEmployeeNumber: {
      Name: 'salesRepEmployeeNumber',
      Value: null,
      data_type: 'int',
      TableName: 'customers',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NA',
      field_name: 'salesRepEmployeeNumber',
    },
    creditLimit: {
      Name: 'creditLimit',
      Value: null,
      data_type: 'decimal',
      TableName: 'customers',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NA',
      field_name: 'creditLimit',
    },
  },
  employees: {
    employeeNumber: {
      Name: 'employeeNumber',
      Value: null,
      data_type: 'int',
      TableName: 'employees',
      References: [],
      IsPrimaryKey: true,
      IsForeignKey: false,
      additional_constraints: 'PRIMARY KEY',
      field_name: 'employeeNumber',
    },
    lastName: {
      Name: 'lastName',
      Value: null,
      data_type: 'varchar',
      TableName: 'employees',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'lastName',
    },
    firstName: {
      Name: 'firstName',
      Value: null,
      data_type: 'varchar',
      TableName: 'employees',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'firstName',
    },
    extension: {
      Name: 'extension',
      Value: null,
      data_type: 'varchar',
      TableName: 'employees',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'extension',
    },
    email: {
      Name: 'email',
      Value: null,
      data_type: 'varchar',
      TableName: 'employees',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'email',
    },
    officeCode: {
      Name: 'officeCode',
      Value: null,
      data_type: 'varchar',
      TableName: 'employees',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'officeCode',
    },
    reportsTo: {
      Name: 'reportsTo',
      Value: null,
      data_type: 'int',
      TableName: 'employees',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NA',
      field_name: 'reportsTo',
    },
    jobTitle: {
      Name: 'jobTitle',
      Value: null,
      data_type: 'varchar',
      TableName: 'employees',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'jobTitle',
    },
  },
  offices: {
    officeCode: {
      Name: 'officeCode',
      Value: null,
      data_type: 'varchar',
      TableName: 'offices',
      References: [],
      IsPrimaryKey: true,
      IsForeignKey: false,
      additional_constraints: 'PRIMARY KEY',
      field_name: 'officeCode',
    },
    city: {
      Name: 'city',
      Value: null,
      data_type: 'varchar',
      TableName: 'offices',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'city',
    },
    phone: {
      Name: 'phone',
      Value: null,
      data_type: 'varchar',
      TableName: 'offices',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'phone',
    },
    addressLine1: {
      Name: 'addressLine1',
      Value: null,
      data_type: 'varchar',
      TableName: 'offices',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'addressLine1',
    },
    addressLine2: {
      Name: 'addressLine2',
      Value: null,
      data_type: 'varchar',
      TableName: 'offices',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NA',
      field_name: 'addressLine2',
    },
    state: {
      Name: 'state',
      Value: null,
      data_type: 'varchar',
      TableName: 'offices',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NA',
      field_name: 'state',
    },
    country: {
      Name: 'country',
      Value: null,
      data_type: 'varchar',
      TableName: 'offices',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'country',
    },
    postalCode: {
      Name: 'postalCode',
      Value: null,
      data_type: 'varchar',
      TableName: 'offices',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'postalCode',
    },
    territory: {
      Name: 'territory',
      Value: null,
      data_type: 'varchar',
      TableName: 'offices',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'territory',
    },
  },
  orderdetails: {
    orderNumber: {
      Name: 'orderNumber',
      Value: null,
      data_type: 'int',
      TableName: 'orderdetails',
      References: [],
      IsPrimaryKey: true,
      IsForeignKey: false,
      additional_constraints: 'PRIMARY KEY',
      field_name: 'orderNumber',
    },
    productCode: {
      Name: 'productCode',
      Value: null,
      data_type: 'varchar',
      TableName: 'orderdetails',
      References: [],
      IsPrimaryKey: true,
      IsForeignKey: false,
      additional_constraints: 'PRIMARY KEY',
      field_name: 'productCode',
    },
    quantityOrdered: {
      Name: 'quantityOrdered',
      Value: null,
      data_type: 'int',
      TableName: 'orderdetails',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'quantityOrdered',
    },
    priceEach: {
      Name: 'priceEach',
      Value: null,
      data_type: 'decimal',
      TableName: 'orderdetails',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'priceEach',
    },
    orderLineNumber: {
      Name: 'orderLineNumber',
      Value: null,
      data_type: 'smallint',
      TableName: 'orderdetails',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'orderLineNumber',
    },
  },
  orders: {
    orderNumber: {
      Name: 'orderNumber',
      Value: null,
      data_type: 'int',
      TableName: 'orders',
      References: [],
      IsPrimaryKey: true,
      IsForeignKey: false,
      additional_constraints: 'PRIMARY KEY',
      field_name: 'orderNumber',
    },
    orderDate: {
      Name: 'orderDate',
      Value: null,
      data_type: 'date',
      TableName: 'orders',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'orderDate',
    },
    requiredDate: {
      Name: 'requiredDate',
      Value: null,
      data_type: 'date',
      TableName: 'orders',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'requiredDate',
    },
    shippedDate: {
      Name: 'shippedDate',
      Value: null,
      data_type: 'date',
      TableName: 'orders',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NA',
      field_name: 'shippedDate',
    },
    status: {
      Name: 'status',
      Value: null,
      data_type: 'varchar',
      TableName: 'orders',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'status',
    },
    comments: {
      Name: 'comments',
      Value: null,
      data_type: 'text',
      TableName: 'orders',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NA',
      field_name: 'comments',
    },
    customerNumber: {
      Name: 'customerNumber',
      Value: null,
      data_type: 'int',
      TableName: 'orders',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'customerNumber',
    },
  },
  payments: {
    customerNumber: {
      Name: 'customerNumber',
      Value: null,
      data_type: 'int',
      TableName: 'payments',
      References: [],
      IsPrimaryKey: true,
      IsForeignKey: false,
      additional_constraints: 'PRIMARY KEY',
      field_name: 'customerNumber',
    },
    checkNumber: {
      Name: 'checkNumber',
      Value: null,
      data_type: 'varchar',
      TableName: 'payments',
      References: [],
      IsPrimaryKey: true,
      IsForeignKey: false,
      additional_constraints: 'PRIMARY KEY',
      field_name: 'checkNumber',
    },
    paymentDate: {
      Name: 'paymentDate',
      Value: null,
      data_type: 'date',
      TableName: 'payments',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'paymentDate',
    },
    amount: {
      Name: 'amount',
      Value: null,
      data_type: 'decimal',
      TableName: 'payments',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'amount',
    },
  },
  productlines: {
    productLine: {
      Name: 'productLine',
      Value: null,
      data_type: 'varchar',
      TableName: 'productlines',
      References: [],
      IsPrimaryKey: true,
      IsForeignKey: false,
      additional_constraints: 'PRIMARY KEY',
      field_name: 'productLine',
    },
    textDescription: {
      Name: 'textDescription',
      Value: null,
      data_type: 'varchar',
      TableName: 'productlines',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NA',
      field_name: 'textDescription',
    },
    htmlDescription: {
      Name: 'htmlDescription',
      Value: null,
      data_type: 'mediumtext',
      TableName: 'productlines',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NA',
      field_name: 'htmlDescription',
    },
    image: {
      Name: 'image',
      Value: null,
      data_type: 'mediumblob',
      TableName: 'productlines',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NA',
      field_name: 'image',
    },
  },
  products: {
    productCode: {
      Name: 'productCode',
      Value: null,
      data_type: 'varchar',
      TableName: 'products',
      References: [],
      IsPrimaryKey: true,
      IsForeignKey: false,
      additional_constraints: 'PRIMARY KEY',
      field_name: 'productCode',
    },
    productName: {
      Name: 'productName',
      Value: null,
      data_type: 'varchar',
      TableName: 'products',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'productName',
    },
    productLine: {
      Name: 'productLine',
      Value: null,
      data_type: 'varchar',
      TableName: 'products',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'productLine',
    },
    productScale: {
      Name: 'productScale',
      Value: null,
      data_type: 'varchar',
      TableName: 'products',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'productScale',
    },
    productVendor: {
      Name: 'productVendor',
      Value: null,
      data_type: 'varchar',
      TableName: 'products',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'productVendor',
    },
    productDescription: {
      Name: 'productDescription',
      Value: null,
      data_type: 'text',
      TableName: 'products',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'productDescription',
    },
    quantityInStock: {
      Name: 'quantityInStock',
      Value: null,
      data_type: 'smallint',
      TableName: 'products',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'quantityInStock',
    },
    buyPrice: {
      Name: 'buyPrice',
      Value: null,
      data_type: 'decimal',
      TableName: 'products',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'buyPrice',
    },
    MSRP: {
      Name: 'MSRP',
      Value: null,
      data_type: 'decimal',
      TableName: 'products',
      References: [],
      IsPrimaryKey: false,
      IsForeignKey: false,
      additional_constraints: 'NOT NULL',
      field_name: 'MSRP',
    },
  },
};
