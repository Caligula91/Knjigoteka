const HTMLParser = require('node-html-parser');
const titleFormater = require('./titleFormater');

const formatPrice = (el) => {
  const arr = el.split(' ');
  arr[0] = arr[0].replace('.', '').replace(',', '.');
  const price = parseFloat(arr[0]);
  return price;
};

exports.parseBooks = (html) => {
  const books = [];
  try {
    const dom = HTMLParser.parse(html);
    const knjigeHolder = dom.querySelectorAll('#knjige-holder');

    knjigeHolder.forEach((item) => {
      const domPrice = item.querySelector('.override-cena');
      if (!domPrice) return;
      const price = formatPrice(
        domPrice.querySelector('#kolicna').innerText.trim()
      );
      const rawTitle = item
        .querySelector('#naslov')
        .querySelector('a')
        .innerText.trim();
      const { title, ilustrated, extended, part, slug } = titleFormater(
        rawTitle
      );
      const author = item
        .querySelector('#pisac')
        .querySelector('a')
        .innerText.trim();
      const domImgUrl = item.querySelector('#naslovna-strana');
      const img = domImgUrl.querySelector('img').getAttribute('src');
      const url = `https://www.korisnaknjiga.com/${domImgUrl
        .querySelector('a')
        .getAttribute('href')}`;
      books.push({
        title,
        author,
        slug,
        img,
        ilustrated,
        extended,
        part,
        source: {
          name: 'Korisna_Knjiga',
          logo: '/img/logo/korisna_knjiga.png',
          onlinePrice: price,
          url,
        },
      });
    });
  } catch (error) {
    console.log('KORISNA_KNJIGA_PARSER', error);
    return [];
  }
  return books;
};