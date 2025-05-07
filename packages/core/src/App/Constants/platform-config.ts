import { getPlatformSettings, routes } from '@deriv/shared';
import { localize } from '@deriv/translations';

type TPlatformConfig = {
    description: () => string;
    href?: string;
    icon: string;
    link_to?: string;
    name: string;
    title: () => string;
};

const platform_config: TPlatformConfig[] = [
    {
        icon: getPlatformSettings('trader').icon,
        title: () => getPlatformSettings('trader').name,
        name: getPlatformSettings('trader').name,
        description: () => localize('Mathews Trader.'),
        link_to: routes.trade,
    },
    {
        icon: getPlatformSettings('dbot').icon,
        title: () => getPlatformSettings('dbot').name,
        name: getPlatformSettings('dbot').name,
        description: () => localize('Mathews DBOT.'),
        href: routes.bot,
    },
    // {
    //     icon: getPlatformSettings('smarttrader').icon,
    //     title: () => getPlatformSettings('smarttrader').name,
    //     name: getPlatformSettings('smarttrader').name,
    //     description: () => localize('Trade the world’s markets with our popular user-friendly platform.'),
    //     href: routes.smarttrader,
    // },
];

export default platform_config;
