import React, { useEffect, useState } from 'react';
import ChampionData from '../interface/ChampionData';
import { Button, List, Paper } from '@mui/material';

interface Props {
    champions: ChampionData[];
    onAnswer: (answer: string) => void;
    setHideChampionSelect: (bool: boolean) => void;
}

const SelectChampion: React.FC<Props> = (props) => {
    const [selectableChampions, setSelectableChampions] = useState<ChampionData[]>(props.champions);

    useEffect(() => {
        setSelectableChampions(props.champions);
    }, [props.champions]);

    return (
        <div className="d-flex flex-column mx-auto w-50">
            <Paper style={{maxHeight: 350, overflow: 'auto'}}>
                <List>
                    {selectableChampions.map((championData: ChampionData) => {
                        return (
                            <li className="d-flex flex-column" key={championData.id}>
                                <Button
                                    className="d-flex flex-row justify-content-evenly row"
                                    value={championData.name}
                                    onMouseDown={(e) => props.onAnswer(e.currentTarget.value.toLowerCase())}
                                >
                                    <div className="col-6">
                                        <img
                                            src={championData.icon}
                                            width={50}
                                            height={50}
                                            alt={championData.name}
                                            loading="lazy"
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
    );
};
 
export default SelectChampion;