import { useEffect, useState } from 'react';
import './App.css';
import Current_data from './components/Current_data';
import Hour_weather from './components/Hour_weather';

// Debounce function
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

function App() {
  const key = import.meta.env.VITE_API_KEY; // Ensure you have the correct environment variable set
  const [location, setLocation] = useState("New York");
  const [lastLocation, setLastLocation] = useState("New York"); // Store last valid location
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const debouncedLocation = useDebounce(location, 300); // Debounce with 500ms delay
  const [forecast_day, setForecastDay] = useState(7); 
  useEffect(() => {
    const fetchData = async (loc) => {
      setLoading(true); // Reset loading state before fetching
      setError(null); // Reset error state before fetching
      const url = `http://api.weatherstack.com/current?access_key=${key}&query=${loc}`;

      try {
        const response = await fetch(url);
        
        // Check if the response is ok (status code 200)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const responseData = await response.json();
        setData(responseData);
        console.log(responseData);
        
        // Update last valid location only if the fetch is successful
        setLastLocation(loc);
      } catch (error) {
        setError(error.message); // Store error message
        console.log("Error: ", error);
      } finally {
        setLoading(false); // Always stop loading regardless of success or failure
      }
    };

    // Fetch data if the debounced location is valid
    if (debouncedLocation) {
      fetchData(debouncedLocation);
    } else if (lastLocation) {
      // If input is cleared, use the last valid location
      fetchData(lastLocation);
    }
  }, [key, debouncedLocation, lastLocation]); // Add location to dependency array

  // Loading and error handling UI
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleChange = (e) => {
    setLocation(e.target.value);
  };
  const handleRange = (e)=>{
    setForecastDay(e.target.value);
  }

  return (
    <>
      <div className='title'>
        <h1>Weather Doctor</h1>
      </div>
      {data && <Current_data data={data} />}
      <div className='input-container'>
      <input 
        type="text" 
        placeholder='Location...' 
        value={location}
        onChange={handleChange} 
        className='location_input'
      />

      <input type = "range" min = '1' max = '7' value = {forecast_day} name ='forecast_days' step = '1' onChange={handleRange}></input>
      </div>
      <Hour_weather city={debouncedLocation || lastLocation} forecast_days= {forecast_day}/>
    </>
  );
}

export default App;
