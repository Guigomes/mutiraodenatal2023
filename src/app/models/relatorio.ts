import { Evento } from "./evento";
import Imagem from "./imagem";

export default interface Relatorio {

  imagens: Imagem[];
  titulo: string,
  cliente: string,
  local?: string,
  cidade?: string,
  data: string,
  revestimento?: string,
  poco?: string,
  diametro?: string,
  reducao?: string;
  nivel?: string,
uf: string;
  fimRevestimento?: string,
observacoes? : string;
  profundidade?: string;
  eventos: Evento[];
}
