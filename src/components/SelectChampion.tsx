import React, { useEffect, useState } from 'react';
import ChampionData from '../interface/ChampionData';
import { Backdrop, Button, Dialog, Fade, List, Paper } from '@mui/material';
import SelectAbility from './SelectAbility';
import AnswerGiven from '../interface/AnswerGiven';

interface Props {
    championQuery: string;
    availableChampions: ChampionData[];
    onAnswer: (answer: AnswerGiven) => void;
    setHideChampionSelect: (bool: boolean) => void;
}

const SelectChampion: React.FC<Props> = (props) => {
    const [selectableChampions, setSelectableChampions] = useState<ChampionData[]>(props.availableChampions);
    const [selectedChampion, setSelectedChampion] = useState<ChampionData>();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        if (!props.championQuery) {
            return setSelectableChampions(props.availableChampions);
        }
        const filteredChampions = props.availableChampions.filter((championData: ChampionData) => 
            championData.name.toLowerCase().includes(props.championQuery)
        );
        setSelectableChampions(filteredChampions);
    }, [props.championQuery, props.availableChampions]);

    const onChampionSelect = ((champion: ChampionData) => {
        props.setHideChampionSelect(false);
        setSelectedChampion(champion);
        handleOpen();
    });

    return (
        <div>
            <div className="d-flex flex-column mx-auto w-50">
                <Paper style={{maxHeight: 350, overflow: 'auto'}}>
                    <List>
                        {selectableChampions.map((championData: ChampionData) => {
                            return (
                                <li className="d-flex flex-column" key={championData.id}>
                                    <Button
                                        className="d-flex flex-row justify-content-evenly row"
                                        value={championData.name}
                                        onMouseDown={() => onChampionSelect(championData)}
                                    >
                                        <div className="col-6">
                                            <img
                                                src={championData.icon}
                                                width={50}
                                                height={50}
                                                alt={championData.name}
                                                loading="eager"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <span>{championData.name}</span>
                                        </div>
                                    </Button>
                                </li>
                            );
                        })}
                    </List>
                </Paper>
            </div>
            {open ? <Dialog
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <div>
                        <SelectAbility champion={selectedChampion} onAnswer={props.onAnswer} closeDialog={handleClose} setHideChampionSelect={props.setHideChampionSelect}></SelectAbility>
                    </div>
                </Fade>
            </Dialog> : null}
        </div>
    );
};
 
export default SelectChampion;