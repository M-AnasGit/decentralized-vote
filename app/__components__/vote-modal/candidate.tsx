import { Candidate as CandidateType } from './constants';

type Props = {
    candidate: CandidateType;
    selected: boolean;
    handleSelectCandidate: () => void;
};

export default function Candidate({ candidate, selected, handleSelectCandidate }: Props) {
    return (
        <div
            className="border-2 border-border px-4 py-2 rounded-md shadow-lg hover:bg-muted cursor-pointer transition-all duration-200 ease-in-out flex items-center gap-4 data-[selected=true]:bg-muted data-[selected=true]:border-primary data-[selected=true]:shadow-md"
            data-selected={selected}
            onClick={handleSelectCandidate}
        >
            <h5 className="font-medium text-lg">{candidate.name}</h5>
            <p className="text-muted-foreground">{candidate.party}</p>
        </div>
    );
}
