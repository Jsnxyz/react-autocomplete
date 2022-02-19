import React from "react";
import {render, screen, act, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import * as mockCalls from '../requests/pokemons';
import * as mockData from './mock';

jest.mock('../requests/pokemons');

describe("Test Autocomplete functionality", function () {
    let inputNode = null;
    let buttonNode = null;

    beforeEach(() => {
        render(<App />);
        inputNode = screen.getByPlaceholderText(/enter/i);
        inputNode.value = "";
        buttonNode = screen.getByText(/use pokédex/i);
    })

    it('Shows no suggestions for values that are not present', async function() {
        mockCalls.searchPokemonByStartString.mockResolvedValue(mockData.noSuggestions);
        
        act(() => userEvent.type(inputNode, '1'));
        
        await waitFor(() => {
            expect(screen.queryByRole("suggestions")).toBeNull();
        });
    });
    
    it('Show suggestions for values that are present', async function() {
        mockCalls.searchPokemonByStartString.mockResolvedValue(mockData.suggestionsFor_A);
        
        act(() => userEvent.type(inputNode, 'a'));
        
        const suggestionsNode = await screen.findByRole("suggestions");
        
        expect(suggestionsNode.querySelectorAll('div').length).toBe(10);
    });
    
    it('User is able to click and find any value from suggestion list', async function() {
        mockCalls.searchPokemonByStartString.mockResolvedValue(mockData.suggestionsFor_A);
        mockCalls.findPokemon.mockResolvedValue(mockData.samplePokemon);
        
        act(() => userEvent.type(inputNode, 'a'));
        
        const suggestionsNode = await screen.findByRole("suggestions");
        const randomItemNode = suggestionsNode.querySelectorAll('div')[3];
        
        act(() => userEvent.click(randomItemNode));
        
        const resultImg = await screen.findByAltText("articuno");
        
        await waitFor(() => {
            expect(inputNode).not.toHaveFocus();
            expect(inputNode.value).toBe(randomItemNode.textContent.trim());
            expect(screen.queryByRole("suggestions")).toBeNull();            
            expect(resultImg).toBeInTheDocument();
        })
    });
    
    it('No results should be shown for empty input in case of click or enter', async function() {
        mockCalls.searchPokemonByStartString.mockResolvedValue(mockData.noSuggestions);
        
        act(() => userEvent.click(inputNode));
        
        act(() => userEvent.type(inputNode, '{enter}'));
        
        await waitFor(() => {
            expect(screen.queryByRole("suggestions")).toBeNull();
            expect(screen.queryByRole("result")).toBeNull();
        });
    });

    it('Preceding space character shouldnt matter', async function() {
        mockCalls.searchPokemonByStartString.mockResolvedValue(mockData.noSuggestions);
        
        act(() => userEvent.click(inputNode));
        
        () => userEvent.type(inputNode, '{space}{enter}');
        
        await waitFor(() => {
            expect(screen.queryByRole("suggestions")).toBeNull();
            expect(screen.queryByRole("result")).toBeNull();
        })
    });

    it('Arrow up and down cycles the selected suggestion list', async function() {
        mockCalls.searchPokemonByStartString.mockResolvedValue(mockData.suggestionsFor_Ab);
        userEvent.type(inputNode, 'ab');
        const suggestionsNode = await screen.findByRole("suggestions");

        userEvent.type(inputNode, '{arrowdown}{arrowdown}{arrowdown}'); //cycles down to 3rd element
        
        const thirdElement = suggestionsNode.querySelectorAll('div')[2];
        await waitFor(() => {
            expect(inputNode.value).toBe(thirdElement.textContent.trim());
        });
        
        userEvent.type(inputNode, '{arrowdown}{arrowdown}{arrowdown}'); //cycles over 5th element i.e Should show user input
        await waitFor(() => {
            expect(inputNode.value).toBe('ab');
        });

        userEvent.type(inputNode, '{arrowup}'); //cycles up to 5th element
        
        const fifthElement = suggestionsNode.querySelectorAll('div')[4];
        await waitFor(() => {
            expect(inputNode.value).toBe(fifthElement.textContent.trim());
        });
    });

    it('User is able to find result after pressing enter on a suggested item', async function() {
        mockCalls.searchPokemonByStartString.mockResolvedValue(mockData.suggestionsFor_Ab);
        mockCalls.findPokemon.mockResolvedValue(mockData.samplePokemon);
        
        userEvent.type(inputNode, 'ab');
        
        const suggestionsNode = await screen.findByRole("suggestions");
        
        userEvent.type(inputNode, '{arrowdown}{arrowdown}{arrowdown}'); //cycles down to 3rd element
        
        const thirdElement = suggestionsNode.querySelectorAll('div')[2];

        userEvent.type(inputNode, '{enter}');
        const result = await screen.findByRole("result");
        await waitFor(() => {
            expect(inputNode.value).toBe(thirdElement.textContent.trim());
            expect(result).toBeInTheDocument();
        });
    });

    it.todo('Suggestions are shown regardless of character case i.e uppercase or lowercase'); //Cannot be mocked. Skipping...
    it.todo('Suggestions shown for H or h is same'); //Cannot be mocked. Skipping...
    it.todo('Suggestions are shown for relevant non alphabetical characters'); //Cannot be mocked. Skipping...
});