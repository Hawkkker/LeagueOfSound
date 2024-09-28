import React, { useEffect, useState } from 'react';
import SelectChampion from './SelectChampion';
import { List, TextField } from '@mui/material';
import ReactAudioPlayer from 'react-audio-player';
import champions from '../assets/champions.json';
import ChampionData from '../interface/ChampionData';
import AnswerGiven from '../interface/AnswerGiven';
import Ability from '../interface/Ability';
 
interface Props {
    audioPath: string;
    answersGiven: AnswerGiven[];
    goodAnswer: boolean;
    onAnswer: (answer: AnswerGiven) => void;
}

interface ChampionDataAnswered {
    championData: ChampionData,
    answeredAbility: Ability
}

const Question: React.FC<Props> = (props) => {
    const [hideChampionSelect, setHideChampionSelect] = useState<boolean>(true);
    const [championQuery, setChampionQuery] = useState<string>('');
    const [availableChampions, setAvailableChampions] = useState<ChampionData[]>(champions);
    const [answersGiven, setAnswersGiven] = useState<ChampionDataAnswered[]>([]);

    useEffect(() => {
        const filteredAnsweredChampions = props.answersGiven.map((answer: AnswerGiven) =>  {
            const champion = champions.find((champion: ChampionData) => champion.id.toLowerCase() === answer.championName.toLowerCase())!;
            const ability = champion?.spells.find((ability: Ability) => ability.id.toLowerCase() === answer.spellName)!;
            
            return {championData: champion, answeredAbility: ability};
        });
        filteredAnsweredChampions.sort((a: ChampionDataAnswered, b: ChampionDataAnswered) => {
            const aIndex = props.answersGiven.findIndex((answer) => answer.spellName.toLowerCase() === a.answeredAbility?.id.toLowerCase());
            const bIndex = props.answersGiven.findIndex((answer) => answer.spellName.toLowerCase() === b.answeredAbility?.id.toLowerCase());

            return bIndex - aIndex;
        });
        const filteredAvailableChampions = champions.filter((championData: ChampionData) => {
            const countChampionName = props.answersGiven.filter((answer) => answer.championName.toLowerCase() === championData.name.toLowerCase()).length;

            return countChampionName !== championData.spells.length;
        });
        setAvailableChampions(filteredAvailableChampions);
        setAnswersGiven(filteredAnsweredChampions);
        if (props.goodAnswer) {
            setHideChampionSelect(true);
        }
        if (filteredAnsweredChampions.length === 0) {
            setChampionQuery('');
        }
    }, [props.answersGiven, props.goodAnswer]);

    const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        const target = event.relatedTarget as HTMLElement | null;
        if (target) {
            return;
        }
        setHideChampionSelect(true);
    }

    return (
        <div className="d-flex justify-content-center align-center text-center flex-column">
            <div>
                <ReactAudioPlayer
                    src={`http://localhost:3000/LeagueOfSound/audio/${props.audioPath}`}
                    title='Guess the ability'
                    controls
                    volume={0.5}
                />
            </div>
            <List>
                {answersGiven.map((answerGiven: ChampionDataAnswered, index: number) => {
                    const isLast = index === answersGiven.length - 1;
                    const cardClass = isLast && props.goodAnswer ? 'bg-success' : 'bg-danger';

                    return (
                        <li className="d-flex justify-content-center flex-column my-1" key={answerGiven.answeredAbility.id}>
                            <div className={`card d-flex flex-row row ${cardClass}`}>
                                <div className="col-6">
                                    <img
                                        src={answerGiven.answeredAbility.icon}
                                        width={50}
                                        height={50}
                                        alt={answerGiven.answeredAbility.id}
                                        loading="eager"
                                    />
                                </div>
                                <div className="col-6 d-flex justify-content-center align-items-center text-white">
                                    <span>{answerGiven.answeredAbility.nameEn}</span>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </List>
            <TextField
                name="searchChampion"
                variant="outlined"
                disabled={props.goodAnswer || props.audioPath.endsWith('undefined')}
                onChange={function (e) {
                    setChampionQuery(e.currentTarget.value);
                    setHideChampionSelect(false)
                }}
                onFocus={function (e) {
                    setChampionQuery(e.currentTarget.value);
                    setHideChampionSelect(false)
                }}
                value={championQuery}
                onBlur={onBlur}
            />
            {!hideChampionSelect ? 
            <SelectChampion championQuery={championQuery.toLowerCase()} answersGiven={props.answersGiven} availableChampions={availableChampions} onAnswer={props.onAnswer} setHideChampionSelect={setHideChampionSelect}></SelectChampion>
            : null}
        </div>
    );
};

export default Question;