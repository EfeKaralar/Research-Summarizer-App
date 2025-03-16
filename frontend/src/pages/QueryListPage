// src/pages/QueryListPage.js
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Link,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  useColorModeValue
} from '@chakra-ui/react';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import api from '../services/api';
import { formatDistanceToNow } from 'date-fns';

const QueryListPage = () => {
  const [queries, setQueries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  useEffect(() => {
    fetchQueries();
  }, []);
  
  const fetchQueries = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/queries');
      setQueries(response.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch queries. Please try again later.');
      console.error('Error fetching queries:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStatusBadge = (status) => {
    let colorScheme = 'gray';
    
    switch (status) {
      case 'completed':
        colorScheme = 'green';
        break;
      case 'processing':
      case 'analyzing':
        colorScheme = 'blue';
        break;
      case 'failed':
        colorScheme = 'red';
        break;
      default:
        colorScheme = 'gray';
    }
    
    return (
      <Badge colorScheme={colorScheme} px={2} py={1} borderRadius="md">
        {status}
      </Badge>
    );
  };
  
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Button
            as={RouterLink}
            to="/"
            leftIcon={<FaArrowLeft />}
            variant="outline"
          >
            Back to Home
          </Button>
          <Heading as="h1" size="xl" color="brand.700">
            Previous Searches
          </Heading>
          <Box w="100px" />
        </HStack>
        
        {isLoading ? (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" color="brand.500" />
            <Text mt={4}>Loading queries...</Text>
          </Box>
        ) : error ? (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        ) : queries.length === 0 ? (
          <Box textAlign="center" py={10} bg={bgColor} borderRadius="lg" boxShadow="sm">
            <Text fontSize="lg">No searches found.</Text>
            <Button
              as={RouterLink}
              to="/"
              mt={4}
              leftIcon={<FaSearch />}
              colorScheme="brand"
            >
              Make Your First Search
            </Button>
          </Box>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple" bg={bgColor} boxShadow="sm" borderRadius="lg">
              <Thead bg="brand.50">
                <Tr>
                  <Th>Query</Th>
                  <Th>Date</Th>
                  <Th>Papers</Th>
                  <Th>Provider</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {queries.map((query) => (
                  <Tr key={query.id} _hover={{ bg: 'gray.50' }}>
                    <Td>
                      <Link
                        as={RouterLink}
                        to={`/queries/${query.id}`}
                        color="brand.600"
                        fontWeight="medium"
                      >
                        {query.query}
                      </Link>
                    </Td>
                    <Td>
                      {formatDistanceToNow(new Date(query.timestamp), { addSuffix: true })}
                    </Td>
                    <Td>{query.num_papers}</Td>
                    <Td>{query.provider}</Td>
                    <Td>{getStatusBadge(query.status)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default QueryListPage;
