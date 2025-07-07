import {
    XIcon,
    TwitchIcon,
    TiktokIcon,
    InstagramIcon,
    GoogleIcon,
    GitHubIcon,
} from "../../assets/links_icons/index.ts";

// ICONS FROM https://simpleicons.org/

export default function SocialIcon({ url }: { url: string }) {
    if (url.includes("x.com") || url.includes("twitter.com")) {
        return (
            <img
                src={XIcon}
                className="w-5 h-5 mt-1 invert"
                alt="X icon"
                style={{ filter: "invert(1)" }}
            />
        );
    }

    if (url.includes("twitch.tv")) {
        return (
            <img
                src={TwitchIcon}
                className="w-5 h-5 mt-1 invert"
                alt="Twitch icon"
                style={{ filter: "invert(1)" }}
            />
        );
    }

    if (url.includes("tiktok.com")) {
        return (
            <img
                src={TiktokIcon}
                className="w-5 h-5 mt-1 invert"
                alt="Twitch icon"
                style={{ filter: "invert(1)" }}
            />
        );
    }

    if (url.includes("instagram.com")) {
        return (
            <img
                src={InstagramIcon}
                className="w-5 h-5 mt-1 invert"
                alt="Twitch icon"
                style={{ filter: "invert(1)" }}
            />
        );
    }

    if (url.includes("google.com")) {
        return (
            <img
                src={GoogleIcon}
                className="w-5 h-5 mt-1 invert"
                alt="Twitch icon"
                style={{ filter: "invert(1)" }}
            />
        );
    }

    if (url.includes("github.com")) {
        return (
            <img
                src={GitHubIcon}
                className="w-5 h-5 mt-1 invert"
                alt="Twitch icon"
                style={{ filter: "invert(1)" }}
            />
        );
    }

    return (
        <img
            src={`https://www.google.com/s2/favicons?domain=${url}&sz=64`}
            className="w-5 h-5 mt-1"
            alt="favicon"
        />
    );
}
