
const chainId = {}

function Swap() {
    return (
        <div className="flex items-center justify-center h-5/6">
            <div className="flex flex-col justify-between rounded-lg font-semibold w-4/12 h-5/6 bg-white">
                <div className="text-2xl mx-4 mt-4">Swap</div>
                <div className="rounded-lg border-2 border-rounded h-[120px] mx-8 p-2">
                    <div>
                        <div>From</div>
                        <div className="flex flex-row border-2 items-center justify-center h-[75px]">
                            <div>A</div>
                            <div>B</div>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg border-2 border-rounded h-[120px] mx-8 p-2">
                    <div>
                        <div>To</div>
                        <div className="flex flex-row border-2 items-center justify-center h-[75px]">
                            <div>A</div>
                            <div>B</div>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg border-2 border-rounded h-[120px] mx-8 p-2">
                    <div>
                        <div>You Pay</div>
                        <div className="flex flex-row border-2 items-center justify-center h-[75px]">
                            <div>A</div>
                            <div>B</div>
                        </div>
                    </div>
                </div>
                <button className="w-full rounded-b-lg text-xl text-white py-4 bg-orange-600">Initiate</button>
            </div>
        </div>
    )
}
export default Swap;