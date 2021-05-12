import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './products.model';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async insertProduct(title: string, desc: string, price: number) {
    const newProduct = new this.productModel({
      title,
      description: desc,
      price,
    });

    const result = await newProduct.save();

    return result.id as string;
  }

  async fetchProducts() {
    const products = await this.productModel.find();

    return products;
  }

  async getSingleProduct(productId: string) {
    let product;
    try {
      product = await this.findProduct(productId);
    } catch (err) {
      if (!product) throw new NotFoundException('could not find proooduct');
    }

    return product;
  }

  async updateProduct(
    productId: string,
    title: string,
    description: string,
    price: number,
  ) {
    const updatedProduct = await this.findProduct(productId);

    if (title) {
      updatedProduct.title = title;
    }
    if (description) {
      updatedProduct.description = description;
    }

    if (price) {
      updatedProduct.price = price;
    }

    updatedProduct.save();
  }

  async deleteProduct(prodId: string) {
    await this.productModel.findByIdAndDelete(prodId);
  }

  private async findProduct(id: string) {
    const product = await this.productModel.findById(id);

    return product;
  }
}
