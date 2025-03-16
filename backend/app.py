# app.py - Main FastAPI application
from fastapi import FastAPI, BackgroundTasks, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import datetime
import uuid
from database import get_db, SessionLocal
from models import Query, Summary
import summarizer_integration

app = FastAPI(
    title="Research Paper Summarizer API",
    description="API for searching, summarizing, and analyzing research papers",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class SearchRequest(BaseModel):
    query: str
    num_results: int = 3
    sort_by_date: bool = False
    provider: str = "deepseek"
    full_text: bool = True

class AnalyzeRequest(BaseModel):
    session_id: str

class QueryResponse(BaseModel):
    id: str
    query: str
    timestamp: str
    status: str
    num_papers: int
    provider: str

# Endpoints
@app.get("/api/queries", response_model=List[QueryResponse])
def get_queries(db: SessionLocal = Depends(get_db)):
    """Get all past queries"""
    queries = db.query(Query).order_by(Query.timestamp.desc()).all()
    return queries

@app.post("/api/search", response_model=QueryResponse)
async def search_papers(request: SearchRequest, background_tasks: BackgroundTasks, db: SessionLocal = Depends(get_db)):
    """Start a new search query"""
    session_id = str(uuid.uuid4())
    timestamp = datetime.datetime.now().isoformat()
    
    # Create new query record
    new_query = Query(
        id=session_id,
        query=request.query,
        timestamp=timestamp,
        status="processing",
        num_papers=request.num_results,
        provider=request.provider
    )
    db.add(new_query)
    db.commit()
    
    # Run search and summarization in background
    background_tasks.add_task(
        summarizer_integration.run_search,
        session_id=session_id,
        query=request.query,
        num_results=request.num_results,
        sort_by_date=request.sort_by_date,
        provider=request.provider,
        full_text=request.full_text,
        db=db
    )
    
    return new_query

@app.get("/api/queries/{session_id}", response_model=QueryResponse)
def get_query(session_id: str, db: SessionLocal = Depends(get_db)):
    """Get details for a specific query"""
    query = db.query(Query).filter(Query.id == session_id).first()
    if not query:
        raise HTTPException(status_code=404, detail="Query not found")
    return query

@app.get("/api/queries/{session_id}/summaries")
def get_summaries(session_id: str, db: SessionLocal = Depends(get_db)):
    """Get summaries for a specific query"""
    summaries = db.query(Summary).filter(Summary.query_id == session_id).all()
    return summaries

@app.post("/api/analyze")
def analyze_papers(request: AnalyzeRequest, background_tasks: BackgroundTasks, db: SessionLocal = Depends(get_db)):
    """Generate comparative analysis for papers in a session"""
    query = db.query(Query).filter(Query.id == request.session_id).first()
    if not query:
        raise HTTPException(status_code=404, detail="Query not found")
    
    # Update query status
    query.status = "analyzing"
    db.commit()
    
    # Run analysis in background
    background_tasks.add_task(
        summarizer_integration.run_analysis,
        session_id=request.session_id,
        db=db
    )
    
    return {"message": "Analysis started", "session_id": request.session_id}

@app.get("/api/analysis/{session_id}")
def get_analysis(session_id: str, db: SessionLocal = Depends(get_db)):
    """Get comparative analysis for a specific session"""
    query = db.query(Query).filter(Query.id == session_id).first()
    if not query:
        raise HTTPException(status_code=404, detail="Query not found")
    
    # Logic to retrieve analysis content
    analysis_path = os.path.join("summaries", session_id, "_comparative_analysis.md")
    if not os.path.exists(analysis_path):
        return {"status": "pending"}
    
    with open(analysis_path, "r") as f:
        content = f.read()
    
    return {"status": "completed", "content": content}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)