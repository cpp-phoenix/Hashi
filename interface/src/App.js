import './App.css';
import '@rainbow-me/rainbowkit/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import Swap from './pages/Swap';
import Stats from './pages/Stats';
import Pools from './pages/Pools';
import Navbar from './components/Navbar';

const { chains, provider } = configureChains(
  [chain.goerli, chain.polygonMumbai],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

function App() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div className="w-screen h-screen bg-[#121517]">
          <Router>
            <Navbar/>
            <Routes>
              <Route path='/' exact element={<Swap/>} />
              <Route path='/stats' element={<Stats/>} />
              <Route path='/pools' element={<Pools/>} />
            </Routes>
          </Router>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
