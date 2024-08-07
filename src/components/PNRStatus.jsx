import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import {
  Layout,
  Row,
  Col,
  Typography,
  Button,
  Input,
  Form,
  Spin,
  Divider,
  Alert,
  Card,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import FooterUser from "../countUser";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { Item } = Form;

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ color: "white", fontSize: "16px" }}>
      {time.toLocaleTimeString()}
    </div>
  );
};

const App = () => {
  const [pnr, setPnr] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPnrStatus = async () => {
    if (!pnr) {
      setError("Please enter a PNR number");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `https://redbus-backend-whco.onrender.com/api/getPnrData?pnrno=${pnr}`,
      );

      if (response.data.errorcode === "712") {
        setError(response.data.detailedmsg);
        setStatus(null);
      } else if (response.data.errorcode === "100.7") {
        setError(response.data.errormsg);
        setStatus(null);
      } else {
        setStatus(response.data);
        setPnr("");
        setError("");
      }
    } catch (error) {
      console.error("Error fetching PNR status", error);
      setError("Failed to fetch PNR status. Please try again later.");
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError("");
  };

  const formatDuration = (durationInMinutes) => {
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    return `${hours} hrs ${minutes} mins`;
  };
  return (
    <Layout>
      <Header style={{ background: "#001529", padding: "0 20px" }}>
        <Row justify="space-between" align="middle" style={{ height: "100%" }}>
          <Col>
            <div className="logo" style={{ color: "white", fontSize: "20px" }}>
              PNR Status Check
            </div>
          </Col>
          <Col>
            <Clock />
          </Col>
        </Row>
      </Header>
      <Content>
        <div className="mx-auto p-2 m-5">
          <Card
            className="border-orangered-500 custom-card"
            bordered={true}
            style={{
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              padding: "20px",
              margin: "auto",
            }}
          >
            <Form layout="vertical">
              <Item label="PNR Number">
                <Input
                  size="large"
                  value={pnr}
                  onChange={(e) => {
                    setPnr(e.target.value);
                    clearError();
                  }}
                  maxLength={10}
                  placeholder="Enter PNR Number"
                />
              </Item>
              <Item>
                <Button
                  type="primary"
                  size="large"
                  onClick={fetchPnrStatus}
                  block
                >
                  Submit
                </Button>
              </Item>
            </Form>
            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                className="mt-4"
                icon={<CloseCircleOutlined className="text-red-500" />}
              />
            )}
            {loading && (
              <div className="flex items-center justify-center mt-4">
                <Spin size="large" className="extra-large-spin" />
              </div>
            )}
            {status && (
              <Alert
                message={
                  <div>
                    <Text
                      className={`text-left mb-6 block border p-2 rounded-md font-bold ${
                        status.overallStatus === "Your Ticket is Confirmed"
                          ? "bg-green-300 border-green-500 text-green-800"
                          : status.overallStatus === "Your Ticket is Waitlisted"
                            ? "bg-[#fff2f0] border-[#ffccc7] text-red-800" // Adjust text color as needed
                            : "" // Add more conditions if necessary
                      }`}
                    >
                      {status.overallStatus}
                    </Text>

                    <Divider />
                    <Title level={4}>PNR Details : {status.pnrNo}</Title>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Text strong>Train Number:</Text>{" "}
                        <Text>{status.trainNumber}</Text>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Text strong>Train Name:</Text>{" "}
                        <Text>{status.trainName}</Text>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Text strong>Duration:</Text>{" "}
                        <Text className="text-left mb-6 block bg-[#fff2f0] border border-[#ffccc7] p-2 rounded-md text-green-800 font-bold">
                          {formatDuration(status.duration)}
                        </Text>
                      </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Text strong>Departure:</Text>{" "}
                        <Text>
                          <ClockCircleOutlined />{" "}
                          {moment(status.departureTime).format(
                            "MMMM Do YYYY, h:mm:ss a",
                          )}
                        </Text>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Text strong>Arrival:</Text>{" "}
                        <Text>
                          <ClockCircleOutlined />{" "}
                          {moment(status.arrivalTime).format(
                            "MMMM Do YYYY, h:mm:ss a",
                          )}
                        </Text>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Text strong>Chart Status:</Text>{" "}
                        <Text>{status.chartStatus}</Text>
                      </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Text strong>Source:</Text>{" "}
                        <Text>
                          {status.srcName} ({status.srcCode})
                        </Text>
                        <br />
                        <Text strong>Platform:</Text>{" "}
                        <Text>{status.srcPfNo}</Text>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Text strong>Destination:</Text>{" "}
                        <Text>
                          {status.dstName} ({status.dstCode})
                        </Text>
                        <br />
                        <Text strong>Platform:</Text>{" "}
                        <Text>{status.dstPfNo}</Text>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Text strong>Chart Preparation:</Text>{" "}
                        <Text>{status.chartPrepMsg}</Text>
                      </Col>
                    </Row>
                    <Divider />
                    <Title level={4}>Passengers</Title>
                    {status.passengers.map((passenger, index) => (
                      <div key={index}>
                        <Row gutter={[16, 16]}>
                          <Col xs={24} sm={12} md={8} lg={6}>
                            <Text strong>Name:</Text>{" "}
                            <Text className="text-left mb-6 block bg-[#fff2f0] border border-[#ffccc7] p-2 rounded-md">
                              {passenger.name}
                            </Text>
                          </Col>
                          <Col xs={24} sm={12} md={8} lg={6}>
                            <Text strong>Status:</Text>{" "}
                            <Text className="text-left mb-6 block bg-[#fff2f0] border border-[#ffccc7] p-2 rounded-md text-green-800">
                              {passenger.currentStatus}
                            </Text>
                          </Col>
                          <Col xs={24} sm={12} md={8} lg={6}>
                            <Text strong>Seat Details:</Text>{" "}
                            <Text className="text-left mb-6 block bg-[#fff2f0] border border-[#ffccc7] p-2 rounded-md text-green-800">
                              {passenger.currentSeatDetails}
                            </Text>
                          </Col>
                          {passenger.confirmProb !== undefined && (
                            <Col xs={24} sm={12} md={8} lg={6}>
                              <Text strong>Confirmation Probability:</Text>{" "}
                              <Text className="text-left mb-6 block bg-[#fff2f0] border border-[#ffccc7] p-2 rounded-md text-green-800">
                                {passenger.confirmProb}%
                              </Text>
                            </Col>
                          )}
                          {passenger.berthType && (
                            <Col xs={24} sm={12} md={8} lg={6}>
                              <Text strong>Berth Type:</Text>{" "}
                              <Text className="text-left mb-6 block bg-[#fff2f0] border border-[#ffccc7] p-2 rounded-md font-bold">
                                {passenger.berthType}
                              </Text>
                            </Col>
                          )}
                        </Row>
                        {index < status.passengers.length - 1 && <Divider />}
                      </div>
                    ))}
                    <Row className="mt-4">
                      <Col className="flex justify-end">
                        <CheckCircleOutlined className="text-green-500 text-3xl" />
                        <Text className="italic"> {status.pnrLastUpdated}</Text>
                      </Col>
                    </Row>
                  </div>
                }
                type="info"
              />
            )}
          </Card>
        </div>
        <div className="p-2">
          <Alert
            message="Disclaimer"
            description="This feature has no affiliation with IRCTC. IRCTC will be responsible for any liability occurring due to this information."
            type="warning"
            showIcon
          />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        <FooterUser />
      </Footer>
    </Layout>
  );
};

export default App;
