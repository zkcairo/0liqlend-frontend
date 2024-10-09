import Erc20Abi from "../abi/token.abi.json";
import { useContractRead } from "@starknet-react/core";
import { USDC_ADDRESS, USDT_ADDRESS, DAI_ADDRESS, DAIV0_ADDRESS, NIMBORA_npaUSDT_ADDRESS, NIMBORA_nsDAI_ADDRESS, NIMBORA_npfUSDC_ADDRESS, NIMBORA_nstUSD_ADDRESS } from './constant';
import { USDC_DECIMALS, USDT_DECIMALS, DAI_DECIMALS, DAIV0_DECIMALS, NIMBORA_npaUSDT_DECIMALS, NIMBORA_nsDAI_DECIMALS, NIMBORA_npfUSDC_DECIMALS, NIMBORA_nstUSD_DECIMALS } from './constant';


const balance_to_amount = (_v: any) => {
    if (_v === undefined) {
        return 0;
    }
    let v = _v.balance;
    const low = Number(v.low);
    const high = Number(v.high);
    console.log(_v);
    return low + high * 2 ** 128;
}

export const getAllLend = (address: string) => {
    if (address === "USDC") {
        return [
            [USDC_ADDRESS, USDC_DECIMALS],
            [USDT_ADDRESS, USDT_DECIMALS],
            [DAI_ADDRESS, DAI_DECIMALS],
            [DAIV0_ADDRESS, DAIV0_DECIMALS],
        ];
    }
    if (address === "") { return []; }
    //throw new Error("No lend found for this address");
    return [];
}

export const getAllCollateral = (address: string) => {
    if (address === "USDC") {
        return [
            [NIMBORA_npaUSDT_ADDRESS, NIMBORA_npaUSDT_DECIMALS],
            [NIMBORA_nsDAI_ADDRESS, NIMBORA_nsDAI_DECIMALS],
            [NIMBORA_npfUSDC_ADDRESS, NIMBORA_npfUSDC_DECIMALS],
            [NIMBORA_nstUSD_ADDRESS, NIMBORA_nstUSD_DECIMALS],
        ];
    }
    if (address === "") { return []; }
    //throw new Error("No collaterals found for this address");
    return [];
}

export function getAllBalance(arrayAddress: string[], account: string) {
    let balance: number[] = [];
    for (const address of arrayAddress) {
        balance.push(balance_to_amount(getBalance(address, account)));
    }
    return balance;
}

export function getBalance(erc20_address: string, user_address: string) {
    const { data: value, isLoading: ethLoading } = useContractRead({
        address: erc20_address,
        abi: Erc20Abi,
        functionName: "balance_of",
        args: [user_address],
        watch: true,
    });
    return value;
}

export function prettyNameFromAddress(address_: string) {
    //check address length
    let address = address_;
    if (address_.length !== 2+64 || address_.slice(0, 2) !== "0x") {
        // Add 0 to it to make it legnth 64
        address = "0x" + "0".repeat(64 - address_.length) + address_;
    }
    address = address.toLowerCase();

    switch (address) {
        case USDC_ADDRESS:
            return "USDC";
        case USDT_ADDRESS:
            return "USDT";
        case DAI_ADDRESS:
            return "DAI";
        case DAIV0_ADDRESS:
            return "DAIv0";
        case NIMBORA_npaUSDT_ADDRESS:
            return "NIMBORA_npaUSDT";
        case NIMBORA_nsDAI_ADDRESS:
            return "NIMBORA_nsDAI";
        case NIMBORA_npfUSDC_ADDRESS:
            return "NIMBORA_npfUSDC";
        case NIMBORA_nstUSD_ADDRESS:
            return "NIMBORA_nstUSD";
        default:
            return address;
    }
}

export function normalizeAmountLend(value: any, decimals: any) {
    return (10 ** 18 * value) / (10 ** decimals);
}
// Todo, read TLV
export function normalizeAmountBorrow(value: any, decimals: any) {
    return (10 ** 18 * value) / (10 ** decimals);
}

export const getDecimalsOfAsset = (asset: string) => {
    switch (asset) {
        case "USDC":
        return USDC_DECIMALS;
        case "USDT":
        return USDT_DECIMALS;
        case "DAI":
        return DAI_DECIMALS;
        case "DAIv0":
        return DAIV0_DECIMALS;
        case "NIMBORA_npaUSDT":
        return NIMBORA_npaUSDT_DECIMALS;
        case "NIMBORA_nsDAI":
        return NIMBORA_nsDAI_DECIMALS;
        case "NIMBORA_npfUSDC":
        return NIMBORA_npfUSDC_DECIMALS;
        case "NIMBORA_nstUSD":
        return NIMBORA_nstUSD_DECIMALS;
        default:
        -1;//    throw new Error(`Unknown asset: ${asset}`);
  }
}