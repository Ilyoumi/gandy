import React, { useState } from "react";
import { Table, Input, Space, Button, Avatar, Typography, Radio , Row, Col} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import face from "../assets/images/face-1.jpg";
import face2 from "../assets/images/face-2.jpg";
import face3 from "../assets/images/face-3.jpg";
import face4 from "../assets/images/face-4.jpg";
import face5 from "../assets/images/face-5.jpeg";
import face6 from "../assets/images/face-6.jpeg";
import Highlighter from "react-highlight-words";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
const { Search } = Input;
const { Title } = Typography;
const Contacts = () => {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const history = useHistory();

    const handleButtonClick = () => {
        // Redirect to the desired route
        history.push("/add-user");
    };

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
                setTimeout(
                    () => document.getElementById("search-input").select(),
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

    const columns = [
        {
            title: "NOM",
            dataIndex: "name",
            key: "name",
            width: "32%",
            ...getColumnSearchProps("name"),
        },
        {
            title: "EMAIL",
            dataIndex: "email",
            key: "email",
            ...getColumnSearchProps("email"),
        },

        {
            title: "AGENDA",
            key: "agenda",
            dataIndex: "agenda",
            ...getColumnSearchProps("agenda"),
        },
        
    ];

    const data = [
        {
            key: "1",
            name: (
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
            email: "michael@mail.com",
            agenda: (
                <>
                    <div className="ant-employed">
                        <span>23/04/18</span>
                        <a href="#pablo" style={{ color: "#FFC700" }}>
                            Editer
                        </a>
                    </div>
                </>
            ),
        },
        {
            key: "1",
            name: (
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
            email: "michael@mail.com",

            agenda: (
                <>
                    <div className="ant-employed">
                        <span>23/04/18</span>
                        <a href="#pablo" style={{ color: "#FFC700" }}>
                            Editer
                        </a>
                    </div>
                </>
            ),
        },
        {
            key: "1",
            name: (
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
            
            email: "michael@mail.com",

            agenda: (
                <>
                    <div className="ant-employed">
                        <span>23/04/18</span>
                        <a href="#pablo" style={{ color: "#FFC700" }}>
                            Editer
                        </a>
                    </div>
                </>
            ),
        },
        {
            key: "1",
            name: (
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
            
            email: "michael@mail.com",

            agenda: (
                <>
                    <div className="ant-employed">
                        <span>23/04/18</span>
                        <a href="#pablo" style={{ color: "#FFC700" }}>
                            Editer
                        </a>
                    </div>
                </>
            ),
        },
        {
            key: "1",
            name: (
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
            
            email: "michael@mail.com",
            agenda: (
                <>
                    <div className="ant-employed">
                        <span>23/04/18</span>
                        <a href="#pablo" style={{ color: "#FFC700" }}>
                            Editer
                        </a>
                    </div>
                </>
            ),

        },
        {
            key: "1",
            name: (
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
            
            email: "michael@mail.com",
            agenda: (
                <>
                    <div className="ant-employed">
                        <span>23/04/18</span>
                        <a href="#pablo" style={{ color: "#FFC700" }}>
                            Editer
                        </a>
                    </div>
                </>
            ),
        },
    ];

    return (
        <div>
            <Input
            className="header-search mb-2 mt-2"
            style={{ width:"20%" }}
            placeholder="Type here..."
            prefix={<SearchOutlined />}
          />
            <Row>
                    <Col span={24} style={{ textAlign: "right" }}>
                        <Button type="primary" htmlType="submit" onClick={handleButtonClick}>
                            Ajouter utilisateur
                        </Button>
                    </Col>
                </Row>
            <Table columns={columns} dataSource={data} style={{  
        boxShadow: "0px 20px 27px #0000000d", padding:"10px 1px" }}/>
        </div>
    );
};

export default Contacts;
