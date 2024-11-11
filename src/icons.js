const icons = {};

const importIcons = async () => {
  const iconModules = await Promise.all([
    import('@web3icons/react').then(module => ({ module, name: 'Ethereum' })),
    import('@web3icons/react').then(module => ({ module, name: 'Optimism' })),
    import('@web3icons/react').then(module => ({ module, name: 'Gnosis' })),
    // Add additional imports for other icons here
  ]);

  iconModules.forEach(({ module, name }) => {
    icons[name.toLowerCase()] = module[name];
  });
};

importIcons();

export default icons;