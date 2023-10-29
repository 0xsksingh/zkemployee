const { EmployeeVC } = require("./vcHelpers/EmployeeVC");

// Design your custom authentication requirements here

const humanReadableAuthReason = "Authenticate that you work in this company ?";

// const credentialSubject = {
//   semesterNumber: {
//     // Define your condition based on your university schema
//     $lt: 8, // Modify as needed
//   },
//   // Add other fields as required by your schema
// };

const proofRequest = EmployeeVC();

module.exports = {
  humanReadableAuthReason,
  proofRequest,
};