import { Candidate as CandidateType } from '../constants';

type Props = {
    candidate: CandidateType | undefined;
    votes: number | undefined;
};

export default function CandidateResult({ candidate, votes }: Props) {
    if (!candidate) {
        return null;
    }

    return (
        <div className="border-2 border-border px-4 py-2 rounded-md shadow-lg hover:bg-muted cursor-pointer transition-all duration-200 ease-in-out flex items-center justify-between gap-16">
            <section className="flex items-center gap-4">
                <h5 className="font-medium text-lg">{candidate.name}</h5>
                <p className="text-muted-foreground">{candidate.party}</p>
            </section>
            <small className="text-muted-foreground text-base font-medium">
                {!!votes ? votes : 0} {votes === 1 ? 'vote' : 'votes'}
            </small>
        </div>
    );
}
