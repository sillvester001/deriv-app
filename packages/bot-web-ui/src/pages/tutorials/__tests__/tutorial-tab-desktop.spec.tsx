import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mock_ws } from 'Utils/mock';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import TutorialsTabDesktop from '../tutorials-tab-desktop';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());

let mockFunction: boolean | jest.Mock;
jest.mock('lodash.debounce', () => (fn: jest.Mock) => {
    if (!mockFunction) mockFunction = fn;
    return mockFunction;
});

const userGuideContent = [
    {
        id: 1,
        type: 'Tour',
        subtype: 'OnBoard',
        content: 'Get started on Trader Mathews Bot',
        src: 'dbot-onboard-tour.png',
    },
];

const guideContent = [
    {
        id: 1,
        type: 'DBotVideo',
        content: 'An introduction to Trader Mathews Bot',
        url: 'https://www.youtube.com/embed/lthEgaIY1uw',
        src: 'intro_to_deriv_bot.png',
    },
];

const faqContent = [
    {
        title: 'What is Trader Mathews Bot?',
        description: [
            {
                type: 'text',
                content: 'Trader Mathews Bot is a web-based strategy builder for trading digital options',
            },
        ],
    },
];

describe('<TutorialsTabDesktop />', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element;
    const mock_store = mockStore({
        ui: {
            is_mobile: false,
        },
    });
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

    beforeEach(() => {
        mock_DBot_store?.quick_strategy?.setValue('durationtype', 't');
        mock_DBot_store?.quick_strategy?.setSelectedStrategy('MARTINGALE');
        mock_DBot_store?.quick_strategy?.setFormVisibility(true);
        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
        render(
            <BrowserRouter>
                <TutorialsTabDesktop tutorial_tabs={[...userGuideContent, ...guideContent, ...faqContent]} />
            </BrowserRouter>,
            {
                wrapper,
            }
        );
    });

    it('should render tutorials tab for desktop', () => {
        const inputElement = screen.getByTestId('id-test-input-search');
        expect(inputElement).toBeInTheDocument();
    });

    it('should call onFocusSearch when input is focused', () => {
        const inputElement = screen.getByTestId('id-test-input-search');
        userEvent.click(inputElement);
        expect(inputElement).toHaveFocus();
    });

    it('should call onSearch when input value changes', () => {
        const inputElement = screen.getByTestId('id-test-input-search');
        const inputValue = 'Test search query';
        userEvent.type(inputElement, inputValue);
        expect(inputElement).toHaveDisplayValue(inputValue);
    });

    it('should clear Search on input when clicked on close', () => {
        const inputElement = screen.getByTestId('id-test-input-search');
        const inputValue = 'Test search query';
        const checkinputValue = '';
        userEvent.type(inputElement, inputValue);

        const closeIcon = screen.getByTestId('id-test-close');
        userEvent.click(closeIcon);

        expect(inputElement.value).toBe(checkinputValue);
    });
});
