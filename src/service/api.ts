import type { Exercicio, Treino, TreinoResumo } from "../types/treino";

const API_URL = "http://10.92.198.16:3000/api/workouts";

function normalizarImagem(item: any) {
  return {
    ...item,
    imageUrl:
      item.imageUrl ??
      item.image_url ??
      item.imagemUrl ??
      item.imagem ??
      item.image ??
      "",
  };
}
function normalizarExercicio(exercicio: any): Exercicio {
  return {
    ...exercicio,
    imageUrl:
      exercicio.imageUrl ??
      exercicio.image_url ??
      exercicio.imagemUrl ??
      exercicio.imagem ??
      exercicio.image ??
      "",
  };
}
export async function buscarTreinos(): Promise<TreinoResumo[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Não foi possível carregar os treinos.");
  }
  const dados = await response.json();

  if (!Array.isArray(dados)) {
    throw new Error("A API não retornou uma lista de treinos válida.");
  }
  return dados.map((treino) => normalizarImagem(treino));
}

export async function buscarTreinoPorId(id: number): Promise<Treino> {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Não foi possível carregar o treino.");
  }
  const dados = await response.json();

  return {
    ...normalizarImagem(dados),
    exercises: Array.isArray(dados.exercises)
      ? dados.exercises.map(normalizarExercicio)
      : [],
  };
}