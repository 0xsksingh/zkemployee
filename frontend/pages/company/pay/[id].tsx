import React from "react";
import VcGatedDapp from "../../../components/VcGatedDapp";
import { Center, Card, Image, CardBody, Container } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Button,
  Spinner,
  VStack,
  InputGroup,
  Input,
  Text,
  Select,
} from "@chakra-ui/react";
import { Circle, CircleEnvironments, PaymentIntentCreationRequest } from "@circle-fin/circle-sdk";
import Checkout from "../../../components/Circle/Checkout";

function App() {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    
    const a = process.env.NEXT_PUBLIC_APP_CIRCLE_SANDBOX_API_KEY;
    
    const circle = new Circle(
      a,
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
    <>
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
    </>
  );
}

export default App;
