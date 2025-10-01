import { PaginationParams, PaginatedResult } from "./IRepository";

export { PaginationParams, PaginatedResult };

export interface IService<T, CreateInput, UpdateInput> {
  findAll(params?: PaginationParams): Promise<PaginatedResult<T>>;
  findById(id: number): Promise<T>;
  create(data: CreateInput): Promise<T>;
  update(id: number, data: UpdateInput): Promise<T>;
  delete(id: number): Promise<void>;
}

export interface IBusinessService<T, CreateInput, UpdateInput>
  extends IService<T, CreateInput, UpdateInput> {
  validateBusinessRules(data: CreateInput | UpdateInput): Promise<void>;
  executeBusinessLogic(data: T): Promise<T>;
}
