//* This creates a jest setup file (this will run for every time a test file runs)
import '@testing-library/jest-dom';
import React from 'react';
global.React = React;
