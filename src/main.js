import * as d3 from 'd3';
import { Dados } from "./dados.js";

function desenharGraficoDeBarras(dados) {

    const div = d3.select("#grafico-barras").html(""); 
    
    const margem = { topo: 30, direita: 80, base: 40, esquerda: 180 };
    const larguraTotal = 1000;
    const alturaTotal = 400;
    
    const larguraUtil = larguraTotal - margem.esquerda - margem.direita;
    const alturaUtil = alturaTotal - margem.topo - margem.base;

    const tratarNumero = (valor) => Number(String(valor).replace(',', '.'));

    const svg = div.append("svg")
        .attr("width", larguraTotal)
        .attr("height", alturaTotal)
        .style("display", "block")  
        .style("margin", "0 auto")
        .append("g")
        .attr("transform", `translate(${margem.esquerda},${margem.topo})`);

    // Fundo de teste
    const escalaX = d3.scaleLinear()
        .domain([0, d3.max(dados, d => tratarNumero(d.velocidade))]) // Velocidade vai de 0 ao máximo
        .range([0, larguraUtil]);

    const escalaY = d3.scaleBand()
        .domain(dados.map(d => d.modelo_carro)) // Eixo Y recebe os nomes
        .range([0, alturaUtil])
        .padding(0.2);
    
    svg.selectAll("rect")
       .data(dados)
       .enter()
       .append("rect")
       .attr("x", 0)
       .attr("y", d => escalaY(d.modelo_carro))
       .attr("width", d => escalaX(tratarNumero(d.velocidade)))
       .attr("height", escalaY.bandwidth())
       .attr("rx", 6)
       .attr("fill", (d, i) => i === 0 ? "#ef4444" : "#4f46e5");

    svg.selectAll(".label-valor")
       .data(dados)
       .enter()
       .append("text")
       .attr("class", "label-valor")
       .attr("x", d => escalaX(tratarNumero(d.velocidade)) + 8) // Desloca para o final da barra + 8px
       .attr("y", d => escalaY(d.modelo_carro) + escalaY.bandwidth() / 2 + 5) // Centraliza na altura
       .style("font-family", "system-ui, sans-serif")
       .style("font-size", "13px")
       .style("font-weight", "bold")
       .style("fill", "#475569")
       .text(d => `${tratarNumero(d.velocidade)} km/h`);

    svg.append("g").call(d3.axisLeft(escalaY));
    svg.append("g")
        .attr("transform", `translate(0,${alturaUtil})`)
        .call(d3.axisBottom(escalaX));
}

function desenharScatterPlot(dados) {

    const div = d3.select("#grafico-scatter").html(""); 
    
    const margem = { topo: 30, direita: 250, base: 40, esquerda: 100 };
    const larguraTotal = 1000;
    const alturaTotal = 400;
    
    const larguraUtil = larguraTotal - margem.esquerda - margem.direita;
    const alturaUtil = alturaTotal - margem.topo - margem.base;

    const preco_min = d3.min(dados, d => Number(String(d.preco).replace(',', '.')));
    const preco_max = d3.max(dados, d => Number(String(d.preco).replace(',', '.')));
    const velocidade_min = d3.min(dados, d => Number(String(d.velocidade).replace(',', '.')));
    const velocidade_max = d3.max(dados, d => Number(String(d.velocidade).replace(',', '.')));


    const tratarNumero = (valor) => Number(String(valor).replace(',', '.'));

    const svg = div.append("svg")
        .attr("width", larguraTotal)
        .attr("height", alturaTotal)
        .style("display", "block")  
        .style("margin", "0 auto")
        .append("g")
        .attr("transform", `translate(${margem.esquerda},${margem.topo})`);

    const escalaX = d3.scaleLinear()
        .domain([preco_min * 0.9, d3.max(dados, d => tratarNumero(d.preco) * 1.1)])
        .range([0, larguraUtil]);

    const escalaY = d3.scaleLinear()
        .domain([velocidade_min * 0.9, d3.max(dados, d => tratarNumero(d.velocidade) * 1.1)])
        .range([alturaUtil, 0]);

    //escala que gera cores diferentes para cada modelo de carro
    const escalaCores = d3.scaleOrdinal(d3.schemeTableau10)
        .domain(dados.map(d => d.modelo_carro));

    svg.append("g")
        .call(d3.axisLeft(escalaY).tickSize(-larguraUtil).tickFormat(""))
        .call(g => g.select(".domain").remove())
        .selectAll(".tick line")
        .attr("stroke", "#272727")
        .attr("stroke-dasharray", "4,4");

    svg.append("g")
        .attr("transform", `translate(0,${alturaUtil})`)
        .call(d3.axisBottom(escalaX).tickSize(-alturaUtil).tickFormat(""))
        .call(g => g.select(".domain").remove())
        .selectAll(".tick line")
        .attr("stroke", "#272727")
        .attr("stroke-dasharray", "4,4");

    svg.selectAll("circle")
       .data(dados)
       .enter()
       .append("circle")
       .attr("cx", d => escalaX(tratarNumero(d.preco)))
       .attr("cy", d => escalaY(tratarNumero(d.velocidade)))
       .attr("r", 6)
       .attr("fill", d => escalaCores(d.modelo_carro));
    
    const legenda = svg.append("g")
        .attr("transform", `translate(${larguraUtil + 30}, 20)`); 

    const itensLegenda = legenda.selectAll(".item")
        .data(dados)
        .enter()
        .append("g")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`); // Desce 20px a cada novo carro

    itensLegenda.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 5)
        .attr("fill", d => escalaCores(d.modelo_carro));

    itensLegenda.append("text")
        .attr("x", 10)
        .attr("y", 4)
        .text((d, i) => `${i + 1}º - ${d.modelo_carro}`)
        .style("font-family", "sans-serif")
        .style("font-size", "12px")
        .style("fill", "#272727");
    

    svg.append("text")
        .attr("x", 0)
        .attr("y", -10) 
        .attr("text-anchor", "middle") 
        .style("font-family", "sans-serif")
        .style("font-size", "12px")
        .style("font-style", "italic")
        .style("fill", "#272727")
        .text("km/h");

    // Unidade do Eixo X (Preço) - Fica na ponta direita, logo abaixo da régua
    svg.append("text")
        .attr("x", larguraUtil + 75) 
        .attr("y", alturaUtil + 5) 
        .attr("text-anchor", "end") 
        .style("font-family", "sans-serif")
        .style("font-size", "12px")
        .style("font-style", "italic")
        .style("fill", "#272727")
        .text("Preço (USD)");

    svg.append("g")
        .call(d3.axisLeft(escalaY));

    svg.append("g")
        .attr("transform", `translate(0,${alturaUtil})`)
        .call(d3.axisBottom(escalaX));
}
async function main() {
    const bd = new Dados();
    await bd.init();

    // Carrega e registra o CSV no DuckDB
    await bd.carregarCsv('The fastest cars.csv', '/The fastest cars.csv');

    const sql = `
        SELECT 
            Car AS carro, 
            "Top Speed (km/h)" AS velocidade, 
            "Price (USD)" AS preco, 
            "Car" AS modelo_carro
        FROM read_csv_auto('The fastest cars.csv', delim=';')
        ORDER BY velocidade DESC
    `;

    const dados = await bd.query(sql);
    console.log("Dados prontos para o D3:", dados);

    desenharGraficoDeBarras(dados);
    desenharScatterPlot(dados);
}

window.onload = async () => {
    await main();
}