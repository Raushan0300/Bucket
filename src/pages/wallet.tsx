import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  ChevronDown,
  Copy,
  CopyCheckIcon,
  EllipsisVertical,
  LockIcon,
  LucidePaintBucket,
  LucideScanEye,
  PlusIcon,
  Settings2Icon,
  Trash2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import Balance from "@/components/wallet-balance";
import TokenList from "@/components/tokens-list";
import { decryptMnemonic } from "@/utils/mnemonic";
import { createEthWallet, createSolWallet } from "@/utils/newWallet";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Password from "@/components/password-ui";
import Home from "./home";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Wallet() {
  const [password, setPassword] = useState<string>("");
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  const [accounts, setAccounts] = useState<number>(0);
  const [selectedAccount, setSelectedAccount] = useState<number>(1);

  const [passErr, setPassErr] = useState<boolean>(false);

  const [ethAddress, setEthAddress] = useState<string>("");
  const [solAddress, setSolAddress] = useState<string>("");

  const [wallets, setWallets] = useState<any>([]);
  const [selectedWallet, setSelectedWallet] = useState<number>(0);
  const [selectedNetwork, setSelectedNetwork] = useState<string>("mainnet");

  const [walletPopover, setWalletPopover] = useState<boolean>(false);

  const [ethCopy, setEthCopy] = useState<boolean>(false);
  const [solCopy, setSolCopy] = useState<boolean>(false);

  const [isAdd, setisAdd] = useState<boolean>(false);

  useEffect(()=>{
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("acc")) {
        count++;
      }
    }
    setAccounts(count);
  },[]);

  useEffect(()=>{
    setEthAddress(wallets[selectedWallet]?.eth);
    setSolAddress(wallets[selectedWallet]?.sol);
  },[wallets, selectedWallet]);

  // useEffect(()=>{
  //   const syntheticEvent = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
  //   setWallets([]);
  //   setSelectedWallet(0);
  //   handleUnlockWallet(syntheticEvent);
  // },[selectedAccount]);

  const handleCopy = (text: string, token: string) => {
    navigator.clipboard.writeText(text);
    if(token === "eth"){
      setEthCopy(true);
      setTimeout(() => {
        setEthCopy(false);
      }, 2000);
    } else{
      setSolCopy(true);
      setTimeout(() => {
        setSolCopy(false);
      }, 2000);
    }
  }
  
  const handleUnlockWallet = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // for(let i = 0; i < localStorage.length; i++){
    //   if(localStorage.key(i)?.startsWith("acc")){
    //     setSelectedAccount(i+1);
    //     break;
    //   }
    // }

    let acc: string | null = localStorage.getItem(`acc${selectedAccount}`);
    if(acc){
      const data = JSON.parse(acc);
      const mn = data.mnemonic;
      if (mn) {
        const dec = decryptMnemonic(mn, password);
        if (dec) {
          const newWallets = [];
          for(let i = 0; i <= data.index; i++){
            const ethWallet = await createEthWallet(dec, i);

            const solWallet = await createSolWallet(dec, i);

            newWallets.push({eth: ethWallet.address, sol: solWallet.publicKey.toBase58()});
          }
          setWallets([...wallets, ...newWallets]);
          setIsUnlocked(true);
        } else {
          setPassErr(true);
          return;
        }
      }
    }
  };

  const handleSelectWallet = (index: number)=>{
    setSelectedWallet(index);
  };

  const handleAddWallet = async() => {
    const data = localStorage.getItem(`acc${selectedAccount}`);
        if (data) {
          const mnemonic = JSON.parse(data).mnemonic;
          const dec = decryptMnemonic(mnemonic, password);
          if(dec){
            const ethWallet = await createEthWallet(dec, wallets.length);
            const solWallet = await createSolWallet(dec, wallets.length);
            localStorage.setItem(`acc${selectedAccount}`, JSON.stringify({ mnemonic: mnemonic, index: wallets.length }));
            setWallets([...wallets, {eth: ethWallet.address, sol: solWallet.publicKey.toBase58()}]);
          }
        }
  };

  const handleRemoveWallet = (index: number) => {
    const data = localStorage.getItem(`acc${selectedAccount}`);
    if(data){
      const mnemonic = JSON.parse(data).mnemonic;
      const newWallets = wallets.filter((_:any, i:any) => i !== index);
    localStorage.setItem(`acc${selectedAccount}`, JSON.stringify({ mnemonic: mnemonic, index: newWallets.length-1 }));
    setWallets(newWallets);
    }
  };

  // const handleRemoveAccount = () => {
  //   localStorage.removeItem(`acc${selectedAccount}`);
  //   setAccounts(accounts-1);
  //   setSelectedAccount(1);
  //   setWallets([]);
  //   setIsUnlocked(false);
  // }

  const handleRemoveAccount = () => {
    // Remove the selected account from local storage
    localStorage.removeItem(`acc${selectedAccount}`);
  
    // Create a new array to store the remaining accounts
    const remainingAccounts = [];
  
    // Iterate through the local storage to collect remaining accounts
    for (let i = 1; i <= accounts; i++) {
      if (i !== selectedAccount) {
        const acc = localStorage.getItem(`acc${i}`);
        if (acc) {
          remainingAccounts.push(acc);
        }
      }
    }
  
    // Clear all accounts from local storage
    for (let i = 1; i <= accounts; i++) {
      localStorage.removeItem(`acc${i}`);
    }
  
    // Re-add the remaining accounts to local storage with updated keys
    remainingAccounts.forEach((acc, index) => {
      localStorage.setItem(`acc${index + 1}`, acc);
    });
  
    // Update the state
    setAccounts(remainingAccounts.length);
    setSelectedAccount(1);
    setWallets([]);
    setIsUnlocked(false);
  };

  const handleshowMnemonic = () => {
    console.log("show mnemonic");
    const data = localStorage.getItem(`acc${selectedAccount}`);
    if(data){
      const mn = JSON.parse(data).mnemonic;
      if(mn){
        const mnemonic = decryptMnemonic(mn, password);
        // alert(mnemonic);
        return mnemonic;
      }
    }
  };

  return isUnlocked ? (
    <div className="container mx-auto p-4 flex justify-center">
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            <LucidePaintBucket />
            <span className="font-bold text-xl">Bucket</span>
            </div>
            <ModeToggle />
          </CardTitle>
          <CardDescription>Manage your crypto assets</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="mt-5 flex flex-col gap-10">
          <div className="flex justify-between items-center">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarFallback>
                    A{selectedAccount}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {/* <DropdownMenuLabel className="text-red-700 flex justify-between gap-2 items-center cursor-pointer" onClick={() => setIsUnlocked(false)}>Lock Wallet</DropdownMenuLabel> */}
                {Array.from({ length: accounts }, (_, i) => (
                  <div>
                  <DropdownMenuLabel key={i} className="cursor-pointer flex justify-between gap-2 items-center">
                    <span className="w-[90%" onClick={() => {
                    if(i+1 !== selectedAccount){
                      setSelectedAccount(i+1);
                      setWallets([]);
                      setPassword("");
                      setIsUnlocked(false);
                    }
                    }}>Account {i + 1}</span>
                    <DropdownMenu>
  <DropdownMenuTrigger><EllipsisVertical className="cursor-pointer" /></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel className="text-red-700 flex justify-between gap-2 items-center cursor-pointer" onClick={()=>{handleRemoveAccount()}}>Remove <Trash2 height={15} width={15} /></DropdownMenuLabel>
  </DropdownMenuContent>
</DropdownMenu>
                  </DropdownMenuLabel>
                  <Separator />
                  </div>
                ))}
                <DropdownMenuLabel className="cursor-pointer" onClick={() => {
                  setIsUnlocked(false);
                  setisAdd(true);
                }}><Button variant={"outline"}>Add Account</Button></DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
            <HoverCard>
            <Popover open={walletPopover} onOpenChange={(open) => setWalletPopover(open)}>
  <PopoverTrigger><HoverCardTrigger><div className="flex gap-2 items-center justify-center px-2 py-1 rounded-full border dark:border-white border-gray-900 cursor-pointer">Wallet {selectedWallet+1} <ChevronDown /></div></HoverCardTrigger>
  <HoverCardContent onClick={(e)=>{e.preventDefault()}}>
  <div className="flex gap-2 items-center justify-between">
          <span>ETH</span>
          <span className="flex gap-2 items-center font-extralight text-gray-500 text-xs">{`${wallets[selectedWallet]?.eth?.slice(0, 6)}...${wallets[selectedWallet]?.eth?.slice(-4)}`} <span onClick={() => handleCopy(wallets[selectedWallet]?.eth, "eth")}>
            {ethCopy ? <CopyCheckIcon height={14} width={14} /> : <Copy height={14} width={14} />}
          </span></span>
        </div>

        <div className="flex gap-2 items-center justify-between">
          <span>SOL</span>
          <span className="flex gap-2 items-center font-extralight text-gray-500 text-xs">{`${wallets[selectedWallet]?.sol?.slice(0, 6)}...${wallets[selectedWallet]?.sol?.slice(-4)}`} <span onClick={() => handleCopy(wallets[selectedWallet]?.sol, "sol")}>
            {solCopy ? <CopyCheckIcon height={14} width={14} /> : <Copy height={14} width={14} />}
          </span></span>
        </div>
  </HoverCardContent></PopoverTrigger>
  <PopoverContent>
    <div className="flex flex-col gap-2">
      {wallets.map((_:any, index:any) => (
        <div key={index} className={`flex flex-col gap-2 rounded justify-center`}>
          <div className="flex justify-between items-center gap-5">
          <span className="w-[90%] cursor-pointer" onClick={()=>{
            handleSelectWallet(index);
            setWalletPopover(false);
            }}>Wallet {index+1}</span>
          <DropdownMenu>
  <DropdownMenuTrigger><EllipsisVertical className="cursor-pointer" /></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel className="text-red-700 flex justify-between gap-2 items-center cursor-pointer" onClick={()=>{handleRemoveWallet(index)}}>Remove <Trash2 height={15} width={15} /></DropdownMenuLabel>
  </DropdownMenuContent>
</DropdownMenu>
          </div>
            {/* <span className="flex gap-2 items-center font-extralight text-gray-500 text-xs">{`${wallet.eth.slice(0, 6)}...${wallet.eth.slice(-4)}`}</span> */}
          <Separator />
        </div>
      ))}
      <Button className="w-full" variant="outline" onClick={()=>{handleAddWallet()}}><PlusIcon /> Add Wallet</Button>
    </div>
  </PopoverContent>
</Popover>

</HoverCard>
            <DropdownMenu>
  <DropdownMenuTrigger><Settings2Icon /></DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel className="text-red-700 flex justify-between gap-2 items-center cursor-pointer" onClick={()=>{
      setPassword("");
      setWallets([]);
      setIsUnlocked(false);
    }}>Lock Wallet<LockIcon height={15} width={15} /></DropdownMenuLabel>
    <Dialog>
  <DialogTrigger><DropdownMenuLabel className="flex justify-between gap-2 items-center cursor-pointer">Show Mnemonic<LucideScanEye height={15} width={15} /></DropdownMenuLabel></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Secret Recovery Phrase for Account {selectedAccount}</DialogTitle>
    </DialogHeader>
    <DialogDescription>
      <p>Write down your secret recovery phrase. Keep it safe. Anyone with this phrase can access your assets.</p>
      <p>Never disclose your secret recovery phrase.</p>
    </DialogDescription>
      <div className="flex flex-col gap-2">
        <p className="border border-gray-500 mb-5 rounded-lg px-4 py-2">{handleshowMnemonic()}</p>
        <Button className="w-full" onClick={()=>{
          const mnemonic = handleshowMnemonic();
          if (mnemonic) {
            navigator.clipboard.writeText(mnemonic);
          }
        }}><Copy /> Copy Mnemonic</Button>
      </div>
  </DialogContent>
</Dialog>

  </DropdownMenuContent>
</DropdownMenu>
          </div>
          <Balance ethAddress={ethAddress} solAddress={solAddress} network={selectedNetwork} />
        </CardContent>
        <Separator />
        <CardFooter>
          <TokenList network={selectedNetwork} setNetwork={setSelectedNetwork} />
        </CardFooter>
      </Card>
    </div>
  ) : !isAdd && accounts?(
    <Password handleUnlockWallet={handleUnlockWallet} password={password} setPassword={setPassword} passErr={passErr}setPassErr={setPassErr} />
  ):(
    <Home isAdd={isAdd} />
  );
}
