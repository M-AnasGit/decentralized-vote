import { LucideIcon } from 'lucide-react';

type Props = {
    Icon: LucideIcon;
    title: string;
};

export default function ProcessBubble({ Icon, title }: Props) {
    return (
        <span className="flex flex-col items-center gap-2">
            <div className="bg-muted p-4 rounded-full">
                <Icon size={32} />
            </div>
            <h5 className="font-medium text-muted-foreground">{title}</h5>
        </span>
    );
}
