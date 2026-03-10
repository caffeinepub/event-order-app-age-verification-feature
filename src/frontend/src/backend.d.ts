import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface backendInterface {
    _initializeAccessControlWithSecret(secret: string): Promise<void>;
    addProduct(id: bigint, category: string, containsAlcohol: boolean): Promise<void>;
    verifyAgeAndCheckout(cartItems: Array<[bigint, bigint]>, isAgeVerified: boolean): Promise<void>;
}
