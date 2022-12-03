// const chains = [
//     {
//         chainId: 5,
//         chianName: Goerli,
//         rpc: "https://goerli.infura.io/v3/",
//     },
//     {
//         chainId: 80_001,
//         chianName: Mumbai,
//         rpc: "https://matic-mumbai.chainstacklabs.com",
//     }
// ]

import { useNetwork } from 'wagmi'

function Swap() {
    const { chain, chains } = useNetwork()

    return (
        <div className="flex flex-1 items-center justify-center h-5/6">
            <div className="flex flex-col justify-between rounded-lg font-semibold w-4/12 h-5/6 bg-white">
                <div className="text-2xl mx-4 mt-4">Swap</div>
                <div className="rounded-lg border border-rounded h-[120px] mx-6 p-2">
                    <div>
                        <div>From</div>
                        <div className="flex flex-row items-center h-[75px]">
                            <div className="flex items-center justify-center px-2 py-2 mx-2 border-2 rounded-lg">
                                <div>
                                    {chain.name}
                                </div>
                            </div>
                            <div className="flex-1 flex items-center px-2 py-2 mx-2 border-2 rounded-lg">
                                <div>
                                    dfdfdf
                                </div>    
                            </div>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg border border-rounded h-[120px] mx-6 p-2">
                    <div>
                        <div>To</div>
                        <div className="flex flex-row items-center justify-center h-[75px]">
                            <div className="flex items-center justify-center px-2 py-2 mx-2 border-2 rounded-lg">
                                <div>
                                    {chain.name}
                                </div>
                            </div>
                            <div className="flex-1 flex items-center px-2 py-2 mx-2 border-2 rounded-lg">
                                <div>
                                    dfdfdf
                                </div>    
                            </div>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg border border-rounded h-[120px] mx-6 p-2">
                    <div>
                        <div>You Pay</div>
                        {/* <div className="flex flex-row items-center justify-center h-[75px]">
                            <div>A</div>
                            <div>B</div>
                        </div> */}
                    </div>
                </div>
                <button className="w-full rounded-b-lg text-xl text-white py-4 bg-orange-600">Initiate</button>
            </div>
        </div>
    )
}
export default Swap;