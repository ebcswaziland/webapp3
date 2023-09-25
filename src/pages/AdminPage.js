import React, { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import Layout from "../components/Layout";



function AdminPage() {

  const [loading, setLoading] = React.useState(false);

  const [selectedOption, setSelectedOption] = useState(null);



  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    // Ensure that 'mymapData' is available in the component's state or retrieved from localStorage.
    const mymapData = JSON.parse(localStorage.getItem('mymapData'));
    const mymapData2 = JSON.parse(localStorage.getItem('mymapData2'));


    if (mymapData && mymapData2) {
      // Retrieve the value associated with the selected key
      const selectedValue = mymapData[selectedOption];
      const selectedValue2 = mymapData2[selectedOption];


      // Now, you have both the selected key and its associated value
      console.log("Selected option:", selectedOption);
      console.log("Selected value:", selectedValue);
      localStorage.setItem('mypolling', selectedValue);
      localStorage.setItem('mypolling2', selectedValue2);
      localStorage.setItem('mystation', selectedOption);

    }

    window.location.href = "/results";

  };


  // const [selectedOption, setSelectedOption] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState([]);

  useEffect(() => {
    // Retrieve and parse 'mymapData' from localStorage
    const mymapData = JSON.parse(localStorage.getItem('mymapData'));

    if (mymapData) {
      // Extract the keys from 'mymapData' and store them in the dropdownOptions state
      const keys = Object.keys(mymapData);
      setDropdownOptions(keys);
    }
  }, []);

  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    <Layout loading={loading}>
      <Tabs
        defaultActiveKey="mps"
        id="uncontrolled-tab-example"
        className="mb-3 mt-6"
      >

        <Tab eventKey="mps" title="MY POLLLINGS">

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '20vh' }}>
            <form
              onSubmit={handleFormSubmit}
              style={{
                width: '80%',
                maxWidth: '600px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div style={{ marginBottom: '10px', width: '100%' }}>
                <select
                  value={selectedOption}
                  onChange={handleDropdownChange}
                  style={{
                    width: '100%',
                    padding: '10px', // Add this property
                    border: '1px solid #ccc', // Example border style
                  }}
                >
                  <option value="">FIND MY POLLINGS</option>
                  {dropdownOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ width: '100%' }}>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    backgroundColor: 'blue',
                    color: 'white',
                    padding: '10px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  GET POLLING
                </button>
              </div>
            </form>
          </div>


        </Tab>

      </Tabs>
    </Layout>
  );
}

export default AdminPage;
