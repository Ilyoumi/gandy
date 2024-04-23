import { useRef, useState, useEffect } from "react";
import { Input, Space, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from 'react-highlight-words';

const useColumnSearch = (tableData) => {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
    const searchInputRef = useRef(null);

    useEffect(() => {
        // Close dropdown when searchText is empty
        if (!searchText && filterDropdownVisible) {
            setFilterDropdownVisible(false);
        }
    }, [searchText, filterDropdownVisible]);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        confirm();
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInputRef}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => {
                        const { value } = e.target;
                        setSelectedKeys(value ? [value] : []);
                        setSearchText(value); // Update search text
                        if (!value) {
                            handleSearch([], confirm, dataIndex); // If value is empty, reset filter
                        }
                    }}
                    onBlur={() => {
                        if (!searchText) {
                            setFilterDropdownVisible(false); // Close dropdown only if searchText is empty
                        }
                    }}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: "block" }}
                />
                
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
        ),
        onFilter: (value, record) => {
            const dataIndexValue = record[dataIndex];
            if (dataIndexValue !== undefined && dataIndexValue !== null) {
                return dataIndexValue
                    .toString()
                    .toLowerCase()
                    .includes(searchText.toLowerCase());
            }
            return false;
        },

        onFilterDropdownVisibleChange: (visible) => {
            setFilterDropdownVisible(visible);
            if (visible) {
                setTimeout(() => {
                    if (searchInputRef.current) {
                        searchInputRef.current.focus();
                    }
                });
            }
        },
        render: (text, record) => {
            console.log("Rendering...");
            console.log("Text:", text);
            console.log("Record:", record);
            if (!text || !record) {
                console.log("Text or record is null or undefined");
                return null;
            }
            const dataIndexValue = record[dataIndex];
            console.log("DataIndexValue:", dataIndexValue);
            if (dataIndexValue !== undefined && dataIndexValue !== null) {
                const dataString = dataIndexValue.toString();
                console.log("DataString:", dataString);
                if (searchText && dataString) {
                    console.log("SearchText:", searchText);
                    console.log("DataString:", dataString);
                    if (dataString.toLowerCase().includes(searchText.toLowerCase())) {
                        console.log("Highlighting...");
                        return (
                            <Highlighter
                                highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                                searchWords={[searchText]}
                                autoEscape
                                textToHighlight={dataString}
                            />
                        );
                    }
                }
            }
            console.log("Not highlighting...");
            return text;
        },
        
        
    });

    return { getColumnSearchProps };
};

export default useColumnSearch;
