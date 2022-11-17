import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Select from 'react-select';
function App() {
  const [reportType, setReportType] = useState();
  const [devices, setDevices] = useState([]);
  const [deviceParameters, setDeviceParameters] = useState();
  const [queryData, setQueryData] = useState({
    device: "",
    from: "",
    to: "",
    parameter: ""
  });
  const { device, from, to, parameter } = queryData;
  let options = []
  useEffect(() => {
    if (deviceParameters) {
      deviceParameters.map((item) => {
        options.push({ value: item._id, label: item._id })
      })
    }
  }, [deviceParameters, options]);

  const onInputChange = e => {
    setQueryData({ ...queryData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/device`, { withCredentials: true })
      if (response) {
        setDevices(response.data)
      }
    }
    fetchData();
  }, []);
  const getDeviceParameters = async (deviceId) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/device/device-parameters/` + deviceId, { withCredentials: true })
    if (response) {
      setDeviceParameters(response.data.sort((a, b) => a._id > b._id ? 1 : -1))
    }
  }
  useEffect(() => {
    if (device) {
      getDeviceParameters(device)
    }
  }, [device]);

  const handleSubmit = async (e) => {
    e.preventDefault();

  }
  return (
    <div className="App">
      <div className='container py-5'>
        <h3>Generate Report</h3>
        <div className="row">
          <div className="col-md-12">
            <button className='btn btn-success me-2' onClick={() => setReportType('graph')}>Graph</button>
            <button className='btn btn-info' onClick={() => setReportType('table')}>Table</button>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row mt-2">
            <div className="col-md-2">
              <select className="form-select" name='interval' onChange={onInputChange}>
                <option >Interval</option>
                <option value="default">Default</option>
                <option value="30">30 Min</option>
                <option value="60">1 Hour</option>
                <option value="1440">24 Hours</option>

              </select>
            </div>
            <div className="col-md-2">
              <select className="form-select" name='device' onChange={onInputChange}>
                <option >Select Device</option>
                {devices && devices.length > 0 && devices.map((item, index) => (
                  <option value={item._id} key={index}>{item.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <input type="date" name='from' className='form-control' placeholder='Select start time' onChange={onInputChange} />
            </div>
            <div className="col-md-2">
              <input type="date" name='to' className='form-control' placeholder='Select start time' onChange={onInputChange} />
            </div>
            <div className="col-md-3">
              {/* <select className="form-select" name='parameter[]' onChange={onInputChange} multiple>
                <option >Select Parameter</option>
                {deviceParameters && deviceParameters.length > 0 && deviceParameters.map((item, index) => (
                  <option value={item._id} key={index}>{item._id}</option>
                ))}
              </select> */}
              <Select
                isMulti
                name="colors"
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>
            <div className="col-md-1"> <button className='btn btn-warning' type='submit'>View</button></div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
