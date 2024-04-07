import React from 'react';
import { Button } from 'antd';
import './SaveButton.css';


const SaveButton = ({ loading }) => {
  return (
    <Button className="save-button"  loading={loading} htmlType="submit">
        Enregistrer
    </Button>
  );
};

export default SaveButton;
