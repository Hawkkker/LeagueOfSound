import React, { useEffect, useState } from 'react';
import Question from './Question';
import champions from '../assets/champions.json';
import AnswerGiven from '../interface/AnswerGiven';
import { Button } from '@mui/material';

interface QuestionData {
    audioPath: string;
    championName: string;
    spellName: string;
}

const Quiz: React.FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState<QuestionData>();
    const [answersGiven, setAnswersGiven] = useState<AnswerGiven[]>([]);
    const [goodAnswer, setGoodAnswer] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);

    useEffect(() => {
        newQuestion();
    }, []);

    const newQuestion = () => {
        const allAbilitiesWithDetails = champions.flatMap((champion) =>
            champion.spells.length > 0 ?
                champion.spells.map((spell) => ({
                    championName: champion.name, 
                    spellName: spell?.id,  // Include more properties if needed
                    audioPath: champion.name + '/' + spell?.filename,
                })) : []
        );
        const selectedQuestion = allAbilitiesWithDetails[Math.floor(Math.random() * allAbilitiesWithDetails.length)];
        setCurrentQuestion(selectedQuestion);
        setAnswersGiven([]);
        setGoodAnswer(false);
    }

    const handleAnswer = (answer: AnswerGiven) => {
        if (answer.spellName === currentQuestion?.spellName.toLowerCase()) {
            setGoodAnswer(true);
            setScore(score+1);
        }
        if (!answersGiven.some(answerGiven => answerGiven.spellName === answer.spellName)) {
            setAnswersGiven([answer, ...answersGiven]);
        }
    };
 
    return (
        <div className="d-flex justify-content-center align-center text-center flex-column align-items-center">
            <h1 className="text-center">League of Sound</h1>
            <span className="mb-2">Score : {score}</span>
            {goodAnswer ?
            <Button
                className="mb-2"
                onClick={newQuestion}
            >
                Next Ability
            </Button> : null}
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