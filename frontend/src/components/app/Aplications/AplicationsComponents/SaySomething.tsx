import React from 'react';
import { Input, Button } from 'reactstrap';

const SaySomething = ({
  placeholder,
  messageInput,
  handleChatInputPress,
  handleChatInputChange,
  handleSendButtonClick,
}: any) => {
  return (
    <div className="chat-input-container d-flex justify-content-between align-items-center">
      <Input
        className="form-control flex-grow-1"
        type="text"
        placeholder={placeholder}
        value={messageInput}
        onKeyPress={(e) => handleChatInputPress(e)}
        onChange={(e) => handleChatInputChange(e)}
      />
      <div>
        <Button outline color="primary" className="icon-button large ml-1">
          <i className="simple-icon-paper-clip" />
        </Button>

        <Button
          color="primary"
          className="icon-button large ml-1"
          onClick={() => handleSendButtonClick()}
        >
          <i className="simple-icon-arrow-right" />
        </Button>
      </div>
    </div>
  );
};
export default React.memo(SaySomething);
