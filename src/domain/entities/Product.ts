import { ProductStatus } from '../enums/ProductStatus';
import { Money } from '../value-objects/Money';
import { Stock } from '../value-objects/Stock';

export interface ProductProps {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: Money;
  stock: Stock;
  status: ProductStatus;
  categoryId: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Product {
  private constructor(private readonly props: ProductProps) {}

  static create(props: ProductProps): Product {
    if (props.price.isNegative()) {
      throw new Error('Product price cannot be negative');
    }
    return new Product(props);
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get price(): Money {
    return this.props.price;
  }

  get stock(): Stock {
    return this.props.stock;
  }

  get status(): ProductStatus {
    return this.props.status;
  }

  get categoryId(): string {
    return this.props.categoryId;
  }

  get imageUrl(): string | undefined {
    return this.props.imageUrl;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  isActive(): boolean {
    return this.props.status === ProductStatus.ACTIVE;
  }

  isAvailable(): boolean {
    return this.isActive() && this.props.stock.isInStock();
  }

  decreaseStock(quantity: number): void {
    this.props.stock = this.props.stock.decrease(quantity);
  }

  increaseStock(quantity: number): void {
    this.props.stock = this.props.stock.increase(quantity);
  }

  activate(): void {
    this.props.status = ProductStatus.ACTIVE;
  }

  archive(): void {
    this.props.status = ProductStatus.ARCHIVED;
  }
}
