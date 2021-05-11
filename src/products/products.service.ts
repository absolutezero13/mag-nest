import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './products.model';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  insertProduct(title: string, desc: string, price: number) {
    const prodId = Math.random();

    const newProduct = new Product(prodId, title, desc, price);

    this.products.push(newProduct);

    return prodId;
  }

  fetchProducts() {
    return this.products.slice();
  }

  getSingleProduct(productId: number) {
    const [product] = this.findProduct(productId);
    if (!product) {
      throw new NotFoundException('could not find proooduct');
    }
    return { ...product };
  }

  updateProduct(
    productId: number,
    title: string,
    description: string,
    price: number,
  ) {
    const [product, index] = this.findProduct(productId);

    const updatedProduct = { ...product };

    if (title) {
      updatedProduct.title = title;
    }
    if (description) {
      updatedProduct.description = description;
    }

    if (price) {
      updatedProduct.price = price;
    }

    this.products[index] = updatedProduct;
  }

  deleteProduct(prodId: number) {
    const [product, index] = this.findProduct(prodId);

    this.products.splice(index, 1);
  }

  private findProduct(id: number): [Product, number] {
    const productIndex = this.products.findIndex((prod) => prod.id == id);

    const product = this.products[productIndex];
    return [product, productIndex];
  }
}
