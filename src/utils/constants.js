import { AllowTokens, Connect, PhishingBox, Success, SwapTokens, Introduction } from "components";

export const tabPanes = {
    INTRO: {
        index: 0,
        name: 'Introduction',
        component: () => <Introduction />
    },
    PHISHING: {
        index: 1,
        name: 'Security Notification',
        component: () => <PhishingBox />
    },
    CONNECT: {
        index: 2,
        name: 'Connect',
        component: () => <Connect />
    },
    ALLOW: {
        index: 3,
        name: 'Allow',
        component: () => <AllowTokens />

    },
    MIGRATE: {
        index: 4,
        name: 'Migrate',
        component: () => <SwapTokens />

    },
    SUCCESS: {
        index: 5,
        name: 'Success',
        component: () => <Success />
    },
};
