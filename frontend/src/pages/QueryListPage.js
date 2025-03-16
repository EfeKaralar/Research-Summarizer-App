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
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { FaArrowLeft, FaSearch, FaTrash } from 'react-icons/fa';
import api from '../services/api';
import { formatDistanceToNow } from 'date-fns';

const QueryListPage = () => {
  const [queries, setQueries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  useEffect(() => {
    fetchQueries();
  }, []);
  
  const fetchQueries = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/queries');
      
      // Sanitize the query data to remove any invalid characters
      const sanitizedQueries = response.data.map(query => ({
        ...query,
        query: query.query ? String(query.query).replace(/[\u0000-\u001F\u007F-\u009F]/g, '') : 'Unknown query',
        timestamp: query.timestamp || new Date().toISOString(),
        status: query.status || 'unknown',
        provider: query.provider ? String(query.provider).replace(/[\u0000-\u001F\u007F-\u009F]/g, '') : 'unknown'
      }));
      
      setQueries(sanitizedQueries);
      setError(null);
    } catch (error) {
      console.error('Error fetching queries:', error);
      setError('Failed to fetch queries. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteQuery = async (id) => {
    if (window.confirm("Are you sure you want to delete this search?")) {
      try {
        await api.delete(`/queries/${id}`);
        // Refresh the list after deletion
        fetchQueries();
        toast({
          title: "Success",
          description: "Search deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error deleting query:", error);
        toast({
          title: "Error",
          description: "Failed to delete search",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
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
        {status || 'unknown'}
      </Badge>
    );
  };
  
  const formatTimeAgo = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      console.error('Invalid date format:', timestamp);
      return 'Unknown time';
    }
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
                  <Th>Actions</Th>
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
                        {query.query ? String(query.query).substring(0, 50) : 'Unknown query'}
                        {query.query && query.query.length > 50 ? '...' : ''}
                      </Link>
                    </Td>
                    <Td>
                      {formatTimeAgo(query.timestamp)}
                    </Td>
                    <Td>{query.num_papers || 0}</Td>
                    <Td>{query.provider || 'unknown'}</Td>
                    <Td>{getStatusBadge(query.status)}</Td>
                    <Td>
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        leftIcon={<FaTrash />}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteQuery(query.id);
                        }}
                      >
                        Delete
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
        
        {/* Refresh button */}
        <Box mt={4}>
          <Button 
            onClick={fetchQueries}
            colorScheme="brand"
            isLoading={isLoading}
          >
            Refresh Queries
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

export default QueryListPage;