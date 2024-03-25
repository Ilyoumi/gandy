import React, { useState,useRef } from "react";
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
const History = () => {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInputRef = useRef(null);

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

    const columns = [
        {
            title: "NOM",
            dataIndex: "name",
            key: "name",
            width: "32%",
            ...getColumnSearchProps("name"),
        },
        {
            title: "SOCIETE",
            dataIndex: "societe",
            key: "societe",
            ...getColumnSearchProps("societe"),
        },

        {
            title: "GSM",
            key: "gsm",
            dataIndex: "gsm",
            ...getColumnSearchProps("gsm"),
        },
        {
            title: "TVA",
            key: "tva",
            dataIndex: "tva",
            ...getColumnSearchProps("tva"),
        },
        {
            title: "SUPERVISEUR",
            key: "superviseur",
            dataIndex: "superviseur",
            ...getColumnSearchProps("superviseur"),
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
            tva: (
                <>
                    <div className="ant-financial-info">
                        <span>ES543210987</span>
                    </div>
                </>
            ),
            superviseur: (
                <>
                    <Avatar.Group>
                        <Avatar
                            className="shape-avatar"
                            shape="square"
                            size={40}
                            src={face2}
                        ></Avatar>
                        <div className="avatar-info">
                            <Title level={5}>Noah Thompson</Title>
                            <p>noah@example.com</p>
                        </div>
                    </Avatar.Group>{" "}
                </>
            )
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
            tva: (
                <>
                    <div className="ant-financial-info">
                        <span>IT765432109</span>
                    </div>
                </>
            ),
            superviseur: (
                <>
                    <Avatar.Group>
                        <Avatar
                            className="shape-avatar"
                            shape="square"
                            size={40}
                            src={face3}
                        ></Avatar>
                        <div className="avatar-info">
                            <Title level={5}>Olivia Smith</Title>
                            <p>olivia@example.com</p>
                        </div>
                    </Avatar.Group>{" "}
                </>
            )
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
            tva: (
                <>
                    <div className="ant-financial-info">
                        <span>FR876543210</span>
                    </div>
                </>
            ),
            superviseur: (
                <>
                    <Avatar.Group>
                        <Avatar
                            className="shape-avatar"
                            shape="square"
                            size={40}
                            src={face6}
                        ></Avatar>
                        <div className="avatar-info">
                            <Title level={5}>Emma Wilson</Title>
                            <p>emma@example.com</p>
                        </div>
                    </Avatar.Group>{" "}
                </>
            )
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
            agent: (
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
            tva: (
                <>
                    <div className="ant-financial-info">
                        <span>FR123456789</span>
                    </div>
                </>
            ),
            superviseur: (
                <>
                    <Avatar.Group>
                        <Avatar
                            className="shape-avatar"
                            shape="square"
                            size={40}
                            src={face} // Replace this with the actual path to the supervisor's avatar image
                        ></Avatar>
                        <div className="avatar-info">
                            <Title level={5}>Sophie Turner</Title>
                            <p>sophie.turner@example.com</p>
                        </div>
                    </Avatar.Group>
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
            tva: (
                <>
                    <div className="ant-financial-info">
                        <span>DE987654321</span>
                    </div>
                </>
            ),
            superviseur: (
                <>
                    <Avatar.Group>
                        <Avatar
                            className="shape-avatar"
                            shape="square"
                            size={40}
                            src={face4}
                        ></Avatar>
                        <div className="avatar-info">
                            <Title level={5}>Daniel Brown</Title>
                            <p>daniel@example.com</p>
                        </div>
                    </Avatar.Group>{" "}
                </>
            )
        },
    ];

    return (
        <div style={{ overflowX: "auto" }}>
            <Table columns={columns} dataSource={data} scroll={{ x: 'max-content' }} />
        </div>
    );
};

export default History;
