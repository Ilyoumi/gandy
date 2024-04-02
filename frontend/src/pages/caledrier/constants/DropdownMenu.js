import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

function DropdownMenu(props) {
  return (
    <Select defaultValue="month" onChange={props.onChange}>
      <Option value="day">Jour</Option>
      <Option value="week">Semaine</Option>
      <Option value="month">Mois</Option>
    </Select>
  );
}

export default DropdownMenu;
