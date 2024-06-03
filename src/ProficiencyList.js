import React from 'react';
import { FormGroup, FormControlLabel, Checkbox, TextField, Paper } from '@mui/material';

function ProficiencyList({ proficiency, handleProfList, pBonus, special, scoreToMod }) {

    const handleChange = (eva, index, parent) => {
        handleProfList(index, parent)
    }
    
    function calcBonus(parindex, index) {
        return proficiency[parindex].data[index].prof ?
            pBonus + scoreToMod(special[proficiency[parindex].data[index].parent]) 
            : scoreToMod(special[proficiency[parindex].data[index].parent]);
    }

    return (
        <div>
            <div style={{display:'flex'}}>
                {proficiency && proficiency.map((category, parindex) => (
                    <div key={parindex}>
                        <div style={{padding:'5px'}}>
                            <h3>{category.name}</h3>
                            <FormGroup>
                                {category.data.map((proof, index) => (
                                    <Paper key={`sub-${parindex}-${index}`} sx={{paddingLeft:"5px", paddingTop:'5px'}}>
                                        <FormControlLabel 
                                            key={`Form-${parindex}-${index}`}
                                            control={
                                                <div key={`control-${parindex}-${index}`} style={{display:'flex'}}>
                                                    <Checkbox
                                                        key={`check-${parindex}-${index}`}
                                                        size="small"
                                                        checked={proof.prof}
                                                        onChange={(eva) => handleChange(eva, index, parindex)}
                                                    />
                                                    <TextField 
                                                        key={`text-${parindex}-${index}`}
                                                        variant='standard'
                                                        // label='Modifier'
                                                        sx={{maxWidth:'20px'}}
                                                        disabled
                                                        size='small'
                                                        value={calcBonus(parindex, index)}
                                                    />
                                                </div>
                                            }
                                            label={proof.name + ` (${proficiency[0].data[proficiency[parindex].data[index].parent].name.substring(0,3)})`}
                                        >
                                        </FormControlLabel>
                                    </Paper>
                                ))}
                        </FormGroup>
                    </div>
                    </div>
                ))}
        </div>
    </div>
  );
}

export default ProficiencyList;