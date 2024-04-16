import React from 'react';
import { Button } from 'antd';
import './ButtonStyle.css';


const SupprimerButton = ({ onClick, loading, buttonText }) => {
  return (
    <Button className="supp-button"  onClick={onClick} loading={loading} danger >
        {buttonText}
    </Button>
  );
};

export default SupprimerButton;
