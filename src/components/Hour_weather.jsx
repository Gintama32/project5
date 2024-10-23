import { useEffect, useState } from 'react';
import './hour.css';
import Sunny from './Sunny';

function Hour_weather({ city, forecast_days }) {
    const forecast_key = import.meta.env.VITE_FORECAST_API;
    const headers = ['Date', 'High Temp', 'Low Temp', 'Weather', 'Precipitate'];
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&days=${forecast_days}&key=${forecast_key}`;
    const [data, setData] = useState([]);
    const [days, setDays] = useState([]);
    const [avgtemp, setAvg] = useState(0);
    const [selectedDate, setSelectedDate] = useState(''); // State for selected date

    useEffect(() => {
        const fetch_data = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const jsonData = await response.json();
                setData(jsonData.data || []); 
                const sunnyDays = jsonData.data
                    .filter(info => info.weather.description.toLowerCase() === "clear sky")
                    .map(info => info.datetime);
                setDays([sunnyDays]);
                const sumtemp = jsonData.data.reduce((acc, info) => info.temp + acc, 0);
                const avgtemps = sumtemp / forecast_days; // Corrected variable name
                setAvg(avgtemps.toFixed(2));
            } catch (error) {
                console.log(error);
            }
        };
        fetch_data();
    }, [url]);

    const weatherIcons = {
        sunny: '☀️',
        cloudy: '☁️',
        'few clouds': '🌤️',
        'scattered clouds': '🌤️',
        rainy: '🌧️',
        thunderstorms: '⛈️',
        snowy: '❄️',
        foggy: '🌫️',
        windy: '💨',
        drizzle: '🌧️',
        showers: '🌧️',
        hail: '🌨️',
        'overcast clouds': '☁️',
        'freezing rain': '🌧️',
        other: '🌈', // Default icon for unexpected weather
    };

    // Handle date selection
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    // Filter data based on the selected date
    const filteredData = selectedDate ? data.filter(info => info.datetime === selectedDate) : data;

    return (
        <div className='temp-stats'>
            <div className='hourly-cast'>
                <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={handleDateChange} 
                    placeholder="Select a date"
                />
                <table>
                    <thead>
                        <tr>
                            {headers.map((heading, index) => (
                                <th key={index}>{heading}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((info, index) => (
                            <tr key={index}>
                                <td>{info.datetime}</td> {/* Display date */}
                                <td>{info.high_temp} °C</td> {/* High temperature */}
                                <td>{info.low_temp} °C</td> {/* Low temperature */}
                                <td>{info.weather.description}
                                    <span role="img" aria-label={info.weather.description || 'Default Weather'}>
                                        {weatherIcons[info.weather.description.toLowerCase()] || weatherIcons.other}
                                    </span>
                                </td> {/* Weather description */}
                                <td>{info.precip} mm</td> {/* Precipitation */}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className='avg'>
                    <h3>Average Temp for {forecast_days} days</h3>
                    <p className='value'>{avgtemp} &deg;C</p>
                </div>
            </div>
            <div className='sunny'>
                <Sunny days={days} />
            </div>
        </div>
    );
}

export default Hour_weather;
