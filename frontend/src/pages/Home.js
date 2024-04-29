import { Card, Col, Row, Typography } from "antd";
import Echart from "../components/chart/EChart";
import LineChart from "../components/chart/LineChart";
import History from "./rdv/views/History";
import React, { useEffect, useState } from 'react';
import annulerIcon from '../assets/images/cancel.png';
import confirmerIcon from '../assets/images/communication.png';
import rdvsIcon from '../assets/images/rdvs.png';
import nrpIcon from '../assets/images/no-answer.png';
import { axiosClient } from "../api/axios";

function Home() {
    const { Title } = Typography;
    const [appointmentStatistics, setAppointmentStatistics] = useState([]);

    useEffect(() => {
        fetchAppointmentStatistics();
    }, []);

    const fetchAppointmentStatistics = async () => {
        try {
            const response = await axiosClient.get('/api/rdvs/stats');
            console.log('rdvsss',response.data)
            setAppointmentStatistics(response.data);
        } catch (error) {
            console.error('Error fetching appointment statistics:', error);
        }
    };

    const count = appointmentStatistics.length > 0 ? [
      {
          today: "Rendez-vous annulés",
          title: appointmentStatistics[0].annuler_count,
          persent: "",
          icon: annulerIcon,
          bnb: "",
      },
      {
          today: "Rendez-vous confirmés",
          title: appointmentStatistics[0].confirmer_count,
          persent: "",
          icon: confirmerIcon,
          bnb: "",
      },
      {
          today: "Rendez-vous NRP",
          title: appointmentStatistics[0].nrp_count,
          persent: "",
          icon: nrpIcon,
          bnb: "",
      },
      {
          today: "Total des clients",
          title: appointmentStatistics[0].total_appointments,
          persent: "",
          icon: rdvsIcon,
          bnb: "",
      },
  ] : [];

    return (
        <>
            <div className="layout-content">
                <Row className="rowgap-vbox" gutter={[24, 0]}>
                    {count.map((c, index) => (
                        <Col
                            key={index}
                            xs={24}
                            sm={24}
                            md={12}
                            lg={6}
                            xl={6}
                            className="mb-24"
                        >
                            <Card bordered={false} className="criclebox " style={{height:'120px'}}>
                                <div className="number">
                                    <Row align="middle" gutter={[24, 0]}>
                                        <Col xs={18}>
                                            <span>{c.today}</span>
                                            <Title level={3}>
                                                {c.title !== undefined ? c.title : null}{" "}
                                                <small className={c.bnb}>
                                                    {c.persent}
                                                </small>
                                            </Title>
                                        </Col>

                                        <Col xs={6}>
                                            <div className="icon-box">
                                                <img src={c.icon} alt={c.today} style={{width:'40px', marginBottom:'10px'}} />
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
                <Row className="rowgap-vbox" gutter={[24, 0]}>
                    <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                        className="mb-24 "
                    >
                        <History />
                    </Col>
                </Row>

                <Row gutter={[24, 0]}>
                    <Col
                        xs={24}
                        sm={24}
                        md={12}
                        lg={12}
                        xl={10}
                        className="mb-24 "
                    >
                        <Card bordered={false} className="criclebox h-full">
                            <Echart />
                        </Card>
                    </Col>
                    <Col
                        xs={24}
                        sm={24}
                        md={12}
                        lg={12}
                        xl={14}
                        className="mb-24"
                    >
                        <Card bordered={false} className="criclebox h-full">
                            <LineChart />
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Home;
