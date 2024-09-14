import React from "react";
import styled from "styled-components";

function ChatContainer({ currentUser }) {
  return (
    <Container>
      <div className="chat-header">
        <div className="avatar"></div>
        <div className="username"></div>
        <h3>{}</h3>
      </div>
    </Container>
  );
}

const Container = styled.div`
  color: white;
`;

export default ChatContainer;
