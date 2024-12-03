import { ArrowUpRight, LucidePaintBucket } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ModeToggle } from "./mode-toggle";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface PasswordProps {
    handleUnlockWallet: (e: React.FormEvent<HTMLFormElement>) => void;
    password: string;
    setPassword: (password: string) => void;
    passErr: boolean;
    setPassErr: (err: boolean) => void;
}

const Password = (props: PasswordProps) => {
    const { handleUnlockWallet, password, setPassword, passErr, setPassErr } = props;
  return (
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
          <CardDescription>Unlock your wallet</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="mt-5 flex flex-col gap-10">
          <form className="flex flex-col gap-5" onSubmit={handleUnlockWallet}> 
            <div className="space-y-2">
              <Label htmlFor="walletPassword">Wallet Password</Label>
              <Input id="walletPassword" type="password" placeholder="Enter Wallet Password" value={password} onChange={(e)=>{
                setPassword(e.target.value);
                setPassErr(false);
                }} />
            </div>
            {password && <Button className="w-full" variant="outline" type="submit">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Unlock Wallet
            </Button>}
            {passErr && <p className="text-red-500 text-sm">Incorrect Password</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Password