import React from "react";

function Sunny({ days }) {
    return (
        <div>
            <h2>Go out on:</h2>
            {days && days.length > 0 ? ( // Check if there are any days
                <ul>
                    {days.map((d, index) => (
                        <li className= 'value' key={index}>{d}</li>
                    ))}
                </ul>
            ) : (
                <p>Looks like bad weather this week! 😭</p> // Message if the days array is empty
            )}
        </div>
    );
}

export default Sunny;
