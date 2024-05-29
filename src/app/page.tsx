import Image from "next/image";
import Header from "./components/Header";
import Bottom from "./components/Bottom";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-24 md:p-24">
      <Header />
        <h1 className="text-6xl font-bold">Welcome to 0LiqLend:</h1>
        <center><p className="text-2xl">
          A lending app on Starknet where every interaction with the platform automatically
          liquidate every eligible position to limit bad debts/liq penalties.
        </p></center>
      <div className="border border-gray-300 rounded-lg p-8">
        <ul className="text-xl">
          <h4 className="text-4xl font-bold mb-8">Platform Statistics</h4>
          <li>Total number of users: todo (rn probably 0)</li>
          <li>TLV: todo</li>
        </ul>
      </div>
        <div className="text-center">
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
