import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator, VideoCallButton, VoiceCallButton } from '@chatscope/chat-ui-kit-react';
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
const API_KEY = "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";
// "Explain things like you would to a 10 year old learning how to code."
const systemMessage = { //  Explain things like you're talking to a software professional with 5 years of experience.
  "role": "system", "content": "Explain things like you're talking to a software professional with 2 years of experience."
}

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    
    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) { // messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message}
    });


    // Get the request body set up with the model we plan to use
    // and the messages which we formatted above. We add a system message in the front to'
    // determine how we want chatGPT to act. 
    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,  // The system message DEFINES the logic of our chatGPT
        ...apiMessages // The messages from our chat with ChatGPT
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", 
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then( async (data) => {
      console.log(data)
      handleSpeakClick(data.choices[0].message.content);
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      }]);
      setIsTyping(false);
    });
  }

  const handleSpeakClick = (message) => {
    setIsAnimating(true);
    const speech = new SpeechSynthesisUtterance();
    speech.lang = 'en-EN';
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
  
    speech.addEventListener('end', () => {
      setIsAnimating(false);
    });
  
    window.speechSynthesis.speak(speech);
  };
  


  const AvatarTalking = () => {
  return isAnimating ?
      <div>
        <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
          <path d="M20,70 Q35,90 50,70 T80,70" stroke="#000000" strokeWidth="2" fill="none">
            <animate attributeName="stroke-dasharray" from="0,150" to="150,150" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="stroke-dashoffset" from="-150" to="0" dur="1.5s" repeatCount="indefinite" />
          </path>
          <circle cx="35" cy="50" r="5" fill="#000000">
            <animate attributeName="cy" values="50;55;50" dur="0.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="50" cy="50" r="5" fill="#000000">
            <animate attributeName="cy" values="50;60;50" dur="0.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="65" cy="50" r="5" fill="#000000">
            <animate attributeName="cy" values="50;55;50" dur="0.5s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    :       <div>
    <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="50" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
      <path d="M20,70 Q35,90 50,70 T80,70" stroke="#000000" strokeWidth="2" fill="none">
        <animate attributeName="stroke-dasharray" from="0,150" to="150,150" dur="1.5s" repeatCount="" />
        <animate attributeName="stroke-dashoffset" from="-150" to="0" dur="1.5s" repeatCount="" />
      </path>
      <circle cx="35" cy="50" r="5" fill="#000000">
        <animate attributeName="cy" values="50;55;50" dur="0.5s" repeatCount="" />
      </circle>
      <circle cx="50" cy="50" r="5" fill="#000000">
        <animate attributeName="cy" values="50;60;50" dur="0.5s" repeatCount="" />
      </circle>
      <circle cx="65" cy="50" r="5" fill="#000000">
        <animate attributeName="cy" values="50;55;50" dur="0.5s" repeatCount="" />
      </circle>
    </svg>
  </div>
  };
  
  function speechToText() {
    const recognition = new window.webkitSpeechRecognition();
  
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      console.log(text);
      var contentEditor = document.querySelector('.cs-message-input__content-editor');
      contentEditor.textContent = text;
      
    };
  
    recognition.start();
  }
  
  
  return (
    <div className="App">
      <AvatarTalking></AvatarTalking>
      <div style={{ position:"relative", height: "800px", width: "700px"  }}>
        <MainContainer>
          <ChatContainer>       
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null}
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />
              })}

            </MessageList>
            <MessageInput attachButton={false} placeholder="Type message here" onSend={handleSend} />        
          </ChatContainer>
              <div style={{ position: "absolute", bottom: "50px ", right: "0",  zIndex: "1"}}>
              <VoiceCallButton onClick={speechToText} border />
              </div>
        </MainContainer>
      </div>
      
    </div>
  )
}

export default App
