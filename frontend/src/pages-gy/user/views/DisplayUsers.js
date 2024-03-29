import React, { useState, useEffect, useRef } from "react";
import { Input, Avatar, Space, Table, Button } from "antd";
import UpdateUser from "./UpdateUser";
import fetchUsers from "../services/apis/usersApi";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

const DisplayUsers = () => {
    const [users, setUsers] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [updateData, setUpdateData] = useState({});
    const searchInputRef = useRef(null);

    useEffect(() => {
        // Fetch users data when component mounts
        fetchUsersData();
    }, []);

    const fetchUsersData = async () => {
        try {
            const userData = await fetchUsers();
            setUsers(userData);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{ width: 188, marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{ color: filtered ? "#1890ff" : undefined }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(
                    () =>
                        searchInputRef.current &&
                        searchInputRef.current.select(),
                    100
                );
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text.toString()}
                />
            ) : (
                text
            ),
    });

    const showUpdateModal = (record) => {
        setUpdateData(record);
        setUpdateModalVisible(true);
    };

    const handleUpdate = (values) => {
        // Handle update logic here, e.g., call API to update user data
        console.log("Updated user data:", values);
        setUpdateModalVisible(false);
    };

    const updateModalProps = {
        visible: updateModalVisible,
        onCancel: () => setUpdateModalVisible(false),
        onUpdate: handleUpdate,
        userData: updateData,
    };

    const deletebtn = [
        <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            key={0}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 2C8.62123 2 8.27497 2.214 8.10557 2.55279L7.38197 4H4C3.44772 4 3 4.44772 3 5C3 5.55228 3.44772 6 4 6L4 16C4 17.1046 4.89543 18 6 18H14C15.1046 18 16 17.1046 16 16V6C16.5523 6 17 5.55228 17 5C17 4.44772 16.5523 4 16 4H12.618L11.8944 2.55279C11.725 2.214 11.3788 2 11 2H9ZM7 8C7 7.44772 7.44772 7 8 7C8.55228 7 9 7.44772 9 8V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V8ZM12 7C11.4477 7 11 7.44772 11 8V14C11 14.5523 11.4477 15 12 15C12.5523 15 13 14.5523 13 14V8C13 7.44772 12.5523 7 12 7Z"
                fill="#111827"
                className="fill-danger"
            ></path>
        </svg>,
    ];
    const pencil = [
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            key={0}
        >
            <path
                d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
                className="fill-gray-7"
            ></path>
            <path
                d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z"
                className="fill-gray-7"
            ></path>
        </svg>,
    ];
    const columns = [
        {
            title: "NOM",
            dataIndex: "name",
            key: "name",
            width: "32%",
            ...getColumnSearchProps("name"),
            render: (text, record) => (
                <div>
                    <Avatar src={record.image} />
                    <span style={{ marginLeft: 8 }}>{text}</span>
                </div>
            ),
        },
        {
            title: "EMAIL",
            dataIndex: "email",
            key: "email",
            ...getColumnSearchProps("email"),
        },
        {
            title: "ROLE",
            dataIndex: "role",
            key: "role",
            ...getColumnSearchProps("role"),
            render: (text, record) => (
                <span>{record.role ? record.role.name : ""}</span>
            ),
        },
        {
            title: "ACTION",
            key: "action",
            render: (text, record) => (
                <Space>
                    <Button type="link" onClick={() => showUpdateModal(record)}>
                        {pencil}
                    </Button>
                    <Button
                        type="link"
                        onClick={() => console.log("Delete user:", record.id)}
                    >
                        {deletebtn}
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div
            style={{
                marginTop: "20px",
                marginBottom: "20px",
            }}
        >
            <Input
                className="header-search mb-2 mt-2"
                style={{
                    width: "20%",
                    padding: "0px 11px",
                    borderRadius: "6px",
                }}
                placeholder="Type here..."
                prefix={<SearchOutlined />}
            />
            <Table
                columns={columns}
                dataSource={users}
                pagination={false}
                style={{
                    boxShadow: "0px 20px 27px #0000000d",
                    padding: "10px 1px",
                }}
            />
            <UpdateUser {...updateModalProps} />
        </div>
    );
};

export default DisplayUsers;
