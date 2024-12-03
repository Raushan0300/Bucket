import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Download, ArrowRight, LucidePaintBucket } from 'lucide-react';
import WalletCreated from '@/components/wallet-created';
import { genMnemonic } from '@/utils/mnemonic';

interface HomeProps {
  isAdd?: boolean;
}

export default function Home(props: HomeProps) {
  const { isAdd } = props;

  const [importMethod, setImportMethod] = useState<'phrase' | 'privateKey'>('phrase');
  const [mnemonic, setMnemonic] = useState<string>("");
  const [isFull, setIsFull] = useState<boolean>(false);

  const handleCreateWallet = () => {
    const mnemonic = genMnemonic();
    setMnemonic(mnemonic);
    setIsFull(true);
  }

  return !mnemonic || !isFull ? (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
      <h1 className="flex gap-3 items-center text-4xl font-bold mb-8 text-center">Welcome to Bucket <LucidePaintBucket /></h1>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
          <CardDescription>Create a new wallet or import an existing one</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create Wallet</TabsTrigger>
              <TabsTrigger value="import">Import Wallet</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <div className="space-y-4 mt-4">
                <p className="text-sm text-muted-foreground">
                  Create a new wallet to start managing your crypto assets securely.
                </p>
                <Button className="w-full" onClick={handleCreateWallet}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Wallet
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="import">
              <div className="space-y-4 mt-4">
                <div className="flex justify-center space-x-4 mb-4">
                  <Button
                    variant={importMethod === 'phrase' ? 'default' : 'outline'}
                    onClick={() => setImportMethod('phrase')}
                  >
                    Seed Phrase
                  </Button>
                  {/* <Button
                    variant={importMethod === 'privateKey' ? 'default' : 'outline'}
                    onClick={() => setImportMethod('privateKey')}
                  >
                    Private Key
                  </Button> */}
                </div>
                {/* {importMethod === 'phrase' ? (
                  <div className="space-y-2">
                    <Label htmlFor="seedPhrase">Enter your 12-word seed phrase with single space</Label>
                    <Input id="seedPhrase" placeholder="Enter seed phrase..." />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="privateKey">Enter your private key</Label>
                    <Input id="privateKey" type="password" placeholder="Enter private key..." />
                  </div>
                )} */}
                <div className="space-y-2">
                    <Label htmlFor="seedPhrase">Enter your 12-word seed phrase with single space</Label>
                    <Input id="seedPhrase" placeholder="Enter seed phrase..." value={mnemonic} onChange={(e)=>{setMnemonic(e.target.value)}} />
                  </div>
                <Button className="w-full" onClick={()=>{
                  setIsFull(true);
                }}>
                  <Download className="mr-2 h-4 w-4" />
                  Import Wallet
                </Button>
              </div>
            </TabsContent>
          </Tabs>
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
  ) : isFull&&(<WalletCreated mnemonic={mnemonic} isAdd={isAdd as boolean} />);
};