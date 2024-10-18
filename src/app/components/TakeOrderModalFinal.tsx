"use client";
import GenericModal from "./GenericModal";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Call } from "starknet";
import spinner from "../../../public/assets/spinner.svg";
import rightArr from "../../../public/assets/right-arr.svg";
import toast from "react-hot-toast";
import Erc20Abi from "../abi/token.abi.json";
import MyAbi from "../abi/mycontract.abi.json";
import { USDC_ADDRESS, USDT_ADDRESS, DAI_ADDRESS, DAIV0_ADDRESS, NIMBORA_npaUSDT_ADDRESS, NIMBORA_nsDAI_ADDRESS, NIMBORA_npfUSDC_ADDRESS, NIMBORA_nstUSD_ADDRESS, SECONDS_PER_YEAR, PLATFORM_FEE_APY, CONTRACT_ADDRESS } from '@/app/utils/constant';
import { SCALE_APY } from '@/app/utils/constant';
import { formatTime } from '@/app/utils/date';
import { useContractRead } from "@starknet-react/core";
import { getAllLend, getAllCollateral, getAllBalance, normalizeAmountLend, normalizeAmountBorrow, prettyNameFromAddress, getDecimalsOfAsset } from "@/app/utils/erc20";
import { DisplayToken } from "./DisplayToken";
import ChooseAsset from "./ChooseAsset";
import SafetyBox from "./SafeParameters";
import { formatCurrency, formatYield } from "../utils/format";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  account: any;
  offer: any;
  isLend: boolean;
};

function TakeOrderModalFinal({ isOpen, onClose, account, offer, isLend }: Props) {

    const [minimalDuration, setMinimalDuration] = useState<number>(1);
    const [choosenDuration, setchoosenDuration] = useState<number>(100);
    
    const [inputAmount, setinputAmount] = useState<string>("");
    
    const [acceptDisclaimer, setAcceptDisclaimer] = useState<boolean>(false);
    
    const [choosenAsset, setChoosenAsset] = useState("");
    const choosenDecimals = choosenAsset === "" ? 0 : getDecimalsOfAsset(prettyNameFromAddress(choosenAsset));
    
    const [animate, setAnimate] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
  
    const contractAddress = CONTRACT_ADDRESS;


    console.log("token", choosenAsset);
    const { data: price_of_asset_data, isLoading: price_of_asset_loading } = useContractRead({
      address: contractAddress,
      abi: MyAbi,
      functionName: "get_price",
      args: [choosenAsset],
      watch: true,
    });
    const price_of_asset = price_of_asset_loading ? "Loading" : price_of_asset_data;

    const { data: ltv_of_asset_data, isLoading: ltv_of_asset_loading } = useContractRead({
      address: contractAddress,
      abi: MyAbi,
      functionName: "get_ltv",
      args: [choosenAsset],
      watch: true,
    });
    const ltv_of_asset = ltv_of_asset_loading ? "Loading" : ltv_of_asset_data;
    console.log("LTV", ltv_of_asset);
  

  const closeModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnimate(false);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  useEffect(() => {
    if (isOpen) {
      setAnimate(true);
    } else {
      setAnimate(false);
    }
  }, [isOpen]);


  async function handleExecute() {
    let success = false;
    try {
      setLoading(true);

      let functionName = "";
      let lendingId = 1;
      let borrowingId = 2;
      if (isLend) {
        functionName = "make_borrowing_offer_allowance";
      } else {
        functionName = "make_lending_offer";
      }

      let calldata: Array<any>[] = [];
      // Token & amount
      calldata = calldata.concat([choosenAsset]);
      if (!isLend) {
        calldata = calldata.concat([Number(inputAmount) * (10**Number(choosenDecimals)), 0]);
      } else {
        calldata = calldata.concat([inputAmountAfterInterestAfterLtv_arg, 0]);
      }
      // Accepted collaterals
      if (!isLend) {
        calldata = calldata.concat([0, 0]);
      }
      // Price
      console.log("yield", Number(offer.price.rate) + PLATFORM_FEE_APY, PLATFORM_FEE_APY, Number(offer.price.rate));
      calldata = calldata.concat([
        isLend ? Number(offer.price.rate) + PLATFORM_FEE_APY : Number(offer.price.rate) - PLATFORM_FEE_APY, 0, //u256
        Math.round(minimalDuration * 3600),
        Math.round(choosenDuration * 3600),
      ]);
      // Token collateral & amount
      // Mouais pas trop compris pourquoi yavait ça !!!! todo pq ya ces deux parametres la
      if (isLend) {
        calldata = calldata.concat([
          choosenAsset,
          inputAmountAfterInterestAfterLtv_arg, 0 // u256
        ]);
      }
      console.log("calldata", calldata);


      let call = [
        {
          contractAddress: choosenAsset,
          calldata: [contractAddress, inputAmountAfterInterestAfterLtv_arg, 0].map((value) => String(value)),
          entrypoint: "approve"
        },
        {
          contractAddress: contractAddress,
          calldata: calldata,
          entrypoint: functionName
        },
        {
          contractAddress: contractAddress,
          calldata: [
            lendingId,
            borrowingId,
            String(Number(inputAmount) * (10**Number(choosenDecimals))), 0 // u256
          ].map((value) => String(value)),
          entrypoint: "match_offer"
        },
      ];
      console.log("call", call);

      // Sert à rien?
      const maxFee = BigInt("0");
      //const { suggestedMaxFee: maxFee } = await account.estimateInvokeFee(call);
      console.log("maxFee", maxFee);

      const { transaction_hash: transferTxHash } = await account.execute(call, { maxFee });
      console.log("hash", transferTxHash);

      const transactionReponse = await account.waitForTransaction(
        transferTxHash
      );
      console.log("response", transactionReponse);

      toast.success("Your order was placed", {
        duration: 2000,
      });
      success = true;
    } catch (err: any) {
      toast.error("An error occurred! Please try again.", { duration: 2000 });
      console.log(err.message);
    } finally {
      setLoading(false);
      if (success)
        setTimeout(() => {
          onClose();
        }, 400);
    }
  }

  const inputAmountAfterInterest = String(Math.round(
    (Number(inputAmount) +
    (Number(inputAmount) *
      (Number(offer.price.rate)/100 + PLATFORM_FEE_APY) *
      (choosenDuration * 3600)
      /
      (SCALE_APY *
      SECONDS_PER_YEAR)))
    *100)/100);

    // Todo voir pour les decimals
    const inputAmountAfterInterestAfterLtv = String(Number(price_of_asset) * Number(inputAmountAfterInterest) * 100 / Number(ltv_of_asset));
    let inputAmountAfterInterestAfterLtv_arg = choosenAsset === "" ? -1 : Number(1+Math.round(Number(inputAmountAfterInterestAfterLtv) / 10**18 * 10**(getDecimalsOfAsset(prettyNameFromAddress(choosenAsset)) as any)));

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={closeModal}
      animate={animate}
      className="w-[90vw] mx-auto md:h-fit md:w-[45rem] text-white py-4 px-5 relative bg-black max-h-[90vh]"
    >
      <div className="absolute right-5 top-4">
        <button
          onClick={(e) => {
            closeModal(e);
            e.stopPropagation();
            }}
            className="w-8 h-8 grid place-content-center rounded-full bg-outline-grey"
          >
            <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            >
            <path
              fill="currentColor"
              d="m6.4 18.308l-.708-.708l5.6-5.6l-5.6-5.6l.708-.708l5.6 5.6l5.6-5.6l.708.708l-5.6 5.6z"
            />
            </svg>
          </button>
        </div>
        <h1 className="text-[24px] mb-2 font-semibold">Summary of your order:</h1>
        <div className="scroll">
        <div className="flex flex-col gap-y-5">
        {isLend && (
        <div className="grid grid-cols-2 gap-x-5">
          <div className="flex flex-col justify-center">
            <h2>Asset you borrow</h2>
          </div>
          <div className="flex flex-col justify-center">
            <h2><DisplayToken address={offer.token}/></h2>
          </div>
        </div>
        )}
        <div className="grid grid-cols-2 gap-x-5">
          <div className="flex flex-col justify-center">
          <h2>Max you can {isLend ? "borrow" : "lend"} with this offer</h2>
          </div>
          <div className="flex flex-col justify-center">
          <h2>{Number(offer.amount_available) / 10**18} {isLend ? <DisplayToken address={offer.token}/> : "$"}</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-5">
          <div className="flex flex-col justify-center">
          <h2>Amount you want to {isLend ? "borrow" : "lend"} in {isLend ? <DisplayToken address={offer.token}/> : "$"}</h2>
          </div>
          <div className="flex flex-col justify-center">
          <input
            type="text"
            className="w-full rounded text-base outline-none border-[2px]"
            value={inputAmount}
            onChange={(e) => setinputAmount(String(Math.max(0, Math.min(Number(offer.amount_available) / 10**18, Number(e.target.value)))))}
          />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-5">
          <div className="flex flex-col justify-center">
          <h2>Minimal / Maximal duration of the loan:</h2>
          </div>
          <div className="flex flex-col justify-center">
          <h2>{isOpen && formatTime(Number(offer.price.minimal_duration) / 3600)} / {isOpen && formatTime(Number(offer.price.maximal_duration) / 3600)}</h2>
          </div>
        </div>
        
        {isLend && (
        <div className="grid grid-cols-2 gap-x-5">
          <div className="flex flex-col justify-center">
          <h2><u>Choosen</u> maximal duration:<br/>{formatTime(choosenDuration)}</h2>
          </div>
          <div className="flex flex-col justify-center">
          <input
            type="range"
            className="w-full"
            min={(isOpen && (Math.log2(1 + 24 + Number(offer.price.minimal_duration) / 3600) * 100)) as any}
            max={(isOpen && (Math.log2(Number(offer.price.maximal_duration) / 3600) * 100)) as any}
            step="1"
            value={Math.log2(choosenDuration) * 100}
            onChange={(e) => setchoosenDuration(Math.pow(2, Number(e.target.value) / 100))}
          />
          </div>
        </div>
        )}

        {isLend && (
        <>
        <div className="grid grid-cols-2 gap-x-5">
          <div className="flex flex-col justify-center">
            <h2>Required collateral amount
                {/* <br/>(Max you may ever repay) */}
            </h2>
          </div>
          <div className="flex flex-col justify-center">
            <h2>
              {isOpen && inputAmountAfterInterest} <DisplayToken address={offer.token}/></h2>
          </div>
        </div>
        <hr className="border-[1px] border-white" />
        </>
        )}
                
        
        {isLend && (
        <>
        <div className="grid grid-cols-2 gap-x-5">
          <div className="flex flex-col justify-center">
          <h2>
            Offer yield:<br/>
            Platform fee:<br/>
            Yield you pay:
          </h2>
          </div>
          <div className="flex flex-col justify-center">
          <h2>
            {isOpen && formatYield(Number(offer.price.rate))}% APR<br/>
            {100 * formatYield(PLATFORM_FEE_APY)}% APR<br/>
            {isOpen && 100 * formatYield(PLATFORM_FEE_APY) + formatYield(Number(offer.price.rate))}% APR
          </h2>
          </div>
        </div>
        <hr className="border-[1px] border-white" />
        </>
        )}

        <ChooseAsset
          type={isLend ? "borrow" : "lend"}
          baseAsset={isOpen && ((isLend ? prettyNameFromAddress(offer.token.toString(16)) : prettyNameFromAddress(offer.token_collateral.toString(16))) as any)}
          address={(account.address as any)}
          above_choosenAsset={choosenAsset}
          set_above_choosenAsset={setChoosenAsset}
        />

        {isLend && (
        <>
        <div className="grid grid-cols-2 gap-x-5">
          <div className="flex flex-col justify-center">
            <h2>LTV of choosen collateral</h2>
          </div>
          <div className="flex flex-col justify-center">
            <h2>{Number(ltv_of_asset)}%</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-5">
          <div className="flex flex-col justify-center">
            <h2>Total amount of collateral required</h2>
          </div>
          <div className="flex flex-col justify-center">
            <h2>{formatCurrency(inputAmountAfterInterestAfterLtv as any)} <DisplayToken address={choosenAsset}/></h2>
          </div>
        </div>
        </>
        )}


      </div>
        <hr className="border-[1px] border-white my-5" />
        <SafetyBox
          valueamount={Number(inputAmount)}
          valueyield={formatYield(offer.price.rate)}
          minimal_duration={minimalDuration}
          maximal_duration={choosenDuration}
          type={isLend ? "borrow" : "lend"}
          takeormake={true}
          isvalid={acceptDisclaimer}
          set_isvalid={setAcceptDisclaimer}
        />
        <hr className="border-[1px] border-white my-5" />



        </div>
          <button
            className="w-full mt-7 py-3 rounded font-medium flex items-center gap-x-2 justify-center disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={
              isNaN(Number(inputAmount)) || Number(inputAmount) <= 0
              || choosenAsset === ""
              || !acceptDisclaimer
            }
            onClick={async (e) => {
            e.preventDefault();
            await handleExecute();
          }}
          >
          Take this {isLend ? "lend" : "borrow"} offer
          <Image
            src={loading ? spinner : rightArr}
            alt={loading ? "loading" : "right arrow"}
            height={16}
            width={16}
          />
        </button>

    </GenericModal>
  );
}

export default TakeOrderModalFinal;
