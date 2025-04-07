//* .spec (the expected behavior for the component) vs .test (straughtforward saying here are the tests)

import React from 'react';
// render- lets us display the component
// screen- allows us to query the DOM for els
import { render, screen } from '@testing-library/react';
// simulates user behavior
import userEvent from '@testing-library/user-event';
import TestNewQuery from '../../src/pages/TestNewQuery';

//? Tests
describe('Test New Query Page', () => {});
