import face from "../assets/images/face-1.jpg";

import { Avatar, Typography, Button } from "antd";
import { pencil, deletebtn } from "./icons";

const { Title } = Typography;

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
        key: "2",
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
                        <Title level={5}>Ghizlane John</Title>
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
        key: "3",
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
        key: "4",
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
        key: "5",
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
        key: "6",
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

export default data;
