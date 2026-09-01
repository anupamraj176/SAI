from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Annotated
import os
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
from dotenv import load_dotenv

load_dotenv()
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from langchain_groq import ChatGroq
from langgraph.graph.message import add_messages
from langgraph.checkpoint.mongodb import MongoDBSaver
from pymongo import MongoClient

class ChatState(TypedDict) :
    messages : Annotated[list[BaseMessage],add_messages]

# Connect to MongoDB using the URI from your .env
mongo_client = MongoClient(os.environ["MONGODB_URL"])

# 5 days * 24 hours * 60 minutes * 60 seconds
FIVE_DAYS_IN_SECONDS = 5 * 24 * 60 * 60

# Use MongoDB to save the state, and set a TTL of 5 days so it automatically deletes old history
checkpointer = MongoDBSaver(mongo_client, db_name="langgraph_chatbot", ttl=FIVE_DAYS_IN_SECONDS)

graph = StateGraph(ChatState)

llm = ChatGroq(model="openai/gpt-oss-20b", streaming=True)
def chat_node(state:ChatState):
   #.Take the conversion history from the state
   messages = state["messages"]
   #define the farmer persona using a systemmessage
   farmer_instructions = SystemMessage(
        content="You are CropSense AI, an expert agricultural advisor and farmer in India. "
                "Your job is to help farmers with crop management, pest control, and farming techniques. "
                "Always speak simply, practically, and politely. "
                "If someone asks you about something not related to farming (like coding or movies), "
                "politely remind them that you are a farming assistant."
   )

   #combine the instruction with the history 
   #the ai must read the instruction first,so we put it at the front of the list 
   messages_with_persona = [farmer_instructions] + messages
   
   #call the llm with our new persona-injected messages 
   response=llm.invoke(messages_with_persona)
   return{"messages":[response]}


#add node
graph.add_node('chat_node',chat_node)

#ADD Edge
graph.add_edge(START,'chat_node')
graph.add_edge('chat_node',END)
chatbot = graph.compile(checkpointer=checkpointer)


thread_id = '2'

print("="*50)
print("CropSense AI: Namaste! I am CropSense AI, your expert agricultural assistant.")
print("CropSense AI: You can ask me about crop management, weather impacts, or pest control.")
print("CropSense AI: (Type 'exit' or 'quit' to close the chat)")
print("="*50)

while True :
    user_message = input('Type Here : ')
    print(f'You: {user_message}')

    if user_message.strip().lower() in ['exit','quit']:
        print("Chatbot Terminated")
        break
    
    config = {'configurable' : {'thread_id' : thread_id}}
    intialState = {"messages": [HumanMessage(content=user_message)]}
    
    print("AI: ", end="", flush=True)
    for msg, metadata in chatbot.stream(intialState, config=config, stream_mode="messages"):
        if msg.content:
            print(msg.content, end="", flush=True)
    print() # print a newline when it finishes