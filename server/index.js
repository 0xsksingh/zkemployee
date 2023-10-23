const express = require("express");
const { auth, resolver, loaders } = require("@iden3/js-iden3-auth");
const getRawBody = require("raw-body");
const { Server } = require("socket.io");
const cors = require("cors");
const { humanReadableAuthReason, proofRequest } = require("./employProofRequest");

require("dotenv").config();

const app = express();
const port = 8080;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.get("/", (req, res) => {
  res.send(
    `Welcome to your backend Polygon ID verifier server! There are ${
      Object.keys(apiPath).length
    } routes available: ${Object.values(apiPath).join(" and ")}.`
  );
});

const server = app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

// save auth qr requests
const authRequests = new Map();

const apiPath = {
  getAuthQr: "/api/get-auth-qr",
  handleVerification: "/api/verification-callback",
};

app.get(apiPath.getAuthQr, (req, res) => {
  getAuthQr(req, res);
});

app.post(apiPath.handleVerification, (req, res) => {
  handleVerification(req, res);
});

const STATUS = {
  IN_PROGRESS: "IN_PROGRESS",
  ERROR: "ERROR",
  DONE: "DONE",
};

const socketMessage = (fn, status, data) => ({
  fn,
  status,
  data,
});

// GetQR returns auth request
async function getAuthQr(req, res) {
  const sessionId = req.query.sessionId;

  console.log(`getAuthQr for ${sessionId}`);

  io.sockets.emit(
    sessionId,
    socketMessage("getAuthQr", STATUS.IN_PROGRESS, sessionId)
  );

  const uri = `${process.env.HOSTED_SERVER_URL}${apiPath.handleVerification}?sessionId=${sessionId}`;
  // Generate request for basic authentication
  // https://0xpolygonid.github.io/tutorials/verifier/verification-library/request-api-guide/#createauthorizationrequest
  const request = auth.createAuthorizationRequest(
    humanReadableAuthReason,
    process.env.VERIFIER_DID,
    uri
  );

  request.id = sessionId;
  request.thid = sessionId;

  const scope = request.body.scope ?? [];
  console.log("scope", scope);
  request.body.scope = [...scope, proofRequest];
  console.log("request", request);
  // store this session's auth request
  authRequests.set(sessionId, request);

  io.sockets.emit(sessionId, socketMessage("getAuthQr", STATUS.DONE, request));

  return res.status(200).set("Content-Type", "application/json").send(request);
}

// handleVerification verifies the proof after get-auth-qr callbacks
async function handleVerification(req, res) {
  const sessionId = req.query.sessionId;

  // get this session's auth request for verification
  const authRequest = authRequests.get(sessionId);

  console.log(`handleVerification for ${sessionId}`);

  io.sockets.emit(
    sessionId,
    socketMessage("handleVerification", STATUS.IN_PROGRESS, authRequest)
  );

  // get JWZ token params from the post request
  const raw = await getRawBody(req);
  const tokenStr = raw.toString().trim();
  console.log("tokenStr", tokenStr);
  // The CredentialAtomicQuerySigValidator contract is used to verify any credential-related zk proof
  // generated by the user using the credentialAtomicQuerySigV2OnChain circuit.
  // https://0xpolygonid.github.io/tutorials/contracts/overview/#blockchain-addresses
  const mumbaiContractAddress = "0x134B1BE34911E39A8397ec6289782989729807a4";
  const keyDIR = "./keys";

  console.log(process.env.RPC_URL_MUMBAI, mumbaiContractAddress);
  
  const ethStateResolver = new resolver.EthStateResolver(
    process.env.RPC_URL_MUMBAI,
    mumbaiContractAddress
  );

  const resolvers = {
    ["polygon:mumbai"]: ethStateResolver,
  };

  // Locate the directory that contains circuit's verification keys
  const verificationKeyloader = new loaders.FSKeyLoader(keyDIR);
  const sLoader = new loaders.UniversalSchemaLoader("ipfs.io");
  const verifier = new auth.Verifier(verificationKeyloader, sLoader, resolvers);

  try {
    const opts = {
      AcceptedStateTransitionDelay: 5 * 60 * 1000, // up to a 5 minute delay accepted by the Verifier
    };
    authResponse = await verifier.fullVerify(tokenStr, authRequest, opts);
    const userId = authResponse.from;
    io.sockets.emit(
      sessionId,
      socketMessage("handleVerification", STATUS.DONE, authResponse)
    );
    return res
      .status(200)
      .set("Content-Type", "application/json")
      .send("User " + userId + " succesfully authenticated");
  } catch (error) {
    console.log(
      "Error handling verification: Double check the value of your RPC_URL_MUMBAI in the .env file. Are you using a valid api key for Polygon Mumbai from your RPC provider? Visit https://alchemy.com/?r=zU2MTQwNTU5Mzc2M and create a new app with Polygon Mumbai"
    );
    console.log("handleVerification error", sessionId, error);
    io.sockets.emit(
      sessionId,
      socketMessage("handleVerification", STATUS.ERROR, error)
    );
    return res.status(500).send(error);
  }
}
