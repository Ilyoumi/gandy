import React, { useState ,useRef} from "react";
import { Table, Input, Space, Button, Avatar, Typography, Radio } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import face from "../assets/images/face-1.jpg";
import face2 from "../assets/images/face-2.jpg";
import face3 from "../assets/images/face-3.jpg";
import face4 from "../assets/images/face-4.jpg";
import face5 from "../assets/images/face-5.jpeg";
import face6 from "../assets/images/face-6.jpeg";
import Highlighter from "react-highlight-words";

import { Link } from "react-router-dom";
const { Search } = Input;
const { Title } = Typography;
const Agenda = () => {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInputRef = useRef(null);


    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
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
                setTimeout(() => searchInputRef.current && searchInputRef.current.select(), 100);

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
        },
        
        
        {
            title: "AGENT",
            key: "agent",
            dataIndex: "agent",
            ...getColumnSearchProps("agent"),
        },
        
        {
            title: "ACTION",
            key: "action",
            dataIndex: "action",
            ...getColumnSearchProps("action"),
        },
    ];

    const data = [
        {
            key: "1",
            agent: (
                <>
                    <Avatar.Group>
                        <Avatar
                            className="shape-avatar"
                            shape="square"
                            size={40}
                            src={face}
                        ></Avatar>
                        <div className="avatar-info">
                            <Title level={5}>Michael John</Title>
                            <p>michael@mail.com</p>
                        </div>
                    </Avatar.Group>{" "}
                </>
            ),
            societe: (
                <>
                    <div className="author-info">
                        <Title level={5}>BlueTech Solutions</Title>
                        <p>Organization</p>
                    </div>
                </>
            ),
            tel: (
                <>
                    <Button type="primary" className="tag-primary">
                        +1 (555) 123-4567
                    </Button>
                </>
            ),
            gsm: (
                <>
                    <Button type="primary" className="tag-primary">
                        +1 (555) 987-6543
                    </Button>
                </>
            ),
            date: (
                <>
                    <div className="ant-employed">
                        <span>23/04/18</span>
                    </div>
                </>
            ),
            name: (
                <>
                    <div className="ant-employed">
                        <span>Jennifer Smith</span>
                    </div>
                </>
            ),
            agenda: (
                <>
                    <div className="ant-employed">
                        <span>23/04/18</span>
                        
                    </div>
                </>
            ),
            action: (
                <>
                    <div className="ant-employed">
                        <div className="col-action">
                            <Button type="link" danger>
                                {deletebtn}
                            </Button>
                            <Button type="link" className="darkbtn">
                                {pencil} 
                            </Button>
                        </div>
                    </div>
                </>
            ),
        },
        {
            key: "1",
            agent: (
                <>
                    <Avatar.Group>
                        <Avatar
                            className="shape-avatar"
                            shape="square"
                            size={40}
                            src={face6}
                        ></Avatar>
                        <div className="avatar-info">
                            <Title level={5}>Michael John</Title>
                            <p>michael@mail.com</p>
                        </div>
                    </Avatar.Group>{" "}
                </>
            ),
            societe: (
                <>
                    <div className="author-info">
                        <Title level={5}>BlueTech Solutions</Title>
                        <p>Organization</p>
                    </div>
                </>
            ),
            tel: (
                <>
                    <Button type="primary" className="tag-primary">
                        +1 (555) 123-4567
                    </Button>
                </>
            ),
            gsm: (
                <>
                    <Button type="primary" className="tag-primary">
                        +1 (555) 987-6543
                    </Button>
                </>
            ),
            date: (
                <>
                    <div className="ant-employed">
                        <span>23/04/18</span>
                    </div>
                </>
            ),
            name: (
                <>
                    <div className="ant-employed">
                        <span>Jennifer Smith</span>
                    </div>
                </>
            ),
            agenda: (
                <>
                    <div className="ant-employed">
                        <span>23/04/18</span>
                        
                    </div>
                </>
            ),
            action: (
                <>
                    <div className="ant-employed">
                        <div className="col-action">
                            <Button type="link" danger>
                                {deletebtn}
                            </Button>
                            <Button type="link" className="darkbtn">
                                {pencil} 
                            </Button>
                        </div>
                    </div>
                </>
            ),
        },
        {
            key: "1",
            agent: (
                <>
                    <Avatar.Group>
                        <Avatar
                            className="shape-avatar"
                            shape="square"
                            size={40}
                            src={face3}
                        ></Avatar>
                        <div className="avatar-info">
                            <Title level={5}>Michael John</Title>
                            <p>michael@mail.com</p>
                        </div>
                    </Avatar.Group>{" "}
                </>
            ),
            societe: (
                <>
                    <div className="author-info">
                        <Title level={5}>BlueTech Solutions</Title>
                        <p>Organization</p>
                    </div>
                </>
            ),
            tel: (
                <>
                    <Button type="primary" className="tag-primary">
                        +1 (555) 123-4567
                    </Button>
                </>
            ),
            gsm: (
                <>
                    <Button type="primary" className="tag-primary">
                        +1 (555) 987-6543
                    </Button>
                </>
            ),
            date: (
                <>
                    <div className="ant-employed">
                        <span>23/04/18</span>
                    </div>
                </>
            ),
            name: (
                <>
                    <div className="ant-employed">
                        <span>Jennifer Smith</span>
                    </div>
                </>
            ),
            agenda: (
                <>
                    <div className="ant-employed">
                        <span>23/04/18</span>
                        
                    </div>
                </>
            ),
            action: (
                <>
                    <div className="ant-employed">
                        <div className="col-action">
                            <Button type="link" danger>
                                {deletebtn}
                            </Button>
                            <Button type="link" className="darkbtn">
                                {pencil} 
                            </Button>
                        </div>
                    </div>
                </>
            ),
        },
        {
            key: "1",
            agent: (
                <>
                    <Avatar.Group>
                        <Avatar
                            className="shape-avatar"
                            shape="square"
                            size={40}
                            src={face2}
                        ></Avatar>
                        <div className="avatar-info">
                            <Title level={5}>Michael John</Title>
                            <p>michael@mail.com</p>
                        </div>
                    </Avatar.Group>{" "}
                </>
            ),
            societe: (
                <>
                    <div className="author-info">
                        <Title level={5}>BlueTech Solutions</Title>
                        <p>Organization</p>
                    </div>
                </>
            ),
            tel: (
                <>
                    <Button type="primary" className="tag-primary">
                        +1 (555) 123-4567
                    </Button>
                </>
            ),
            gsm: (
                <>
                    <Button type="primary" className="tag-primary">
                        +1 (555) 987-6543
                    </Button>
                </>
            ),
            date: (
                <>
                    <div className="ant-employed">
                        <span>23/04/18</span>
                    </div>
                </>
            ),
            name: (
                <>
                    <div className="ant-employed">
                        <span>Jennifer Smith</span>
                    </div>
                </>
            ),
            agenda: (
                <>
                    <div className="ant-employed">
                        <span>23/04/18</span>
                        
                    </div>
                </>
            ),
            action: (
                <>
                    <div className="ant-employed">
                        <div className="col-action">
                            <Button type="link" danger>
                                {deletebtn}
                            </Button>
                            <Button type="link" className="darkbtn">
                                {pencil} 
                            </Button>
                        </div>
                    </div>
                </>
            ),
        },
        {
            key: "1",
            agent: (
                <>
                    <Avatar.Group>
                        <Avatar
                            className="shape-avatar"
                            shape="square"
                            size={40}
                            src={face4}
                        ></Avatar>
                        <div className="avatar-info">
                            <Title level={5}>Michael John</Title>
                            <p>michael@mail.com</p>
                        </div>
                    </Avatar.Group>{" "}
                </>
            ),
            societe: (
                <>
                    <div className="author-info">
                        <Title level={5}>BlueTech Solutions</Title>
                        <p>Organization</p>
                    </div>
                </>
            ),
            tel: (
                <>
                    <Button type="primary" className="tag-primary">
                        +1 (555) 123-4567
                    </Button>
                </>
            ),
            gsm: (
                <>
                    <Button type="primary" className="tag-primary">
                        +1 (555) 987-6543
                    </Button>
                </>
            ),
            date: (
                <>
                    <div className="ant-employed">
                        <span>23/04/18</span>
                    </div>
                </>
            ),
            name: (
                <>
                    <div className="ant-employed">
                        <span>Jennifer Smith</span>
                    </div>
                </>
            ),
            agenda: (
                <>
                    <div className="ant-employed">
                        <span>23/04/18</span>
                        
                    </div>
                </>
            ),
            action: (
                <>
                    <div className="ant-employed">
                        <div className="col-action">
                            <Button type="link" danger>
                                {deletebtn}
                            </Button>
                            <Button type="link" className="darkbtn">
                                {pencil} 
                            </Button>
                        </div>
                    </div>
                </>
            ),
            
        },
        {
            key: "1",
            agent: (
                <>
                    <Avatar.Group>
                        <Avatar
                            className="shape-avatar"
                            shape="square"
                            size={40}
                            src={face5}
                        ></Avatar>
                        <div className="avatar-info">
                            <Title level={5}>Michael John</Title>
                            <p>michael@mail.com</p>
                        </div>
                    </Avatar.Group>{" "}
                </>
            ),
            societe: (
                <>
                    <div className="author-info">
                        <Title level={5}>BlueTech Solutions</Title>
                        <p>Organization</p>
                    </div>
                </>
            ),
            tel: (
                <>
                    <Button type="primary" className="tag-primary">
                        +1 (555) 123-4567
                    </Button>
                </>
            ),
            gsm: (
                <>
                    <Button type="primary" className="tag-primary">
                        +1 (555) 987-6543
                    </Button>
                </>
            ),
            date: (
                <>
                    <div className="ant-employed">
                        <span>23/04/18</span>
                    </div>
                </>
            ),
            name: (
                <>
                    <div className="ant-employed">
                        <span>Jennifer Smith</span>
                    </div>
                </>
            ),
            agenda: (
                <>
                    <div className="ant-employed">
                        <span>23/04/18</span>
                    </div>
                </>
            ),
            action: (
                <>
                    <div className="ant-employed">
                        <div className="col-action">
                            <Button type="link" danger>
                                {deletebtn}
                            </Button>
                            <Button type="link" className="darkbtn">
                                {pencil} 
                            </Button>
                        </div>
                    </div>
                </>
            ),
        },
    ];

    return (
        <div>
            <Input
            className="header-search mb-2 mt-2"
            style={{ width:"20%", padding:"0px 11px", height:"50px", borderRadius:"6px" }}
            placeholder="Type here..."
            prefix={<SearchOutlined />}
          />
            <Table
                columns={columns}
                dataSource={data}
                style={{
                    boxShadow: "0px 20px 27px #0000000d",
                    padding: "10px 1px",
                }}
            />
        </div>
    );
};

export default Agenda;
