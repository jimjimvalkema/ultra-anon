// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("UltraAnonModule", (m) => {
    const merkleTreeDepth =  m.getParameter("merkleTreeDepth");
    const PoseidonT3Address = m.getParameter("PoseidonT3Address");
    const _poseidonT3 = m.contractAt("PoseidonT3",PoseidonT3Address)

    const privateTransferVerifier = m.contract("PrivateTransferVerifier", [], {
        value: 0n,
      });
    const publicTransferVerifier = m.contract("PublicTransferVerifier", [], {
    value: 0n,
    });

    const UltraAnon = m.contract("UltraAnon", [merkleTreeDepth, privateTransferVerifier, publicTransferVerifier ], {
        value: 0n,
        libraries: {
            PoseidonT3: _poseidonT3,
          }
    });

    return { UltraAnon, privateTransferVerifier, publicTransferVerifier };
});
