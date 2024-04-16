import React from 'react';
import { Button } from 'antd';
import './ButtonStyle.css';

const ModifierButton = ({ onClick, loading, buttonText }) => {
  return (
    <Button className="mod-button" onClick={onClick} loading={loading} type="primary" ghost>
        {buttonText}
    </Button>
  );
};

export default ModifierButton;
