import React from 'react';
import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { mock_ws } from 'Utils/mock';
import RootStore from 'Stores/index';
import { DBotStoreProvider, mockDBotStore } from 'Stores/useDBotStore';
import DashboardComponent from '../dashboard';

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => jest.fn());
const mockHandleTabChange = jest.fn();

describe('DashboardComponent', () => {
    let wrapper: ({ children }: { children: JSX.Element }) => JSX.Element, mock_DBot_store: RootStore | undefined;
    const mock_store = mockStore({});

    beforeAll(() => {
        mock_DBot_store = mockDBotStore(mock_store, mock_ws);

        wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock_store}>
                <DBotStoreProvider ws={mock_ws} mock={mock_DBot_store}>
                    {children}
                </DBotStoreProvider>
            </StoreProvider>
        );
    });

    it('should render the DashboardComponent', () => {
        const { container } = render(<DashboardComponent handleTabChange={mockHandleTabChange} />, {
            wrapper,
        });
        expect(container).toBeInTheDocument();
        expect(screen.getByText('Load or build your bot')).toBeInTheDocument();
    });

    it('should render the DashboardComponent with small text size on mobile', () => {
        mock_store.ui.is_mobile = true;
        render(<DashboardComponent handleTabChange={mockHandleTabChange} />, {
            wrapper,
        });

        expect(screen.getByText('Load or build your bot')).toHaveStyle('--text-size: var(--text-size-s)');
        expect(
            screen.getByText(
                'Deriv offers complex derivatives such as options and contracts for differences (“CFDs”). These products may not be suitable for all clients and trading them involves risk to you. Please ensure you understand the following risks before trading Deriv products: a) you may lose some or all of the money you invest in the trade, b) if your trade involves currency conversion, exchange rates will affect your profits and losses. You should never trade with borrowed money or money that you cannot afford to lose., build it from scratch, or start with a quick strategy.'
            )
        ).toHaveStyle('--text-size: var(--text-size-xxs)');
    });
});
