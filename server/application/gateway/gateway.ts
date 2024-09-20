

export interface Gateway<T> {
    save(object: T): Promise<T>;
    update(object: T): Promise<T>;
    delete(object: T): Promise<void>;
}
