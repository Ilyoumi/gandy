import React from 'react';
import { Button } from 'antd';
import './ButtonStyle.css';
import { DeleteOutlined } from "@ant-design/icons";


const SupprimerButton = ({ onClick, loading, buttonText }) => {
  return (
    <Button className="supp-button"  onClick={onClick} loading={loading} danger >
        {buttonText} <DeleteOutlined />
    </Button>
  );
};

export default SupprimerButton;
