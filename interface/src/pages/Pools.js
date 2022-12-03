import { useNetwork, useAccount, erc20ABI, useProvider, useSigner } from 'wagmi';
import { useState } from 'react';
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
                    token: "USDC",
                    address: "0x5FfbaC75EFc9547FBc822166feD19B05Cd5890bb",
                    decimals: 18
                },
                {
                    token: "USDT",
                    address: "0xC51FceEc013cD34aE2e95E6D64E9858F2aC28fFf",
                    decimals: 18
                },
                {
                    token: "DAI",
                    address: "0xE68104D83e647b7c1C15a91a8D8aAD21a51B3B3E",
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
                    token: "USDC",
                    address: "0xe6b8a5CF854791412c1f6EFC7CAf629f5Df1c747",
                    decimals: 6
                },
                {
                    token: "USDT",
                    address: "0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832",
                    decimals: 6
                },
                {
                    token: "DAI",
                    address: "0xd393b1E02dA9831Ff419e22eA105aAe4c47E1253",
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