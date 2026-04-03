import type { ChatMessage } from "../adapters/types";
import { scoreMessage } from "./keywords";

export interface CappingConfig {
  headMessages: number;
  tailMessages: number;
  middleSample: number;
  maxTokens: number;
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function capConversation(
  messages: ChatMessage[],
  config: CappingConfig,
): ChatMessage[] {
  if (messages.length <= config.headMessages + config.tailMessages) {
    return messages;
  }

  const head = messages.slice(0, config.headMessages);
  const tail = messages.slice(-config.tailMessages);
  const middle = messages.slice(config.headMessages, -config.tailMessages);

  const scored = middle.map((message, index) => ({
    message,
    index,
    score: scoreMessage(message.content),
  }));

  scored.sort((a, b) => b.score - a.score || a.index - b.index);
  const selectedMiddle = scored
    .slice(0, config.middleSample)
    .sort((a, b) => a.index - b.index)
    .map((item) => item.message);

  const result = [...head, ...selectedMiddle, ...tail];

  let totalTokens = result.reduce((sum, message) => sum + estimateTokens(message.content), 0);
  while (totalTokens > config.maxTokens && result.length > 4) {
    const midIdx = Math.floor(result.length / 2);
    totalTokens -= estimateTokens(result[midIdx].content);
    result.splice(midIdx, 1);
  }

  return result;
}
