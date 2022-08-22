import { AllowTokens, Connect, PhishingBox, Success, SwapTokens, Introduction } from "components";

export const LINKS = {
    GITHUB: "https://github.com/alicenet",
    WHITEPAPER: "",
    COMMUNITY: "",
    DISCORD: "https://discord.gg/bkhW2KUWDu",
    TWITTER: "https://mobile.twitter.com/AliceNetChain",
    MEDIUM: "",
}

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
