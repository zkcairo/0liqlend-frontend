"use client";
import cloudUploadIcon from "../../../../public/assets/cloudUploadIcon.svg";
import fileIcon from "../../../../public/assets/fileIcon.svg";
import trash from "../../../../public/assets/deleteIcon.svg";
import { useRef, useState } from "react";
import HeaderNoConnect from "../HeaderNoConnect";
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

  return (
    <div className="flex flex-col dark:text-white text-black">
      <HeaderNoConnect />
      <div className="flex items-center flex-col p-4 pt-20 mt-[800px] md:mt-60">
        <h1 className="text-6xl font-bold">How it works</h1>
        <form className="flex flex-col mt-12">
          <div className="mb-4">
            <div className="flex flex-col gap-y-3">
                <div className="flex items-center gap-x-2">
                  <h4 className="text-base font-medium md:w-[700px]">
                    Lending app lets you borrow assets if you have deposited some in exchange.
                    As long as what you have deposited is worth more than your debt everything works fine.
                    Otherwise problems appear.
                  </h4>
                </div>
                <div className="flex items-center gap-x-2">
                  <h4 className="text-base font-medium md:w-[700px]">
                    To prevent these problems, lending app usually have a liquidation mechanism.
                    If what you deposited is too close in worth than what you borrowed, the protocol will liquidate your position.<br></br>
                    How? By taking what you deposited, and clear your debt.
                    You lose some money in the process, the <u>liquidation penalty</u>, but hopefully the protocol do not.
                    (Sometimes it does, it's called a <u>bad debt</u>).
                    Ultimately it's your responsibility to make sure you do not get liquidated.
                  </h4>
                </div>
                <div className="flex items-center gap-x-2">
                  <h4 className="text-base font-medium md:w-[700px]">
                    The problem: protocol do not actually liquidate your positions themselves.
                    Instead they rely on liquidators that monitor positions, and liquidate them if needed in exchange for a fee.
                    I do believe that when gas price is low, protocol can themselves monitor and liquidate positions, for free.
                    This is what 0LiqLend do.
                  </h4>
                </div>
                <div className="flex items-center gap-x-2">
                  <h4 className="text-base font-medium md:w-[700px]">
                    Dear borrowers, please borrow on 0LiqLend asap,
                    let your position get liquidated by the protocol at no cost,
                    and stop monitoring your positions.
                  </h4>
                </div>
            </div>
          </div>
        </form>
        <div className="text-center mt-10">
          <button><a href="/app">Open the app</a></button>
        </div>
      <Bottom />
      </div>
    </div>
  );
}

export default App;
