module.exports = {
    // VC type: UniversityDegreesVC-6
    // https://schema.dock.io/EmployeeVC-V7-1693856303133.json
    EmployeeVC: () => (
      {
        "circuitId": "credentialAtomicQuerySigV2",
        "id": 1698689015,
        "query": {
          "allowedIssuers": [
            "*"
          ],
          "context": "https://schema.dock.io/ProofOfEmployment-V1698558436855.json-ld",
          "credentialSubject": {
            "companyName": {
              "$eq": "Google"
            }
          },
          "skipClaimRevocationCheck": true,
          "type": "ProofOfEmployment"
        }
      }
    ),
  };
  