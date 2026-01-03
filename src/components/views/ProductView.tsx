
import ProductTemplate from "@/components/templates/ProductTemplate";

interface ProductViewProps {
  data: any;
}

export default function ProductView({ data }: ProductViewProps) {
  // Logic to unify Deals and Products
  const displayPrice = data._type === 'deal' ? data.dealPrice : data.price;
  const displayAffiliate = data._type === 'deal' ? (data.affiliateLink || data.linkedProduct?.affiliateLink) : data.affiliateLink;
  const displayTitle = data.title || data.linkedProduct?.title;

  const normalizedData = { 
    ...data, 
    title: displayTitle, 
    price: displayPrice, 
    affiliateLink: displayAffiliate 
  };

  return <ProductTemplate data={normalizedData} />;
}