import React, { useEffect, useState } from 'react';
import './App.css';
import icons from './icons'; // Import your icons mapping

const getLogoUrl = (network) => {
  const iconName = network.web3Icon; // Use the `web3Icon` value from your JSON
  return icons[iconName] ? icons[iconName] : null;
};

function App() {
  const [networks, setNetworks] = useState({ mainnets: [], testnets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('mainnet');
  const [showIndexingRewardsOnly, setShowIndexingRewardsOnly] = useState(false);

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

        setNetworks({ mainnets: sortedMainnets, testnets: sortedTestnets });
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
    return networksList
      .filter(network => !showIndexingRewardsOnly || network.issuanceRewards) // Filter based on checkbox state
      .map((network, index) => {
        const IconComponent = getLogoUrl(network); // Get the correct IconComponent

        return (
          <tr key={index}>
            <td>
              {IconComponent ? (
                <IconComponent className="network-logo" />
              ) : (
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
              )}
              {network.fullName}
            </td>
            <td>{network.issuanceRewards ? 'Yes' : 'No'}</td>
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
        );
      });
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

      <div className="filter-options">
        <label>
          <input 
            type="checkbox" 
            checked={showIndexingRewardsOnly}
            onChange={() => setShowIndexingRewardsOnly(!showIndexingRewardsOnly)}
          />
          Show only networks with Indexing Rewards
        </label>
      </div>

      <table className={activeTab === 'mainnet' ? 'mainnet-table' : 'testnet-table'}>
        <thead>
          <tr>
            <th>Network Name <span className="sort-indicator">▲</span></th>
            <th>Indexing Rewards</th>
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