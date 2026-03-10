import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { backendInterface } from "../backend";
import { useActor } from "./useActor";

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      category,
      containsAlcohol,
    }: { id: bigint; category: string; containsAlcohol: boolean }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.addProduct(id, category, containsAlcohol);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useVerifyAgeAndCheckout() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      cartItems,
      isAgeVerified,
    }: { cartItems: Array<[bigint, bigint]>; isAgeVerified: boolean }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.verifyAgeAndCheckout(cartItems, isAgeVerified);
    },
  });
}
