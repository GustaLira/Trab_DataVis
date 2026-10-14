import { loadDb } from './config';

export class Dados {
    async init() {
        // Inicializa o DuckDB 
        this.db = await loadDb();
        this.conn = await this.db.connect();
    }

    async carregarCsv(nomeNoBanco, caminhoUrl) {
        const resposta = await fetch(caminhoUrl);
        const texto = await resposta.text();
        await this.db.registerFileText(nomeNoBanco, texto);
    }

    async query(sql) {
        if (!this.db || !this.conn)
            throw new Error('Database não inicializado. Chame init() antes de executar consultas.');

        let result = await this.conn.query(sql);
        let dados_limpos = result.toArray().map(row => row.toJSON());
        return dados_limpos;
    }
}