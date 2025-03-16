// src/pages/HomePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  useToast,
  Card,
  CardBody,
  Image,
  SimpleGrid,
  Icon,
  Divider
} from '@chakra-ui/react';
import { FaSearch, FaRobot, FaBook, FaChartBar } from 'react-icons/fa';
import api from '../services/api';

const HomePage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    query: '',
    numResults: 3,
    sortByDate: false,
    provider: 'deepseek',
    fullText: true
  });
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };
  
  const handleNumberChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.query.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a search query',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await api.post('/search', {
        query: formData.query,
        num_results: parseInt(formData.numResults),
        sort_by_date: formData.sortByDate,
        provider: formData.provider,
        full_text: formData.fullText
      });
      
      toast({
        title: 'Success',
        description: 'Your search has been submitted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Redirect to the query details page
      navigate(`/queries/${response.data.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'An error occurred while submitting your search',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={10} align="stretch">
        {/* Hero Section */}
        <Box 
          textAlign="center" 
          py={16} 
          px={8} 
          bg="paper.50" 
          borderRadius="xl" 
          boxShadow="sm"
        >
          <Heading as="h1" size="2xl" mb={6} color="brand.700">
            Research Paper Summarizer
          </Heading>
          <Text fontSize="xl" maxW="container.md" mx="auto" color="gray.600">
            Discover, summarize, and analyze scientific literature using AI. 
            Get comprehensive summaries and insights from academic papers in seconds.
          </Text>
        </Box>
        
        {/* Search Form */}
        <Card variant="outline" p={6}>
          <CardBody>
            <Heading as="h2" size="lg" mb={6} color="brand.600">
              Search for Papers
            </Heading>
            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Search Query</FormLabel>
                  <Input 
                    name="query" 
                    placeholder="e.g., quantum computing, author:Geoffrey Hinton" 
                    value={formData.query} 
                    onChange={handleInputChange}
                  />
                </FormControl>
                
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                  <FormControl>
                    <FormLabel>Number of Results</FormLabel>
                    <NumberInput 
                      min={1} 
                      max={20} 
                      value={formData.numResults} 
                      onChange={(value) => handleNumberChange('numResults', value)}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>LLM Provider</FormLabel>
                    <Select 
                      name="provider" 
                      value={formData.provider} 
                      onChange={handleInputChange}
                    >
                      <option value="deepseek">DeepSeek</option>
                      <option value="anthropic">Anthropic (Claude)</option>
                      <option value="openai">OpenAI (GPT)</option>
                    </Select>
                  </FormControl>
                  
                  <VStack spacing={4} align="stretch">
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="sortByDate" mb="0">
                        Sort by Date (Newest First)
                      </FormLabel>
                      <Switch 
                        id="sortByDate" 
                        name="sortByDate" 
                        isChecked={formData.sortByDate} 
                        onChange={handleSwitchChange} 
                        colorScheme="brand"
                      />
                    </FormControl>
                    
                    <FormControl display="flex" alignItems="center">
                      <FormLabel htmlFor="fullText" mb="0">
                        Use Full Text Analysis
                      </FormLabel>
                      <Switch 
                        id="fullText" 
                        name="fullText" 
                        isChecked={formData.fullText} 
                        onChange={handleSwitchChange} 
                        colorScheme="brand"
                      />
                    </FormControl>
                  </VStack>
                </SimpleGrid>
                
                <Button 
                  type="submit" 
                  colorScheme="brand" 
                  size="lg" 
                  isLoading={isLoading} 
                  leftIcon={<FaSearch />}
                >
                  Search Papers
                </Button>
              </VStack>
            </form>
          </CardBody>
        </Card>
        
        {/* Features Section */}
        <Box py={10}>
          <Heading as="h2" size="xl" mb={8} textAlign="center" color="brand.700">
            Key Features
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            <FeatureCard 
              icon={FaSearch} 
              title="Smart Discovery" 
              description="Find relevant papers from arXiv based on topic, author, or keywords" 
            />
            <FeatureCard 
              icon={FaRobot} 
              title="AI Summarization" 
              description="Generate structured summaries with key findings, methodology, and implications" 
            />
            <FeatureCard 
              icon={FaChartBar} 
              title="Comparative Analysis" 
              description="Understand connections between papers and identify research trends" 
            />
          </SimpleGrid>
        </Box>
        
        {/* Previous Searches */}
        <Box textAlign="center" py={8}>
          <Button 
            colorScheme="brand" 
            variant="outline" 
            size="lg" 
            onClick={() => navigate('/queries')}
          >
            View Previous Searches
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => {
  return (
    <Card h="100%" variant="outline" p={5} borderRadius="lg" boxShadow="sm">
      <CardBody>
        <VStack spacing={4}>
          <Icon as={icon} boxSize={10} color="brand.500" />
          <Heading as="h3" size="md" textAlign="center" color="brand.700">
            {title}
          </Heading>
          <Text textAlign="center" color="gray.600">
            {description}
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default HomePage;