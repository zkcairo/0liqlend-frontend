"use client";

import Image from "next/image";
import Header from "./components/Header";
import Bottom from "./components/Bottom";
import MyAbi from "./abi/mycontract.abi.json";
import { useContractRead } from "@starknet-react/core";



export default function Home() {
  const contractAddress = "0x0347def0979f4e07685a5021c8918bdd8a53e5e3425c84605ac32aef592f8060";

  const { data: users_data, isLoading: users_loading } = useContractRead({
    address: contractAddress,
    abi: MyAbi,
    functionName: "frontend_get_number_of_users",
    args: [],
    watch: true,
  });
  const users = users_loading ? "Loading..." : Number(users_data);

  const { data: tlv_data, isLoading: tlv_loading } = useContractRead({
    address: contractAddress,
    abi: MyAbi,
    functionName: "frontend_get_TLV",
    args: [],
    watch: true,
  });
  const tlv = tlv_loading ? "Loading..." : Number(Number(tlv_data) / 10**26).toFixed(0);
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-24 md:p-24">
      <Header />
        <h1 className="text-6xl font-bold mt-20">0LiqLend</h1>
        <center className="mt-5"><p className="text-2xl">
          A lending app on Starknet where every interaction with the platform automatically
          liquidate every eligible position to limit bad debts/liq penalties.
        </p></center>
      <div className="border border-gray-300 rounded-lg p-8 mt-5">
        <ul className="text-xl">
          <h4 className="text-4xl font-bold mb-8">Platform Statistics</h4>
          <li>Number of users: {users}</li>
          <li>TLV: {tlv}$</li>
        </ul>
      </div>
        <div className="text-center mt-5">
          <button><a href="/app">Open the app</a></button>
        </div>
        <div className="mb-50 text-center">
          <button><a href="/points">Points program</a></button>
          <button><a href="http://twitter.com/zkcairo" target="_blank">Follow me on twitter</a></button>
        </div>
        <Bottom />
    </main>
  );
}
