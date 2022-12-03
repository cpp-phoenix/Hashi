import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NavLink as Link } from 'react-router-dom';

function Navbar () {
    return (
        <div className="rounded-b-lg flex items-center justify-between w-full h-1/6 bg-white px-12 border-b-2 border-orange-600">
            <Link className="font-semibold text-4xl text-orange-600 hover:text-orange-500" to='/'>
                Hashi
            </Link>
            <div className="space-x-20 text-[#121517]">
                <Link className="font-semibold text-lg" to='/'>Swap</Link>
                <Link className="font-semibold text-lg" to='/pools'>Pools</Link>
                <Link className="font-semibold text-lg" to='/stats'>Analytics</Link>
            </div>
            <div className="">
                <ConnectButton chainStatus="icon" showBalance={false}/>
            </div>
        </div>
    )
}

export default Navbar;