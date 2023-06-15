import { ethers } from "ethers";
import { useEffect, useState } from "react";
import deploy from "./deploy";
import Escrow from "./Escrow";
// import Button from "./components/Button";
import { Input, Button, Card, CardBody, Text } from "@chakra-ui/react";
import escrowArtifacts from "../src/artifacts/contracts/Escrow.sol/Escrow.json";

const provider = new ethers.providers.Web3Provider(window.ethereum);

function App() {
  const [account, setAccount] = useState("");
  const [signer, setSigner] = useState("");

  const [beneficiary, setBeneficiary] = useState("");
  const [arbiter, setArbiter] = useState("");
  const [ethValue, setEthValue] = useState("");

  const [contractAddr, setContractAddr] = useState("");

  const [showInput, setShowInput] = useState(true);

  const [data, setData] = useState({});

  const escrowABI = escrowArtifacts.abi;

  async function approve() {
    const contract = new ethers.Contract(contractAddr, escrowABI, signer);
    const txn = await contract.approve();
    await txn.wait();
  }

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  async function newContract() {
    const ethVal = ethers.utils.parseEther(ethValue);
    const escrowContract = await deploy(signer, arbiter, beneficiary, ethVal);

    setContractAddr(escrowContract.address);
  }

  async function getContract() {
    const contract = new ethers.Contract(contractAddr, escrowABI, signer);
    const arbiter = await contract.arbiter();
    const isApproved = await contract.isApproved();
    const sum = await provider.getBalance(contract.address);
    const data = {
      depositor: await contract.depositor(),
      beneficiary: await contract.beneficiary(),
      arbiter: arbiter,
      value: sum,
      isApproved: isApproved
    };

    setData(data);
    setShowInput(false);
  }

  return (
    <div className="container flex justify-center gap-40 items-center h-[100vh]">
      <div className="flex-1">
        <h1 className="text-center mb-[10px] text-[20px] font-bold">
          New Contract
        </h1>
        <div className="flex flex-col gap-[10px] items-center">
          <Input
            value={beneficiary}
            onChange={(e) => setBeneficiary(e.target.value)}
            className="max-w-[400px]"
            placeholder="Beneficiary"
            size="md"
          />
          <Input
            value={arbiter}
            onChange={(e) => setArbiter(e.target.value)}
            className="max-w-[400px]"
            placeholder="Arbiter"
            size="md"
          />
          <Input
            value={ethValue}
            onChange={(e) => setEthValue(e.target.value)}
            className="max-w-[400px]"
            placeholder="Value (ETH)"
            size="md"
          />

          <Button
            colorScheme="telegram"
            onClick={newContract}
            className="shadow-lg"
          >
            Create Contract
          </Button>
          <h2 className="text-center mb-[10px] text-[16px] font-[600]">
            {contractAddr}
          </h2>
        </div>
      </div>
      <div className="flex-1">
        <h1 className="text-center mb-[10px] text-[20px] font-bold">
          For Arbiter
        </h1>
        <div className="flex flex-col gap-[10px] items-center">
          {showInput ? (
            <>
              <Input
                value={contractAddr}
                onChange={(e) => setContractAddr(e.target.value)}
                className="max-w-[400px]"
                placeholder="Contract Address"
                size="md"
              />
              <Button
                colorScheme="telegram"
                onClick={getContract}
                className="shadow-lg"
              >
                Get Contract
              </Button>
            </>
          ) : (
            <>
              <Card>
                <CardBody>
                  <Text>Depositor: {data.depositor}</Text>
                  <Text>Beneficiary: {data.beneficiary}</Text>
                  <Text>Value: {ethers.utils.formatEther(data.value)} ETH</Text>
                </CardBody>
              </Card>
              {data.arbiter.toLowerCase() == account.toLowerCase() && !data.isApproved ? (
                <Button
                  colorScheme="green"
                  onClick={approve}
                  className="shadow-lg"
                >
                  Approve
                </Button>
              ) : (
                <Text className="text-center text-[20px] font-bold text-red-600">Error !</Text>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
