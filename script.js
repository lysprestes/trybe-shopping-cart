let items; // criando variavel global para selecionar a classe 'items' do html
const URL = 'https://api.mercadolibre.com/'; // URL base do API

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

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove(); // remove o item do dom
}

function createCartItemElement({
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
  document.querySelector('.cart__items').appendChild(createCartItemElement(productJson)); //
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
  const products = await fetch(`${URL}sites/MLB/search?q=${QUERY}`); // pegando o json do produto
  const productsJSON = await products.json();
  productsJSON.results.forEach((product) => { // loop para cada produto 
    items.appendChild(createProductItemElement(product)); // acessando o items e adicinando .elementos 'product'/ Products eh o array de 'results';
  });
}

window.onload = async () => { // o window.onload soh eh carregado quando o documento estiver carregado
  items = document.querySelector('.items'); // todos os elementos ja estarao renderizados quando o documento estiver carregado
  await getProducts('computador'); // chamando o produto ao carregar a pagina/ await para esperar ate estar carregado para poder pegar os botoes
};