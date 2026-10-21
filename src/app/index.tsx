import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, } from "react-native";
import { buscarTreinos } from "../service/api";
import type { TreinoResumo } from "../types/treino";

const FOTO_DESTAQUE =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9F-YEkAJ7LTm-q2Crl6ZxzI9Y1RaT_w0sZHDvUA-YZgDz74S9_FmPOLU&s=10";

const FOTOS_TREINOS = [
  "https://www.hipertrofia.org/blog/wp-content/uploads/2023/09/barbell-incline-bench-press.gif",
  "https://i.pinimg.com/originals/7e/d3/fd/7ed3fd50a771c125a2fe8adcf3b7eae4.gif",
  "https://i.pinimg.com/originals/c2/8e/10/c28e10ce7b5cde07f21afdd0eaeeb26d.gif",
];

export default function HomeScreen() {
  const router = useRouter();

  const [treinos, setTreinos] = useState<TreinoResumo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    buscarTreinos()
      .then(setTreinos)
      .catch(() => setErro(""))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Gorila Gym</Text>
        <Text style={styles.subtitulo}>seu site de treinos</Text>

        <View style={styles.atalhos}>
          <Text style={styles.atalhoAtivo}> Meus Treinos</Text>

          <Pressable onPress={() => router.push("/treinos")}>
            <Text style={styles.atalho}>◷ Histórico</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.conteudo}>
        <ImageBackground
          source={{ uri: FOTO_DESTAQUE }}
          style={styles.destaque}
          imageStyle={styles.imagemDestaque}
        >
          <View style={styles.sombra}>
            <Text style={styles.tag}>Destaque</Text>
            <View style={styles.textoDestaque}>
              <Text style={styles.tituloDestaque}>Treino de força</Text>
              <Text style={styles.descricaoDestaque}>
                Escolha seu treino e comece hoje.
              </Text>
            </View>
          </View>
        </ImageBackground>

        <View style={styles.tituloLinha}>
          <Text style={styles.tituloSecao}>Treinos da semana</Text>
          <Text style={styles.seta}>›</Text>
        </View>

        <View style={styles.dias}>
          {[
            ["Seg", "Peito"],
            ["Ter", "Costas"],
            ["Qua", "Pernas"],
            ["Qui", "Ombros"],
          ].map(([dia, grupo], index) => (
            <View style={styles.diaCard} key={dia}>
              <Text style={styles.diaTexto}>{dia}</Text>
              <Text style={styles.grupoTexto}>{grupo}</Text>

              <ImageBackground
                source={{ uri: FOTOS_TREINOS[index % FOTOS_TREINOS.length] }}
                style={styles.fotoDia}
                imageStyle={{ borderRadius: 30 }}
              />
            </View>
          ))}
        </View>

        <View style={styles.tituloLinha}>
          <Text style={styles.tituloSecao}>Treinos do mês</Text>
          <Pressable onPress={() => router.push("/treinos")}>
            <Text style={styles.verTodos}>Ver todos ›</Text>
          </Pressable>
        </View>

        {carregando ? (
          <ActivityIndicator color="#8067FF" size="large" />
        ) : erro ? (
          <View>
            <Text style={styles.erro}>{erro}</Text>
            <Text style={styles.aviso}>
            </Text>
          </View>
        ) : (
          <FlatList
            data={treinos.slice(0, 4)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item, index }) => (
              <Pressable
                style={styles.treinoCard}
                onPress={() => router.push("/treinos")}
              >
                <ImageBackground
                  source={{
                    uri: FOTOS_TREINOS[index % FOTOS_TREINOS.length],
                  }}
                  style={styles.fotoTreino}
                  imageStyle={{ borderRadius: 12 }}
                />
                <Text style={styles.nomeTreino} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.infoTreino}>
                  {item.duration} min · {item.muscleGroup}
                </Text>
              </Pressable>
            )}
          />
        )}
      </View>

      <View style={styles.rodape}>
        <Text style={styles.rodapeTexto}>GORILA GYM · BORA TREINAR</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 20,
  },
  logo: {
    color: "#E3F1FC",
    fontSize: 29,
    fontWeight: "800",
  },
  subtitulo: {
    color: "#8FA6B9",
    fontSize: 14,
    marginTop: 5,
  },
  atalhos: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
    alignItems: "center",
  },
  atalhoAtivo: {
    color: "#E8E5FF",
    backgroundColor: "#1c1d1d",
    borderRadius: 25,
    overflow: "hidden",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  atalho: {
    color: "#d7d1d8",
    backgroundColor: "#1c1d1d",
    borderRadius: 25,
    overflow: "hidden",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  conteudo: {
    paddingHorizontal: 18,
  },
  destaque: {
    height: 190,
    justifyContent: "space-between",
  },
  imagemDestaque: {
    borderRadius: 18,
  },
  sombra: {
    flex: 1,
    padding: 18,
    justifyContent: "space-between",
    backgroundColor: "rgba(70, 83, 95, 0.52)",
    borderRadius: 18,
  },
  tag: {
    color: "#FFFFFF",
    backgroundColor: "#8067FF87",
    overflow: "hidden",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    fontSize: 11,
  },
  textoDestaque: {
    marginBottom: 8,
  },
  tituloDestaque: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },
  descricaoDestaque: {
    color: "#D5E0E8",
    marginTop: 5,
  },
  tituloLinha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 25,
    marginBottom: 13,
  },
  tituloSecao: {
    color: "#DDEBF7",
    fontSize: 18,
    fontWeight: "700",
  },
  seta: {
    color: "#9BAFC1",
    fontSize: 26,
  },
  dias: {
    flexDirection: "row",
    gap: 8,
  },
  diaCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#1c1d1d",
    borderColor: "#2e2f30",
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 3,
  },
  diaTexto: {
    color: "#8EA4B7",
    fontSize: 12,
  },
  grupoTexto: {
    color: "#E0EDF7",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 7,
    marginBottom: 9,
  },
  fotoDia: {
    width: 43,
    height: 43,
  },
  verTodos: {
    color: "#8B75FF",
    fontSize: 13,
    fontWeight: "700",
  },
  treinoCard: {
    width: 170,
    backgroundColor: "#142C42",
    borderRadius: 15,
    padding: 10,
    marginRight: 12,
    marginBottom: 15,
  },
  fotoTreino: {
    height: 112,
    width: "100%",
  },
  nomeTreino: {
    color: "#E1EDF7",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 10,
  },
  infoTreino: {
    color: "#93A8BB",
    fontSize: 11,
    marginTop: 5,
    marginBottom: 5,
  },
  erro: {
    color: "#FF9A9A",
    marginVertical: 10,
  },
  aviso: {
    color: "#A6B7C6",
    fontSize: 12,
    lineHeight: 19,
  },
  rodape: {
    padding: 25,
    alignItems: "center",
  },
  rodapeTexto: {
    color: "#657F94",
    fontSize: 10,
    letterSpacing: 2,
  },
});