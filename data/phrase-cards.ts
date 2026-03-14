import { PhraseCard } from '@/lib/game/types';

export const PHRASE_CARDS: PhraseCard[] = [
  // THESIS cards
  {
    id: 'thesis_whole_archipelago',
    text: 'The United States must either assume the whole burden or prepare to revisit the whole question under worse conditions.',
    source: 'Greene',
    category: 'thesis',
  },
  {
    id: 'thesis_protectorate',
    text: 'A protectorate over a Filipino civil authority offers the best chance to reconcile responsibility with legitimacy.',
    source: 'Agoncillo / Foreman',
    category: 'thesis',
  },
  {
    id: 'thesis_luzon',
    text: 'A limited retention in Manila and Luzon, coupled with binding guarantees and non-alienation, is the least extensive defensible course.',
    source: 'McKinley / Day',
    category: 'thesis',
  },
  {
    id: 'thesis_independence',
    text: 'If the United States entered the Philippines in the name of liberation, it should hesitate before assuming Spain\'s place.',
    source: 'Agoncillo',
    category: 'thesis',
  },
  {
    id: 'thesis_delay',
    text: 'The nation has not spoken with sufficient clearness to justify an irrevocable settlement of the entire archipelago.',
    source: 'Caution / Guarantees',
    category: 'thesis',
  },

  // SUPPORT cards
  {
    id: 'support_no_spain',
    text: 'Spain cannot re-establish control. To return the islands is to light the fire and then instruct the victims to re-enter the house.',
    source: 'Greene',
    category: 'support',
  },
  {
    id: 'support_republic_fragments',
    text: 'An independent republic would not remain one year a peaceful united archipelago. Tagal influence does not equal archipelago-wide consent.',
    source: 'Greene / Foreman',
    category: 'support',
  },
  {
    id: 'support_protectorate_is_rule',
    text: 'If we protect, we will govern in everything but name. If we govern, let us admit it.',
    source: 'Greene',
    category: 'support',
  },
  {
    id: 'support_luzon_invites_intervention',
    text: 'Keep a fragment and you inherit all the risk with none of the authority. Leave Spain at our doorstep and she becomes a vindictive neighbor.',
    source: 'Greene',
    category: 'support',
  },
  {
    id: 'support_moral_obligation',
    text: 'After Manila, we cannot pretend we are uninvolved. Moral obligation does not diminish because it is inconvenient.',
    source: 'North American Review / Hay',
    category: 'support',
  },
  {
    id: 'support_china_trade',
    text: 'The Pacific position and the China trade make the archipelago a strategic necessity, not merely a moral question.',
    source: 'North American Review',
    category: 'support',
  },
  {
    id: 'support_tact_averts_war',
    text: 'Mishandling the relationship with Filipino elites could produce war. Tact is not sentiment — it is tactical and relational.',
    source: 'Bourns',
    category: 'support',
  },
  {
    id: 'support_guarantees_nonalienation',
    text: 'If Spain retains any islands, the commissioners must require guarantees about commerce and government, and Spain must not alienate remaining territory to another power.',
    source: 'McKinley',
    category: 'support',
  },
  {
    id: 'support_foreign_vacuum',
    text: 'It is a poor moment in the world to create a vacuum and call it principle. Germany, Britain, and Japan are all calculating.',
    source: 'Hay',
    category: 'support',
  },
  {
    id: 'support_respect_not_recognition',
    text: 'Respect is not recognition. But contempt is not strength either. The memo must distinguish the two.',
    source: 'Hay',
    category: 'support',
  },
  {
    id: 'support_elite_opinion',
    text: 'Many influential Filipinos want American protection, and some want annexation — but mishandling the relationship could produce war.',
    source: 'Bourns / Bell',
    category: 'support',
  },

  // TONE cards
  {
    id: 'tone_duty',
    text: 'Duty before appetite — frame this as obligation, not opportunity.',
    source: 'Tone',
    category: 'tone',
  },
  {
    id: 'tone_prudence',
    text: 'Prudence before sentiment — the recommendation must survive Paris, not merely the newspapers.',
    source: 'Tone',
    category: 'tone',
  },
  {
    id: 'tone_partnership',
    text: 'Partnership without illusion — acknowledge Filipino agency without promising what cannot be delivered.',
    source: 'Tone',
    category: 'tone',
  },
  {
    id: 'tone_restraint',
    text: 'Restraint without abdication — caution is not the same as absence of decision.',
    source: 'Tone',
    category: 'tone',
  },
];

export const getPhraseCard = (id: string) => PHRASE_CARDS.find(c => c.id === id);
export const getCardsByCategory = (category: PhraseCard['category']) =>
  PHRASE_CARDS.filter(c => c.category === category);
