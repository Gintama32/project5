import '../App.css';

function Current_data({ data }) {
  const { current, location } = data;
  const weatherIcons = {
    sunny: '☀️',
    cloudy: '☁️',
    'partly cloudy': '🌤️',
    rainy: '🌧️',
    thunderstorms: '⛈️',
    snowy: '❄️',
    foggy: '🌫️',
    windy: '💨',
    drizzle: '🌧️',
    showers: '🌧️',
    hail: '🌨️',
    overcast: '☁️',
    'freezing rain': '🌧️',
    other: '🌈', // Default icon for unexpected weather
  };

  // Get current weather description and its icon
  const currentWeather = current ? current.weather_descriptions[0].toLowerCase() : null;
  const weatherIcon = currentWeather ? weatherIcons[currentWeather] || weatherIcons.other : '';
  const local_time = location? location.localtime : "N/A";
  const date = new Date(local_time);
  const options = {hour: "numeric", minute:"numeric",hour12: true}
  const time = date.toLocaleTimeString([],options)
  return (
    <div className="current_data">
      {location && (
        <>
          <h3 className='current'>{location.name}</h3>
          <h4 className='current'>{time}</h4>
          <div className="temp_icon">
            <h3 className='current'>{current?.temperature} &deg;C</h3> <p>({current.weather_descriptions[0]})</p>
            <span role="img" aria-label={currentWeather || 'Default Weather'}>
              {weatherIcon}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default Current_data;
