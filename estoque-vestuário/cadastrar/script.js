form = document.getElementById('formulario');
nomeProduto = document.getElementById('nomeProduto');
urlImagem = document.getElementById('urlImagem');
descricao = document.getElementById('descricao');
fornecedor = document.getElementById('fornecedor');
quantEstoque = document.getElementById('quantEstoque');
preco = document.getElementById('preco');

botaoCadastrar = document.getElementById('botaoCadastrar');

imagem = document.getElementById('imagem');
fraseImagem = document.getElementById('fraseImagem');


urlImagem.addEventListener('change', () => {
  console.log(urlImagem.value)
  if (urlImagem.value != '') {
    fraseImagem.style.display = 'none';
    imagem.style.background = `url(${urlImagem.value})`;
    imagem.style.backgroundRepeat = 'no-repeat';
    imagem.style.backgroundSize = 'contain';
    imagem.style.backgroundPosition = 'center';
  } else {
    fraseImagem.style.display = 'block';
    imagem.style.background = 'none';
  }
});

async function fazerFetch(site, metodo, produto) {
  const url = 'http://localhost:32450';
  try {
    const response = await fetch(`${url}/${site}`, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(produto),
    });
    
    const data = await response.json();
    form.reset();
    fraseImagem.style.display = 'block';
    imagem.style.background = 'none';
    return data;
  } catch (err) {
    console.error(err);
  }
}

function getInputs() {
  const valorPreco = parseFloat(preco.value);
  const valorQuantEstoque = parseInt(quantEstoque.value);

  const produto = [
    nomeProduto.value,
    descricao.value,
    valorPreco,
    valorQuantEstoque,
    fornecedor.value,
    urlImagem.value
  ];
console.log(produto);
  let verificao = false;
  produto.map((campo) => {
    if (campo == '' ) {
      verificao = true;
    } else if (typeof(campo) == typeof(NaN)) {
      verificao = isNaN(campo) ? true : verificao; 
    }
  });
  
  if (verificao) {
    alert('Existem campos vazios ou incorretos!');
    return 0;
  } else {
    return {
      nome: produto[0],
      descricao: produto[1],
      preco: produto[2],
      quantidadeEmEstoque: produto[3],
      categoria: 'vestuario',
      fornecedor: produto[4],
      urlImagem: produto[5]
    };
  }
}

botaoCadastrar.addEventListener('click', () => {
  const produto = getInputs();
  console.log(produto);
  if (produto === 0) {
    alert('Produto NÃO cadastrado!');
    return 0;
  } else {
    const data = fazerFetch('postVestuario', 'POST', produto);
  }
});

const voltar = document.getElementById('voltar');
voltar.addEventListener('click', () => {
  window.location.href = '../index.html';
});