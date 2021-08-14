const items = document.querySelector('.items'); // criando variavel para selecionar a classe 'items' do html

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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
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
// requisito 1
async function getProducts(QUERY) { // query eh tipo 'o item sendo buscado'
  const products = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`); // pegando o json do produto
  const productsJSON = await products.json();
  productsJSON.results.forEach((product) => { // loop para cada produto 
    items.appendChild(createProductItemElement(product)); // acessando o items e adicinando elementos 'product'/ Products eh o array de 'results';
  });
}

window.onload = () => {
  getProducts('computador'); // chamando o produto ao carregar a pagina
};