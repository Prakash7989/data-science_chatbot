# store_index.py

from helper import load_pdf_file, downloadHuggingFaceEmbeddings, text_split
from pinecone import Pinecone, ServerlessSpec
from langchain_pinecone import PineconeVectorStore
from dotenv import load_dotenv
import os
import time
from langchain_core.documents import Document
import traceback
import re
from tqdm import tqdm
from langchain_core.embeddings import Embeddings

# Load environment variables
load_dotenv()

# --- Configuration ---
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY not found in environment variables.")

DATA_DIRECTORY = 'Data/'
INDEX_NAME = "data-science-algo-bot"
EMBEDDING_DIMENSION = 1024
METRIC = "cosine"
CLOUD = "aws"
REGION = "us-east-1"

def contains_code(text: str) -> bool:
    """Check if text contains code-like patterns."""
    code_patterns = [
        r'def\s+\w+\s*\(', r'class\s+\w+', r'import\s+\w+', r'from\s+\w+\s+import',
        r'if\s+.*:', r'for\s+.*:', r'while\s+.*:', r'return\s+', r'print\s*\(',
        r'#.*', r'"""', r"'''", r'\.\w+\s*\(', r'=\s*[^=]', r'\[\s*\]', r'{\s*}', r'\(\s*\)'
    ]
    return any(re.search(pattern, text) for pattern in code_patterns)

# --- Load PDFs ---
print("\n=== Starting PDF Loading ===")
try:
    extracted_data = load_pdf_file(data=DATA_DIRECTORY)
    if not extracted_data:
        print("No documents loaded. Exiting.")
        exit()
    print(f"Loaded {len(extracted_data)} documents.")
except Exception as e:
    print("Error during PDF loading:", e)
    print(traceback.format_exc())
    exit()

# --- Text Splitting ---
print("\n=== Starting Text Splitting ===")
try:
    text_chunks = text_split(extracted_data)
    if not text_chunks:
        print("No text chunks created. Exiting.")
        exit()
    print(f"Created {len(text_chunks)} text chunks.")

    code_chunks = [(i, c) for i, c in enumerate(text_chunks) if contains_code(c.page_content)]
    print(f"Found {len(code_chunks)} code-containing chunks.")
except Exception as e:
    print("Error during text splitting:", e)
    print(traceback.format_exc())
    exit()

# --- Chunk Filtering ---
print("\n=== Filtering Chunks ===")
valid_text_chunks = []
chunk_contents = []
for i, chunk in enumerate(text_chunks):
    try:
        if not isinstance(chunk, Document) or not isinstance(chunk.page_content, str):
            continue
        content = chunk.page_content.strip()
        if not content:
            continue
        chunk_contents.append(content)
        valid_text_chunks.append(chunk)
    except Exception as e:
        print(f"Error processing chunk {i}: {e}")

print(f"Valid chunks: {len(valid_text_chunks)}")

if not valid_text_chunks:
    print("No valid text chunks. Exiting.")
    exit()

# --- Batched Embedding ---
def batch_embed_documents(texts, embedder, batch_size=64):
    all_embeddings = []
    for i in tqdm(range(0, len(texts), batch_size), desc="Embedding in batches"):
        batch = texts[i:i + batch_size]
        try:
            batch_embeddings = embedder.embed_documents(batch)
            all_embeddings.extend(batch_embeddings)
        except Exception as e:
            print(f"\nError embedding batch {i}-{i+batch_size}: {e}")
            continue
    return all_embeddings

print("\n=== Testing Embedding Model with Batched Embedding ===")
try:
    embeddings = downloadHuggingFaceEmbeddings()
    print(f"Embedding {len(chunk_contents)} chunks in batches...")
    test_embeddings_output = batch_embed_documents(chunk_contents, embeddings, batch_size=64)
    print(f"Embedded {len(test_embeddings_output)} chunks.")
    print(f"Embedding dimension: {len(test_embeddings_output[0])}")
except Exception as e:
    print("Error during embedding:", e)
    print(traceback.format_exc())
    exit()

# --- Custom Embedding Wrapper ---
class StaticEmbedding(Embeddings):
    def __init__(self, embeddings_list):
        self.embeddings_list = embeddings_list
        self.call_index = 0

    def embed_documents(self, texts):
        start = self.call_index
        end = start + len(texts)
        self.call_index = end
        return self.embeddings_list[start:end]

    def embed_query(self, text):
        raise NotImplementedError("embed_query not implemented for static embedding.")

static_embeddings = StaticEmbedding(test_embeddings_output)

# --- Pinecone Init ---
print("\n=== Initializing Pinecone ===")
try:
    pc = Pinecone(api_key=PINECONE_API_KEY)
    existing_indexes = [idx.name for idx in pc.list_indexes()]
    if INDEX_NAME not in existing_indexes:
        print(f"Creating index '{INDEX_NAME}'...")
        pc.create_index(
            name=INDEX_NAME,
            dimension=EMBEDDING_DIMENSION,
            metric=METRIC,
            spec=ServerlessSpec(cloud=CLOUD, region=REGION)
        )
        print("Waiting for index to initialize...")
        time.sleep(10)
    else:
        print(f"Index '{INDEX_NAME}' already exists.")
except Exception as e:
    print("Error initializing Pinecone:", e)
    print(traceback.format_exc())
    exit()

# --- Upload to Pinecone ---
print(f"\n=== Uploading {len(valid_text_chunks)} Chunks to Pinecone ===")
try:
    docsearch = PineconeVectorStore.from_documents(
        documents=valid_text_chunks,
        index_name=INDEX_NAME,
        embedding=static_embeddings
    )
    print("Upload complete. Vector index is ready.")
except Exception as e:
    print("Error uploading to Pinecone:", e)
    print(traceback.format_exc())
    exit()
