import React, { useState } from 'react';
import { IconButton, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ClearAllIcon from '@mui/icons-material/ClearAll';

function DeathSaves() {
    const [successes, setSuccesses] = useState(0);
    const [failures, setFailures] = useState(0);

    const handleSuccess = () => {
        if (successes < 3) setSuccesses(successes + 1);
    };

    const handleFailure = () => {
        if (failures < 3) setFailures(failures + 1);
    };

    const handleReset = () => {
        setSuccesses(0);
        setFailures(0);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" onClick={handleSuccess}><AddCircleOutlineIcon color="success" /></IconButton>
            <Typography variant="body1" style={{ marginLeft: '5px' }}>{successes}</Typography>
            <IconButton size="small" onClick={handleFailure}><RemoveCircleOutlineIcon color="error" /></IconButton>
            <Typography variant="body1" style={{ marginLeft: '5px' }}>{failures}</Typography>
            <IconButton size="small" onClick={handleReset} style={{ marginLeft: '10px' }}><ClearAllIcon /></IconButton>
        </div>
    );
}

export default DeathSaves;
