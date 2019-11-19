import React from "react";
import "./App.css";
import Login from "./Login";
import ChatPage from "./ChatPage";
import openSocket from 'socket.io-client';


class App extends React.Component {
  
  
  constructor(props) {
    
    super(props);
    
    this.state = {
      chatItems: [],
      user: {
        name: "defaultNameDoNotUse"
      }
    };

    //here is where the socket is connected in the app, also listeners are defined
    this.socket = openSocket('http://localhost:17477');
    this.socket.on('incoming-message',(newMsg) =>{
      let chatItems = [...this.state.chatItems]
      chatItems.push(newMsg)
      this.setState({chatItems})
    });
  }

  

  render() {
    // the app will render either the login page or the chatroom page depending on
    // presence of user info 
    return (
      <div className="App">
        {this.state.user.name === "defaultNameDoNotUse" ? (
          <Login setUser={this.setUser} />
        ) : (
          <ChatPage chatItems={this.state.chatItems}
                    sendMessage={this.sendMessage} 
                    logout={this.logout}  
                      />
        )}
      </div>
    );
  }

  // sets the app state back to default, noone is signed in
  logout = () => {
    this.socket.emit('disconnection',this.state.user.name)
    this.setState({user: {
      name: "defaultNameDoNotUse",
      pass: null
    }
  })
  }

  // sets user to values of form fields in app-level state
  setUser = formFields => {
    this.setState({ user: formFields }) 
    this.socket.emit('connection',this.state.user.name) 
  };

 // adds sent message to chatItems in state and emits it to the backend too 
  sendMessage = ( message) => {
    this.socket.emit('chat-message',message)
    let chatItems = [...this.state.chatItems]
    chatItems.push({name: this.state.user.name, msg: message, date: Date.now()})
    this.setState({chatItems})
  }
}

export default App;
