export type Fight = {
  id: number;
  name: string;
  difficulty: number;
  boss?: number;
  start_time: number;
  end_time: number;
  kill: boolean;
};

export type Actor = {
  id: number;
  name: string;
};

export type Report = {
  friendlies: Actor[];
  fights: Fight[];
};
