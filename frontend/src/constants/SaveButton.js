import React from 'react';
import { Button } from 'antd';
import './ButtonStyle.css';


const SaveButton = ({ onClick, loading, buttonText  }) => {
  return (
    <Button className="save-button" onClick={onClick} loading={loading} htmlType='submit' guost>
        {buttonText}
    </Button>

  );
};

export default SaveButton;
