import {
    XIcon,
    TwitchIcon,
    TiktokIcon,
    InstagramIcon,
    GoogleIcon,
    GitHubIcon,
    YoutubeIcon,
} from "../../assets/links_icons/index.ts";

// ICONS FROM https://simpleicons.org/

const ICONS: { [key: string]: { domains: string[]; src: string; alt: string } } = {
    x: { domains: ["x.com", "twitter.com"], src: XIcon, alt: "X icon" },
    twitch: { domains: ["twitch.tv"], src: TwitchIcon, alt: "Twitch icon" },
    tiktok: { domains: ["tiktok.com"], src: TiktokIcon, alt: "Tiktok icon" },
    instagram: { domains: ["instagram.com"], src: InstagramIcon, alt: "Instagram icon" },
    google: { domains: ["google.com"], src: GoogleIcon, alt: "Google icon" },
    github: { domains: ["github.com"], src: GitHubIcon, alt: "GitHub icon" },
    youtube: { domains: ["youtube.com"], src: YoutubeIcon, alt: "YouTube icon" },
};

export default function SocialIcon({ url }: { url: string }) {
    const match = Object.values(ICONS).find(({ domains }) =>
        domains.some((domain) => url.includes(domain))
    );

    if (match) {
        return (
            <img
                src={match.src}
                className="w-5 h-5 mt-1 dark:invert"
                alt={match.alt}
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
