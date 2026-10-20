import type { Treino, TreinoResumo } from "../types/treino";

const API_URL = "http://192.168.0.100:3000";

export async function buscarTreinos(): Promise<TreinoResumo[]> {
  const response = await fetch(`${API_URL}/workouts`);

  if (!response.ok) {
    throw new Error("Não foi possível carregar os treinos.");
  }

  return response.json();
}

export async function buscarTreinoPorId(id: number): Promise<Treino> {
  const response = await fetch(`${API_URL}/workouts/${id}`);

  if (!response.ok) {
    throw new Error("Não foi possível carregar o treino.");
  }

  return response.json();
}