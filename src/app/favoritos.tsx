import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, } from "react-native";
import { buscarTreinos } from "../service/api";
import { alternarFavorito, buscarFavoritos, } from "../service/favoritos";
import type { TreinoResumo } from "../types/treino";

const FOTO_DESTAQUE =
  "https://static.vecteezy.com/ti/fotos-gratis/p2/71528347-peso-treinamento-equipamento-as-academia-interior-ginastica-exercite-se-gratis-foto.jpg";

export default function FavoritosScreen() {
  const router = useRouter();

  const [treinos, setTreinos] = useState<TreinoResumo[]>([]);
  const [idsFavoritos, setIdsFavoritos] = useState<number[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarFavoritos = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      const [dados, favoritos] = await Promise.all([
        buscarTreinos(),
        buscarFavoritos(),
      ]);

      setTreinos(dados);
      setIdsFavoritos(favoritos);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os favoritos."
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarFavoritos();
    }, [carregarFavoritos])
  );

  async function removerFavorito(id: number) {
    const atualizados = await alternarFavorito(id);
    setIdsFavoritos(atualizados);
  }

  const treinosFavoritos = treinos.filter((treino) =>
    idsFavoritos.includes(treino.id)
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>Gorila Gym</Text>
          <Text style={styles.subtitulo}>Seus treinos favoritos</Text>
        </View>

        <ImageBackground
          source={{ uri: FOTO_DESTAQUE }}
          style={styles.destaque}
          imageStyle={styles.imagemDestaque}
        >
          <View style={styles.sombra}>
            <Text style={styles.tag}>Meus favoritos</Text>

            <View>
              <Text style={styles.tituloDestaque}>
                Seus treinos preferidos
              </Text>
              <Text style={styles.descricaoDestaque}>
                {treinosFavoritos.length}{" "}
                {treinosFavoritos.length === 1 ? "treino salvo" : "treinos salvos"}
              </Text>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.tituloLinha}>
          <Text style={styles.tituloSecao}>Treinos salvos</Text>
          <Text style={styles.contador}>
            {treinosFavoritos.length} favoritos
          </Text>
        </View>

        {carregando ? (
          <ActivityIndicator
            color="#8B5CF6"
            size="large"
            style={styles.carregando}
          />
        ) : erro ? (
          <Text style={styles.erro}>{erro}</Text>
        ) : treinosFavoritos.length === 0 ? (
          <View style={styles.vazio}>
            <Text style={styles.coracaoVazio}></Text>
            <Text style={styles.textoVazio}>
              Você ainda não tem favoritos.
            </Text>
            <Text style={styles.descricaoVazia}>
              Volte aos treinos e toque no icone para salvar um treino aqui.
            </Text>

            <Pressable
              style={styles.botaoExplorar}
              onPress={() => router.push("/")}
            >
              <Text style={styles.textoBotaoExplorar}>
                Explorar treinos
              </Text>
            </Pressable>
          </View>
        ) : (
          treinosFavoritos.map((treino) => (
            <View style={styles.card} key={treino.id}>
              <Pressable
                style={styles.cardConteudo}
                onPress={() =>
                  router.push({
                    pathname: "/treinos",
                    params: { id: String(treino.id) },
                  })
                }
              >
                {treino.imageUrl ? (
                  <ImageBackground
                    source={{ uri: treino.imageUrl }}
                    style={styles.fotoTreino}
                    imageStyle={styles.imagemTreino}
                  />
                ) : (
                  <View style={styles.fotoVazia}>
                    <Text style={styles.textoFotoVazia}>Gorila Gym</Text>
                  </View>
                )}

                <View style={styles.detalhes}>
                  <Text style={styles.nomeTreino}>{treino.name}</Text>
                  <Text style={styles.infoTreino}>
                    {treino.duration} min · {treino.muscleGroup}
                  </Text>
                  <Text style={styles.abrirTreino}>Ver treino ›</Text>
                </View>
              </Pressable>

              <Pressable
                style={styles.botaoCoracao}
                onPress={() => removerFavorito(treino.id)}
                accessibilityRole="button"
                accessibilityLabel={`Remover ${treino.name} dos favoritos`}
              >
                <Text style={styles.coracaoAtivo}>★</Text>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.rodape}>
        <Pressable
          style={styles.botaoInicio}
          onPress={() => router.replace("/")}
          accessibilityRole="button"
          accessibilityLabel="Voltar para a página inicial"
        >
          <Text style={styles.iconeInicio}>⌂</Text>
          <Text style={styles.textoInicio}>Início</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D11",
  },  
  conteudo: {
    paddingHorizontal: 18,
    paddingTop: 55,
    paddingBottom: 25,
  },
  header: {
    marginBottom: 16,
  },
  logo: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
  },
  subtitulo: {
    color: "#9B5CFF",
    fontSize: 13,
    marginTop: 2,
  },
  destaque: {
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#343A40",
  },
  imagemDestaque: {
    borderRadius: 20,
    opacity: 0.65,
  },
  sombra: {
    flex: 1,
    padding: 18,
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.30)",
  },
  tag: {
    color: "#FFFFFF",
    backgroundColor: "#8B5CF6",
    borderRadius: 20,
    overflow: "hidden",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 7,
    fontSize: 11,
    fontWeight: "700",
  },
  tituloDestaque: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
  },
  descricaoDestaque: {
    color: "#E5E5E5",
    fontSize: 13,
    marginTop: 5,
  },
  tituloLinha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 22,
    marginBottom: 14,
  },
  tituloSecao: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
  contador: {
    color: "#9B5CFF",
    fontSize: 12,
    fontWeight: "700",
  },
  carregando: {
    marginVertical: 30,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#191920",
    borderColor: "#292933",
    borderWidth: 1,
    borderRadius: 19,
    padding: 11,
    marginBottom: 12,
  },
  cardConteudo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  fotoTreino: {
    width: 86,
    height: 86,
    backgroundColor: "#292933",
  },
  imagemTreino: {
    borderRadius: 13,
  },
  fotoVazia: {
    width: 86,
    height: 86,
    borderRadius: 13,
    backgroundColor: "#292933",
    alignItems: "center",
    justifyContent: "center",
  },
  textoFotoVazia: {
    color: "#A4A4B0",
    fontSize: 10,
  },
  detalhes: {
    flex: 1,
    marginLeft: 12,
  },
  nomeTreino: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  infoTreino: {
    color: "#A4A4B0",
    fontSize: 12,
    marginTop: 6,
  },
  abrirTreino: {
    color: "#A78BFA",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 7,
  },
  botaoCoracao: {
    padding: 8,
    marginLeft: 4,
  },
  coracaoAtivo: {
    color: "#A78BFA",
    fontSize: 28,
  },
  vazio: {
    alignItems: "center",
    backgroundColor: "#191920",
    borderColor: "#292933",
    borderWidth: 1,
    borderRadius: 19,
    padding: 25,
    marginTop: 5,
  },
  coracaoVazio: {
    color: "#A78BFA",
    fontSize: 48,
  },
  textoVazio: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 10,
  },
  descricaoVazia: {
    color: "#A4A4B0",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },
  botaoExplorar: {
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 11,
    marginTop: 18,
  },
  textoBotaoExplorar: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  erro: {
    color: "#FF9999",
    marginVertical: 15,
  },
  rodape: {
    height: 70,
    backgroundColor: "#191920",
    borderTopWidth: 1,
    borderTopColor: "#292933",
    alignItems: "center",
    justifyContent: "center",
  },
  botaoInicio: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 4,
  },
  iconeInicio: {
    color: "#8B5CF6",
    fontSize: 30,
    lineHeight: 34,
  },
  textoInicio: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
});
