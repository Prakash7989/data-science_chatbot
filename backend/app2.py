# app.py

from flask import Flask, render_template, request, jsonify
from helper import downloadHuggingFaceEmbeddings # Assuming this is defined elsewhere
from langchain_pinecone import PineconeVectorStore
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
from prompt import system_prompt # Assuming this is defined elsewhere
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# Load API keys
load_dotenv()
PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY')
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')

if not PINECONE_API_KEY:
    raise ValueError("PINECONE_API_KEY not found in environment variables.")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in environment variables.")

# Load Embeddings
print("Loading Embeddings...")
try:
    embeddings = downloadHuggingFaceEmbeddings() # Assuming this function exists
    print("Embeddings loaded.")
except Exception as e:
    print(f"Error loading embeddings: {e}")
    exit()


# Connect to Pinecone index
index_name = "data-science-algo-bot" # Make sure this index exists and is populated
try:
    docsearch = PineconeVectorStore.from_existing_index(
        index_name=index_name,
        embedding=embeddings,
    )
    print(f"Connected to Pinecone index '{index_name}'.")
except Exception as e:
    print(f"Error connecting to Pinecone: {e}")
    # Depending on your setup, you might want to exit or handle this gracefully
    exit() # Exit if Pinecone connection fails

# Retriever
# search_kwargs={'k': 3} means it will retrieve the top 3 most similar documents
retriever = docsearch.as_retriever(search_type='similarity', search_kwargs={'k': 3})

# LLM
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", temperature=0.5)

# Prompt and Chain
# Ensure system_prompt is defined in prompt.py
try:
    from prompt import system_prompt
except ImportError:
    print("Error: prompt.py or system_prompt is not found.")
    # Define a default or exit
    system_prompt = "You are a helpful assistant."
    print("Using a default system prompt.")


prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{input}")
])

# Create the chain for answering questions based on retrieved documents
question_answer_chain = create_stuff_documents_chain(llm, prompt)

# Create the RAG chain that first retrieves, then answers
rag_chain = create_retrieval_chain(retriever, question_answer_chain)

# Flask Routes

@app.route("/")
def index():
    # You can add a simple landing page or redirect here if needed
    # For this example, the root just exists, the chat is via /chat POST
    return "Data Science Algo Bot API is running. Use the /chat endpoint."

@app.route("/chat", methods=["POST"])
def chat():
    # Use request.get_json() if sending JSON, request.form if sending FormData
    # Assuming frontend sends FormData with key 'msg'
    user_input = request.form.get("msg")

    if not user_input:
        # If msg is missing in form data, try getting it from JSON body
        try:
            json_data = request.get_json()
            if json_data and 'msg' in json_data:
                 user_input = json_data['msg']
        except Exception:
             pass # Ignore JSON parsing errors if not JSON

    if not user_input:
        return jsonify({"error": "No input provided. Please send 'msg' in form data or JSON body."}), 400

    print(f"Received message: {user_input}") # Log received message

    try:
        # Invoke the RAG chain with the user's input
        # The chain handles retrieval and generation
        response = rag_chain.invoke({"input": user_input})

        # The result from create_retrieval_chain is a dictionary
        # The final answer is typically in the 'answer' key
        answer = response.get("answer", "Sorry, I couldn't get a response from the model.")

        print(f"Generated response: {answer[:100]}...") # Log part of the response

        return jsonify({"answer": answer})

    except Exception as e:
        # Log the actual error on the server side
        print(f"An error occurred during RAG chain invocation: {e}")
        # Return a generic error to the user
        return jsonify({"error": "Something went wrong while processing your request."}), 500

if __name__ == "__main__":
    # Use a higher port like 5000 or 8080 to avoid permission issues below 1024
    # host="0.0.0.0" makes the server publicly accessible (useful in Docker/deployment)
    # debug=True enables auto-reloading and detailed error pages (turn off in production)
    app.run(host="0.0.0.0", port=8080, debug=True)