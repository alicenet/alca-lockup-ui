import { AllowTokens, Connect, PhishingBox, Success, SwapTokens } from "components";

export const tabPanes = {
    PHISHING: {
        index: 0,
        name: 'Phishing Notification',
        component: () => <PhishingBox />
    },
    CONNECT: {
        index: 1,
        name: 'Connect',
        component: () => <Connect />
    },
    ALLOW: {
        index: 2,
        name: 'Allow',
        component: () => <AllowTokens />

    },
    MIGRATE: {
        index: 3,
        name: 'Migrate',
        component: () => <SwapTokens />

    },
    SUCCESS: {
        index: 4,
        name: 'Success',
        component: () => <Success />
    },
};