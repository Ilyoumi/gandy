import React from 'react';
import { Select } from 'antd';

const DynamicSelect = ({ placeholder, options }) => (
  <Select
    showSearch
    style={{
      width: "100%",
    }}
    placeholder={placeholder}
    optionFilterProp="children"
    filterOption={(input, option) => (option?.label ?? '').includes(input)}
    filterSort={(optionA, optionB) =>
      (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
    }
    options={options.map(option => ({
      value: option.value,
      label: option.label,
    }))}
  />
);

export default DynamicSelect;
