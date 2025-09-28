import React from "react";
import SmartForm from "./SmartForm";
import { render, screen } from "@testing-library/react";
import { expect, test } from "@jest/globals";

test("renders SmartForm component", () => {
  render(<SmartForm />);
  const element = screen.getByText(/SmartForm/i);
  expect(element); // no TS error 🎉
});
