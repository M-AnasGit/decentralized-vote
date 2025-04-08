export type Candidate = {
    name: string;
    value: number;
    party: string;
};

export const CANDIDATES: Candidate[] = [
    { name: 'John Doe', value: 1, party: 'PDP' },
    { name: 'Lino Batilome', value: 2, party: 'APC' },
    { name: 'Alice Axe', value: 3, party: 'APGA' },
    { name: 'Bob Marley', value: 4, party: 'ANPP' },
];
