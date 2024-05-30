"use client";
import cloudUploadIcon from "../../../../public/assets/cloudUploadIcon.svg";
import fileIcon from "../../../../public/assets/fileIcon.svg";
import trash from "../../../../public/assets/deleteIcon.svg";
import { useRef, useState } from "react";
import Header from "../Header";
import { DeclareContractPayload, hash, CallData, UniversalDeployerContractPayload, CompiledSierraCasm } from "starknet";
import { useAccount } from "@starknet-react/core";
import MyContractExecutionModal from "../MyContractExecutionModal";
import { createPortal } from "react-dom";
import { isSetIterator } from "util/types";
import { MdToken } from "react-icons/md";
import Image from "next/image";
import { Call } from "starknet";
import spinner from "../../../public/assets/spinner.svg";
import rightArr from "../../../public/assets/right-arr.svg";
import toast from "react-hot-toast";
import MyAbi from "../../abi/mycontract.abi.json";
import { ETH_SEPOLIA, STRK_SEPOLIA, USDC_SEPOLIA } from "@/app/utils/constant";
import { formatCurrency } from "@/app/utils/currency";
import { useContractRead } from "@starknet-react/core";
import Bottom from "../Bottom";
import '../app.css';

interface FileList {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

function App() {

  const { account, status, isConnected } = useAccount();

  const decimalsTokenContractEth = 10**18;
  const decimalsTokenContractStrk = 10**18;
  const decimalsTokenContractUsdc = 10**6;

  const contractAddress = "0x0347def0979f4e07685a5021c8918bdd8a53e5e3425c84605ac32aef592f8060";
  const userAddress = String(account?.address);
  const { data: lendApyRateEth_data, isLoading: lendApyRateEth_loading } = useContractRead({
    address: contractAddress,
    abi: MyAbi,
    functionName: "frontend_supply_apy",
    args: [ETH_SEPOLIA],
    watch: true,
  });
  const lendApyRateEth = lendApyRateEth_loading ? "Loading..." : Number(lendApyRateEth_data).toFixed(2) + "%";

  const { data: lendApyRateStrk_data, isLoading: lendApyRateStrk_loading } = useContractRead({
    address: contractAddress,
    abi: MyAbi,
    functionName: "frontend_supply_apy",
    args: [STRK_SEPOLIA],
    watch: true,
  });
  const lendApyRateStrk = lendApyRateStrk_loading ? "Loading..." : Number(lendApyRateStrk_data).toFixed(2) + "%";

  const { data: lendApyRateUsdc_data, isLoading: lendApyRateUsdc_loading } = useContractRead({
    address: contractAddress,
    abi: MyAbi,
    functionName: "frontend_supply_apy",
    args: [USDC_SEPOLIA],
    watch: true,
  });
  const lendApyRateUsdc = lendApyRateUsdc_loading ? "Loading..." : Number(lendApyRateUsdc_data).toFixed(2) + "%";

  const { data: borrowApyRateEth_data, isLoading: borrowApyRateEth_loading } = useContractRead({
    address: contractAddress,
    abi: MyAbi,
    functionName: "frontend_borrow_apy",
    args: [ETH_SEPOLIA],
    watch: true,
  });
  const borrowApyRateEth = borrowApyRateEth_loading ? "Loading..." : Number(borrowApyRateEth_data).toFixed(2) + "%";

  const { data: borrowApyRateStrk_data, isLoading: borrowApyRateStrk_loading } = useContractRead({
    address: contractAddress,
    abi: MyAbi,
    functionName: "frontend_borrow_apy",
    args: [STRK_SEPOLIA],
    watch: true,
  });
  const borrowApyRateStrk = borrowApyRateStrk_loading ? "Loading..." : Number(borrowApyRateStrk_data).toFixed(2) + "%";

  const { data: borrowApyRateUsdc_data, isLoading: borrowApyRateUsdc_loading } = useContractRead({
    address: contractAddress,
    abi: MyAbi,
    functionName: "frontend_borrow_apy",
    args: [USDC_SEPOLIA],
    watch: true,
  });
  const borrowApyRateUsdc = borrowApyRateUsdc_loading ? "Loading..." : Number(borrowApyRateUsdc_data).toFixed(2) + "%";

  const { data: totalDepositedAmoundEth_data, isLoading: totalDepositedAmoundEth_loading } = useContractRead({
    address: contractAddress,
    abi: MyAbi,
    functionName: "frontend_total_deposited_amount",
    args: [ETH_SEPOLIA],
    watch: true,
  });
  const totalDepositedAmoundEth = totalDepositedAmoundEth_loading ? "Loading..." : Number(totalDepositedAmoundEth_data) / decimalsTokenContractEth;
  const { data: totalDepositedAmoundStrk_data, isLoading: totalDepositedAmoundStrk_loading } = useContractRead({
    address: contractAddress,
    abi: MyAbi,
    functionName: "frontend_total_deposited_amount",
    args: [STRK_SEPOLIA],
    watch: true,
  });
  const totalDepositedAmoundStrk = totalDepositedAmoundStrk_loading ? "Loading..." : Number(totalDepositedAmoundStrk_data) / decimalsTokenContractStrk;

  const { data: totalDepositedAmoundUsdc_data, isLoading: totalDepositedAmoundUsdc_loading } = useContractRead({
    address: contractAddress,
    abi: MyAbi,
    functionName: "frontend_total_deposited_amount",
    args: [USDC_SEPOLIA],
    watch: true,
  });
  const totalDepositedAmoundUsdc = totalDepositedAmoundUsdc_loading ? "Loading..." : Number(totalDepositedAmoundUsdc_data) / decimalsTokenContractUsdc;

  const { data: totalBorrowedAmountEth_data, isLoading: totalBorrowedAmountEth_loading } = useContractRead({
    address: contractAddress,
    abi: MyAbi,
    functionName: "frontend_total_borrowed_amount",
    args: [ETH_SEPOLIA],
    watch: true,
  });
  const totalBorrowedAmountEth = totalBorrowedAmountEth_loading ? "Loading..." : Number(totalBorrowedAmountEth_data) / decimalsTokenContractEth;

  const { data: totalBorrowedAmountStrk_data, isLoading: totalBorrowedAmountStrk_loading } = useContractRead({
    address: contractAddress,
    abi: MyAbi,
    functionName: "frontend_total_borrowed_amount",
    args: [STRK_SEPOLIA],
    watch: true,
  });
  const totalBorrowedAmountStrk = totalBorrowedAmountStrk_loading ? "Loading..." : Number(totalBorrowedAmountStrk_data) / decimalsTokenContractStrk;

  const { data: totalBorrowedAmountUsdc_data, isLoading: totalBorrowedAmountUsdc_loading } = useContractRead({
    address: contractAddress,
    abi: MyAbi,
    functionName: "frontend_total_borrowed_amount",
    args: [USDC_SEPOLIA],
    watch: true,
  });
  const totalBorrowedAmountUsdc = totalBorrowedAmountUsdc_loading ? "Loading..." : Number(totalBorrowedAmountUsdc_data) / decimalsTokenContractUsdc;

  const { data: assetPriceEth_data, isLoading: assetPriceEth_loading } = useContractRead({
    address: contractAddress,
    abi: MyAbi,
    functionName: "get_asset_price",
    args: [ETH_SEPOLIA],
    watch: true,
  });
  const assetPriceEth = assetPriceEth_loading ? "Loading..." : Number(Number(assetPriceEth_data) / 10**8).toFixed(2) + "$";

  const { data: assetPriceStrk_data, isLoading: assetPriceStrk_loading } = useContractRead({
    address: contractAddress,
    abi: MyAbi,
    functionName: "get_asset_price",
    args: [STRK_SEPOLIA],
    watch: true,
  });
  const assetPriceStrk = assetPriceStrk_loading ? "Loading..." : Number(Number(assetPriceStrk_data) / 10**8).toFixed(2) + "$";

  const { data: assetPriceUsdc_data, isLoading: assetPriceUsdc_loading } = useContractRead({
    address: contractAddress,
    abi: MyAbi,
    functionName: "get_asset_price",
    args: [USDC_SEPOLIA],
    watch: true,
  });
  const assetPriceUsdc = assetPriceUsdc_loading ? "Loading..." : Number(Number(assetPriceUsdc_data) / 10**8).toFixed(2) + "$";




  const [argumentError, setArgumentError] = useState("");
  const [buttonClicked, setButtonClicked] = useState(false);
  const [tokenUsed, setTokenUsed] = useState("");

  const disableButton = !isConnected || !account;

  const argumentsList = [
    { name: "Token", isTitle: true, price: "Price", supplyApy: "Supply APY", borrowApy: "Borrow APY", totalSupplied: "Total supplied", totalBorrowed: "Total to borrow" },
    { name: "Eth", isTitle: false, price: assetPriceEth, supplyApy: lendApyRateEth, borrowApy: borrowApyRateEth, totalSupplied: String(Number(totalDepositedAmoundEth).toFixed(3) + " Eth"), totalBorrowed: String(Number(totalBorrowedAmountEth).toFixed(3) + " Eth") },
    { name: "Strk", isTitle: false, price: assetPriceStrk, supplyApy: lendApyRateStrk, borrowApy: borrowApyRateStrk, totalSupplied: String(Number(totalDepositedAmoundStrk).toFixed(3) + " Strk"), totalBorrowed: String(Number(totalBorrowedAmountStrk).toFixed(3) + " Strk") },
    { name: "Usdc", isTitle: false, price: assetPriceUsdc, supplyApy: lendApyRateUsdc, borrowApy: borrowApyRateUsdc, totalSupplied: String(Number(totalDepositedAmoundUsdc).toFixed(3) + " Usdc"), totalBorrowed: String(Number(totalBorrowedAmountUsdc).toFixed(3) + " Usdc") },
  ];

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <div className="flex flex-col dark:text-white text-black">
      {buttonClicked &&
        <MyContractExecutionModal
          isOpen={buttonClicked}
          onClose={() => setButtonClicked(false)}
          account={account}
          tokenUsed={tokenUsed}
        />}
      <Header />
      <div className="flex items-center text-center flex-col">
        <h1 className="text-6xl font-bold mt-80 md:mt-16">Lending market:</h1>

        <p>Using this app comes at risk.
          By using the app you acknowledge <a href="https://github.com/zkcairo/0liqlend-contract/blob/main/readme.md" target="_blank"><u>these warnings</u></a>.
        </p>
        
        <div className="mb-4 flex flex-col mt-12">
          <div className="mb-16 text-center gap-y-3">
            {argumentsList.map((arg, index) => (
              <div key={index} className="flex flex-row items-center gap-x-2">
                <h4 className="text-base font-medium w-[50px] md:w-[120px]">{arg.name}</h4>
                <h4 className="text-base font-big w-[120px] hidden md:block">{arg.price}</h4>
                <h4 className="text-base font-medium w-[70px] md:w-[120px]">{arg.supplyApy}</h4>
                <h4 className="text-base font-medium w-[70px] md:w-[120px]">{arg.borrowApy}</h4>
                <h4 className="text-base font-medium w-[120px] hidden md:block">{arg.totalSupplied}</h4>
                <h4 className="text-base font-medium w-[120px] hidden md:block">{arg.totalBorrowed}</h4>
                {!arg.isTitle && (
                  <button onClick={() => { setTokenUsed(arg.name); setButtonClicked(true) }} disabled={disableButton} type="button" className="py-3 px-4 rounded-[5px] w-[90px] md:w-[200px] text-base disabled:bg-slate-300 disabled:cursor-not-allowed">
                    Supply/Borrow
                    </button>
                )}
              </div>
            ))}
            {argumentError === "" && (
              <h6 className="text-red-600 text-sm">{argumentError}</h6>
            )}
          </div>
        </div>
  
        <Bottom />
      </div>
    </div>
  );
  
}

export default App;
