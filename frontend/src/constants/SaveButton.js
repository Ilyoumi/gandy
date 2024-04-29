import React from 'react';
import { Button } from 'antd';
import './ButtonStyle.css';
import { FileAddOutlined } from "@ant-design/icons";
const SaveButton = ({ onClick, loading, buttonText }) => {
  return (
    <Button className="save-button" onClick={onClick} loading={loading} htmlType='submit'>
        {buttonText || 'Enregistrer'} <FileAddOutlined />
    </Button>
  );
};

export default SaveButton;
