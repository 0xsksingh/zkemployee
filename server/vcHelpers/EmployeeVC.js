module.exports = {
    // VC type: EmployeeVC-V7
    // https://schema.dock.io/EmployeeVC-V7-1693856303133.json
    EmployeeVC: () => (
      {
        "circuitId": "credentialAtomicQuerySigV2",
        "id": 1699329389,
        "query": {
          "allowedIssuers": [
            "*"
          ],
          "context": "https://schema.dock.io/ProofOfEmployment-V1698558436855.json-ld",
          "credentialSubject": {
            "companyName": {}
          },
          "skipClaimRevocationCheck": true,
          "type": "ProofOfEmployment"
        }
      }
    ),
  };
  