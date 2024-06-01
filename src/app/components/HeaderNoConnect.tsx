"use client";
import useTheme from "../hooks/useTheme";
import screen from "../../../public/screen.png";
import "./app.css"


const HeaderNoConnect = () => {

  const { theme, changeTheme } = useTheme();

  return (
    <>

        <title>0LiqLend</title>
        <meta name="description" content="0LiqLend is a lending app where you do NOT get liquidated. Instead, the protocol rebalance your positions at no cost when needed." />

        {/* Open Graph metadata */}
        <meta property="og:title" content="0LiqLend" />
        <meta property="og:description" content="0LiqLend is a lending app where you do NOT get liquidated. Instead, the protocol rebalance your positions at no cost when needed." />
        <meta property="og:image" content="https://0LiqLend.com/image.png" />
        <meta property="og:url" content="https://0LiqLend.com" />
        <meta property="og:type" content="website" />

        {/* Twitter Card metadata */}
        <meta name="twitter:card" content="https://0LiqLend.com/image.png" />
        <meta name="twitter:title" content="0LiqLend" />
        <meta name="twitter:description" content="0LiqLend is a lending app where you do NOT get liquidated. Instead, the protocol rebalance your positions at no cost when needed." />
        <meta name="twitter:image" content="https://0LiqLend.com/image.png" />
        <meta name="twitter:url" content="https://0LiqLend.com" />

      <header
        className="w-full fixed backdrop-blur-2xl dark:border-neutral-800 lg:bg-gray-200 lg:dark:bg-zinc-800/50 left-0 top-0  z-10 flex flex-wrap gap-4 py-2 px-4 md:py-4 md:px-10  justify-between items-center"
      >
        <a href="/">
          <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 40"
            width="200"
            height="40"
            className="md:text-[1.2em]"
          >
            <text
              x="10"
              y="30"
              fontFamily="Cursive, sans-serif"
              fill={`${theme === "dark" ? "white" : "black"}`}
            >
              0LiqLend
            </text>
          </svg>
          </span>
        </a>

      </header>
    </>
  );
};

export default HeaderNoConnect;
