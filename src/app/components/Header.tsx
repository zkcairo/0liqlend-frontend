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

const Header = () => {
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const [openConnectModal, setOpenConnectModal] = useState(false);
  const [openConnectedModal, setOpenConnectedModal] = useState(false);
  const [isTransactionModalOpen, setIsModalTransactionOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const toggleModal = () => {
    setOpenConnectModal((prev) => !prev);
  };

  const toggleMenu = () => {
    setOpenMenu((prev) => !prev);
  };

  const toggleUserModal = () => {
    setOpenConnectedModal((prev) => !prev);
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

  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        toggleModal();
      }
    };
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, []);

  useEffect(() => {
    const lastUsedConnector = localStorage.getItem("lastUsedConnector");
    if (lastUsedConnector) {
      connect({
        connector: connectors.find(
          (connector) => connector.name === lastUsedConnector
        ),
      });
    }
  }, [connectors]);

  useEffect(() => {
    if (openConnectModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openConnectModal]);

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

        <div className="hidden md:flex gap-8">
          {address ? (
            <div className="flex justify-end">
              <AddressBar setOpenConnectedModal={setOpenConnectedModal} />
            </div>
          ) : (
            <button
              onClick={toggleModal}
              className="hidden md:block text-base py-2 px-4 rounded-full transition duration-300"
            >
              Connect
            </button>
          )}

      {/*    <NetworkSwitcher /> */}

          {/* <ThemeSwitch
            className="flex md:hidden lg:hidden sm:hidden dark:transform-none transform dark:translate-none transition-all duration-500 ease-in-out"
            action={changeTheme}
            theme={theme}
            openMenu={openMenu}
          /> */}
        </div>

        <div className="flex items-center md:hidden gap-8">
          <div className="overflow-hidden">
            <div className="flex flex-wrap gap-8">
              {address ? (
                <div className="flex justify-end">
                  <AddressBar setOpenConnectedModal={setOpenConnectedModal} />
                </div>
              ) : (
                <button
                  onClick={toggleModal}
                  className="text-base py-2 px-4 rounded-full transition duration-300"
                >
                  Connect
                </button>
              )}
          </div>
        </div>
        </div>
      </header>

      <ConnectModal isOpen={openConnectModal} onClose={toggleModal} />
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={handleCloseTransactionListClick}
      />
      <UserModal
        openConnectedModal={openConnectedModal}
        closeConnectedModal={toggleUserModal}
        address={address ? address : ""}
      />
    </>
  );
};

export default Header;
