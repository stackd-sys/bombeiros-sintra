# Bombeiros Voluntários de Sintra — site corporativo

Site estático em HTML, CSS e JavaScript simples, sem dependências nem passo de build.

## Páginas

- `index.html` — Início
- `sobre.html` — A Associação (história, distinções, órgãos sociais)
- `servicos.html` — Serviços e frota
- `socios.html` — Sócios (quota, direitos, perguntas frequentes)
- `noticias.html` — Notícias (exemplos + página do Facebook)
- `contactos.html` — Contactos, formulário e mapa

## Estrutura

```
assets/css/style.css   estilos (cores e tipos de letra em :root)
assets/js/main.js      menu móvel, animações, filtro de notícias, formulário
assets/img/            logótipo oficial e fotos (retiradas de abvsintra.pt)
```

## Ver localmente

Abrir `index.html` no browser, ou servir a pasta:

```
python3 -m http.server 8000
```

## Conteúdo

Textos, contactos, órgãos sociais, distinções e fotos vêm do site oficial abvsintra.pt.
O que ainda é exemplo está marcado com a etiqueta amarela **PROVISÓRIO** (`class="placeholder-tag"`):
as notícias da página inicial e o envio do formulário de contactos, que ainda precisa de ser ligado
a um serviço (por exemplo Formspree) quando se escolher o alojamento.
