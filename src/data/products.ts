// Tipo de um produto e dados fictícios (ainda sem banco de dados).
export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
};

// Uma entrada ou saída de estoque. O formato é o mesmo já salvo no navegador.
export type Movement = {
  id: string;
  productId: string;
  productName: string;
  type: "entrada" | "saida";
  quantity: number;
  note: string;
  createdAt: string; // data/hora em formato ISO
};

// Abaixo (ou igual) a este valor o produto é considerado com estoque baixo.
export const LOW_STOCK_LIMIT = 5;

export const initialProducts: Product[] = [
  { id: "1", name: "Café em grãos 1kg", category: "Alimentos", price: 59.9, quantity: 24 },
  { id: "2", name: "Caneca de cerâmica", category: "Utensílios", price: 34.5, quantity: 3 },
  { id: "3", name: "Filtro de papel 103", category: "Acessórios", price: 8.9, quantity: 60 },
  { id: "4", name: "Chá verde 50g", category: "Alimentos", price: 19.0, quantity: 0 },
  { id: "5", name: "Moedor manual", category: "Utensílios", price: 149.0, quantity: 7 },
];

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
