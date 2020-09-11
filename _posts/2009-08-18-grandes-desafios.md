---
layout: post
title: Grandes desafios
tags: [furb, googlecodejam, icpc, programming, spoj, uva]
---

Inicio hoje este blog para falar de um passatempo que vem tomando boa parte do meu tempo livre nas últimas semanas, e que provavelmente tomará boa parte do meu tempo futuro :)
Como desenvolvedor, duas coisas que sempre muito me facinaram foram a resolução de problemas, e o estudo de assuntos variados (algoritmos, técnicas, teorias), e as competições de programação conseguem juntar essas duas coisas de maneira brilhante (!).

Hoje consegui resolver um dos problemas mais "cabulosos" pelos quais já me defrontei nessa vida de competidor: SET. Esse probleminha, apesar do nome simples (a lógica de resolução também é relativamente simples, o que pega mesmonesse problema é a performance para chegar ao resultado ótimo), me demandou umas duas semanas de esforço (e uma ajudinha do professor Claudio Loesch, aliás, obrigado por ter respondido o e-mail do Jean, sem a sua ajuda não sei se teria conseguido resolver esse problema tão "rápido"), tentei Brute Force, um pouco de Backtracking para explorar todas as possibilidades de resolução do problema, mas tudo me gerava um retorno de tempo limite excedido, foram diversas tentativas de otimização, desde otimizar a leitura/escrita do algoritmo, e principalmente otimizar a lógica de resolução do problema, precisei utilizar inclusive uma pequena 'heurística' para obter o resultado esperado. O mais interessante é que o resultado que obtive, além de muito performático (comparado aos outros algoritmos), foi feito em Java, diferentemente da grandiosa maioria, feita em C ou C++, que geralmente é 5 vezes mais rápido, inclusive, alguns algoritmos C rodaram 5 vezes 'menos rápido' que o meu em Java:)

Abaixo seguem as "provas" desta façanha, os algoritmos foram submetidos ao UVa Online e ao br.SPOJ:


![Minha submissão em terceiro lugar no ranking UVa]({{ site.baseurl }}/images/posts/uva-set-rank.jpg)

![Minha submissão em segundo lugar no ranking spoj.br]({{ site.baseurl }}/images/posts/spoj-set-rank.jpg)

Recomendo que todo programador/desenvolvedor participe desse tipo de competição para aguçar suas habilidades e se forçar a pensar um pouco em novos caminhos...

Para quem quer iniciar ou quer dicas de sites, posso recomendar alguns links: o SPOJ (br.spoj.pl), da segunda imagem acima, é um juiz online nacional derivado de um site internacional, o interessante dele é que permite desenvolver desde linguagens de alto nível como Java e C#, passando por linguagens conhecidas como C, C++, Pascal, Perl, Assembly (!), e até mesmo linguagens mais undergrounds como Brainfuck por exemplo; o UVa Online (uva.onlinejudge.org), da primeira imagem deste post, é o meu favorito, é em inglês, mas tem pessoas do mundo todo participando, e tem um conjunto enorme de problemas a serem resolvidos, inclusive o de todas as finais mundias do ICPC (International Collegiate Programming Contest), porém só permite resolver os problemas em C, C++, Java e Pascal. E por fim, temos o Google Code Jam (code.google.com/codejam), concurso exclusivo do Google, que vem ocorrendo aproximadamente uma vez por ano, e após a ocorrência das etapas, todos os problemas ficam disponíveis para serem resolvidos por quem quiser, e na linguagem que desejar :)

Por hoje é isso... durante a semana continuarei estudando (no tempo livre), visando principalmente a eliminatória interna da FURB para o ICPC; e seguinte, o Google CodeJam, que inicia no dia dois próximo. Me deseje sorte.