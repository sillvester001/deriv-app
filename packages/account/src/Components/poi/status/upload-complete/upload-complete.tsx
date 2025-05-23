import React from 'react';
import { Icon, Text } from '@deriv/components';
import { routes } from '@deriv/shared';
import { useTranslations } from '@deriv-com/translations';
import RouteButton from '../../../route-button';
import PoaButton from '../../../poa/poa-button';
import IconMessageContent from '../../../icon-message-content/icon-message-content';
import { TPOIStatus } from 'Types';

export const UploadComplete = ({
    needs_poa,
    redirect_button,
    is_from_external,
    is_manual_upload = false,
}: TPOIStatus) => {
    const { localize } = useTranslations();
    const message = localize('Review in progress');
    const description = is_manual_upload
        ? localize('Your proof of identity is under review. We’ll get back to you within 1–3 working days.')
        : localize('Your proof of identity is under review. We’ll get back to you within 5 minutes.');

    if (!needs_poa) {
        return (
            <IconMessageContent message={message} text={description} icon={<Icon icon='IcPoiVerified' size={128} />}>
                {!is_from_external && (
                    <RouteButton button_label={localize("Return to Mathews Trader")} route={routes.traders_hub} />
                )}
            </IconMessageContent>
        );
    }
    return (
        <IconMessageContent message={message} icon={<Icon icon='IcPoiVerified' size={128} />}>
            <React.Fragment>
                <div className='account-management__text-container'>
                    <Text align='center' size='xs' as='p'>
                        {description}
                    </Text>
                    <Text align='center' size='xs' as='p'>
                        {localize('To start trading, you also need to verify your address.')}
                    </Text>
                </div>
                <PoaButton custom_text={localize('Next')} />
            </React.Fragment>
            {!is_from_external && redirect_button}
        </IconMessageContent>
    );
};

export default UploadComplete;
