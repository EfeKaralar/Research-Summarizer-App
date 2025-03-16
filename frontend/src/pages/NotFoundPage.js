import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
} from '@chakra-ui/react';
import { FaHome } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <Container maxW="container.md" py={20}>
      <VStack spacing={8} textAlign="center">
        <Heading as="h1" size="2xl" color="brand.700">
          404
        </Heading>
        <Heading as="h2" size="xl">
          Page Not Found
        </Heading>
        <Text fontSize="lg" color="gray.600">
          The page you're looking for doesn't exist or has been moved.
        </Text>
        <Button
          as={RouterLink}
          to="/"
          size="lg"
          colorScheme="brand"
          leftIcon={<FaHome />}
        >
          Return Home
        </Button>
      </VStack>
    </Container>
  );
};

export default NotFoundPage;