import os
import subprocess
import json
from models import Query, Summary
import shutil
import uuid

def run_search(session_id, query, num_results, sort_by_date, provider, full_text, db):
    """Run the search and summarization process"""
    try:
        # Create output directory based on session_id
        output_dir = os.path.join("summaries", session_id)
        os.makedirs(output_dir, exist_ok=True)


        # Print the current working directory
        print(f"Current working directory: {os.getcwd()}")

        # Check if the script exists
        script_path = "research_summarizer.py"
        if not os.path.exists(script_path):
            print(f"ERROR: Script not found at {script_path}")
            script_path = os.path.join(os.getcwd(), "research_summarizer.py")
            if os.path.exists(script_path):
                print(f"Found script at {script_path}")
            else:
                print(f"Still can't find script at {script_path}")
        

        # Build command to run your existing Python script
        cmd = [
            "python", "research_summarizer.py", "search", query,
            "-n", str(num_results),
            "-o", output_dir,
            "-p", provider
        ]
        
        if sort_by_date:
            cmd.append("-s")
        
        if full_text:
            cmd.append("-f")

        # Get API key from environment variable
        api_key = os.environ.get("API_KEY")
        if api_key:
            cmd.extend(["-a", api_key])     

        print(f"Running command: {' '.join(cmd)}")  
        
        # Run the command
        process = subprocess.Popen(
            cmd, 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE
        )
        stdout, stderr = process.communicate()

        # Decode the bytes to text
        stdout_text=stdout.decode('utf-8')
        stderr_text=stderr.decode('utf-8')

        print(f"Command output: {stdout_text}")
        print(f"Command error: {stderr_text}")

        if process.returncode != 0:
            # Handle error
            print(f"Process failed with return code {process.returncode}")
            query_obj = db.query(Query).filter(Query.id == session_id).first()
            query_obj.status = "failed"
            db.commit()
            return
        
        # Process completed successfully
        query_obj = db.query(Query).filter(Query.id == session_id).first()
        query_obj.status = "completed"

        print(f"Found {len(os.listdir(output_dir))} files in output directory")
        print(f"Files: {os.listdir(output_dir)}")


        # Scan the output directory for summaries and add to database
        for filename in os.listdir(output_dir):
            if filename.startswith("_"):  # Skip session info and analysis files
                continue
                
            file_path = os.path.join(output_dir, filename)
            
            # Extract basic metadata from filename or content
            with open(file_path, "r") as f:
                content = f.read()
                
            # Parse the markdown to extract title, authors, etc.
            # This is a simplified version - you'd need more robust parsing
            title = content.split("\n")[0].replace("# ", "")
            authors_line = [line for line in content.split("\n") if line.startswith("**Authors:**")]
            authors = authors_line[0].replace("**Authors:**", "").strip() if authors_line else "Unknown"
            
            # Create summary record
            summary = Summary(
                id=str(uuid.uuid4()),
                query_id=session_id,
                title=title,
                authors=authors,
                file_path=file_path,
                content=content
            )
            db.add(summary)
            print(f"Added summary to database: {summary.id}")   
        
        db.commit()
        print("Database commit complete")

         # After successful execution, update to completed
        query_obj = db.query(Query).filter(Query.id == session_id).first()
        if query_obj:
            print(f"Updating query status to completed: {session_id}")
            query_obj.status = "completed"
            db.commit()
        else:
            print(f"ERROR: Could not find query with id: {session_id}")

    except Exception as e:
        # Handle any exceptions
        query_obj = db.query(Query).filter(Query.id == session_id).first()
        query_obj.status = "failed"
        db.commit()
        print(f"Error in search process: {str(e)}")

def run_analysis(session_id, db):
    """Run the comparative analysis process"""
    try:
        # Get the directory path
        dir_path = os.path.join("summaries", session_id)
        
        # Build command to run your existing analysis script
        cmd = [
            "python", "research_summarizer.py", "analyze", dir_path
        ]
        
        # Run the command
        process = subprocess.Popen(
            cmd, 
            stdout=subprocess.PIPE, 
            stderr=subprocess.PIPE
        )
        stdout, stderr = process.communicate()
        
        if process.returncode != 0:
            # Handle error
            query_obj = db.query(Query).filter(Query.id == session_id).first()
            query_obj.status = "failed"
            db.commit()
            return
        
        # Update query status
        query_obj = db.query(Query).filter(Query.id == session_id).first()
        query_obj.status = "completed"
        db.commit()
    except Exception as e:
        # Handle any exceptions
        query_obj = db.query(Query).filter(Query.id == session_id).first()
        query_obj.status = "failed"
        db.commit()
        print(f"Error in analysis process: {str(e)}")