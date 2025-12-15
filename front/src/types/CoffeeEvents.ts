export type CoffeeEvent =
  | ThoughtShownEvent
  | ThoughtMovedEvent
  | ThoughtIgnoredEvent;

export type ZoneName = "floating" | "important" | "not_important";

export interface ThoughtShownEvent {
  type: "THOUGHT_SHOWN";
  payload: {
    thoughtId: string;
  };
}

export interface ThoughtMovedEvent {
  type: "THOUGHT_MOVED";
  payload: {
    thoughtId: string;
    from: ZoneName;
    to: ZoneName;
    moves: number;
    timeToDecisionMs: number;
  };
}

export interface ThoughtIgnoredEvent {
  type: "THOUGHT_IGNORED";
  payload: {
    thoughtId: string;
    visibleDurationMs: number;
  };
}
