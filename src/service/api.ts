import type { Treino, TreinoResumo } from "../types/treino";

const API_URL = "http://10.92.198.26:3000/api/treinos";

function normalizarImagem(item: any): TreinoResumo {
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
export async function buscarTreinos(): Promise<TreinoResumo[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Não foi possível carregar os treinos.");
  }

  const dados = await response.json();
  if (!Array.isArray(dados)) {
    throw new Error("A API não retornou uma lista de treinos válida.");
  }

  const normalizados: TreinoResumo[] = dados.map(normalizarImagem);
  const vistos = new Set<string>();

  return normalizados.filter((treino) => {
    const chave = JSON.stringify([
      treino.name?.trim().toLowerCase(),
      treino.duration,
      treino.muscleGroup?.trim().toLowerCase(),
      treino.imageUrl,
    ]);

    if (vistos.has(chave)) {
      return false;
    }
    vistos.add(chave);
    return true;
  });
}

export async function buscarTreinoPorId(id: number): Promise<Treino> {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Não foi possível carregar o treino.");
  }

  const treino = await response.json();
  return {
    ...treino,
    imageUrl:
      treino.imageUrl ??
      treino.image_url ??
      treino.imagemUrl ??
      treino.imagem ??
      treino.image ??
      "",
  };
}
