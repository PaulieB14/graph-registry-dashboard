import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [mainnets, setMainnets] = useState([]);
  const [testnets, setTestnets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('mainnet'); // Track the active tab

  useEffect(() => {
    fetch("https://graphregistry.pages.dev/TheGraphNetworksRegistry.json")
      .then(response => response.json())
      .then(data => {
        const allNetworks = data.networks || [];
        
        // Separate mainnets and testnets and sort them alphabetically by fullName
        const sortedMainnets = allNetworks
          .filter(network => network.networkType === 'mainnet' && !network.fullName.toLowerCase().includes('testnet'))
          .sort((a, b) => a.fullName.localeCompare(b.fullName));
        
        const sortedTestnets = allNetworks
          .filter(network => network.networkType === 'testnet' || network.fullName.toLowerCase().includes('testnet'))
          .sort((a, b) => a.fullName.localeCompare(b.fullName));
        
        setMainnets(sortedMainnets);
        setTestnets(sortedTestnets);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data.</div>;

  // Function to render table rows based on selected tab
  const renderRows = (networksList) => {
    return networksList.map((network, index) => (
      <tr key={index}>
        <td>{network.fullName}</td>
        <td>{network.caip2Id}</td>
        <td>{network.explorerUrls ? <a href={network.explorerUrls[0]} target="_blank" rel="noopener noreferrer">{network.explorerUrls[0]}</a> : 'N/A'}</td>
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
          {activeTab === 'mainnet' ? renderRows(mainnets) : renderRows(testnets)}
        </tbody>
      </table>
    </div>
  );
}

export default App;