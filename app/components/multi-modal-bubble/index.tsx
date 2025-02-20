import { ToolInvocation } from "ai";
import APODResult from "./Apod";
import EONETResult from "./EONET";
import NaturalEventSelect from "./NaturalEventSelect";

const MultiModalResult = ({ toolInvocation }: { toolInvocation: ToolInvocation }) => {
  if (toolInvocation) {
    const isResult = 'result' in toolInvocation;
    switch (toolInvocation.toolName) {
      case 'astronomyPictureOfTheDay':
        return <APODResult key={toolInvocation.toolCallId} result={isResult ? toolInvocation.result : null} />;
      case 'naturalEventsShowcase':
        return <EONETResult key={toolInvocation.toolCallId} result={isResult ? toolInvocation.result : null} />;
      case 'getNaturalEventType':
        return <NaturalEventSelect key={toolInvocation.toolCallId} toolCallId={toolInvocation.toolCallId} />;
      default:
        return null;
    }
  } 
  return 'Nothin\' to see here, bro'
};

export default MultiModalResult;