import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  Spin,
  Row,
  Col,
  Typography,
  Divider,
  Button,
  Input,
  Alert,
} from "antd";
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
  const [error, setError] = useState("");

  const fetchPnrStatus = async () => {
    if (!pnr) {
      setError("Please enter a PNR number");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `https://7a1f3fef-2acf-48f7-808f-faa9401675a7-00-h3u9shjdvpui.sisko.replit.dev/api/getPnrData?pnrno=${pnr}`,
      );
      if (response.data.errorcode === "712") {
        setError(response.data.errormsg); // Set specific error message
        setStatus(null); // Clear previous status on error
      } else {
        setStatus(response.data);
        setPnr(""); // Clear input after successful fetch
        setError(""); // Clear any previous errors
      }
    } catch (error) {
      console.error("Error fetching PNR status", error);
      setError("Failed to fetch PNR status. Please try again later."); // Display generic error message
      setStatus(null); // Clear previous status on error
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError("");
  };

  return (
    <div className="min-h-screen mx-auto bg-gray-100 flex justify-center items-center">
      <div className="w-full md:w-3/4">
        <Card title="PNR Status" className="bg-white shadow-md rounded-md">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={18}>
              <Input
                placeholder="Enter PNR number"
                value={pnr}
                maxLength={10}
                onChange={(e) => {
                  setPnr(e.target.value);
                  clearError(); // Clear error when input changes
                }}
              />
            </Col>
            <Col xs={24} sm={6}>
              <Button type="primary" onClick={fetchPnrStatus} block>
                Fetch PNR Status
              </Button>
            </Col>
          </Row>
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
              <Spin size="large" />
            </div>
          )}
          {status && (
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
              <Row className="mt-4">
                <Col className="flex justify-end">
                  <CheckCircleOutlined className="text-green-500 text-3xl" />
                </Col>
              </Row>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PnrStatus;
