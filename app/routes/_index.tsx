import type { MetaFunction } from "@remix-run/node";

export default function Index() {
  return (
    <div>
      <h1 className="text-pink-500 text-5xl">Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "Schoolify" },
    {
      name: "description",
      content:
        "Marryright is a platform developed to educate people on Ghanaian marriages. It provides the procedures to follow to legally register one's marriage and also assist prospective couples to access relevant materials and institutions on marriage.",
    },
    {
      name: "author",
      content: "CodeKid & KwaminaWhyte",
    },
    { name: "og:title", content: "Schoolify" },
    {
      name: "og:description",
      content:
        "Marryright is a platform developed to educate people on Ghanaian marriages. It provides the procedures to follow to legally register one's marriage and also assist prospective couples to access relevant materials and institutions on marriage.",
    },
    {
      name: "og:image",
      content:
        "https://res.cloudinary.com/app-deity/image/upload/v1701282976/qfdbysyu0wqeugtcq9wq.jpg",
    },
    { name: "og:url", content: "https://marry-right.vercel.app" },
    {
      name: "keywords",
      content:
        "legal marriages in Ghana, Pastors to bless marriages, Is he/she married?, marriiage under ordinance, cases related to marriages in Ghana, mohammedans, ordinance, traditional, verify my marriage certificate, churches legally certified to bless marriages",
    },
  ];
};
