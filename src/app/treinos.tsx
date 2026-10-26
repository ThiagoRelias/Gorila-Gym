import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, } from "react-native";
import { buscarTreinoPorId, buscarTreinos } from "../service/api";
import type { Treino, TreinoResumo } from "../types/treino";

const FOTO_DESTAQUE =
  "https://www.hipertrofia.org/blog/wp-content/uploads/2019/05/pulldown.gif";

const FOTO_PADRAO =
  "https://www.hipertrofia.org/blog/wp-content/uploads/2019/05/pulldown.gif";

export default function TreinosScreen() {
  const router = useRouter();

  const [treinos, setTreinos] = useState<TreinoResumo[]>([]);
  const [treinoSelecionado, setTreinoSelecionado] =
    useState<Treino | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarDados() {
      try {
        setErro("");

        const dados = await buscarTreinos();
        setTreinos(dados);

        if (dados.length > 0) {
          const detalhe = await buscarTreinoPorId(dados[0].id);
          setTreinoSelecionado(detalhe);
        }
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os treinos."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.conteudo}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>Gorila Gym</Text>
          <Text style={styles.subtitulo}>Treinos do dia</Text>
        </View>

        <ImageBackground
          source={{ uri: FOTO_DESTAQUE }}
          style={styles.destaque}
          imageStyle={styles.imagemDestaque}
        >
          <View style={styles.sombra}>
            <View style={styles.informacoesTopo}>
              <Text style={styles.tag}>Treino do dia</Text>
              <Text style={styles.duracao}>
                {treinoSelecionado?.duration ?? 45} min
              </Text>
            </View>

            <View>
              <Text style={styles.tituloDestaque}>
                {treinoSelecionado?.name ?? "Treino de peito"}
              </Text>
              <Text style={styles.descricaoDestaque}>
                {treinoSelecionado
                  ? `${treinoSelecionado.exercises.length} exercícios`
                  : "Prepare-se para treinar"}
              </Text>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.tituloLinha}>
          <Text style={styles.tituloSecao}>Exercícios</Text>
          <Text style={styles.contador}>
            {treinoSelecionado?.exercises.length ?? 0} itens
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
        ) : !treinoSelecionado ? (
          <Text style={styles.aviso}>
            Nenhum treino cadastrado na API.
          </Text>
        ) : treinoSelecionado.exercises.length === 0 ? (
          <Text style={styles.aviso}>
            Nenhum exercício cadastrado neste treino.
          </Text>
        ) : (
          treinoSelecionado.exercises.map((exercicio, index) => (
            <View
              style={styles.exercicioCard}
              key={`${exercicio.name}-${index}`}
            >
              <Image
                source={{
                  uri: exercicio.imageUrl || FOTO_PADRAO,
                }}
                style={styles.fotoExercicio}
                resizeMode="cover"
              />

              <View style={styles.detalhesExercicio}>
                <Text style={styles.nomeExercicio}>
                  {exercicio.name}
                </Text>

                <Text style={styles.infoExercicio}>
                  {exercicio.sets} séries · {exercicio.reps} repetições
                </Text>
              </View>

              <View style={styles.check}>
                <Text style={styles.checkTexto}>✓</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.rodape}>
        <Pressable
          style={styles.botaoInicio}
          onPress={() => router.replace("/")}
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
  scroll: {
    flex: 1,
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
    backgroundColor: "rgba(0, 0, 0, 0.30)",
  },
  informacoesTopo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tag: {
    color: "#FFFFFF",
    backgroundColor: "#8B5CF6",
    borderRadius: 20,
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 7,
    fontSize: 11,
    fontWeight: "700",
  },
  duracao: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  tituloDestaque: {
    color: "#FFFFFF",
    fontSize: 24,
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
    fontSize: 13,
    fontWeight: "700",
  },
  carregando: {
    marginVertical: 30,
  },
  exercicioCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#191920",
    borderColor: "#292933",
    borderWidth: 1,
    borderRadius: 19,
    padding: 11,
    marginBottom: 12,
  },
  fotoExercicio: {
    width: 72,
    height: 72,
    borderRadius: 13,
    backgroundColor: "#292933",
  },
  detalhesExercicio: {
    flex: 1,
    marginLeft: 12,
  },
  nomeExercicio: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  infoExercicio: {
    color: "#A4A4B0",
    fontSize: 12,
    marginTop: 6,
  },
  check: {
    width: 34,
    height: 34,
    borderRadius: 20,
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  checkTexto: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "800",
  },
  erro: {
    color: "#FF9999",
    marginVertical: 15,
  },
  aviso: {
    color: "#B7B7C5",
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