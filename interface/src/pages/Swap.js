import { useNetwork, useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import qs from 'qs';
import { ethers, utils } from "ethers";

function Swap() {
    const { chain, chains } = useNetwork();
    const { isConnected } = useAccount();
    const [toChain, setToChain] = useState("Select");
    const [toChainId, setToChainId] = useState(0);
    const [toChainSelect, toggleToChainSelect] = useState(false);
    const [swapTo, setSwapTo] = useState(0);
    const [swapFrom, setSwapFrom] = useState(0);
    const [toPayLoading, toggleToPayLoading] = useState(false);
    const [tokenFrom, setTokenFrom] = useState({
        token: "Select"
    });
    const [tokenTo, setTokenTo] = useState({
        token: "Select"
    });
    const [showFromTokenList, setShowFromTokenList] = useState(false);
    const [showToTokenList, setShowToTokenList] = useState(false);
    const [protocolFee, setProtocolFee] = useState(0);
    const [gasFee, setGasFee] = useState(0);
    const [priceImpact, setPriceImpact] = useState(0);

    const chainObj = {
        5: {
            chainId: 5,
            chianName: "Goerli",
            rpc: "https://goerli.infura.io/v3/",
            zeroX: "https://goerli.api.0x.org/",
            tokens: [
                {
                    token: "ETH",
                    address: "",
                    decimals: 18
                },
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
            tokens: [
                {
                    token: "MATIC",
                    address: "",
                    decimals: 18
                },
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

    useEffect(() => {
        if(isConnected) {
            setToChain(chain?.name);
            setToChainId(chain?.id);
        } 
    },[isConnected]);

    const sendTransaction = () => {

    }

    const getPrice = async (targetValue) => {
        if(targetValue > 0) {
            toggleToPayLoading(true);
            console.log(targetValue);
            setSwapFrom(swapFrom);

            let  amount = Number(targetValue * 10 ** tokenFrom.decimals);

            const params = {
                sellToken: tokenFrom.address === "" ? tokenFrom.token : tokenFrom.address,
                buyToken: tokenTo.address === "" ? tokenTo.token : tokenTo.address,
                sellAmount: amount,
            }

            // Fetch the swap price.
            const response = await fetch(
                `${chainObj[chain.id].zeroX}swap/v1/price?${qs.stringify(params)}`
            );

            const swapPriceJSON = await response.json();
            const outputBalance = utils.formatUnits(swapPriceJSON.buyAmount, tokenTo.decimals);
            setSwapTo(outputBalance);

            setProtocolFee(swapPriceJSON.protocolFee)
            const gasCost = swapPriceJSON.gas * swapPriceJSON.gasPrice;
            console.log("Gs Cost: ", gasCost);
            setGasFee(utils.formatEther(gasCost.toString()))
            setPriceImpact(swapPriceJSON.estimatedPriceImpact)

            toggleToPayLoading(false);
        }   
    }


    return (
        <div className="flex flex-1 items-center justify-center h-5/6">
            <div className="flex flex-col justify-between rounded-lg font-semibold w-5/12 h-5/6 bg-white">
                <div className="text-2xl mx-4 mt-4">Swap</div>
                <div className="rounded-lg border border-rounded h-[120px] mx-6 p-2">
                    <div>
                        <div>From</div>
                        <div className="flex flex-row items-center h-[75px]">
                            <div className="flex items-center justify-center px-2 py-2 mx-2 border-2 rounded-lg">
                                <div>
                                    {chain?.name}
                                </div>
                            </div>
                            <div className="flex-1 flex items-center px-2 py-1 mx-2 border-2 rounded-lg">
                                <input onChange={(e) => {getPrice(e.target.value)}} class="placeholder:text-slate-400 block bg-white w-full py-2 pl-2 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="" type="number" name="toAmount"/>       
                            </div>
                            <div className="flex items-center px-2 py-2 mx-2 border-2 rounded-lg">
                                {showFromTokenList && 
                                    <div className="absolute rounded-lg border bg-white mt-40 p-2 px-4">
                                        {
                                            (chainObj[chain.id].tokens.filter(token => token.address !== tokenTo.address).map(token => <div onClick={() => {setShowFromTokenList(!showFromTokenList); setTokenFrom(token)}} className="hover:cursor-pointer" >{token.token}</div>))
                                        }
                                    </div>
                                }
                                <div onClick={() => setShowFromTokenList(!showFromTokenList)} className="hover:cursor-pointer">
                                    {tokenFrom.token}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg border border-rounded h-[120px] mx-6 p-2">
                    <div>
                        <div>To</div>
                        { toChainSelect && 
                            <div className="absolute rounded-lg bg-white border-2 mt-16 mx-2 w-content">
                                { 
                                    chains.map((chain) => <div onClick={() => {setToChain(chain.name); setToChainId(chain?.id); toggleToChainSelect(!toChainSelect)}} className="flex justify-center py-2 px-2 hover:bg-gray-100 hover:cursor-pointer">{chain.name}</div>)
                                }
                            </div>
                        }
                        
                        <div className="flex flex-row items-center justify-center h-[75px] hover:cursor-pointer">
                            <div onClick={() => toggleToChainSelect(!toChainSelect)} className="flex items-center justify-center px-2 py-2 mx-2 border-2 rounded-lg">
                                <div>
                                    {toChain} v
                                </div>
                            </div>
                            <div className="flex-1 flex items-center px-2 py-2 mx-2 border-2 rounded-lg">
                                {swapTo}
                            </div>
                            <div className="flex items-center px-2 py-2 mx-2 border-2 rounded-lg">
                                {showToTokenList && 
                                    <div className="absolute rounded-lg border bg-white mt-40 p-2 px-4">
                                        {
                                            (chainObj[toChainId].tokens.filter(token => token.address !== tokenFrom.address).map(token => <div onClick={() => {setShowToTokenList(!showToTokenList); setTokenTo(token)}} className="hover:cursor-pointer" >{token.token}</div>))
                                        }
                                    </div>
                                }
                                <div onClick={() => setShowToTokenList(!showToTokenList)} className="hover:cursor-pointer">
                                    {tokenTo.token}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg border border-rounded h-[120px] mx-6 p-2">
                    <div>
                        <div>You Pay</div>
                        <div className="animate-pulse p-1 flex flex-row items-center justify-center h-[75px]">
                            { toPayLoading && <div class="rounded-lg w-full h-full bg-slate-300"></div> }
                        </div>
                    </div>
                </div>
                <button onClick={() => sendTransaction()} className="w-full rounded-b-lg text-xl text-white py-4 bg-orange-600">Initiate</button>
            </div>
        </div>
    )
}
export default Swap;