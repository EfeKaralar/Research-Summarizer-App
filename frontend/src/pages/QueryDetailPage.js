// src/pages/QueryDetailPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
  Divider,
  useToast,
  Icon,
  useClipboard,
  IconButton
} from '@chakra-ui/react';
import { FaArrowLeft, FaChartBar, FaClipboard, FaClipboardCheck, FaSyncAlt } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';
import { formatDistanceToNow } from 'date-fns';

const QueryDetailPage = () => {
  const { id } = useParams();
  const toast = useToast();
  
  const [query, setQuery] = useState(null);
  const [summaries, setSummaries] = useState([]);
  const [analysis, setAnalysis] = useState({ status: 'pending', content: null });
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  
  // Function to fetch data
  const fetchData = useCallback(async () => {
    // Only proceed if not already loading
    if (!isLoading) {
      setIsLoading(true);
      try {
        // Fetch query details
        const queryResponse = await api.get(`/queries/${id}`);
        
        // Only update state if status has changed
        if (!query || query.status !== queryResponse.data.status) {
          setQuery(queryResponse.data);
          
          // Only fetch summaries if status is completed
          if (queryResponse.data.status === 'completed') {
            const summariesResponse = await api.get(`/queries/${id}/summaries`);
            setSummaries(summariesResponse.data);
            
            // Fetch analysis if available
            const analysisResponse = await api.get(`/analysis/${id}`);
            setAnalysis(analysisResponse.data);
          }
        }
        
        setError(null);
      } catch (error) {
        setError('Failed to load data. Please try again later.');
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [id, query, isLoading]);
  
  // Initial data load
  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, []);
  
  // Polling for updates
  useEffect(() => {
    // Only set up polling if we're in a processing state
    let intervalId;
    if (query && ['processing', 'analyzing'].includes(query.status)) {
      intervalId = setInterval(() => {
        // Don't fetch if already loading
        if (!isLoading) {
          fetchData();
        }
      }, 10000); // Check every 10 seconds
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchData, query, isLoading]);
  
  // Function to start analysis
  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      await api.post('/analyze', { session_id: id });
      toast({
        title: 'Analysis Started',
        description: 'The comparative analysis is now being generated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Refresh data after starting analysis
      fetchData();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to start analysis',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Status badge component
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
  
  // Conditional rendering for initial loading state
  if (isLoading && !query) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="center" justify="center" minH="50vh">
          <Spinner size="xl" color="brand.500" thickness="4px" />
          <Text>Loading research data...</Text>
        </VStack>
      </Container>
    );
  }
  
  // Conditional rendering for error state
  if (error || !query) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          {error || 'Query not found'}
        </Alert>
        <Button
          as={RouterLink}
          to="/queries"
          leftIcon={<FaArrowLeft />}
          mt={4}
        >
          Back to Queries
        </Button>
      </Container>
    );
  }
  
  // Conditional rendering for processing state
  if (query && ['processing', 'analyzing'].includes(query.status)) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between">
            <Button
              as={RouterLink}
              to="/queries"
              leftIcon={<FaArrowLeft />}
              variant="outline"
            >
              Back to Queries
            </Button>
            <Heading as="h1" size="xl" color="brand.700">
              Processing Search
            </Heading>
            <Box w="100px" />
          </HStack>
          
          <Card variant="outline" p={6}>
            <CardBody>
              <VStack spacing={6} align="center" py={10}>
                <Spinner size="xl" thickness="4px" color="brand.500" />
                <Text fontSize="lg">
                  {query.status === 'processing' 
                    ? `Processing search query: "${query.query}"`
                    : 'Generating comparative analysis...'}
                </Text>
                <Text color="gray.500">
                  This may take several minutes depending on the number of papers.
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    );
  }
  
  // Main render for completed state
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <HStack justify="space-between">
          <Button
            as={RouterLink}
            to="/queries"
            leftIcon={<FaArrowLeft />}
            variant="outline"
          >
            Back to Queries
          </Button>
          <Box>
            <Heading as="h1" size="xl" color="brand.700">
              Research Summary
            </Heading>
            <Text fontSize="md" color="gray.500" textAlign="center">
              {formatDistanceToNow(new Date(query.timestamp), { addSuffix: true })}
            </Text>
          </Box>
          <IconButton
            icon={<FaSyncAlt />}
            aria-label="Refresh data"
            onClick={() => {
              if (!isLoading) {
                fetchData();
              }
            }}
            isLoading={isLoading}
          />
        </HStack>
        
        {/* Query Info Card */}
        <Card variant="outline">
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box>
                <Text fontWeight="bold" color="gray.500">Search Query</Text>
                <Text fontSize="lg">{query.query}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" color="gray.500">Details</Text>
                <HStack spacing={4} wrap="wrap">
                  <Text>Status: {getStatusBadge(query.status)}</Text>
                  <Text>Papers: {query.num_papers}</Text>
                  <Text>Provider: {query.provider}</Text>
                </HStack>
              </Box>
            </SimpleGrid>
            
            {query.status === 'completed' && analysis.status === 'pending' && (
              <Button
                mt={4}
                colorScheme="brand"
                leftIcon={<FaChartBar />}
                onClick={handleStartAnalysis}
                isLoading={isAnalyzing}
              >
                Generate Comparative Analysis
              </Button>
            )}
          </CardBody>
        </Card>
        
        {/* Content Tabs */}
        {query.status === 'completed' && (
          <Tabs variant="enclosed" colorScheme="brand">
            <TabList>
              <Tab>Paper Summaries ({summaries.length})</Tab>
              <Tab>Comparative Analysis</Tab>
            </TabList>
            
            <TabPanels>
              {/* Paper Summaries Tab */}
              <TabPanel p={0} pt={4}>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                  {summaries.map((summary) => (
                    <SummaryCard key={summary.id} summary={summary} />
                  ))}
                </SimpleGrid>
              </TabPanel>
              
              {/* Comparative Analysis Tab */}
              <TabPanel p={0} pt={4}>
                {analysis.status === 'completed' ? (
                  <MarkdownCard 
                    title="Comparative Analysis" 
                    content={analysis.content} 
                  />
                ) : (
                  <Card variant="outline">
                    <CardBody>
                      <VStack spacing={4} align="center" py={8}>
                        {analysis.status === 'pending' ? (
                          <>
                            <Text>Analysis has not been generated yet.</Text>
                            <Button
                              colorScheme="brand"
                              leftIcon={<FaChartBar />}
                              onClick={handleStartAnalysis}
                              isLoading={isAnalyzing}
                            >
                              Generate Comparative Analysis
                            </Button>
                          </>
                        ) : (
                          <>
                            <Spinner size="xl" color="brand.500" />
                            <Text>Generating comparative analysis...</Text>
                          </>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        )}
      </VStack>
    </Container>
  );
};

// Summary Card Component
const SummaryCard = ({ summary }) => {
  const { hasCopied, onCopy } = useClipboard(summary.content);
  
  return (
    <Card variant="outline" size="sm">
      <CardHeader pb={0}>
        <Heading as="h3" size="md" color="brand.700">
          {summary.title}
        </Heading>
        <Text fontSize="sm" color="gray.500">
          {summary.authors}
        </Text>
      </CardHeader>
      <CardBody>
        <Box maxH="300px" overflowY="auto" pr={2}>
          <ReactMarkdown>{summary.content}</ReactMarkdown>
        </Box>
        <Divider my={4} />
        <Button
          size="sm"
          leftIcon={hasCopied ? <FaClipboardCheck /> : <FaClipboard />}
          onClick={onCopy}
          variant="outline"
        >
          {hasCopied ? 'Copied' : 'Copy Summary'}
        </Button>
      </CardBody>
    </Card>
  );
};

// Markdown Card Component
const MarkdownCard = ({ title, content }) => {
  const { hasCopied, onCopy } = useClipboard(content);
  
  return (
    <Card variant="outline">
      <CardHeader pb={0}>
        <HStack justify="space-between">
          <Heading as="h3" size="md" color="brand.700">
            {title}
          </Heading>
          <Button
            size="sm"
            leftIcon={hasCopied ? <FaClipboardCheck /> : <FaClipboard />}
            onClick={onCopy}
            variant="outline"
          >
            {hasCopied ? 'Copied' : 'Copy Content'}
          </Button>
        </HStack>
      </CardHeader>
      <CardBody>
        <Box>
          <ReactMarkdown>{content}</ReactMarkdown>
        </Box>
      </CardBody>
    </Card>
  );
};

export default QueryDetailPage;