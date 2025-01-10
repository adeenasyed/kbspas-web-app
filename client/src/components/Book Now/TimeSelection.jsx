import { useState, useEffect } from 'react';
import Grid from "@mui/material/Grid";
import ToggleButton from "@mui/material/ToggleButton";

const buttonWidth = '88px';

function TimeSelection({availableTimes, handleTimeSelection, selectedTimeSlot}) { 
    
    const [numColumns, setNumColumns] = useState(4);
    
    const checkWindowWidth = () => {
        if (window.innerWidth < 284) {
            setNumColumns(1);
        } else if (window.innerWidth >= 284 && window.innerWidth < 390) {
            setNumColumns(2);
        } else if (window.innerWidth >= 390 && window.innerWidth < 600) {
            setNumColumns(3);
        } else { 
            setNumColumns(4);
        }
    };

    useEffect(() => {
        checkWindowWidth();
        window.addEventListener('resize', checkWindowWidth);
        return () => {
          window.removeEventListener('resize', checkWindowWidth);
        };
    }, []);

    const numRows = Math.ceil(availableTimes.length / numColumns);

    return ( 
        <Grid item xs={12} container alignItems="center" justifyContent="center"> 
            {availableTimes && (
                <table>
                    <tbody>
                        {Array.from({ length: numRows }, (_, rowIndex) => (
                            <tr key={rowIndex}>
                                {Array.from({ length: numColumns }, (_, colIndex) => {
                                    const index = rowIndex * numColumns + colIndex;
                                    const timeSlot = availableTimes[index];
                                    return (
                                        <td key={colIndex} style={{padding: '9px'}}>
                                            {(timeSlot && timeSlot.available) ?
                                                (<ToggleButton
                                                    key={timeSlot.startTime}
                                                    value={timeSlot.startTime}
                                                    sx={{ width: buttonWidth }}
                                                    selected={selectedTimeSlot === timeSlot.startTime}
                                                    onChange={handleTimeSelection}
                                                >
                                                    {timeSlot.startTime}
                                                </ToggleButton>) 
                                            : 
                                            (<div style={{width: buttonWidth }}></div>)}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Grid>
    );
}

export default TimeSelection;