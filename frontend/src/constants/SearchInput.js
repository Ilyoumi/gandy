// SearchInput.js
import React from "react";
import { Input } from "antd";


const SearchInput = ({ onChange }) => {
	const handleInputChange = (e) => {
					onChange(e.target.value);
	};

	return (
					<Input
									placeholder="Search..."
									onChange={handleInputChange}
									allowClear
					/>
	);
};



export default SearchInput;
