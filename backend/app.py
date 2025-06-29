# app.py

from helper import downloadHuggingFaceEmbeddings # Only need embeddings for queries
from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from prompt import *       # Import system_prompt from prompt.py
import os


# Attain API Keys from .env and set them in environment variables
load_dotenv()
PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY')
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')

if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY not found in environment variables.")
if not GOOGLE_API_KEY:
     raise ValueError("GOOGLE_API_KEY not found in environment variables.")

#Load Embeddings from HuggingFace (Needed for querying the index)
print("Loading Embeddings model for querying...")
embeddings = downloadHuggingFaceEmbeddings()

# Initialize Pinecone Connection and Connect to Existing Index
print("Connecting to Pinecone index...")
index_name = "data-science-algo-bot"
try:
    # Use from_existing_index to connect to an index that should already be populated
    docsearch = PineconeVectorStore.from_existing_index(
        index_name=index_name,
        embedding=embeddings, 
        
    )
    print(f"Successfully connected to Pinecone index '{index_name}'.")

except Exception as e:
    print(f"Error connecting to Pinecone index '{index_name}': {e}")
    print("Ensure you have run store_index.py first to create and populate the index.")
    exit() # Exit the application if connection fails


# Document Retriever that accesses our Knowledge Base
print("Setting up retriever...")
retriever = docsearch.as_retriever(
    search_type='similarity',
    search_kwargs={'k':3}
)
print("Retriever ready.")


# Initialize LLM
print("Initializing LLM...")
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0.5,
)
print("LLM initialized.")


prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt), # system_prompt comes from prompt.py
        ("human", "{input}"),
    ]
)

# Initialize RAG Chain
print("Setting up RAG chain...")

question_answer_chain = create_stuff_documents_chain(llm, prompt)
rag_chain = create_retrieval_chain(retriever, question_answer_chain)
print("RAG chain ready.")


# --- Terminal Testing Block ---
if __name__ == '__main__':

    print("\n--- RAG Chain Terminal Test ---")
    print("Enter your queries below. Type 'quit' or press Ctrl+C to exit.")

    while True:
        try:
            user_input = input("Query: ")

            # Exit condition
            if user_input.lower() == 'quit':
                break

            if not user_input.strip():
                print("Please enter a query.")
                continue

            # Invoke the RAG chain
            print("Thinking...")
            response = rag_chain.invoke({"input": user_input})

            #print the response
            print("\n--- Response ---")
            print("Bot:", response.get("answer", "Sorry, I could not get a response."))

        except KeyboardInterrupt:
            # Handle Ctrl+C
            print("\nExiting terminal test.")
            break
        except Exception as e:
            # Handle other potential errors during inference
            print(f"\nAn error occurred: {e}")
            print("----------------\n")

