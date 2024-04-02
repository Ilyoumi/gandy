import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const DynamicSelect = ({ placeholder, options, value, onChange }) => (
  <Select
    showSearch
    style={{ width: '100%' }}
    placeholder={placeholder}
    optionFilterProp="children"
    filterOption={(input, option) => (option?.label ?? '').includes(input)}
    filterSort={(optionA, optionB) =>
      (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
    }
    value={value}
    onChange={onChange}
  >
    {options.map(option => (
      <Option key={option.value} value={option.value}>
        {option.label}
      </Option>
    ))}
  </Select>
);

export default DynamicSelect;
