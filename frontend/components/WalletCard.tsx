// components/WalletCard.js
import { Box, Heading, Input, Button, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useState } from 'react';

const WalletCard = () => {
  const [walletBalance, setWalletBalance] = useState(null);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferStatus, setTransferStatus] = useState('');

  const fetchWalletBalance = async () => {
    try {
      const response = await axios.get('https://api.circle.com/v1/w3s/wallets/__WALLET_ID__/balances', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.NEXT_PUBLIC_APP_CIRCLE_API,
        },
      });
      setWalletBalance(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const initiateTransfer = async () => {
    try {
      const response = await axios.post('https://api.circle.com/v1/w3s/developer/transactions/transfer', {
        idempotencyKey: '<UNIQUE_UUID>',
        entitySecretCipherText: '<GENERATED_ENTITY_SECRET_CIPHERTEXT>',
        amounts: [transferAmount],
        feeLevel: 'HIGH',
        tokenId: '<ID_OF_THE_TOKEN_YOU_WANT_TO_TRANSFER>',
        walletId: '<ID_OF_PREVIOUSLY_GENERATED_WALLET>',
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer <YOUR_API_KEY>',
        },
      });
      setTransferStatus('Transfer initiated successfully.');
    } catch (error) {
      console.error(error);
      setTransferStatus('Transfer failed. Check the console for details.');
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="md">
      <Heading as="h2" size="lg">Wallet Information</Heading>
      <Text mb={2}>Current Balance: {walletBalance?.balance}</Text>
      <Button colorScheme="blue" onClick={fetchWalletBalance}>Check Balance</Button>
      <Box mt={4}>
        <Heading as="h3" size="md">Initiate Transfer</Heading>
        <Input
          placeholder="Amount to Transfer"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
        />
        <Button colorScheme="green" onClick={initiateTransfer}>Transfer Funds</Button>
        <Text mt={2} color="green.500">{transferStatus}</Text>
      </Box>
    </Box>
  );
};

export default WalletCard;
