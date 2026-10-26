import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, } from "react-native";
import { buscarTreinoPorId, buscarTreinos } from "../service/api";
import type { Exercicio, Treino, TreinoResumo } from "../types/treino";

const FOTO_DESTAQUE =
  "https://static.vecteezy.com/ti/fotos-gratis/p2/71528347-peso-treinamento-equipamento-as-academia-interior-ginastica-exercite-se-gratis-foto.jpg";

type TreinoComExercicios = TreinoResumo & {
  exercises?: Exercicio[];
};

export default function TreinosScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const idParam = Array.isArray(params.id) ? params.id[0] : params.id;

  const [treinoSelecionado, setTreinoSelecionado] =
    useState<Treino | null>(null);
  const [imagensExercicios, setImagensExercicios] = useState<
    Record<string, string>
  >({});
  const [exerciciosConcluidos, setExerciciosConcluidos] = useState<
    Record<string, boolean>
  >({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      try {
        setCarregando(true);
        setErro("");

        const dados = await buscarTreinos();
        const dadosComExercicios = dados as TreinoComExercicios[];

        const imagens: Record<string, string> = {};

        dadosComExercicios.forEach((treino) => {
          treino.exercises?.forEach((exercicio) => {
            const nome = exercicio.name.trim().toLowerCase();
            const url = exercicio.imageUrl?.trim();

            if (nome && url && !imagens[nome]) {
              imagens[nome] = url;
            }
          });
        });

        const idRecebido = Number(idParam);
        const existe = dados.some((item) => item.id === idRecebido);
        const idSelecionado =
          idParam && existe ? idRecebido : dados[0]?.id;

        if (idSelecionado === undefined) {
          if (ativo) {
            setTreinoSelecionado(null);
            setImagensExercicios(imagens);
          }
          return;
        }

        const detalhe = await buscarTreinoPorId(idSelecionado);

        if (ativo) {
          setImagensExercicios(imagens);
          setTreinoSelecionado(detalhe);
          setExerciciosConcluidos({});
        }
      } catch (error) {
        if (ativo) {
          setErro(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar o treino."
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarDados();

    return () => {
      ativo = false;
    };
  }, [idParam]);

  function obterImagem(exercicio: Exercicio) {
    const imagemPropria = exercicio.imageUrl?.trim();

    if (imagemPropria) {
      return imagemPropria;
    }

    return imagensExercicios[exercicio.name.trim().toLowerCase()] || "";
  }

  function alternarConclusao(chave: string) {
    setExerciciosConcluidos((estadoAtual) => ({
      ...estadoAtual,
      [chave]: !estadoAtual[chave],
    }));
  }

  const totalExercicios = treinoSelecionado?.exercises.length ?? 0;
  const totalConcluidos = Object.values(exerciciosConcluidos).filter(
    Boolean
  ).length;

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

        {carregando ? (
          <ActivityIndicator
            color="#8B5CF6"
            size="large"
            style={styles.carregando}
          />
        ) : erro ? (
          <Text style={styles.erro}>{erro}</Text>
        ) : !treinoSelecionado ? (
          <Text style={styles.aviso}>Nenhum treino encontrado.</Text>
        ) : (
          <>
            <ImageBackground
              source={{ uri: FOTO_DESTAQUE }}
              style={styles.destaque}
              imageStyle={styles.imagemDestaque}
            >
              <View style={styles.sombra}>
                <View style={styles.informacoesTopo}>
                  <Text style={styles.tag}>Treino do dia</Text>
                  <Text style={styles.duracao}>
                    {treinoSelecionado.duration} min
                  </Text>
                </View>

                <View>
                  <Text style={styles.tituloDestaque}>
                    {treinoSelecionado.name}
                  </Text>
                  <Text style={styles.descricaoDestaque}>
                    {totalExercicios} exercícios
                  </Text>
                </View>
              </View>
            </ImageBackground>

            <View style={styles.tituloLinha}>
              <Text style={styles.tituloSecao}>Exercícios</Text>
              <Text style={styles.contador}>
                {totalConcluidos}/{totalExercicios} concluídos
              </Text>
            </View>

            {treinoSelecionado.exercises.map((exercicio, index) => {
              const imagem = obterImagem(exercicio);
              const chave = `${treinoSelecionado.id}-${exercicio.id ?? exercicio.name}-${index}`;
              const concluido = Boolean(exerciciosConcluidos[chave]);

              return (
                <View
                  style={styles.exercicioCard}
                  key={chave}
                >
                  {imagem ? (
                    <Image
                      source={{ uri: imagem }}
                      style={styles.fotoExercicio}
                      resizeMode="contain"
                    />
                  ) : (
                    <View style={styles.fotoSemImagem}>
                      <Text style={styles.textoSemImagem}>
                        Sem imagem
                      </Text>
                    </View>
                  )}

                  <View style={styles.detalhesExercicio}>
                    <Text style={styles.nomeExercicio}>
                      {exercicio.name}
                    </Text>

                    <Text style={styles.infoExercicio}>
                      {exercicio.sets} séries · {exercicio.reps} repetições
                    </Text>

                    {concluido && (
                      <Text style={styles.textoConcluido}>
                        Concluído
                      </Text>
                    )}
                  </View>

                  <Pressable
                    style={styles.check}
                    onPress={() => alternarConclusao(chave)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: concluido }}
                    accessibilityLabel={`Marcar ${exercicio.name} como ${
                      concluido ? "não concluído" : "concluído"
                    }`}
                  >
                    {concluido && (
                      <Text style={styles.checkTexto}>✓</Text>
                    )}
                  </Pressable>
                </View>
              );
            })}
          </>
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
    fontSize: 12,
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
    backgroundColor: "#FFFFFF",
  },
  fotoSemImagem: {
    width: 72,
    height: 72,
    borderRadius: 13,
    backgroundColor: "#292933",
    alignItems: "center",
    justifyContent: "center",
  },
  textoSemImagem: {
    color: "#A4A4B0",
    fontSize: 9,
    textAlign: "center",
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
  textoConcluido: {
    color: "#A78BFA",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 5,
  },
  check: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  checkTexto: {
    color: "#8B5CF6",
    fontSize: 25,
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