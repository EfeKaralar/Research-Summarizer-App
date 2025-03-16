# Research Summarizer

A modern web application for AI-powered research paper discovery, summarization, and analysis.

## Overview

Research Summarizer is a comprehensive tool designed for researchers, academics, and knowledge workers who need to efficiently process and understand scientific literature. The application fetches research papers from arXiv based on search criteria, generates AI-powered summaries, and provides insightful comparative analysis between related papers.

The platform consists of a Python backend that handles the paper processing using various LLM providers (DeepSeek, Anthropic's Claude, or OpenAI's GPT), and a modern React frontend that delivers a clean, intuitive user interface.

## Features

- **Automated Paper Discovery**: Search arXiv by topic, keyword, or author
- **AI-Powered Summarization**: Generate structured summaries with key findings, methodology, and implications
- **Comparative Analysis**: Understand connections between papers in a research area
- **Multiple LLM Support**: Use Claude, GPT, or DeepSeek models for summarization
- **Search History**: Track past searches and revisit results
- **Clean, Modern UI**: Intuitive interface built with React and Chakra UI

## How to Use

### Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/research-summarizer.git
   cd research-summarizer
   ```

2. Set up the backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   ```

4. Set your API key as an environment variable:
   ```bash
   # In backend directory
   export API_KEY="your_api_key_here"
   export LLM_PROVIDER="deepseek"  # or "anthropic" or "openai"
   ```

5. Start the backend server:
   ```bash
   # In backend directory
   uvicorn app:app --reload --port 8000
   ```

6. Start the frontend development server:
   ```bash
   # In frontend directory
   npm start
   ```

7. Access the application at http://localhost:3000

### Using the Application

1. **Submit a Search Query**:
   - Enter your search query on the homepage (e.g., "quantum computing", "author:Geoffrey Hinton")
   - Select the number of papers to retrieve
   - Choose your preferred LLM provider
   - Toggle options like sorting by date or using full-text analysis
   - Click "Search Papers" to submit

2. **View Paper Summaries**:
   - Once processing is complete, the application displays summaries for each paper
   - Each summary includes title, authors, key findings, methodology, and implications
   - Use the copy button to easily save summaries

3. **Generate Comparative Analysis**:
   - Click the "Generate Comparative Analysis" button to create connections between papers
   - The analysis highlights similarities, differences, and relationships across papers

4. **Review Past Searches**:
   - Navigate to "My Searches" to see all previous queries
   - Click on any past query to view its results

## Technologies Used

### Backend
- **FastAPI**: High-performance API framework for Python
- **SQLAlchemy**: SQL toolkit and ORM
- **arXiv API**: For fetching research paper metadata and PDFs
- **LLM APIs**: Integration with DeepSeek, Anthropic Claude, and OpenAI GPT
- **PyPDF2**: For processing PDF documents
- **SQLite/PostgreSQL**: Database for storing queries and summaries

### Frontend
- **React**: JavaScript library for building user interfaces
- **Chakra UI**: Component library for creating a modern, accessible UI
- **React Router**: For navigation within the application
- **Axios**: For API communication
- **date-fns**: For date formatting and manipulation
- **React Markdown**: For rendering Markdown content

### DevOps
- **Docker**: For containerization (production deployment)
- **Docker Compose**: For multi-container deployment
- **Nginx**: For serving the frontend and as a reverse proxy

## Benefits

- **Time Efficiency**: Quickly absorb the key points from multiple papers without reading every word
- **Better Research Understanding**: Compare approaches, methodologies, and findings across papers
- **Discover Connections**: Identify relationships between papers that might not be immediately obvious
- **Enhanced Literature Reviews**: Create comprehensive literature reviews with less manual work
- **Stay Up-to-Date**: Efficiently process the latest research in your field
- **Improved Research Communication**: Use summaries to better communicate research findings to colleagues and collaborators
- **Reduced Information Overload**: Filter and process large volumes of academic content more effectively

## Improvements
- [ ] Main Page with weekly summarized research
  - For example: "What's new in Computer Vision? (March 2025)" or "Top 10 Most Important AI Researchs this week!"
- [ ] Better UI/UX
  - [ ] Fix refresh issue on the query website
  - [ ] Prettier looking MD results from queries
  - [ ] Overall prettier design
- [ ] Log in feature
- [ ] Moneytization feature
- [ ] Anti Spam feature
  - [ ] Currently done by deleting the API key when not in use/testing 
