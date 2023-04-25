"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const queryGen_1 = __importDefault(require("../src/queryGen"));
const schema = {
    testTable: {
        testTable: {
            Name: 'testColumn',
            Value: '10',
            TableName: 'testTable',
            References: [{
                    PrimaryKeyName: "",
                    ReferencesPropertyName: "",
                    PrimaryKeyTableName: "",
                    ReferencesTableName: "",
                    IsDestination: false,
                    constraintName: ""
                }],
            IsPrimaryKey: true,
            IsForeignKey: false,
            field_name: "uhhh",
            data_type: 'BIGINT',
            additional_constraints: ""
        },
        testTable2: {
            Name: 'testColumn2',
            Value: '11',
            TableName: 'testTable2',
            References: [{
                    PrimaryKeyName: "",
                    ReferencesPropertyName: "",
                    PrimaryKeyTableName: "",
                    ReferencesTableName: "",
                    IsDestination: false,
                    constraintName: ""
                }],
            IsPrimaryKey: false,
            IsForeignKey: true,
            field_name: "uhhh",
            data_type: 'BIGINT',
            additional_constraints: ""
        }
    }
};
describe('QueryGen...', () => {
    // CREATE TABLE "test" ( "testrow" serial NOT NULL PRIMARY KEY );
    const output = (0, queryGen_1.default)(schema);
    it('should output an object of arrays containing a create table query', () => {
        expect(output.create[0]).toContain('CREATE TABLE "public"."testTable"');
    });
    it('should output column details create table queries', () => {
        expect(output.create[0]).toContain('"uhhh" BIGINT');
    });
    it('should add PRIMARY KEY constraint', () => {
        expect(output.create[0]).toContain('PRIMARY KEY');
    });
    it('should add alter table query when foreign key exists', () => {
        expect(output.alter[0]).toContain('ALTER TABLE');
    });
});
//# sourceMappingURL=queryGen.spec.js.map