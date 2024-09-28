import Ability from "./Ability";

interface ChampionData {
    id: string,
    key: string,
    name: string,
    title: string,
    icon: string,
    spells: Ability[]
}

export default ChampionData;