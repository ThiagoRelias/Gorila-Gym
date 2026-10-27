import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_FAVORITOS = "@gorilagym:favoritos";

export async function buscarFavoritos(): Promise<number[]> {
  try {
    const dados = await AsyncStorage.getItem(CHAVE_FAVORITOS);
    return dados ? JSON.parse(dados) as number[] : [];
  } catch {
    return [];
  }
}

export async function alternarFavorito(id: number): Promise<number[]> {
  const favoritos = await buscarFavoritos();

  const atualizados = favoritos.includes(id)
    ? favoritos.filter((favorito) => favorito !== id)
    : [...favoritos, id];

  await AsyncStorage.setItem(
    CHAVE_FAVORITOS,
    JSON.stringify(atualizados)
  );

  return atualizados;
}
