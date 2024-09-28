import React, { useEffect, useState } from 'react';
import Question from './Question';
import champions from '../assets/champions.json';
import ChampionData from '../interface/ChampionData';
import AnswerGiven from '../interface/AnswerGiven';

interface QuestionData {
    audioPath: string;
    championName: string;
    spellName: string;
}

const Quiz: React.FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState<QuestionData>();
    const [answersGiven, setAnswersGiven] = useState<AnswerGiven[]>([]);
    const [goodAnswer, setGoodAnswer] = useState<boolean>(false);

    useEffect(() => {
        const pickedChampion = champions[Math.floor(Math.random() * champions.length)].name;
        const championData = champions.find((champion: ChampionData) => champion.name === pickedChampion);
        const spellName = championData!.spells[Math.floor(Math.random() * championData!.spells.length)];
        const selectedQuestion = {
            championName: pickedChampion,
            spellName: spellName?.id,
            audioPath: pickedChampion + '/' + spellName?.filename,
        };
        setCurrentQuestion(selectedQuestion);
    }, []);

    const handleAnswer = (answer: AnswerGiven) => {
        if (answer.spellName === currentQuestion?.spellName.toLowerCase()) {
            setGoodAnswer(true);
        }
        if (!answersGiven.some(answerGiven => answerGiven.spellName === answer.spellName)) {
            setAnswersGiven([answer, ...answersGiven]);
        }
    };
 
    return (
        <div>
            <h1 className="text-center">League of Sound</h1>
            {currentQuestion ?
                <Question
                    audioPath={currentQuestion.audioPath}
                    answersGiven={answersGiven}
                    goodAnswer={goodAnswer}
                    onAnswer={handleAnswer}
                />
                : null
            }
        </div>
    )
}
 
export default Quiz;