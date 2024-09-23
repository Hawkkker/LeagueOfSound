import React, { useEffect, useState } from 'react';
import SelectChampion from './SelectChampion';
import { List, TextField } from '@mui/material';
import ReactAudioPlayer from 'react-audio-player';
import champions from '../assets/champions.json';
import ChampionData from '../interface/ChampionData';
 
interface Props {
    audioPath: string;
    answersGiven: string[];
    goodAnswer: boolean;
    onAnswer: (answer: string) => void;
}

const Question: React.FC<Props> = (props) => {
    const [hideChampionSelect, setHideChampionSelect] = useState<boolean>(true);
    const [selectableChampions, setSelectableChampions] = useState<ChampionData[]>(champions);
    const [availableChampions, setAvailableChampions] = useState<ChampionData[]>(champions);
    const [answersGiven, setAnswersGiven] = useState<ChampionData[]>([]);

    useEffect(() => {
        const filteredAnsweredChampions = champions.filter((championData: ChampionData) => 
            props.answersGiven.includes(championData.name.toLowerCase())
        );
        filteredAnsweredChampions.sort((a: ChampionData, b: ChampionData) => 
            props.answersGiven.indexOf(b.name.toLowerCase()) - props.answersGiven.indexOf(a.name.toLowerCase())
        );
        const filteredAvailableChampions = champions.filter((championData: ChampionData) => 
            !props.answersGiven.includes(championData.name.toLowerCase())
        );
        setAvailableChampions(filteredAvailableChampions);
        setAnswersGiven(filteredAnsweredChampions);
        if (props.goodAnswer) {
            setHideChampionSelect(true);
        }
    }, [props.answersGiven, props.goodAnswer]);

    function filterChampions(championName: string) {
        if (!championName) {
            return setSelectableChampions(availableChampions);
        }
        const filteredChampions = availableChampions.filter((championData: ChampionData) => 
            championData.name.toLowerCase().includes(championName)
        );
        setSelectableChampions(filteredChampions);
    }

    return (
        <div className="d-flex justify-content-center align-center text-center flex-column">
            <div>
                <ReactAudioPlayer
                    src={`/audio/${props.audioPath}`}
                    controls
                    volume={0.5}
                />
            </div>
            <List>
                {answersGiven.map((championData: ChampionData, index: number) => {
                    const isLast = index === answersGiven.length - 1;
                    const cardClass = isLast && props.goodAnswer ? 'bg-success' : 'bg-danger';
                    
                    return (
                        <li className="d-flex justify-content-center my-1" key={championData.id}>
                            <div className={`card d-flex flex-row w-25 row ${cardClass}`}>
                                <div className="col-6">
                                    <img
                                        src={championData.icon}
                                        width={50}
                                        height={50}
                                        alt={championData.name}
                                        loading="lazy"
                                    />
                                </div>
                                <div className="col-6 d-flex justify-content-center align-items-center text-white">
                                    <span>{championData.name}</span>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </List>
            <TextField
                name="searchChampion"
                variant="outlined"
                disabled={props.goodAnswer}
                onChange={function (e) {
                    filterChampions(e.currentTarget.value.toLowerCase());
                    setHideChampionSelect(false)
                }}
                onFocus={function (e) {
                    filterChampions(e.currentTarget.value.toLowerCase());
                    setHideChampionSelect(false)
                }}
                onBlur={() => setHideChampionSelect(true)}
            />
            {!hideChampionSelect ? <SelectChampion champions={selectableChampions} onAnswer={props.onAnswer} setHideChampionSelect={setHideChampionSelect}></SelectChampion> : null}
        </div>
    );
};

export default Question;