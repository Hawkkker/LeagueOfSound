import React from 'react';
import ChampionData from '../interface/ChampionData';
import { Button } from '@mui/material';
import Ability from '../interface/Ability';
import AnswerGiven from '../interface/AnswerGiven';

interface Props {
    champion?: ChampionData;
    onAnswer: (answer: AnswerGiven) => void;
    closeDialog: () => void;
    setHideChampionSelect: (bool: boolean) => void;
}

const SelectAbility: React.FC<Props> = (props, ref) => {
    const onClick = (ability: string) => {
        props.onAnswer({championName: props.champion!.id, spellName: ability});
        props.setHideChampionSelect(true);
        props.closeDialog();
    }

    return (
        <div className="d-flex">
            {props.champion?.spells.map((ability: Ability) => {
                return (
                    <li className="d-flex flex-column" key={ability.id}>
                        <div className="card d-flex align-items-center m-2">
                            <Button
                                className="d-flex flex-column justify-content-evenly"
                                value={ability.id}
                                onClick={(e) => onClick(e.currentTarget.value.toLowerCase())}
                                style={{textTransform: 'none'}}
                            >
                                <img
                                    src={ability.icon}
                                    width={50}
                                    height={50}
                                    alt={ability.id}
                                    loading="eager"
                                />
                                <span>{ability.nameEn}</span>
                            </Button>
                        </div>
                    </li>
                )
            })}
        </div>
    );
};
 
export default SelectAbility;