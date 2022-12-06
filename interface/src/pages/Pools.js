import { useNetwork, useAccount, erc20ABI, useProvider, useSigner } from 'wagmi';
import { useEffect, useState } from 'react';
import { ethers, utils } from "ethers";
import hashipoolabi from "../abis/hashipoolabi.json";

function Pools() {
    const chainObj = {
        5: {
            chainId: 5,
            chianName: "Goerli",
            rpc: "https://goerli.infura.io/v3/",
            zeroX: "https://goerli.api.0x.org/",
            receiverContract: "",
            hashiPoolContract: "0x1120efb1bae427a84c7d09117f9729acae175dce",
            domain: 5,
            tokens: [
                {
                    token: "USDT",
                    address: "0x69c9e542c9234a535b25df10e5a0f8542670d44a",
                    decimals: 18
                },
                {
                    token: "USDC",
                    address: "0x89a543c56f8fc6249186a608bf91d23310557382",
                    decimals: 18
                },
                {
                    token: "DAI",
                    address: "0x0e3b53f09f0e9b3830f7f4a3abd4be7a70713a31",
                    decimals: 18
                }
            ]
        },
        80_001: {
            chainId: 80_001,
            chianName: "Mumbai",
            rpc: "https://matic-mumbai.chainstacklabs.com",
            zeroX: "https://mumbai.api.0x.org/",
            receiverContract: "",
            hashiPoolContract: "0x5e242e8ef9239cbf71399c4b5b9e1465905cd7cf",
            domain: 80001,
            tokens: [
                {
                    token: "USDT",
                    address: "0x07cD0B7fC7979CFd1a76b124F551E981944eFF41",
                    decimals: 18
                },
                {
                    token: "USDC",
                    address: "0x4d344098b124fead012fc54b91f3099e1fec06f6",
                    decimals: 18
                },
                {
                    token: "DAI",
                    address: "0x8ebf563bc9a267b71b4e6055279d3cf4d3b368ee",
                    decimals: 18
                }
            ]
        }
    }

    const provider = useProvider()
    const { data: signer } = useSigner()
    const { chain, chains } = useNetwork();
    const { isConnected, address } = useAccount();
    const [viewPool, setViewPool] = useState(false);
    const [selectPool, setSelectPool] = useState({});
    const [totalStaked, setTotalStaked] = useState(0);
    const [depositAmount, setDepositAmount] = useState(0);
    const [withdrawAmount, setWithdrawAmount] = useState(0);

    function checkTotalStaked(token) {
        const contract = new ethers.Contract(token.address, erc20ABI, provider);
        console.log(token);
    }

    const triggerDeposit = async () => {
        const contract = new ethers.Contract(selectPool.address, erc20ABI, signer);
        const allowed = await contract.allowance(address, chainObj[chain.id].hashiPoolContract);
        console.log(allowed.toString());
        let  amount = String(depositAmount * 10 ** selectPool.decimals);
        if(allowed.toString() < amount) {
            console.log("allow");
            await contract.approve(chainObj[chain.id].hashiPoolContract, amount);
        } else {
            console.log("Transact");
            const hashiPoolContract = new ethers.Contract(chainObj[chain.id].hashiPoolContract, hashipoolabi, signer);
            await hashiPoolContract.depositInPool(amount, selectPool.address);
        }
    }

    const triggerWithdraw = async () => {
        const contract = new ethers.Contract(selectPool.address, erc20ABI, signer);
        const allowed = await contract.allowance(address, chainObj[chain.id].hashiPoolContract);
        console.log(allowed.toNumber());
        let  amount = String(depositAmount * 10 ** selectPool.decimals);
        const hashiPoolContract = new ethers.Contract(chainObj[chain.id].hashiPoolContract, hashipoolabi, signer);
        await hashiPoolContract.widthdrawFromPool(amount, selectPool.address);
    }

    return (
        <div className="flex flex-1 items-center justify-center h-5/6">
        {
            viewPool && 
            <div className="absolute flex justify-between flex-col rounded-lg w-4/12 h-content bg-white px-6 py-4 space-y-8">
                <div className="flex w-full items-center justify-center text-2xl mt-2 pb-2 border-b-2">Liquidity</div>
                <div className="flex flex-row space-x-4">
                    <input onChange = {(e) => setDepositAmount(e.target.value)} className="placeholder:text-slate-400 block bg-white w-full py-2 pl-2 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Enter Amount to deposit" type="number" name="toAmount"/>       
                    <button onClick={() => triggerDeposit()} className="rounded-lg px-6 py-4 bg-orange-600 text-white">Deposit</button>
                </div>
                <div className="flex flex-row space-x-4">
                    <input onChange = {(e) => setWithdrawAmount(e.target.value)} className="placeholder:text-slate-400 block bg-white w-full py-2 pl-2 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Enter Amount to withdraw" type="number" name="toAmount"/>       
                    <button onClick={() => triggerWithdraw()} className="rounded-lg px-6 py-4 bg-orange-600 text-white">Withdraw</button>
                </div>
                <div className="flex justify-center h-[100px] text-2xl items-center border-1 bg-gray-200 rounded-lg px-10">
                    Total Staked: {totalStaked}
                </div>
                <div onClick={() => setViewPool(!viewPool)} className="rounded-lg flex w-full items-center justify-center text-xl mt-2 border-2 py-4 bg-gray-400 text-white hover:cursor-pointer">Close</div>
            </div>
        }
        {
            isConnected && 
            <div className="rounded-lg w-4/12 h-content bg-white">
                {chainObj[chain.id].tokens.map(token => <div className="rounded-lg my-1 bg-gray-100 flex items-center text-xl w-full h-[100px] px-4 py-2 hover:bg-gray-200">
                    <div className="flex flex-row justify-between w-full"> 
                        <div> {token.token} </div>
                        <div className="flex flex-row space-x-6"> 
                            <button onClick={() => {setViewPool(!viewPool); setSelectPool(token); checkTotalStaked(token);}} className="rounded-lg bg-orange-600 text-white p-4">Deposit</button>
                            <button onClick={() => {setViewPool(!viewPool); setSelectPool(token); checkTotalStaked(token);}} className="rounded-lg bg-orange-600 text-white p-4">Withdraw</button>
                        </div>
                    </div>
                </div>)}
            </div>
        }
        </div>
    )
}
export default Pools;