import React, { useState, useRef } from "react";
import {
    Table,
    Input,
    Space,
    Button,
    Avatar,
    Typography,
    Modal,
    Select,
    Row,
    Col,
    Form,
    Upload,
    message,
} from "antd";
import { SearchOutlined, UploadOutlined,PlusOutlined } from "@ant-design/icons";
import face from "../../../assets/images/face-1.jpg";

import Highlighter from "react-highlight-words";
import { useHistory } from "react-router-dom";

const { Option } = Select;
const { Title } = Typography;

const Contacts = () => {
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [visible, setVisible] = useState(false);
    const [selectedAgenda, setSelectedAgenda] = useState("");
    const history = useHistory();
    const searchInputRef = useRef(null);

    const showUpdateModal = () => {
        setVisible(true);
    };

    const handleAgendaChange = (value) => {
        setSelectedAgenda(value);
    };

    const handleUpdate = () => {
        // Logic to update the agenda
        setVisible(false);
    };

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
        {
            title: "ACTION",
            key: "action",
            dataIndex: "action",
            render: () => (
                <Space size="middle">
                    <Button
                        type="link"
                        className="darkbtn"
                        onClick={showUpdateModal}
                    >
                        {pencil}
                    </Button>
                    <Button
                        type="link"
                        className="darkbtn"
                        onClick={showUpdateModal}
                    >
                        {deletebtn}
                    </Button>
                </Space>
            ),
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
        <>
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
            <div
                style={{
                    backgroundColor: "white",
                    padding: "5px",
                    boxShadow: "0px 20px 27px #0000000d",
                }}
            >
                <Row style={{ margin: "10px 20px" }}>
                    <Col
                        span={12}
                        style={{
                            textAlign: "left",
                            fontWeight: "bold",
                            fontSize: "20px",
                        }}
                    >
                        Ajouter Utilisateur
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<PlusOutlined />}

                            onClick={handleButtonClick}
                        >
                            Ajouter utilisateur
                        </Button>
                    </Col>
                </Row>
                <Table columns={columns} dataSource={data} />
                <UpdateUserModal
                    visible={visible}
                    onCancel={() => setVisible(false)}
                    onUpdate={handleUpdate}
                />
            </div>
        </>
    );
};

export default Contacts;
const UpdateUserModal = ({ visible, onCancel, onUpdate, userData }) => {
    const [form] = Form.useForm();
    const [agenda, setAgenda] = useState(
        userData ? userData.agenda : undefined
    );

    const handleAgendaChange = (value) => {
        setAgenda(value);
    };
    const handleImageChange = (info) => {
        if (info.file.status === "done") {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (info.file.status === "error") {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    const handleSubmit = () => {
        form.validateFields()
            .then((values) => {
                form.resetFields();
                onUpdate({ ...values, agenda });
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };

    return (
        <Modal
            visible={visible}
            title="Modifier Utilisateur"
            okText="Modifier"
            onCancel={onCancel}
            onOk={handleSubmit}
        >
            <Form
                form={form}
                initialValues={{
                    name: userData ? userData.name : "",
                    email: userData ? userData.email : "",
                    agenda: userData ? userData.agenda : undefined,
                }}
            >
                <Form.Item
                    name="image"
                    label="Image"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => {
                        if (Array.isArray(e)) {
                            return e;
                        }
                        return e && e.fileList;
                    }}
                    style={{ marginBottom: 20 }}
                >
                    <Upload
                        name="image"
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        listType="picture"
                        maxCount={1}
                        onChange={handleImageChange}
                        style={{ width: "100%" }}
                    >
                        <Button icon={<UploadOutlined />}>Uploader</Button>
                    </Upload>
                </Form.Item>
                <Form.Item
                    name="name"
                    label="Nom"
                    rules={[
                        { required: true, message: "Veuillez entrer le nom!" },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: "Veuillez entrer l'email!" },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="agenda"
                    label="Agenda"
                    rules={[
                        {
                            required: true,
                            message: "Veuillez sélectionner l'agenda!",
                        },
                    ]}
                >
                    <Select onChange={handleAgendaChange}>
                        <Option value="agenda1">Agenda 1</Option>
                        <Option value="agenda2">Agenda 2</Option>
                        <Option value="agenda3">Agenda 3</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};
