from sqlalchemy import Column, String, Integer, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database import Base

class Query(Base):
    __tablename__ = "queries"
    
    id = Column(String, primary_key=True)
    query = Column(String, nullable=False)
    timestamp = Column(String, nullable=False)
    status = Column(String, nullable=False)  # processing, completed, failed, analyzing
    num_papers = Column(Integer, nullable=False)
    provider = Column(String, nullable=False)
    
    summaries = relationship("Summary", back_populates="query")

class Summary(Base):
    __tablename__ = "summaries"
    
    id = Column(String, primary_key=True)
    query_id = Column(String, ForeignKey("queries.id"))
    title = Column(String, nullable=False)
    authors = Column(String, nullable=False)
    publication_date = Column(String)
    arxiv_id = Column(String)
    file_path = Column(String, nullable=False)
    content = Column(Text)
    
    query = relationship("Query", back_populates="summaries")
