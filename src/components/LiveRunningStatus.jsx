import React, { useState } from 'react';
import { Table, Input, message, Spin, Card, Typography } from 'antd';
import axios from 'axios';

const { Search } = Input;
const { Text } = Typography;

const TrainData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTrainData = async (trainNumber) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://redbus-backend-whco.onrender.com/api/status?trainNumber=${trainNumber}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to fetch data. Please check the train number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Station Name',
      dataIndex: 'stationName',
      key: 'stationName',
      render: (text, record) => (
        <span>
          {record.isCurrentlyAt && <span>🚂 </span>}
          {text}
        </span>
      ),
    },
    {
      title: 'Station Code',
      dataIndex: 'stationCode',
      key: 'stationCode',
    },
    {
      title: 'Distance From Origin (km)',
      dataIndex: 'distanceFromOrigin',
      key: 'distanceFromOrigin',
    },
    {
      title: 'Scheduled Arrival',
      dataIndex: 'scheduledArrivalTime',
      key: 'scheduledArrivalTime',
    },
    {
      title: 'Actual Arrival',
      dataIndex: 'arrivalTime',
      key: 'arrivalTime',
    },
    {
      title: 'Scheduled Departure',
      dataIndex: 'scheduledDepartureTime',
      key: 'scheduledDepartureTime',
    },
    {
      title: 'Actual Departure',
      dataIndex: 'departureTime',
      key: 'departureTime',
    },
    {
      title: 'Delay (Arrival)',
      dataIndex: 'delayArr',
      key: 'delayArr',
    },
    {
      title: 'Delay (Departure)',
      dataIndex: 'delayDep',
      key: 'delayDep',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Search
        placeholder="Enter Train Number"
        enterButton="Search"
        size="large"
        onSearch={fetchTrainData}
        loading={loading}
      />
      {loading && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Spin size="large" />
        </div>
      )}
      {data && (
        <Card style={{ marginTop: '20px' }} title={`${data.trainName} (${data.trainNumber})`}>
          {data.currentlyAt && (
            <div style={{ marginBottom: '16px', fontWeight: 'bold' }}>
              Currently At: 🚂{data.currentlyAt} ({data.currentlyAtCode})
            </div>
          )}
          {data.lastHaltStation && (
            <div style={{ marginBottom: '16px' }}>
              Last Halt: {data.lastHaltStation} ({data.lastHaltStationCode})
            </div>
          )}
          {data.runningStatus && (
            <div style={{ marginBottom: '16px' }}>
              Running Status: {data.runningStatus.header} - {data.runningStatus.status}
              <Text type="secondary"> ({data.runningStatus.runningStatusMessage})</Text>
            </div>
          )}
          {data.ltsLastUpdated && (
            <div style={{ marginBottom: '16px' }}>
              {data.ltsLastUpdated} {data.ltsLastUpdatedTime}
            </div>
          )}
          {data.cancelledFrom && data.cancelledTo && (
            <div style={{ marginBottom: '16px' }}>
              Cancelled From: {data.cancelledFrom} To: {data.cancelledTo}
            </div>
          )}
          {data.upcomingStation && (
            <div style={{ marginBottom: '16px' }}>
              Upcoming Station: {data.upcomingStation} ({data.upcomingStationCode})
            </div>
          )}
          {data.totalLateMins >= 0 && (
            <div style={{ marginBottom: '16px' }}>
              Total Delay: {data.totalLateMins} minutes
            </div>
          )}
          <Table
            dataSource={data.stations}
            columns={columns}
            rowKey={(record) => record.stationCode}
            pagination={false}
          />
        </Card>
      )}
    </div>
  );
};

export default TrainData;
