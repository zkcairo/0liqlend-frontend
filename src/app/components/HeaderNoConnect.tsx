"use client";
import AddressBar, { UserModal } from "./AddressBar";
import { useEffect, useRef, useState } from "react";
import { useConnect, useAccount } from "@starknet-react/core";
import { LibraryBig } from "lucide-react";
import TransactionModal from "./TransactionList/TransactionModal";
import useTheme from "../hooks/useTheme";
import ThemeSwitch from "./Theme";
import NetworkSwitcher from "./NetworkSwitcher";
import ConnectModal from "./ConnectModal";
import "./app.css"

const HeaderNoConnect = () => {
  const { address } = useAccount();
  const [isTransactionModalOpen, setIsModalTransactionOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    setOpenMenu((prev) => !prev);
  };

  const handleOpenTransactionListClick = () => {
    setIsModalTransactionOpen(true);
  };

  const handleCloseTransactionListClick = () => {
    setIsModalTransactionOpen(false);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const { theme, changeTheme } = useTheme();

  return (
    <>
      <header
        ref={dropdownRef}
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
