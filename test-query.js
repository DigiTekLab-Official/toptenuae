import { client } from './src/sanity/lib/client.js';

async function test() {
  try {
    const data = await client.fetch(`{
      "count": count(*[_type in ["topTenList", "article"]]),
      "featured": count(*[_type in ["topTenList", "article"] && isFeaturedOnHome == true]),
      "firstTen": *[_type in ["topTenList", "article"]][0...3] { _id, title, isFeaturedOnHome }
    }`);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
