import { ToolInvocation } from "ai";
import APODResult from "./Apod";
import EONETResult from "./EONET";
import NaturalEventSelect from "./NaturalEventSelect";
import { memo } from "react";
import { APODResponse } from "@/types/nasa-api";
import { GlobeDataArrayResponse } from "@/types/globe";

// Memoized components for each tool type
const MemoizedAPODResult = memo(({ toolCallId, result }: { toolCallId: string; result: APODResponse | null }) => (
  <APODResult key={toolCallId} result={result as APODResponse} />
));

const MemoizedEONETResult = memo(({ toolCallId, result }: { toolCallId: string; result: GlobeDataArrayResponse | null }) => (
  <EONETResult key={toolCallId} result={result as GlobeDataArrayResponse} />
));

MemoizedAPODResult.displayName = 'MemoizedAPODResult';
MemoizedEONETResult.displayName = 'MemoizedEONETResult';

const MultiModalResult = memo(({ toolInvocation }: { toolInvocation: ToolInvocation }) => {
  if (toolInvocation) {
    const isResult = 'result' in toolInvocation;
    switch (toolInvocation.toolName) {
      case 'astronomyPictureOfTheDay':
        return <MemoizedAPODResult toolCallId={toolInvocation.toolCallId} result={isResult ? toolInvocation.result : null} />;
      case 'naturalEventsShowcase':
        return <MemoizedEONETResult toolCallId={toolInvocation.toolCallId} result={isResult ? toolInvocation.result : null} />;
      case 'getNaturalEventType':
        return <NaturalEventSelect key={toolInvocation.toolCallId} toolCallId={toolInvocation.toolCallId} />;
      default:
        return null;
    }
  } 
  return 'Nothin\' to see here, bro'
});

MultiModalResult.displayName = 'MultiModalResult';

export default MultiModalResult;