// components/WalletCard.js
import { Box, Heading, Input, Button, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useState , useEffect} from 'react';
import { uuid } from 'uuidv4';

const WalletCard = () => {
  const [walletBalance, setWalletBalance] = useState(null);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferStatus, setTransferStatus] = useState('');
  const [pointer, setPointer] = useState(false);
  const [ciphertext, setCiphertext] = useState(''); 
  const [walletId, setWalletId] = useState('');
  const [tokenId, setTokenId] = useState(''); 
  const [ destinationAddress, setDestinationAddress] = useState('');

  const fetchCipherText = async () => {
    try {
      const response = await axios.get('/api/getciphertext');
      setCiphertext(response.data.Ciphertext);
    } catch (error) {
      console.error(error);
    }
  }
fetchCipherText();
  const fetchWalletBalance = async () => {
    try {
      const response = await axios.get(`https://api.circle.com/v1/w3s/wallets/${walletId}/balances`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_APP_CIRCLE_API}`,
        },
      });
      console.log(response.data);
      setWalletBalance(response.data);
      setPointer(!pointer);
    } catch (error) {
      console.error(error);
    }
  };

  const initiateTransfer = async () => {
    console.log( uuid(), process.env.NEXT_PUBLIC_APP_SRT, transferAmount, walletId, tokenId, destinationAddress);
    try {
      const response = await axios.post('https://api.circle.com/v1/w3s/developer/transactions/transfer', {
        idempotencyKey: uuid(),
        entitySecretCipherText: ciphertext,
        amounts: [transferAmount],
        feeLevel: 'HIGH',
        tokenId: tokenId,
        walletId: walletId,
        destinationAddress: destinationAddress,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_APP_CIRCLE_API}`,
        },
      });
      console.log(response, "transfer response");
      setTransferStatus('Transfer initiated successfully.');
    } catch (error) {
      console.error(error);
      setTransferStatus('Transfer failed. Check the console for details.');
    }
  };

  useEffect(() => {
    fetchCipherText();
  }
  , [pointer]);

  return (
    <Box p={4} borderWidth="1px" borderRadius="md">
      <Heading as="h2" size="lg">Wallet Information</Heading>
      <Text mb={2}>Current Balance: {walletBalance?.balance}</Text>
      <Button colorScheme="blue" onClick={fetchWalletBalance}>Check Balance</Button>

      {walletBalance?.data.tokenBalances.map((tokenBalance, index) => (
        <Box key={index} borderWidth="1px" borderRadius="md" p={2} mt={2}>
          <Heading as="h3" size="md">{tokenBalance.token.name} ({tokenBalance.token.symbol})</Heading>
          <Text>TokenID: {tokenBalance.token.id}</Text>
          <Text>Balance: {tokenBalance.amount}</Text>
        </Box>
      ))}

      <Box mt={4}>
        <Heading as="h3" size="md">Initiate Transfer</Heading>
        <Input
          placeholder="Amount to Transfer"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
        />
        <Input
          placeholder="Wallet ID"
          value={walletId}
          onChange={(e) => setWalletId(e.target.value)}
        />
        <Input
          placeholder="Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />
        <Input
          placeholder="Destination Address"
          value={destinationAddress}
          onChange={(e) => setDestinationAddress(e.target.value)}
        />
        <Button colorScheme="green" onClick={initiateTransfer}>Transfer Funds</Button>
        <Text mt={2} color="green.500">{transferStatus}</Text>
      </Box>
    </Box>
  );
};

export default WalletCard;
