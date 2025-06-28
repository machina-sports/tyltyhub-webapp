import { memo } from "react";
import { Reply } from "lucide-react";

interface QuestionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

const QuestionButton = memo(({ text, onClick }: QuestionButtonProps) => (
  <button
    className="flex-shrink-0 whitespace-nowrap text-left px-3 py-2.5 text-sm text-muted-foreground/60 hover:text-muted-foreground hover:bg-secondary/40 active:bg-secondary/60 transition-colors rounded-lg flex items-center group"
    onClick={onClick}
  >
    <Reply className="h-4 w-4 mr-3 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
    {text}
  </button>
))

QuestionButton.displayName = 'QuestionButton'

export default QuestionButton;