import { Ending, MemoThesis } from '@/lib/game/types';

export const ENDINGS: Ending[] = [
  {
    id: 'A',
    title: 'The Whole Archipelago',
    subtitle: 'A burden that lesser devices only conceal',
    trigger: 'whole_archipelago',
    tiebreakerStat: 'filipinoEliteSupport',
    tiebreakerHigh: {
      reaction: 'Hay reads the memorandum twice, crossing out only a phrase that sounds too much like triumph. Cortelyou says nothing for several seconds — his way of admitting the paper may travel upward.',
      narration: 'The memorandum does not promise innocence. It promises responsibility, local collaboration, and a civil administration that must begin almost as soon as the treaty ink dries.',
      mckinleyLine: 'If we do this, we must do it without swagger.',
      hayLine: 'Then Paris may yet be given a policy rather than a mood.',
      epilogue: 'The Treaty of Paris was signed on December 10, 1898. The United States paid Spain $20 million for the Philippines. McKinley would later say he had knelt in prayer before deciding — and that Providence had shown him no other course. The Philippine-American War began on February 4, 1899, and lasted until 1902 in its formal phase. Over 200,000 Filipino civilians died. The islands remained an American territory until 1946.',
    },
    tiebreakerLow: {
      reaction: 'The paper reaches upward, but its language about order runs ahead of its language about consent.',
      narration: 'The route is chosen. The map clarifies. The politics darken.',
      mckinleyLine: 'This may be necessary.',
      hayLine: 'Necessary measures often arrive with preventable enemies attached to them.',
      epilogue: 'The United States took the archipelago. The Philippine-American War that followed killed more than 200,000 Filipino civilians. Emilio Aguinaldo was captured in 1901. The Philippines gained independence on July 4, 1946 — nearly half a century after October 1898.',
    },
    historicalGrounding: "Greene's argument: restoration to Spain means civil war, independence means anarchy, protectorates become practical control, retaining only Luzon invites future intervention. McKinley ultimately chose this course.",
  },
  {
    id: 'B',
    title: 'Protectorate Without a Crown',
    subtitle: 'A government that is and is not sovereign',
    trigger: 'protectorate',
    tiebreakerStat: 'presidentialConfidence',
    tiebreakerHigh: {
      reaction: 'Hay likes the legal elasticity. Greene would hate the name and accept the substance. Cortelyou worries that every undefined power in the arrangement will return later as a quarrel.',
      narration: 'Washington chooses a government that is and is not sovereign. Filipino flags fly in offices whose customs schedules are watched by American eyes.',
      mckinleyLine: 'A delicate machine. More delicate than annexation — but potentially less embittering.',
      hayLine: 'The elegant problem with protectorates is that they are elegant chiefly on paper.',
      epilogue: 'A protectorate arrangement was seriously discussed in late 1898 but ultimately rejected. The United States chose direct sovereignty. The closest historical parallel is Cuba under the Platt Amendment — nominal independence with reserved American intervention rights, an arrangement that lasted until 1934 and was resented throughout.',
    },
    tiebreakerLow: {
      reaction: 'The arrangement is accepted, but Hay marks three passages where the power relationships are undefined.',
      narration: 'The arrangement lives, but only by constant tending. Every proclamation must do two impossible things at once: promise dignity and preserve direction.',
      mckinleyLine: 'How long does a protectorate remain a protectorate before it becomes something else with a different name?',
      hayLine: 'Paper is what we have until troops receive different orders.',
      epilogue: 'Protectorate arrangements in the Pacific in this era typically resolved into annexation (Hawaii, 1898) or into grinding conflict (the trajectory the Philippines actually took). The underlying tension between protection and sovereignty was never resolved by legal language alone.',
    },
    historicalGrounding: 'Draws on Agoncillo\'s openness to protection over restoration, Foreman\'s protectorate preference, Greene\'s warning that protection becomes rule, and Bell/Bourns evidence that many elites sought American support without wanting Spain restored.',
  },
  {
    id: 'C',
    title: 'Luzon and Guarantees',
    subtitle: 'A settlement or an intermission?',
    trigger: 'luzon_guarantees',
    tiebreakerStat: 'orderWarRisk',
    tiebreakerHigh: {
      reaction: 'The President recognizes the shape of an earlier inclination. Hay asks immediately whether this is a settlement or an intermission.',
      narration: 'South of Luzon, the old empire is not dead enough to be harmless and not alive enough to be trusted. Every report from the outer islands reads like a bill deferred rather than paid.',
      mckinleyLine: 'Moderate policies must still survive immoderate events.',
      hayLine: 'If this is a position, it must hold. If it is a pause, we should name it honestly.',
      epilogue: 'McKinley briefly inclined toward a Manila/Luzon solution before concluding — as Greene had argued — that a fragment would merely invite further crises. The outer islands could not be safely left in disorder. This was the "postponement" argument Greene feared most.',
    },
    tiebreakerLow: {
      reaction: 'The memorandum is received. For a week in Washington the policy feels moderate, bounded, almost clever.',
      narration: 'Manila and Luzon are retained. Elsewhere, Spain is fenced by clauses, promises, and prohibitions against alienation.',
      mckinleyLine: 'This is the least extensive course. I understand that it must be actively defended, not merely declared.',
      hayLine: 'Moderate policies must still survive immoderate events.',
      epilogue: 'The Luzon-only option was discussed but set aside. The commissioners in Paris ultimately took the full archipelago. Greene\'s prediction — that a fragment would merely postpone the same crisis — aligned with McKinley\'s final reasoning.',
    },
    historicalGrounding: "Based on McKinley's earlier Manila/Luzon thinking, his note about guarantees and non-alienation if Spain retained territory, and arguments that a partial solution would leave either disorder or a vindictive Spanish neighbor.",
  },
  {
    id: 'D',
    title: 'The Republic Under Warning',
    subtitle: 'Beginning from consent rather than possession',
    trigger: 'conditional_independence',
    tiebreakerStat: 'orderWarRisk',
    tiebreakerHigh: {
      reaction: 'Hay admires the principle and distrusts the machinery. Cortelyou fears the route rests on the phrase "under conditions" — which means future officials must supply the missing structure.',
      narration: 'The republic breathes. It also trembles. Every island is now a question put to the next month.',
      mckinleyLine: 'I should like to spare the country one empire and another country one humiliation.',
      hayLine: 'Then we must hope geography, commerce, and rivalry are feeling charitable.',
      epilogue: 'Agoncillo pressed for exactly this recognition — and was received only as a private citizen. The United States never formally recognized Filipino independence in 1898. Aguinaldo\'s government collapsed under American military pressure in 1901. The Philippines did not achieve independence until July 4, 1946.',
    },
    tiebreakerLow: {
      reaction: 'The memorandum is unusual enough that Hay reads it twice. He does not cross anything out — which is more unsettling than if he had.',
      narration: 'Recognition comes wrapped in supervision. The new republic stands, but everyone can see the hands still hovering near it.',
      mckinleyLine: 'Conditions enforceable by whom?',
      hayLine: 'A conditional republic is a republic waiting to learn what the conditions actually mean.',
      epilogue: 'The conditional independence route was the one Agoncillo advocated, and the one American policy most visibly abandoned. The gap between American rhetoric about liberation and American practice in the Philippines was not lost on the Filipino leadership — or on subsequent generations.',
    },
    historicalGrounding: "Takes Agoncillo's position most seriously, while preserving Foreman's and Greene's warnings that an unsupported republic may fragment or invite intervention.",
  },
  {
    id: 'E',
    title: 'Delay and Face-Saving',
    subtitle: 'Buying time rather than clarity',
    trigger: 'delay_guarantees',
    tiebreakerStat: 'publicJustification',
    tiebreakerHigh: {
      reaction: 'The paper is not foolish. It is simply unwilling to end the argument. Hay finds it careful. Cortelyou finds it thin. The President finds in it a recognizable temptation: time.',
      narration: 'The memorandum secures guarantees, bars alienation, and postpones the final moral sentence.',
      mckinleyLine: 'It is easier to delay a decision than to escape it.',
      hayLine: 'Paris may accept a temporary ambiguity. History seldom does.',
      epilogue: 'McKinley\'s administration did secure non-alienation guarantees in the Paris negotiations. But delay did not resolve the underlying question — it only deferred it to a Commission that ultimately recommended full annexation. The Treaty of Paris was signed December 10, 1898.',
    },
    tiebreakerLow: {
      reaction: 'Hay is unimpressed. The paper reads, he says, like a man who wants to be cautious and decisive at the same time.',
      narration: 'No faction is satisfied. No burden disappears. The policy buys space but not resolution.',
      mckinleyLine: 'Nations seldom speak plainly to themselves before acting. This paper does not help them begin.',
      hayLine: 'I needed a recommendation. This is a very careful description of why a recommendation is difficult.',
      epilogue: 'The Paris commissioners debated the Philippines question through November 1898. They chose full annexation. The delay route — in its historical form — was eventually overtaken by the argument that no stable alternative existed, which is what Greene had argued all along.',
    },
    historicalGrounding: "Follows the least-committal reading of McKinley's caution about guarantees and non-alienation. Written to feel unstable because the broader case repeatedly shows that the underlying problem returns until someone accepts fuller responsibility.",
  },
];

export const MEMO_THESIS_LABELS: Record<MemoThesis, string> = {
  whole_archipelago: 'The Whole Archipelago',
  protectorate: 'Protectorate Over a Filipino Government',
  luzon_guarantees: 'Luzon and Guarantees',
  conditional_independence: 'Conditional Filipino Independence',
  delay_guarantees: 'Delay and Guarantees Only',
};

export const MEMO_THESIS_OPENING: Record<MemoThesis, string> = {
  whole_archipelago: 'The United States has reached a point at which partial expedients in the Philippines may prove more dangerous than frank responsibility. If Spanish authority cannot be restored, and if a protectorate or fragmentary occupation merely reserves to us the burdens of control without its candor, then the safer course is to assume the whole settlement and shape it justly.',
  protectorate: 'Spanish sovereignty in the islands is morally and practically exhausted, yet direct annexation would needlessly estrange the very class through whom orderly government must first operate. An American protectorate over a Filipino civil authority, though delicate, offers the best chance to reconcile responsibility with legitimacy.',
  luzon_guarantees: 'A limited retention in Manila and Luzon is the least extensive course consistent with American strategic interests, but it is defensible only if coupled with binding guarantees, non-alienation, and a sober recognition that disorders elsewhere may draw us back into the same question.',
  conditional_independence: 'If the United States entered the Philippines in the name of liberation, it should hesitate before assuming Spain\'s place. A conditional recognition of Filipino independence, supported for a time by American power, would preserve our principles while avoiding an unnecessary sovereignty.',
  delay_guarantees: 'The nation has not yet spoken with sufficient clearness to justify an irrevocable settlement of the entire archipelago. Pending fuller knowledge, the commission should secure guarantees against renewed Spanish abuse and against alienation of territory, while preserving American freedom of action.',
};

export const getEnding = (thesis: MemoThesis) => ENDINGS.find(e => e.trigger === thesis);
