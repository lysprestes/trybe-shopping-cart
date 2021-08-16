let items; // criando variavel global para selecionar a classe 'items' do html
let cartItems; // criando variavel global para selecionar a classe 'cart__items' do html
const URL = 'https://api.mercadolibre.com/'; // URL base do API, facilitando o uso da URL

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// criando um objeto com as funcoes de local storage. A partir de agora, precisa apenas chamar o objeto e chave ao inves de chamar a funcao.
const cart = {
  store: () => { // funcao para salvar o carrinho
    localStorage.setItem('saved', cartItems.innerHTML);
  },
  read: () => { // funcao para ler o carrinho
    cartItems.innerHTML = localStorage.getItem('saved');
  },
  empty: () => { // funcao para limpar o carrinho
    cartItems.innerHTML = null;
    localStorage.removeItem('saved');
  },
};

// // funcoes de local storage: (essas funcoes foram movidas para o objeto cart acima)
// const storeCart = () => {
//   localStorage.setItem('saved', document.querySelector('.cart__items').innerHTML);
// };

// const readCart = () => {
//   document.querySelector('.cart__items').innerHTML = localStorage.getItem('saved');
// };

// const emptyCart = () => {
//   document.querySelector('.cart__items').innerHTML = null;
//   localStorage.removeItem('saved');
// };

function emptyCartItems() { // funcao para limpar o carrinho completamente pelo botao .empty-cart
  document.querySelector('.empty-cart').addEventListener('click', () => {
    cartItems.innerHTML = null; // ao clicar, reatribui o valor da variavel cartItems para null, fazendo com q o carrinho fique vazio
  });
}
// adiciona o eventListener para o botao de limpar o cart

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove(); // remove o item do dom
  cart.store(); // salva o carrinho
}

function createCartItemElement({ // adicionando chaves ao objeto
  id: sku,
  title: name,
  price: salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// requisito 2 (sku - stock keeping unit)
async function addToCart(event) {
  const sku = getSkuFromProductItem(event.target.parentNode); // armazenando o sku do item cujo botao add for clicado
  const product = await fetch(`${URL}items/${sku}`); // esse await esta esperando a resposta do produto
  const productJson = await product.json(); // essa linha precisa ser executada apos a resposta do produto
  document.querySelector('.cart__items').appendChild(createCartItemElement(productJson)); // criando um filho de '.cart__items' que sera o Json do produto
  cart.store(); // salva o carrinho
}

function createProductItemElement({
  id: sku,
  title: name,
  thumbnail: image,
}) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));

  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'); // criando o elemento ja com o botao

  button.addEventListener('click', addToCart); // chamando o evento addToCart apos o clique do botao 

  section.appendChild(button);
  return section;
}

// requisito 1
async function getProducts(QUERY) { // query eh tipo 'o item sendo buscado'
  items.innerHTML = '<p class="loading">loading</p>'; // criando um elemento para mostrar que esta carregando
  const products = await fetch(`${URL}sites/MLB/search?q=${QUERY}`); // pegando o json do produto
  const productsJSON = await products.json();
  items.innerHTML = null; // limpa o elemento
  productsJSON.results.forEach((product) => { // loop para cada produto 
    items.appendChild(createProductItemElement(product)); // acessando o items e adicinando .elementos 'product'/ Products eh o array de 'results';
  });
}

window.onload = async () => { // o window.onload soh eh carregado quando o documento estiver carregado
  items = document.querySelector('.items'); // todos os elementos ja estarao renderizados quando o documento estiver carregado
  cartItems = document.querySelector('.cart__items');
  await getProducts('computador'); // chamando o produto ao carregar a pagina/ await para esperar ate estar carregado para poder pegar os botoes
  cart.read(); // lendo o carrinho
  document.querySelectorAll('.cart__item').forEach((item) => { // para cada elemento do cart esta sendo adicionado um eventListener
    item.addEventListener('click', cartItemClickListener); // nao pude colocar esta funcao dentro do cart.read por conflito com lint
  });
  emptyCartItems(); // chamando a funcao de limpar o carrinho
};

/*
Para a resolucao deste projeto, utilizei o seguinte passo-a-passo:
### 1. Crie uma listagem de produtos
- inicialmente criei uma let item vazia no inicio do documento
- criei uma funcao async para pegar os produtos atraves do fetch URL e tranasforma-los em json.
- transformei a url em uma variavel para facilitar a manipulação em outras partes do codigo.
- o loop forEach esta acessando cada item e adicionando .elementos 'product'. 
- acessando o elemento items e adicionando child elements a eles.
- neste appendChild, chama-se entao a funcao createProductItemElement com o product como parametro
- o products eh o array de 'results';
- o items esta sendo declarado na funcao de window.onload, selecionando pela classe '.items'
- a funcao window.onload foi transformada em async para que o documento seja carregado antes de ser executada a funcao.

### 2. Adicione o produto ao carrinho de compras
- criei uma funcao async para adicionar o produto ao carrinho de compras.
- foi declarada a const sku e dentro dela chamada-se a funcao getSkuFromProductItem
- a funcao getSkuFromProductItem esta acessando o elemento que foi clicado e retornando o sku do produto.
- neste caso, o elemento que foi clicado esta sendo o parentNode do elemento que esta sendo adicionado ao carrinho.
- o product esta sendo declarado como uma cosntante e sendo acessado a partir da URL
- o productJson esta pegando o product e transformando em json.
- seleciona o .cart__intems com o querySelector e adiciona um elemento filho a ele, que sera o productJson.
- o cartItems esta sendo declarado na funcao de window.onload, selecionando pela classe '.cart__items', para que seja carregado antes de a funcao ser executada.

### 4. Carregue o carrinho de compras através do **LocalStorage** ao iniciar a página
- inicialmente tinha sido declarado a funcao como uma const e com o localStorage. setItem(key = "saved" que eh a chave para os itens salvos, value = acessando o .cart__items atraves do querySelector) e salvando o innerHTML do elemento.
- esta funcao esta sendo chamada na funcao window.onload
- com o localStorage foi dado um removeItem para remover os itens "saved"
- inicialmente eu havia criado uma funcao para limpar o carrinho de compras como uma const
- como haviam mais funcoes com localStorage, decidi adiciona-las a um objeto
- sendo assim, a partir de agora, estas funcoes podem ser envocadas com "objeto.chave" em qualquer lugar do codigo.
- em conjunto com o requisito 3 e 4, resolvi colocar estas funcoes values de chaves em um objeto. 
- neste objeto estao as segundas funcoes:
  - **removeItem**: remove o item do localStorage
  - **clear**: limpa todos os itens do localStorage
  - **read**: lê todos os itens do localStorage
- estas funcoes a partir de agora podem ser acessadas como objeto.chave em qualquer local do codigo e diversas vezes.

### 3. Remova o item do carrinho de compras ao clicar nele
- na funcao cartItemClickListener, estou pegando o target e removendo com remove()
- apos isso, a funcao-obj cart.store() eh chamada para atualizar o carrinho de compras sem o item removido.

### 6. Crie um botão para limpar carrinho de compras
- criei uma funcao emptyCartItems onde acessa o botao .empty-cart e adiciona um eventListener
- quando clicado no botao o cartItems atualiza o valor pra null

### 7. Adicione um texto de "loading" durante uma requisição à API
- criei uma funcao async para adicionar atraves do uso de innerHTMl um paragrafo com a classe e texto "loading" antes do fetch da URL
- apos a requisição ser feita, este elemento innerHTML tem seu valor atualizado para null.
*/
