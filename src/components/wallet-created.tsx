import { ArrowRight, Copy, LucidePaintBucket } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { encryptMnemonic } from "@/utils/mnemonic";
import { hashPass } from "@/utils/passHash";

interface WalletCreatedProps {
    mnemonic: string;
    isAdd: boolean;
}

const WalletCreated = (props: WalletCreatedProps) => {
    const { mnemonic, isAdd } = props;

    const [password, setPassword] = useState<string>("");

    const handleContinue = () => {
      const enc = encryptMnemonic(mnemonic, password);
      const json = JSON.stringify({ mnemonic: enc, index: 0 });
      // let i = 0;
      let accKeys = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('acc')) {
          accKeys.push(key);
        }
      }

      localStorage.setItem(`acc${accKeys.length + 1}`, json);

      const hashed = hashPass(password);

      // if (localStorage.getItem("unlockKey") === null) {
      //   localStorage.setItem("unlockKey", hashed);
      // }

      localStorage.setItem("unlockKey", hashed);

      window.location.reload();
    };

  const handleAddAccount = () => {
    const hashedPass = localStorage.getItem("unlockKey");
    const hashed = hashPass(password);
    if(hashedPass !== hashed) {
      alert("Incorrect Password");
      return;
    } else{
      const enc = encryptMnemonic(mnemonic, password);
      const json = JSON.stringify({ mnemonic: enc, index: 0 });
      let accKeys = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('acc')) {
          accKeys.push(key);
        }
      }

      localStorage.setItem(`acc${accKeys.length + 1}`, json);

      window.location.reload();
    }
  }
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
    <h1 className="flex gap-3 items-center text-4xl font-bold mb-8 text-center">Welcome to Bucket <LucidePaintBucket /></h1>
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Wallet Created</CardTitle>
        <CardDescription>Make sure to store your seed phrase in a safe place</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Your wallet has been successfully created. Make sure to store your seed phrase in a safe place.
          </p>
          <div className="space-y-2">
            <Label htmlFor="seedPhrase">Seed Phrase</Label>
            <Input id="seedPhrase" value={mnemonic} readOnly />
          </div>
          <Button className="w-full" onClick={()=>{
            navigator.clipboard.writeText(mnemonic);
          }}>
            <Copy className="mr-2 h-4 w-4" />
              Copy Seed Phrase
          </Button>
          <div className="space-y-2">
            <Label htmlFor="walletPassword">Wallet Password</Label>
            <Input id="walletPassword" type="password" placeholder="Create Wallet Password" value={password} onChange={(e)=>{setPassword(e.target.value)}} />
          </div>
          {password && <Button className="w-full" variant="outline" onClick={!isAdd ? handleContinue : handleAddAccount}>
            <ArrowRight className="mr-2 h-4 w-4" />
              Continue to Wallet
          </Button>}
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground text-center w-full">
          By creating or importing a wallet, you agree to our{' '}
          <a href="#" className="underline">Terms of Service</a> and{' '}
          <a href="#" className="underline">Privacy Policy</a>.
        </p>
      </CardFooter>
    </Card>
    <Button variant="link" className="mt-4">
      Learn more about blockchain wallets
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  </div>
  )
}

export default WalletCreated