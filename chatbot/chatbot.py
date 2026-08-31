from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Annotated
import os
from dotenv import load_dotenv

load_dotenv()
from langchain_core.messages import BaseMessage, HumanMessage
from langchain_groq import ChatGroq
from langgraph.graph.message import add_messages

class ChatState(TypedDict) :
    messages : Annotated[list[BaseMessage],add_messages]

graph = StateGraph(ChatState)

llm = ChatGroq(model="openai/gpt-oss-20b")
def chat_node(state:ChatState):
    #take user query from message
    messages = state['messages']
    #call llm
    response = llm.invoke(messages)
    return {"messages": [response]}


#add node
graph.add_node('chat_node',chat_node)

#ADD Edge
graph.add_edge(START,'chat_node')
graph.add_edge('chat_node',END)
chatbot = graph.compile()


intialState = {"messages": [HumanMessage(content='What is the capital of india')]}
result= chatbot.invoke(intialState)
print(result['messages'][-1].content)


while True :
    user_message = input('Type Here : ')
    print(f'You: {user_message}')

    if user_message.strip().lower() in ['exit','quit']:
        print("Chatbot Terminated")
        break

    intialState = {"messages": [HumanMessage(content=user_message)]}
    result= chatbot.invoke(intialState)
    print(result['messages'][-1].content)
    