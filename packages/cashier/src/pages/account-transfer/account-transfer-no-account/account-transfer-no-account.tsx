import React from 'react';
import { Icon, Button, Text } from '@deriv/components';
import { routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { useStore, observer } from '@deriv/stores';
import './account-transfer-no-account.scss';
import { useHistory } from 'react-router-dom';

const AccountTransferNoAccount = observer(() => {
    const {
        common: { is_from_derivgo },
        traders_hub: { closeModal },
    } = useStore();

    const history = useHistory();

    React.useEffect(() => {
        closeModal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='cashier__wrapper cashier__no-balance'>
            <Icon icon='IcCashierNoBalance' className='cashier__no-balance-icon' size={116} />
            <Text as='h2' weight='bold' align='center'>
                <Localize i18n_default_text='You only have one account' />
            </Text>
            <Text as='p' size='xs' line_height='s' align='center'>
                <Localize i18n_default_text='Transferring funds will require you to create a second account.' />
            </Text>
            {!is_from_derivgo && (
                <Button
                    className='account-transfer-no-account__button'
                    primary
                    large
                    onClick={() => {
                        history.push(routes.traders_hub);
                    }}
                >
                    <Localize i18n_default_text="Back to Mathews Trader" />
                </Button>
            )}
        </div>
    );
});

export default AccountTransferNoAccount;
