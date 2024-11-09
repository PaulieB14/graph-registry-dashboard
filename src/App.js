import React, { useEffect, useState } from 'react';
import './App.css';

// Function to determine the logo URL for a given network
const getLogoUrl = (network) => {
  const logoMapping = {
    "Arbitrum Nova": "arbitrum-nova.png",
    "Arbitrum One Mainnet": "arbitrum-one-mainnet.png",
    "Arweave": "arweave.png",
    "Astar zkEVM Mainnet": "astar-zkevm-mainnet.png",
    "Aurora Mainnet": "aurora-mainnet.png",
    "Avalanche C-Chain": "avalanche-c-chain.png",
    "Base Mainnet": "base-mainnet.png",
    "Bitcoin Mainnet": "bitcoin-mainnet.png",
    "Blast Mainnet": "blast-mainnet.png",
    "BNB Smart Chain Mainnet": "bnb-smart-chain-mainnet.png",
    "Boba BNB Mainnet": "boba-bnb-mainnet.png",
    "Boba Network": "boba-network.png",
    "Celo Mainnet": "celo-mainnet.png",
    "Chiliz Mainnet": "chiliz-mainnet.png",
    "CLV Parachain": "clv-parachain.png",
    "Cronos Mainnet": "cronos-mainnet.png",
    "EOS EVM Network": "eos-evm-network.png",
    "EOS Mainnet": "eos-mainnet.png",
    "Ethereum Consensus Layer Chain": "ethereum-consensus-layer-chain.png",
    "Ethereum Holesky Consensus Layer Chain": "ethereum-holesky-consensus-layer-chain.png",
    "Ethereum Mainnet": "ethereum-mainnet.png",
    "Ethereum Sepolia Consensus Layer Chain": "ethereum-sepolia-consensus-layer-chain.png",
    "Etherlink Mainnet": "etherlink-mainnet.png",
    "Fantom Mainnet": "fantom-mainnet.png",
    "Fuse Mainnet": "fuse-mainnet.png",
    "Gnosis Mainnet": "gnosis-mainnet.png",
    "Gravity Alpha Mainnet": "gravity-alpha-mainnet.png",
    "Harmony Mainnet Shard 0": "harmony-mainnet-shard-0.png",
    "Injective Mainnet": "injective-mainnet.png",
    "IoTeX Mainnet": "iotex-mainnet.png",
    "Kaia Mainnet": "kaia-mainnet.png",
    "Linea Mainnet": "linea-mainnet.png",
    "Mantra Mainnet": "mantra-mainnet.png",
    "Mode Mainnet": "mode-mainnet.png",
    "Moonbeam Mainnet": "moonbeam-mainnet.png",
    "Moonriver Mainnet": "moonriver.png",
    "Near Mainnet": "near-mainnet.png",
    "Neo X Mainnet": "neo-x-mainnet.png",
    "OP Mainnet": "op-mainnet.png",
    "Polygon Mainnet": "polygon-mainnet.png",
    "Polygon zkEVM Mainnet": "polygon-zkevm-mainnet.png",
    "Rootstock Mainnet": "rootstock-mainnet.png",
    "Scroll Mainnet": "scroll-mainnet.png",
    "Sei Network": "sei-network.png",
    "Solana Mainnet": "solana-mainnet.png",
    "Starknet Mainnet": "starknet-mainnet.png",
    "Telos Mainnet": "telos-mainnet.png",
    "Vara Mainnet": "vara-mainnet.png",
    "WAX Mainnet": "wax-mainnet.png",
    "Xai Mainnet": "xai-mainnet.png",
    "XLayer Mainnet": "xlayer-mainnet.png",
    "zkSync Mainnet": "zksync-mainnet.png",
    "Zora Network": "zora-network.png",
    "Arbitrum Sepolia Testnet": "arbitrum-sepolia-testnet.png",
    "Blast Sepolia Testnet": "blast-sepolia-testnet.png",
    "BNB Smart Chain Chapel Testnet": "bnb-smart-chain-chapel-testnet.png",
    "Boba Sepolia Testnet": "boba-sepolia-testnet.png",
    "Chiliz Spicy Testnet": "chiliz-spicy-testnet.png",
    "EOS Jungle4 EVM Testnet": "eos-jungle4-evm-testnet.png",
    "EOS Jungle4 Testnet": "eos-jungle4-testnet.png",
    "Ethereum Holesky Testnet": "ethereum-holesky-testnet.png",
    "Ethereum Seepolia Testnet": "ethereum-seepolia-testnet.png",
    "Etherlink Testnet": "etherlink-testnet.png",
    "Fantom Testnet": "fantom-testnet.png",
    "Fuse Testnet": "fuse-testnet.png",
    "Gnosis Chiado Testnet": "gnosis-chiado-testnet.png",
    "Gravity Sepolia Testnet": "gravity-sepolia-testnet.png",
    "Injective Testnet": "injective-testnet.png",
    "Kaia Testnet Kairos": "kaia-testnet-kairos.png",
    "Kylin Testnet": "kylin-testnet.png",
    "Linea Sepolia Testnet": "linea-sepolia-testnet.png",
    "Mantra Testnet": "mantra-testnet.png",
    "Moonbase Alpha Testnet": "moonbase-alpha-testnet.png",
    "Near Testnet": "near-testnet.png",
    "Neo X Testnet": "neo-x-testnet.png",
    "OP Sepolia Testnet": "op-sepolia-testnet.png",
    "Polygon Amoy Testnet": "polygon-amoy-testnet.png",
    "Rootstock Testnet": "rootstock-testnet.png",
    "Starknet Sepolia Testnet": "starknet-sepolia-testnet.png",
    "Telos Testnet": "telos-testnet.png",
    "Vara Testnet": "vara-testnet.png",
    "WAX Testnet": "wax-testnet.png",
    "XLayer Testnet": "xlayer-testnet.png",
    "zkSync Sepolia Testnet": "zksync-sepolia-testnet.png"
  };
  const logoUrl = `/logos/${logoMapping[network.fullName] || 'default.png'}`;
  console.log(`Logo URL for ${network.fullName}: ${logoUrl}`); // Debugging output
  return logoUrl;
};

function App() {
  const [networks, setNetworks] = useState({ mainnets: [], testnets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('mainnet');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://graphregistry.pages.dev/TheGraphNetworksRegistry.json");
        const data = await response.json();
        const allNetworks = data.networks || [];

        // Sort and separate mainnets and testnets
        const sortedMainnets = allNetworks
          .filter(network => network.networkType === 'mainnet' && !network.fullName.toLowerCase().includes('testnet'))
          .sort((a, b) => a.fullName.localeCompare(b.fullName));

        const sortedTestnets = allNetworks
          .filter(network => network.networkType === 'testnet' || network.fullName.toLowerCase().includes('testnet'))
          .sort((a, b) => a.fullName.localeCompare(b.fullName));

        // Add logo URLs to mainnets and testnets
        const mainnetsWithLogos = sortedMainnets.map(network => ({
          ...network,
          logoUrl: getLogoUrl(network)
        }));

        const testnetsWithLogos = sortedTestnets.map(network => ({
          ...network,
          logoUrl: getLogoUrl(network)
        }));

        setNetworks({ mainnets: mainnetsWithLogos, testnets: testnetsWithLogos });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data.</div>;

  // Function to render the rows of the network table
  const renderRows = (networksList) => {
    return networksList.map((network, index) => (
      <tr key={index}>
        <td>
          <img
            src={network.logoUrl || '/logos/default.png'}
            alt={`${network.fullName} logo`}
            className="network-logo"
            onLoad={(e) => {
              e.target.classList.add('loaded'); // Add the loaded class when the image is loaded
            }}
            onError={(e) => {
              e.target.src = '/logos/default.png'; // Fallback if the logo fails to load
              e.target.classList.add('loaded'); // Ensure the fallback image also gets the loaded class
            }}
          />
          {network.fullName}
        </td>
        <td>{network.caip2Id}</td>
        <td>
          {network.explorerUrls ? (
            <a href={network.explorerUrls[0]} target="_blank" rel="noopener noreferrer">
              {network.explorerUrls[0]}
            </a>
          ) : (
            'N/A'
          )}
        </td>
      </tr>
    ));
  };

  return (
    <div className="App">
      <h1>The Graph Networks Registry</h1>
      
      <div className="tabs">
        <button 
          className={activeTab === 'mainnet' ? 'active' : ''} 
          onClick={() => setActiveTab('mainnet')}
        >
          Mainnets
        </button>
        <button 
          className={activeTab === 'testnet' ? 'active' : ''} 
          onClick={() => setActiveTab('testnet')}
        >
          Testnets
        </button>
      </div>

      <table className={activeTab === 'mainnet' ? 'mainnet-table' : 'testnet-table'}>
        <thead>
          <tr>
            <th>Network Name <span className="sort-indicator">▲</span></th>
            <th>Chain ID</th>
            <th>Explorer URL</th>
          </tr>
        </thead>
        <tbody>
          {activeTab === 'mainnet' ? renderRows(networks.mainnets) : renderRows(networks.testnets)}
        </tbody>
      </table>
    </div>
  );
}

export default App;