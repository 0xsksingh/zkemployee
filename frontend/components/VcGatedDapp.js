import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Button,
  Spinner,
  Card,
  Center,
  VStack,
  InputGroup,
  Input,
  Text,
  Select,
} from "@chakra-ui/react";
import demoAbi from "./demoSmartContract/demoAbi.json";
import { Circle, CircleEnvironments, PaymentIntentCreationRequest } from "@circle-fin/circle-sdk";
import Checkout from "./Circle/Checkout";
import WalletCard from "./WalletCard";

function VcGatedDapp() {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  const circle = new Circle(
    "SAND_API_KEY:6e665bb020f904cd284737da1468065c:e8525563c6cdb4d81fd551d1a7d01e84",
    CircleEnvironments.sandbox // API base url
  );

  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState('USD');

  async function createCheckoutSession() {
    setLoading(true);
    const createCheckoutSessionRes =
      await circle.checkoutSessions.createCheckoutSession({
        successUrl: "https://zkemployee.vercel.app/success",
        amount: {
          amount: amount,
          currency: currency,
        },
      });

    console.log("Checkout session created", createCheckoutSessionRes)
    setData(createCheckoutSessionRes?.data?.data);
    // setCheckoutData(createCheckoutSessionRes?.data?.data);
    setLoading(false);
  }

  return (
    <div id="vc-gated-dapp">
      <Box background="black" color="white" py={4}>
        <Container maxW={"80%"}>
          <Flex justifyContent="space-between">
            <Heading>Welcome Company Officials</Heading>
          </Flex>
        </Container>
      </Box>

      <Box>
        <Container maxW={"80%"} py={4}>

          <div>
          <Container maxW="xl" centerContent>
            <Text as="h1" fontSize="2xl" mt={4}>My Wallet</Text>
            <WalletCard />
          </Container>


            <div className="flex flex-col md:flex-row">
              <div className="flex flex-col flex-1 md:mr-4 mr-0">
                <InputGroup mb='5'>
                  <Input
                    type="text"
                    placeholder="Enter Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)} />
                </InputGroup>

                <InputGroup mb='5'>
                  <Select placeholder='Select option'
                    value={currency}
                    onChange={(e) => {
                      setCurrency(e.target.value);
                    }}
                  >
                    <option value='USD'>USDC</option>
                    <option value='ETH'>Ethereum</option>
                    <option value='BTC'>Bitcoin</option>
                  </Select>
                </InputGroup>

                <Button onClick={() => {
                  if (!loading) {
                    createCheckoutSession();
                  }
                }}>
                  {loading ? 'Loading...' : ' Pay with Circle'}
                </Button>
              </div>
              <div className="flex-1 md:ml-4 ml-0 mt-4 md:mt-0">
                {data && <Checkout data={data} />}
              </div>
            </div>
          </div>
        </Container>
      </Box>
    </div>
  );
}

export default VcGatedDapp;
