import React from 'react';
import { Button } from 'antd';
import './SaveButton.css';

const NewButton = ({ onClick, loading, buttonText }) => {
  return (
    <Button className="new-button" onClick={onClick} loading={loading}>
        {buttonText}
    </Button>
  );
};

export default NewButton;
