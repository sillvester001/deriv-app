type TTabsTitle = {
    [key: string]: string | number;
};

type TDashboardTabIndex = {
    [key: string]: number;
};

export const tabs_title: TTabsTitle = Object.freeze({
    WORKSPACE: 'Workspace',
    CHART: 'Chart',
});

export const DBOT_TABS: TDashboardTabIndex = Object.freeze({
    DASHBOARD: 0,
    BOT_BUILDER: 1,
    MATHEWS_TOOL: 2,
    FREE_BOTS: 3,
    BEGINNERS_TOOL: 4,
    CHART: 5,
    MATHEWS_AI: 6,
    COPY_TRADING: 7,
    SIGNALS: 8,
    TUTORIAL: 9,
});

export const MAX_STRATEGIES = 10;

export const TAB_IDS = [
    'id-dbot-dashboard',
    'id-bot-builder',
    'id-mathews-tool',
    'id-free-bots',
    'id-beginners-tool',
    'id-charts',
    'id-mathews-ai',
    'id-copy-trading',
    'id-signals',
    'id-tutorials',
];

export const DEBOUNCE_INTERVAL_TIME = 500;
