export type Exercicio = {
  name: string;
  sets: number;
  reps: string;
  imageUrl?: string;
};

export type TreinoResumo = {
  id: number;
  name: string;
  duration: number;
  muscleGroup: string;
  imageUrl?: string;
};

export type Treino = {
  id: number;
  name: string;
  level: string;
  duration: number;
  muscleGroup: string;
  imageUrl?: string;
  exercises: Exercicio[];
};
