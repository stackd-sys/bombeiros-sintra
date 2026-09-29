# Bombeiros Voluntários de Sintra — site corporativo

Site estático em HTML, CSS e JavaScript simples, sem dependências nem passo de build.

## Páginas

- `index.html` — Início
- `sobre.html` — Sobre nós (missão, valores, história, órgãos sociais)
- `servicos.html` — Serviços
- `noticias.html` — Notícias (com filtro por categoria)
- `contactos.html` — Contactos e formulário

## Estrutura

```
assets/css/style.css   estilos (cores e tipos de letra em :root)
assets/js/main.js      menu móvel, animações, filtro de notícias, formulário
assets/img/            imagens (logótipo provisório)
```

## Ver localmente

Abrir `index.html` no browser, ou servir a pasta:

```
python3 -m http.server 8000
```

## Conteúdo provisório

Tudo o que ainda não é oficial está marcado com a etiqueta amarela **PROVISÓRIO**
(`class="placeholder-tag"`) ou com blocos cinzentos "Foto provisória" (`class="photo"`).
Falta receber da associação:

- logótipo oficial (substituir `assets/img/logo-provisorio.svg`)
- fotografias
- textos (apresentação, missão, história, notícias)
- contactos oficiais (morada, telefone, email, redes sociais)
- números (bombeiros, viaturas, ocorrências)
- órgãos sociais

O formulário de contactos ainda não envia emails; precisa de ser ligado a um serviço
(por exemplo Formspree ou Netlify Forms) quando se escolher o alojamento.
