import React from "react";
import {render, screen} from '@testing-library/react';
import App from '../App';

describe("Rendering App Components", function () {
    render(<App />);
    it("Should have Find Pokemon Message", function () {
        expect(screen.getByText("Find Pokemons")).toBeInTheDocument();
    });

    it("Should have search input text box", function() {
        expect(screen.getByPlaceholderText(/search/g)).toBeInTheDocument();
    });
});