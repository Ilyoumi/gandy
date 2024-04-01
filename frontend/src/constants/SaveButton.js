import React from 'react';
import { Button } from 'antd';
import './SaveButton.css';


const SaveButton = ({ onClick, loading }) => {
  return (
    <Button className="save-button" onClick={onClick} loading={loading}>
        Enregistrer
    </Button>
  );
};

export default SaveButton;
