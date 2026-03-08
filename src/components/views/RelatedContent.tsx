interface RelatedProps {
  lists: any[];
  products: any[];
}

export default function RelatedContent({ lists, products }: RelatedProps) {
  if (!lists?.length && !products?.length) return null;

  return (
    <section className="py-12 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4">
        
        {/* RELATED LISTS */}
        {lists?.length > 0 && (
          <div className="mb-10">
            <h3 className="text-2xl font-bold font-geist mb-6">More Buying Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {lists.map((item) => (
                <a key={item.slug} href={`/reviews/${item.slug}`} className="group">
                  <div className="relative aspect-video mb-3 overflow-hidden rounded-lg">
                    {item.mainImage && (
                      <img 
                        src={item.mainImage.asset.url} 
                        alt=""
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <h4 className="font-semibold group-hover:text-blue-600">{item.title}</h4>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* TOP RATED PRODUCTS */}
        {products?.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold font-geist mb-6">Top Rated in this Category</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((product) => (
                <a key={product.slug} href={`/products/${product.slug}`} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition">
                  <div className="relative aspect-square mb-3">
                    {product.mainImage && (
                       <img 
                         src={product.mainImage.asset.url} 
                         alt=""
                         className="w-full h-full object-contain"
                         loading="lazy"
                       />
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{product.brand}</div>
                  <div className="font-medium text-gray-900 truncate">{product.title}</div>
                  <div className="text-blue-600 font-bold mt-1">
                    {product.currency} {product.price}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}