from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import TypedDict, Annotated
import os
import sys
import io
import asyncio

# Fix for windows unicode errors
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from dotenv import load_dotenv
load_dotenv()

from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.mongodb import MongoDBSaver
from pymongo import MongoClient

# ---------------------------------------------------------
# 1. SETUP LANGGRAPH & MONGODB (Same as before)
# ---------------------------------------------------------
class ChatState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]

mongo_client = MongoClient(os.environ["MONGODB_URL"])
FIVE_DAYS_IN_SECONDS = 5 * 24 * 60 * 60
checkpointer = MongoDBSaver(mongo_client, db_name="langgraph_chatbot", ttl=FIVE_DAYS_IN_SECONDS)

graph = StateGraph(ChatState)
llm = ChatGroq(model="openai/gpt-oss-20b", streaming=True)

def chat_node(state: ChatState):
    messages = state["messages"]
    farmer_instructions = SystemMessage(
        content="You are CropSense AI, an expert agricultural advisor and farmer in India. "
                "Your job is to help farmers with crop management, pest control, and farming techniques. "
                "Always speak simply, practically, and politely. "
                "If someone asks you about something not related to farming (like coding or movies), "
                "politely remind them that you are a farming assistant."
    )
    messages_with_persona = [farmer_instructions] + messages
    response = llm.invoke(messages_with_persona)
    return {"messages": [response]}

graph.add_node('chat_node', chat_node)
graph.add_edge(START, 'chat_node')
graph.add_edge('chat_node', END)
chatbot = graph.compile(checkpointer=checkpointer)

# ---------------------------------------------------------
# 2. SETUP FASTAPI (The new web server part)
# ---------------------------------------------------------
app = FastAPI(title="CropSense AI API")

# Enable CORS so your React frontend can communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change this to your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the data format we expect from React
class ChatRequest(BaseModel):
    message: str
    thread_id: str

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    # Setup configuration with the user's specific thread_id
    config = {'configurable': {'thread_id': request.thread_id}}
    intialState = {"messages": [HumanMessage(content=request.message)]}
    
    # Process the message through our LangGraph chatbot
    result = chatbot.invoke(intialState, config=config)
    
    # Extract the final AI response
    ai_response = result['messages'][-1].content
    
    return {"response": ai_response}

import json

@app.post("/api/chat/stream")
async def chat_stream_endpoint(request: ChatRequest):
    config = {'configurable': {'thread_id': request.thread_id}}
    intialState = {"messages": [HumanMessage(content=request.message)]}
    
    async def event_generator():
        # Use astream to stream the response asynchronously
        async for msg, metadata in chatbot.astream(intialState, config=config, stream_mode="messages"):
            if msg.content:
                # Format as Server-Sent Events (SSE)
                yield f"data: {json.dumps({'content': msg.content})}\n\n"
                await asyncio.sleep(0.015) # Artificial delay so it types smoothly like ChatGPT!
                
    return StreamingResponse(event_generator(), media_type="text/event-stream")
