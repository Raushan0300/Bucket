import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import { ArrowDown, ArrowLeftRight, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

interface BalanceProps{
  ethAddress: string;
  solAddress: string;
  network: string;
};

const Balance = (props:BalanceProps) => {
  const { ethAddress, solAddress, network } = props;

  const [balance, setBalance] = useState<string>("0.0000");
  const [priceInUSD, setPriceInUSD] = useState<string>("0.00");

  const getEthBalance = async()=>{
    const res = await fetch(`https://eth-${network === "mainnet" ? "mainnet" : `${network === "sepolia" ? "sepolia" : `${network === "holesky" && "holesky"}`}`}.g.alchemy.com/v2/mjU7bK--GtgvMr4n6AA4cx3OrONGOCO8`, {method: 'POST', body: JSON.stringify({jsonrpc: "2.0", method: "eth_getBalance", params: [ethAddress, "latest"], id: 1})});
    const data = await res.json();
    const weiBal = parseInt(data.result, 16);
    const eth = weiBal / 10**18;
    setBalance(eth.toFixed(4).toString());
  };

  const getSolBalance = async()=>{
    const res = await fetch(`https://solana-${network === "solana" ? "mainnet" : `${network === "solana-dev" && "devnet"}`}.g.alchemy.com/v2/mjU7bK--GtgvMr4n6AA4cx3OrONGOCO8`, {method: 'POST', body: JSON.stringify({jsonrpc: "2.0", id: 1, method: "getBalance", params: [solAddress]})});
    const data = await res.json();
    const lamports = data.result.value;
    const sol = lamports / 10**9;
    setBalance(sol.toFixed(4).toString());
  };

  const getPriceInUSD = async()=>{
    const res = await fetch(`https://api.coinconvert.net/convert/${network.startsWith("solana") ? "sol" : "eth"}/usd?amount=${balance}`);
    const data = await res.json();
    setPriceInUSD(data.USD);
  }

  useEffect(()=>{
    if(ethAddress && solAddress && network){
      if(network === "solana" || network === "solana-dev"){
        getSolBalance();
      } else {
        getEthBalance();
      }
    }
  },[ethAddress, network, solAddress]);

  useEffect(()=>{
    getPriceInUSD();
  }, [balance]);
  
  return (
    <div className="flex flex-col items-center justify-center">
        <div className="flex items-end gap-2">
            <h2 className="text-4xl font-bold">{balance}</h2>
            <h4 className="text-lg">{network.startsWith("solana") ? "SOL" : "ETH"}</h4>
        </div>
        <div className="text-gray-500">≈ ${priceInUSD ?? 0}</div>
        <div className="flex justify-center gap-5 items-center mt-5">
            <div className="flex flex-col gap-2 items-center">
            <Button variant="default" className="rounded-full h-10 w-10"><ArrowUp /></Button>
            <Label>Send</Label>
            </div>
            <div className="flex flex-col gap-2 items-center">
            <Button variant="default" className="rounded-full h-10 w-10"><ArrowDown /></Button>
            <Label>Receive</Label>
            </div>
            <div className="flex flex-col gap-2 items-center">
            <Button variant="default" className="rounded-full h-10 w-10"><ArrowLeftRight /></Button>
            <Label>Swap</Label>
            </div>
        </div>
    </div>
  )
}

export default Balance;