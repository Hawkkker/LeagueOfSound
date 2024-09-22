interface ChampionData {
    id: string,
    key: string,
    name: string,
    title: string,
    icon: string,
    sprite: {
      url: string,
    },
    description: string,
    spells: string[]
}

export default ChampionData;