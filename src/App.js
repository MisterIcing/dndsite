/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css";
import React from 'react'
import { AppBar, Toolbar, Typography, IconButton, Button, Box, Paper, TextField, MenuItem, FormControlLabel, FormGroup, Checkbox, Tooltip, Snackbar } from "@mui/material";
import Alert from '@mui/material/Alert';
import { Menu } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ProficiencyList from "./ProficiencyList";
import { debounce } from 'lodash';
import DeathSaves from "./DeathSaves";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiceD20, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import ClearAllIcon from '@mui/icons-material/ClearAll';

//#####################################################################
//Things to address
    // Make so textfields update to value but dont do it too often
        // Uncontrol fields?
    // Removing from arrays do not update GUI, but do update array
        // So its just annoying for users more than anything

//Things to still add
    // Spells
    // Equipment block
    // Features block
    // Personality info block
    // Additional notes

//Things to add in terms of features
    // load from database
    // save to database
    // accounts?
    // Companion info block

//Potential future updates
    // Complete spellbook
    // Monster manual
    // Integrate character autogen
    // Item descriptions

//#####################################################################


function App() {
//#####################################################################
//Misc
    //Get sum of input array
    //pls only ints
    const sumArr = (arr) => {
        return arr.reduce((acc, curr) => acc + curr, 0);
    }

    //Get modifier from score
    const scoreToMod = (score) => {
        const res = modifiers.find((elem) => elem.value === score);
        return res ? res.mod : 0;
    }
    //Get score from modifier
    const modToScore = (modifier) => {
        const res = modifiers.find((elem) => elem.mod ===  modifier);
        return res ? res.value : 1;
    }
    
    //Get proficiency bonus based on level
    const getProfBonus = (level) => {
        const res = proficiencies.find((elem) => elem.value === level);
        return res ? res.bonus : 2;
    }

    //Limit a number to another
    //Used to keep armor modifier to 2
    const limit = (num, max = 2, min = 0) => {
        return num >= max ? max : num < min ? min : num;
    }

    //Roll d(n)
    const rollDN = (value) => {
        let cpy = value;
        if(isNaN(parseInt(value, 10))){cpy = 1;}
        
        //Check valid number
        let num = Math.round(parseInt(cpy, 10));
        if(num < 1){num = 1;}

        const gen = Math.round((Math.random() * num) + 1)
        const str = `d${num}: ${gen}`
        setMessage(str);
        setSev('success');
        setPopOpen(true)
        addToArr(str, [pastRolls, setPastRolls])
    }
    //Array management
    const addToArr = (elem, [st, stateSet]) => {
        let cpy = st;
        cpy = [elem, ...cpy];
        if(cpy.length > arrLen){
            cpy.pop();
        }
        stateSet(cpy);
    }

//#####################################################################
//Variables
    let [name, setName] = useState("");
    let [cls, setClass] = useState([""]);
    let [lvl, setLevel] = useState([1]);
    let [race, setRace] = useState("");
    let [alignment, setAlignment] = useState('TN');
    let [special, setSPECIAL] = useState([1,1,1,1,1,1])
    let [pBonus, setPBonus] = useState(2);
    let [speed, setSpeed] = useState(25);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    let [charLvl, setCharLvl] = useState(sumArr(lvl));
    let [otherProfs, setOtherProfs] = useState('');
    let [maxHP, setMaxHP] = useState(1);
    let [arm, setArm] = useState("na");
    let [shield, setShield] = useState(false);
    let [equip, setEquip] = useState(["cc"]);
    
    let [pastRolls, setPastRolls] = useState([""]);
    const arrLen = 20;
    const [popOpen, setPopOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [sev, setSev] = useState('info')
    let [rollDie, setRollDie] = useState(20);
    
    let [proficiency, setProficiency] = useState([
        { name: 'SavingThrows', data: [
            { name: 'Strength', parent: 0, prof: false },
            { name: 'Dexterity', parent: 1, prof: false },
            { name: 'Constitution', parent: 2, prof: false },
            { name: 'Intelligence', parent: 3, prof: false },
            { name: 'Wisdom', parent: 4, prof: false },
            { name: 'Charisma', parent: 5 , prof: false },
        ]},
        { name: 'Skills', data: [
            { name: 'Acrobatics', parent: '1', prof: false },
            { name: 'Animal Handling', parent: '4', prof: false },
            { name: 'Arcana', parent: '3', prof: false },
            { name: 'Athletics', parent: '0', prof: false },
            { name: 'Deception', parent: '5', prof: false },
            { name: 'History', parent: '3', prof: false },
            { name: 'Insight', parent: '4', prof: false },
            { name: 'Intimidation', parent: '5', prof: false },
            { name: 'Investigation', parent: '3', prof: false },
            { name: 'Medicine', parent: '4', prof: false },
            { name: 'Nature', parent: '3', prof: false },
            { name: 'Perception', parent: '4', prof: false },
            { name: 'Performance', parent: '5', prof: false },
            { name: 'Persuassion', parent: '5', prof: false },
            { name: 'Religion', parent: '3', prof: false },
            { name: 'Sleight of Hand', parent: '1', prof: false },
            { name: 'Stealth', parent: '1', prof: false },
            { name: 'Survival', parent: '4', prof: false },
        ]}
    ]);

    const alignments = [
        { value: 'LG', label: 'Lawful Good' },
        { value: 'LN', label: 'Lawful Neutral' },
        { value: 'LE', label: 'Lawful Evil' },
        { value: 'NG', label: 'Neutral Good' },
        { value: 'TN', label: 'True Neutral' },
        { value: 'NE', label: 'Neutral Evil' },
        { value: 'CG', label: 'Chaotic Good' },
        { value: 'CN', label: 'Chaotic Neutral' },
        { value: 'CE', label: 'Chaotic Evil' },
    ];

    const modifiers = [
        { value: 1, mod: -5 },
        { value: 2, mod: -4 },
        { value: 3, mod: -4 },
        { value: 4, mod: -3 },
        { value: 5, mod: -3 },
        { value: 6, mod: -2 },
        { value: 7, mod: -2 },
        { value: 8, mod: -1 },
        { value: 9, mod: -1 },
        { value: 10, mod: 0 },
        { value: 11, mod: 0 },
        { value: 12, mod: +1 },
        { value: 13, mod: +1 },
        { value: 14, mod: +2 },
        { value: 15, mod: +2 },
        { value: 16, mod: +3 },
        { value: 17, mod: +3 },
        { value: 18, mod: +4 },
        { value: 19, mod: +4 },
        { value: 20, mod: +5 },
        { value: 21, mod: +5 },
        { value: 22, mod: +6 },
        { value: 23, mod: +6 },
        { value: 24, mod: +7 },
        { value: 25, mod: +7 },
        { value: 26, mod: +8 },
        { value: 27, mod: +8 },
        { value: 28, mod: +9 },
        { value: 29, mod: +9 },
        { value: 30, mod: +10 },
    ];

    const proficiencies = [
        { value: 1, bonus: +2 },
        { value: 2, bonus: +2 },
        { value: 3, bonus: +2 },
        { value: 4, bonus: +2 },
        { value: 5, bonus: +3 },
        { value: 6, bonus: +3 },
        { value: 7, bonus: +3 },
        { value: 8, bonus: +3 },
        { value: 9, bonus: +4 },
        { value: 10, bonus: +4 },
        { value: 11, bonus: +4 },
        { value: 12, bonus: +4 },
        { value: 13, bonus: +5 },
        { value: 14, bonus: +5 },
        { value: 15, bonus: +5 },
        { value: 16, bonus: +5 },
        { value: 17, bonus: +6 },
        { value: 18, bonus: +6 },
        { value: 19, bonus: +6 },
        { value: 20, bonus: +6 },
    ];

    const armor = [
        {value: "na", label: "None", 
            ac: shield ? 10 + 2 : 10},
        {value: "pd", label: "Padded", 
            ac: shield ? 11 + scoreToMod(special[1]) + 2 : 11 + scoreToMod(special[1])},
        {value: "le", label: "Leather", 
            ac: shield ? 11 + scoreToMod(special[1]) + 2 : 11 + scoreToMod(special[1])},
        {value: "sl", label: "Studded Leather", 
            ac: shield ? 12 + scoreToMod(special[1]) + 2 : 12 + scoreToMod(special[1])},
        {value: "hd", label: "Hide", 
            ac: shield ? 12 + limit(scoreToMod(special[1]),2, -5) + 2 : 12 + limit(scoreToMod(special[1]),2, -5)},
        {value: "cs", label: "Chain Shirt", 
            ac: shield ? 13 + limit(scoreToMod(special[1]),2, -5) + 2 : 13 + limit(scoreToMod(special[1]),2, -5)},
        {value: "sm", label: "Scale mail", 
            ac: shield ? 14 + limit(scoreToMod(special[1]),2, -5) + 2 : 14 + limit(scoreToMod(special[1]),2, -5)},
        {value: "bp", label: "Breastplate", 
            ac: shield ? 14 + limit(scoreToMod(special[1]),2, -5) + 2 : 14 + limit(scoreToMod(special[1]),2, -5)},
        {value: "hp", label: "Half plate", 
            ac: shield ? 15 + limit(scoreToMod(special[1]),2, -5) + 2 : 15 + limit(scoreToMod(special[1]),2, -5)},
        {value: "rm", label: "Ring mail", 
            ac: shield ? 14 + 2 : 14},
        {value: "cm", label: "Chain mail", 
            ac: shield ? 16 + 2 : 16},
        {value: "sp", label: "Splint", 
            ac: shield ? 17 + 2 : 17},
        {value: "pl", label: "Plate", 
            ac: shield ? 18 + 2 : 18},
    ];

    const weapons = [
        {value: "cl", label: "Club", dmg: "1d4", props: "Light"},
        {value: "dg", label: "Dagger", dmg: "1d4", props: "Finesse, Light, Thrown(20/60)"},
        {value: "gc", label: "Greatclub", dmg: "1d8", props: "Two-handed"},
        {value: "ha", label: "Handaxe", dmg: "1d6", props: "Light, Thrown(20/60)"},
        {value: "jv", label: "Javelin", dmg: "1d6", props: "Thrown(30/120)"},
        {value: "lh", label: "Light Hammer", dmg: "1d4", props: "Light, Thrown(20/60)"},
        {value: "mc", label: "Mace", dmg: "1d6", props: "N/A"},
        {value: "qs", label: "Quarterstaff", dmg: "1d6/1d8", props: "Versatile"},
        {value: "si", label: "Sickle", dmg: "1d4", props: "Light"},
        {value: "sp", label: "Spear", dmg: "1d6/1d8", props: "Thrown(20/60), Versatile"},
        {value: "cc", label: "Unarmed", dmg: "1", props: "N/A"},

        {value: "lc", label: "Light Crossbow", dmg: "1d8", props: "Ammo(80/320), Loading, Two-handed"},
        {value: "da", label: "Dart", dmg: "1d4", props: "Finesse, Thrown(20/60)"},
        {value: "sb", label: "Shortbow", dmg: "1d6", props: "Ammo(80/320), Two-handed"},
        {value: "sl", label: "Sling", dmg: "1d4", props: "Ammo(30/120)"},

        {value: "ba", label: "Battleaxe", dmg: "1d8/1d10", props: "Versatile"},
        {value: "fl", label: "Flail", dmg: "1d8", props: "N/A"},
        {value: "gl", label: "Glaive", dmg: "1d10", props: "Heavy, Reach, Two-handed"},
        {value: "ga", label: "Greataxe", dmg: "1d12", props: "Heavy, Two-handed"},
        {value: "gs", label: "Greatsword", dmg: "2d6", props: "Heavy, Two-handed"},
        {value: "hb", label: "Halberd", dmg: "1d10", props: "Heavy, Reach, Two-handed"},
        {value: "la", label: "Lance", dmg: "1d12", props: "Reach, Special"},
        {value: "ls", label: "Longsword", dmg: "1d8/1d10", props: "Versatile"},
        {value: "ma", label: "Maul", dmg: "2d6", props: "Heavy, Two-handed"},
        {value: "ms", label: "Morningstar", dmg: "1d8", props: "N/A"},
        {value: "pi", label: "Pike", dmg: "1d10", props: "Heavy, Reach, Two-handed"},
        {value: "rr", label: "Rapier", dmg: "1d8", props: "Finesse"},
        {value: "sc", label: "Scimitar", dmg: "1d6", props: "Finesse, Light"},
        {value: "ss", label: "Shortsword", dmg: "1d6", props: "Finesse, Light"},
        {value: "tri", label: "Trident", dmg: "1d6/1d8", props: "Thrown(20/60), Versatile"},
        {value: "wp", label: "War Pick", dmg: "1d8", props: "N/A"},
        {value: "wh", label: "Warhammer", dmg: "1d8/1d10", props: "Versatile"},
        {value: "wp", label: "Whip", dmg: "1d4", props: "Finesse, Reach"},

        {value: "bg", label: "Blowgun", dmg: "1", props: "Ammo(25/100), Loading"},
        {value: "ha", label: "Hand Crossbow", dmg: "1d6", props: "Ammo(30/120), Light, Loading"},
        {value: "he", label: "Heavy Crossbow", dmg: "1d10", props: "Ammo(100/400), Heavy, Loading, Two-handed"},
        {value: "lb", label: "Longbow", dmg: "1d8", props: "Ammo(150/600), Heavy, Two-handed"},
        {value: "nt", label: "Net", dmg: "0", props: "Special, Thrown(5/15)"},
    ]

    //May use to disable boxes, but may be unecessary
    let [lock, setLock] = useState(false);

//#####################################################################
// Appbar functions
    //Roll outcome handling
    const handleSnackClose = (eva, reason) => {
        if(reason === 'clickaway'){return}
        setPopOpen(false);
    }

    //Set roll die
    const handleDie = (eva) => {
        setRollDie(parseInt(eva.target.value));
    }

    //Reset roll die
    const handleReset = (eva) => {
        setRollDie(20);
    }

//#####################################################################
//Name text handling
    //Name change
    const debouncedHandlNameChange = debounce((value) => {
        setName(value);
    }, 1000);
    const handleNameChange = (eva) => {
        const val = eva.target.value
        debouncedHandlNameChange(val);
    }
    useEffect(() => {
        console.log("Update Name: ", name)
    }, [name]);

//#####################################################################
//Class & level text handling
    //Class change
    const debouncedClass = debounce((value, index) => {
        const cpy = [...cls];
        cpy[index] = value;
        setClass(cpy);
    }, 1000);
    const handleClassChange = (eva, index) => {
        debouncedClass(eva.target.value, index)
    }
    //Level change
    const handleLevelChange = (eva, index) => {
        //Check valid string
        if(isNaN(parseInt(eva.target.value, 10))){return;}
        
        //Check valid number
        let num = Math.round(parseInt(eva.target.value, 10));
        if(num < 1){num = 1;}
        else if(num > 20){num = 20;}

        //Rebuild lvl array
        const cpy = [...lvl];
        cpy[index] = num;
        const sum = sumArr(cpy);
        if(sum > 20){return;}

        //Only change if total level is less than max char 20
        setLevel(cpy);
        setCharLvl(sum);
    }
    //Adding class/level
    const handleAddClass = (eva) => {
        //Check bounds for level
        if(sumArr([...lvl, 1]) > 20){alert("Max level cap reached"); return;}

        //Add class/level/character level
        setClass([...cls, ""]);
        setLevel([...lvl, 1]);
        setCharLvl(sumArr([...lvl, 1]));
        setFocusedIndex(cls.length);
    }
    //Removing class/level
    const handleMinusClass = (eva, index) => {
        if (index === focusedIndex) {
            setFocusedIndex(-1);
        } else if (index < focusedIndex) {
            setFocusedIndex(focusedIndex - 1);
        }

        //Filter out removed element
        const newCls = cls.filter((_,i) => i !== index);
        const newLvl = lvl.filter((_,i) => i !== index);

        //Save class/level/character level
        setClass(newCls);
        setLevel(newLvl);
        setCharLvl(sumArr(newLvl));
    }
    //Focus needed for changing the text
    const inputRefs = useRef([]);
    useEffect(() => {
        if (focusedIndex !== -1 && inputRefs.current[focusedIndex]) {
            inputRefs.current[focusedIndex].focus();
        }
    }, [focusedIndex]);
    //Class/level debug
    useEffect(() => {
        setPBonus(getProfBonus(charLvl));
        console.log("Update Class: ", cls, "\nUpdate Level: ", lvl, "\nUpdate Character Level: ", charLvl);
    }, [cls, lvl, charLvl]);

//#####################################################################
//Race/Alignment changes
    //Race change
    const debouncedHandlRace = debounce((value) => {
        setRace(value);
    }, 1000);
    const handleRaceChange = (eva) => {
        const val = eva.target.value;
        debouncedHandlRace(val);
    }

    //Alignment change
    const handleAlignmentChange = (eva) => {
        setAlignment(eva.target.value);
    }
    useEffect(() => {
        console.log("Update Race: ", race, "\nUpdate Alignment: ", alignment);
    }, [race, alignment])

//#####################################################################
//Ability score modifications
    //Strength
    const handleStr = (eva) => {
        const value = eva.target.value;
        //Check valid string
        if(isNaN(parseInt(value, 10))){return;}
        
        //Check valid number
        let num = Math.round(parseInt(value, 10));
        if(num < 1){num = 1;}
        else if(num > 30){num = 30;}

        //Save strength
        let cpy = [...special];
        cpy[0] = num;
        setSPECIAL(cpy);
    }

    const handleDex = (eva) => {
        const value = eva.target.value;
        //Check valid string
        if(isNaN(parseInt(value, 10))){return;}
        
        //Check valid number
        let num = Math.round(parseInt(value, 10));
        if(num < 1){num = 1;}
        else if(num > 30){num = 30;}

        //Save dexterity
        let cpy = [...special];
        cpy[1] = num;
        setSPECIAL(cpy);
    }

    const handleCon = (eva) => {
        const value = eva.target.value;
        //Check valid string
        if(isNaN(parseInt(value, 10))){return;}
        
        //Check valid number
        let num = Math.round(parseInt(value, 10));
        if(num < 1){num = 1;}
        else if(num > 30){num = 30;}

        //Save constitution
        let cpy = [...special];
        cpy[2] = num;
        setSPECIAL(cpy);
    }

    const handleInt = (eva) => {
        const value = eva.target.value;
        //Check valid string
        if(isNaN(parseInt(value, 10))){return;}
        
        //Check valid number
        let num = Math.round(parseInt(value, 10));
        if(num < 1){num = 1;}
        else if(num > 30){num = 30;}

        //Save intelligence
        let cpy = [...special];
        cpy[3] = num;
        setSPECIAL(cpy);
    }

    const handleWis = (eva) => {
        const value = eva.target.value;
        //Check valid string
        if(isNaN(parseInt(value, 10))){return;}
        
        //Check valid number
        let num = Math.round(parseInt(value, 10));
        if(num < 1){num = 1;}
        else if(num > 30){num = 30;}

        //Save wisdom
        let cpy = [...special];
        cpy[4] = num;
        setSPECIAL(cpy);
    }

    const handleCha = (eva) => {
        const value = eva.target.value;
        //Check valid string
        if(isNaN(parseInt(value, 10))){return;}
        
        //Check valid number
        let num = Math.round(parseInt(value, 10));
        if(num < 1){num = 1;}
        else if(num > 30){num = 30;}

        //Save charisma
        let cpy = [...special];
        cpy[5] = num;
        setSPECIAL(cpy);
    }
    useEffect(() => {
        console.log("Update SPECIAL: ", special)
    }, [special])

//#####################################################################
//AC/Health/Weaponry section changes
    //Changes to AC
    //All changes displayed in selction menu
    const handleArmorChange = (eva) => {
        setArm(eva.target.value)
    }
    //Add shield bonus
    const handleShield = (eva) => {
        setShield(!shield);
    }

    //Get initiative
    function getInit() {
        //Extract if proficient in dexterity
        let isProf = false
        for(const cat of proficiency){
            if(cat.name === 'SavingThrows'){
                for(const subCat of cat.data){
                    if(subCat.name === 'Dexterity'){
                        isProf = subCat.prof;
                    }
                }
            }
        }
        return isProf ? scoreToMod(special[1]) + pBonus : scoreToMod(special[1]);
    };

    //Speed change
    const handleSpeed = (eva) => {
        const value = eva.target.value;
        //Check valid string
        if(isNaN(parseInt(value, 10))){return;}

        //Check valid number
        let num = Math.round(parseInt(value, 10));
        if(num < 0){num = 0;} 
        else if(num > 120){num = 120;}

        //Save speed
        setSpeed(num);
    }

    //HP change
    const debouncedMaxHP = debounce((value) => {
        //Save HP
        setMaxHP(value);
    }, 1000);
    const handleMaxHP = (eva) => {
        const value = eva.target.value;
        //Check valid string
        if(isNaN(parseInt(value, 10))){return;}

        //Check valid number
        let num = Math.round(parseInt(value, 10));
        if(num < 0){num = 0;} 
        else if(num > 120){num = 120;}

        debouncedMaxHP(num);
    }

    //Handle Weapon Changing w/array
    const handleWeaponSelect = (eva, index) => {
        let cpy = [...equip];
        cpy[index] = eva.target.value;
        setEquip(cpy);
    }
    //Get damage dice
    const getDmg = (name) => {
        const weapon = weapons.find(wp => wp.value === name);
        const dmg = weapon ? weapon.dmg : 1;
        return dmg;
    }
    //Get other properties
    const getDescr = (name) => {
        const weapon = weapons.find(wp => wp.value === name);
        const descr = weapon ? weapon.props : "N/A"
        return descr
    }
    //Add Equipment
    const handleAddEquip = ((eva) => {
        setEquip([...equip, "cc"]);
    })
    //Remove Equipment
    const handleMinusEquip = ((eva, index) => {
        const newEquip = equip.filter((_,i) => i !== index);
        setEquip(newEquip);
    })

    useEffect(() => {
        const ac = armor.find(a => a.value === arm)
        console.log("Update AC: ", ac.ac, `\nUpdate Speed: `, speed, `\nUpdate Max Health: `, maxHP, `\nWeapons: `, equip)
    }, [arm, speed, maxHP, equip])

//#####################################################################
//Proficiency list changes
    //Main list handling    
    const handleProfList = (index, parent) => {
        let cpy = [...proficiency];
        cpy[parent].data[index].prof = !cpy[parent].data[index].prof;
        setProficiency(cpy);
    }
    useEffect(() => {
        console.log("Update Proficiencies: ", proficiency);
    }, [proficiency])

//#####################################################################
//Various text boxes
    //Other proficiency box
    const debouncedHandleOP = debounce((value) => {
        setOtherProfs(value);
    }, 1000);
    const handleOtherProfs = (eva) => {
        const val = eva.target.value;
        debouncedHandleOP(val);
    }
    useEffect(() => {
        console.log('Update Other Proficencies: ', otherProfs);
    }, [otherProfs])

//#####################################################################
//Return objects
    return (
        <div className="App" style={{}}>
            <Box sx={{flexGrow: 1}}>
                <AppBar position="fixed" sx={{backgroundColor:"maroon"}}>
                    <Toolbar>
                        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                            <Menu />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            5e Character Sheet
                        </Typography>
                        <Paper sx={{padding:'5px'}}>
                            <TextField
                                id="die"
                                label="Die"
                                variant="standard"
                                color="warning"
                                value={rollDie}
                                type="number"
                                sx={{maxWidth:"60px"}}
                                focused
                                size="small"
                                onChange={handleDie}
                            ></TextField>
                            <IconButton onClick={() => rollDN(rollDie)}>
                                <FontAwesomeIcon icon={faDiceD20} />
                            </IconButton>
                            <Tooltip
                                title={
                                    <React.Fragment>
                                        {pastRolls.map((roll, index) => (
                                            <div key={index}>
                                                {roll}
                                            </div>
                                        ))}
                                    </React.Fragment>
                                }
                            >
                                <IconButton>
                                    <FontAwesomeIcon icon={faCaretDown} />
                                </IconButton>
                            </Tooltip>
                            <IconButton size="small" onClick={handleReset} style={{ marginLeft: '10px' }}><ClearAllIcon /></IconButton>
                        </Paper>
                    </Toolbar>
                </AppBar>
            </Box>
            <Paper variant="outlined" sx={{borderBlockColor:'maroon', backgroundColor:"#8f8f8f", margin:"10px", marginLeft:'20px', marginRight:'20px', padding:"15px", marginTop:'75px'}}>
                <Snackbar 
                    open={popOpen} 
                    autoHideDuration={5000} 
                    onClose={handleSnackClose} 
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    sx={{marginTop:'-15px', marginRight:'190px'}}
                >
                    <Alert onClose={handleSnackClose} severity={sev}>
                        {message}
                    </Alert>
                </Snackbar>
                <div key="layer1" style={{display:'flex'}}>
                    <Paper sx={{display:'flex'}}>
                        <Paper sx={{display:'flex', padding:"10px"}} type="outlined">
                            <TextField  
                                label="Name" 
                                onChange={handleNameChange} 
                                sx={{}}
                            ></TextField>
                            <TextField 
                                value={charLvl}
                                disabled
                                sx={{maxWidth:'90px'}}
                                label="Total Level"
                            ></TextField>
                            <TextField 
                                value={pBonus}
                                disabled
                                sx={{maxWidth:'90px'}}
                                label="Prof Bonus"
                            ></TextField>
                        </Paper>
                        {cls.map((val, index, arr) => {
                            return <Paper key={`obj-${index}`} sx={{display:'flex', padding:"10px", outlineColor:'black'}} type="outlined">
                                <TextField 
                                    key={`cls-${index}`} 
                                    defaultValue={arr[index]} 
                                    label="Class" 
                                    onChange={(eva) => handleClassChange(eva, index)} 
                                    inputRef={el => inputRefs.current[index] = el}
                                    sx={{}}
                                >
                                </TextField>
                                <TextField 
                                    key={`lvl-${index}`} 
                                    value={lvl[index]} 
                                    label="Level" 
                                    type="number"
                                    sx={{maxWidth:'70px'}}
                                    onChange={(eva) => handleLevelChange(eva, index)}
                                >
                                </TextField>
                                <IconButton 
                                    key={`minus-${index}`} 
                                    onClick={(eva) => handleMinusClass(eva, index)} 
                                    sx={{}}
                                >
                                    <RemoveCircleOutlineIcon />
                                </IconButton>
                            </Paper>
                        })}
                        <IconButton onClick={handleAddClass}>
                            <AddCircleOutlineIcon />
                        </IconButton>
                    </Paper>
                </div>
                <div key="layer2" style={{display:'flex'}}>
                    <Paper sx={{display:"flex", padding:'10px'}}>
                        <TextField 
                            key="race"
                            label="Race"
                            type="standard"
                            onChange={handleRaceChange}
                        ></TextField>
                        <div style={{width:"10px"}}></div>
                        <TextField
                            key="alignment"
                            label="Alignment"
                            select
                            defaultValue="TN"
                            onChange={handleAlignmentChange}
                            SelectProps={{autoWidth:true}}
                        >
                            {alignments.map((option) => {
                                return <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            })}
                        </TextField>
                    </Paper>
                </div>
                <div key="layer3" style={{display:'flex'}}>
                    <Paper sx={{display:"flex", padding:'10px', justifyContent:'space-between'}}>
                        <div key="L3left" style={{maxWidth:"33%"}}>
                            <Paper sx={{padding:'10px', paddingTop:'1px'}}>
                                <h3>Ability Scores</h3>
                                <div key="strLine" style={{display:'flex', paddingTop:'10px'}}>
                                    <TextField
                                        key="str"
                                        label="Strength"
                                        type="number"
                                        value={special[0]}
                                        onChange={handleStr}
                                    />
                                    <TextField 
                                        key="strMod"
                                        label="Modifier"
                                        disabled
                                        value={scoreToMod(special[0])}
                                    />
                                </div>
                                <div key='dexLine' style={{display:'flex', paddingTop:'10px'}}>
                                <TextField
                                        key="dex"
                                        label="Dexterity"
                                        type="number"
                                        value={special[1]}
                                        onChange={handleDex}
                                    />
                                    <TextField 
                                        key="dexMod"
                                        label="Modifier"
                                        disabled
                                        value={scoreToMod(special[1])}
                                    />
                                </div>
                                <div key="conLine" style={{display:'flex', paddingTop:'10px'}}>
                                    <TextField
                                        key="con"
                                        label="Constitution"
                                        type="number"
                                        value={special[2]}
                                        onChange={handleCon}
                                    />
                                    <TextField 
                                        key="strMod"
                                        label="Modifier"
                                        disabled
                                        value={scoreToMod(special[2])}
                                    />
                                </div>
                                <div key="intLine" style={{display:'flex', paddingTop:'10px'}}>
                                    <TextField
                                        key="int"
                                        label="Intelligence"
                                        type="number"
                                        value={special[3]}
                                        onChange={handleInt}
                                    />
                                    <TextField 
                                        key="intMod"
                                        label="Modifier"
                                        disabled
                                        value={scoreToMod(special[3])}
                                    />
                                </div>
                                <div key="wisLine" style={{display:'flex', paddingTop:'10px'}}>
                                    <TextField
                                        key="wis"
                                        label="Wisdom"
                                        type="number"
                                        value={special[4]}
                                        onChange={handleWis}
                                    />
                                    <TextField 
                                        key="wisMod"
                                        label="Modifier"
                                        disabled
                                        value={scoreToMod(special[4])}
                                    />
                                </div>
                                <div key="chaLine" style={{display:'flex', paddingTop:'10px'}}>
                                    <TextField
                                        key="cha"
                                        label="Charisma"
                                        type="number"
                                        value={special[5]}
                                        onChange={handleCha}
                                    />
                                    <TextField 
                                        key="chaMod"
                                        label="Modifier"
                                        disabled
                                        value={scoreToMod(special[5])}
                                    />
                                </div>
                            </Paper>
                            <Paper sx={{padding:'10px', paddingTop:'1px'}}>
                                <TextField 
                                    key='profPlus'
                                    sx={{marginTop:'20px', width:'100%'}}
                                    multiline
                                    label='Other Proficiencies'
                                    // value={otherProfs}
                                    onChange={handleOtherProfs}
                                />
                            </Paper>
                        </div>
                        <div key="L3Center" style={{maxWidth:"33%", padding:'10px', paddingTop:'1px'}}>
                            <Paper sx={{padding:'10px', paddingTop:'1px'}}>
                                <h3>Offense</h3>
                                <Paper sx={{display:'flex'}}>
                                    <TextField
                                        key="armor"
                                        label="armor"
                                        select
                                        value={arm}
                                        SelectProps={{autoWidth:true}}
                                        sx={{minWidth:'200px'}}
                                        onChange={handleArmorChange}
                                    >
                                        {armor.map((option) => {
                                            return <MenuItem key={option.value} value={option.value}>
                                                {option.label} ({option.ac})
                                            </MenuItem>
                                        })}
                                    </TextField>
                                    <FormGroup
                                        sx={{marginLeft:'10px', marginTop:'7px'}}
                                    >
                                        <FormControlLabel
                                            control ={
                                                <Checkbox 
                                                    key='shield'
                                                    size='small'
                                                    checked={shield}
                                                    onChange={handleShield}
                                                />
                                            } 
                                            label='Shield'
                                        >
                                        </FormControlLabel>
                                    </FormGroup>
                                    <TextField 
                                        key='init'
                                        label='Initiative'
                                        disabled
                                        value={getInit()}
                                    />
                                    <TextField 
                                        key='speed'
                                        label='Speed'
                                        type='number'
                                        value={speed}
                                        onChange={handleSpeed}
                                    />
                                </Paper>
                                <Paper sx={{display:'flex', paddingTop:'10px'}}>
                                    <TextField 
                                        key='health'
                                        type='number'
                                        label='Current HP'
                                        defaultValue={maxHP}
                                    />
                                    <TextField 
                                        key='maxHP'
                                        type='number'
                                        label='Max HP'
                                        value={maxHP}
                                        onChange={handleMaxHP}
                                    />
                                    <Paper sx={{display:'flex'}}>
                                        <DeathSaves />
                                    </Paper>
                                </Paper>
                                <Paper
                                    sx={{paddingTop:'10px'}}
                                >
                                    <div style={{display:'flex'}}>
                                        <h3>Weapon List</h3>
                                        <IconButton onClick={handleAddEquip}>
                                            <AddCircleOutlineIcon />
                                        </IconButton>
                                    </div>
                                    {equip.map((inv, index) => {
                                        return (
                                            <div style={{display:'flex', marginTop:'10px'}} key={`${index}-div`}>
                                                <TextField
                                                        key={`${index}-Weapon`}
                                                        label="Weapon"
                                                        select
                                                        value={equip[index]}
                                                        SelectProps={{autoWidth:true}}
                                                        sx={{minWidth:'200px'}}
                                                        onChange={(eva) => {handleWeaponSelect(eva, index)}}
                                                    >
                                                {weapons.map((option, windex) => {
                                                    return (
                                                        <MenuItem key={`${windex}-${option.value}`} value={option.value}>
                                                        {option.label}
                                                        </MenuItem>
                                                    )
                                                })}
                                                </TextField>
                                                <TextField
                                                    key={`${index}-dmg`}
                                                    label="Damage"
                                                    disabled
                                                    sx={{maxInlineSize:'115px'}}
                                                    value={getDmg(equip[index])}
                                                ></TextField>
                                                <TextField
                                                    key={`${index}-props`}
                                                    label="Properties"
                                                    disabled
                                                    multiline
                                                    value={getDescr(equip[index])}
                                                ></TextField>
                                                <IconButton 
                                                    key={`minus-${index}`} 
                                                    onClick={(eva) => handleMinusEquip(eva, index)} 
                                                >
                                                    <RemoveCircleOutlineIcon />
                                                </IconButton>
                                            </div>
                                        )
                                    })}
                                </Paper>
                            </Paper>
                        </div>
                        <div key="L3Right" style={{maxWidth:"33%"}}>
                            <Paper sx={{padding:'10px', paddingTop:'1px'}}>
                                <h3>Proficiencies</h3>
                                <ProficiencyList 
                                    proficiency={proficiency}
                                    handleProfList={handleProfList}
                                    pBonus={pBonus}
                                    special={special}
                                    scoreToMod={scoreToMod}
                                />
                            </Paper>
                        </div>
                    </Paper>
                </div>
            </Paper>
        </div>
    );
}

export default App;
