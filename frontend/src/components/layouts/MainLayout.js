import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Link,
  Text,
  useDisclosure,
  VStack,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Container,
  Heading,
  Button,
  useColorModeValue,
  Image
} from '@chakra-ui/react';
import { FaBars, FaGithub } from 'react-icons/fa';

const MainLayout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box minH="100vh" bg="paper.100">
      {/* Navigation */}
      <Box 
        as="nav" 
        position="sticky" 
        top={0} 
        zIndex={10}
        bg={bgColor} 
        boxShadow="sm"
        borderBottom="1px"
        borderColor={borderColor}
      >
        <Container maxW="container.xl" py={4}>
          <Flex justify="space-between" align="center">
            {/* Logo and Title */}
            <HStack spacing={3} as={RouterLink} to="/" _hover={{ textDecoration: 'none' }}>
              <Box 
                bg="brand.600" 
                color="white" 
                p={2} 
                borderRadius="md"
                fontWeight="bold"
                fontSize="xl"
              >
                RS
              </Box>
              <Heading as="h1" size="md" display={{ base: 'none', md: 'block' }}>
                Research Summarizer
              </Heading>
            </HStack>
            
            {/* Desktop Navigation */}
            <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
              <Link as={RouterLink} to="/" fontWeight="medium">Home</Link>
              <Link as={RouterLink} to="/queries" fontWeight="medium">My Searches</Link>
              <Button 
                as="a" 
                href="https://github.com/EfeKaralar/Summarize-Research" 
                target="_blank"
                leftIcon={<FaGithub />}
                variant="outline"
                size="sm"
              >
                GitHub
              </Button>
            </HStack>
            
            {/* Mobile menu button */}
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              onClick={onOpen}
              icon={<FaBars />}
              aria-label="Open menu"
              variant="ghost"
            />
          </Flex>
        </Container>
      </Box>
      
      {/* Mobile Navigation Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align="stretch" mt={4}>
              <Link as={RouterLink} to="/" fontWeight="medium" onClick={onClose}>Home</Link>
              <Link as={RouterLink} to="/queries" fontWeight="medium" onClick={onClose}>My Searches</Link>
              <Button 
                as="a" 
                href="https://github.com/EfeKaralar/Summarize-Research" 
                target="_blank"
                leftIcon={<FaGithub />}
                variant="outline"
                size="sm"
              >
                GitHub
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      
      {/* Main Content */}
      <Box as="main">
        {children}
      </Box>
      
      {/* Footer */}
      <Box 
        as="footer" 
        py={8} 
        mt={10}
        bg={bgColor} 
        borderTop="1px"
        borderColor={borderColor}
      >
        <Container maxW="container.xl">
          <Flex 
            direction={{ base: 'column', md: 'row' }} 
            justify="space-between" 
            align="center"
          >
            <VStack align={{ base: 'center', md: 'start' }} mb={{ base: 4, md: 0 }}>
              <Heading as="h2" size="md" color="brand.700">
                Research Summarizer
              </Heading>
              <Text color="gray.500">
                AI-powered research paper discovery and analysis
              </Text>
            </VStack>
            <HStack spacing={6}>
              <Button 
                as="a" 
                href="https://github.com/EfeKaralar/Summarize-Research" 
                target="_blank"
                leftIcon={<FaGithub />}
                variant="ghost"
                size="sm"
              >
                GitHub
              </Button>
            </HStack>
          </Flex>
          <Text textAlign="center" fontSize="sm" color="gray.500" mt={8}>
            © {new Date().getFullYear()} Research Summarizer | research-summarizer.xyz
          </Text>
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;