"use server";

import { fetchFromApi } from "@/lib/api-client";
import type { SubscribePushDto } from "@kimito/shared-types";

export async function getVapidPublicKeyAction(): Promise<{
  publicKey: string;
}> {
  return await fetchFromApi<{ publicKey: string }>(
    "/notifications/vapid-public-key",
    {
      cache: "no-store",
    },
  );
}

export async function subscribePushAction(dto: SubscribePushDto) {
  return await fetchFromApi("/notifications/subscribe", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}
