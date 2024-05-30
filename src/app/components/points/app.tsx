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
import { ETH_SEPOLIA, STRK_SEPOLIA } from "@/app/utils/constant";
import { formatCurrency } from "@/app/utils/currency";
import { useContractRead } from "@starknet-react/core";
import Bottom from "../Bottom";

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

  const contractAddress = "0x0347def0979f4e07685a5021c8918bdd8a53e5e3425c84605ac32aef592f8060";
  const userAddress = String(account?.address);

  const { data: points_data, isLoading: points_loading } = useContractRead({
    address: contractAddress,
    abi: MyAbi,
    functionName: "frontend_get_user_points",
    args: [contractAddress],
    watch: true,
  });
  const points = points_loading ? "Loading..." : Number(points_data);

  const { data: totalpoints_data, isLoading: totalpoints_loading } = useContractRead({
    address: contractAddress,
    abi: MyAbi,
    functionName: "frontend_get_total_points",
    args: [],
    watch: true,
  });
  const totalpoints = totalpoints_loading ? "Loading..." : Number(totalpoints_data);


  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <div className="flex flex-col dark:text-white text-black">
      <Header />
      <div className="flex items-center flex-col p-4 pt-20 mt-80">
        <h1 className="text-6xl font-bold">Points</h1>
        <form className="flex flex-col mt-12" onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <div className="flex flex-col gap-y-3">
                <div className="flex items-center gap-x-2">
                  <h4 className="text-base font-medium">Your points: {points}</h4>
                </div>
                <div className="flex items-center gap-x-2">
                  <h4 className="text-base font-medium">Total number of points: {totalpoints}</h4>
                </div>
                <div className="flex items-center gap-x-2">
                </div>
                <div className="flex items-center gap-x-2">
                  <h4 className="text-base font-medium">Current point incentives: deposit $$$, withdraw do reset points</h4>
                </div>
                <div className="flex items-center gap-x-2">
                </div>
                <div className="flex items-center gap-x-2">
                  <h4 className="text-base font-medium">Points roadmap: todo</h4>
                </div>
                <div className="flex items-center gap-x-2">
                  <h4 className="text-base font-medium md:w-[700px]">
                    Yes the airdrop is linear. Probably the same repartition as ekubo.
                    Why linear?
                    The smart contract code actually often loop through all the users, so the less users the cheaper it is for everyone.
                    If you sybil I will manually upgrade the contract to ban you.
                  </h4>
                </div>
            </div>
          </div>
        </form>
        <div className="text-center">
          <button><a href="/app">Open the app</a></button>
        </div>
      <Bottom />
      </div>
    </div>
  );
}

export default App;
