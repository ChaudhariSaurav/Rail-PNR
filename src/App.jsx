import React, { useState } from "react";
import axios from "axios";
import { Card, Spin, Row, Col, Typography, Divider, Button, Input } from "antd";
import moment from "moment";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const PnrStatus = () => {
  const [pnr, setPnr] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPnrStatus = async () => {
    if (!pnr) {
      alert("Please enter a PNR number");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `https://7a1f3fef-2acf-48f7-808f-faa9401675a7-00-h3u9shjdvpui.sisko.replit.dev/api/getPnrData?pnrno=${pnr}`,
      );
      setStatus(response.data);
      setPnr(""); // Clear input after successful fetch
    } catch (error) {
      console.error("Error fetching PNR status", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pnr-status-container">
      <div className="blur-background">
        <Card
          title="PNR Status"
          className="w-full md:w-3/4"
          style={{
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            background: "linear-gradient(to bottom, #ffffff, #f0f0f0)",
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={18} md={18}>
              <Input
                placeholder="Enter PNR number"
                value={pnr}
                onChange={(e) => setPnr(e.target.value)}
              />
            </Col>
            <Col xs={24} sm={6} md={6}>
              <Button type="primary" onClick={fetchPnrStatus} block>
                Fetch PNR Status
              </Button>
            </Col>
          </Row>
          {loading ? (
            <div className="loading-spinner">
              <Spin size="large" />
            </div>
          ) : status ? (
            <>
              <Row gutter={[16, 16]} className="mt-4">
                <Col xs={24} sm={12}>
                  <Title level={4}>Train Details</Title>
                  <Text>
                    <strong>Train Number:</strong> {status.trainNumber}
                  </Text>
                  <br />
                  <Text>
                    <strong>Train Name:</strong> {status.trainName}
                  </Text>
                  <br />
                  <Text>
                    <strong>Journey Class:</strong> {status.journeyClassName}
                  </Text>
                  <br />
                  <Text>
                    <strong>Overall Status:</strong> {status.overallStatus}
                  </Text>
                </Col>
                <Col xs={24} sm={12}>
                  <Title level={4}>Journey Details</Title>
                  <Text>
                    <ClockCircleOutlined /> Departure:{" "}
                    {moment(status.departureTime).format(
                      "MMMM Do YYYY, h:mm:ss a",
                    )}
                  </Text>
                  <br />
                  <Text>
                    <ClockCircleOutlined /> Arrival:{" "}
                    {moment(status.arrivalTime).format(
                      "MMMM Do YYYY, h:mm:ss a",
                    )}
                  </Text>
                  <br />
                  <Text>
                    <strong>Source:</strong> {status.srcName} ({status.srcCode})
                  </Text>
                  <br />
                  <Text>
                    <strong>Destination:</strong> {status.dstName} (
                    {status.dstCode})
                  </Text>
                  <br />
                  <Text>
                    <strong>Chart Status:</strong> {status.chartStatus}
                  </Text>
                  <br />
                  <Text>
                    <strong>Chart Preparation:</strong> {status.chartPrepMsg}
                  </Text>
                </Col>
              </Row>
              <Divider />
              <Title level={4}>Passengers</Title>
              {status.passengers.map((passenger, index) => (
                <Row key={index} gutter={[16, 16]}>
                  <Col xs={24} sm={8}>
                    <Text>
                      <strong>Name:</strong> {passenger.name}
                    </Text>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Text>
                      <strong>Status:</strong> {passenger.currentStatus}
                    </Text>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Text>
                      <strong>Seat Details:</strong>{" "}
                      {passenger.currentSeatDetails}
                    </Text>
                  </Col>
                </Row>
              ))}
            </>
          ) : null}
        </Card>
      </div>
    </div>
  );
};

export default PnrStatus;
