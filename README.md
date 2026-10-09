# Kikitori de Números (聞き取り・数字)

Treino de compreensão auditiva de números em japonês. O app fala um número em japonês e você digita em algarismos o que ouviu. Ele só avança quando você acerta.

*Kikitori* (聞き取り) é a habilidade de entender o que se ouve, e *suuji* (数字) quer dizer "números".

## Para que serve

Números japoneses são difíceis de captar de ouvido, principalmente os grandes. O sistema usa unidades de dez mil (万, *man*) em vez de milhar, e as leituras mudam conforme o dígito (300 é *sanbyaku*, 600 é *roppyaku*, 8000 é *hassen*). Este projeto dá repetição rápida, sem cadastro e sem instalar nada, para treinar essa escuta.

## Como usar

1. Acesse https://marv-lab.github.io/kikitori/
2. Escolha a **faixa** de números: 0–10, 0–100, 0–1.000, 0–10.000 ou 0–100.000. A escolha fica salva no navegador.
3. Clique em **▶ Ouvir** para o número ser falado. Use **🐢 Ouvir devagar** para uma velocidade menor.
4. Digite o número e pressione **OK** ou `Enter`.
   - Se errar, o áudio toca de novo e você tenta outra vez.
   - Se acertar, aparece a leitura em kanji com furigana e em romaji. Pressione `Enter` para o próximo número.
5. **Mostrar leitura** / **Ocultar leitura** alterna a leitura em hiragana e romaji, para quando você travar.
6. A parte de cima mostra acertos, erros e a sequência de acertos seguidos.

### Atalhos de teclado

| Ação | Tecla |
|---|---|
| Campo vazio: repetir o áudio | `Enter` |
| Campo com número: verificar a resposta | `Enter` |
| Depois de acertar: próximo número | `Enter` |

## Requisitos

Um navegador com a Web Speech API (síntese de voz) e uma **voz japonesa (ja-JP)** instalada.

- **Chrome / Edge:** normalmente já têm uma voz japonesa (como "Google 日本語").
- **Firefox no Linux:** é preciso instalar uma voz japonesa no `speech-dispatcher`.
- **Celular:** Android e iOS costumam trazer vozes japonesas. Se faltar, instale nas configurações de idioma do sistema.

Se nenhuma voz japonesa for encontrada, o app mostra um aviso. Nesse caso dá para estudar só com **Mostrar leitura**.

A página usa fontes do Google Fonts, então precisa de internet para carregá-las. O layout se adapta a celular, tablet e desktop, e acompanha o tema claro ou escuro do sistema.

## Estrutura do projeto

| Arquivo | Função |
|---|---|
| `kikitori.html` | Versão de desenvolvimento, usa `kikitori.css` e `kikitori.js` |
| `kikitori.css` | Estilos |
| `kikitori.js` | Lógica: geração das leituras, fala, verificação e placar |
| `index.html` | Versão minificada para publicar, usa os arquivos `.min` |
| `kikitori.min.css` / `kikitori.min.js` | CSS e JS minificados |

Para publicar são necessários só `index.html`, `kikitori.min.css` e `kikitori.min.js`.

## Desenvolvimento

Edite sempre `kikitori.html`, `kikitori.css` e `kikitori.js`, e abra o `kikitori.html` para testar. Depois gere de novo os arquivos minificados:

```sh
npx terser kikitori.js --compress --mangle -o kikitori.min.js
npx clean-css-cli -o kikitori.min.css kikitori.css
npx html-minifier-terser --collapse-whitespace --remove-comments --collapse-boolean-attributes -o index.html kikitori.html
sed -i 's/href="kikitori.css"/href="kikitori.min.css"/; s/src="kikitori.js"/src="kikitori.min.js"/' index.html
```

Não há dependências nem build: é HTML, CSS e JavaScript puros.

## Licença

[MIT](LICENSE)
