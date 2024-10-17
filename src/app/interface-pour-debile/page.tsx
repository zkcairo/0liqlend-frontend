"use client";

import { useState } from "react";
import Header from "../components/Header";
import Bottom from "../components/Bottom";
import ManagePositionModal from "../components/ManagePositionModal";
import TakeOrderModal from "../components/TakeOrderModal";
import MakeOrderModal from "../components/MakeOrderModal";
import BestRateModal from "../components/BestRateModal";
import OrderBookGraph from "../components/OrderBookGraph";
import { useContractRead } from "@starknet-react/core";
import MyAbi from "../abi/mycontract.abi.json";
import { sortByYield } from "@/app/utils/array";
import { formatCurrency, formatTime } from "@/app/utils/format";
const contractAddress = CONTRACT_ADDRESS;
import {
  useAccount,
  useDisconnect,
  useStarkProfile,
} from "@starknet-react/core";
import { CONTRACT_ADDRESS, ETH_CATEGORY, PLATFORM_FEE_APY, USDC_CATEGORY } from "@/app/utils/constant";

export default function OrderBookPage() {

  const { account, status, isConnected } = useAccount();

  const [market, setMarket] = useState("USDC");
  const [duration, setDuration] = useState("1 Week");
  const [advancedSelection, setAdvancedSelection] = useState(false);
  const [minimalDuration, setMinimalDuration] = useState(7*24);
  const [maximalDuration, setMaximalDuration] = useState(7*24);

  const [isManagePositionModalOpen, setIsManagePositionModalOpen] = useState(false);
  const [isTakeOrderModalOpen, setIsTakeOrderModalOpen] = useState(false);
  const [isMakeOrderModalOpen, setIsMakeOrderModalOpen] = useState(false);
  const [bestRateModalOpen, setBestRateModalOpen] = useState(false);

  const currentCategory = market === "USDC" ? USDC_CATEGORY : ETH_CATEGORY;

    //ETH
    const { data: users_data, isLoading: users_loading } = useContractRead({
      address: contractAddress,
      abi: MyAbi,
      functionName: "frontend_get_all_offers",
      args: [currentCategory],
      watch: true,
    });
    const all_offers = users_loading ? [Array(), Array()] : users_data as any[];
    console.log("all offers", all_offers);
  

  const disableButton = false; // Change this based on your logic

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col dark:text-white text-black">
        {isManagePositionModalOpen && (
          <ManagePositionModal
            isOpen={isManagePositionModalOpen}
            onClose={() => setIsManagePositionModalOpen(false)}
            account={account}
            tokenUsed={market}
            category={currentCategory}
            simplified={true}
          />
        )}
        {bestRateModalOpen && (
          <BestRateModal
            isOpen={bestRateModalOpen}
            onClose={() => setBestRateModalOpen(false)}
            account={account}
            tokenUsed={market}
            category={currentCategory}
            alloffers={all_offers}
          />
        )}
        <Header />
        <div className="flex items-center justify-center flex-col">
          <h1 className="text-4xl md:text-6xl font-bold mt-24 md:mt-16">0LiqLend</h1>
          <h2 className="text-1xl md:text-2xl">Your Peer-to-Peer Lending Hub:</h2>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-5">
            <div className="w-full mt-10">
            <p>Sophisticated users have placed borrowing and lending offers on this marketplace.</p>
            <p>You can now take any of them, on your terms, to get an attractive yield.</p>
            <br/>
            <p>Click on the button below to start choosing the terms of your loan, and start to lend ASAP.</p>
            <p>Enjoy competitive rates, customizable loan durations, and attractive yields.</p>
            </div>
          </div>


          <div className="block mt-16">
            <button
              onClick={() => { setBestRateModalOpen(true); }}
              disabled={!isConnected}
              className="py-3 px-4 disabled:bg-gray-300 disabled:text-white"
            >
                {!isConnected ? "Connect your wallet to use the app" :
                (<>Lend/Borrow</>)}
            </button>
            <button
              onClick={() => { setIsManagePositionModalOpen(true); }}
              disabled={!isConnected}
              className="py-3 px-4 disabled:bg-gray-300 disabled:text-white"
            >
              {!isConnected ? "Connect your wallet to use the app" : "Your loans"}
            </button>
          </div>
          {/* <div className="block">
            <button onClick={() => setMarket("USDC")} className={`py-2 px-4 ${market === "USDC" ? "buttonselected" : ""}`}>
              USDC
            </button>
            <button disabled onClick={() => setMarket("USDC")} className={`py-2 px-4 disabled:bg-gray-300 disabled:text-white`}>
              ETH
            </button>
            <button disabled className={`py-2 px-4 disabled:bg-gray-300 disabled:text-white`}>
              STRK
            </button>
          </div> */}

          <div className="block mt-5">
            <button className="py-3 px-4">
              <a href="/app">Go to the "advanced" market-maker interface</a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}