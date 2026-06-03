import { render, screen } from "@testing-library/react";
import { App } from "./App";

describe("App", () => {
  it("muestra el saludo principal", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /hola mundo/i })
    ).toBeInTheDocument();
  });
});
