import { useMutation, useQuery } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export function useCreateOrder() {
  return useMutation(orpc.orders.create.mutationOptions());
}

export function useOrder(number: string) {
  return useQuery(orpc.orders.get.queryOptions({ input: { number } }));
}
