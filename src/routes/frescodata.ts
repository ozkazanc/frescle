type Area = {
    x: number;
    y: number;
    width: number;
    height: number;
};

type FrescoData = {
    id: number;
    name: string;
    filePath: string;
    words: { [key: string]: Area[] }; 
};


export const frescoData : FrescoData = {
    id: 0,
    name: "Ambassadors",
    filePath: "/Hans_Holbein-The_Ambassadors.jpg",
    words: {
        hand: [{ x: 200, y: 200, width: 80, height: 50 }],
        face: [{ x: 0, y: 0, width: 250, height: 250 }, { x: 250, y: 250, width: 250, height: 250 }]
    }
};