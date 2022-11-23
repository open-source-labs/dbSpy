/*
Frontend testing beginnings

Goals:
- React (TS)
- Zustand
- React Flow

*/


import React from "react";
import { render, screen } from "@testing-library/react";

import Navbar from '../../src/components/Navbar';
import Signup from '../../src/pages/Signup';

describe("placeholder", () => {
  // it('Renders navbar', () => {
  //   render(<Navbar />);
  //   expect(screen.getByText('Home')).toBeInTheDocument();
  // })

  it('Renders signup', () => {
    render(<Signup/>);
    expect(screen.getByText('Sign Up with Google')).toBeInTheDocument;
  })
})

// @testing-library/jest-dom