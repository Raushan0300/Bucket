
interface TokenListProps {
  network: string;
  setNetwork: (network: string) => void;
}

const TokenList = (props: TokenListProps) => {
  const { network, setNetwork } = props;

  const tokens = [
    {
      id: 1,
      name: "Ethereum",
      symbol: "ETH",
      network: "mainnet",
    },
    {
      id: 2,
      name: "Holesky (Testnet)",
      symbol: "Holesky ETH",
      network: "holesky",
    },
    { id: 3, name: "Sepolia (Testnet)", symbol: "Sepolia ETH", network: "sepolia" },
    {
      id: 4,
      name: "Solana",
      symbol: "SOL",
      network: "solana",
    },
    {
      id: 5,
      name: "Solana Devnet",
      symbol: "Dev SOL",
      network: "solana-dev",
    },
  ];

  return (
    <div className="flex flex-col mt-4 w-full">
      {tokens.map((token) => (
        <div
          key={token.id}
          className={`flex justify-between items-center rounded p-4 cursor-pointer ${network === token.network && "bg-indigo-100 text-gray-800"}`} onClick={()=>{setNetwork(token.network)}}>
            <span className="font-bold">{token.symbol}</span>
          <span className="font-extralight">{token.name}</span>
        </div>
      ))}
    </div>
  );
};

export default TokenList;
