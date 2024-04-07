import React from 'react';
import { Button } from 'antd';
import './SaveButton.css';


const SaveButton = ({ loading }) => {
  return (
    <Button className="save-button" htmlType="submit" loading={loading}>
        Enregistrer
    </Button>

  );
};

export default SaveButton;
