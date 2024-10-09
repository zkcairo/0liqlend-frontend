import {
    USDC_ADDRESS,
    USDT_ADDRESS,
    DAI_ADDRESS,
    DAIV0_ADDRESS,
    NIMBORA_npaUSDT_ADDRESS,
    NIMBORA_nsDAI_ADDRESS,
    NIMBORA_npfUSDC_ADDRESS,
    NIMBORA_nstUSD_ADDRESS,
} from "@/app/utils/constant";

type Props = {
    offer: any;
    me: boolean;
};

const DisplayCollateral = ({ offer, me }: Props) => {
    let tokenName = "";
    
    if (true) {
        const hexaddress = BigInt(offer.token_collateral);

        if (hexaddress === BigInt(USDC_ADDRESS)) {
            tokenName = "USDC";
        } else if (hexaddress === BigInt(USDT_ADDRESS)) {
            tokenName = "USDT";
        } else if (hexaddress === BigInt(DAI_ADDRESS)) {
            tokenName = "DAI";
        } else if (hexaddress === BigInt(DAIV0_ADDRESS)) {
            tokenName = "DAIV0";
        } else if (hexaddress === BigInt(NIMBORA_npaUSDT_ADDRESS)) {
            tokenName = "NIMBORA_npaUSDT";
        } else if (hexaddress === BigInt(NIMBORA_nsDAI_ADDRESS)) {
            tokenName = "NIMBORA_nsDAI";
        } else if (hexaddress === BigInt(NIMBORA_npfUSDC_ADDRESS)) {
            tokenName = "NIMBORA_npfUSDC";
        } else if (hexaddress === BigInt(NIMBORA_nstUSD_ADDRESS)) {
            tokenName = "NIMBORA_nstUSD";
        }
        if (offer.is_allowance && me) {
            tokenName += " (from your wallet)";
        }
    }
    if (!offer.is_allowance && me) {
        tokenName = "Collateral id " + offer.collateral_id + " (" + tokenName + ")";
    }

    if (tokenName !== "") {
        return <>{tokenName}</>;
    }
}

export { DisplayCollateral };