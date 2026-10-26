import type { Treino, TreinoResumo } from "../types/treino";

const API_URL = "http://10.92.198.26:3000/api/treinos";

export async function buscarTreinos(): Promise<TreinoResumo[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Não foi possível carregar os treinos.");
  }

  return response.json();
}

export async function buscarTreinoPorId(id: number): Promise<Treino> {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Não foi possível carregar o treino.");
  }

  return response.json();
}
