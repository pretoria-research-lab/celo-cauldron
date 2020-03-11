import * as contractkit from '@celo/contractkit';

export const getCurrentBlockNumber = async (nodeProvider) => {    
    const kit = contractkit.newKit(nodeProvider);
    const blockNumber = await kit.web3.eth.getBlockNumber();
    console.log(`blockNumber is ${blockNumber}`);
    return blockNumber;
}