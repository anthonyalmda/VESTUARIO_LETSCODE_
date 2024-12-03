import express, { query } from 'express';
import cors from 'cors';
import pg from 'pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: "./.env.production" });

const app = express();
app.use(express.json());
app.use(cors());

const { Pool }= pg;


const createPool = () => {
  if (process.env.NODE_ENV === "production") {
    return new Pool({
      connectionString: process.env.DB_URL,
      ssl: { rejectUnauthorized: false },
    });
  } else {
    return new Pool({
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      host: process.env.DB_URL,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT,
    });
  }
};
const pool = createPool()
const testarConexao = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Conexão bem-sucedida", res.rows[0]);
  } catch (err) {
    console.error("error ao conectar com banco de dados", err);
  }
};

testarConexao();

async function tabela () {
const resposta = await pool.query(
  `CREATE TABLE produtos_vestuario_anthony ( id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  quantidade_em_estoque INT NOT NULL,
  categoria VARCHAR(50),
  fornecedor VARCHAR(100),
  url_imagem TEXT );`
)
console.log("TABELA CRIADA", resposta.rows[0]);
  
}
//tabela();

async function selecionar_tabela() {
  const resposta = await pool.query(`SELECT * FROM produtos_vestuario_anthony`
  )
  console.log("TABELA SELECIONADA", resposta.rows);
  
}
selecionar_tabela();






app.post('/postVestuario', async (req, res) => {
  try {
    const {       
      nome,
      descricao,
      preco,
      quantidadeEmEstoque,
      categoria,
      fornecedor,
      urlImagem 
    } = req.body;

    const vestuario = await pool.query(
      "INSERT INTO produtos_vestuario_anthony (nome, descricao, preco, quantidade_em_estoque, categoria, fornecedor, url_imagem) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [nome, descricao, preco, quantidadeEmEstoque, categoria, fornecedor, urlImagem]
    );
    res.status(200).json(vestuario.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/getTudo', async (req, res) => {
  try {
    const vestuario = await pool.query( 
      "SELECT * FROM produtos_vestuario_anthony ORDER BY id"
    );
    console.log(vestuario.rows)
    res.status(200).json(vestuario.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/apagar', async (req, res) => {
  try {
    const { id }= req.body;
    const deletar = await pool.query( 
      "DELETE FROM produtos_vestuario_anthony WHERE id=$1 RETURNING *",
      [id]
    );
    res.status(200).json(deletar);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/vestuario/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { nome, descricao, preco, quantidade_em_estoque, 
      fornecedor, url_imagem } = req.body

    const updProduto = await pool.query(
      `UPDATE produtos_vestuario_anthony SET
      nome = $1, descricao = $2, preco = $3,
      quantidade_em_estoque = $4, fornecedor = $5, url_imagem = $6
      WHERE id=$7 RETURNING *`,
      [nome, descricao, preco, quantidade_em_estoque, fornecedor, url_imagem, id]
    )
    if (updProduto.rows === 0) {
      res.status(404).json({ message: "Produto não encontrado" })
    }
    res.status(200).json(updProduto.rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
});

const port = 32450;
app.listen(port, () => {
  console.log("O server está funcionando!");
});