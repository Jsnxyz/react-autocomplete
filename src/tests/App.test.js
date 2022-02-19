import React from "react";
import {render, screen, act, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import * as mockCalls from '../requests/pokemons';
import {suggestionsFor_Abra as mockData} from './mock';

jest.mock("../requests/pokemons");

describe("Rendering App Components and testing basic interactions", function () {
    beforeEach(() => render(<App />))
    
    it("Should have search input text box", function() {
        expect(screen.getByPlaceholderText(/enter/i)).toBeInTheDocument();
    });

    it("Should have Find Pokemon Message", function () {
        expect(screen.getByText("Find Pokémon")).toBeInTheDocument();
    });
    
    it("Should have search button disabled initially", function () {
        expect(screen.getByText(/use pokédex/i)).toBeDisabled();
    }); 

    it("Should have search button enabled when a character pressed in input box", async function () {
        const inputNode = screen.getByPlaceholderText(/enter/i);
        await userEvent.type(inputNode, 'a');
        expect(screen.getByText(/use pokédex/i)).toBeEnabled();
    }); 

    it("Should always be disabled when input box is empty", async function () {
        mockCalls.searchPokemonByStartString.mockResolvedValue(mockData);
        const inputNode = screen.getByPlaceholderText(/enter/i);
        const buttonNode = screen.getByText(/use pokédex/i);
        
        act(() => userEvent.click(inputNode));
        expect(inputNode).toHaveFocus();
        
        act(() => userEvent.type(inputNode, 'abra'));
        await waitFor(() => {
            expect(buttonNode).toBeEnabled();
        });
        
        act(() => inputNode.setSelectionRange(0, 4));
        act(() => userEvent.type(inputNode, '{backspace}'));
        await waitFor(() => {
            expect(buttonNode).toBeDisabled();
        });
    });
})