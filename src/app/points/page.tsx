"use client";
import cloudUploadIcon from "../../../../public/assets/cloudUploadIcon.svg";
import fileIcon from "../../../../public/assets/fileIcon.svg";
import trash from "../../../../public/assets/deleteIcon.svg";
import { useRef, useState } from "react";
import Header from "../components/Header";
import { DeclareContractPayload, hash, CallData, UniversalDeployerContractPayload, CompiledSierraCasm } from "starknet";
import { useAccount } from "@starknet-react/core";
import MyContractExecutionModal from "../components/MyContractExecutionModal";
import { createPortal } from "react-dom";
import { isSetIterator } from "util/types";
import { MdToken } from "react-icons/md";
import Image from "next/image";
import { Call } from "starknet";
import spinner from "../../../public/assets/spinner.svg";
import rightArr from "../../../public/assets/right-arr.svg";
import toast from "react-hot-toast";
import MyAbi from "../abi/mycontract.abi.json";
import { CONTRACT_ADDRESS, ETH_SEPOLIA, STRK_SEPOLIA } from "@/app/utils/constant";
import { useContractRead } from "@starknet-react/core";
import Bottom from "../components/Bottom";
import HeaderNoConnect from "../components/HeaderNoConnect";

interface FileList {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

export default function Page() {

  const { account, status, isConnected } = useAccount();

  const contractAddress = CONTRACT_ADDRESS;
  const userAddress = String(account?.address);

  const { data: points_data, isLoading: points_loading } = useContractRead({
    address: contractAddress,
    abi: MyAbi,
    functionName: "frontend_get_user_points",
    args: [userAddress],
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
    <div className="container mx-auto py-10">
    <div className="flex flex-col dark:text-white text-black">
      <Header />
      <div className="flex items-center flex-col p-4 pt-20 mt-10">
        <h1 className="text-6xl font-bold">Points</h1>
        <form className="flex flex-col mt-12" onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <div className="flex flex-col gap-y-3">
                <div className="flex items-center gap-x-2">
                  <h4 className="text-base font-medium">Your points: {Number(Number(points) / 10**16).toFixed(0)}</h4>
                </div>
                <div className="flex items-center gap-x-2">
                  <h4 className="text-base font-medium">Total number of points: {Number(Number(totalpoints) / 10**16).toFixed(0)}</h4>
                </div>
                <div className="flex items-center gap-x-2">
                </div>
                <div className="flex items-center gap-x-2">
                  <h4 className="text-base font-medium">How to earn points: make loans as a lender or borrower.</h4>
                </div>
                <div className="flex items-center gap-x-2">
                </div>
                <div className="flex items-center gap-x-2">
                  <h4 className="text-base font-medium">Points roadmap: todo</h4>
                </div>
                <div className="flex items-center gap-x-2">
                  <h4 className="text-base font-medium">
                    <a href="https://github.com/zkcairo/0liqlend-contract/blob/main/readme.md" target="_blank"><u>Disclaimer about the point programs</u></a>.
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
    </div>
  );
}