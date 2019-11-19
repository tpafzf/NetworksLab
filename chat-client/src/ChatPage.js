import React from "react";

class ChatPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messageForm: null
    };
  }

  render() {

    return (
      <React.Fragment>
        <div className="chatContainer">
        <div className="chatItems">
          {
          //for every chat Item loaded into state, it creates a new div
             this.props.chatItems.map(chatItem => (
            <div className="chatItem">
              {chatItem.name}:{chatItem.msg}
              {chatItem.timestamp}
            </div>
          ))
          }
        </div>
        <input
          type="text"
          name="messageInput"
          placeholder="send new message"
          onChange={e => this.writeMessageHandler.call(this, e)}
          value={this.state.messageForm}
        />{" "}
        <button
          className="btn btn-primary"
          onClick={e => { this.props.sendMessage.call(this,this.state.messageForm)
                          this.setState({messageForm: ""})}}
        >
          Send Message
        </button>
        <br/>
        </div>
        <button
          className="btn btn-primary"
          onClick={e => this.props.logout.call(this)}
          >Logout</button>
      </React.Fragment>
    );
  }

  //listener for text field change 
  writeMessageHandler = e => {
    let messageForm = { ...this.state.messageForm };
    messageForm = e.target.value;
    this.setState({
      messageForm
    });
  };
}

export default ChatPage;
