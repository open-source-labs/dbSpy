import useCredentialsStore from '../../src/store/credentialsStore';
import { act, renderHook } from '@testing-library/react';
import { dbCredentials } from '@/Types';

describe('Unit testing credentialsStore', () => {
  let result: any;
  let setUser: any;
  let setDbCredentials: any;
  
    // Reset credentialsStore to initial state before each test
  beforeEach(() => {
    result = renderHook(useCredentialsStore).result;
    setUser = result.current.setUser;
    setDbCredentials = result.current.setDbCredentials;
  });

  it('should initialize with default state', () => {
    const { user, dbCredentials } = result.current;
    expect(user).toBeNull();
    expect(dbCredentials).toEqual({});
  });

  it('should set user', () => {
    act(() => {
      setUser({ name: 'David' });
    });

    expect(result.current.user).toEqual({ name: 'David' });
  });

  it('should set dbCredentials', () => {
    act(() => {
      setDbCredentials({
        database_name: 'testDB',
        username: 'testUser',
        password: 'testPassword',
        hostname: 'localhost',
        port: '5432',
        database_link: 'dbtype://address@example.foo.bar.com/test',
        db_type: 'postgres'
      });
    });

    const expected: dbCredentials = {
      database_name: 'testDB',
      username: 'testUser',
      password: 'testPassword',
      hostname: 'localhost',
      port: '5432',
      database_link: 'dbtype://address@example.foo.bar.com/test',
      db_type: 'postgres'
    };

    expect(result.current.dbCredentials).toEqual(expected);
  });

  it('should handle ports as numbers when setting dbCredentials', () => {
    act(() => {
      setDbCredentials({
        database_name: 'testDB',
        username: 'testUser',
        password: 'testPassword',
        hostname: 'localhost',
        port: 5432,
        database_link: 'dbtype://address@example.foo.bar.com/test',
        db_type: 'postgres'
      });
    });

    const expected = {
      database_name: 'testDB',
      username: 'testUser',
      password: 'testPassword',
      hostname: 'localhost',
      port: 5432,
      database_link: 'dbtype://address@example.foo.bar.com/test',
      db_type: 'postgres'
    };

    expect(result.current.dbCredentials).toEqual(expected);
  });

  it('should handle null values for database name, port, hostname, and link when setting dbCredentials', () => {
    act(() => {
      setDbCredentials({
        database_name: null,
        username: 'testUser',
        password: 'testPassword',
        hostname: null,
        port: null,
        database_link: null,
        db_type: 'postgres'
      });
    });

    const expected = {
      database_name: null,
      username: 'testUser',
      password: 'testPassword',
      hostname: null,
      port: null,
      database_link: null,
      db_type: 'postgres'
    }

    expect(result.current.dbCredentials).toEqual(expected);
  });
});